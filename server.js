const http = require("http");
const https = require("https");
const querystring = require("querystring");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawn } = require("child_process");

const CLIENT_ID = process.env.SENTINEL_HUB_CLIENT_ID || "89499d2c-67f4-4f57-86c0-cdef0ece217e";
const CLIENT_SECRET = process.env.SENTINEL_HUB_CLIENT_SECRET || "lVjg5KL43HXjNMQiRll1IruOXlvG3KqM";
const PLANET_API_KEY = process.env.PLANET_API_KEY || "PLAKd9faf25449294d9d86096fe33d980662";
const PRISMA_API_BASE_URL = (process.env.PRISMA_API_BASE_URL || "https://prisma.procalculo.com").replace(/\/+$/, "");
const PRISMA_USERNAME = process.env.PRISMA_USERNAME || "karens_diaz";
const PRISMA_PASSWORD = process.env.PRISMA_PASSWORD || "Ig4c.2026";
const PORT = Number(process.env.PORT) || 3000;
const ORTHO_JOB_ROOT = path.resolve(process.env.ORTHO_JOB_ROOT || path.join(__dirname, "ortho-download-jobs"));
const GDALBUILDVRT_PATH = process.env.GDALBUILDVRT_PATH || "gdalbuildvrt";
const GDAL_TRANSLATE_PATH = process.env.GDAL_TRANSLATE_PATH || "gdal_translate";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "*")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const ALLOWED_PRISMA_PROXY_PATHS = [/^\/dl\/[a-zA-Z0-9/_-]*\/?$/, /^\/analytics\/[a-zA-Z0-9/_-]*\/?$/];

let sentinelHubTokenCache = null;
let sentinelHubTokenExpiresAt = 0;
let sentinelHubTokenRequest = null;
let prismaTokenCache = null;
let prismaTokenExpiresAt = 0;
let prismaTokenRequest = null;
const orthoDownloadJobs = new Map();
let gdalAvailabilityPromise = null;

const ORTHO_DOWNLOAD_EVALSCRIPT = `//VERSION=3
function setup() {
  return { input: [{ bands: ["red", "green", "blue", "dataMask"], units: "DN" }], output: { bands: 4, sampleType: "UINT8" } };
}
function evaluatePixel(sample) {
  return [sample.red, sample.green, sample.blue, sample.dataMask * 255];
}`;

function getCorsOrigin(requestOrigin) {
  if (ALLOWED_ORIGINS.includes("*")) return requestOrigin || "*";
  if (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)) return requestOrigin;
  return ALLOWED_ORIGINS[0] || "*";
}

function sendJson(res, statusCode, origin, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": origin,
  });
  res.end(JSON.stringify(payload));
}

function parseJsonBody(requestBody) {
  return requestBody ? JSON.parse(requestBody) : {};
}

function shouldRetryStatus(statusCode) {
  return statusCode === 429 || (statusCode >= 500 && statusCode <= 599);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requestBuffer(url, options, body, label = "Upstream request", timeoutMs = 60000) {
  return new Promise((resolve, reject) => {
    const upstreamReq = https.request(url, options, (upstreamRes) => {
      const chunks = [];
      upstreamRes.on("data", (chunk) => chunks.push(chunk));
      upstreamRes.on("end", () => {
        resolve({
          statusCode: upstreamRes.statusCode || 500,
          headers: upstreamRes.headers,
          body: Buffer.concat(chunks),
        });
      });
    });

    upstreamReq.on("error", reject);
    upstreamReq.setTimeout(timeoutMs, () => {
      upstreamReq.destroy(new Error(`${label} timed out`));
    });

    if (body) {
      upstreamReq.write(body);
    }
    upstreamReq.end();
  });
}

function readRequestBody(req) {
  return new Promise((resolve) => {
    let requestBody = "";
    req.on("data", (chunk) => {
      requestBody += chunk;
    });
    req.on("end", () => resolve(requestBody));
  });
}

function isAllowedPrismaProxyPath(pathname) {
  return ALLOWED_PRISMA_PROXY_PATHS.some((pattern) => pattern.test(pathname));
}

async function requestBufferWithRetry(url, options, body, label, maxAttempts = 3, timeoutMs = 60000) {
  let lastError = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await requestBuffer(url, options, body, label, timeoutMs);
      if (!shouldRetryStatus(response.statusCode) || attempt === maxAttempts) {
        return response;
      }
      console.warn(`[PROXY] ${label} returned ${response.statusCode}; retrying ${attempt}/${maxAttempts}`);
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) {
        throw error;
      }
      console.warn(`[PROXY] ${label} failed: ${error.message}; retrying ${attempt}/${maxAttempts}`);
    }
    await wait(250 * attempt);
  }
  throw lastError || new Error(`${label} failed`);
}

async function getSentinelHubToken() {
  const now = Date.now();
  if (sentinelHubTokenCache && now < sentinelHubTokenExpiresAt) {
    return sentinelHubTokenCache;
  }

  if (sentinelHubTokenRequest) {
    return sentinelHubTokenRequest;
  }

  sentinelHubTokenRequest = (async () => {
    const tokenBody = querystring.stringify({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    const tokenResponse = await requestBufferWithRetry(
      "https://services.sentinel-hub.com/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(tokenBody),
        },
      },
      tokenBody,
      "Token request",
      1,
      20000
    );

    if (tokenResponse.statusCode !== 200) {
      throw new Error(`Token request failed with status ${tokenResponse.statusCode}: ${tokenResponse.body.toString("utf8")}`);
    }

    const tokenPayload = JSON.parse(tokenResponse.body.toString("utf8"));
    if (!tokenPayload.access_token) {
      throw new Error("Access token missing");
    }

    sentinelHubTokenCache = tokenPayload.access_token;
    const expiresIn = Number(tokenPayload.expires_in) || 300;
    sentinelHubTokenExpiresAt = Date.now() + Math.max(expiresIn - 60, 60) * 1000;
    return sentinelHubTokenCache;
  })().finally(() => {
    sentinelHubTokenRequest = null;
  });

  return sentinelHubTokenRequest;
}

function parseJwtExpiration(token) {
  try {
    const parts = String(token || "").split(".");
    if (parts.length < 2) return 0;
    const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
    return payload && payload.exp ? Number(payload.exp) * 1000 : 0;
  } catch (error) {
    return 0;
  }
}

async function getPrismaToken() {
  const now = Date.now();
  if (prismaTokenCache && now < prismaTokenExpiresAt) {
    return prismaTokenCache;
  }

  if (prismaTokenRequest) {
    return prismaTokenRequest;
  }

  if (!PRISMA_USERNAME || !PRISMA_PASSWORD) {
    throw new Error("PRISMA_USERNAME and PRISMA_PASSWORD are required");
  }

  prismaTokenRequest = (async () => {
    const bodyString = JSON.stringify({
      username: PRISMA_USERNAME,
      password: PRISMA_PASSWORD,
    });

    const tokenResponse = await requestBufferWithRetry(
      PRISMA_API_BASE_URL + "/api/token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(bodyString),
          Accept: "application/json",
        },
        rejectUnauthorized: false,
      },
      bodyString,
      "Prisma token request",
      2
    );

    if (tokenResponse.statusCode !== 200) {
      throw new Error(`Prisma token request failed with status ${tokenResponse.statusCode}: ${tokenResponse.body.toString("utf8")}`);
    }

    const tokenPayload = JSON.parse(tokenResponse.body.toString("utf8"));
    if (!tokenPayload.access) {
      throw new Error("Prisma access token missing");
    }

    prismaTokenCache = tokenPayload.access;
    const tokenExp = parseJwtExpiration(tokenPayload.access);
    prismaTokenExpiresAt = tokenExp > Date.now()
      ? Math.max(tokenExp - 60000, Date.now() + 60000)
      : Date.now() + 4 * 60 * 1000;
    return prismaTokenCache;
  })().finally(() => {
    prismaTokenRequest = null;
  });

  return prismaTokenRequest;
}

function relayBufferedResponse(res, origin, upstreamResponse, fallbackContentType) {
  const headers = { "Access-Control-Allow-Origin": origin };
  const contentType = upstreamResponse.headers["content-type"] || fallbackContentType;
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  res.writeHead(upstreamResponse.statusCode, headers);
  res.end(upstreamResponse.body);
}

function safeOrthoJobName(value) {
  return String(value || "ortomosaico").replace(/[^a-zA-Z0-9_-]+/g, "_").slice(0, 120) || "ortomosaico";
}

function publicOrthoJob(job) {
  return {
    id: job.id,
    name: job.name,
    status: job.status,
    phase: job.phase,
    progress: job.progress,
    completedTiles: job.completedTiles,
    totalTiles: job.totalTiles,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    error: job.error || null,
    downloadUrl: job.status === "completed" ? `/ortho-download-jobs/${job.id}/file` : null,
  };
}

async function persistOrthoJob(job) {
  job.updatedAt = new Date().toISOString();
  await fs.promises.mkdir(job.directory, { recursive: true });
  await fs.promises.writeFile(path.join(job.directory, "job.json"), JSON.stringify(job, null, 2));
}

async function loadOrthoJob(jobId) {
  if (!/^[0-9a-f-]{36}$/.test(jobId)) return null;
  if (orthoDownloadJobs.has(jobId)) return orthoDownloadJobs.get(jobId);
  try {
    const job = JSON.parse(await fs.promises.readFile(path.join(ORTHO_JOB_ROOT, jobId, "job.json"), "utf8"));
    orthoDownloadJobs.set(jobId, job);
    return job;
  } catch (error) {
    return null;
  }
}

function runGdal(command, args, label) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true });
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", (error) => reject(new Error(`${label}: ${error.message}`)));
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${label} exited with code ${code}: ${stderr.slice(-2000)}`));
    });
  });
}

function ensureGdalAvailable() {
  if (!gdalAvailabilityPromise) {
    gdalAvailabilityPromise = Promise.all([
      runGdal(GDALBUILDVRT_PATH, ["--version"], "gdalbuildvrt"),
      runGdal(GDAL_TRANSLATE_PATH, ["--version"], "gdal_translate"),
    ]).catch((error) => {
      gdalAvailabilityPromise = null;
      throw error;
    });
  }
  return gdalAvailabilityPromise;
}

function createOrthoDownloadTiles(payload) {
  const resolution = Number(payload.resolutionMeters);
  const bbox = payload.bbox.map(Number);
  const maxPixels = 2500;
  const totalWidth = Math.ceil((bbox[2] - bbox[0]) / resolution);
  const totalHeight = Math.ceil((bbox[3] - bbox[1]) / resolution);
  const columns = Math.ceil(totalWidth / maxPixels);
  const rows = Math.ceil(totalHeight / maxPixels);
  const tiles = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const width = Math.min(maxPixels, totalWidth - column * maxPixels);
      const height = Math.min(maxPixels, totalHeight - row * maxPixels);
      const xmin = bbox[0] + column * maxPixels * resolution;
      const ymax = bbox[3] - row * maxPixels * resolution;
      tiles.push({
        row,
        column,
        width,
        height,
        bbox: [xmin, ymax - height * resolution, xmin + width * resolution, ymax],
      });
    }
  }
  return { tiles, totalWidth, totalHeight, columns, rows };
}

async function downloadOrthoJobTile(job, tile, accessToken) {
  const day = job.imageDate;
  const processBody = JSON.stringify({
    input: {
      bounds: { bbox: tile.bbox, properties: { crs: "http://www.opengis.net/def/crs/EPSG/0/3857" } },
      data: [{
        type: "byoc-" + job.collectionId,
        dataFilter: {
          id: job.itemId,
          timeRange: { from: day + "T00:00:00Z", to: day + "T23:59:59Z" },
          mosaickingOrder: "mostRecent",
        },
      }],
    },
    output: {
      width: tile.width,
      height: tile.height,
      responses: [{ identifier: "default", format: { type: "image/tiff" } }],
    },
    evalscript: ORTHO_DOWNLOAD_EVALSCRIPT,
  });
  const response = await requestBufferWithRetry(
    "https://services-uswest2.sentinel-hub.com/api/v1/process",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(processBody),
        Authorization: "Bearer " + accessToken,
        Accept: "image/tiff",
      },
    },
    processBody,
    `Ortho job ${job.id} tile ${tile.row},${tile.column}`,
    3,
    180000
  );
  if (response.statusCode !== 200) {
    throw new Error(`Sentinel Hub returned ${response.statusCode}: ${response.body.toString("utf8").slice(0, 1000)}`);
  }
  const filename = `tile_r${String(tile.row + 1).padStart(3, "0")}_c${String(tile.column + 1).padStart(3, "0")}.tif`;
  await fs.promises.writeFile(path.join(job.tilesDirectory, filename), response.body);
}

async function runOrthoDownloadJob(job) {
  try {
    job.status = "running";
    job.phase = "downloading";
    await persistOrthoJob(job);
    await fs.promises.mkdir(job.tilesDirectory, { recursive: true });
    const accessToken = await getSentinelHubToken();
    let nextTile = 0;
    let failure = null;
    async function worker() {
      while (!failure && nextTile < job.tiles.length) {
        const tile = job.tiles[nextTile++];
        try {
          await downloadOrthoJobTile(job, tile, accessToken);
          job.completedTiles += 1;
          job.progress = Math.floor((job.completedTiles / job.totalTiles) * 85);
          await persistOrthoJob(job);
        } catch (error) {
          failure = error;
        }
      }
    }
    await Promise.all([worker(), worker()]);
    if (failure) throw failure;

    job.phase = "building_vrt";
    job.progress = 88;
    await persistOrthoJob(job);
    const tileFiles = (await fs.promises.readdir(job.tilesDirectory))
      .filter((name) => name.toLowerCase().endsWith(".tif"))
      .sort()
      .map((name) => path.join(job.tilesDirectory, name));
    const listPath = path.join(job.directory, "tiles.txt");
    await fs.promises.writeFile(listPath, tileFiles.join("\n"));
    const vrtPath = path.join(job.directory, "mosaic.vrt");
    await runGdal(GDALBUILDVRT_PATH, ["-input_file_list", listPath, vrtPath], "gdalbuildvrt");

    job.phase = "creating_geotiff";
    job.progress = 92;
    await persistOrthoJob(job);
    await runGdal(GDAL_TRANSLATE_PATH, [
      vrtPath,
      job.outputPath,
      "-of", "GTiff",
      "-co", "TILED=YES",
      "-co", "COMPRESS=DEFLATE",
      "-co", "BIGTIFF=IF_SAFER",
    ], "gdal_translate");
    job.status = "completed";
    job.phase = "completed";
    job.progress = 100;
    await persistOrthoJob(job);
  } catch (error) {
    console.error(`[ORTHO_JOB] ${job.id} failed:`, error.message);
    job.status = "failed";
    job.phase = "failed";
    job.error = error.message;
    await persistOrthoJob(job).catch(() => {});
  }
}

const server = http.createServer((req, res) => {
  const origin = getCorsOrigin(req.headers.origin);
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/health" && req.method === "GET") {
    sendJson(res, 200, origin, { status: "ok" });
    return;
  }

  const requestUrl = new URL(req.url, "http://localhost");

  if (requestUrl.pathname === "/ortho-download-jobs" && req.method === "POST") {
    readRequestBody(req).then(async (requestBody) => {
      const payload = parseJsonBody(requestBody);
      const collectionId = String(payload.collectionId || "").replace(/^byoc-/, "");
      const itemId = String(payload.itemId || "");
      const imageDate = String(payload.imageDate || "");
      const resolutionMeters = Number(payload.resolutionMeters);
      const bbox = Array.isArray(payload.bbox) ? payload.bbox.map(Number) : [];
      const validBbox = bbox.length === 4 && bbox.every(Number.isFinite) && bbox[2] > bbox[0] && bbox[3] > bbox[1] &&
        bbox.every((value) => Math.abs(value) <= 20037508.35);
      if (!/^[0-9a-fA-F-]{36}$/.test(collectionId) || !/^[0-9a-fA-F-]{36}$/.test(itemId) ||
          !/^\d{4}-\d{2}-\d{2}$/.test(imageDate) || !Number.isFinite(resolutionMeters) ||
          resolutionMeters < 0.01 || resolutionMeters > 100 || !validBbox) {
        sendJson(res, 400, origin, { error: "Invalid ortho download job parameters" });
        return;
      }
      try {
        await ensureGdalAvailable();
      } catch (error) {
        sendJson(res, 503, origin, {
          error: "GDAL is required to build the final GeoTIFF",
          detail: error.message,
        });
        return;
      }
      const grid = createOrthoDownloadTiles({ bbox, resolutionMeters });
      if (!grid.tiles.length || grid.tiles.length > 10000) {
        sendJson(res, 400, origin, { error: "The requested area produces an unsupported number of tiles" });
        return;
      }
      const id = crypto.randomUUID();
      const name = safeOrthoJobName(payload.name);
      const directory = path.join(ORTHO_JOB_ROOT, id);
      const job = {
        id,
        name,
        status: "queued",
        phase: "queued",
        progress: 0,
        completedTiles: 0,
        totalTiles: grid.tiles.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        collectionId,
        itemId,
        imageDate,
        resolutionMeters,
        bbox,
        totalWidth: grid.totalWidth,
        totalHeight: grid.totalHeight,
        columns: grid.columns,
        rows: grid.rows,
        tiles: grid.tiles,
        directory,
        tilesDirectory: path.join(directory, "tiles"),
        outputPath: path.join(directory, name + ".tif"),
      };
      orthoDownloadJobs.set(id, job);
      await persistOrthoJob(job);
      setImmediate(() => runOrthoDownloadJob(job));
      sendJson(res, 202, origin, publicOrthoJob(job));
    }).catch((error) => {
      console.error("[ORTHO_JOB] Could not create job:", error.message);
      sendJson(res, 400, origin, { error: "Could not create ortho download job", detail: error.message });
    });
    return;
  }

  const orthoJobMatch = requestUrl.pathname.match(/^\/ortho-download-jobs\/([0-9a-f-]{36})(\/file)?$/);
  if (orthoJobMatch && req.method === "GET") {
    loadOrthoJob(orthoJobMatch[1]).then((job) => {
      if (!job) {
        sendJson(res, 404, origin, { error: "Ortho download job not found" });
        return;
      }
      if (!orthoJobMatch[2]) {
        sendJson(res, 200, origin, publicOrthoJob(job));
        return;
      }
      if (job.status !== "completed" || !fs.existsSync(job.outputPath)) {
        sendJson(res, 409, origin, { error: "Ortho download is not ready", job: publicOrthoJob(job) });
        return;
      }
      const stat = fs.statSync(job.outputPath);
      res.writeHead(200, {
        "Access-Control-Allow-Origin": origin,
        "Content-Type": "image/tiff",
        "Content-Length": stat.size,
        "Content-Disposition": `attachment; filename="${safeOrthoJobName(job.name)}.tif"`,
      });
      fs.createReadStream(job.outputPath).pipe(res);
    }).catch((error) => {
      sendJson(res, 500, origin, { error: "Could not read ortho download job", detail: error.message });
    });
    return;
  }

  if (requestUrl.pathname === "/planet-tile" && req.method === "GET") {
    const mosaicId = requestUrl.searchParams.get("mosaicId");
    const z = requestUrl.searchParams.get("z");
    const x = requestUrl.searchParams.get("x");
    const y = requestUrl.searchParams.get("y");
    if (!mosaicId || !/^[a-zA-Z0-9_-]+$/.test(mosaicId) || !/^\d+$/.test(z || "") || !/^\d+$/.test(x || "") || !/^\d+$/.test(y || "")) {
      sendJson(res, 400, origin, { error: "Invalid Planet tile parameters" });
      return;
    }
    const planetTileUrl = `https://tiles.planet.com/basemaps/v1/planet-tiles/${encodeURIComponent(mosaicId)}/gmap/${z}/${x}/${y}.png?api_key=${encodeURIComponent(PLANET_API_KEY)}`;
    requestBufferWithRetry(
      planetTileUrl,
      { method: "GET", headers: { Accept: "image/png" } },
      null,
      "Planet tile request",
      2
    ).then((tileResponse) => {
      relayBufferedResponse(res, origin, tileResponse, "image/png");
    }).catch((error) => {
      console.error("[PROXY] Planet tile request error:", error.message);
      sendJson(res, 502, origin, { error: "Planet tile request failed", detail: error.message });
    });
    return;
  }

  if (requestUrl.pathname === "/get-byoc-tiles" && req.method === "GET") {
    const collectionId = String(requestUrl.searchParams.get("collectionId") || "").replace(/^byoc-/, "");
    if (!/^[0-9a-fA-F-]{36}$/.test(collectionId)) {
      sendJson(res, 400, origin, { error: "Invalid BYOC collection ID" });
      return;
    }
    getSentinelHubToken().then((accessToken) => {
      const tilesUrl = `https://services-uswest2.sentinel-hub.com/api/v1/byoc/collections/${encodeURIComponent(collectionId)}/tiles?count=100`;
      return requestBufferWithRetry(tilesUrl, {
        method: "GET",
        headers: { Accept: "application/json", Authorization: "Bearer " + accessToken },
      }, null, "BYOC tiles request", 2);
    }).then((tilesResponse) => {
      relayBufferedResponse(res, origin, tilesResponse, "application/json");
    }).catch((error) => {
      console.error("[PROXY] BYOC tiles request error:", error.message);
      sendJson(res, 502, origin, { error: "Sentinel Hub BYOC tiles request failed", detail: error.message });
    });
    return;
  }

  if (requestUrl.pathname === "/ortho-tile" && req.method === "GET") {
    const collectionId = String(requestUrl.searchParams.get("collectionId") || "").replace(/^byoc-/, "");
    const itemId = String(requestUrl.searchParams.get("itemId") || "");
    const imageDate = String(requestUrl.searchParams.get("date") || "");
    const z = Number(requestUrl.searchParams.get("z"));
    const x = Number(requestUrl.searchParams.get("x"));
    const y = Number(requestUrl.searchParams.get("y"));
    const maxTileIndex = Number.isInteger(z) && z >= 0 && z <= 23 ? Math.pow(2, z) - 1 : -1;
    if (!/^[0-9a-fA-F-]{36}$/.test(collectionId) || !/^[0-9a-fA-F-]{36}$/.test(itemId) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(imageDate) || !Number.isInteger(x) || !Number.isInteger(y) ||
        x < 0 || y < 0 || x > maxTileIndex || y > maxTileIndex) {
      sendJson(res, 400, origin, { error: "Invalid ortho tile parameters" });
      return;
    }

    const worldHalfWidth = 20037508.342789244;
    const tileSize = 256;
    const resolution = (2 * worldHalfWidth) / (tileSize * Math.pow(2, z));
    const minX = -worldHalfWidth + x * tileSize * resolution;
    const maxX = minX + tileSize * resolution;
    const maxY = worldHalfWidth - y * tileSize * resolution;
    const minY = maxY - tileSize * resolution;
    const processBody = JSON.stringify({
      input: {
        bounds: {
          bbox: [minX, minY, maxX, maxY],
          properties: { crs: "http://www.opengis.net/def/crs/EPSG/0/3857" },
        },
        data: [{
          type: "byoc-" + collectionId,
          dataFilter: {
            id: itemId,
            timeRange: { from: imageDate + "T00:00:00Z", to: imageDate + "T23:59:59Z" },
            mosaickingOrder: "mostRecent",
          },
        }],
      },
      output: {
        width: tileSize,
        height: tileSize,
        responses: [{ identifier: "default", format: { type: "image/png" } }],
      },
      evalscript: `//VERSION=3
function setup() {
  return { input: [{ bands: ["red", "green", "blue", "dataMask"], units: "DN" }], output: { bands: 4, sampleType: "UINT8" } };
}
function evaluatePixel(sample) {
  return [sample.red, sample.green, sample.blue, sample.dataMask * 255];
}`,
    });

    getSentinelHubToken().then((accessToken) => requestBufferWithRetry(
      "https://services-uswest2.sentinel-hub.com/api/v1/process",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(processBody),
          Authorization: "Bearer " + accessToken,
          Accept: "image/png",
        },
      },
      processBody,
      "Ortho tile request",
      2
    )).then((tileResponse) => {
      res.setHeader("Cache-Control", "public, max-age=86400");
      relayBufferedResponse(res, origin, tileResponse, "image/png");
    }).catch((error) => {
      console.error("[PROXY] Ortho tile request error:", error.message);
      sendJson(res, 502, origin, { error: "Sentinel Hub ortho tile request failed", detail: error.message });
    });
    return;
  }

  if (requestUrl.pathname.startsWith("/prisma-proxy/") && (req.method === "GET" || req.method === "POST")) {
    const upstreamPath = requestUrl.pathname.replace(/^\/prisma-proxy/, "");
    if (!isAllowedPrismaProxyPath(upstreamPath)) {
      sendJson(res, 400, origin, { error: "Invalid Prisma proxy path" });
      return;
    }

    readRequestBody(req).then((requestBody) => {
      const upstreamUrl = PRISMA_API_BASE_URL + upstreamPath + requestUrl.search;
      const headers = {
        Accept: "application/json",
      };

      if (req.headers.authorization && req.headers.authorization.trim().split(/\s+/).length === 2) {
        headers.Authorization = req.headers.authorization;
      }

      if (req.method === "POST") {
        headers["Content-Type"] = req.headers["content-type"] || "application/json";
        headers["Content-Length"] = Buffer.byteLength(requestBody);
      }

      return requestBufferWithRetry(
        upstreamUrl,
        {
          method: req.method,
          headers,
          rejectUnauthorized: false,
        },
        req.method === "POST" ? requestBody : null,
        "Prisma request",
        2,
        180000
      );
    }).then((prismaResponse) => {
      relayBufferedResponse(res, origin, prismaResponse, "application/json");
    }).catch((error) => {
      console.error("[PROXY] Prisma request error:", error.message);
      sendJson(res, 502, origin, { error: "Prisma request failed", detail: error.message });
    });
    return;
  }

  if (req.url === "/sh-token" && req.method === "POST") {
    getSentinelHubToken().then((accessToken) => {
      sendJson(res, 200, origin, { access_token: accessToken });
    }).catch((error) => {
      console.error("[PROXY] Sentinel Hub token request error:", error.message);
      sendJson(res, 502, origin, { error: "Sentinel Hub token request failed", detail: error.message });
    });
    return;
  }

  if (req.url === "/prisma-token" && req.method === "POST") {
    getPrismaToken().then((accessToken) => {
      sendJson(res, 200, origin, { access: accessToken });
    }).catch((error) => {
      console.error("[PROXY] Prisma token request error:", error.message);
      sendJson(res, 502, origin, { error: "Prisma token request failed", detail: error.message });
    });
    return;
  }

  if (req.url === "/get-catalog" && req.method === "POST") {
    let requestBody = "";
    req.on("data", (chunk) => {
      requestBody += chunk;
    });

    req.on("end", async () => {
      let payload;
      try {
        payload = parseJsonBody(requestBody);
      } catch (error) {
        console.error("[PROXY] Invalid catalog JSON body:", error.message);
        sendJson(res, 400, origin, { error: "Invalid JSON body" });
        return;
      }

      try {
        const accessToken = await getSentinelHubToken();
        const bodyString = JSON.stringify(payload);
        const catalogResponse = await requestBufferWithRetry(
          "https://services-uswest2.sentinel-hub.com/api/v1/catalog/1.0.0/search",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(bodyString),
              Authorization: "Bearer " + accessToken,
            },
          },
          bodyString,
          "Catalog request"
        );
        relayBufferedResponse(res, origin, catalogResponse, "application/json");
      } catch (error) {
        console.error("[PROXY] Catalog request error:", error.message);
        sendJson(res, 502, origin, { error: "Sentinel Hub catalog request failed", detail: error.message });
      }
    });

    return;
  }

  if (req.url === "/get-image" && req.method === "POST") {
    let requestBody = "";
    req.on("data", (chunk) => {
      requestBody += chunk;
    });

    req.on("end", async () => {
      let payload;
      try {
        payload = parseJsonBody(requestBody);
      } catch (error) {
        console.error("[PROXY] Invalid JSON body:", error.message);
        sendJson(res, 400, origin, { error: "Invalid JSON body" });
        return;
      }

      const implementation = typeof payload.implementation === "string" ? payload.implementation : null;
      if (implementation) {
        delete payload.implementation;
      }

      const processHost = implementation && implementation.trim().length > 0
        ? implementation.trim()
        : "https://services.sentinel-hub.com";
      const processUrl = processHost.endsWith("/process")
        ? processHost
        : processHost.replace(/\/+$/, "") + "/api/v1/process";

      try {
        const accessToken = await getSentinelHubToken();
        const bodyString = JSON.stringify(payload);
        const processResponse = await requestBufferWithRetry(
          processUrl,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(bodyString),
              Authorization: "Bearer " + accessToken,
            },
          },
          bodyString,
          "Process request"
        );
        relayBufferedResponse(res, origin, processResponse, "application/octet-stream");
      } catch (error) {
        console.error("[PROXY] Process request error:", error.message);
        sendJson(res, 502, origin, { error: "Sentinel Hub process request failed", detail: error.message });
      }
    });

    return;
  }

  res.writeHead(404, { "Content-Type": "application/json", "Access-Control-Allow-Origin": origin });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`Sentinel Hub proxy listening on port ${PORT}`);
  console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(", ")}`);
});
