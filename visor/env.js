(function (window) {

  var remoteProxyBaseUrl = "https://ccg.igac.gov.co";
  var localProxyBaseUrl = "http://localhost:3000";

  function joinUrl(baseUrl, path) {
    if (!baseUrl) return path;
    return baseUrl.replace(/\/+$/, "") + path;
  }

  var existingEnv = window.__env || {};
  var isLocalFrontend = ["localhost", "127.0.0.1"].indexOf(window.location.hostname) !== -1;
  var proxyBaseUrl = existingEnv.sentinelHubProxyBaseUrl || remoteProxyBaseUrl;
  // Configuración temporal de diagnóstico: Prisma usa primero el proxy local
  // y recurre al servidor de CCG si localhost no está disponible.
  var prismaProxyBaseUrl = existingEnv.prismaProxyBaseUrl || localProxyBaseUrl;
  var prismaFallbackProxyBaseUrl = existingEnv.prismaFallbackProxyBaseUrl || remoteProxyBaseUrl;
  var prismaApiBaseUrl = existingEnv.prismaApiBaseUrl || (
    prismaProxyBaseUrl
      ? joinUrl(prismaProxyBaseUrl, "/prisma-proxy")
      : "https://prisma.procalculo.com"
  );
  var prismaTokenProxyUrl = existingEnv.prismaTokenProxyUrl || (
    prismaProxyBaseUrl
      ? joinUrl(prismaProxyBaseUrl, "/prisma-token")
      : ""
  );
  var prismaFallbackApiBaseUrl = existingEnv.prismaFallbackApiBaseUrl || (
    prismaFallbackProxyBaseUrl ? joinUrl(prismaFallbackProxyBaseUrl, "/prisma-proxy") : ""
  );
  var prismaFallbackTokenProxyUrl = existingEnv.prismaFallbackTokenProxyUrl || (
    prismaFallbackProxyBaseUrl ? joinUrl(prismaFallbackProxyBaseUrl, "/prisma-token") : ""
  );

  window.__env = Object.assign({
    sentinelHubProxyBaseUrl: proxyBaseUrl,
    sentinelHubTokenProxyUrl: joinUrl(proxyBaseUrl, "/sh-token"),
    sentinelHubFallbackTokenProxyUrl: isLocalFrontend ? joinUrl(localProxyBaseUrl, "/sh-token") : "",
    sentinelHubCatalogProxyUrl: joinUrl(proxyBaseUrl, "/get-catalog"),
    sentinelHubByocTilesProxyUrl: isLocalFrontend
      ? joinUrl(localProxyBaseUrl, "/get-byoc-tiles")
      : joinUrl(proxyBaseUrl, "/get-byoc-tiles"),
    orthoTileProxyUrl: isLocalFrontend
      ? joinUrl(localProxyBaseUrl, "/ortho-tile")
      : joinUrl(proxyBaseUrl, "/ortho-tile"),
    orthoDownloadJobsUrl: isLocalFrontend
      ? joinUrl(localProxyBaseUrl, "/ortho-download-jobs")
      : joinUrl(proxyBaseUrl, "/ortho-download-jobs"),
    arcgisImageExportProxyUrl: isLocalFrontend
      ? joinUrl(localProxyBaseUrl, "/arcgis-image-export")
      : joinUrl(proxyBaseUrl, "/arcgis-image-export"),
    sentinelHubFallbackCatalogProxyUrl: isLocalFrontend ? joinUrl(localProxyBaseUrl, "/get-catalog") : "",
    sentinelHubProcessProxyUrl: joinUrl(proxyBaseUrl, "/get-image"),
    sentinelHubFallbackProcessProxyUrl: isLocalFrontend ? joinUrl(localProxyBaseUrl, "/get-image") : "",
    sentinelHubImageProxyUrl: joinUrl(proxyBaseUrl, "/get-image"),
    sentinelHubFallbackImageProxyUrl: isLocalFrontend ? joinUrl(localProxyBaseUrl, "/get-image") : "",
    planetTileProxyUrl: isLocalFrontend ? joinUrl(localProxyBaseUrl, "/planet-tile") : joinUrl(proxyBaseUrl, "/planet-tile"),
    sentinelHubUseDirectToken: true,
    sentinelHubClientId: "89499d2c-67f4-4f57-86c0-cdef0ece217e",
    sentinelHubClientSecret: "lVjg5KL43HXjNMQiRll1IruOXlvG3KqM",
    sentinelHubOAuthTokenUrl: "https://services.sentinel-hub.com/oauth/token",
    planetTileProxyUrl: joinUrl(proxyBaseUrl, "/planet-tile"),
    sentinelHubUseDirectToken: false,
    prismaProxyBaseUrl: prismaProxyBaseUrl,
    rasterMosaicByocCollection: "byoc-1332b9f0-b8dc-423e-9ba6-c704efaeb659",
    orthoByocCollections: [
      "53ab88c9-63b9-400d-adcd-bdad4587369b",
      "359bcf6e-f6aa-42b2-accb-300020f481a4",
      "3dae1328-8656-42fc-b73d-3fa67d2c046d"
    ],
    orthoV2ServicesPath: "data/Servicios_20260715150118.xlsx",
    planetApiKey: "PLAKd9faf25449294d9d86096fe33d980662",
    prismaApiBaseUrl: prismaApiBaseUrl,
    prismaTokenProxyUrl: prismaTokenProxyUrl,
    prismaFallbackApiBaseUrl: prismaFallbackApiBaseUrl,
    prismaFallbackTokenProxyUrl: prismaFallbackTokenProxyUrl,
    planetAnalyticsBoundaryUrl: "data/planet-analytics-limites.geojson",
    planetAnalyticsLocalUrl: "data/reportes/resultado_unido_total.geojson",
    planetAnalyticsLocalUrls: {
      building: "data/reportes/resultado_unido_construcciones.geojson",
      road: "data/reportes/resultado_unido_vias.geojson"
    }
  }, existingEnv);
})(window);
