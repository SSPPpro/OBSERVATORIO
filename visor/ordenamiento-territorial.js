/* Territorial analysis is prepared in EPSG:9377 by scripts/ordenamiento_territorial.py. */
function isOrdenamientoTerritorial() {
    return $("#selectSHAnalyticsSubs").val() === "ordenamiento-territorial";
}

function createOrdenamientoTerritorialSymbol() {
    var outline = new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.Color([0, 102, 255]), 2);
    // A zero-alpha solid fill keeps the polygon interior clickable.
    return new esri.SimpleFillSymbol(esri.SimpleFillSymbol.STYLE_SOLID, outline, new esri.Color([0, 102, 255, 0]));
}

var territorialUrbanRequest = null;
function loadTerritorialUrbanGeometries() {
    if (!territorialUrbanRequest) {
        territorialUrbanRequest = $.getJSON("data/ordenamiento-territorial-suelo-urbano.geojson").then(function (data) {
            var geometries = {};
            data.features.forEach(function (feature) {
                var json = Terraformer.ArcGIS.fromGeoJSON(feature.geometry);
                geometries[feature.id] = { geometry: esri.webMercatorUtils.geographicToWebMercator(esri.jsonUtilsGeometry.fromJson(json)), soilType: feature.properties.tipo_suelo };
            });
            return geometries;
        });
        territorialUrbanRequest.fail(function () { territorialUrbanRequest = null; });
    }
    return territorialUrbanRequest;
}

function addTerritorialUrbanPreview(previewMap, selectedGraphic) {
    var geometries = selectedGraphic && selectedGraphic.territorialUrbanGeometries;
    // Draw expansion first so urban boundaries remain above it in every preview.
    var orderedGeometries = (geometries || []).slice().sort(function (a, b) {
        return Number(a.soilType !== "expansion urbana") - Number(b.soilType !== "expansion urbana");
    });
    orderedGeometries.forEach(function (item) {
        var color = item.soilType === "expansion urbana" ? [160, 32, 240] : [255, 230, 0];
        var border = new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.Color(color), 2);
        var symbol = new esri.SimpleFillSymbol(esri.SimpleFillSymbol.STYLE_NULL, border, new esri.Color(color.concat([0])));
        previewMap.graphics.add(new esri.Graphic(item.geometry, symbol));
    });
}

function loadOrdenamientoTerritorial(requestId, loadingDialog) {
    [currentSHAnalyticsClickHandle, currentSHAnalyticsHoverHandle, currentSHAnalyticsHoverOutHandle].forEach(function (handle) {
        if (handle) handle.remove();
    });
    currentSHAnalyticsClickHandle = currentSHAnalyticsHoverHandle = currentSHAnalyticsHoverOutHandle = null;
    $("#shAnalyticsDateFilter, .sh-analytics-municipality-control, .sh-analytics-boundary-control").hide();
    if (currentSHAnalyticsBoundaryLayer) currentSHAnalyticsBoundaryLayer.setVisibility(false);
    $.getJSON("data/ordenamiento-territorial.geojson").done(function (data) {
        if (requestId !== currentSHAnalyticsLoadRequestId || !isOrdenamientoTerritorial()) return;
        var colors = { amarillo: [255, 215, 0], naranja: [255, 140, 0], rojo: [220, 35, 35] };
        var graphics = [];
        var markers = [];
        var total = 0;
        var html = "<p>Construcciones exteriores al suelo urbano, a máximo 1 km. Grupos conectados por distancias entre bordes de hasta 50 m.</p>";
        html += "<p><span style='color:#8a7100'>● Amarillo: 5–9</span><br><span style='color:#b96000'>● Naranja: 10–19</span><br><span style='color:#dc2323'>● Rojo: 20 o más</span></p>";
        html += "<p>Se analiza el total de detecciones; se excluyen las que intersectan suelo urbano y las huellas idénticas repetidas.</p>";
        html += "<a href='data/ordenamiento-territorial.geojson' download='ordenamiento-territorial.geojson'>Descargar todas las agrupaciones (GeoJSON)</a>";
        html += "<div style='max-height:280px;overflow:auto;margin-top:8px'>";
        (data.features || []).forEach(function (feature, index) {
            var p = feature.properties;
            var color = colors[p.categoria];
            var json = Terraformer.ArcGIS.fromGeoJSON(feature.geometry);
            var geometry = esri.webMercatorUtils.geographicToWebMercator(esri.jsonUtilsGeometry.fromJson(json));
            var outline = new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.Color(color), 2);
            var symbol = createOrdenamientoTerritorialSymbol();
            var graphic = new esri.Graphic(geometry, symbol);
            graphic.attributes = { territorialGroup: index, count: p.construcciones, number: p.grupo, municipality: p.municipio || "Municipio no identificado" };
            currentSHAnalyticsHexLayer.add(graphic);
            graphics.push(graphic);
            // Category colors remain on locators and the list; footprints use blue outlines.
            var marker = new esri.Graphic(geometry.getExtent().getCenter(), new esri.SimpleMarkerSymbol(
                esri.SimpleMarkerSymbol.STYLE_CIRCLE, 9, outline, new esri.Color(color)));
            markers.push(marker);
            marker.attributes = graphic.attributes;
            currentSHAnalyticsHexLayer.add(marker);
            total += p.construcciones;
            html += "<button type='button' class='list-group-item territorial-group' data-group='" + index + "' style='width:100%;text-align:left;border-left:5px solid rgb(" + color.join(',') + ")'>" + escapeSHAnalyticsHtml(graphic.attributes.municipality) + " - " + p.construcciones + " construcciones</button>";
        });
        html += "</div>";
        var metadata = data.metadata || {};
        html = "<p id='territorialSummary'><strong>" + graphics.length + " agrupaciones · " + total + " construcciones</strong></p>" + html;
        if (!graphics.length) html += "<p>No se encontraron grupos de al menos 5 construcciones.</p>";
        if (metadata.generado) html += "<p style='margin-top:8px;font-size:11px'>Análisis generado: " + escapeSHAnalyticsHtml(metadata.generado.slice(0, 10)) + "</p>";
        $("#selectSHAnalyticsResults").html("<div style='padding:8px'>" + html + "</div>");
        var filterHtml = "<div style='padding:8px;border-bottom:1px solid #ddd;margin-bottom:8px'>" +
            "<label for='territorialMunicipality'>Buscar municipio</label><input id='territorialMunicipality' class='form-control' type='search' placeholder='Nombre del municipio'>" +
            "<div style='margin-top:8px'>Fecha de última detección del grupo</div><div style='display:flex;gap:8px'>" +
            "<label style='flex:1;min-width:0' for='territorialStart'>Desde<input id='territorialStart' type='date' class='form-control'></label>" +
            "<label style='flex:1;min-width:0' for='territorialEnd'>Hasta<input id='territorialEnd' type='date' class='form-control'></label></div>" +
            "<button id='territorialReset' type='button' class='btn btn-default btn-sm'>Limpiar filtros</button>" +
            "<div id='territorialFilterStatus' role='status' style='margin-top:6px'></div></div>";
        $("#selectSHAnalyticsResults").prepend(filterHtml);
        var selectionRequest = 0;
        function applyTerritorialFilters() {
            selectionRequest++;
            clearBurnsMonthlyMosaicWindow();
            var search = normalizeSHAnalyticsMunicipalityText($("#territorialMunicipality").val());
            var start = $("#territorialStart").val();
            var end = $("#territorialEnd").val();
            var invalid = start && end && start > end;
            var count = 0, buildings = 0;
            data.features.forEach(function (feature, index) {
                var p = feature.properties;
                var date = (p.fecha_final || "").slice(0, 10);
                var visible = !invalid && (!search || normalizeSHAnalyticsMunicipalityText(p.municipio).indexOf(search) !== -1) &&
                    ((!start && !end) || (date && (!start || date >= start) && (!end || date <= end)));
                graphics[index][visible ? "show" : "hide"]();
                markers[index][visible ? "show" : "hide"]();
                $("#selectSHAnalyticsResults .territorial-group[data-group='" + index + "']").toggle(!!visible);
                if (visible) { count++; buildings += p.construcciones; }
            });
            $("#territorialSummary").text(count + " agrupaciones · " + buildings + " construcciones");
            $("#territorialFilterStatus").text(invalid ? "La fecha inicial debe ser anterior o igual a la final." : count ? "" : "No hay agrupaciones que coincidan con los filtros.");
        }
        $("#territorialMunicipality").on("input", applyTerritorialFilters);
        $("#territorialStart, #territorialEnd").on("change", applyTerritorialFilters);
        $("#territorialReset").on("click", function () {
            $("#territorialMunicipality, #territorialStart, #territorialEnd").val("");
            applyTerritorialFilters();
        });
        function focusGroup(index) {
            var selectionId = ++selectionRequest;
            var graphic = graphics[index];
            if (!graphic) return;
            var properties = data.features[index].properties;
            var date = esri.moment(properties.fecha_final, "YYYY-MM-DD", true);
            if (!date.isValid()) {
                showLoading("El grupo no tiene una fecha válida para consultar mosaicos", null, "red", true);
                return;
            }
            map.infoWindow.hide();
            var dateLabel = date.format("DD/MM/YYYY");
            loadTerritorialUrbanGeometries().done(function (geometries) {
                if (selectionId !== selectionRequest || requestId !== currentSHAnalyticsLoadRequestId || !isOrdenamientoTerritorial()) return;
                graphic.territorialUrbanGeometries = (properties.suelo_urbano_ids || []).concat(properties.expansion_urbana_ids || []).map(function (id) { return geometries[id]; }).filter(Boolean);
                openMonthlyMosaicFloatingWindowFromDates(
                dateLabel, dateLabel,
                "Ordenamiento Territorial · " + escapeSHAnalyticsHtml(graphic.attributes.municipality) + " - " + graphic.attributes.count + " construcciones",
                graphic, "gallery", dateLabel
                );
            }).fail(function () {
                if (selectionId !== selectionRequest || requestId !== currentSHAnalyticsLoadRequestId || !isOrdenamientoTerritorial()) return;
                showLoading("No se pudo cargar el límite de suelo urbano. Seleccione nuevamente el polígono para reintentar.", null, "red", true);
            });
        }
        $("#selectSHAnalyticsResults").off("click.territorial").on("click.territorial", ".territorial-group", function () {
            focusGroup(Number($(this).attr("data-group")));
        });
        currentSHAnalyticsClickHandle = currentSHAnalyticsHexLayer.on("click", function (event) {
            if (event.graphic && event.graphic.attributes) focusGroup(event.graphic.attributes.territorialGroup);
        });
        currentSHAnalyticsHexLayer.setVisibility(true);
        $("#shAnalyticsLegendBottom").html("<strong>Ordenamiento Territorial</strong> &nbsp; <span style='color:#8a7100'>● 5–9</span> &nbsp; <span style='color:#b96000'>● 10–19</span> &nbsp; <span style='color:#dc2323'>● ≥20 construcciones</span>").show();
    }).fail(function () {
        if (requestId !== currentSHAnalyticsLoadRequestId || !isOrdenamientoTerritorial()) return;
        $("#selectSHAnalyticsResults").html("<p>No se pudo cargar el análisis de Ordenamiento Territorial. Intente nuevamente.</p>");
    }).always(function () {
        closeSHAnalyticsLoadingDialog(loadingDialog);
    });
}
