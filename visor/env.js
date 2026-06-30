(function (window) {

  var defaultProxyBaseUrl = "https://ccg.igac.gov.co";
  // var defaultProxyBaseUrl = "http://localhost:3000";

  function joinUrl(baseUrl, path) {
    if (!baseUrl) return path;
    return baseUrl.replace(/\/+$/, "") + path;
  }

  var existingEnv = window.__env || {};
  var isLocalFrontend = ["localhost", "127.0.0.1"].indexOf(window.location.hostname) !== -1;
  var remoteProxyBaseUrl = "https://ccg.igac.gov.co";
  var proxyBaseUrl = existingEnv.sentinelHubProxyBaseUrl || remoteProxyBaseUrl;
  var prismaProxyBaseUrl = existingEnv.prismaProxyBaseUrl || remoteProxyBaseUrl;
  var prismaFallbackProxyBaseUrl = existingEnv.prismaFallbackProxyBaseUrl || defaultProxyBaseUrl;
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
    sentinelHubFallbackTokenProxyUrl: isLocalFrontend ? joinUrl(defaultProxyBaseUrl, "/sh-token") : "",
    sentinelHubCatalogProxyUrl: joinUrl(proxyBaseUrl, "/get-catalog"),
    sentinelHubProcessProxyUrl: joinUrl(proxyBaseUrl, "/get-image"),
    sentinelHubImageProxyUrl: joinUrl(proxyBaseUrl, "/get-image"),
    planetTileProxyUrl: isLocalFrontend ? joinUrl(defaultProxyBaseUrl, "/planet-tile") : joinUrl(proxyBaseUrl, "/planet-tile"),
    sentinelHubUseDirectToken: true,
    sentinelHubClientId: "89499d2c-67f4-4f57-86c0-cdef0ece217e",
    sentinelHubClientSecret: "lVjg5KL43HXjNMQiRll1IruOXlvG3KqM",
    sentinelHubOAuthTokenUrl: "https://services.sentinel-hub.com/oauth/token",
    planetTileProxyUrl: joinUrl(proxyBaseUrl, "/planet-tile"),
    sentinelHubUseDirectToken: false,
    prismaProxyBaseUrl: prismaProxyBaseUrl,
    rasterMosaicByocCollection: "byoc-7c1511e7-42fd-41ee-925a-bedb3c24cc44",
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
