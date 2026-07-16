/**
 * Visor estático de modelos 3D IGAC.
 * La API de ArcGIS se carga desde js.arcgis.com y el catálogo definitivo
 * se obtiene de catalogo.json. No se requieren dependencias instaladas.
 */
const initialCatalog = [
    ["GD1_15189000_Ciénega_20250409", "M3D_15189000_20250409", "https://mapas2.igac.gov.co/host/rest/services/Escenas3D/m3d15189000cienaga/SceneServer"],
    ["GD1_15293000_Gachantivá_20250422", "M3D_15293000_20250422", "https://mapas2.igac.gov.co/host/rest/services/Escenas3D/m3d15293000gachantiva/SceneServer"],
    ["GD1_15299000_Garagoa_20250207", "M3D_15299000_20250207", "https://mapas2.igac.gov.co/host/rest/services/Escenas3D/m3d15299000garagoa/SceneServer"],
    ["GD1_15759000_Sogamoso_20250222", "M3D_15759000_20250222", "https://mapas2.igac.gov.co/host/rest/services/Escenas3D/m3d15759000sogamoso/SceneServer"],
    ["GD1_08832000_Tubarà_20250702", "M3D_08832000_20250702", "https://mapas2.igac.gov.co/host/rest/services/Escenas3D/m3d08832000tubara/SceneServer"],
    ["GD1_13430000_Magangué_20250513", "M3D_13430000_20250513", "https://mapas2.igac.gov.co/host/rest/services/Escenas3D/m3d13430000magangue/SceneServer"],
    ["GD1_13836000_Turbaco_Zona_Norte_20250530", "M3D_13836000_Zona_Norte_20250530", "https://mapas2.igac.gov.co/host/rest/services/Escenas3D/m3d13836000turbacozonanorte/SceneServer"],
    ["GD1_23079000_Buenavista_20250517", "M3D_23079000_20250517", "https://mapas2.igac.gov.co/host/rest/services/Escenas3D/m3d23079000buenavista/SceneServer"],
    ["GD1_52320000_Guaitarilla_20251111", "M3D_52320000_20251111", "https://mapas2.igac.gov.co/host/rest/services/Escenas3D/m3d52320000guaitarilla/SceneServer"],
    ["GD1_68051000_Aratoca_20250918", "M3D_68051000_20250918", "https://mapas2.igac.gov.co/host/rest/services/Escenas3D/m3d68051000aratoca/SceneServer"],
    ["GD1_73349000_Honda_20250704", "M3D_73349000_20250704", "https://mapas2.igac.gov.co/host/rest/services/Escenas3D/m3d73349000honda/SceneServer"],
    ["GD1_85010000_Aguazul_20250810", "M3D_85010000_20250810", "https://mapas2.igac.gov.co/host/rest/services/Escenas3D/m3d85010000aguazul/SceneServer"],
].map(([source, name, url]) => ({ source, name, url }));
// Variables de estado compartidas entre el catálogo, la escena y las herramientas.
let catalog = initialCatalog,
    activeService,
    layer,
    view,
    analysisWidget,
    loadService;
// Atajo para buscar un único elemento del DOM y para mostrar mensajes al usuario.
const $ = (s) => document.querySelector(s);
const status = (t) => ($("#status").textContent = t);
/** Devuelve un nombre de lectura amigable a partir del identificador técnico IGAC. */
function labelFor(item) {
    return item.source
        .replace(/^GD1_\d+_/, "")
        .replace(/_\d{8}$/, "")
        .replaceAll("_", " ");
}
/**
 * Dibuja el catálogo lateral y aplica el texto de búsqueda actual.
 * Cada botón conserva la URL del SceneServer para identificar el servicio elegido.
 */
function renderCatalog() {
    const q = $("#search").value.trim().toLocaleLowerCase();
    const items = catalog.filter((x) => (x.source + x.name).toLocaleLowerCase().includes(q));
    $("#service-count").textContent = catalog.length;
    $("#catalog").innerHTML = items.map((x) => `<button class="service ${x === activeService ? "active" : ""}" data-url="${x.url}"><span class="pin">⌖</span><span><strong>${labelFor(x)}</strong><small>${x.name}</small></span></button>`).join("") || '<p class="catalog-summary">No hay coincidencias.</p>';
    document.querySelectorAll(".service").forEach((b) => (b.onclick = () => loadService(catalog.find((x) => x.url === b.dataset.url))));
}
/** Sustituye el catálogo en memoria después de validar catalogo.json. */
function setCatalog(list) {
    catalog = list;
    activeService = undefined;
    renderCatalog();
    status(`${list.length} servicios importados. Seleccione uno para abrirlo.`);
}
// Carga diferida de módulos ArcGIS: disminuye el peso inicial del visor.
require(["esri/Map", "esri/views/SceneView", "esri/layers/IntegratedMeshLayer", "esri/widgets/Measurement", "esri/widgets/LineOfSight", "esri/widgets/ElevationProfile"], (Map, SceneView, IntegratedMeshLayer, Measurement, LineOfSight, ElevationProfile) => {
    const map = new Map({ basemap: "satellite", ground: "world-elevation" });
    view = new SceneView({ container: "viewDiv", map, qualityProfile: "high", environment: { lighting: { directShadowsEnabled: true, date: new Date() }, atmosphere: { quality: "high" }, starsEnabled: false } });
    // Cámara global de referencia, centrada en Colombia y suficientemente alta para ver el planeta.
    const worldView = { position: { longitude: -74.2973, latitude: 4.5709, z: 30000000 }, heading: 0, tilt: 0 };
    view.when(() => {
        status("Visor listo. Seleccione un modelo del catálogo.");
    });
    /** Carga exclusivamente el SceneServer seleccionado y encuadra su extensión. */
    loadService = (item) => {
        if (!view) return;
        activeService = item;
        $("#scene-title").textContent = labelFor(item);
        status(`Cargando ${item.name}…`);
        if (layer) map.remove(layer);
        layer = new IntegratedMeshLayer({ url: item.url, title: item.name, visible: true });
        layer
            .when(() => layer.fullExtent && view.goTo(layer.fullExtent.expand(1.4)))
            .then(() => status("Modelo cargado."))
            .catch((e) => status(`No fue posible cargar el servicio: ${e.message || "verifique la URL"}`));
        map.add(layer);
        $("#toggle-layer").textContent = "Apagar modelo";
        renderCatalog();
    };
    /** Elimina el widget de análisis activo antes de crear otro. */
    const clear = () => {
        if (analysisWidget) {
            view.ui.remove(analysisWidget);
            analysisWidget.destroy();
            analysisWidget = null;
        }
        $("#analysis-panel").hidden = true;
        $("#analysis-content").replaceChildren();
        document.querySelectorAll("[data-tool]").forEach((button) => button.classList.remove("active"));
    };
    /** Muestra un widget de análisis de ArcGIS en la esquina superior derecha. */
    const add = (Widget, opts = {}) => {
        clear();
        analysisWidget = new Widget({ view, ...opts });
        view.ui.add(analysisWidget, "top-right");
    };
    /** Activa la medición 3D oficial: direct-line para distancia o area para polígonos. */
    const measure = (tool) => {
        clear();
        analysisWidget = new Measurement({ view, activeTool: tool });
        view.ui.add(analysisWidget, "top-right");
        status(tool === "direct-line" ? "Medición de distancia: seleccione dos puntos en la escena." : "Medición de área: dibuje un polígono en la escena.");
    };
    /** Abre el perfil en un panel independiente con desplazamiento vertical. */
    const showElevationProfile = () => {
        clear();
        const panel = $("#analysis-panel");
        panel.hidden = false;
        analysisWidget = new ElevationProfile({ view, profiles: [{ type: "ground" }], container: "analysis-content" });
        status("Perfil de elevación activo: dibuje una línea sobre la escena.");
    };
    document.querySelectorAll("[data-tool]").forEach(
        (b) =>
            (b.onclick = () => {
                if (b.dataset.tool === "distance") measure("direct-line");
                if (b.dataset.tool === "area") measure("area");
                if (b.dataset.tool === "sight") add(LineOfSight);
                if (b.dataset.tool === "elevation") showElevationProfile();
                document.querySelectorAll("[data-tool]").forEach((button) => button.classList.remove("active"));
                b.classList.add("active");
            }),
    );
    $("#clear-analysis").onclick = clear;
    $("#close-analysis-panel").onclick = clear;
    $("#toggle-layer").onclick = () => {
        if (layer) {
            layer.visible = !layer.visible;
            $("#toggle-layer").textContent = layer.visible ? "Apagar modelo" : "Encender modelo";
        }
    };
    $("#reset-view").onclick = () => {
        clear();
        view.goTo(worldView);
        status("Vista global restaurada.");
    };
    // La fecha y la hora modifican la iluminación solar y las sombras de la escena.
    const dateInput = $("#sun-date"),
        timeInput = $("#sun-time");
    dateInput.value = new Date().toISOString().slice(0, 10);
    function sun() {
        const d = new Date(`${dateInput.value}T${timeInput.value || "12:00"}:00`);
        if (!Number.isNaN(d)) view.environment.lighting.date = d;
    }
    dateInput.onchange = sun;
    timeInput.onchange = sun;
    $("#weather").onchange = (e) => {
        $("#weather-overlay").className = `weather-overlay ${e.target.value}`;
    };
});
// El filtro solo redibuja los servicios que coinciden; no realiza solicitudes al servidor.
$("#search").oninput = renderCatalog;
renderCatalog();
// Fuente permanente del catálogo: puede editarse sin modificar el visor.
fetch("./catalogo.json")
    .then((r) => {
        if (!r.ok) throw new Error("No se encontró catalogo.json");
        return r.json();
    })
    .then((data) => {
        if (!Array.isArray(data.services)) throw new Error("Formato de catálogo no válido");
        setCatalog(data.services);
    })
    .catch(() => {
        // No se muestran ejemplos si el archivo principal falla: evita datos incompletos.
        catalog = [];
        renderCatalog();
        status("No fue posible cargar catalogo.json. Abra el visor mediante un servidor local.");
    });
