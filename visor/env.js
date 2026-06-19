(function (window) {

  var defaultProxyBaseUrl = "https://ccg.igac.gov.co";
  // var defaultProxyBaseUrl = "http://localhost:3000";

  function joinUrl(baseUrl, path) {
    if (!baseUrl) return path;
    return baseUrl.replace(/\/+$/, "") + path;
  }

  var existingEnv = window.__env || {};
  var proxyBaseUrl = existingEnv.sentinelHubProxyBaseUrl || defaultProxyBaseUrl;

  window.__env = Object.assign({
    // sentinelHubProxyBaseUrl: "/ott-api",
    sentinelHubProxyBaseUrl: proxyBaseUrl,
    sentinelHubTokenProxyUrl: joinUrl(proxyBaseUrl, "/sh-token"),
    sentinelHubCatalogProxyUrl: joinUrl(proxyBaseUrl, "/get-catalog"),
    sentinelHubProcessProxyUrl: joinUrl(proxyBaseUrl, "/get-image"),
    sentinelHubImageProxyUrl: joinUrl(proxyBaseUrl, "/get-image"),
    planetTileProxyUrl: joinUrl(proxyBaseUrl, "/planet-tile"),
    sentinelHubUseDirectToken: false,
    rasterMosaicByocCollection: "byoc-7c1511e7-42fd-41ee-925a-bedb3c24cc44",
    planetApiKey: "PLAKd9faf25449294d9d86096fe33d980662",
    planetAnalyticsBoundaryUrl: "data/planet-analytics-limites.geojson",
    planetAnalyticsLocalUrl: "data/reportes/resultado_unido_total.geojson"
  }, existingEnv);
})(window);