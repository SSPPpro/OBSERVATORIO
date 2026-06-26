// Si el backend se publica en el mismo dominio del
//   frontend mediante un reverse proxy, las rutas relativas son suficientes.
// - Si el backend queda en otro host, definir sentinelHubProxyBaseUrl o las URL
//   completas de cada endpoint, por ejemplo:
//   sentinelHubProxyBaseUrl: "https://pruebas.igac.gov.co/ott-api"
//   prismaProxyBaseUrl: "https://pruebas.igac.gov.co/ott-api"
(function (window) {
  var currentLocation = window.location;
  var isLocalFrontend = ["localhost", "127.0.0.1"].indexOf(currentLocation.hostname) !== -1;
  var defaultProxyBaseUrl = isLocalFrontend
    ? currentLocation.protocol + "//" + currentLocation.hostname + ":3000"
    : "";

  function joinUrl(baseUrl, path) {
    if (!baseUrl) return path;
    return baseUrl.replace(/\/+$/, "") + path;
  }

  var existingEnv = window.__env || {};
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
