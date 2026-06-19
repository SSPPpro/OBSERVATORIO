const http = require("http");
const https = require("https");
const querystring = require("querystring");

const CLIENT_ID = process.env.SENTINEL_HUB_CLIENT_ID || "e9b1b73f-2ee8-4add-86ed-673541dc930d";
const CLIENT_SECRET = process.env.SENTINEL_HUB_CLIENT_SECRET || "qLnyHdNf5I0ssBpdBEG976WO4OIeGJPS";
const PLANET_API_KEY = process.env.PLANET_API_KEY || "PLAKd9faf25449294d9d86096fe33d980662";
const PORT = Number(process.env.PORT) || 3000;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "*")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

let sentinelHubTokenCache = null;
let sentinelHubTokenExpiresAt = 0;
let sentinelHubTokenRequest = null;

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

function requestBuffer(url, options, body) {
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
    upstreamReq.setTimeout(60000, () => {
      upstreamReq.destroy(new Error("Sentinel Hub request timed out"));
    });

    if (body) {
      upstreamReq.write(body);
    }
    upstreamReq.end();
  });
}

async function requestBufferWithRetry(url, options, body, label, maxAttempts = 3) {
  let lastError = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await requestBuffer(url, options, body);
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
      "Token request"
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

function relayBufferedResponse(res, origin, upstreamResponse, fallbackContentType) {
  const headers = { "Access-Control-Allow-Origin": origin };
  const contentType = upstreamResponse.headers["content-type"] || fallbackContentType;
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  res.writeHead(upstreamResponse.statusCode, headers);
  res.end(upstreamResponse.body);
}

const server = http.createServer((req, res) => {
  const origin = getCorsOrigin(req.headers.origin);
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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

  if (req.url === "/sh-token" && req.method === "POST") {
    const body = querystring.stringify({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    console.log("[PROXY] Token request from:", origin);
    console.log("[PROXY] Request body length:", body.length);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const shReq = https.request("https://services.sentinel-hub.com/oauth/token", options, (shRes) => {
      let responseData = "";
      console.log("[PROXY] SH Response status:", shRes.statusCode);

      shRes.on("data", (chunk) => {
        responseData += chunk;
      });
      shRes.on("end", () => {
        console.log("[PROXY] SH Response received, size:", responseData.length);
        res.writeHead(shRes.statusCode, { "Content-Type": "application/json", "Access-Control-Allow-Origin": origin });
        res.end(responseData);
      });
    });

    shReq.on("error", (error) => {
      console.error("[PROXY] SH Request error:", error.message);
      res.writeHead(500, { "Content-Type": "application/json", "Access-Control-Allow-Origin": origin });
      res.end(JSON.stringify({ error: error.message }));
    });

    shReq.write(body);
    shReq.end();
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
