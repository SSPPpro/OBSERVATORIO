var map;
var view;
var esri;

var homeBtn;
var overviewMap;
var scalebar;
var legend;
var basemap_gallery;
var printer;
var default_extent;
var homeBtn;
var locateBtn;
var resizeCenter;
var loading;
var modeTutorial;
var modeTutorialItem;

var swipeWidget;
var swipeWidget2;
var swipeLayer2;
var swipeLayer1;
var swipeLayer;
var cacheMosaicos;
var previewLayer;
var coordsLayer;
var pointMarker;

var popup;
var hoverHandle;
var updateHandle;
var slider;

var defaultAlertTimer = 3000;

var currentUser;
var currentAccessToken;
var firebase_ui;
var currentBasemap;
var currentScreen;
var currentEstado = "init";
var currentSearch = "all";
var firstExpand = true;
var firstParameters = true;
var firstSearch = true;
var coberturaRow = null;
var currentTiempoMode = 0;
var currentAlpha = 0.5;
var currentChart = null;

var isMapReady = false;
var pendingInitData = null;

var currentMode = "media";

var cacheUnidadesFiltro = [];
var activeLayers = [];
var currentServicio;

var areaLayer;
var areaLayer3;
var areaLayer4;
var fileLayer2;
var fileLayer3;
var geojsonLayer;
var modoSearch = "entidad";
var drawTool;
var editTool;
var drawTool2;
var drawTool3;
var drawTool4;
var editTool2;
var editTool3;
var editTool4;
var drawToolRasterMosaics;
var editToolRasterMosaics;
var areaLayerRasterMosaics;
var fileLayerRasterMosaics;
var rasterMosaicFootprintLayer;
var activeTool;

var configProperties = [
    { property: "visible_confidence_percent", label: "Porcentaje de confianzavisible", visible: "FALSE", tooltip: "Los valores visibles representan la fracción del contenido de la escena (excluyendo la parte de la imagen que contiene relleno negro) que comprende las categorías de claridad, neblina ligera, sombra, nieve/hielo, y se dan como un porcentaje que varía de cero a cien." },
    { property: "satellite_id", label: "Id satélite", visible: "TRUE", tooltip: "Identificador de satélite único a nivel mundial." },
    { property: "item_type", label: "Tipo de artículo", visible: "FALSE", tooltip: "Nombre del tipo de elemento." },
    { property: "instrument", label: "Instrumento", visible: "FALSE", tooltip: "Nombre del instrumento satelital utilizado para recolectar la imagen." },
    { property: "visible_percent", label: "Porcentaje visible", visible: "FALSE", tooltip: "Promedio del porcentaje de confianza para clear_percent, light_haze_percent, shadow_percent y snow_ice_percent." },
    { property: "snow_ice_percent", label: "Porcentaje nieve ice", visible: "FALSE", tooltip: "Porcentaje de valores de nieve y hielo en el conjunto de datos. Los valores de Snow_ice representan áreas de contenido de escena (no rellenas en negro) que están ocultas debajo de la nieve o el hielo." },
    { property: "cloud_percent", label: "Porcentaje de nubosidad", visible: "TRUE", tooltip: "Porcentaje de valores de nubes en el conjunto de datos. Los valores de nubes representan áreas de contenido de escena (no rellenas en negro) que contienen nubes opacas que impiden una interpretación confiable del contenido de la cobertura terrestre." },
    { property: "sun_azimuth", label: "Azimut al sol", visible: "TRUE", tooltip: "El ángulo del sol, visto por el observador, medido en el sentido de las agujas del reloj desde el norte (0 - 360)." },
    { property: "provider", label: "Proveedor", visible: "TRUE", tooltip: "Nombre del proveedor del artículo (p. ej. 'planetscope', 'rapideye')." },
    { property: "ground_control", label: "Control de tierra", visible: "FALSE", tooltip: "Precisión posicional del artículo. Si el elemento tiene una precisión posicional incierta, este valor es falso." },
    { property: "view_angle", label: "Ángulo de visión", visible: "TRUE", tooltip: "El ángulo de visión del satélite respecto al nadir y a lo largo de su trayectoria. Los números positivos indican el este, los números negativos indican el oeste (-25 - +25)." },
    { property: "cloud_cover", label: "Cubrimiento de nubes", visible: "FALSE", tooltip: "Relación entre el área cubierta por nubes y la descubierta." },
    { property: "strip_id", label: "Strip id", visible: "FALSE", tooltip: "El identificador único de la franja de imagen de donde proviene el artículo." },
    { property: "acquired", label: "Adquirido", visible: "FALSE", tooltip: "Marca de tiempo en la que se capturó el elemento." },
    { property: "publishing_stage", label: "Etapa_publicación", visible: "FALSE", tooltip: "Etapa de publicación de un artículo. PSEscenaprimera publicaciónpuede ser a cualquier estado;avance,estándarofinalizado. El estado de menor calidad esavance. Cuando una imagen pasa por la rectificación, pasa aestándary, en definitiva, a lafinalizadoestado.Nota: algunas imágenes permanecen enavanceestado y no pasan por el refinamiento RPC." },
    { property: "sun_elevation", label: "Elevación sol", visible: "TRUE", tooltip: "El ángulo del sol sobre el horizonte (0 - 90)." },
    { property: "light_haze_percent", label: "Porcentaje de neblina y luz", visible: "FALSE", tooltip: "Porcentaje de valores de neblina de luz en el conjunto de datos. Los valores de neblina ligera representan áreas de contenido de escena (no rellenas en negro) que contienen nubes delgadas de baja altitud, cirros de mayor altitud y hollín y polvo que permiten un reconocimiento confiable de las características de la cobertura del suelo y que tienen hasta +/-10 % de incertidumbre. en índices comúnmente utilizados (EVI y NDWI)." },
    { property: "shadow_percent", label: "Porcentaje de sombras", visible: "TRUE", tooltip: "Porcentaje de valores sombra en el conjunto de datos. Los valores de sombra representan áreas de contenido de la escena (no cubiertas en negro) que no están completamente expuestas a la iluminación solar como resultado de pérdidas de transmisión atmosférica debido a nubes, neblina, hollín y polvo y, por lo tanto, no permiten una interpretación confiable de la radiometría o la reflectancia de la superficie. ." },
    { property: "quality_category", label: "Categoría_calidad", visible: "FALSE", tooltip: "Métrica de calidad de imagen del planeta:estándaroprueba. Para calificar paraestándarCalidad de imagen Una imagen debe cumplir una variedad de estándares de calidad, por ejemplo: alineación de bandas o número mínimo de píxeles faltantes. Si la imagen no cumple con estos criterios se considerapruebacalidad." },
    { property: "published", label: "Publicado", visible: "FALSE", tooltip: "Marca de tiempo en la que se publicó el elemento en la API de Planet." },
    { property: "satellite_azimuth", label: "Azimut satélite", visible: "TRUE", tooltip: "Dirección de orientación de la nave espacial desviada, en grados (0-360)." },
    { property: "heavy_haze_percent", label: "Porcentaje de niebla pesada", visible: "FALSE", tooltip: "Porcentaje de valores de turbidez intensa en el conjunto de datos. Los valores de neblina intensa representan áreas de contenido de escena (no rellenas en negro) que contienen nubes delgadas de baja altitud, cirros de mayor altitud, hollín y polvo que permiten un reconocimiento justo de las características de la cobertura terrestre, pero que no tienen una interpretación confiable de la radiometría o la reflectancia de la superficie." },
    { property: "pixel_resolution", label: "Resolución espacial", visible: "TRUE", tooltip: "Resolución de píxeles de las imágenes en metros." },
    { property: "clear_percent", label: "Porcentaje de valores claros", visible: "FALSE", tooltip: "Porcentaje de valores claros en el conjunto de datos. Los valores claros representan áreas de contenido de la escena (no rellenas en negro) que se considera que no se ven afectadas por nubes, neblina, sombra o nieve." },
    { property: "anomalous_pixels", label: "Píxeles_anómalos", visible: "FALSE", tooltip: "Porcentaje de píxeles que pueden tener errores. Representado espacialmente en la UDM." },
    { property: "clear_confidence_percent", label: "Valor porcental de claridad", visible: "FALSE", tooltip: "Valor porcentual: confianza algorítmica por píxel en una clasificación 'clara'." },
    { property: "gsd", label: "GSD", visible: "TRUE", tooltip: "Distancia de muestra del suelo: la distancia entre los centros de los píxeles medida en el suelo en metros." },
    { property: "updated", label: "Actualizado", visible: "FALSE", tooltip: "Marca de tiempo de la última actualización del registro del artículo." },
];

var configPropertiesAlta = [
    { property: "Nom_Depto", label: "Departamento", visible: "FALSE", tooltip: "" },
    { property: "Fecha_Toma", label: "Fecha", visible: "FALSE", tooltip: "" },
    { property: "Sensor", label: "Sensor", visible: "TRUE", tooltip: "" },
    { property: "GSD", label: "GSD", visible: "TRUE", tooltip: "" },
    { property: "Nubosidad", label: "Nubosidad", visible: "TRUE", tooltip: "" },
    { property: "Ang_Incidencia", label: "Ángulo de incidencia", visible: "TRUE", tooltip: "" },
    { property: "Res_Radiome", label: "Resolución Radiometrica", visible: "TRUE", tooltip: "" },
    { property: "Satelite", label: "Satelite", visible: "TRUE", tooltip: "" },
    { property: "Bandas", label: "Bandas", visible: "TRUE", tooltip: "" },
    { property: "Zona", label: "Zona", visible: "FALSE", tooltip: "" },
    { property: "Area_Imagen", label: "Area_Imagen", visible: "FALSE", tooltip: "" },
    { property: "Nom_CPobla", label: "Nom_CPobla", visible: "FALSE", tooltip: "" },
    { property: "Cod_Depto", label: "Cod_Depto", visible: "FALSE", tooltip: "" },
    { property: "Cod_Muni", label: "Cod_Muni", visible: "FALSE", tooltip: "" },
    { property: "Nivel_Procesamiento", label: "Nivel_Procesamiento", visible: "FALSE", tooltip: "" },
    { property: "Nom_Munici", label: "Nom_Munici", visible: "FALSE", tooltip: "" },
    { property: "Porcentaje_Cubrimiento", label: "Porcentaje_Cubrimiento", visible: "FALSE", tooltip: "" },
];

var configAlta = [
    { codigo: "91", url: "https://mapas2.igac.gov.co/image/rest/services/ott/amazonas_alta/ImageServer" },
    { codigo: "81", url: "https://mapas2.igac.gov.co/image/rest/services/ott/arauca_alta/ImageServer" },
    { codigo: "08", url: "https://mapas2.igac.gov.co/image/rest/services/ott/atlantico_alta/ImageServer" },
    { codigo: "13", url: "https://mapas2.igac.gov.co/image/rest/services/ott/bolivar_alta/ImageServer" },
    { codigo: "15", url: "https://mapas2.igac.gov.co/image/rest/services/ott/boyaca_alta/ImageServer" },
    { codigo: "17", url: "https://mapas2.igac.gov.co/image/rest/services/ott/caldas_alta/ImageServer" },
    { codigo: "85", url: "https://mapas2.igac.gov.co/image/rest/services/ott/casanare_alta/ImageServer" },
    { codigo: "19", url: "https://mapas2.igac.gov.co/image/rest/services/ott/cauca_alta/ImageServer" },
    { codigo: "20", url: "https://mapas2.igac.gov.co/image/rest/services/ott/cesar_alta/ImageServer" },
    { codigo: "27", url: "https://mapas2.igac.gov.co/image/rest/services/ott/choco_alta/ImageServer" },
    { codigo: "23", url: "https://mapas2.igac.gov.co/image/rest/services/ott/cordoba_alta/ImageServer" },
    { codigo: "25", url: "https://mapas2.igac.gov.co/image/rest/services/ott/cundinamarca_alta/ImageServer" },
    { codigo: "94", url: "https://mapas2.igac.gov.co/image/rest/services/ott/guainia_alta/ImageServer" },
    { codigo: "41", url: "https://mapas2.igac.gov.co/image/rest/services/ott/huila_alta/ImageServer" },
    { codigo: "44", url: "https://mapas2.igac.gov.co/image/rest/services/ott/laguajira_alta/ImageServer" },
    { codigo: "47", url: "https://mapas2.igac.gov.co/image/rest/services/ott/magdalena_alta/ImageServer" },
    { codigo: "50", url: "https://mapas2.igac.gov.co/image/rest/services/ott/meta_alta/ImageServer" },
    { codigo: "52", url: "https://mapas2.igac.gov.co/image/rest/services/ott/narino_alta/ImageServer" },
    { codigo: "54", url: "https://mapas2.igac.gov.co/image/rest/services/ott/nortedesantander_alta/ImageServer" },
    { codigo: "86", url: "https://mapas2.igac.gov.co/image/rest/services/ott/putumayo_alta/ImageServer" },
    { codigo: "63", url: "https://mapas2.igac.gov.co/image/rest/services/ott/quindio_alta/ImageServer" },
    { codigo: "66", url: "https://mapas2.igac.gov.co/image/rest/services/ott/risaralda_alta/ImageServer" },
    { codigo: "68", url: "https://mapas2.igac.gov.co/image/rest/services/ott/santander_alta/ImageServer?f=jsapi" },
    { codigo: "70", url: "https://mapas2.igac.gov.co/image/rest/services/ott/sucre_alta/ImageServer" },
    { codigo: "73", url: "https://mapas2.igac.gov.co/image/rest/services/ott/tolima_alta/ImageServer" },
    { codigo: "76", url: "https://mapas2.igac.gov.co/image/rest/services/ott/valledelcauca_alta/ImageServer" },
    { codigo: "97", url: "https://mapas2.igac.gov.co/image/rest/services/ott/vaupes_alta/ImageServer" },
    { codigo: "99", url: "https://mapas2.igac.gov.co/image/rest/services/ott/vichada_alta/ImageServer" },
];

var dataRaster = [
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto0colombia8b/ImageServer", text: "Colombia", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto0colombia8b2024/ImageServer", text: "Colombia", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto81arauca8b/ImageServer", text: "Arauca", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto81arauca8b2024/ImageServer", text: "Arauca", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto08atlantico8b/ImageServer", text: "Atlántico", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto08atlantico8b2024/ImageServer", text: "Atlántico", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto08atlantico8b2025/ImageServer", text: "Atlántico", Año: "2025" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto91amazonas8b/ImageServer", text: "Amazonas", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto91amazonas8b2024/ImageServer", text: "Amazonas", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto05antioquia8b/ImageServer", text: "Antioquia", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto05antioquia8b2024/ImageServer", text: "Antioquia", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto13bolivar8b/ImageServer", text: "Bolívar", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto13bolivar8b2024/ImageServer", text: "Bolívar", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto13bolivar8b2025/ImageServer", text: "Bolívar", Año: "2025" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto15boyaca8b/ImageServer", text: "Boyacá", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto15boyaca8b2024/ImageServer", text: "Boyacá", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto15boyaca8b2025/ImageServer", text: "Boyacá", Año: "2025" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto17caldas8b/ImageServer", text: "Caldas", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto17caldas8b2024/ImageServer", text: "Caldas", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto17caldas8b2025/ImageServer", text: "Caldas", Año: "2025" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto18caqueta8b/ImageServer", text: "Caquetá", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto18caqueta8b2024/ImageServer", text: "Caquetá", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto85casanare8b/ImageServer", text: "Casanare", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto85casanare8b2024/ImageServer", text: "Casanare", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image2/rest/services/orto/orto85casanare8b2025/ImageServer", text: "Casanare", Año: "2025" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto19cauca8b/ImageServer", text: "Cauca", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto19cauca8b2024/ImageServer", text: "Cauca", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto20cesar8b/ImageServer", text: "Cesar", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto20cesar8b2024/ImageServer", text: "Cesar", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto20cesar8b2025/ImageServer", text: "Cesar", Año: "2025" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto27choco8b/ImageServer", text: "Chocó", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto27choco8b2024/ImageServer", text: "Chocó", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto23cordoba8b/ImageServer", text: "Córdoba", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto23cordoba8b2024/ImageServer", text: "Córdoba", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto23cordoba8b2025/ImageServer", text: "Córdoba", Año: "2025" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto25cundinamarca8b/ImageServer", text: "Cundinamarca", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto25cundinamarca8b2024/ImageServer", text: "Cundinamarca", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto94guainia8b/ImageServer", text: "Guainía", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto94guainia8b2024/ImageServer", text: "Guainía", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto94guainia8b2025/ImageServer", text: "Guainía", Año: "2025" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto95guaviare8b/ImageServer", text: "Guaviare", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto95guaviare8b2024/ImageServer", text: "Guaviare", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto95guaviare8b2025/ImageServer", text: "Guaviare", Año: "2025" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto41huila8b/ImageServer", text: "Huila", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto41huila8b2024/ImageServer", text: "Huila", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto44laguajira8b/ImageServer", text: "La Guajira", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto44laguajira8b2024/ImageServer", text: "La Guajira", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto44laguajira8b2025/ImageServer", text: "La Guajira", Año: "2025" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto47magdalena8b/ImageServer", text: "Magdalena", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto47magdalena8b2024/ImageServer", text: "Magdalena", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto47magdalena8b2025/ImageServer", text: "Magdalena", Año: "2025" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto50meta8b/ImageServer", text: "Meta", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto50meta8b2024/ImageServer", text: "Meta", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto50meta8b2025/ImageServer", text: "Meta", Año: "2025" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto52narino8b/ImageServer", text: "Nariño", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto52narino8b2024/ImageServer", text: "Nariño", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto54nortedesantander8b/ImageServer", text: "Norte de Santander", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto54nortedesantander8b2024/ImageServer", text: "Norte de Santander", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto86putumayo8b/ImageServer", text: "Putumayo", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto86putumayo8b2024/ImageServer", text: "Putumayo", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto63quindio8b/ImageServer", text: "Quindio", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto63quindio8b2024/ImageServer", text: "Quindio", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto66risaralda8b/ImageServer", text: "Risaralda", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto66risaralda8b2024/ImageServer", text: "Risaralda", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto88sanandres8b/ImageServer", text: "San Andrés y Providencia", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto88sanandres8b2024/ImageServer", text: "San Andrés y Providencia", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto88sanandres8b2025/ImageServer", text: "San Andrés y Providencia", Año: "2025" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto68santander8b/ImageServer", text: "Santander", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto68santander8b2024/ImageServer", text: "Santander", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto68santander8b2025/ImageServer", text: "Santander", Año: "2025" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto70sucre8b/ImageServer", text: "Sucre", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto70sucre8b2024/ImageServer", text: "Sucre", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto70sucre8b2025/ImageServer", text: "Sucre", Año: "2025" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto73tolima8b/ImageServer", text: "Tolima", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto73tolima8b2024/ImageServer", text: "Tolima", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto76valledelcauca8b/ImageServer", text: "Valle del Cauca", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto76valledelcauca8b2024/ImageServer", text: "Valle del Cauca", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto97vaupes8b/ImageServer", text: "Vaupés", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto97vaupes8b2024/ImageServer", text: "Vaupés", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto99vichada8b/ImageServer", text: "Vichada", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto99vichada8b2024/ImageServer", text: "Vichada", Año: "2024" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/orto99vichada8b2025/ImageServer", text: "Vichada", Año: "2025" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/ortoareaenlitigio8b/ImageServer", text: "Área en Litigio Cauca-Huila", Año: "2023" },
    { id: "https://mapas2.igac.gov.co/image/rest/services/orto/ortoareaenlitigio8b2024/ImageServer", text: "Área en Litigio Cauca-Huila", Año: "2024" },
];

var stats_idx = {
    NDVI: `//VERSION=3
    function setup() {
      return {
        input: ["B04", "B08", "SCL", "dataMask"],
        output: [{ id: "data", bands: 1 }, { id: "dataMask", bands: 1 }]
      };
    }

    function evaluatePixel(sample) {
      const NIR = sample.B08;
      const RED = sample.B04;

      let NDVI = index(NIR, RED)
      var validNDVIMask = 1;

      if (NIR + RED == 0) {
        validNDVIMask = 0;
      }

      var noWaterMask = 1;
      if (sample.SCL == 6) {
        noWaterMask = 0;
      }
      return {
        data: [NDVI],
        // Exclude nodata pixels, pixels where ndvi is not defined and water pixels from statistics:
        dataMask: [sample.dataMask * validNDVIMask * noWaterMask],
      };
    }`,
    GNDVI: `//VERSION=3
    function setup() {
      return {
        input: ["B03", "B08", "SCL", "dataMask"],
        output: [{ id: "data", bands: 1 }, { id: "dataMask", bands: 1 }]
      };
    }

    function evaluatePixel(sample) {
      const NIR = sample.B08;
      const GREEN = sample.B03;

      let GNDVI = index(NIR, GREEN)
      var validGNDVIMask = 1;

      if (NIR + GREEN == 0) {
        validGNDVIMask = 0;
      }

      var noWaterMask = 1;
      if (sample.SCL == 6) {
        noWaterMask = 0;
      }
      return {
        data: [GNDVI],
        // Exclude nodata pixels, pixels where ndvi is not defined and water pixels from statistics:
        dataMask: [sample.dataMask * validGNDVIMask * noWaterMask],
      };
    }`,
    EVI: `//VERSION=3
    function setup() {
      return {
        input: ["B02", "B04", "B08", "SCL", "dataMask"],
        output: [{ id: "data", bands: 1 }, { id: "dataMask", bands: 1 } ],
      };
    };

    function evaluatePixel(sample) {
      const NIR = sample.B08;
      const RED = sample.B04;
      const BLUE = sample.B02;
      
      let EVI = 2.5 * ((NIR - RED) / (NIR + (6 * RED) - (7.5 * BLUE) + 1));
      var validEVIMask = 1;

      if (NIR + 6 * RED - 7.5 * BLUE + 1 == 0) {
        validEVIMask = 0;
      }

      var noWaterMask = 1;
      if (sample.SCL == 6) {
        noWaterMask = 0;
      }

      return {
        data: [EVI],
        // Exclude nodata pixels, pixels where evi is not defined and water pixels from statistics:
        dataMask: [sample.dataMask * validEVIMask * noWaterMask],
      }
    }`,
    NDMI: `//VERSION=3
  function setup() {
      return {
          input: ["B8A", "B11", "SCL", "dataMask"],
          output: [{ id: "data", bands: 1 }, { id: "dataMask", bands: 1 }]
      };
  }

  function evaluatePixel(sample) {
    const NIR = sample.B8A;
    const SWIR =  sample.B11;

    let NDMI = index(NIR, SWIR)
    var validNDMIMask = 1;

    if (NIR + SWIR == 0) {
      validNDMIMask = 0;
    }


    return {
      data: [NDMI],
      // Exclude nodata pixels, pixels where ndmi is not defined
      dataMask: [sample.dataMask * validNDMIMask],
    };
  }`,
    SAVI: `//VERSION=3
  function setup() {
      return {
          input: ["B08", "B04", "SCL", "dataMask"],
          output: [{ id: "data", bands: 1 }, { id: "dataMask", bands: 1 }]
      };
  }

  function evaluatePixel(sample) {
    const NIR = sample.B08;
    const RED =  sample.B04;
    let L = 0.428; // L = soil brightness correction factor could range from (0 -1)



    let SAVI = (NIR - RED) / (NIR + RED + L) * (1.0 + L);
    var validSAVIMask = 1;

    if (NIR + RED + L == 0) {
      validSAVIMask = 0;
    }

    var noWaterMask = 1;
    if (sample.SCL == 6) {
      noWaterMask = 0;
    }

    return {
      data: [SAVI],
      // Exclude nodata pixels, pixels where ndmi is not defined and water pixels from statistics:
      dataMask: [sample.dataMask * validSAVIMask * noWaterMask],
    };
  }`,
    NDSI: `//VERSION=3
    function setup() {
      return {
        input: ["B03", "B11", "SCL", "dataMask"],
        output: [{ id: "data", bands: 1 }, { id: "dataMask", bands: 1 }]
      };
    }

    function evaluatePixel(sample) {
      const GREEN = sample.B03;
      const SWIR = sample.B11;

      let NDSI = index(GREEN, SWIR)
      var validNDSIMask = 1;

      if (GREEN + SWIR == 0) {
        validNDSIMask = 0;
      }

      var noWaterMask = 1;
      if (sample.SCL == 6) {
        noWaterMask = 0;
      }
      return {
        data: [NDSI],
        // Exclude nodata pixels, pixels where ndsi is not defined and water pixels from statistics:
        dataMask: [sample.dataMask * validNDSIMask * noWaterMask],
      };
    }`,
    NDWI: `//VERSION=3
    function setup() {
      return {
        input: ["B03", "B08", "SCL", "dataMask"],
        output: [{ id: "data", bands: 1 }, { id: "dataMask", bands: 1 }]
      };
    }

    function evaluatePixel(sample) {
      const GREEN = sample.B03;
      const NIR = sample.B08;

      let NDWI = index(GREEN, NIR)
      var validNDWIMask = 1;

      if (GREEN + NIR == 0) {
        validNDWIMask = 0;
      }

      return {
        data: [NDWI],
        // Exclude nodata pixels, pixels where ndsi is not defined and water pixels from statistics:
        dataMask: [sample.dataMask * validNDWIMask],
      };
    }`,
    NDBI: `//VERSION=3
    function setup() {
      return {
        input: ["B11", "B08", "SCL", "dataMask"],
        output: [{ id: "data", bands: 1 }, { id: "dataMask", bands: 1 }]
      };
    }

    function evaluatePixel(sample) {
      const SWIR = sample.B11;
      const NIR = sample.B08;

      let NDBI = index(SWIR, NIR)
      var validNDBIMask = 1;

      if (SWIR + NIR == 0) {
        validNDBIMask = 0;
      }
      
      var noWaterMask = 1;
      if (sample.SCL == 6) {
        noWaterMask = 0;
      }

      return {
        data: [NDBI],
        // Exclude nodata pixels, pixels where ndsi is not defined and water pixels from statistics:
        dataMask: [sample.dataMask * validNDBIMask * noWaterMask],
      };
    }`,
    NDCI: `//VERSION=3
    function setup() {
      return {
        input: ["B05", "B04", "SCL", "dataMask"],
        output: [{ id: "data", bands: 1 }, { id: "dataMask", bands: 1 }]
      };
    }

    function evaluatePixel(sample) {
      const RED_EDGE = sample.B05;
      const RED = sample.B04;

      let NDCI = index(RED_EDGE, RED)
      var validNDCIMask = 1;

      if (RED_EDGE + RED == 0) {
        validNDCIMask = 0;
      }

      return {
        data: [NDCI],
        // Exclude nodata pixels, pixels where ndci is not defined from statistics:
        dataMask: [sample.dataMask * validNDCIMask],
      };
    }`,
    NBR: `//VERSION=3
    function setup( ){
      return{
        input: [{
          bands: ["B02", "B03", "B04", "B08", "B11", "B12"],
            }],
            output: [{
              id: "default", bands: 1, sampleType: SampleType.FLOAT32},
            ]
            }
    }
      
    function evaluatePixel(sample) {

      let ndwi = (sample.B03 - sample.B08) / (sample.B03 + sample.B08)
      let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
      let indice = ((sample.B11 - sample.B12) /(sample.B11 + sample.B12))+(sample.B08);

      var burn;

      if (
        (indice > {{THRESHOLD}}) ||
        (sample.B02 > 0.1) ||
        (sample.B11 < 0.1) ||
        (ndvi > 0.3) ||
        (ndwi > 0.8)
      ) {
        burn = [0];
      } else {
        burn = [1];
      }

    return {
      default:[burn]
    }
    }
    `,
    NBR2: `
    //VERSION=3
    function setup() {
      return {
        input: [{
          bands: ["B02", "B03", "B04", "B08", "B11", "B12"],
        }],
        output: [
          { id: "default", bands: 3, sampleType: SampleType.AUTO }
        ]
      }
    }

    function evaluatePixel(sample) {

      let ndwi = (sample.B03 - sample.B08) / (sample.B03 + sample.B08)
      let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
      let indice = ((sample.B11 - sample.B12) / (sample.B11 + sample.B12)) + (sample.B08);

      var image;

      if (
        (indice > {{THRESHOLD}}) ||
        (sample.B02 > 0.1) ||
        (sample.B11 < 0.1) ||
        (ndvi > 0.3) ||
        (ndwi > 0.8)
      ) {
        image = [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
      } else {
        image = [1, 0, 0];
      }
      return {
        default: image,   
      }
    }
        
    `,
    MAP_DEFORESTATION: `//VERSION=3
    
  // Thresholds and constants
  const NDVI_THRESHOLD = 0.3; // Minimum NDVI difference between periods
  const NDWI_THRESHOLD = 0.5; // Threshold to classify water using NDWI
  const BRIGHTNESS_THRESHOLD = 0.18; // Reflectance threshold for Blue band
  const WINDOW_DAYS = 10; // Time window for averaging NDVI
  const CLOUD_PROBABILITY_THRESHOLD = 0.5;

  function setup() {
  return {
    input: [
      {
        bands: ["B02", "B03", "B04", "B08", "CLD"],
      },
    ],
    output: [
      {
        id: "default",
        bands: 1,
        sampleType: "UINT8"
      }
    ],
    mosaicking: "ORBIT",
  };
  }

  function evaluatePixel(samples, scenes) {
    // Sort scenes to find the most recent and oldest
    const sortedScenes = scenes.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
    const recentDate = sortedScenes[0].date;
    const oldestDate = sortedScenes[sortedScenes.length - 1].date;

    // Filter scenes within the n-day window for recent and oldest periods
    const recentWindowScenes = sortedScenes.filter(
      (scene) =>
        recentDate.getTime() - scene.date.getTime() <=
        WINDOW_DAYS * 24 * 3600 * 1000
    );
    const oldestWindowScenes = sortedScenes.filter(
      (scene) =>
        scene.date.getTime() - oldestDate.getTime() <=
        WINDOW_DAYS * 24 * 3600 * 1000
    );

    // Calculate mean NDVI for the recent and oldest windows
    function calculateMeanNDVI(scenesArray) {
      let sumNDVI = 0;
      let count = 0;
      scenesArray.forEach((scene) => {
        const sample = samples[scenes.indexOf(scene)];
        if (sample && !isCloudOrWater(sample)) {
          const ndvi = index(sample.B08, sample.B04);
          sumNDVI += ndvi;
          count += 1;
        }
      });
      // if the ndvi was not calculated because of cloud or water the function return null
      return count > 0 ? sumNDVI / count : null;
    }

    // Helper function to detect clouds using Blue and CLD
    function isCloudOrWater(sample) {
      const brightness = sample.B02; // Blue band reflectance
      const cloudProb = sample.CLD; // Cloud probability, based on Sen2Cor processor
      const NDWI = index(sample.B03, sample.B08);

      // Clouds: High reflectance in Blue or high CLD
      const isCloud =
        brightness > BRIGHTNESS_THRESHOLD || cloudProb > CLOUD_PROBABILITY_THRESHOLD;

      // Water: NDWI above threshold
      const isWater = NDWI >= NDWI_THRESHOLD;

      return isCloud || isWater;
    }

    const recentMeanNDVI = calculateMeanNDVI(recentWindowScenes);
    const oldestMeanNDVI = calculateMeanNDVI(oldestWindowScenes);

    const ndviDifference =
      recentMeanNDVI !== null && oldestMeanNDVI !== null
        ? oldestMeanNDVI - recentMeanNDVI
        : 0;

    // Initialize result values
    let deforestation = 0;


    if (ndviDifference >= NDVI_THRESHOLD) {
      deforestation = 1; // Deforestation detected
    }

    // Return values with water and cloud masking
    if (deforestation === 1) {
      return {
        default: [1], // Deforestation detected
      };
    } else {
      return {
        default: [0], // No significant change
      };
    }
  }
      `,
};

var print_service = "https://mapas2.igac.gov.co/server/rest/services/otros/serviciodeimpresionott/GPServer/Export%20Web%20Map";
//var print_service = "https://mapas2.igac.gov.co/server/rest/services/otros/serviciodeimpresionott_v2/GPServer/Export%20Web%20Map";
//var print_service = "https://mapas.igac.gov.co/server/rest/services/otros/serviciodeimpresion/GPServer/Export%20Web%20Map";
var sh_stats = "https://services.sentinel-hub.com/api/v1/statistics";
var sh_image_stats = "https://services.sentinel-hub.com/api/v1/process";
var debugIndices = false;
//var web_service = "http://localhost:8080/Geovisor_IGAC";
var web_service = "https://serviciosgeovisor.igac.gov.co:8080/Geovisor";
//var web_service = "http://172.19.3.37:8080/Geovisor";
var web_service_proxy = "https://serviciosgeovisor.igac.gov.co:8080/Geovisor";
var thumb_service = "https://mapas2.igac.gov.co/image/rest/services/ott/amazonas_alta/ImageServer";
var runtimeEnv = window.__env || {};
var isLocalHost = ["localhost", "127.0.0.1"].indexOf(window.location.hostname) !== -1;
var planetApiKey = runtimeEnv.planetApiKey || "PLAKd9faf25449294d9d86096fe33d980662";
var usePlanetDirect = planetApiKey != null && planetApiKey !== "";
var planetAnalyticsBoundaryUrl = runtimeEnv.planetAnalyticsBoundaryUrl || "data/planet-analytics-limites.geojson";
var planetAnalyticsLocalUrl = runtimeEnv.planetAnalyticsLocalUrl || "data/reportes/resultado_unido_total.geojson";
var planetAnalyticsMunicipalityUrl = runtimeEnv.planetAnalyticsMunicipalityUrl || "data/limite-municipal.geojson";
var planetAnalyticsDepartmentUrl = runtimeEnv.planetAnalyticsDepartmentUrl || "data/limite-departamental.geojson";
var planetTileProxyUrl = runtimeEnv.planetTileProxyUrl || null;
var prismaApiBaseUrl = runtimeEnv.prismaApiBaseUrl || "https://prisma.procalculo.com";
var prismaTokenProxyUrl = runtimeEnv.prismaTokenProxyUrl || "";
var prismaFallbackApiBaseUrl = runtimeEnv.prismaFallbackApiBaseUrl || "";
var prismaFallbackTokenProxyUrl = runtimeEnv.prismaFallbackTokenProxyUrl || "";
var prismaActiveApiBaseUrl = prismaApiBaseUrl;
var sentinelHubAccessTokenLocal = runtimeEnv.sentinelHubAccessToken || null;
var sentinelHubClientId = runtimeEnv.sentinelHubClientId || null;
var sentinelHubClientSecret = runtimeEnv.sentinelHubClientSecret || null;
var sentinelHubOAuthTokenUrl = runtimeEnv.sentinelHubOAuthTokenUrl || "https://services.sentinel-hub.com/oauth/token";
var sentinelHubUseDirectToken = runtimeEnv.sentinelHubUseDirectToken === true;
var sentinelHubTokenProxyUrl = runtimeEnv.sentinelHubTokenProxyUrl || "/sh-token";
var sentinelHubProcessProxyUrl = runtimeEnv.sentinelHubProcessProxyUrl || "/get-image";
var sentinelHubCatalogProxyUrl = runtimeEnv.sentinelHubCatalogProxyUrl || "/get-catalog";
var sentinelHubImageProxyUrl = runtimeEnv.sentinelHubImageProxyUrl || runtimeEnv.sentinelHubProcessProxyUrl || "/get-image";
var rasterMosaicByocCollection = runtimeEnv.rasterMosaicByocCollection || "byoc-7c1511e7-42fd-41ee-925a-bedb3c24cc44";
var rasterMosaicLayer = null;
var rasterMosaicObjectUrl = null;
var activeRasterMosaicImages = {};
var activeRasterMosaicFootprints = {};
var rasterMosaicCurrentAoi = null;
var rasterMosaicCurrentIdx = "TrueColor";
var rasterMosaicFullDatasetIdx = "FullDataset8Bands";
var rasterMosaicFullDatasetDownloadScript = `//VERSION=3
function setup() {
  return {
    input: [{
      bands: ["coastal_blue", "blue", "green", "green_i", "yellow", "red", "rededge", "nir", "dataMask"],
      units: "DN"
    }],
    output: [{ id: "default", bands: 8, sampleType: "FLOAT32" }]
  };
}
function cleanBand(value) {
  if (!isFinite(value) || value <= 0 || value > 10000) {
    return NaN;
  }
  return value;
}
function evaluatePixel(sample) {
  if (sample.dataMask === 0) {
    return { default: [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN] };
  }
  return {
    default: [
      cleanBand(sample.coastal_blue),
      cleanBand(sample.blue),
      cleanBand(sample.green),
      cleanBand(sample.green_i),
      cleanBand(sample.yellow),
      cleanBand(sample.red),
      cleanBand(sample.rededge),
      cleanBand(sample.nir)
    ]
  };
}`;

var rasterMosaicIdxScripts = {
    FullDataset8Bands: `//VERSION=3
    function setup() {
      return {
        input: [{
          bands: ["blue", "green", "red", "dataMask"],
          units: "DN"
        }],
        output: [{ id: "default", bands: 4, sampleType: "UINT8" }]
      };
    }
    function clamp255(value) {
      return Math.min(Math.max(Math.round(value), 0), 255);
    }
    function isNoData(value) {
      return !isFinite(value) || value <= 0 || value > 10000;
    }
    function planetReflectanceStretch(value, gain, gamma) {
      var normalized = Math.min(Math.max((value / 10000) * gain, 0), 1);
      return clamp255(255 * Math.pow(normalized, gamma));
    }
    function evaluatePixel(sample) {
      if (sample.dataMask === 0 || isNoData(sample.red) || isNoData(sample.green) || isNoData(sample.blue)) {
        return { default: [0, 0, 0, 0] };
      }
      return {
        default: [
          planetReflectanceStretch(sample.red, 4.5, 0.85),
          planetReflectanceStretch(sample.green, 4.5, 0.85),
          planetReflectanceStretch(sample.blue, 4.5, 0.9),
          255
        ]
      };
    }`,
    TrueColor: `//VERSION=3
    function setup() {
      return {
        input: [{
          bands: ["blue", "green", "red", "dataMask"],
          units: "DN"
        }],
        output: [{ id: "default", bands: 4, sampleType: "UINT8" }]
      };
    }
    function clamp255(value) {
      return Math.min(Math.max(Math.round(value), 0), 255);
    }
    function isNoData(value) {
      return !isFinite(value) || value <= 0 || value > 10000;
    }
    function planetReflectanceStretch(value, gain, gamma) {
      var normalized = Math.min(Math.max((value / 10000) * gain, 0), 1);
      return clamp255(255 * Math.pow(normalized, gamma));
    }
    function evaluatePixel(sample) {
      if (sample.dataMask === 0 || isNoData(sample.red) || isNoData(sample.green) || isNoData(sample.blue)) {
        return { default: [0, 0, 0, 0] };
      }
      return {
        default: [
          planetReflectanceStretch(sample.red, 4.5, 0.85),
          planetReflectanceStretch(sample.green, 4.5, 0.85),
          planetReflectanceStretch(sample.blue, 4.5, 0.9),
          255
        ]
      };
    }`,
    FalseColor: `//VERSION=3
    function setup() {
      return {
        input: [{
          bands: ["nir", "red", "green", "dataMask"],
          units: "DN"
        }],
        output: [{ id: "default", bands: 4, sampleType: "UINT8" }]
      };
    }
    function clamp255(value) {
      return Math.min(Math.max(Math.round(value), 0), 255);
    }
    function isNoData(value) {
      return !isFinite(value) || value <= 0 || value > 10000;
    }
    function planetReflectanceStretch(value, gain, gamma) {
      var normalized = Math.min(Math.max((value / 10000) * gain, 0), 1);
      return clamp255(255 * Math.pow(normalized, gamma));
    }
    function evaluatePixel(sample) {
      if (sample.dataMask === 0 || isNoData(sample.nir) || isNoData(sample.red) || isNoData(sample.green)) {
        return { default: [0, 0, 0, 0] };
      }
      return {
        default: [
          planetReflectanceStretch(sample.nir, 3.5, 0.85),
          planetReflectanceStretch(sample.red, 4.5, 0.85),
          planetReflectanceStretch(sample.green, 4.5, 0.85),
          255
        ]
      };
    }`,
    NDVI: `//VERSION=3
    function setup() {
      return {
        input: [{ bands: ["nir", "red", "dataMask"], units: "DN" }],
        output: [{ id: "default", bands: 4, sampleType: "UINT8" }]
      };
    }
    function clamp255(value) { return Math.min(Math.max(Math.round(value), 0), 255); }
    function isNoData(value) { return !isFinite(value) || value <= 0 || value > 10000; }
    function normalizedDifference(a, b) {
      return (a + b) === 0 ? null : (a - b) / (a + b);
    }
    function vegetationRamp(value) {
      if (value === null || !isFinite(value)) return [0, 0, 0, 0];
      var t = Math.min(Math.max((value + 1) / 2, 0), 1);
      if (t < 0.5) {
        var k1 = t / 0.5;
        return [clamp255(160 + 80 * k1), clamp255(80 + 140 * k1), clamp255(35 + 15 * k1), 255];
      }
      var k2 = (t - 0.5) / 0.5;
      return [clamp255(240 - 210 * k2), clamp255(220 - 80 * k2), clamp255(50 + 20 * k2), 255];
    }
    function evaluatePixel(sample) {
      if (sample.dataMask === 0 || isNoData(sample.nir) || isNoData(sample.red)) return { default: [0, 0, 0, 0] };
      return { default: vegetationRamp(normalizedDifference(sample.nir, sample.red)) };
    }`,
    GNDVI: `//VERSION=3
    function setup() {
      return {
        input: [{ bands: ["nir", "green", "dataMask"], units: "DN" }],
        output: [{ id: "default", bands: 4, sampleType: "UINT8" }]
      };
    }
    function clamp255(value) { return Math.min(Math.max(Math.round(value), 0), 255); }
    function isNoData(value) { return !isFinite(value) || value <= 0 || value > 10000; }
    function normalizedDifference(a, b) {
      return (a + b) === 0 ? null : (a - b) / (a + b);
    }
    function vegetationRamp(value) {
      if (value === null || !isFinite(value)) return [0, 0, 0, 0];
      var t = Math.min(Math.max((value + 1) / 2, 0), 1);
      if (t < 0.5) {
        var k1 = t / 0.5;
        return [clamp255(160 + 80 * k1), clamp255(80 + 140 * k1), clamp255(35 + 15 * k1), 255];
      }
      var k2 = (t - 0.5) / 0.5;
      return [clamp255(240 - 210 * k2), clamp255(220 - 80 * k2), clamp255(50 + 20 * k2), 255];
    }
    function evaluatePixel(sample) {
      if (sample.dataMask === 0 || isNoData(sample.nir) || isNoData(sample.green)) return { default: [0, 0, 0, 0] };
      return { default: vegetationRamp(normalizedDifference(sample.nir, sample.green)) };
    }`,
    EVI: `//VERSION=3
    function setup() {
      return {
        input: [{ bands: ["blue", "red", "nir", "dataMask"], units: "DN" }],
        output: [{ id: "default", bands: 4, sampleType: "UINT8" }]
      };
    }
    function clamp255(value) { return Math.min(Math.max(Math.round(value), 0), 255); }
    function isNoData(value) { return !isFinite(value) || value <= 0 || value > 10000; }
    function reflectance(value) { return value / 10000; }
    function vegetationRamp(value) {
      if (value === null || !isFinite(value)) return [0, 0, 0, 0];
      var t = Math.min(Math.max((value + 1) / 2, 0), 1);
      if (t < 0.5) {
        var k1 = t / 0.5;
        return [clamp255(160 + 80 * k1), clamp255(80 + 140 * k1), clamp255(35 + 15 * k1), 255];
      }
      var k2 = (t - 0.5) / 0.5;
      return [clamp255(240 - 210 * k2), clamp255(220 - 80 * k2), clamp255(50 + 20 * k2), 255];
    }
    function evaluatePixel(sample) {
      if (sample.dataMask === 0 || isNoData(sample.nir) || isNoData(sample.red) || isNoData(sample.blue)) return { default: [0, 0, 0, 0] };
      var nir = reflectance(sample.nir);
      var red = reflectance(sample.red);
      var blue = reflectance(sample.blue);
      var denominator = nir + 6 * red - 7.5 * blue + 1;
      var evi = denominator === 0 ? null : 2.5 * ((nir - red) / denominator);
      return { default: vegetationRamp(evi) };
    }`,
    SAVI: `//VERSION=3
    function setup() {
      return {
        input: [{ bands: ["nir", "red", "dataMask"], units: "DN" }],
        output: [{ id: "default", bands: 4, sampleType: "UINT8" }]
      };
    }
    function clamp255(value) { return Math.min(Math.max(Math.round(value), 0), 255); }
    function isNoData(value) { return !isFinite(value) || value <= 0 || value > 10000; }
    function reflectance(value) { return value / 10000; }
    function vegetationRamp(value) {
      if (value === null || !isFinite(value)) return [0, 0, 0, 0];
      var t = Math.min(Math.max((value + 1) / 2, 0), 1);
      if (t < 0.5) {
        var k1 = t / 0.5;
        return [clamp255(160 + 80 * k1), clamp255(80 + 140 * k1), clamp255(35 + 15 * k1), 255];
      }
      var k2 = (t - 0.5) / 0.5;
      return [clamp255(240 - 210 * k2), clamp255(220 - 80 * k2), clamp255(50 + 20 * k2), 255];
    }
    function evaluatePixel(sample) {
      if (sample.dataMask === 0 || isNoData(sample.nir) || isNoData(sample.red)) return { default: [0, 0, 0, 0] };
      var nir = reflectance(sample.nir);
      var red = reflectance(sample.red);
      var L = 0.428;
      var denominator = nir + red + L;
      var savi = denominator === 0 ? null : ((nir - red) / denominator) * (1 + L);
      return { default: vegetationRamp(savi) };
    }`,
    NDWI: `//VERSION=3
    function setup() {
      return {
        input: [{ bands: ["green", "nir", "dataMask"], units: "DN" }],
        output: [{ id: "default", bands: 4, sampleType: "UINT8" }]
      };
    }
    function clamp255(value) { return Math.min(Math.max(Math.round(value), 0), 255); }
    function isNoData(value) { return !isFinite(value) || value <= 0 || value > 10000; }
    function normalizedDifference(a, b) {
      return (a + b) === 0 ? null : (a - b) / (a + b);
    }
    function waterRamp(value) {
      if (value === null || !isFinite(value)) return [0, 0, 0, 0];
      var t = Math.min(Math.max((value + 1) / 2, 0), 1);
      return [
        clamp255(210 - 190 * t),
        clamp255(190 - 80 * t),
        clamp255(90 + 165 * t),
        255
      ];
    }
    function evaluatePixel(sample) {
      if (sample.dataMask === 0 || isNoData(sample.green) || isNoData(sample.nir)) return { default: [0, 0, 0, 0] };
      return { default: waterRamp(normalizedDifference(sample.green, sample.nir)) };
    }`,
    NDCI: `//VERSION=3
    function setup() {
      return {
        input: [{ bands: ["rededge", "red", "dataMask"], units: "DN" }],
        output: [{ id: "default", bands: 4, sampleType: "UINT8" }]
      };
    }
    function clamp255(value) { return Math.min(Math.max(Math.round(value), 0), 255); }
    function isNoData(value) { return !isFinite(value) || value <= 0 || value > 10000; }
    function normalizedDifference(a, b) {
      return (a + b) === 0 ? null : (a - b) / (a + b);
    }
    function chlorophyllRamp(value) {
      if (value === null || !isFinite(value)) return [0, 0, 0, 0];
      var t = Math.min(Math.max((value + 1) / 2, 0), 1);
      return [
        clamp255(65 + 155 * t),
        clamp255(40 + 195 * t),
        clamp255(150 - 120 * t),
        255
      ];
    }
    function evaluatePixel(sample) {
      if (sample.dataMask === 0 || isNoData(sample.rededge) || isNoData(sample.red)) return { default: [0, 0, 0, 0] };
      return { default: chlorophyllRamp(normalizedDifference(sample.rededge, sample.red)) };
    }`
};

function getPlanetAuthorizationHeader() {
    return { Authorization: "Basic " + btoa(planetApiKey + ":") };
}

function buildPlanetUrl(path) {
    var separator = path.indexOf("?") === -1 ? "?" : "&";
    return "https://api.planet.com" + path + separator + "api_key=" + encodeURIComponent(planetApiKey);
}

function createSHAnalyticsTileLayer(mosaicId, options) {
    options = options || {};
    if (usePlanetDirect && planetApiKey && options.forceProxy !== true) {
        return new esri.WebTiledLayer("https://tiles.planet.com/basemaps/v1/planet-tiles/" + mosaicId + "/gmap/${z}/${x}/${y}.png?api_key=" + encodeURIComponent(planetApiKey));
    }
    return new esri.WebTiledLayer(web_service + "/imagenes2?cmd=tile&ID=" + mosaicId + "&Z=${z}&X=${x}&Y=${y}&token=" + currentAccessToken);
}

var tableSearchBni;
var tableSearchBni2;

var searchCurrent = null;
var cacheUnidades = [];
var cacheEntidades = [];
var cachePermisos = [];

var searchImageLayer;
var searchImageLayerDetalle;
var searchImageSwipeDetalle;
var searchGraphicsLayer;
var searchGraphicsLayerDetalle;

var currentImagenInicial;
var extentInicial;

var searchImagenSymbol;
var searchImagenActiveSymbol;
var searchCoberturaSymbol;

var currentImagen;
var dibujoLayer;
var currentDibujoMode;

var currentSlide;
var videoSlide;
var canvasVideo;
var ctxVideo;
var mediaRecorder;
var chunks;
var cVideoFrame;
var cX;
var cY;
var cXmin;
var cXmax;
var cYmin;
var cYmax;
var cSizeX;
var cSizeY;
var videoLogo1;
var videoLogo2;
var videoConfig = { type: "video/webm", bitsPerSecond: 40000000 };

var currentRaster;
var rasterParamsDesvPercentage;
var rasterParamsPercentage1;
var rasterParamsPercentage2;
var rasterParamsGammaPercentage;
var rasterImageSwipe;

var currentSHToken;
var currentSHUrl = null;
var currentSHLayers = [];
var currentSHData = [];
var currentSHStatsLabels = null;
var currentSearchArea;
var currentSearchArea2;
var sliderSHStats;
var sliderCCSHStats;
var sliderCCSHStatsIndex;
var sliderPrismaCloud;
var shStatsUrl = "https://services.sentinel-hub.com/ogc/wms/c81e0966-8e7c-4f23-951c-04a33a8c72a7?";
var currentSHDataLayers = null;
var currentSHAnalyticsSuscriptions = [];
var currentSHAnalyticsLocalFeatures = null;
var currentSHAnalyticsLocalFeaturesLoading = false;
var currentSHAnalyticsData = [];
var currentSHAnalyticsAllData = [];
var currentSHAnalyticsNextUrl = null;
var currentSHAnalyticsTotalCount = null;
var currentSHAnalyticsLayer;
var currentSHAnalyticsHexLayer;
var currentSHAnalyticsBoundaryLayer;
var currentSHAnalyticsAdminLayer;
var currentSHAnalyticsBoundariesLoaded = false;
var currentSHAnalyticsBoundariesLoading = false;
var currentSHAnalyticsBGLayer;
var currentSHAnalyticsChange;
var currentSHAnalyticsID;
var currentSHAnalyticsClickHandle = null;
var currentSHAnalyticsHoverHandle = null;
var currentSHAnalyticsHoverOutHandle = null;
var currentSHAnalyticsPolygonClickHandle = null;
var currentSHAnalyticsSelectedIndex = null;
var currentSHAnalyticsSelectedHexKey = null;
var currentSHAnalyticsMunicipalities = [];
var currentSHAnalyticsMunicipalitiesLoaded = false;
var currentSHAnalyticsMunicipalitiesLoading = false;
var currentSHAnalyticsDepartments = [];
var currentSHAnalyticsDepartmentsLoaded = false;
var currentSHAnalyticsDepartmentsLoading = false;
var currentSHAnalyticsMunicipalityStats = [];
var currentSHAnalyticsDepartmentStats = [];
var currentSHAnalyticsAdminLevel = "department";
var currentSHAnalyticsDateFilter = { min: null, max: null, start: null, end: null };
var currentSHAnalyticsDateFilterUserChanged = false;
var currentSHAnalyticsLoadRequestId = 0;
var SH_ANALYTICS_HEX_SIDE_METERS = 8000;
var SH_ANALYTICS_HEX_PALETTES = {
    building: {
        veryLow: { label: "Muy bajo", color: [242, 240, 247, 0.58] },
        low: { label: "Bajo", color: [203, 201, 226, 0.6] },
        medium: { label: "Medio", color: [158, 154, 200, 0.62] },
        high: { label: "Alto", color: [117, 107, 177, 0.66] },
        veryHigh: { label: "Muy alto", color: [84, 39, 143, 0.7] },
    },
    road: {
        veryLow: { label: "Muy bajo", color: [254, 229, 217, 0.58] },
        low: { label: "Bajo", color: [252, 187, 161, 0.6] },
        medium: { label: "Medio", color: [252, 146, 114, 0.62] },
        high: { label: "Alto", color: [222, 45, 38, 0.66] },
        veryHigh: { label: "Muy alto", color: [165, 15, 21, 0.7] },
    },
};

var currentPrismaLayer;
var currentSHLayer;
var lastProcessedSHResult = null;
var burnsLayerClickHandle = null;
var burnsGalleryMaps = [];
var burnsCompareMap = null;
var burnsCompareSwipe = null;
var burnsGallerySyncing = false;
var burnsGallerySyncHandles = [];
var cachePrisma;
var LOCAL_NO_LOGIN = ["localhost", "127.0.0.1"].indexOf(window.location.hostname) !== -1;

$(document).ready(function () {
    //$("#modalMantenimiento").modal("show");
    initMap();
    bindRasterMosaicCleanupTriggers();
    $("[data-toggle='popover']").popover();
    toggleMenu(currentEstado);

    if (LOCAL_NO_LOGIN) {
        currentUser = {
            displayName: "Modo local",
            email: "Login deshabilitado",
            photoURL: "../images/login_1.png"
        };
        currentAccessToken = "";
        $("#loginContainer").hide();
        $("#logoutContainer").hide();
        $("#userName,#userName2").html("Modo local</br><span style='font-style:italic;'>Login deshabilitado</span>");
        $("#userPhoto,#userPhoto2").attr("src", "../images/login_1.png");
        $(".calcite-map").show();
        $.ajax({
            url: web_service + "/config?cmd=config_imagenes&t=" + new Date().getTime(),
            type: "POST",
            success: function (data) {
                if (data.status) {
                    initData(data);
                }
            },
            timeout: 20000,
            error: function (err) {
                console.error(err);
            },
        });
        return;
    }

    var config = {
        apiKey: "AIzaSyCLSp_Qbaohj8owxrpZxvrmxUSkVw0ukig",
        authDomain: "geovisor-igac.firebaseapp.com",
    };
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(
        function (user) {
            if (user) {
                currentUser = user;
                $("#loginContainer").hide();
                $("#logoutContainer").show();
                $("#userName,#userName2").html(user.displayName + "</br><span style='font-style:italic;'>" + user.email + "</span>");
                if (user.photoURL != null) {
                    if (user.photoURL != "") {
                        $("#userPhoto,#userPhoto2").attr("src", user.photoURL);
                    } else {
                        $("#userPhoto,#userPhoto2").attr("src", "../images/login_1.png");
                    }
                } else {
                    $("#userPhoto,#userPhoto2").attr("src", "../images/login_1.png");
                }
                currentUser.getIdToken().then(function (accessToken) {
                    currentAccessToken = accessToken;
                    $.ajax({
                        url: web_service + "/validate2?token=" + currentAccessToken + "&t=" + new Date().getTime(),
                        type: "GET",
                        dataType: "json",
                        success: function (data) {
                            if (data.status) {
                                var first = "";
                                cachePermisos = data.permisos;
                                if (cachePermisos.indexOf("IMAGENES_PLANET") != -1 || cachePermisos.indexOf("IMAGENES_ALTA") != -1) {
                                    $(".calcite-map").show();
                                    var params = "";
                                    $.ajax({
                                        url: web_service + "/config?cmd=config_imagenes&t=" + new Date().getTime() + params,
                                        type: "POST",
                                        success: function (data) {
                                            if (data.status) {
                                                initData(data);
                                            }
                                        },
                                        timeout: 20000,
                                        error: function (err) {
                                            console.error(err);
                                        },
                                    });
                                } else {
                                }
                            } else {
                                $("#modalLicencia").modal({ backdrop: "static", keyboard: false }, "show");
                            }
                        },
                        error: function (xhr, status, error) {
                            $.confirm({
                                title: "Observatorio de la tierra y el territorio",
                                content: "No se pudo validar si el usuario tiene permisos para esta funcionalidad, por favor, intente nuevamente",
                                buttons: {
                                    Ok: function () {
                                        window.location.href = "/";
                                    },
                                },
                            });
                        },
                    });
                });
            } else {
                currentUser = null;
                currentFuncionalidades = [];
                $("#logoutContainer").hide();
                $("#loginContainer").show();
                $("#userName,#userName2").html("Iniciar sesion");
                $("#userPhoto,#userPhoto2").attr("src", "../images/login_1.png");
                gotoLogin();
            }
        },
        function (error) {
            console.log(error);
        },
    );
    firebase_ui = new firebaseui.auth.AuthUI(firebase.auth());
    $('[data-toggle="tooltip"]').tooltip();
    $.fn.DataTable.ext.pager.numbers_length = 5;
    $(".shareLink").tooltip({
        container: "body",
        template: '<div class="tooltipX" role="tooltip"><div class="tooltip-arrowX"></div><div class="tooltip-innerX">Click para copiar el Link</div></div>',
    });
    slider = $("#searchImagenesCloud").slider({
        formatter: function (value) {
            $("#searchImagenesCloudTxt").html(value + "%");
            return value + "%";
        },
    });
    rasterParamsDesvPercentage = $("#rasterParamsDesvPercentage").slider({
        formatter: function (value) {
            $("#rasterParamsDesvPercentageTxt").html(value);
            return value;
        },
    });
    rasterParamsPercentage1 = $("#rasterParamsPercentage1").slider({
        formatter: function (value) {
            $("#rasterParamsPercentage1Txt").html(value + "%");
            return value + "%";
        },
    });
    rasterParamsPercentage2 = $("#rasterParamsPercentage2").slider({
        formatter: function (value) {
            $("#rasterParamsPercentage2Txt").html(value + "%");
            return value + "%";
        },
    });
    rasterParamsGammaPercentage = $("#rasterParamsGammaPercentage").slider({
        formatter: function (value) {
            $("#rasterParamsGammaPercentageTxt").html(value);
            return value;
        },
    });
    $(".shareLink").on("shown.bs.tooltip", function () {
        $(".tooltip-arrowX").css("border-right-color", "#3168E4");
        $(".tooltip-innerX").css("background-color", "#3168E4");
        $(".tooltip-innerX").html("Click para copiar el Link");
    });
    sliderCCSHStats = new Slider("#sliderCCSHStats", {
        formatter: function (value) {
            syncSHCloudCoverageDisplay(value);
            return Array.isArray(value) ? value[0] + "% - " + value[1] + "%" : value + "%";
        },
    });
    sliderCCSHStats.on("slide", syncSHCloudCoverageDisplay);
    sliderCCSHStats.on("change", function (evt) {
        syncSHCloudCoverageDisplay(evt && evt.newValue !== undefined ? evt.newValue : getSliderValueSafe(sliderCCSHStats, "#sliderCCSHStats", [0, 100]));
    });
    $("#sliderCCSHStatsMinTxt, #sliderCCSHStatsMaxTxt").on("change blur", function () {
        setSHCloudCoverageRangeFromInputs();
    });
    syncSHCloudCoverageDisplay(getSliderValueSafe(sliderCCSHStats, "#sliderCCSHStats", [0, 100]));
    sliderCCSHStatsIndex = null;
    setSHStatsIndexThreshold(0.15);
    $("#txtSHStatsIndexThreshold").on("change blur", function () {
        setSHStatsIndexThreshold($(this).val());
    });
});

function closeLicencia() {
    window.location.href = "https://www.colombiaenmapas.gov.co/observatoriotierrayterritorio";
}

function closeLicencia2() {
    $("#modalLicencia2").modal("hide");
}

function acceptLicencia() {
    if ($("#licenciaEntidad").val() == null || $("#licenciaEntidad").val() == "") {
        $("#licenciaAlerta").show();
        return;
    }
    if ($("#licenciaSolicitante").val() == null || $("#licenciaSolicitante").val() == "") {
        $("#licenciaAlerta").show();
        return;
    }
    if ($("#licenciaCorreo").val() == null || $("#licenciaCorreo").val() == "") {
        $("#licenciaAlerta").show();
        return;
    }
    if ($("#licenciaProyecto").val() == null || $("#licenciaProyecto").val() == "") {
        $("#licenciaAlerta").show();
        return;
    }
    if (currentUser != null) {
        currentUser
            .getIdToken()
            .then(function (currentAccessToken) {
                var params = {};
                params.PRODUCTO = "OTT";
                params.ENTIDAD = $("#licenciaEntidad").val();
                params.SOLICITANTE = $("#licenciaSolicitante").val();
                params.CORREO = $("#licenciaCorreo").val();
                params.PROYECTO = $("#licenciaProyecto").val();
                $.ajax({
                    url: web_service + "/servicios?cmd=licencia2&token=" + currentAccessToken + "&t=" + new Date().getTime(),
                    data: params,
                    type: "POST",
                    success: function (data) {
                        if (data.status) {
                            $.confirm({
                                title: "Observatorio de la tierra y el territorio",
                                content: "Datos enviados correctamente",
                                buttons: {
                                    Ok: function () {
                                        closeLicencia();
                                    },
                                },
                            });
                        } else {
                            $.confirm({
                                title: "Observatorio de la tierra y el territorio",
                                content: "No se pudieron enviar los datos",
                                buttons: {
                                    Ok: function () {},
                                },
                            });
                        }
                    },
                    error: function (_data) {
                        $.confirm({
                            title: "Observatorio de la tierra y el territorio",
                            content: "No se pudieron enviar los datos",
                            buttons: {
                                Ok: function () {},
                            },
                        });
                    },
                });
            })
            .catch(function (_error) {
                $.confirm({
                    title: "Observatorio de la tierra y el territorio",
                    content: "No se pudieron enviar los datos",
                    buttons: {
                        Ok: function () {},
                    },
                });
            });
    }
}

function acceptLicencia2() {
    if ($("#licenciaEntidad2").val() == null || $("#licenciaEntidad2").val() == "") {
        $("#licenciaAlerta2").show();
        return;
    }
    if ($("#licenciaSolicitante2").val() == null || $("#licenciaSolicitante2").val() == "") {
        $("#licenciaAlerta2").show();
        return;
    }
    if ($("#licenciaCorreo2").val() == null || $("#licenciaCorreo2").val() == "") {
        $("#licenciaAlerta2").show();
        return;
    }
    if ($("#licenciaProyecto2").val() == null || $("#licenciaProyecto2").val() == "") {
        $("#licenciaAlerta2").show();
        return;
    }
    if ($("#licenciaNombre2").val() == null || $("#licenciaNombre2").val() == "") {
        $("#licenciaAlerta2").show();
        return;
    }
    if (currentUser != null) {
        currentUser
            .getIdToken()
            .then(function (currentAccessToken) {
                var params = {};
                params.PRODUCTO = $("#licenciaNombre2").val();
                params.ENTIDAD = $("#licenciaEntidad2").val();
                params.SOLICITANTE = $("#licenciaSolicitante2").val();
                params.CORREO = $("#licenciaCorreo2").val();
                params.PROYECTO = $("#licenciaProyecto2").val();
                $.ajax({
                    url: web_service + "/servicios?cmd=licencia3&token=" + currentAccessToken + "&t=" + new Date().getTime(),
                    data: params,
                    type: "POST",
                    success: function (data) {
                        if (data.status) {
                            $.confirm({
                                title: "Observatorio de la tierra y el territorio",
                                content: "Datos enviados correctamente",
                                buttons: {
                                    Ok: function () {
                                        closeLicencia2();
                                    },
                                },
                            });
                        } else {
                            $.confirm({
                                title: "Observatorio de la tierra y el territorio",
                                content: "No se pudieron enviar los datos",
                                buttons: {
                                    Ok: function () {},
                                },
                            });
                        }
                    },
                    error: function (_data) {
                        $.confirm({
                            title: "Observatorio de la tierra y el territorio",
                            content: "No se pudieron enviar los datos",
                            buttons: {
                                Ok: function () {},
                            },
                        });
                    },
                });
            })
            .catch(function (_error) {
                $.confirm({
                    title: "Observatorio de la tierra y el territorio",
                    content: "No se pudieron enviar los datos",
                    buttons: {
                        Ok: function () {},
                    },
                });
            });
    }
}

function toggleMedia() {
    clearRasterMosaicWorkArea();
    clearSHStatsWorkArea();
    backImagenDetalle();
    currentMode = "media";
    $("#searchHeaderMedia").addClass("active");
    $("#searchHeaderAlta").removeClass("active");
    $("#panelSearchNivelImagenesMedia").show();
    $("#panelSearchNivelImagenesAlta").hide();
    $("#panelSearchServicioDetalle").hide();
    updateImagenes();
}

function toggleAlta() {
    clearRasterMosaicWorkArea();
    clearSHStatsWorkArea();
    backImagenDetalle();
    currentMode = "alta";
    $("#searchHeaderMedia").removeClass("active");
    $("#searchHeaderAlta").addClass("active");
    $("#panelSearchNivelImagenesMedia").hide();
    $("#panelSearchNivelImagenesAlta").show();
    $("#panelSearchServicioDetalle").hide();
    updateImagenes2();
}

function defaultUserPhoto() {
    $("#userPhoto,#userPhoto2").attr("src", "../images/login_1.png");
}

function signIn() {
    $("#logoutContainer").hide();
    $("#loginContainer").show();

    var uiConfig = {
        callbacks: {
            signInSuccess: function (_currentUser, _credential, _redirectUrl) {
                closeLogin();
                return false;
            },
        },
        signInOptions: [
            {
                provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                scopes: ["https://www.googleapis.com/auth/plus.login"],
                customParameters: {
                    prompt: "select_account",
                },
            },
            {
                provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                scopes: ["public_profile", "email"],
                customParameters: {
                    auth_type: "reauthenticate",
                },
            },
            {
                provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                requireDisplayName: true,
            },
            "apple.com",
            "microsoft.com",
            "yahoo.com",
        ],
        credentialHelper: firebaseui.auth.CredentialHelper.NONE,
        signInFlow: "popup",
    };

    firebase_ui.start("#authContainer", uiConfig);
}

function signOut() {
    firebase.auth().signOut();
    $("#logoutContainer").hide();
    $("#loginContainer").show();
    currentUser = null;
    currentFuncionalidades = [];
    closeLogin();
}

function validate() {}

function toggleMain(tipo) {
    clearRasterMosaicWorkArea();
    clearSHStatsWorkArea();
    modoSearch = tipo;
    $("#searchHeaderEntidad,#searchHeaderArea,#searchHeaderGeoJSON").removeClass("active");
    $("#searchHeaderEntidadDiv,#searchHeaderAreaDiv,#searchHeaderGeoJSONDiv").hide();
    if (tipo == "entidad") {
        $("#searchHeaderEntidad").addClass("active");
        $("#searchHeaderEntidadDiv").show();
        areaLayer.setVisibility(false);
        fileLayer.setVisibility(false);
    }
    if (tipo == "area") {
        $("#searchHeaderArea").addClass("active");
        $("#searchHeaderAreaDiv").show();
        areaLayer.setVisibility(true);
        fileLayer.setVisibility(false);
    }
    if (tipo == "geojson") {
        $("#searchHeaderGeoJSON").addClass("active");
        $("#searchHeaderGeoJSONDiv").show();
        areaLayer.setVisibility(false);
        fileLayer.setVisibility(true);
    }
}

function minAllMain() {
    $("#panelSearch").hide();
    $("#headingSearch").hide();
    $("#mainHeading li").removeClass("active");
    closeSearch();
}

function minAll() {
    clearRasterMosaicWorkArea();
    clearSHStatsWorkArea();
    $("#panelTiempo").hide();
    $("#panelLogin").hide();
    $("#panelInfo").hide();
    $("#panelLayers").hide();
    $("#panelCoordenadas").hide();
    $("#panelImprimir").hide();
    $("#panelImagenes").hide();
    $("#panelSH").hide();
    $("#panelSHStats").hide();
    $("#panelSHAnalytics").hide();
    $("#panelRasterMosaics").hide();
    $("#panelPrisma").hide();
    closeLayers();
    closeCoordenadas();
    closeDibujar();
    closeImagenes();
    toggleTools(false);
    toggleInfoTools(false);
    toggleSHTools(false);
    toggleRasterTools(false);
}

function toggleTools(param) {
    if (param == null) {
        if ($("#toolsDiv").is(":visible")) {
            param = false;
        } else {
            param = true;
        }
    }
    if (param) {
        clearRasterMosaicWorkArea();
        clearSHStatsWorkArea();
        $("#toolsDiv").show();
        $("#toolBtn").css("background-image", "url(../images/iconos/Tool_Close.svg)");
        reporteUso("Abrir herramientas");
    } else {
        $("#toolsDiv").hide();
        $("#toolBtn").css("background-image", "url(../images/iconos/Tool.svg)");
    }
    $("#toolBtn").tooltip("hide");
}

function toggleRasterTools(param) {
    if (param == null) {
        if ($("#rasterToolDiv").is(":visible")) {
            param = false;
        } else {
            param = true;
        }
    }
    if (param) {
        minAll();
        $("#rasterToolDiv").show();
        $("#rasterToolBtn").css("background-image", "url(../images/iconos/Tool_Close.svg)");
    } else {
        $("#rasterToolDiv").hide();
        $("#rasterToolBtn").css("background-image", "url(../images/iconos/8b_btn.svg)");
    }
    $("#rasterToolBtn").tooltip("hide");
}

function toggleInfoTools(param) {
    if (param == null) {
        if ($("#infoToolDiv").is(":visible")) {
            param = false;
        } else {
            param = true;
        }
    }
    if (param) {
        minAll();
        $("#infoToolDiv").show();
        $("#infoToolBtn").css("background-image", "url(../images/iconos/Tool_Close.svg)");
    } else {
        $("#infoToolDiv").hide();
        $("#infoToolBtn").css("background-image", "url(../images/iconos/informacion_adicional.svg)");
    }
    $("#infoToolBtn").tooltip("hide");
}

function toggleSHTools(param) {
    if (param == null) {
        if ($("#shToolDiv").is(":visible")) {
            param = false;
        } else {
            param = true;
        }
    }
    if (param) {
        minAll();
        $("#shToolDiv").show();
        $("#shToolBtn").css("background-image", "url(../images/iconos/Tool_Close.svg)");
    } else {
        $("#shToolDiv").hide();
        $("#shToolBtn").css("background-image", "url(../images/iconos/coberturas_despiegue_indices.svg)");
    }
    $("#shToolBtn").tooltip("hide");
}

function toggleFiltros(param) {
    if (param == null) {
        if ($("#searchBody").is(":visible")) {
            param = "small";
        } else {
            param = "large";
        }
    }
    if (param == "small") {
        $("#panelSearchToggle").html("<img src='../images/iconos/Open_01.png' alt='Minimizar' style='width: 10px; height: 10px;' />");
        $("#searchBody").hide();
    }
    if (param == "large") {
        $("#panelSearchToggle").html("<img src='../images/iconos/Close_01.png' alt='Minimizar' style='width: 10px; height: 2px;' />");
        $("#searchBody").show();
    }
}

function toggleMenu(param) {
    if (param == null) {
        if ($("#mainDiv").hasClass("main-small")) {
            param = "large";
        } else {
            param = "small";
        }
    }
    if (param == "large") {
        if ($(window).width() <= 768) {
            param = "small";
        } else {
            $("#mainDiv").removeClass("main-small");
            $("#mainDiv").addClass("main-large");
            $("#mapViewDiv,#tableViewDiv").removeClass("main-small-map");
            $("#mapViewDiv,#tableViewDiv").addClass("main-large-map");
            $("#headingSearch img").attr("src", "/images/iconos/Back_02.png");
            $(".item-heading").removeClass("small-heading");
            $(".item-heading").addClass("large-heading");
            $("#menuItem").removeClass("small-heading");
            $("#menuItem").addClass("large-heading");
            toggleFiltros(param);
        }
    }
    if (param == "small") {
        $("#mainDiv").removeClass("main-large");
        $("#mainDiv").addClass("main-small");
        $("#mapViewDiv,#tableViewDiv").removeClass("main-large-map");
        $("#mapViewDiv,#tableViewDiv").addClass("main-small-map");
        $("#headingSearch img").attr("src", "/images/iconos/Forward_02.png");
        $(".item-heading").removeClass("large-heading");
        $(".item-heading").addClass("small-heading");
        $("#menuItem").removeClass("large-heading");
        $("#menuItem").addClass("small-heading");
        toggleFiltros(param);
    }
    if (param == "init") {
        $("#mainDiv").removeClass("main-large");
        $("#mainDiv").addClass("main-small");
        $("#mapViewDiv,#tableViewDiv").removeClass("main-large-map");
        $("#mapViewDiv,#tableViewDiv").addClass("main-small-map");
        $("#headingSearch img").attr("src", "/images/iconos/Forward_02.png");
        $(".item-heading").removeClass("large-heading");
        $(".item-heading").addClass("small-heading");
        $("#menuItem").removeClass("large-heading");
        $("#menuItem").addClass("small-heading");
        param = "small";
    }
    currentEstado = param;
    if (map != null) {
        map.reposition();
        map.resize();
    }
}

function gotoLogin() {
    if (LOCAL_NO_LOGIN) {
        return;
    }

    minAll();
    if (currentUser == null) {
        signIn();
    } else {
        $("#loginContainer").hide();
        $("#logoutContainer").show();
    }
    $("#panelLogin").show();
}

function closeLogin() {
    $("#panelLogin").hide();
}

function gotoTiempo() {
    currentScreen = "Tiempo";
    reporteUso("Abrir tiempo");
    minAll();
    toggleMenu("small");
    $("#panelTiempo").show();
    searchGraphicsLayer.setVisibility(false);
    searchImageLayer.setVisibility(false);
    searchGraphicsLayerDetalle.setVisibility(false);
    searchImageLayerDetalle.setVisibility(false);
    updateTiempo();
}

function borrarSeleccion() {
    $("#selectTile1YPanel").val(null);
    $("#selectTile2YPanel").val(null);
    $("#selectTile1YPanel").trigger("change");
    $("#selectTile2YPanel").trigger("change");
    updateTiempo();
}

function tiempoMode(pos) {
    currentTiempoMode = pos;
    $("#btnTiempoMode0,#btnTiempoMode1,#btnTiempoMode2").removeClass("active");
    $("#btnTiempoMode" + currentTiempoMode).addClass("active");
    updateTiempo();
}

function closeTiempo() {
    $("#panelTiempo").hide();
    swipeWidget.disable();
    swipeWidget2.disable();
    if (swipeLayer1 != null) {
        map.removeLayer(swipeLayer1);
    }
    if (swipeLayer2 != null) {
        map.removeLayer(swipeLayer2);
    }
    if ($("#panelSearchImagenDetalle").is(":visible")) {
        searchGraphicsLayer.setVisibility(false);
        searchImageLayer.setVisibility(false);
        searchGraphicsLayerDetalle.setVisibility(true);
        searchImageLayerDetalle.setVisibility(true);
    } else {
        searchGraphicsLayer.setVisibility(true);
        searchImageLayer.setVisibility(true);
        searchGraphicsLayerDetalle.setVisibility(false);
        searchImageLayerDetalle.setVisibility(false);
    }
}

function updateTiempo() {
    swipeWidget.disable();
    swipeWidget2.disable();
    if (swipeWidget.layers.length > 1) {
        swipeWidget.layers.pop();
    }
    if (swipeWidget.layers.length > 1) {
        swipeWidget.layers.pop();
    }
    if (swipeWidget2.layers.length > 1) {
        swipeWidget2.layers.pop();
    }
    if (swipeWidget2.layers.length > 1) {
        swipeWidget2.layers.pop();
    }
    if (swipeLayer1 != null) {
        map.removeLayer(swipeLayer1);
    }
    if (swipeLayer2 != null) {
        map.removeLayer(swipeLayer2);
    }
    if ($("#selectTile1YPanel").val() != null && $("#selectTile1MPanel").val() != null && $("#selectTile1YPanel").val() != "" && $("#selectTile1MPanel").val() != "") {
        var layer1 = "global_";
        if ($("#selectTile1MPanel").val().indexOf("q") == -1) {
            layer1 = layer1 + "monthly_";
        } else {
            layer1 = layer1 + "quarterly_";
        }
        layer1 = layer1 + $("#selectTile1YPanel").val();
        if ($("#selectTile1MPanel").val().indexOf("q") == -1) {
            layer1 = layer1 + "_";
        }
        layer1 = layer1 + $("#selectTile1MPanel").val();
        layer1 = layer1 + "_mosaic";

        swipeLayer1 = new esri.WebTiledLayer(web_service + "/imagenes2?cmd=tile&ID=" + layer1 + "&Z=${level}&X=${col}&Y=${row}&token=" + currentAccessToken);
        if (currentTiempoMode == 2) {
            if (swipeLayer1 != null) {
                swipeLayer1.setOpacity(currentAlpha);
            }
        }
        map.addLayer(swipeLayer1);
    }
    if ($("#selectTile2YPanel").val() != null && $("#selectTile2MPanel").val() != null && $("#selectTile2YPanel").val() != "" && $("#selectTile2MPanel").val() != "") {
        var layer2 = "global_";
        if ($("#selectTile2MPanel").val().indexOf("q") == -1) {
            layer2 = layer2 + "monthly_";
        } else {
            layer2 = layer2 + "quarterly_";
        }
        layer2 = layer2 + $("#selectTile2YPanel").val();
        if ($("#selectTile2MPanel").val().indexOf("q") == -1) {
            layer2 = layer2 + "_";
        }
        layer2 = layer2 + $("#selectTile2MPanel").val();
        layer2 = layer2 + "_mosaic";

        swipeLayer2 = new esri.WebTiledLayer(web_service + "/imagenes2?cmd=tile&ID=" + layer2 + "&Z=${level}&X=${col}&Y=${row}&token=" + currentAccessToken);
        map.addLayer(swipeLayer2);

        if (currentTiempoMode == 0) {
            swipeWidget.layers.push(swipeLayer2);
            swipeWidget.enable();
        }
        if (currentTiempoMode == 1) {
            swipeWidget2.layers.push(swipeLayer2);
            swipeWidget2.enable();
        }
        if (currentTiempoMode == 2) {
            if (swipeLayer2 != null) {
                swipeLayer2.setOpacity(1 - currentAlpha);
            }
        }
    }
}

function gotoImagenes() {
    currentScreen = "Imagenes";
    reporteUso("Abrir imágenes");
    minAll();
    toggleMenu("small");
    $("#panelImagenes").show();
    $("#selectLayersRaster1").val(null);
    $("#selectLayersRaster1").trigger("change");
    searchGraphicsLayer.setVisibility(false);
    searchGraphicsLayerDetalle.setVisibility(false);
    searchImageLayer.setVisibility(false);
    searchImageLayerDetalle.setVisibility(false);
}

function toggleImagenRasterSwipe() {
    if (rasterImageSwipe.enabled) {
        rasterImageSwipe.disable();
    } else {
        rasterImageSwipe.enable();
        rasterImageSwipe.layers = [currentRaster];
    }
}

function closeImagenes() {
    $("#panelImagenes").hide();
    /*
    if (searchGraphicsLayer != null) {
        searchGraphicsLayer.setVisibility(true);
    }
    if (searchGraphicsLayerDetalle != null) {
        searchGraphicsLayerDetalle.setVisibility(true);
    }
    if (searchImageLayer != null) {
        searchImageLayer.setVisibility(true);
    }
    if (searchImageLayerDetalle != null) {
        searchImageLayerDetalle.setVisibility(true);
    }
    */
    if (currentRaster != null) {
        map.removeLayer(currentRaster);
    }
    currentRaster = null;
    if (rasterImageSwipe != null) {
        rasterImageSwipe.disable();
    }
}

function gotoSH() {
    currentScreen = "SH";
    reporteUso("Abrir SH");
    minAll();
    toggleMenu("small");
    $("#panelSH").show();
    if (currentSHData.length == 0) {
        loading.open();
        fetchSHToken(function (tokenOk) {
            loading.close();
            if (tokenOk) {
                updateSHList();
            } else {
                showLoading("No se pudo obtener token de Sentinel Hub", null, "red", true);
            }
        });
    } else {
        updateSHList();
    }
}

function updateSHList() {
    $("#layersDiv").html("");
    for (var i = 0; i < currentSHData.length; i++) {
        var strHTML = "";
        strHTML = strHTML + "<div class='panel panel-default panel-list' data-layer='" + currentSHData[i].id + "'>";
        strHTML = strHTML + "<div class='panel-heading' role='tab' id='layerDivHeading" + i + "'>";
        strHTML = strHTML + "<h4 class='panel-title'>";
        strHTML = strHTML + "<a role='button' style='flex-grow: 1;text-decoration: none;padding-right:10px;' data-toggle='collapse' data-parent='#accordion' href='#layerDivBody" + i + "' aria-expanded='true' aria-controls='layerDivBody" + i + "'>";
        strHTML = strHTML + currentSHData[i].title;

        if (map.getLayer(currentSHData[i].id) != null) {
            strHTML = strHTML + "<a href='#' class='layersDivActive' onclick='disableLayer(\"" + i + "\"); return false;' data-toggle='tooltip' data-placement='top' title='Desactivar capa'><img src='/images/iconos/Dot_Green.png' alt='Capa activa' style='width: 10px; height: 10px;' /></a>";
            strHTML = strHTML + "<a href='#' class='layersDivOpacity' data-layer='" + currentSHData[i].id + "' data-toggle='tooltip' data-placement='top' title='Modificar transparencia'><img src='/images/iconos/Transparency.png' alt='Transparencia' style='width: 10px; height: 10px;'></a>";
        } else {
            strHTML = strHTML + "<a href='#' class='layersDivActive' onclick='activateLayer(\"" + i + "\"); return false;' data-toggle='tooltip' data-placement='top' title='Activar capa'><img src='/images/iconos/Dot_Gray.png' alt='Capa activa' style='width: 10px; height: 10px;' /></a>";
        }
        /*strHTML = strHTML + "<a href='#' class='layersDivDelete' onclick='removeLayer(\"" + activeLayers[i] + "\"); return false;' data-toggle='tooltip' data-placement='top' title='Eliminar capa'><img src='/images/iconos/Close_Red.png' alt='Eliminar' style='width: 10px; height: 10px;'></a>";*/
        /*if (getServicioByName(activeLayers[i]) != null) {
            if (getServicioByName(activeLayers[i]).DEFAULT_EXTENT != null) {
                strHTML = strHTML + "<a href='#' class='layersDivCenter' onclick='centerLayer(\"" + activeLayers[i] + "\"); return false;' data-toggle='tooltip' data-placement='top' title='Centrar capa'><img src='/images/iconos/Center2.png' alt='Centrar' style='width: 10px; height: 10px;'></a>";
            }
        }*/
        /*strHTML = strHTML + "<a href='#' class='layersDivCompare' onclick='toggleSwipe(" + i + "); return false;' data-toggle='tooltip' data-placement='top' title='Comparar capa'><img src='/images/iconos/Swipe.png' alt='Comparar' style='width: 10px; height: 10px;'></a>";*/
        strHTML = strHTML + "<a href='#' class='layersDivCollapse' onclick='detailLayer(" + i + "); return false;' data-toggle='tooltip' data-placement='top' title='Ver detalles'><img src='/images/iconos/Down_01.png' alt='Ver detalles' style='width: 10px; height: 5px;'></a>";

        strHTML = strHTML + "</a>";
        strHTML = strHTML + "</h4>";
        strHTML = strHTML + "</div>";
        strHTML = strHTML + "<div class='collapse' id='layerDivBody" + i + "'>";
        strHTML = strHTML + "<div id='detailDiv_" + i + "' style='padding: 8px;'>";
        try {
            if (currentSHData[i].description.length > 0) {
                strHTML = strHTML + "<strong>Descripci&oacute;n: </strong>" + currentSHData[i].description + "</br >";
            }
        } catch (err) {}
        try {
            if (currentSHData[i].datasourceDefaults != null) {
                if (currentSHData[i].datasourceDefaults.timeRange != null) {
                    strHTML = strHTML + "<strong>Fecha inicial: </strong>" + esri.moment(currentSHData[i].datasourceDefaults.timeRange.startTime.value).toString() + "</br >";
                    strHTML = strHTML + "<strong>Fecha final: </strong>" + esri.moment(currentSHData[i].datasourceDefaults.timeRange.endTime.value).toString() + "</br >";
                }
            }
        } catch (err) {}
        strHTML = strHTML + "</div>";
        strHTML = strHTML + "</div>";
        strHTML = strHTML + "</div>";
        $("#layersDiv").append(strHTML);
        $(".layersDivOpacity[data-layer='" + currentSHData[i].id + "']")
            .colorpicker({
                horizontal: true,
                customClass: "customPicker",
                color: "#000000FF",
                template: "<div class='colorpicker dropdown-menu'>" + "<div class='colorpicker-saturation'><i><b></b></i></div>" + "<div class='colorpicker-hue'><i></i></div>" + "<div class='colorpicker-alpha'><i></i></div>" + "<div class='colorpicker-text' data-layer-color='" + activeLayers[i] + "'></div>" + "<div class='colorpicker-color'><div /></div>" + "</div>",
            })
            .on("changeColor", function (e) {
                map.getLayer($(e.target).attr("data-layer")).setOpacity(e.color.getValue().a);
                $(".colorpicker-text[data-layer-color='" + $(e.target).attr("data-layer") + "']").html((e.color.getValue().a * 100).toFixed(0) + "%");
            })
            .on("showPicker", function (e) {
                $(this).colorpicker("setValue", "rgba(0, 0, 0, " + map.getLayer($(e.target).attr("data-layer")).opacity + ")");
                $(".colorpicker-text[data-layer-color='" + $(e.target).attr("data-layer") + "']").html((map.getLayer($(e.target).attr("data-layer")).opacity * 100).toFixed(0) + "%");
            });
    }
    $('[data-toggle="tooltip"]').tooltip();
}

function activateLayer(pos) {
    currentSHLayers[currentSHData[pos].id] = new esri.WMSLayer(currentSHUrl, {
        id: currentSHData[pos].id,
        name: currentSHData[pos].tile,
        title: currentSHData[pos].tile,
        visibleLayers: [currentSHData[pos].id],
    });
    map.addLayer(currentSHLayers[currentSHData[pos].id]);
    updateSHList();
    updateSHTiempo();
}

function disableLayer(pos) {
    map.removeLayer(currentSHLayers[currentSHData[pos].id]);
    currentSHLayers[currentSHData[pos].id] = null;
    updateSHList();
}

function detailLayer(pos) {
    if ($("#layerDivBody" + pos).hasClass("in")) {
        $("#layerDivBody" + pos).collapse("hide");
        $("#layerDivHeading" + pos + " .layersDivCollapse img").attr("src", "/images/iconos/Down_01.png");
    } else {
        $("#layerDivBody" + pos).collapse("show");
        $("#layerDivHeading" + pos + " .layersDivCollapse img").attr("src", "/images/iconos/Up_01.png");
    }
}

function updateSHTiempo() {
    if ($("#selectSHY").val() == null || $("#selectSHY").val() == null || $("#selectSHM").val() == null || $("#selectSHM").val() == null) {
        for (var i = 0; i < currentSHData.length; i++) {
            if (map.getLayer(currentSHData[i].id) != null) {
                map.getLayer(currentSHData[i].id).setCustomParameters({});
            }
        }
    } else {
        var t = $("#selectSHY").val() + "-" + $("#selectSHM").val() + "-01";
        t = t + "/" + $("#selectSHY").val() + "-" + $("#selectSHM").val() + "-" + esri.moment(t).daysInMonth();
        for (var i = 0; i < currentSHData.length; i++) {
            if (map.getLayer(currentSHData[i].id) != null) {
                map.getLayer(currentSHData[i].id).setCustomParameters({ TIME: t });
            }
        }
    }
}

function closeSH() {
    $("#panelSH").hide();
    for (var i = 0; i < currentSHData.length; i++) {
        if (map.getLayer(currentSHData[i].id) != null) {
            map.removeLayer(map.getLayer(currentSHData[i].id));
            currentSHLayers[currentSHData[i].id] = null;
        }
    }
}

function gotoSHStats() {
    currentScreen = "SHStats";
    reporteUso("Abrir SHStats");
    minAll();
    toggleMenu("small");
    $("#panelSHStats").show();
    areaLayer3.setVisibility(true);
    fileLayer2.setVisibility(true);
    currentSHLayer.setVisibility(true);
    currentSHLayer.clear();

    $("#divSHStats").hide();
    $("#sliderCCSHStatsContainer").hide();
    $("#selectSHStatsAggContainer").hide();
    $("#btnSHDownloadStats").attr("disabled", "disabled");

    if (currentSHData.length == 0) {
        loading = $.confirm({
            title: "",
            content: "<div style='text-align: center;'><img src='/images/ig124.gif' style='height: 200px;width: 200px;'></div>",
            buttons: {},
            closeIcon: true,
            lazyOpen: true,
            onContentReady: function () {},
            onOpenBefore: function () {
                loading.buttons.ok.hide();
                loading.buttons.close.hide();
            },
        });
        loading.open();
        fetchSHToken(function (tokenOk) {
            loading.close();
            if (tokenOk) {
                // currentSHToken ya está disponible desde Sentinel Hub directo
            } else {
                showLoading("No se pudo obtener token de Sentinel Hub", null, "red", true);
            }
        });
    }
}

function updateSHStats() {
    if (areaLayer3.graphics.length == 0 && fileLayer2.graphics.length == 0) {
        showLoading("Debes seleccionar una area para la geneneración de la grafica", null, "red", true);
        return;
    }
    if (areaLayer3.graphics.length > 0) {
        if (areaLayer3.graphics[0].geometry.type == "extent") {
            currentSearchArea = esri.Polygon.fromExtent(esri.webMercatorUtils.webMercatorToGeographic(areaLayer3.graphics[0].geometry));
            currentSearchArea2 = esri.Polygon.fromExtent(areaLayer3.graphics[0].geometry);
        } else {
            currentSearchArea = esri.webMercatorUtils.webMercatorToGeographic(areaLayer3.graphics[0].geometry);
            currentSearchArea2 = areaLayer3.graphics[0].geometry;
        }
    }
    if (fileLayer2.graphics.length > 0) {
        currentSearchArea = esri.webMercatorUtils.webMercatorToGeographic(fileLayer2.graphics[0].geometry);
        currentSearchArea2 = fileLayer2.graphics[0].geometry;
    }
    if (esri.geometryEngine.geodesicArea(esri.webMercatorUtils.webMercatorToGeographic(currentSearchArea), "hectares") > 100) {
        showLoading("Le informamos que su polígono excede el límite de área permitido (100 hectáreas), por este motivo, no podrá realizar la consulta de uso de suelo para su área de estudio", null, "red", false);
        return;
    }
    
    // Calculate optimal resolution to fit within 2500x2500 pixel limit
    var resolutionInfo = calculateOptimalResolution(currentSearchArea);
    if (resolutionInfo.maxResolution) {
        showLoading("El área es muy grande. Se ajustará la resolución a " + resolutionInfo.resx + "m para procesarla (~" + resolutionInfo.pixelCount + " píxeles por lado). Esto puede tardar más tiempo.", null, "orange", false);
    }
    if ($("#selectSHStats1").val() == "" || $("#selectSHStats1").val() == null) {
        showLoading("Debes seleccionar una fecha inicial", null, "red", true);
        return;
    }
    if ($("#selectSHStats2").val() == "" || $("#selectSHStats2").val() == null) {
        showLoading("Debes seleccionar una fecha inicial", null, "red", true);
        return;
    }
    if ($("#selectSHStatsAgg").val() == "" || $("#selectSHStatsAgg").val() == null) {
        showLoading("Debes seleccionar un nivel de agrupamiento", null, "red", true);
        return;
    }
    if ($("#selectSHStatsIdx").val() == "" || $("#selectSHStatsIdx").val() == null) {
        showLoading("Debes seleccionar un indice a calcular", null, "red", true);
        return;
    }
    currentSHLayer.clear();

    if ($("#selectSHStatsIdx").val() == "NBR" || $("#selectSHStatsIdx").val() == "NBR2" || $("#selectSHStatsIdx").val() == "MAP_DEFORESTATION") {
        procesarSH();
        return;
    }

    loading = $.confirm({
        title: "",
        content: "<div style='text-align: center;'><img src='/images/ig124.gif' style='height: 200px;width: 200px;'></div>",
        buttons: {},
        closeIcon: true,
        lazyOpen: true,
        onContentReady: function () {},
        onOpenBefore: function () {
            loading.buttons.ok.hide();
            loading.buttons.close.hide();
            //loading.showLoading();
        },
    });
    loading.open();
    var params = {
        input: {
            bounds: {
                geometry: {
                    type: "Polygon",
                    coordinates: currentSearchArea.rings,
                },
            },
            data: [
                {
                    dataFilter: {},
                    processing: {
                        downsampling: "BICUBIC",
                        upsampling: "BICUBIC",
                    },
                    type: "sentinel-2-l2a",
                },
            ],
        },
        aggregation: {
            timeRange: {
                from: esri.moment($("#selectSHStats1").val(), "DD/MM/yyyy").format("yyyy-MM-DD") + "T00:00:00Z",
                to: esri.moment($("#selectSHStats2").val(), "DD/MM/yyyy").format("yyyy-MM-DD") + "T00:00:00Z",
            },
            aggregationInterval: {
                of: $("#selectSHStatsAgg").val(),
                lastIntervalBehavior: "SKIP",
            },
            resx: 0.000269494697,
            resy: 0.000269494697,
            evalscript: stats_idx[$("#selectSHStatsIdx").val()],
        },
        calculations: {
            default: {
                statistics: {
                    default: {
                        percentiles: {
                            k: [10, 20, 30, 40, 50, 60, 70, 80, 90],
                            interpolation: "higher",
                        },
                    },
                },
            },
        },
    };
    $("#divSHStats").hide();
    $("#btnSHDownloadStats").attr("disabled", "disabled");
    if (currentSHDataLayers != null) {
        map.removeLayer(currentSHDataLayers);
    }
    currentSHLayer.clear();
    console.log(params);
    console.log(sh_stats);
    $.ajax({
        url: sh_stats,
        data: JSON.stringify(params),
        dataType: "json",
        type: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + currentSHToken },
        success: function (data) {
            loading.close();
            if (data.data.length == 0) {
                showLoading("Debes seleccionar una extension menor para la generacion de la grafica", null, "red", true);
                return;
            }
            $("#divSHStats").show();
            $("#btnSHDownloadStats").removeAttr("disabled");
            var statisticsData = data;
            var labels = [];
            var p10Data = [];
            var meanData = [];
            var p90Data = [];

            statisticsData.data.forEach((interval) => {
                labels.push(interval.interval.from);
                p10Data.push(interval.outputs.data.bands.B0.stats.percentiles["10.0"]);
                meanData.push(interval.outputs.data.bands.B0.stats.mean);
                p90Data.push(interval.outputs.data.bands.B0.stats.percentiles["90.0"]);
            });
            generateChart(labels, meanData, p10Data, p90Data);
            var date_base = labels[0].substring(0, 10);
            var new_date_base = labels[1].substring(0, 10);
            currentSHDataLayers = new esri.WMSLayer(shStatsUrl, {
                visibleLayers: [$("#selectSHStatsIdx").val()],
                customParameters: {
                    TIME: date_base + "/" + new_date_base,
                    GEOMETRY: currentSearchArea2.rings,
                },
            });
            currentSHStatsLabels = labels;
            sliderSHStats.destroy();
            sliderSHStats = new Slider("#sliderSHStats", {
                min: 0,
                max: currentSHStatsLabels.length - 1,
                value: 0,
                formatter: function (value) {
                    if (currentSHStatsLabels == null) {
                        $("#sliderSHStatsTxt").html("");
                    }
                    $("#sliderSHStatsTxt").html(currentSHStatsLabels[value].substring(0, 10));
                    return currentSHStatsLabels[value].substring(0, 10);
                },
            });
            sliderSHStats.on("change", function (args) {
                try {
                    var date_base = currentSHStatsLabels[parseInt(args.newValue)].substring(0, 10);
                    var new_date_base = currentSHStatsLabels[parseInt(args.newValue) + 1].substring(0, 10);
                    currentSHDataLayers.setCustomParameters({
                        TIME: date_base + "/" + new_date_base,
                        GEOMETRY: currentSearchArea2.rings,
                    });
                } catch (err) {}
            });
            map.addLayer(currentSHDataLayers);
        },
        timeout: 20000,
        error: function (err) {
            loading.close();
            showLoading("Debes seleccionar una extension menor para la generacion de la grafica", null, "red", true);
            /*
            if (err.responseJSON.error != null) {                
                showLoading(err.responseJSON.error.message, null, "red", false);
                return;
            }
            */
            console.error(err);
        },
        cache: false,
        contentType: false,
        processData: false,
    });
}

function procesarSH() {
    lastProcessedSHResult = null;
    $("#btnSHDownloadStats").attr("disabled", "disabled");
    loading = $.confirm({
        title: "",
        content: "<div style='text-align: center;'><img src='/images/ig124.gif' style='height: 200px;width: 200px;'></div>",
        buttons: {},
        closeIcon: true,
        lazyOpen: true,
        onContentReady: function () {},
        onOpenBefore: function () {
            loading.buttons.ok.hide();
            loading.buttons.close.hide();
            //loading.showLoading();
        },
    });
   loading.open();
    // Forzar basemap de imágenes satelitales mientras se procesa
    try {
        currentBasemap = 'imagery';
        map.setBasemap('imagery');
        $("#selectBasemapPanel").val(currentBasemap);
    } catch (e) {
        console.warn('[PROCESS] No fue posible forzar basemap imagery:', e);
    }
    var params = {};
    
    // Calculate optimal resolution based on area size
    var resolutionInfo = calculateOptimalResolution(currentSearchArea);
    if (resolutionInfo.maxResolution) {
        console.warn("Large area detected. Using resolution:", resolutionInfo.resx + "m");
    }
    
    var maxCloudCoveragePercent = getSHCloudCoverageMaxPercent();
    var cloudCoverageValue = getSHCloudCoverageMaxRatio();
    var indexThresholdValue = getSHStatsIndexThresholdValue();
    if ($("#selectSHStatsIdx").val() == "NBR") {
        console.log(indexThresholdValue);
        params = {
            input: {
                bounds: {
                    geometry: {
                        type: "Polygon",
                        coordinates: currentSearchArea.rings,
                    },
                },
                data: [
                    {
                        dataFilter: {
                            timeRange: {
                                from: esri.moment($("#selectSHStats1").val(), "DD/MM/yyyy").format("yyyy-MM-DD") + "T00:00:00Z",
                                to: esri.moment($("#selectSHStats2").val(), "DD/MM/yyyy").format("yyyy-MM-DD") + "T00:00:00Z",
                            },
                            maxCloudCoverage: maxCloudCoveragePercent,
                            mosaickingOrder: "mostRecent"
                        },
                        type: "sentinel-2-l2a",
                    },
                ],
            },
            output: {
                resx: resolutionInfo.resxDegrees,
                resy: resolutionInfo.resyDegrees,
                responses: [
                    {
                        identifier: "default",
                        format: {
                            type: "image/tiff",
                        },
                    },
                ],
            },
            // evalscript: replaceAll(stats_idx[$("#selectSHStatsIdx").val()], "{{THRESHOLD}}", sliderCCSHStats.getValue()),
            evalscript: replaceAll(stats_idx[$("#selectSHStatsIdx").val()], "{{THRESHOLD}}", indexThresholdValue),
        };
    }
    if ($("#selectSHStatsIdx").val() == "NBR2") {
        params = {
            input: {
                bounds: {
                    geometry: {
                        type: "Polygon",
                        coordinates: currentSearchArea.rings,
                    },
                },
                data: [
                    {
                        dataFilter: {
                            timeRange: {
                                from: esri.moment($("#selectSHStats1").val(), "DD/MM/yyyy").format("yyyy-MM-DD") + "T00:00:00Z",
                                to: esri.moment($("#selectSHStats2").val(), "DD/MM/yyyy").format("yyyy-MM-DD") + "T00:00:00Z",
                            },
                            maxCloudCoverage: maxCloudCoveragePercent,
                            mosaickingOrder: "mostRecent"
                        },
                        type: "sentinel-2-l2a",
                    },
                ],
            },
            output: {
                resx: resolutionInfo.resxDegrees,
                resy: resolutionInfo.resyDegrees,
                responses: [
                    {
                        identifier: "default",
                        format: {
                            type: "image/tiff",
                        },
                    },
                ],
            },
            evalscript: replaceAll(stats_idx[$("#selectSHStatsIdx").val()], "{{THRESHOLD}}", indexThresholdValue),
        };
    }
    if ($("#selectSHStatsIdx").val() == "MAP_DEFORESTATION") {
        console.log(cloudCoverageValue);
        params = {
            input: {
                bounds: {
                    geometry: {
                        type: "Polygon",
                        coordinates: currentSearchArea.rings,
                    },
                },
                data: [
                    {
                        dataFilter: {
                            timeRange: {
                                from: esri.moment($("#selectSHStats1").val(), "DD/MM/yyyy").format("yyyy-MM-DD") + "T00:00:00Z",
                                to: esri.moment($("#selectSHStats2").val(), "DD/MM/yyyy").format("yyyy-MM-DD") + "T00:00:00Z",
                            },
                        },
                        type: "sentinel-2-l2a",
                    },
                ],
            },
            output: {
                resx: resolutionInfo.resxDegrees,
                resy: resolutionInfo.resyDegrees,
                responses: [
                    {
                        identifier: "default",
                        format: {
                            type: "image/tiff",
                        },
                    },
                ],
            },
            evalscript: stats_idx[$("#selectSHStatsIdx").val()],
        };
    }
    $("#divSHStats").hide();
    $("#btnSHDownloadStats").attr("disabled", "disabled");
    if (currentSHDataLayers != null) {
        map.removeLayer(currentSHDataLayers);
    }
    clearBurnsSentinelOverlay();
    currentSHLayer.clear();
    console.log(sh_image_stats);
    console.log(params);
    console.log(currentSHToken);
    var sendProcessRequest = function (retryOnAuthError) {
        var processUrl = sentinelHubProcessProxyUrl || sh_image_stats;
        var processHeaders = { "Content-Type": "application/json" };
        if (!sentinelHubProcessProxyUrl) {
            processHeaders.Authorization = "Bearer " + currentSHToken;
        }
        $.ajax({
            url: processUrl,
            data: JSON.stringify(params),
            type: "POST",
            headers: processHeaders,
            contentType: "application/json; charset=utf-8",
            processData: true,
        beforeSend: function () {
            if (debugIndices) {
                console.info("[INDICES] Solicitud enviada a Sentinel Hub /process", {
                    idx: $("#selectSHStatsIdx").val(),
                    fechaInicio: $("#selectSHStats1").val(),
                    fechaFin: $("#selectSHStats2").val(),
                    cloudCoverage: cloudCoverageValue,
                });
            }
            window.__shProcessStart = Date.now();
            },
            success: function (data) {
                try {
                    var promise = clasifyIndexDisplay(data, $("#selectSHStatsIdx").val());
                     if ($("#selectSHStatsIdx").val() == "NBR") {
                        openMonthlyMosaicFloatingWindowFromDates($("#selectSHStats1").val(), $("#selectSHStats2").val(), "Zonas de quema (NBR)");
                    }
                    if ($("#selectSHStatsIdx").val() == "MAP_DEFORESTATION") {
                        openMonthlyMosaicFloatingWindowFromDates($("#selectSHStats1").val(), $("#selectSHStats2").val(), "Pérdida de cobertura vegetal");
                    }
                    if (promise && typeof promise.catch === "function") {
                        promise.catch(function (err) {
                            loading.close();
                            showLoading("No se pudo procesar el índice seleccionado para el área indicada", null, "red", true);
                            console.error(err);
                        });
                    }
                } catch (err) {
                    loading.close();
                    showLoading("No se pudo procesar el índice seleccionado para el área indicada", null, "red", true);
                    console.error(err);
                }
            },
        xhr: function () {
            var xhrOverride = new XMLHttpRequest();
            xhrOverride.responseType = "arraybuffer";
            return xhrOverride;
        },
        timeout: 120000,
            error: function (err) {
                if (sentinelHubProcessProxyUrl && (!err.status || err.status === 0)) {
                    console.warn("[INDICES] Proxy Sentinel Hub no disponible, reintentando con API directa", sentinelHubProcessProxyUrl, err);
                    sentinelHubProcessProxyUrl = null;
                    if (!currentSHToken) {
                        fetchSHToken(function (tokenOk) {
                            if (tokenOk) {
                                sendProcessRequest(true);
                            } else {
                                loading.close();
                                showLoading("No se pudo obtener token de Sentinel Hub", null, "red", true);
                            }
                        });
                    } else {
                        sendProcessRequest(true);
                    }
                    return;
                }
                if (!sentinelHubProcessProxyUrl && err && err.status === 401 && retryOnAuthError) {
                    fetchSHToken(function (tokenOk) {
                        if (tokenOk) {
                            sendProcessRequest(false);
                        } else {
                            loading.close();
                            showLoading("No se pudo renovar el token de Sentinel Hub (HTTP 401)", null, "red", true);
                        }
                    });
                    return;
                }
                loading.close();
                var errorDetail = err && err.status ? " (HTTP " + err.status + ")" : "";
                showLoading("No se pudo procesar la consulta de índices" + errorDetail, null, "red", true);
                if (debugIndices) {
                    console.error("[INDICES] Error en Sentinel Hub /process", {
                        status: err && err.status,
                        statusText: err && err.statusText,
                        responseText: err && err.responseText ? String(err.responseText).substring(0, 500) : null,
                    });
                }
                console.error(err);
            },
            complete: function () {
                if (debugIndices && window.__shProcessStart) {
                    console.info("[INDICES] Fin solicitud /process", { duracionMs: Date.now() - window.__shProcessStart });
                }
            },
            cache: false,
        });
    };

    if (sentinelHubProcessProxyUrl) {
        sendProcessRequest(false);
    } else if (!currentSHToken) {
        fetchSHToken(function (tokenOk) {
            if (tokenOk) {
                sendProcessRequest(true);
            } else {
                loading.close();
                showLoading("No se pudo obtener token de Sentinel Hub", null, "red", true);
            }
        });
    } else {
        sendProcessRequest(true);
    }
}

function getSliderValueSafe(sliderInstance, inputSelector, fallbackValue) {
    try {
        if (sliderInstance) {
            if (typeof sliderInstance.getValue === "function") {
                return sliderInstance.getValue();
            }
            if (typeof sliderInstance.val === "function") {
                return sliderInstance.val();
            }
        }
    } catch (e) {}
    var inputValue = $(inputSelector).val();
    if (typeof inputValue === "string" && inputValue.indexOf(",") > -1) {
        var rangeValues = inputValue.split(",").map(function (value) {
            return parseFloat(value);
        });
        if (rangeValues.length === 2 && !Number.isNaN(rangeValues[0]) && !Number.isNaN(rangeValues[1])) {
            return rangeValues;
        }
    }
    var numericValue = parseFloat(inputValue);
    return Number.isNaN(numericValue) ? fallbackValue : numericValue;
}

function normalizeSHCloudCoverageRange(value) {
    var rangeValue = Array.isArray(value) ? value : [0, value];
    var minValue = parseFloat(rangeValue[0]);
    var maxValue = parseFloat(rangeValue[1]);
    if (Number.isNaN(minValue)) minValue = 0;
    if (Number.isNaN(maxValue)) maxValue = 100;
    minValue = Math.max(0, Math.min(100, Math.round(minValue)));
    maxValue = Math.max(0, Math.min(100, Math.round(maxValue)));
    if (minValue > maxValue) {
        var swapValue = minValue;
        minValue = maxValue;
        maxValue = swapValue;
    }
    return [minValue, maxValue];
}

function syncSHCloudCoverageDisplay(value) {
    var rangeValue = normalizeSHCloudCoverageRange(value);
    $("#sliderCCSHStatsMinTxt").val(rangeValue[0]);
    $("#sliderCCSHStatsMaxTxt").val(rangeValue[1]);
}

function setSHCloudCoverageRangeFromInputs() {
    var rangeValue = normalizeSHCloudCoverageRange([
        $("#sliderCCSHStatsMinTxt").val(),
        $("#sliderCCSHStatsMaxTxt").val()
    ]);
    if (sliderCCSHStats && typeof sliderCCSHStats.setValue === "function") {
        sliderCCSHStats.setValue(rangeValue, true, true);
    }
    syncSHCloudCoverageDisplay(rangeValue);
}

function getSHCloudCoverageRangePercent() {
    return normalizeSHCloudCoverageRange(getSliderValueSafe(sliderCCSHStats, "#sliderCCSHStats", [0, 100]));
}

function getSHCloudCoverageMaxPercent() {
    return getSHCloudCoverageRangePercent()[1];
}

function getSHCloudCoverageMaxRatio() {
    return getSHCloudCoverageMaxPercent() / 100.0;
}

function getSHStatsIndexThresholdValue() {
    var thresholdValue = parseFloat($("#sliderCCSHStatsIndex").val());
    if (Number.isNaN(thresholdValue)) thresholdValue = parseFloat($("#txtSHStatsIndexThreshold").val());
    return Number.isNaN(thresholdValue) ? 0.15 : thresholdValue;
}

function setSHStatsIndexThreshold(value) {
    var thresholdValue = parseFloat(value);
    if (Number.isNaN(thresholdValue)) thresholdValue = 0.15;
    thresholdValue = Math.max(0.1, Math.min(0.25, thresholdValue));
    thresholdValue = Math.round(thresholdValue * 100) / 100;
    var formattedValue = thresholdValue.toFixed(2).replace(/0$/, "").replace(/\.$/, "");
    $("#txtSHStatsIndexThreshold").val(formattedValue);
    $("#sliderCCSHStatsIndex").val(formattedValue);
}

// Calculate optimal resolution based on area to avoid exceeding 2500x2500 pixels
// Each pixel is 10m x 10m, so max area is ~625 km²
// Returns {resx, resy, pixelCount, areaKm2}
function calculateOptimalResolution(geometryGeo) {
    try {
        var areaKm2 = esri.geometryEngine.geodesicArea(geometryGeo, "square-kilometers");
        var areaM2 = areaKm2 * 1000000;
        
        var extent = geometryGeo.getExtent();
        var horizontalMeter = esri.geometryEngine.geodesicLength(new esri.Polyline({
            paths: [[[extent.xmin, extent.ymin], [extent.xmax, extent.ymin]]],
            spatialReference: geometryGeo.spatialReference,
        }), "meters");
        var verticalMeter = esri.geometryEngine.geodesicLength(new esri.Polyline({
            paths: [[[extent.xmin, extent.ymin], [extent.xmin, extent.ymax]]],
            spatialReference: geometryGeo.spatialReference,
        }), "meters");
        
        // Maximum pixels we can handle
        var maxPixels = 2500;
        
        var resolutionM = 10; // Default to 10m (Sentinel-2 resolution)
        var minResolutionForWidth = Math.ceil((horizontalMeter / maxPixels) / 5) * 5;
        var minResolutionForHeight = Math.ceil((verticalMeter / maxPixels) / 5) * 5;
        var minResolutionByShape = Math.max(minResolutionForWidth, minResolutionForHeight, 10);
        
        // If area exceeds max or the bounding box is too large, calculate required resolution
        if (areaM2 > maxPixels * maxPixels * 10 * 10 || minResolutionByShape > 10) {
            resolutionM = Math.max(
                Math.ceil(Math.sqrt(areaM2) / maxPixels / 5) * 5,
                minResolutionByShape
            );
        }
        
        // Convert to degrees (approximation: 1 degree ≈ 111 km)
        var resolutionDegrees = resolutionM / 111000;
        
        var estimatedPixelCount = Math.max(
            Math.round(horizontalMeter / resolutionM),
            Math.round(verticalMeter / resolutionM)
        );
        
        return {
            resx: resolutionM,
            resy: resolutionM,
            resxDegrees: resolutionDegrees,
            resyDegrees: resolutionDegrees,
            pixelCount: estimatedPixelCount,
            areaKm2: areaKm2,
            maxResolution: resolutionM > 100
        };
    } catch (e) {
        console.error("Error calculating resolution:", e);
        return {
            resx: 10,
            resy: 10,
            resxDegrees: 0.000269494697,
            resyDegrees: 0.000269494697,
            pixelCount: 0,
            areaKm2: 0,
            maxResolution: false
        };
    }
}

function fetchSHToken(callback) {
    if (sentinelHubAccessTokenLocal) {
        currentSHToken = sentinelHubAccessTokenLocal;
        console.log("[TOKEN] Token local configurado");
        callback(true);
        return;
    }

    var getTokenWithProxy = function () {
        if (!sentinelHubTokenProxyUrl) {
            console.error("[TOKEN] No hay URL de proxy configurada para Sentinel Hub");
            callback(false);
            return;
        }

        console.log("[TOKEN] Obteniendo token desde proxy configurado:", sentinelHubTokenProxyUrl);

        $.ajax({
            url: sentinelHubTokenProxyUrl,
            type: "POST",
            dataType: "json",
            success: function (data) {
                if (data && data.access_token) {
                    currentSHToken = data.access_token;
                    console.log("[TOKEN] Token obtenido exitosamente:", currentSHToken.substring(0, 20) + "...");
                    callback(true);
                    return;
                }
                console.error("[TOKEN] Respuesta inválida del proxy:", data);
                callback(false);
            },
            error: function (xhr, status, error) {
                console.error("[TOKEN] Error en proxy local:", {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    response: xhr.responseText ? String(xhr.responseText).substring(0, 500) : null,
                    ajaxStatus: status,
                    ajaxError: error,
                });
                callback(false);
            }
        });
    };

    if (sentinelHubUseDirectToken && sentinelHubClientId && sentinelHubClientSecret) {
        var tokenBody = "grant_type=client_credentials&client_id=" + encodeURIComponent(sentinelHubClientId) + "&client_secret=" + encodeURIComponent(sentinelHubClientSecret);
        console.log("[TOKEN] Obteniendo token directamente desde Sentinel Hub");

        $.ajax({
            url: sentinelHubOAuthTokenUrl,
            type: "POST",
            data: tokenBody,
            contentType: "application/x-www-form-urlencoded",
            dataType: "json",
            success: function (data) {
                if (data && data.access_token) {
                    currentSHToken = data.access_token;
                    console.log("[TOKEN] Token directo obtenido exitosamente:", currentSHToken.substring(0, 20) + "...");
                    callback(true);
                    return;
                }
                console.error("[TOKEN] Respuesta inválida de Sentinel Hub:", data);
                if (sentinelHubTokenProxyUrl) {
                    getTokenWithProxy();
                } else {
                    callback(false);
                }
            },
            error: function (xhr, status, error) {
                console.error("[TOKEN] Error obteniendo token directo:", {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    response: xhr.responseText ? String(xhr.responseText).substring(0, 500) : null,
                    ajaxStatus: status,
                    ajaxError: error,
                });
                if (sentinelHubTokenProxyUrl) {
                    getTokenWithProxy();
                } else {
                    callback(false);
                }
            }
        });
        return;
    }

    getTokenWithProxy();
}

function fetchSHTokenViaProxy(callback) {
    // Proxy token flow disabled for direct Sentinel Hub usage.
    if (debugIndices) {
        console.warn("[INDICES] fetchSHTokenViaProxy invoked, but proxy flow is disabled.");
    }
    callback(false);
}

function downloadSHStats() {
    if (lastProcessedSHResult && lastProcessedSHResult.polygons) {
        var blob = new Blob([JSON.stringify(lastProcessedSHResult.polygons, null, 2)], { type: "application/geo+json" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = lastProcessedSHResult.fileName || "indice_reclasificado.geojson";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
    }
    showLoading("Primero debes procesar un índice para poder descargarlo", null, "red", true);
    return;

    loading = $.confirm({
        title: "",
        content: "<div style='text-align: center;'><img src='/images/ig124.gif' style='height: 200px;width: 200px;'></div>",
        buttons: {},
        closeIcon: true,
        lazyOpen: true,
        onContentReady: function () {},
        onOpenBefore: function () {
            loading.buttons.ok.hide();
            loading.buttons.close.hide();
            //loading.showLoading();
        },
    });
    loading.open();
    if (areaLayer3.graphics.length > 0) {
        if (areaLayer3.graphics[0].geometry.type == "extent") {
            currentSearchArea = esri.Polygon.fromExtent(esri.webMercatorUtils.webMercatorToGeographic(areaLayer3.graphics[0].geometry));
            currentSearchArea2 = esri.Polygon.fromExtent(areaLayer3.graphics[0].geometry);
        } else {
            currentSearchArea = esri.webMercatorUtils.webMercatorToGeographic(areaLayer3.graphics[0].geometry);
            currentSearchArea2 = areaLayer3.graphics[0].geometry;
        }
    }
    if (fileLayer2.graphics.length > 0) {
        currentSearchArea = esri.webMercatorUtils.webMercatorToGeographic(fileLayer2.graphics[0].geometry);
        currentSearchArea2 = fileLayer2.graphics[0].geometry;
    }
    var params = null;
    if ($("#selectSHStatsIdx").val() == "NBR" || $("#selectSHStatsIdx").val() == "NBR2") {
        params = {
            input: {
                bounds: {
                    geometry: {
                        type: "Polygon",
                        coordinates: currentSearchArea.rings,
                    },
                },
                data: [
                    {
                        dataFilter: {
                            timeRange: {
                                from: esri.moment($("#selectSHStats1").val(), "DD/MM/yyyy").format("yyyy-MM-DD") + "T00:00:00Z",
                                to: esri.moment($("#selectSHStats2").val(), "DD/MM/yyyy").format("yyyy-MM-DD") + "T00:00:00Z",
                            },
                            maxCloudCoverage: getSHCloudCoverageMaxPercent(),
                            mosaickingOrder: "mostRecent"
                        },
                        type: "sentinel-2-l2a",
                    },
                ],
            },
            output: {
                resx: 0.000269494697,
                resy: 0.000269494697,
                responses: [
                    {
                        identifier: "default",
                        format: {
                            type: "image/tiff",
                        },
                    },
                ],
            },
            evalscript: replaceAll(stats_idx[$("#selectSHStatsIdx").val()], "{{THRESHOLD}}", getSHStatsIndexThresholdValue()),
        };
    }
    if ($("#selectSHStatsIdx").val() == "MAP_DEFORESTATION") {
        params = {
            input: {
                bounds: {
                    geometry: {
                        type: "Polygon",
                        coordinates: currentSearchArea.rings,
                    },
                },
                data: [
                    {
                        dataFilter: {
                            timeRange: {
                                from: esri.moment($("#selectSHStats1").val(), "DD/MM/yyyy").format("yyyy-MM-DD") + "T00:00:00Z",
                                to: esri.moment($("#selectSHStats2").val(), "DD/MM/yyyy").format("yyyy-MM-DD") + "T00:00:00Z",
                            },
                            maxCloudCoverage: getSHCloudCoverageMaxPercent(),
                            mosaickingOrder: "mostRecent"
                        },
                        type: "sentinel-2-l2a",
                    },
                ],
            },
            output: {
                resx: 0.000269494697,
                resy: 0.000269494697,
                responses: [
                    {
                        identifier: "default",
                        format: {
                            type: "image/tiff",
                        },
                    },
                ],
            },
            evalscript: replaceAll(stats_idx[$("#selectSHStatsIdx").val()], "{{THRESHOLD}}", getSHStatsIndexThresholdValue()),
        };
    }

    if (params == null) {
        var date_base = currentSHStatsLabels[sliderSHStats.getValue()].substring(0, 10);
        var new_date_base = null;
        if ($("#selectSHStatsAgg").val() == "P1M") {
            new_date_base = esri.moment(date_base).endOf("month").format("YYYY-MM-DD");
        }
        if ($("#selectSHStatsAgg").val() == "P1W") {
            new_date_base = esri.moment(date_base).endOf("week").format("YYYY-MM-DD");
        }
        if ($("#selectSHStatsAgg").val() == "P1D") {
            new_date_base = esri.moment(date_base).endOf("day").format("YYYY-MM-DD");
        }

        var evalScript = evalScripts_download[$("#selectSHStatsIdx").val()];
        var params = {
            input: {
                bounds: {
                    geometry: {
                        type: "Polygon",
                        coordinates: currentSearchArea.rings,
                    },
                    properties: {
                        crs: "http://www.opengis.net/def/crs/EPSG/0/4326",
                    },
                },
                data: [
                    {
                        dataFilter: {
                            timeRange: {
                                from: date_base + "T00:00:00Z",
                                to: new_date_base + "T00:00:00Z",
                            },
                        },
                        type: "sentinel-2-l2a",
                    },
                ],
            },
            output: {
                resx: 0.000269494697,
                resy: 0.000269494697,
                responses: [
                    {
                        identifier: "default",
                        format: {
                            type: "image/tiff",
                        },
                    },
                ],
            },
            evalscript: evalScript,
        };
    }

    console.log("[SH_PROCESS] Token actual:", currentSHToken ? currentSHToken.substring(0, 20) + "..." : "VACÍO");
    console.log("[SH_PROCESS] Enviando petición a:", sh_image_stats);
    console.log("[SH_PROCESS] Parámetros:", params);

    $.ajax({
        url: sh_image_stats,
        data: JSON.stringify(params),
        type: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + currentSHToken },
        success: function (data) {
            console.log("[SH_PROCESS] Respuesta recibida, tamaño:", data ? data.byteLength : "undefined");
            try {
                clasifyIndex(data, $("#selectSHStatsIdx").val());
            } catch (e) {
                console.error("[SH_PROCESS] Error en clasifyIndex:", e);
                loading.close();
                showLoading("Error procesando imagen: " + e.message, null, "red", true);
            }
        },
        xhr: function () {
            var xhrOverride = new XMLHttpRequest();
            xhrOverride.responseType = "arraybuffer";
            return xhrOverride;
        },
        timeout: 20000,
        error: function (err) {
            console.error("[SH_PROCESS] Error en petición:", {
                status: err.status,
                statusText: err.statusText,
                error: err.error,
                responseText: err.responseText ? String(err.responseText).substring(0, 500) : null
            });
            loading.close();
            showLoading("No se pudo descargar el archivo GeoJSON (error " + err.status + ")", null, "red", true);
        },
        cache: false,
        contentType: false,
        processData: false,
    });
}

function generateChart(labels, meanData, p10Data, p90Data) {
    if (currentChart) {
        currentChart.destroy();
    }
    var processedLabels = labels.map((label) => label.split("T")[0]);
    var ctx = document.getElementById("timeSeriesChart").getContext("2d");
    currentChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: processedLabels,
            datasets: [
                {
                    label: "P10",
                    data: p10Data,
                    borderColor: "rgba(211, 211, 211, 1)",
                    borderWidth: 1,
                    fill: "+2",
                    pointStyle: false,
                },
                {
                    label: "Mean",
                    data: meanData,
                    borderColor: "rgba(0,121,193,255)",
                },
                {
                    label: "P90",
                    data: p90Data,
                    borderColor: "rgba(211, 211, 211, 1)",
                    borderWidth: 1,
                    pointStyle: false,
                },
            ],
        },
        options: {
            onClick: function (e, activeEls) {
                try {
                    var dataIndex = activeEls[0].index;
                    sliderSHStats.setValue(dataIndex);
                    try {
                        var date_base = currentSHStatsLabels[dataIndex].substring(0, 10);
                        var new_date_base = esri.moment(date_base).endOf("month").format("YYYY-MM-DD");
                        currentSHDataLayers.setCustomParameters({
                            TIME: date_base + "/" + new_date_base,
                            GEOMETRY: currentSearchArea2.rings,
                        });
                    } catch (err) {}
                    //var label = e.chart.data.labels[dataIndex];
                } catch (err) {}
            },
        },
    });
}

function closeSHStats() {
    $("#panelSHStats").hide();
    areaLayer3.setVisibility(false);
    fileLayer2.setVisibility(false);
    if (currentSHDataLayers != null) {
        map.removeLayer(currentSHDataLayers);
    }
    clearBurnsSentinelOverlay();
    clearBurnsMonthlyMosaicWindow();
    currentSHLayer.clear();
    currentSHLayer.setVisibility(false);
}

function gotoPrisma() {
    currentScreen = "Prisma";
    reporteUso("Abrir Prisma");
    minAll();
    toggleMenu("small");
    $("#panelPrisma").show();
    areaLayer4.setVisibility(true);
    fileLayer3.setVisibility(true);
    currentPrismaLayer.setVisibility(true);
    currentPrismaLayer.clear();
    if (prismaToken == null) {
        loading.open();
        fetchPrismaToken(function (tokenOk, message) {
            loading.close();
            if (!tokenOk) {
                $.confirm({
                    title: "Observatorio de la tierra y el territorio",
                    content: message || "Funcionalidad no disponible. Intente nuevamente",
                    buttons: {
                        Ok: function () {},
                    },
                });
            }
        });
    }
}

function fetchPrismaToken(callback) {
    var setTokenFromResponse = function (data, apiBaseUrl) {
        var token = extractPrismaAccessToken(data && (data.access || data.token || data));
        if (token) {
            prismaToken = token;
            if (apiBaseUrl) {
                prismaActiveApiBaseUrl = apiBaseUrl;
            }
            callback(true);
            return true;
        }
        return false;
    };

    var fallbackToGeovisor = function (fallbackMessage) {
        $.ajax({
            url: web_service + "/imagenes2?cmd=prisma&token=" + currentAccessToken + "&t=" + new Date().getTime(),
            type: "GET",
            dataType: "json",
            success: function (data) {
                if (data && data.status && setTokenFromResponse(data.token || data.access || data, prismaApiBaseUrl)) {
                    return;
                }
                callback(false, fallbackMessage || "No se pudo obtener token de Prisma");
            },
            error: function () {
                callback(false, fallbackMessage || "No se pudo obtener token de Prisma");
            },
        });
    };

    if (prismaTokenProxyUrl) {
        var primaryTokenAttempt = { tokenUrl: prismaTokenProxyUrl, apiBaseUrl: prismaApiBaseUrl };
        var fallbackTokenAttempt = prismaFallbackTokenProxyUrl && prismaFallbackTokenProxyUrl !== prismaTokenProxyUrl
            ? { tokenUrl: prismaFallbackTokenProxyUrl, apiBaseUrl: prismaFallbackApiBaseUrl || prismaFallbackTokenProxyUrl.replace(/\/prisma-token\/?$/, "/prisma-proxy") }
            : null;
        var tokenAttempts = prismaActiveApiBaseUrl === prismaFallbackApiBaseUrl && fallbackTokenAttempt
            ? [fallbackTokenAttempt]
            : [primaryTokenAttempt];
        if (fallbackTokenAttempt && tokenAttempts[0].tokenUrl !== fallbackTokenAttempt.tokenUrl) {
            tokenAttempts.push(fallbackTokenAttempt);
        }

        var tryTokenProxy = function (attemptIndex, fallbackMessage) {
            var attempt = tokenAttempts[attemptIndex];
            if (!attempt) {
                fallbackToGeovisor(fallbackMessage);
                return;
            }

            $.ajax({
                url: attempt.tokenUrl,
                type: "POST",
                dataType: "json",
                success: function (data) {
                    if (setTokenFromResponse(data, attempt.apiBaseUrl || prismaApiBaseUrl)) {
                        return;
                    }
                    tryTokenProxy(attemptIndex + 1, "No se pudo obtener token de Prisma");
                },
                error: function (xhr) {
                    var message = getPrismaErrorMessage(xhr);
                    tryTokenProxy(attemptIndex + 1, message);
                },
            });
        };

        tryTokenProxy(0);
        return;
    }

    fallbackToGeovisor();
}

function updatePrisma() {
    if (areaLayer4.graphics.length == 0 && fileLayer3.graphics.length == 0) {
        showLoading("Debes seleccionar una area para la geneneración de la grafica", null, "red", true);
        return;
    }
    if (areaLayer4.graphics.length > 0) {
        if (areaLayer4.graphics[0].geometry.type == "extent") {
            currentSearchArea = esri.Polygon.fromExtent(esri.webMercatorUtils.webMercatorToGeographic(areaLayer4.graphics[0].geometry));
            currentSearchArea2 = esri.Polygon.fromExtent(areaLayer4.graphics[0].geometry);
        } else {
            currentSearchArea = esri.webMercatorUtils.webMercatorToGeographic(areaLayer4.graphics[0].geometry);
            currentSearchArea2 = areaLayer4.graphics[0].geometry;
        }
    }
    if (fileLayer3.graphics.length > 0) {
        currentSearchArea = esri.webMercatorUtils.webMercatorToGeographic(fileLayer3.graphics[0].geometry);
        currentSearchArea2 = fileLayer3.graphics[0].geometry;
    }
    if (esri.geometryEngine.geodesicArea(esri.webMercatorUtils.webMercatorToGeographic(currentSearchArea2), "square-kilometers") > 30) {
        showLoading("Le informamos que su polígono excede el límite de área permitido (30 km2), por este motivo, no podrá realizar la consulta de uso de suelo para su área de estudio", null, "red", false);
        return;
    }
    if ($("#selectPrisma1").val() == "" || $("#selectPrisma1").val() == null) {
        showLoading("Debes seleccionar una fecha inicial", null, "red", true);
        return;
    }
    if ($("#selectPrisma2").val() == "" || $("#selectPrisma2").val() == null) {
        showLoading("Debes seleccionar una fecha inicial", null, "red", true);
        return;
    }
    if ($("#selectPrismaIdx").val() == "" || $("#selectPrismaIdx").val() == null) {
        showLoading("Debes seleccionar un indice a calcular", null, "red", true);
        return;
    }
    loading = $.confirm({
        title: "",
        content: "<div style='text-align: center;'><img src='/images/ig124.gif' style='height: 200px;width: 200px;'></div>",
        buttons: {},
        closeIcon: true,
        lazyOpen: true,
        onContentReady: function () {},
        onOpenBefore: function () {
            loading.buttons.ok.hide();
            loading.buttons.close.hide();
            //loading.showLoading();
        },
    });
    loading.open();
    var paramsData = {};
    var geojson = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {},
                geometry: {
                    coordinates: currentSearchArea.rings,
                    type: "Polygon",
                },
            },
        ],
    };
    paramsData.geoJson = geojson;
    paramsData.cloud_cover = sliderPrismaCloud.getValue() / 100.0;
    paramsData.initial_date = esri.moment($("#selectPrisma1").val(), "DD/MM/yyyy").format("yyyy-MM-DD");
    paramsData.final_date = esri.moment($("#selectPrisma2").val(), "DD/MM/yyyy").format("yyyy-MM-DD");
    paramsData.subirresultalportal = false;
    paramsData.zoom = 16;
    paramsData.model = $("#selectPrismaIdx").val();
    paramsData.token = prismaToken;

    currentPrismaLayer.clear();
    requestPrismaAnalysis(paramsData);
}

function getPrismaApiUrl(path, baseUrl) {
    return (baseUrl || prismaActiveApiBaseUrl || prismaApiBaseUrl).replace(/\/+$/, "") + "/" + String(path || "").replace(/^\/+/, "");
}

function getPrismaAuthHeaders() {
    return {
        Authorization: "Bearer " + getPrismaAccessToken(),
        "Content-Type": "application/json"
    };
}

function getPrismaAccessToken() {
    return extractPrismaAccessToken(prismaToken);
}

function extractPrismaAccessToken(tokenValue) {
    if (!tokenValue) return "";

    if (typeof tokenValue === "object") {
        return extractPrismaAccessToken(tokenValue.access || tokenValue.token || tokenValue.jwt || tokenValue.authorization || tokenValue.Authorization);
    }

    var tokenText = String(tokenValue).trim();
    if (!tokenText) return "";

    if ((tokenText.charAt(0) === "{" && tokenText.charAt(tokenText.length - 1) === "}") || (tokenText.charAt(0) === "[" && tokenText.charAt(tokenText.length - 1) === "]")) {
        try {
            return extractPrismaAccessToken(JSON.parse(tokenText));
        } catch (err) {}
    }

    tokenText = tokenText.replace(/^"(.*)"$/, "$1").trim();
    tokenText = tokenText.replace(/^(Bearer|JWT|Token)\s+/i, "").trim();
    return tokenText;
}

function requestPrismaAnalysis(paramsData) {
    if (!getPrismaAccessToken()) {
        fetchPrismaToken(function (tokenOk, message) {
            if (tokenOk) {
                requestPrismaAnalysis(paramsData);
                return;
            }
            loading.close();
            showLoading(message || "No se pudo obtener token de Prisma", null, "red", true);
        });
        return;
    }

    $.ajax({
        url: getPrismaApiUrl(paramsData.model),
        type: "POST",
        data: JSON.stringify({
            geoJson: paramsData.geoJson,
            initial_date: paramsData.initial_date,
            final_date: paramsData.final_date
        }),
        headers: getPrismaAuthHeaders(),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            console.log("[PRISMA] Solicitud creada", data);
            if (data && data.geojson) {
                loading.close();
                drawPrismaGeojson(data.geojson);
                return;
            }
            if (data && data.name) {
                pollPrismaResult(data.name, 0);
                return;
            }
            loading.close();
            showLoading("Prisma no retornó un código de solicitud", null, "red", true);
        },
        error: function (xhr) {
            if (!paramsData._prismaFallbackTried && prismaFallbackApiBaseUrl && prismaFallbackApiBaseUrl !== prismaActiveApiBaseUrl) {
                console.warn("[PRISMA] Servidor principal no disponible, reintentando en localhost", xhr);
                paramsData._prismaFallbackTried = true;
                prismaActiveApiBaseUrl = prismaFallbackApiBaseUrl;
                prismaToken = null;
                requestPrismaAnalysis(paramsData);
                return;
            }
            loading.close();
            showLoading(getPrismaErrorMessage(xhr), null, "red", true);
            console.error("[PRISMA] Error creando solicitud", xhr);
        }
    });
}

function pollPrismaResult(code, attempt) {
    $.ajax({
        url: getPrismaApiUrl("dl/" + code + "/"),
        type: "GET",
        headers: { Authorization: "Bearer " + getPrismaAccessToken() },
        dataType: "json",
        success: function (data) {
            if (data && data.geojson) {
                loading.close();
                drawPrismaGeojson(data.geojson);
                showLoading("Resultado de segmentación agregado al mapa", "ok", "#6BD279", true);
                return;
            }
            if (attempt < 12) {
                window.setTimeout(function () {
                    pollPrismaResult(code, attempt + 1);
                }, 5000);
                return;
            }
            loading.close();
            showLoading("La solicitud Prisma sigue en procesamiento. Código: " + code, null, "green", false);
        },
        error: function (xhr) {
            loading.close();
            showLoading(getPrismaErrorMessage(xhr), null, "red", true);
            console.error("[PRISMA] Error consultando resultado", xhr);
        }
    });
}

function drawPrismaGeojson(geojson) {
    cachePrisma = typeof geojson === "string" ? JSON.parse(geojson) : geojson;
    currentPrismaLayer.clear();
    var converted = Terraformer.ArcGIS.convert(new Terraformer.Primitive(cachePrisma));
    var features = converted instanceof Array ? converted : [converted];
    for (var m = 0; m < features.length; m++) {
        var g = new esri.Graphic(features[m]);
        g.setSymbol(searchImagenSymbol);
        currentPrismaLayer.add(g);
    }
}

function getPrismaErrorMessage(xhr) {
    var fallback = "No se pudo procesar la segmentación de coberturas";
    try {
        var response = xhr && xhr.responseJSON ? xhr.responseJSON : JSON.parse(xhr.responseText);
        if (response && response.detail) return response.detail;
        if (response && response.error) return response.error;
    } catch (err) {}
    if (xhr && xhr.status === 401) return "Token de Prisma inválido o vencido";
    if (xhr && xhr.status === 400) return "Prisma rechazó los parámetros de la solicitud";
    return fallback;
}

function closePrisma() {
    $("#panelPrisma").hide();
    areaLayer4.setVisibility(false);
    fileLayer3.setVisibility(false);
    currentPrismaLayer.clear();
    currentPrismaLayer.setVisibility(false);
}

function getSHAnalyticsClassLabel(properties) {
    properties = properties || {};
    return String(properties.class_label || properties.object_class_label || properties.class || "").trim().toLowerCase();
}

function getSHAnalyticsLocalSubscriptionTitle(classLabel) {
    var normalizedClass = String(classLabel || "").trim().toLowerCase();
    if (normalizedClass === "building") {
        return "Detección de Construcciones";
    }
    if (normalizedClass === "road") {
        return "Detección de vías";
    }
    return normalizedClass ? "Detección " + normalizedClass : "Detección sin clasificar";
}

function getSHAnalyticsDateValue(properties) {
    properties = properties || {};
    return properties.date || properties.acquired || properties.published || properties.observed || "2000-01-01";
}

function normalizeSHAnalyticsLocalFeature(feature) {
    feature = feature || {};
    feature.properties = feature.properties || {};
    feature.properties.date = getSHAnalyticsDateValue(feature.properties);
    feature.properties.published = feature.properties.published || feature.properties.date;
    feature.properties.object_area_m2 = feature.properties.object_area_m2 || feature.properties.area_m2 || 0;
    feature.properties.score = feature.properties.score || feature.properties.confidence || 0;
    feature.properties.class_label = getSHAnalyticsClassLabel(feature.properties);
    return feature;
}

    function extractSHAnalyticsGeojsonFeatures(data) {
    if (Array.isArray(data)) {
        return data;
    }
    if (data && Array.isArray(data.features)) {
        return data.features;
    }
    if (data && Array.isArray(data.data)) {
        return data.data;
    }
    if (data && Array.isArray(data.results)) {
        return data.results;
    }
    return [];
}

function loadSHAnalyticsLocalFeatures(onSuccess, onError) {
    if (Array.isArray(currentSHAnalyticsLocalFeatures)) {
        onSuccess(currentSHAnalyticsLocalFeatures);
        return;
    }
    if (currentSHAnalyticsLocalFeaturesLoading) {
        window.setTimeout(function () {
            loadSHAnalyticsLocalFeatures(onSuccess, onError);
        }, 120);
        return;
    }
    currentSHAnalyticsLocalFeaturesLoading = true;
    $.ajax({
        url: planetAnalyticsLocalUrl,
        type: "GET",
        dataType: "json",
        cache: true,
        success: function (data) {
            currentSHAnalyticsLocalFeaturesLoading = false;
            currentSHAnalyticsLocalFeatures = extractSHAnalyticsGeojsonFeatures(data).map(normalizeSHAnalyticsLocalFeature).filter(function (feature) {
                return feature && feature.geometry && getSHAnalyticsClassLabel(feature.properties);
            });
            onSuccess(currentSHAnalyticsLocalFeatures);
        },
        error: function (xhr) {
            currentSHAnalyticsLocalFeaturesLoading = false;
            console.error("Local Planet Analytics GeoJSON error", planetAnalyticsLocalUrl, xhr && xhr.status ? xhr.status : xhr);
            if (onError) {
                onError();
            } else {
                onSuccess([]);
            }
        },
    });
}

function buildSHAnalyticsLocalSubscriptions(features) {
    var classes = {};
    var orderedClasses = [];
    features.forEach(function (feature) {
        var classLabel = getSHAnalyticsClassLabel(feature.properties);
        if (!classLabel || classes[classLabel]) {
            return;
        }
        classes[classLabel] = true;
        orderedClasses.push(classLabel);
    });
    orderedClasses.sort(function (a, b) {
        var preferredOrder = { building: 1, road: 2 };
        return (preferredOrder[a] || 99) - (preferredOrder[b] || 99) || a.localeCompare(b);
    });
    return orderedClasses.map(function (classLabel) {
        return {
            id: classLabel,
            title: getSHAnalyticsLocalSubscriptionTitle(classLabel),
            description: "",
            classLabel: classLabel,
            raw: { source: planetAnalyticsLocalUrl },
        };
    });
}

function loadAnalyticsSubscriptions(onSuccess, onError) {
    loadSHAnalyticsLocalFeatures(
        function (features) {
            onSuccess(buildSHAnalyticsLocalSubscriptions(features));
        },
        onError
    );
}

function getAnalyticsNextPageLink(collectionData) {
    var getLinkValue = function (link) {
        if (!link) {
            return null;
        }
        if (typeof link === "string") {
            return link;
        }
        if (typeof link === "object") {
            return link.href || link.url || link.link || null;
        }
        return null;
    };

    var findNextInLinks = function (links) {
        if (!links) {
            return null;
        }
        if (Array.isArray(links)) {
            for (var i = 0; i < links.length; i++) {
                var link = links[i];
                if (link && (link.rel === "next" || link.name === "next" || link.key === "next")) {
                    return getLinkValue(link);
                }
            }
            return null;
        }
        if (typeof links === "object" && links.next) {
            return getLinkValue(links.next);
        }
        return null;
    };

    return (collectionData && (findNextInLinks(collectionData._links) || findNextInLinks(collectionData.links) || getLinkValue(collectionData.next))) || null;
}

function loadAnalyticsChanges(subscriptionId, onSuccess, onError, pageUrl, retryCount) {
    retryCount = retryCount || 0;
    if (!pageUrl) {
        loadSHAnalyticsLocalFeatures(
            function (features) {
                var selectedClass = String(subscriptionId || "").trim().toLowerCase();
                var filteredFeatures = features.filter(function (feature) {
                    return getSHAnalyticsClassLabel(feature.properties) === selectedClass;
                });
                onSuccess(filteredFeatures, null, filteredFeatures.length);
            },
            function () {
                if (onError) {
                    onError();
                } else {
                    onSuccess([], null, null);
                }
            }
        );
        return;
    }
    if (!usePlanetDirect) {
        if (onError) {
            onError();
        } else {
            onSuccess([], null, null);
        }
        return;
    }

    var url;
    if (pageUrl) {
        if (typeof pageUrl === "object" && pageUrl.href) {
            pageUrl = pageUrl.href;
        }
        if (pageUrl.indexOf("http") === 0) {
            url = pageUrl;
        } else {
            url = pageUrl.indexOf("https://api.planet.com") === 0 ? pageUrl : "https://api.planet.com" + pageUrl;
            if (url.indexOf("api_key=") === -1) {
                url += url.indexOf("?") === -1 ? "?" : "&";
                url += "api_key=" + encodeURIComponent(planetApiKey);
            }
        }
    } else {
        url = buildPlanetUrl("/analytics/collections/" + encodeURIComponent(subscriptionId) + "/items?limit=10000");
    }

    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        crossDomain: true,
        headers: Object.assign({ Accept: "application/json" }, getPlanetAuthorizationHeader()),
        success: function (collectionData) {
            var features = [];
            if (Array.isArray(collectionData)) {
                features = collectionData;
            } else if (Array.isArray(collectionData.features)) {
                features = collectionData.features;
            } else if (Array.isArray(collectionData.data)) {
                features = collectionData.data;
            } else if (Array.isArray(collectionData.results)) {
                features = collectionData.results;
            }

            if (!Array.isArray(features) || features.length === 0) {
                if (onError) {
                    onError();
                } else {
                    onSuccess([], null, null);
                }
                return;
            }

            var nextPage = getAnalyticsNextPageLink(collectionData);

            var totalCount = null;
            if (collectionData) {
                totalCount = collectionData.total_count || (collectionData.meta && collectionData.meta.total) || (collectionData.metadata && collectionData.metadata.total) || collectionData.total || null;
            }

            var normalized = features.map(function (feature) {
                feature.properties = feature.properties || {};
                feature.properties.date = feature.properties.date || feature.properties.acquired || feature.properties.published || "2000-01-01";
                feature.properties.object_area_m2 = feature.properties.object_area_m2 || feature.properties.area_m2 || 0;
                feature.properties.score = feature.properties.score || feature.properties.confidence || 0;
                return feature;
            });
            onSuccess(normalized, nextPage, totalCount);
        },
        error: function (xhr) {
            if (xhr && xhr.status === 429 && retryCount < 5) {
                var retryAfter = parseInt(xhr.getResponseHeader && xhr.getResponseHeader("Retry-After"), 10);
                var delay = !isNaN(retryAfter) ? retryAfter * 1000 : Math.pow(2, retryCount) * 1000;
                window.setTimeout(function () {
                    loadAnalyticsChanges(subscriptionId, onSuccess, onError, pageUrl, retryCount + 1);
                }, delay);
                return;
            }
            console.error("Planet mosaic details error", xhr && xhr.status ? xhr.status : xhr, xhr && xhr.responseText ? xhr.responseText : xhr);
            if (onError) {
                onError();
            } else {
                onSuccess([], null, null);
            }
        },
    });
}

function setSHAnalyticsBoundaryStatus(message, isError) {
    var status = $("#shAnalyticsBoundaryStatus");
    if (!status.length) {
        return;
    }
    status.toggleClass("error", !!isError);
    status.html(message || "");
}

function createSHAnalyticsBoundarySymbol() {
    var borderSymbol = new esri.SimpleLineSymbol(
        esri.SimpleLineSymbol.STYLE_SOLID,
        new esri.Color([255, 224, 0, 1]),
        2.4
    );
    return new esri.SimpleFillSymbol(
        esri.SimpleFillSymbol.STYLE_NULL,
        borderSymbol,
        new esri.Color([255, 224, 0, 0.08])
    );
}

function bringSHAnalyticsBoundariesToFront() {
    if (!map || !currentSHAnalyticsBoundaryLayer || !map.reorderLayer) {
        return;
    }
    try {
        var targetIndex = map.graphicsLayerIds && map.graphicsLayerIds.length ? map.graphicsLayerIds.length - 1 : map.layerIds.length;
        map.reorderLayer(currentSHAnalyticsBoundaryLayer, targetIndex);
    } catch (err) {
        console.warn("No se pudo traer al frente los límites de Planet Analytics", err);
    }
}

function addSHAnalyticsBoundaryFeature(feature, index) {
    if (!feature || !feature.geometry || !currentSHAnalyticsBoundaryLayer) {
        return false;
    }
    try {
        var arcgisFeature = Terraformer.ArcGIS.fromGeoJSON(feature);
        var geometryJson = arcgisFeature.geometry || arcgisFeature;
        var geometry = esri.jsonUtilsGeometry.fromJson(geometryJson);
        if (!geometry) {
            return false;
        }
        if (!geometry.spatialReference || geometry.spatialReference.wkid === 4326) {
            geometry = esri.webMercatorUtils.geographicToWebMercator(geometry);
        }
        var graphic = new esri.Graphic(geometry, createSHAnalyticsBoundarySymbol());
        graphic.attributes = {
            analyticsBoundaryIndex: index,
            name: feature.properties && (feature.properties.name || feature.properties.nombre || feature.properties.Name || feature.properties.NOMBRE),
            source: "planet-analytics-boundary",
        };
        currentSHAnalyticsBoundaryLayer.add(graphic);
        return true;
    } catch (err) {
        console.warn("No se pudo dibujar un límite de Planet Analytics", err, feature);
        return false;
    }
}

function drawSHAnalyticsBoundaries(geojson) {
    if (!currentSHAnalyticsBoundaryLayer) {
        return 0;
    }
    currentSHAnalyticsBoundaryLayer.clear();
    var features = [];
    if (geojson && geojson.type === "FeatureCollection" && Array.isArray(geojson.features)) {
        features = geojson.features;
    } else if (geojson && geojson.type === "Feature") {
        features = [geojson];
    } else if (geojson && geojson.type && geojson.coordinates) {
        features = [{ type: "Feature", properties: {}, geometry: geojson }];
    }

    var added = 0;
    for (var i = 0; i < features.length; i++) {
        if (addSHAnalyticsBoundaryFeature(features[i], i)) {
            added += 1;
        }
    }
    return added;
}

function loadSHAnalyticsBoundaries() {
    if (!currentSHAnalyticsBoundaryLayer || currentSHAnalyticsBoundariesLoaded || currentSHAnalyticsBoundariesLoading) {
        return;
    }
    if (!planetAnalyticsBoundaryUrl) {
        setSHAnalyticsBoundaryStatus("Configure planetAnalyticsBoundaryUrl para cargar los límites.", true);
        return;
    }
    currentSHAnalyticsBoundariesLoading = true;
    setSHAnalyticsBoundaryStatus("Cargando límites del área analizada desde " + planetAnalyticsBoundaryUrl + "…", false);
    $.ajax({
        url: planetAnalyticsBoundaryUrl,
        type: "GET",
        dataType: "json",
        success: function (geojson) {
            currentSHAnalyticsBoundariesLoading = false;
            var added = drawSHAnalyticsBoundaries(geojson);
            currentSHAnalyticsBoundariesLoaded = added > 0;
            if (added > 0) {
                currentSHAnalyticsBoundaryLayer.setVisibility($("#chkSHAnalyticsBoundaries").is(":checked"));
                bringSHAnalyticsBoundariesToFront();
                setSHAnalyticsBoundaryStatus("", false);
            } else {
                setSHAnalyticsBoundaryStatus("El archivo de límites no contiene geometrías válidas.", true);
            }
        },
        error: function () {
            currentSHAnalyticsBoundariesLoading = false;
            currentSHAnalyticsBoundaryLayer.clear();
            setSHAnalyticsBoundaryStatus("No se encontró data/planet-analytics-limites.geojson. Convierta el SHP a GeoJSON y publíquelo en esa ruta.", true);
        },
    });
}

function escapeSHAnalyticsHtml(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function getSHAnalyticsPublishedMoment(feature) {
    if (!feature || !feature.properties) {
        return null;
    }
    var properties = feature.properties;
    var publishedValue = properties.published || properties.publication_date || properties.publish_date || properties.date_published || properties.date;
    if (!publishedValue || typeof esri === "undefined" || !esri.moment) {
        return null;
    }
    var publishedMoment = esri.moment(publishedValue, [esri.moment.ISO_8601, "YYYY-MM-DD", "DD/MM/YYYY", "DD/MM/yyyy"], true);
    if (!publishedMoment.isValid()) {
        publishedMoment = esri.moment(publishedValue);
    }
    return publishedMoment.isValid() ? publishedMoment : null;
}

function getSHAnalyticsPublishedMonthKey(feature) {
    var publishedMoment = getSHAnalyticsPublishedMoment(feature);
    return publishedMoment ? publishedMoment.format("YYYY-MM") : null;
}

function formatSHAnalyticsMonthLabel(monthKey) {
    if (!monthKey || typeof esri === "undefined" || !esri.moment) {
        return "";
    }
    var monthNamesEs = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    var monthMoment = esri.moment(monthKey + "-01", "YYYY-MM-DD", true);
    if (!monthMoment.isValid()) {
        return monthKey;
    }
    return monthNamesEs[monthMoment.month()] + " " + monthMoment.format("YYYY");
}

function formatSHAnalyticsMonthLabelLong(monthKey) {
    if (!monthKey || typeof esri === "undefined" || !esri.moment) {
        return "";
    }
    var monthNamesEs = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    var monthMoment = esri.moment(monthKey + "-01", "YYYY-MM-DD", true);
    if (!monthMoment.isValid()) {
        return monthKey;
    }
    return monthNamesEs[monthMoment.month()] + " " + monthMoment.format("YYYY");
}

var shAnalyticsMonthPickerState = { field: null, year: null };

function getSHAnalyticsMonthMoment(monthKey) {
    if (!monthKey || typeof esri === "undefined" || !esri.moment) {
        return null;
    }
    var monthMoment = esri.moment(monthKey + "-01", "YYYY-MM-DD", true);
    return monthMoment.isValid() ? monthMoment : null;
}

function updateSHAnalyticsMonthTriggerLabels() {
    $("#shAnalyticsStartMonthLabel").text(formatSHAnalyticsMonthLabelLong(currentSHAnalyticsDateFilter.start || currentSHAnalyticsDateFilter.min));
    $("#shAnalyticsEndMonthLabel").text(formatSHAnalyticsMonthLabelLong(currentSHAnalyticsDateFilter.end || currentSHAnalyticsDateFilter.max));
}

function hideSHAnalyticsMonthPicker() {
    $("#shAnalyticsMonthPickerPopover").hide();
    $(".sh-analytics-month-trigger").removeClass("active");
}

function renderSHAnalyticsMonthPicker() {
    var popover = $("#shAnalyticsMonthPickerPopover");
    var grid = $("#shAnalyticsMonthPickerGrid");
    if (!popover.length || !grid.length || !currentSHAnalyticsDateFilter.min || !currentSHAnalyticsDateFilter.max) {
        return;
    }
    var field = shAnalyticsMonthPickerState.field || "start";
    var selectedKey = field === "end"
        ? (currentSHAnalyticsDateFilter.end || currentSHAnalyticsDateFilter.max)
        : (currentSHAnalyticsDateFilter.start || currentSHAnalyticsDateFilter.min);
    var selectedMoment = getSHAnalyticsMonthMoment(selectedKey) || getSHAnalyticsMonthMoment(currentSHAnalyticsDateFilter.min);
    if (shAnalyticsMonthPickerState.year === null && selectedMoment) {
        shAnalyticsMonthPickerState.year = selectedMoment.year();
    }
    var pickerYear = shAnalyticsMonthPickerState.year || (selectedMoment ? selectedMoment.year() : new Date().getFullYear());
    var minMoment = getSHAnalyticsMonthMoment(currentSHAnalyticsDateFilter.min);
    var maxMoment = getSHAnalyticsMonthMoment(currentSHAnalyticsDateFilter.max);
    var startMoment = getSHAnalyticsMonthMoment(currentSHAnalyticsDateFilter.start || currentSHAnalyticsDateFilter.min);
    var endMoment = getSHAnalyticsMonthMoment(currentSHAnalyticsDateFilter.end || currentSHAnalyticsDateFilter.max);
    var monthShortNamesEs = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    var html = "";
    for (var monthIdx = 0; monthIdx < 12; monthIdx++) {
        var monthMoment = esri.moment({ year: pickerYear, month: monthIdx, day: 1 });
        var isDisabled = (minMoment && monthMoment.isBefore(minMoment, "month")) ||
            (maxMoment && monthMoment.isAfter(maxMoment, "month")) ||
            (field === "start" && endMoment && monthMoment.isAfter(endMoment, "month")) ||
            (field === "end" && startMoment && monthMoment.isBefore(startMoment, "month"));
        var isActive = selectedMoment && selectedMoment.year() === pickerYear && selectedMoment.month() === monthIdx;
        html += "<button type='button' class='sh-analytics-month-option" + (isActive ? " active" : "") + "' data-month='" + monthIdx + "'" + (isDisabled ? " disabled" : "") + ">" + monthShortNamesEs[monthIdx] + "</button>";
    }
    $("#shAnalyticsMonthPickerYear").text(pickerYear);
    grid.html(html);
}

function showSHAnalyticsMonthPicker(field) {
    shAnalyticsMonthPickerState.field = field;
    var selectedKey = field === "end"
        ? (currentSHAnalyticsDateFilter.end || currentSHAnalyticsDateFilter.max)
        : (currentSHAnalyticsDateFilter.start || currentSHAnalyticsDateFilter.min);
    var selectedMoment = getSHAnalyticsMonthMoment(selectedKey);
    shAnalyticsMonthPickerState.year = selectedMoment ? selectedMoment.year() : null;
    $(".sh-analytics-month-trigger").removeClass("active");
    $(".sh-analytics-month-trigger[data-sh-analytics-month-field='" + field + "']").addClass("active");
    renderSHAnalyticsMonthPicker();
    $("#shAnalyticsMonthPickerPopover").show();
}

function resetSHAnalyticsDateFilter() {
    currentSHAnalyticsDateFilter = { min: null, max: null, start: null, end: null };
    currentSHAnalyticsDateFilterUserChanged = false;
    $("#shAnalyticsStartMonth").val("");
    $("#shAnalyticsEndMonth").val("");
    $("#shAnalyticsDateFilter").hide();
    $("#shAnalyticsDateFilterStatus").html("");
    hideSHAnalyticsMonthPicker();
    updateSHAnalyticsMonthTriggerLabels();
}

function updateSHAnalyticsDateFilterBounds() {
    var minMonth = null;
    var maxMonth = null;
    for (var i = 0; i < currentSHAnalyticsAllData.length; i++) {
        var monthKey = getSHAnalyticsPublishedMonthKey(currentSHAnalyticsAllData[i]);
        if (!monthKey) {
            continue;
        }
        if (!minMonth || monthKey < minMonth) {
            minMonth = monthKey;
        }
        if (!maxMonth || monthKey > maxMonth) {
            maxMonth = monthKey;
        }
    }
    currentSHAnalyticsDateFilter.min = minMonth;
    currentSHAnalyticsDateFilter.max = maxMonth;
    if (!currentSHAnalyticsDateFilterUserChanged) {
        currentSHAnalyticsDateFilter.start = minMonth;
        currentSHAnalyticsDateFilter.end = maxMonth;
    } else {
        currentSHAnalyticsDateFilter.start = currentSHAnalyticsDateFilter.start || minMonth;
        currentSHAnalyticsDateFilter.end = currentSHAnalyticsDateFilter.end || maxMonth;
    }
    renderSHAnalyticsDateFilterControl();
}

function renderSHAnalyticsDateFilterControl() {
    var control = $("#shAnalyticsDateFilter");
    if (!control.length) {
        return;
    }
    if (!$("#selectSHAnalyticsSubs").val() || !currentSHAnalyticsDateFilter.min || !currentSHAnalyticsDateFilter.max) {
        control.hide();
        return;
    }
    control.show();
    $("#shAnalyticsStartMonth").val(currentSHAnalyticsDateFilter.start || currentSHAnalyticsDateFilter.min);
    $("#shAnalyticsEndMonth").val(currentSHAnalyticsDateFilter.end || currentSHAnalyticsDateFilter.max);
    updateSHAnalyticsMonthTriggerLabels();
    if ($("#shAnalyticsMonthPickerPopover").is(":visible")) {
        renderSHAnalyticsMonthPicker();
    }
    updateSHAnalyticsDateFilterStatus();
}

function updateSHAnalyticsDateFilterStatus() {
    var status = $("#shAnalyticsDateFilterStatus");
    if (!status.length || !currentSHAnalyticsDateFilter.min || !currentSHAnalyticsDateFilter.max) {
        return;
    }
    status.html(
        "Publicación: " + formatSHAnalyticsMonthLabel(currentSHAnalyticsDateFilter.start) +
        " - " + formatSHAnalyticsMonthLabel(currentSHAnalyticsDateFilter.end) +
        " (" + currentSHAnalyticsData.length + " de " + currentSHAnalyticsAllData.length + " registro(s))."
    );
}

function applySHAnalyticsDateFilter() {
    var startMonth = currentSHAnalyticsDateFilter.start || currentSHAnalyticsDateFilter.min;
    var endMonth = currentSHAnalyticsDateFilter.end || currentSHAnalyticsDateFilter.max;
    if (startMonth && endMonth && startMonth > endMonth) {
        var previousStart = startMonth;
        startMonth = endMonth;
        endMonth = previousStart;
        currentSHAnalyticsDateFilter.start = startMonth;
        currentSHAnalyticsDateFilter.end = endMonth;
    }
    currentSHAnalyticsData = currentSHAnalyticsAllData.filter(function (feature) {
        var monthKey = getSHAnalyticsPublishedMonthKey(feature);
        if (!monthKey) {
            return false;
        }
        return (!startMonth || monthKey >= startMonth) && (!endMonth || monthKey <= endMonth);
    });
    renderSHAnalyticsDateFilterControl();
}

function refreshSHAnalyticsFilteredView(summaryPrefix) {
    applySHAnalyticsDateFilter();
    currentSHAnalyticsLayer.clear();
    if (currentSHAnalyticsAdminLayer) {
        currentSHAnalyticsAdminLayer.clear();
    }
    if (currentSHAnalyticsHexLayer) {
        currentSHAnalyticsHexLayer.clear();
    }
    currentSHAnalyticsSelectedIndex = null;
    currentSHAnalyticsSelectedHexKey = null;
    if (getSHAnalyticsActiveAdminConfig().loaded) {
        updateSHAnalyticsMunicipalityStats();
    } else {
        renderSHAnalyticsMunicipalityTable();
    }
    if (currentSHAnalyticsData.length === 0) {
        hideSHAnalyticsLegend();
        $("#selectSHAnalyticsResults").html("<div class='panel panel-default panel-list'><div style='padding:8px;'>No se encontraron cambios publicados en el rango seleccionado.</div></div>");
        return;
    }
    var summary = (summaryPrefix || "Mostrando") + " " + currentSHAnalyticsData.length + " de " + currentSHAnalyticsAllData.length + " cambios cargados, publicados entre " + formatSHAnalyticsMonthLabel(currentSHAnalyticsDateFilter.start) + " y " + formatSHAnalyticsMonthLabel(currentSHAnalyticsDateFilter.end) + ".";
    renderSHAnalyticsHexHeatmap(summary);
    updateSHAnalyticsDateFilterStatus();
}

function normalizeSHAnalyticsMunicipalityText(value) {
    var text = String(value == null ? "" : value).toLowerCase();
    if (text.normalize) {
        text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    return text;
}

function getSHAnalyticsMunicipalityName(properties) {
    properties = properties || {};
    var nameFields = [
        "DeNombre",
        "denombre",
        "DENOMBRE",
        "MpNombre",
        "mpnombre",
        "MPNOMBRE",
        "MPIO_CNMBR",
        "NOMBRE_MPI",
        "NOMBRE_MPIO",
        "NOM_MPIO",
        "MUNICIPIO",
        "municipio",
        "Municipio",
        "nombre",
        "NOMBRE",
        "name",
        "Name",
    ];
    for (var i = 0; i < nameFields.length; i++) {
        var fieldValue = properties[nameFields[i]];
        if (fieldValue != null && String(fieldValue).trim() !== "") {
            return String(fieldValue).trim();
        }
    }

    var normalizedFieldNames = {};
    for (var propertyName in properties) {
        if (Object.prototype.hasOwnProperty.call(properties, propertyName)) {
            normalizedFieldNames[propertyName.toLowerCase()] = propertyName;
        }
    }
    for (var j = 0; j < nameFields.length; j++) {
        var normalizedFieldName = nameFields[j].toLowerCase();
        var matchedPropertyName = normalizedFieldNames[normalizedFieldName];
        if (matchedPropertyName) {
            var matchedValue = properties[matchedPropertyName];
            if (matchedValue != null && String(matchedValue).trim() !== "") {
                return String(matchedValue).trim();
            }
        }
    }
    return "Municipio sin nombre";
}

function getSHAnalyticsAdminName(properties, adminLevel) {
    if (adminLevel === "department") {
        var departmentName = getSHAnalyticsMunicipalityName(properties);
        return departmentName === "Municipio sin nombre" ? "Departamento sin nombre" : departmentName;
    }
    return getSHAnalyticsMunicipalityName(properties);
}

function prepareSHAnalyticsAdminFeature(feature, index, adminLevel) {
    if (!feature || !feature.geometry) {
        return null;
    }
    var bbox = null;
    try {
        if (window.turf && turf.bbox) {
            bbox = turf.bbox(feature);
        }
    } catch (err) {
        console.warn("No se pudo calcular el bbox del municipio", err, feature);
    }
    return {
        feature: feature,
        index: index,
        adminLevel: adminLevel,
        name: getSHAnalyticsAdminName(feature.properties, adminLevel),
        normalizedName: normalizeSHAnalyticsMunicipalityText(getSHAnalyticsAdminName(feature.properties, adminLevel)),
        bbox: bbox,
    };
}

function prepareSHAnalyticsMunicipalityFeature(feature, index) {
    return prepareSHAnalyticsAdminFeature(feature, index, "municipality");
}

function getSHAnalyticsActiveAdminConfig() {
    if (currentSHAnalyticsAdminLevel === "municipality") {
        return {
            level: "municipality",
            singular: "municipio",
            plural: "municipios",
            title: "Municipio",
            url: planetAnalyticsMunicipalityUrl,
            features: currentSHAnalyticsMunicipalities,
            loaded: currentSHAnalyticsMunicipalitiesLoaded,
            loading: currentSHAnalyticsMunicipalitiesLoading,
            stats: currentSHAnalyticsMunicipalityStats,
        };
    }
    return {
        level: "department",
        singular: "departamento",
        plural: "departamentos",
        title: "Departamento",
        url: planetAnalyticsDepartmentUrl,
        features: currentSHAnalyticsDepartments,
        loaded: currentSHAnalyticsDepartmentsLoaded,
        loading: currentSHAnalyticsDepartmentsLoading,
        stats: currentSHAnalyticsDepartmentStats,
    };
}

function setSHAnalyticsMunicipalityMessage(message, isError) {
    var container = $("#shAnalyticsMunicipalityResults");
    if (!container.length) {
        return;
    }
    container.html("<div class='sh-analytics-municipality-message" + (isError ? " error" : "") + "'>" + escapeSHAnalyticsHtml(message) + "</div>");
}

function slugifySHAnalyticsFileName(value) {
    var text = normalizeSHAnalyticsMunicipalityText(value || "planet_analytics")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
    return text || "planet_analytics";
}

function getSHAnalyticsFilteredFeatureCollection(features) {
    return {
        type: "FeatureCollection",
        features: (features || []).map(function (feature) {
            return JSON.parse(JSON.stringify(feature));
        }),
    };
}

function downloadSHAnalyticsFeatureCollection(features, fileName) {
    var featureCollection = getSHAnalyticsFilteredFeatureCollection(features);
    var blob = new Blob([JSON.stringify(featureCollection)], { type: "application/geo+json;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function () {
        URL.revokeObjectURL(url);
    }, 0);
}

function getSHAnalyticsAdminStatsByIndex(adminLevel, adminIndex) {
    var stats = adminLevel === "municipality" ? currentSHAnalyticsMunicipalityStats : currentSHAnalyticsDepartmentStats;
    adminIndex = parseInt(adminIndex, 10);
    if (isNaN(adminIndex)) {
        return null;
    }
    for (var i = 0; i < stats.length; i++) {
        if (stats[i].index === adminIndex) {
            return stats[i];
        }
    }
    return null;
}

function downloadSHAnalyticsAdminData(adminLevel, adminIndex) {
    var adminConfig = getSHAnalyticsActiveAdminConfig();
    var features = [];
    var fileLabel = adminConfig.level;
    if (adminLevel === "total") {
        features = currentSHAnalyticsData || [];
        fileLabel = adminConfig.level + "_total";
    } else {
        var stat = getSHAnalyticsAdminStatsByIndex(adminLevel, adminIndex);
        if (!stat) {
            showLoading("No se encontraron datos para descargar", null, "red", true);
            return;
        }
        features = (stat.indexes || []).map(function (dataIndex) {
            return currentSHAnalyticsData[dataIndex];
        }).filter(function (feature) {
            return !!feature;
        });
        fileLabel = adminConfig.level + "_" + stat.name;
    }
    downloadSHAnalyticsFeatureCollection(features, slugifySHAnalyticsFileName(fileLabel) + ".geojson");
}

function downloadSHAnalyticsFeatureByIndex(dataIndex) {
    dataIndex = parseInt(dataIndex, 10);
    if (isNaN(dataIndex) || !currentSHAnalyticsData || !currentSHAnalyticsData[dataIndex]) {
        showLoading("No se encontró el polígono para descargar", null, "red", true);
        return;
    }
    downloadSHAnalyticsFeatureCollection([currentSHAnalyticsData[dataIndex]], "planet_analytics_poligono_" + dataIndex + ".geojson");
}

function getSHAnalyticsPdfMonthLabel(dateMoment) {
    var monthNamesEs = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return monthNamesEs[dateMoment.month()] + " " + dateMoment.format("YYYY");
}

function buildSHAnalyticsPlanetTileProxyUrl(mosaicId, z, x, y) {
    if (!planetTileProxyUrl) {
        return null;
    }
    var separator = planetTileProxyUrl.indexOf("?") === -1 ? "?" : "&";
    return planetTileProxyUrl + separator +
        "mosaicId=" + encodeURIComponent(mosaicId) +
        "&z=" + encodeURIComponent(z) +
        "&x=" + encodeURIComponent(x) +
        "&y=" + encodeURIComponent(y);
}

function projectLonLatToTileFraction(lon, lat) {
    var safeLat = Math.max(Math.min(lat, 85.05112878), -85.05112878);
    var sinLat = Math.sin(safeLat * Math.PI / 180);
    return {
        x: (lon + 180) / 360,
        y: 0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI),
    };
}

function chooseSHAnalyticsPdfTileZoom(bbox, width, height) {
    var minPoint = projectLonLatToTileFraction(bbox[0], bbox[3]);
    var maxPoint = projectLonLatToTileFraction(bbox[2], bbox[1]);
    var dx = Math.max(Math.abs(maxPoint.x - minPoint.x), 0.0000001);
    var dy = Math.max(Math.abs(maxPoint.y - minPoint.y), 0.0000001);
    var zoom = Math.floor(Math.log(Math.min((width * 0.92) / (dx * 256), (height * 0.92) / (dy * 256))) / Math.LN2);
    if (!isFinite(zoom)) {
        zoom = 16;
    }
    return Math.max(12, Math.min(18, zoom));
}

function loadSHAnalyticsTileImage(url) {
    return new Promise(function (resolve) {
        var image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = function () {
            resolve(image);
        };
        image.onerror = function () {
            resolve(null);
        };
        image.src = url;
    });
}

function drawSHAnalyticsPdfPolygonGeometry(ctx, geometry, topLeftPx, zoom) {
    if (!geometry || !geometry.coordinates) {
        return;
    }
    var scale = 256 * Math.pow(2, zoom);
    var drawRing = function (ring) {
        if (!ring || !ring.length) {
            return;
        }
        ctx.beginPath();
        ring.forEach(function (coord, idx) {
            var projected = projectLonLatToTileFraction(coord[0], coord[1]);
            var x = projected.x * scale - topLeftPx.x;
            var y = projected.y * scale - topLeftPx.y;
            if (idx === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    ctx.save();
    ctx.fillStyle = "rgba(80, 210, 210, 0.12)";
    ctx.strokeStyle = "rgba(80, 210, 210, 0.95)";
    ctx.lineWidth = 2;
    if (geometry.type === "Polygon") {
        geometry.coordinates.forEach(drawRing);
    } else if (geometry.type === "MultiPolygon") {
        geometry.coordinates.forEach(function (polygon) {
            polygon.forEach(drawRing);
        });
    }
    ctx.restore();
}

function createSHAnalyticsPdfMosaicSnapshot(feature, dateMoment) {
    if (!feature || !feature.geometry || !planetTileProxyUrl) {
        return Promise.resolve(null);
    }
    var width = 520;
    var height = 300;
    var bbox;
    try {
        bbox = turf.bbox(feature);
    } catch (e) {
        return Promise.resolve(null);
    }
    var bboxWidth = Math.max(bbox[2] - bbox[0], 0.00025);
    var bboxHeight = Math.max(bbox[3] - bbox[1], 0.00025);
    bbox = [
        bbox[0] - bboxWidth * 0.9,
        bbox[1] - bboxHeight * 0.9,
        bbox[2] + bboxWidth * 0.9,
        bbox[3] + bboxHeight * 0.9,
    ];
    var zoom = chooseSHAnalyticsPdfTileZoom(bbox, width, height);
    var scale = 256 * Math.pow(2, zoom);
    var centerLon = (bbox[0] + bbox[2]) / 2;
    var centerLat = (bbox[1] + bbox[3]) / 2;
    var centerFraction = projectLonLatToTileFraction(centerLon, centerLat);
    var centerPx = { x: centerFraction.x * scale, y: centerFraction.y * scale };
    var topLeftPx = { x: centerPx.x - width / 2, y: centerPx.y - height / 2 };
    var minTileX = Math.floor(topLeftPx.x / 256);
    var minTileY = Math.floor(topLeftPx.y / 256);
    var maxTileX = Math.floor((topLeftPx.x + width) / 256);
    var maxTileY = Math.floor((topLeftPx.y + height) / 256);
    var tileCount = Math.pow(2, zoom);
    var mosaicId = "global_monthly_" + dateMoment.format("YYYY_MM") + "_mosaic";
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f7f7f7";
    ctx.fillRect(0, 0, width, height);
    var tilePromises = [];
    for (var tileX = minTileX; tileX <= maxTileX; tileX++) {
        for (var tileY = minTileY; tileY <= maxTileY; tileY++) {
            if (tileY < 0 || tileY >= tileCount) {
                continue;
            }
            (function (x, y) {
                var wrappedX = ((x % tileCount) + tileCount) % tileCount;
                var tileUrl = buildSHAnalyticsPlanetTileProxyUrl(mosaicId, zoom, wrappedX, y);
                if (!tileUrl) {
                    return;
                }
                tilePromises.push(loadSHAnalyticsTileImage(tileUrl).then(function (image) {
                    if (image) {
                        ctx.drawImage(image, x * 256 - topLeftPx.x, y * 256 - topLeftPx.y, 256, 256);
                    }
                }));
            })(tileX, tileY);
        }
    }
    return Promise.all(tilePromises).then(function () {
        drawSHAnalyticsPdfPolygonGeometry(ctx, feature.geometry, topLeftPx, zoom);
        return {
            label: getSHAnalyticsPdfMonthLabel(dateMoment),
            image: canvas.toDataURL("image/png"),
        };
    });
}

function createSHAnalyticsPdfMosaicSnapshots(dataIndex) {
    dataIndex = parseInt(dataIndex, 10);
    var feature = currentSHAnalyticsData && currentSHAnalyticsData[dataIndex] ? currentSHAnalyticsData[dataIndex] : null;
    var detectionMoment = feature ? getSHAnalyticsDetectionMoment(feature) : null;
    if (!feature || !detectionMoment || !planetTileProxyUrl) {
        return Promise.resolve([]);
    }
    var snapshots = [];
    for (var i = 5; i >= 0; i--) {
        snapshots.push(createSHAnalyticsPdfMosaicSnapshot(feature, detectionMoment.clone().add(-i, "month")));
    }
    return Promise.all(snapshots).then(function (items) {
        return items.filter(function (item) {
            return !!(item && item.image);
        });
    }).catch(function (err) {
        console.warn("No se pudieron crear las miniaturas del PDF con teselas Planet", err);
        return [];
    });
}

function captureSHAnalyticsPdfGalleryItems(dataIndex) {
    return createSHAnalyticsPdfMosaicSnapshots(dataIndex).then(function (snapshotItems) {
        if (snapshotItems.length > 0) {
            return snapshotItems;
        }
        return captureSHAnalyticsVisiblePdfGalleryItems();
    });
}

function captureSHAnalyticsVisiblePdfGalleryItems() {
    if (typeof html2pdf === "undefined") {
        return Promise.resolve([]);
    }
    var galleryPane = $("#burnsGalleryPane");
    var swipePane = $("#burnsSwipePane");
    var galleryWasHidden = galleryPane.length ? galleryPane.is(":hidden") : false;
    var swipeWasVisible = swipePane.length ? swipePane.is(":visible") : false;

    if (galleryWasHidden) {
        galleryPane.show();
    }
    burnsGalleryMaps.forEach(function (miniMap) {
        try {
            miniMap.resize();
            miniMap.reposition();
        } catch (e) {}
    });

    var restorePanelState = function () {
        if (galleryWasHidden) {
            galleryPane.hide();
        }
        if (swipeWasVisible) {
            swipePane.show();
        }
    };

    return new Promise(function (resolve, reject) {
        window.setTimeout(function () {
            var captures = [];
            $("#burnsGalleryGrid > div").each(function () {
                var cardNode = this;
                var mapNode = $(cardNode).find("div[id^='burnsGalleryCell_']").first();
                var label = $(this).children("div").last().text();
                if (!mapNode.length) {
                    return;
                }
                captures.push(
                    html2pdf().set({
                        margin: 0,
                        image: { type: "jpeg", quality: 0.95 },
                        html2canvas: {
                            backgroundColor: "#f7f7f7",
                            logging: false,
                            scale: 1.5,
                            useCORS: true,
                            allowTaint: true,
                            scrollX: 0,
                            scrollY: 0,
                        },
                        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
                    }).from(mapNode[0]).toCanvas().get("canvas").then(function (canvas) {
                        var image = null;
                        try {
                            image = canvas.toDataURL("image/png");
                        } catch (err) {
                            console.warn("No se pudo convertir un mosaico a imagen para el PDF", err);
                        }
                        return {
                            label: label,
                            image: image,
                        };
                    }).catch(function (err) {
                        console.warn("No se pudo capturar un mosaico para el PDF", err, cardNode);
                        return {
                            label: label,
                            image: null,
                        };
                    })
                );
            });
            Promise.all(captures).then(function (items) {
                restorePanelState();
                resolve(items);
            }).catch(function (err) {
                restorePanelState();
                reject(err);
            });
        }, 650);
    });
}

function formatSHAnalyticsCentroid9377(coordinates) {
    if (!coordinates || typeof proj4 === "undefined" || typeof sistemasCoordenadas === "undefined" || !sistemasCoordenadas["EPSG:4326"] || !sistemasCoordenadas["EPSG:9377"]) {
        return "No identificado";
    }
    try {
        var projected = proj4(sistemasCoordenadas["EPSG:4326"].proj, sistemasCoordenadas["EPSG:9377"].proj, coordinates);
        if (!projected || projected.length < 2 || !isFinite(projected[0]) || !isFinite(projected[1])) {
            return "No identificado";
        }
        return "E: " + projected[0].toFixed(2) + " | N: " + projected[1].toFixed(2);
    } catch (err) {
        console.warn("No se pudo convertir el centroide a EPSG:9377", err);
        return "No identificado";
    }
}

function buildSHAnalyticsPdfReportHtml(dataIndex, galleryItems) {
    dataIndex = parseInt(dataIndex, 10);
    var feature = currentSHAnalyticsData && currentSHAnalyticsData[dataIndex] ? currentSHAnalyticsData[dataIndex] : null;
    var properties = feature && feature.properties ? feature.properties : {};
    var subscriptionLabel = $("#selectSHAnalyticsSubs option:selected").text() || "Planet Analytics";
    var detectionDate = properties.date || properties.published || properties.acquired || "";
    var centroid = getSHAnalyticsFeatureCentroid(feature);
    var department = findSHAnalyticsAdminForPoint(centroid, "department");
    var municipality = findSHAnalyticsAdminForPoint(centroid, "municipality");
    var departmentName = department && department.name ? department.name : "No identificado";
    var municipalityName = municipality && municipality.name ? municipality.name : "No identificado";
    var municipalityDepartmentName = municipalityName !== "No identificado" && departmentName !== "No identificado"
        ? municipalityName + ", " + departmentName
        : municipalityName;
    var centroid9377Text = formatSHAnalyticsCentroid9377(centroid);
    var galleryHtml = "";
    (galleryItems || []).forEach(function (item) {
        if (!item || !item.image) {
            return;
        }
        galleryHtml += "<div class='sh-pdf-gallery-item'>" +
            "<img class='sh-pdf-map-image' src='" + item.image + "' />" +
            "<div class='sh-pdf-caption'>" + escapeSHAnalyticsHtml(item.label) + "</div>" +
        "</div>";
    });
    if (!galleryHtml) {
        galleryHtml = "<div class='sh-pdf-empty'>No hay mosaicos disponibles para incluir en el reporte.</div>";
    }
    return "<div id='shAnalyticsPdfReport' class='sh-analytics-pdf-report'>" +
        "<div class='sh-pdf-header'>" +
            "<div><div class='sh-pdf-kicker'>Observatorio de la Tierra y el Territorio</div><h1>Reporte de Detalle — Cambios</h1><div class='sh-pdf-subtitle'>" + escapeSHAnalyticsHtml(subscriptionLabel) + "</div></div>" +
            "<img src='../images/logo_igac.png' onerror='this.style.display=\"none\"' />" +
        "</div>" +
        "<div class='sh-pdf-metrics'>" +
            "<div><strong>" + escapeSHAnalyticsHtml(detectionDate) + "</strong><span>Fecha de detección</span></div>" +
            "<div><strong>" + escapeSHAnalyticsHtml(municipalityDepartmentName) + "</strong><span>Municipio</span></div>" +
            "<div><strong>" + escapeSHAnalyticsHtml(centroid9377Text) + "</strong><span>Centroide EPSG:9377</span></div>" +
        "</div>" +
        "<h2>Galería — Mosaicos mensuales</h2>" +
        "<div class='sh-pdf-gallery'>" + galleryHtml + "</div>" +
        "<div class='sh-pdf-footnote'>Mosaicos mensuales Planet · vista centrada en el polígono seleccionado</div>" +
    "</div>";
}

function downloadSHAnalyticsPolygonPdf(dataIndex) {
    if (typeof html2pdf === "undefined") {
        showLoading("No se encontró la librería para generar PDF", null, "red", true);
        return;
    }
    showLoading("Generando PDF", "loading", "gold", false);
    window.setTimeout(function () {
        Promise.all([
            ensureSHAnalyticsAdminLevelLoaded("department"),
            ensureSHAnalyticsAdminLevelLoaded("municipality"),
        ]).then(function () {
            return captureSHAnalyticsPdfGalleryItems(dataIndex);
        }).then(function (galleryItems) {
            var reportHtml = buildSHAnalyticsPdfReportHtml(dataIndex, galleryItems);
            var reportNode = document.createElement("div");
            reportNode.style.position = "fixed";
            reportNode.style.left = "-12000px";
            reportNode.style.top = "0";
            reportNode.innerHTML = reportHtml;
            document.body.appendChild(reportNode);
            var fileName = "reporte_planet_analytics_poligono_" + dataIndex + ".pdf";
            return html2pdf().set({
                margin: 8,
                filename: fileName,
                image: { type: "jpeg", quality: 0.95 },
                html2canvas: { scale: 2, useCORS: true, allowTaint: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
            }).from(reportNode.firstChild).save().then(function () {
                document.body.removeChild(reportNode);
                closeLoading();
            }).catch(function (err) {
                document.body.removeChild(reportNode);
                throw err;
            });
        }).catch(function (err) {
            closeLoading();
            console.error("No se pudo generar el PDF de Planet Analytics", err);
            showLoading("No se pudo generar el PDF", null, "red", true);
        });
    }, 300);
}

function renderSHAnalyticsMunicipalityTable() {
    var container = $("#shAnalyticsMunicipalityResults");
    if (!container.length) {
        return;
    }
    var adminConfig = getSHAnalyticsActiveAdminConfig();
    if ($("#selectSHAnalyticsSubs").val() == null || $("#selectSHAnalyticsSubs").val() == "") {
        setSHAnalyticsMunicipalityMessage("Seleccione una suscripción para ver los " + adminConfig.plural + " con registros de cambios.", false);
        return;
    }
    if (adminConfig.loading) {
        setSHAnalyticsMunicipalityMessage("Cargando capa de " + adminConfig.plural + "…", false);
        return;
    }
    if (!adminConfig.loaded) {
        setSHAnalyticsMunicipalityMessage("No se pudo cargar la capa de " + adminConfig.plural + " desde " + adminConfig.url + ".", true);
        return;
    }
    if (!currentSHAnalyticsData || currentSHAnalyticsData.length === 0) {
        setSHAnalyticsMunicipalityMessage("No hay registros de cambios para resumir por " + adminConfig.singular + ".", false);
        return;
    }

    if (adminConfig.stats.length === 0) {
        setSHAnalyticsMunicipalityMessage("No se encontraron registros de cambios dentro de la capa de " + adminConfig.plural + ".", false);
        return;
    }

    var searchText = normalizeSHAnalyticsMunicipalityText($("#txtSHAnalyticsMunicipalitySearch").val());
    var rows = adminConfig.stats.filter(function (row) {
        return !searchText || row.normalizedName.indexOf(searchText) !== -1;
    });
    rows.sort(function (a, b) {
        if (b.count !== a.count) {
            return b.count - a.count;
        }
        return a.name.localeCompare(b.name);
    });

    if (rows.length === 0) {
        setSHAnalyticsMunicipalityMessage("No se encontraron " + adminConfig.plural + " que coincidan con la búsqueda.", false);
        return;
    }

    var total = currentSHAnalyticsData ? currentSHAnalyticsData.length : 0;
    var html = "<div class='sh-analytics-municipality-table-wrap'><table class='sh-analytics-municipality-table'>" +
        "<thead><tr><th>" + adminConfig.title + "</th><th># registros</th><th>Descarga</th></tr></thead><tbody>";
    for (var i = 0; i < rows.length; i++) {
        html += "<tr class='sh-analytics-municipality-row' data-admin-level='" + adminConfig.level + "' data-municipality-index='" + rows[i].index + "' title='Acercar al " + adminConfig.singular + "'><td>" + escapeSHAnalyticsHtml(rows[i].name) + "</td><td>" + rows[i].count + "</td><td><button type='button' class='sh-analytics-download-btn' title='Descargar datos' data-admin-level='" + adminConfig.level + "' data-admin-index='" + rows[i].index + "'><span class='glyphicon glyphicon-download-alt' aria-hidden='true'></span></button></td></tr>";
    }
    html += "</tbody><tfoot><tr class='sh-analytics-municipality-total-row'><td>Total</td><td>" + total + "</td><td><button type='button' class='sh-analytics-download-btn' title='Descargar total' data-admin-level='total'><span class='glyphicon glyphicon-download-alt' aria-hidden='true'></span></button></td></tr></tfoot></table></div>";
    container.html(html);
}

function getSHAnalyticsMunicipalityByIndex(index) {
    index = parseInt(index, 10);
    if (isNaN(index)) {
        return null;
    }
    var adminConfig = getSHAnalyticsActiveAdminConfig();
    for (var i = 0; i < adminConfig.features.length; i++) {
        if (adminConfig.features[i].index === index) {
            return adminConfig.features[i];
        }
    }
    return null;
}

function createSHAnalyticsAdminSelectionSymbol() {
    var border = new esri.SimpleLineSymbol(
        esri.SimpleLineSymbol.STYLE_SOLID,
        new esri.Color([95, 95, 95, 0.95]),
        1.2
    );
    return new esri.SimpleFillSymbol(
        esri.SimpleFillSymbol.STYLE_NULL,
        border,
        new esri.Color([95, 95, 95, 0])
    );
}

function showSHAnalyticsSelectedAdminFeature(adminFeature) {
    if (!adminFeature || !adminFeature.feature || !adminFeature.feature.geometry || !currentSHAnalyticsAdminLayer) {
        return;
    }
    try {
        var dataJSON = Terraformer.ArcGIS.fromGeoJSON(adminFeature.feature.geometry);
        var geometry = esri.jsonUtilsGeometry.fromJson(dataJSON);
        if (!geometry) {
            return;
        }
        if (!geometry.spatialReference || geometry.spatialReference.wkid === 4326) {
            geometry = esri.webMercatorUtils.geographicToWebMercator(geometry);
        }
        currentSHAnalyticsAdminLayer.clear();
        currentSHAnalyticsAdminLayer.add(new esri.Graphic(geometry, createSHAnalyticsAdminSelectionSymbol()));
        currentSHAnalyticsAdminLayer.setVisibility(true);
        if (map && map.reorderLayer) {
            var targetIndex = map.graphicsLayerIds && map.graphicsLayerIds.length ? map.graphicsLayerIds.length - 1 : map.layerIds.length;
            map.reorderLayer(currentSHAnalyticsAdminLayer, targetIndex);
        }
    } catch (err) {
        console.warn("No se pudo dibujar el área administrativa seleccionada", err, adminFeature.feature);
    }
}

function zoomToSHAnalyticsMunicipality(index) {
    var municipality = getSHAnalyticsMunicipalityByIndex(index);
    if (!municipality || !municipality.feature || !municipality.feature.geometry) {
        return;
    }
    showSHAnalyticsSelectedAdminFeature(municipality);
    try {
        var dataJSON = Terraformer.ArcGIS.fromGeoJSON(municipality.feature.geometry);
        var geometry = esri.jsonUtilsGeometry.fromJson(dataJSON);
        if (!geometry) {
            return;
        }
        if (!geometry.spatialReference || geometry.spatialReference.wkid === 4326) {
            geometry = esri.webMercatorUtils.geographicToWebMercator(geometry);
        }
        if (geometry && geometry.getExtent) {
            map.setExtent(geometry.getExtent().expand(1.2), true);
        } else if (geometry && geometry.getCentroid) {
            map.centerAndZoom(geometry.getCentroid(), 12);
        }
    } catch (err) {
        console.warn("No se pudo acercar al área administrativa de Planet Analytics", err, municipality.feature);
    }
}

function getSHAnalyticsFeatureCentroid(feature) {
    if (!feature || !feature.geometry || !window.turf || !turf.centroid) {
        return null;
    }
    try {
        var centroid = turf.centroid(feature);
        return centroid && centroid.geometry && centroid.geometry.coordinates ? centroid.geometry.coordinates : null;
    } catch (err) {
        console.warn("No se pudo calcular el centroide del cambio", err, feature);
        return null;
    }
}

function findSHAnalyticsMunicipalityForPoint(coordinates) {
    if (!coordinates || !window.turf || !turf.point || !turf.booleanPointInPolygon) {
        return null;
    }
    var adminConfig = getSHAnalyticsActiveAdminConfig();
    var x = coordinates[0];
    var y = coordinates[1];
    var point = turf.point(coordinates);
    for (var i = 0; i < adminConfig.features.length; i++) {
        var municipality = adminConfig.features[i];
        if (municipality.bbox && (x < municipality.bbox[0] || y < municipality.bbox[1] || x > municipality.bbox[2] || y > municipality.bbox[3])) {
            continue;
        }
        try {
            if (turf.booleanPointInPolygon(point, municipality.feature)) {
                return municipality;
            }
        } catch (err) {
            console.warn("No se pudo evaluar el área administrativa del cambio", err, municipality.feature);
        }
    }
    return null;
}

function getSHAnalyticsAdminFeaturesByLevel(adminLevel) {
    return adminLevel === "municipality" ? currentSHAnalyticsMunicipalities : currentSHAnalyticsDepartments;
}

function isSHAnalyticsAdminLevelLoaded(adminLevel) {
    return adminLevel === "municipality" ? currentSHAnalyticsMunicipalitiesLoaded : currentSHAnalyticsDepartmentsLoaded;
}

function setSHAnalyticsAdminLevelCache(adminLevel, features) {
    if (adminLevel === "municipality") {
        currentSHAnalyticsMunicipalities = features;
        currentSHAnalyticsMunicipalitiesLoaded = features.length > 0;
        currentSHAnalyticsMunicipalitiesLoading = false;
    } else {
        currentSHAnalyticsDepartments = features;
        currentSHAnalyticsDepartmentsLoaded = features.length > 0;
        currentSHAnalyticsDepartmentsLoading = false;
    }
}

function ensureSHAnalyticsAdminLevelLoaded(adminLevel) {
    adminLevel = adminLevel === "municipality" ? "municipality" : "department";
    if (isSHAnalyticsAdminLevelLoaded(adminLevel)) {
        return Promise.resolve();
    }
    var adminUrl = adminLevel === "municipality" ? planetAnalyticsMunicipalityUrl : planetAnalyticsDepartmentUrl;
    if (!adminUrl) {
        return Promise.resolve();
    }
    return new Promise(function (resolve) {
        $.ajax({
            url: adminUrl,
            type: "GET",
            dataType: "json",
            success: function (geojson) {
                var preparedFeatures = [];
                var features = geojson && geojson.type === "FeatureCollection" && Array.isArray(geojson.features) ? geojson.features : [];
                for (var i = 0; i < features.length; i++) {
                    var adminFeature = prepareSHAnalyticsAdminFeature(features[i], i, adminLevel);
                    if (adminFeature) {
                        preparedFeatures.push(adminFeature);
                    }
                }
                setSHAnalyticsAdminLevelCache(adminLevel, preparedFeatures);
                resolve();
            },
            error: function () {
                setSHAnalyticsAdminLevelCache(adminLevel, []);
                resolve();
            },
        });
    });
}

function findSHAnalyticsAdminForPoint(coordinates, adminLevel) {
    if (!coordinates || !window.turf || !turf.point || !turf.booleanPointInPolygon) {
        return null;
    }
    var features = getSHAnalyticsAdminFeaturesByLevel(adminLevel);
    var x = coordinates[0];
    var y = coordinates[1];
    var point = turf.point(coordinates);
    for (var i = 0; i < features.length; i++) {
        var adminFeature = features[i];
        if (adminFeature.bbox && (x < adminFeature.bbox[0] || y < adminFeature.bbox[1] || x > adminFeature.bbox[2] || y > adminFeature.bbox[3])) {
            continue;
        }
        try {
            if (turf.booleanPointInPolygon(point, adminFeature.feature)) {
                return adminFeature;
            }
        } catch (err) {
            console.warn("No se pudo evaluar el área administrativa del cambio", err, adminFeature.feature);
        }
    }
    return null;
}

function updateSHAnalyticsMunicipalityStats() {
    var adminConfig = getSHAnalyticsActiveAdminConfig();
    var targetStats = [];
    if (adminConfig.level === "municipality") {
        currentSHAnalyticsMunicipalityStats = [];
    } else {
        currentSHAnalyticsDepartmentStats = [];
    }
    if (!currentSHAnalyticsData || currentSHAnalyticsData.length === 0 || !adminConfig.loaded) {
        renderSHAnalyticsMunicipalityTable();
        return;
    }
    var statsByMunicipality = {};
    for (var i = 0; i < currentSHAnalyticsData.length; i++) {
        var coordinates = getSHAnalyticsFeatureCentroid(currentSHAnalyticsData[i]);
        var municipality = findSHAnalyticsMunicipalityForPoint(coordinates);
        if (!municipality) {
            continue;
        }
        var key = municipality.index + "|" + municipality.name;
        if (!statsByMunicipality[key]) {
            statsByMunicipality[key] = {
                index: municipality.index,
                name: municipality.name,
                normalizedName: municipality.normalizedName,
                feature: municipality.feature,
                bbox: municipality.bbox,
                indexes: [],
                count: 0,
            };
        }
        statsByMunicipality[key].count += 1;
        statsByMunicipality[key].indexes.push(i);
    }
    for (var key in statsByMunicipality) {
        if (Object.prototype.hasOwnProperty.call(statsByMunicipality, key)) {
            targetStats.push(statsByMunicipality[key]);
        }
    }
    if (adminConfig.level === "municipality") {
        currentSHAnalyticsMunicipalityStats = targetStats;
    } else {
        currentSHAnalyticsDepartmentStats = targetStats;
    }
    renderSHAnalyticsMunicipalityTable();
}

function loadSHAnalyticsMunicipalities(adminLevel, loadingDialog) {
    adminLevel = adminLevel || currentSHAnalyticsAdminLevel;
    var isMunicipality = adminLevel === "municipality";
    var isLoaded = isMunicipality ? currentSHAnalyticsMunicipalitiesLoaded : currentSHAnalyticsDepartmentsLoaded;
    var isLoading = isMunicipality ? currentSHAnalyticsMunicipalitiesLoading : currentSHAnalyticsDepartmentsLoading;
    var adminUrl = isMunicipality ? planetAnalyticsMunicipalityUrl : planetAnalyticsDepartmentUrl;
    var adminPlural = isMunicipality ? "municipios" : "departamentos";
    if (isLoaded || isLoading) {
        renderSHAnalyticsMunicipalityTable();
        closeSHAnalyticsLoadingDialog(loadingDialog, 200);
        return;
    }
    if (!adminUrl) {
        setSHAnalyticsMunicipalityMessage("Configure la URL para cargar la capa de " + adminPlural + ".", true);
        closeSHAnalyticsLoadingDialog(loadingDialog);
        return;
    }
    if (isMunicipality) {
        currentSHAnalyticsMunicipalitiesLoading = true;
    } else {
        currentSHAnalyticsDepartmentsLoading = true;
    }
    setSHAnalyticsMunicipalityMessage("Cargando capa de " + adminPlural + "…", false);
    $.ajax({
        url: adminUrl,
        type: "GET",
        dataType: "json",
        success: function (geojson) {
            if (isMunicipality) {
                currentSHAnalyticsMunicipalitiesLoading = false;
                currentSHAnalyticsMunicipalities = [];
            } else {
                currentSHAnalyticsDepartmentsLoading = false;
                currentSHAnalyticsDepartments = [];
            }
            var features = geojson && geojson.type === "FeatureCollection" && Array.isArray(geojson.features) ? geojson.features : [];
            for (var i = 0; i < features.length; i++) {
                var adminFeature = prepareSHAnalyticsAdminFeature(features[i], i, adminLevel);
                if (adminFeature) {
                    if (isMunicipality) {
                        currentSHAnalyticsMunicipalities.push(adminFeature);
                    } else {
                        currentSHAnalyticsDepartments.push(adminFeature);
                    }
                }
            }
            if (isMunicipality) {
                currentSHAnalyticsMunicipalitiesLoaded = currentSHAnalyticsMunicipalities.length > 0;
            } else {
                currentSHAnalyticsDepartmentsLoaded = currentSHAnalyticsDepartments.length > 0;
            }
            if ((isMunicipality && currentSHAnalyticsMunicipalitiesLoaded) || (!isMunicipality && currentSHAnalyticsDepartmentsLoaded)) {
                updateSHAnalyticsMunicipalityStats();
                closeSHAnalyticsLoadingDialog(loadingDialog, 250);
            } else {
                setSHAnalyticsMunicipalityMessage("La capa de " + adminPlural + " no contiene geometrías válidas.", true);
                closeSHAnalyticsLoadingDialog(loadingDialog);
            }
        },
        error: function () {
            if (isMunicipality) {
                currentSHAnalyticsMunicipalitiesLoading = false;
                currentSHAnalyticsMunicipalitiesLoaded = false;
                currentSHAnalyticsMunicipalities = [];
            } else {
                currentSHAnalyticsDepartmentsLoading = false;
                currentSHAnalyticsDepartmentsLoaded = false;
                currentSHAnalyticsDepartments = [];
            }
            setSHAnalyticsMunicipalityMessage("No se encontró " + adminUrl + ".", true);
            closeSHAnalyticsLoadingDialog(loadingDialog);
        },
    });
}

function setSHAnalyticsAdminLevel(adminLevel) {
    if (adminLevel !== "municipality" && adminLevel !== "department") {
        adminLevel = "department";
    }
    if (adminLevel === currentSHAnalyticsAdminLevel && getSHAnalyticsActiveAdminConfig().loaded) {
        return;
    }
    var shAnalyticsAdminLoading = createSHAnalyticsLoadingDialog();
    currentSHAnalyticsAdminLevel = adminLevel;
    $(".sh-analytics-admin-tab").removeClass("active");
    $(".sh-analytics-admin-tab[data-sh-analytics-admin-level='" + adminLevel + "']").addClass("active");
    $("#txtSHAnalyticsMunicipalitySearch").attr("placeholder", adminLevel === "municipality" ? "Buscar municipio" : "Buscar departamento");
    if (currentSHAnalyticsAdminLayer) {
        currentSHAnalyticsAdminLayer.clear();
    }
    shAnalyticsAdminLoading.open();
    window.setTimeout(function () {
        if (getSHAnalyticsActiveAdminConfig().loaded) {
            updateSHAnalyticsMunicipalityStats();
            closeSHAnalyticsLoadingDialog(shAnalyticsAdminLoading, 250);
        } else {
            loadSHAnalyticsMunicipalities(adminLevel, shAnalyticsAdminLoading);
        }
    }, 120);
}

function updateSHAnalyticsBoundaryVisibility() {
    if (!currentSHAnalyticsBoundaryLayer) {
        return;
    }
    var shouldShow = $("#chkSHAnalyticsBoundaries").is(":checked") && currentScreen === "SHAnalytics";
    currentSHAnalyticsBoundaryLayer.setVisibility(shouldShow);
    if (shouldShow) {
        loadSHAnalyticsBoundaries();
        if (currentSHAnalyticsBoundariesLoaded) {
            bringSHAnalyticsBoundariesToFront();
        }
    } else {
        setSHAnalyticsBoundaryStatus("");
    }
}

function showSHAnalyticsResultsLoader(message) {
    $("#selectSHAnalyticsResults").html(
        "<div class='sh-analytics-results-loader'>" +
            "<img src='/images/ig124.gif' alt='Cargando' />" +
            "<div>" + (message || "Cargando resultados...") + "</div>" +
        "</div>"
    );
}

function createSHAnalyticsLoadingDialog() {
    var shAnalyticsLoadingDialog = $.confirm({
        title: "",
        content: "<div style='text-align: center;'><img src='/images/ig124.gif' style='height: 200px;width: 200px;'></div>",
        buttons: {},
        closeIcon: true,
        lazyOpen: true,
        onContentReady: function () {},
        onOpenBefore: function () {
            shAnalyticsLoadingDialog.buttons.ok.hide();
            shAnalyticsLoadingDialog.buttons.close.hide();
        },
    });
    return shAnalyticsLoadingDialog;
}

function closeSHAnalyticsLoadingDialog(loadingDialog, delay) {
    if (loadingDialog && loadingDialog.close) {
        if (delay) {
            window.setTimeout(function () {
                loadingDialog.close();
            }, delay);
        } else {
            loadingDialog.close();
        }
    }
}

function gotoSHAnalytics() {
    currentScreen = "SHAnalytics";
    reporteUso("Abrir SHAnalytics");
    minAll();
    toggleMenu("small");
    $("#panelSHAnalytics").show();
    currentSHAnalyticsLayer.setVisibility(true);
    currentSHAnalyticsLayer.clear();
    hideSHAnalyticsLegend();
    if (currentSHAnalyticsHexLayer) {
        currentSHAnalyticsHexLayer.setVisibility(true);
        currentSHAnalyticsHexLayer.clear();
    }
    updateSHAnalyticsBoundaryVisibility();
    loadSHAnalyticsMunicipalities();
    currentSHAnalyticsSelectedIndex = null;
    currentSHAnalyticsSelectedHexKey = null;
    resetSHAnalyticsDateFilter();
    $("#selectSHAnalyticsResults").html("");
    $("#selectSHAnalyticsSubs").html("<option value=''>Seleccione una suscripción</option>");
    if (currentSHAnalyticsSuscriptions.length > 0) {
        for (var i = 0; i < currentSHAnalyticsSuscriptions.length; i++) {
            var currentSub = currentSHAnalyticsSuscriptions[i];
            var title = currentSub.title || currentSub.name || currentSub.id;
            var description = currentSub.description ? " - " + currentSub.description : "";
            $("#selectSHAnalyticsSubs").append("<option value='" + currentSub.id + "'>" + title + description + "</option>");
        }
        return;
    }
    var shAnalyticsLoading = $.confirm({
        title: "",
        content: "<div style='text-align: center;'><img src='/images/ig124.gif' style='height: 200px;width: 200px;'></div>",
        buttons: {},
        closeIcon: true,
        lazyOpen: true,
        onContentReady: function () {},
        onOpenBefore: function () {
            if (shAnalyticsLoading.buttons && shAnalyticsLoading.buttons.ok) {
                shAnalyticsLoading.buttons.ok.hide();
            }
            if (shAnalyticsLoading.buttons && shAnalyticsLoading.buttons.close) {
                shAnalyticsLoading.buttons.close.hide();
            }
        },
    });
    shAnalyticsLoading.open();
    loadAnalyticsSubscriptions(
        function (subscriptions) {
            shAnalyticsLoading.close();
            currentSHAnalyticsSuscriptions = subscriptions;
            for (var i = 0; i < currentSHAnalyticsSuscriptions.length; i++) {
                var currentSub = currentSHAnalyticsSuscriptions[i];
                var title = currentSub.title || currentSub.name || currentSub.id;
                var description = currentSub.description ? " - " + currentSub.description : "";
                $("#selectSHAnalyticsSubs").append("<option value='" + currentSub.id + "'>" + title + description + "</option>");
            }
            if (currentSHAnalyticsSuscriptions.length == 0) {
                $("#selectSHAnalyticsSubs").html("<option value=''>No hay suscripciones disponibles</option>");
            }
        },
        function () {
            shAnalyticsLoading.close();
            $("#selectSHAnalyticsSubs").html("<option value=''>No se pudieron cargar las suscripciones</option>");
        }
    );
}

function updateSHAnalytics() {
    currentSHAnalyticsLoadRequestId++;
    var loadRequestId = currentSHAnalyticsLoadRequestId;
    $("#selectSHAnalyticsResults").html("");
    currentSHAnalyticsData = [];
    currentSHAnalyticsAllData = [];
    currentSHAnalyticsNextUrl = null;
    currentSHAnalyticsTotalCount = null;
    currentSHAnalyticsMunicipalityStats = [];
    currentSHAnalyticsDepartmentStats = [];
    hideSHAnalyticsLegend();
    currentSHAnalyticsLayer.clear();
    if (currentSHAnalyticsAdminLayer) {
        currentSHAnalyticsAdminLayer.clear();
    }
    currentSHAnalyticsSelectedIndex = null;
    currentSHAnalyticsSelectedHexKey = null;
    resetSHAnalyticsDateFilter();
    if (currentSHAnalyticsHexLayer) {
        currentSHAnalyticsHexLayer.clear();
    }
    if ($("#selectSHAnalyticsSubs").val() == null || $("#selectSHAnalyticsSubs").val() == "") {
        renderSHAnalyticsMunicipalityTable();
        return;
    }
    var shAnalyticsResultsLoading = $.confirm({
        title: "",
        content: "<div style='text-align: center;'><img src='/images/ig124.gif' style='height: 200px;width: 200px;'></div>",
        buttons: {},
        closeIcon: true,
        lazyOpen: true,
        onContentReady: function () {},
        onOpenBefore: function () {
            shAnalyticsResultsLoading.buttons.ok.hide();
            shAnalyticsResultsLoading.buttons.close.hide();
            //loading.showLoading();
        },
    });
    showSHAnalyticsResultsLoader("Cargando resultados...");
    shAnalyticsResultsLoading.open();
    window.setTimeout(function () {
        if (loadRequestId !== currentSHAnalyticsLoadRequestId) {
            closeSHAnalyticsLoadingDialog(shAnalyticsResultsLoading);
            return;
        }
        loadSHAnalyticsMunicipalities();
        loadSHAnalyticsPage($("#selectSHAnalyticsSubs").val(), null, false, shAnalyticsResultsLoading, loadRequestId);
    }, 120);
}

function loadSHAnalyticsPage(subscriptionId, pageUrl, append, loadingDialog, loadRequestId) {
    loadAnalyticsChanges(
        subscriptionId,
        function (features, nextPage, totalCount) {
            if (loadRequestId && loadRequestId !== currentSHAnalyticsLoadRequestId) {
                closeSHAnalyticsLoadingDialog(loadingDialog);
                return;
            }
            currentSHAnalyticsNextUrl = nextPage;
            currentSHAnalyticsTotalCount = totalCount;

            if (!append) {
                currentSHAnalyticsAllData = features;
                currentSHAnalyticsLayer.clear();
                if (currentSHAnalyticsAdminLayer) {
                    currentSHAnalyticsAdminLayer.clear();
                }
                if (currentSHAnalyticsHexLayer) {
                    currentSHAnalyticsHexLayer.clear();
                }
                $("#selectSHAnalyticsResults").html("");
            } else {
                currentSHAnalyticsAllData = currentSHAnalyticsAllData.concat(features);
            }
            updateSHAnalyticsDateFilterBounds();
            if (getSHAnalyticsActiveAdminConfig().loaded) {
                updateSHAnalyticsMunicipalityStats();
            } else {
                loadSHAnalyticsMunicipalities();
            }
            if (currentSHAnalyticsAllData.length == 0) {
                closeSHAnalyticsLoadingDialog(loadingDialog);
                hideSHAnalyticsLegend();
                $("#selectSHAnalyticsResults").html("<div class='panel panel-default panel-list'><div style='padding:8px;'>No se encontraron cambios para esta suscripción.</div></div>");
                return;
            }

            var summaryPrefix = "Mostrando";
            if (!currentSHAnalyticsTotalCount && currentSHAnalyticsNextUrl) {
                summaryPrefix = "Mostrando los primeros";
            }
            refreshSHAnalyticsFilteredView(summaryPrefix);
            if (currentSHAnalyticsBoundariesLoaded && $("#chkSHAnalyticsBoundaries").is(":checked")) {
                currentSHAnalyticsBoundaryLayer.setVisibility(true);
                bringSHAnalyticsBoundariesToFront();
            }

            // Agregar event listener para hacer clic en hexágonos del mapa.
            if (currentSHAnalyticsClickHandle) {
                currentSHAnalyticsClickHandle.remove();
            }
            if (currentSHAnalyticsHoverHandle) {
                currentSHAnalyticsHoverHandle.remove();
            }
            if (currentSHAnalyticsHoverOutHandle) {
                currentSHAnalyticsHoverOutHandle.remove();
            }
            currentSHAnalyticsClickHandle = currentSHAnalyticsHexLayer.on("click", function (evt) {
                if (handleSHAnalyticsSelectedHexClick(evt)) {
                    return;
                }
                if (evt.graphic && evt.graphic.attributes && evt.graphic.attributes.analyticsHexKey !== undefined) {
                    zoomToSHAnalyticsHexAndShowChanges(evt.graphic, evt.mapPoint);
                }
            });
            currentSHAnalyticsHoverHandle = currentSHAnalyticsHexLayer.on("mouse-over", function (evt) {
                if (currentSHAnalyticsSelectedHexKey === null && evt.graphic && evt.graphic.attributes && evt.graphic.attributes.analyticsHexKey !== undefined) {
                    showSHAnalyticsHexPopup(evt.graphic, evt.mapPoint);
                }
            });
            currentSHAnalyticsHoverOutHandle = currentSHAnalyticsHexLayer.on("mouse-out", function () {
                if (currentSHAnalyticsSelectedHexKey === null) {
                    map.infoWindow.hide();
                }
            });

            if (currentSHAnalyticsNextUrl) {
                window.setTimeout(function () {
                    loadSHAnalyticsPage(subscriptionId, currentSHAnalyticsNextUrl, true, loadingDialog, loadRequestId);
                }, 120);
                return;
            }

            closeSHAnalyticsLoadingDialog(loadingDialog, 700);
        },

        function () {
            if (loadRequestId && loadRequestId !== currentSHAnalyticsLoadRequestId) {
                closeSHAnalyticsLoadingDialog(loadingDialog);
                return;
            }
            closeSHAnalyticsLoadingDialog(loadingDialog);
            hideSHAnalyticsLegend();
            $("#selectSHAnalyticsResults").html("<div class='panel panel-default panel-list'><div style='padding:8px;'>No se pudieron consultar los cambios.</div></div>");
        },
        pageUrl
    );
}

function getSHAnalyticsFeatureCenter(feature) {
    if (!feature || !feature.geometry) {
        return null;
    }
    try {
        var dataJSON = Terraformer.ArcGIS.fromGeoJSON(feature.geometry);
        var geometry = esri.webMercatorUtils.geographicToWebMercator(esri.jsonUtilsGeometry.fromJson(dataJSON));
        if (!geometry) {
            return null;
        }
        if (geometry.getCentroid) {
            return geometry.getCentroid();
        }
        if (geometry.getExtent) {
            return geometry.getExtent().getCenter();
        }
        if (geometry.x !== undefined && geometry.y !== undefined) {
            return geometry;
        }
    } catch (err) {
        console.warn("No se pudo ubicar el cambio de Planet Analytics", err);
    }
    return null;
}

function getSHAnalyticsHexCell(point) {
    var size = SH_ANALYTICS_HEX_SIDE_METERS;
    var q = ((Math.sqrt(3) / 3) * point.x - (1 / 3) * point.y) / size;
    var r = ((2 / 3) * point.y) / size;
    return roundSHAnalyticsHex(q, r);
}

function roundSHAnalyticsHex(q, r) {
    var x = q;
    var z = r;
    var y = -x - z;
    var rx = Math.round(x);
    var ry = Math.round(y);
    var rz = Math.round(z);
    var xDiff = Math.abs(rx - x);
    var yDiff = Math.abs(ry - y);
    var zDiff = Math.abs(rz - z);

    if (xDiff > yDiff && xDiff > zDiff) {
        rx = -ry - rz;
    } else if (yDiff > zDiff) {
        ry = -rx - rz;
    } else {
        rz = -rx - ry;
    }

    return { q: rx, r: rz };
}

function getSHAnalyticsHexCenter(cell) {
    var size = SH_ANALYTICS_HEX_SIDE_METERS;
    return {
        x: size * Math.sqrt(3) * (cell.q + cell.r / 2),
        y: size * 1.5 * cell.r,
    };
}

function createSHAnalyticsHexPolygon(center) {
    var size = SH_ANALYTICS_HEX_SIDE_METERS;
    var ring = [];
    for (var i = 0; i < 6; i++) {
        var angle = Math.PI / 180 * (60 * i - 30);
        ring.push([center.x + size * Math.cos(angle), center.y + size * Math.sin(angle)]);
    }
    ring.push(ring[0]);
    return new esri.Polygon({
        rings: [ring],
        spatialReference: map.spatialReference,
    });
}

function getSHAnalyticsHexClass(count, classBreaksOrMaxCount) {
    if (Array.isArray(classBreaksOrMaxCount) && classBreaksOrMaxCount.length >= 4) {
        if (count <= classBreaksOrMaxCount[0]) {
            return "veryLow";
        }
        if (count <= classBreaksOrMaxCount[1]) {
            return "low";
        }
        if (count <= classBreaksOrMaxCount[2]) {
            return "medium";
        }
        if (count <= classBreaksOrMaxCount[3]) {
            return "high";
        }
        return "veryHigh";
    }
    var maxCount = classBreaksOrMaxCount;
    var ratio = maxCount > 0 ? count / maxCount : 0;
    if (ratio > 0.8) {
        return "veryHigh";
    }
    if (ratio > 0.6) {
        return "high";
    }
    if (ratio > 0.4) {
        return "medium";
    }
    if (ratio > 0.2) {
        return "low";
    }
    return "veryLow";
}

function getSHAnalyticsHexClassNames() {
    return ["veryLow", "low", "medium", "high", "veryHigh"];
}

function getSHAnalyticsSelectedClassLabel() {
    return String($("#selectSHAnalyticsSubs").val() || "building").trim().toLowerCase();
}

function getSHAnalyticsHexClasses() {
    return SH_ANALYTICS_HEX_PALETTES[getSHAnalyticsSelectedClassLabel()] || SH_ANALYTICS_HEX_PALETTES.building;
}

function getSHAnalyticsHexClassBreaks(hexBins) {
    var counts = [];
    Object.keys(hexBins).forEach(function (key) {
        counts.push(hexBins[key].count);
    });
    counts.sort(function (a, b) { return a - b; });
    if (counts.length === 0) {
        return [0, 0, 0, 0];
    }
    var getPercentileCount = function (percentile) {
        var index = Math.ceil(percentile * counts.length) - 1;
        index = Math.max(0, Math.min(index, counts.length - 1));
        return counts[index];
    };
    return [
        getPercentileCount(0.25),
        getPercentileCount(0.45),
        getPercentileCount(0.60),
        getPercentileCount(0.75),
    ];
}

function getSHAnalyticsColorCss(color) {
    return "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] + ")";
}

function getSHAnalyticsHexClassRangeLabel(className, classBreaksOrMaxCount) {
    var hexClasses = getSHAnalyticsHexClasses();
    if (Array.isArray(classBreaksOrMaxCount) && classBreaksOrMaxCount.length >= 4) {
        var breaks = classBreaksOrMaxCount;
        if (className === "veryLow") {
            return hexClasses[className].label + ": hasta " + breaks[0];
        }
        if (className === "low") {
            return hexClasses[className].label + ": " + (breaks[0] + 1) + " - " + breaks[1];
        }
        if (className === "medium") {
            return hexClasses[className].label + ": " + (breaks[1] + 1) + " - " + breaks[2];
        }
        if (className === "high") {
            return hexClasses[className].label + ": " + (breaks[2] + 1) + " - " + breaks[3];
        }
        return hexClasses[className].label + ": más de " + breaks[3];
    }
    var maxCount = classBreaksOrMaxCount;
    if (!maxCount || maxCount < 1) {
        return hexClasses[className].label;
    }
    var classNames = getSHAnalyticsHexClassNames();
    var classIndex = classNames.indexOf(className);
    var start = Math.floor((classIndex / classNames.length) * maxCount) + 1;
    var end = classIndex === classNames.length - 1
        ? maxCount
        : Math.floor(((classIndex + 1) / classNames.length) * maxCount);
    start = Math.max(1, Math.min(start, maxCount));
    end = Math.max(start, Math.min(end, maxCount));
    if (start === end) {
        return hexClasses[className].label + ": " + start;
    }
    return hexClasses[className].label + ": " + start + " - " + end;
}

function getSHAnalyticsHexFillColor(count, classBreaksOrMaxCount) {
    return getSHAnalyticsHexClasses()[getSHAnalyticsHexClass(count, classBreaksOrMaxCount)].color;
}

function renderSHAnalyticsLegend(classBreaksOrMaxCount) {
    var hexClasses = getSHAnalyticsHexClasses();
    var legendItems = getSHAnalyticsHexClassNames().map(function (className) {
        var currentClass = hexClasses[className];
        var swatchColor = getSHAnalyticsColorCss(currentClass.color);
        var rangeLabel = getSHAnalyticsHexClassRangeLabel(className, classBreaksOrMaxCount);
        return "<span class='sh-analytics-legend-swatch' style='background:" + swatchColor + ";' title='" + escapeSHAnalyticsHtml(rangeLabel) + "'></span>";
    }).join("");

    $("#shAnalyticsLegendBottom").html(
        "<div class='sh-analytics-legend-title'>Leyenda de cambios</div>" +
        "<div class='sh-analytics-legend-ramp'>" + legendItems + "</div>" +
        "<div class='sh-analytics-legend-scale'><span>Menor</span><span>Mayor</span></div>"
    ).show();
}

function hideSHAnalyticsLegend() {
    $("#shAnalyticsLegendBottom").hide().html("");
}

function createSHAnalyticsHexSymbol(count, classBreaksOrMaxCount) {
    var border = new esri.SimpleLineSymbol(
        esri.SimpleLineSymbol.STYLE_SOLID,
        new esri.Color([35, 35, 35, 0.65]),
        0.9
    );
    return new esri.SimpleFillSymbol(
        esri.SimpleFillSymbol.STYLE_SOLID,
        border,
        new esri.Color(getSHAnalyticsHexFillColor(count, classBreaksOrMaxCount))
    );
}

function renderSHAnalyticsHexHeatmap(summary) {
    if (!currentSHAnalyticsHexLayer) {
        return;
    }
    currentSHAnalyticsHexLayer.clear();
    currentSHAnalyticsLayer.clear();
    currentSHAnalyticsSelectedIndex = null;
    currentSHAnalyticsSelectedHexKey = null;

    var hexBins = {};
    for (var i = 0; i < currentSHAnalyticsData.length; i++) {
        var center = getSHAnalyticsFeatureCenter(currentSHAnalyticsData[i]);
        if (!center) {
            continue;
        }
        var cell = getSHAnalyticsHexCell(center);
        var key = cell.q + ":" + cell.r;
        if (!hexBins[key]) {
            hexBins[key] = { key: key, q: cell.q, r: cell.r, count: 0, indexes: [] };
        }
        hexBins[key].count += 1;
        hexBins[key].indexes.push(i);
    }

    var maxCount = 0;
    var hexCount = 0;
    Object.keys(hexBins).forEach(function (key) {
        maxCount = Math.max(maxCount, hexBins[key].count);
        hexCount += 1;
    });
    var classBreaks = getSHAnalyticsHexClassBreaks(hexBins);

    Object.keys(hexBins).forEach(function (key) {
        var bin = hexBins[key];
        var hexCenter = getSHAnalyticsHexCenter(bin);
        var geometry = createSHAnalyticsHexPolygon(hexCenter);
        var graphic = new esri.Graphic(geometry, createSHAnalyticsHexSymbol(bin.count, classBreaks));
        graphic.attributes = {
            analyticsHexKey: bin.key,
            count: bin.count,
            indexes: bin.indexes,
            maxCount: maxCount,
            classBreaks: classBreaks,
            intensityClass: getSHAnalyticsHexClass(bin.count, classBreaks),
        };
        currentSHAnalyticsHexLayer.add(graphic);
    });

    renderSHAnalyticsLegend(classBreaks);
    $("#selectSHAnalyticsResults").html("");
}

function showSHAnalyticsHexPopup(graphic, mapPoint) {
    if (!graphic || !graphic.attributes) {
        return;
    }
    var count = graphic.attributes.count || 0;
    var content = "<b>" + count + " cambios</b><br/>" +
        "Haz clic para ver los poligonos de cambio";
    map.infoWindow.setTitle("");
    map.infoWindow.setContent(content);
    map.infoWindow.show(mapPoint || graphic.geometry.getExtent().getCenter());
}

function showSHAnalyticsPolygonInstructionPopup(graphic, mapPoint) {
    if (!graphic || !graphic.geometry) {
        return;
    }
    map.infoWindow.setTitle("");
    map.infoWindow.setContent("Haz clic sobre un polígono para ver sus mosaicos mensuales");
    map.infoWindow.show(mapPoint || graphic.geometry.getExtent().getCenter());
}

function createSHAnalyticsSelectedHexSymbol() {
    var border = new esri.SimpleLineSymbol(
        esri.SimpleLineSymbol.STYLE_SOLID,
        new esri.Color([255, 255, 255, 1]),
        3
    );
    return new esri.SimpleFillSymbol(
        esri.SimpleFillSymbol.STYLE_SOLID,
        border,
        new esri.Color([255, 255, 255, 0.08])
    );
}

function resetSHAnalyticsHexSymbols(selectedGraphic) {
    if (!currentSHAnalyticsHexLayer || !currentSHAnalyticsHexLayer.graphics) {
        return;
    }
    for (var i = 0; i < currentSHAnalyticsHexLayer.graphics.length; i++) {
        var graphic = currentSHAnalyticsHexLayer.graphics[i];
        if (!graphic || !graphic.attributes) {
            continue;
        }
        if (selectedGraphic && graphic === selectedGraphic) {
            graphic.setSymbol(createSHAnalyticsSelectedHexSymbol());
        } else {
            graphic.setSymbol(createSHAnalyticsHexSymbol(graphic.attributes.count, graphic.attributes.classBreaks || graphic.attributes.maxCount));
        }
    }
}

function getSHAnalyticsWebMercatorGeometry(pos) {
    if (pos == null || !currentSHAnalyticsData || !currentSHAnalyticsData[pos] || !currentSHAnalyticsData[pos].geometry) {
        return null;
    }
    try {
        var dataJSON = Terraformer.ArcGIS.fromGeoJSON(currentSHAnalyticsData[pos].geometry);
        return esri.webMercatorUtils.geographicToWebMercator(esri.jsonUtilsGeometry.fromJson(dataJSON));
    } catch (err) {
        console.warn("No se pudo dibujar el polígono de Planet Analytics", err);
    }
    return null;
}

function addSHAnalyticsPolygonToMap(pos) {
    var geometry = getSHAnalyticsWebMercatorGeometry(pos);
    if (!geometry) {
        return null;
    }
    var graphic = new esri.Graphic(geometry, createSHAnalyticsPolygonSymbol());
    graphic.attributes = {
        analyticsIndex: pos,
        source: "planet-analytics-change",
    };
    currentSHAnalyticsLayer.add(graphic);
    return graphic;
}

function updateSHAnalyticsHexSelectionResults(graphic) {
    $("#selectSHAnalyticsResults").html("");
}

function bindSHAnalyticsPolygonClickHandler() {
    if (!currentSHAnalyticsLayer) {
        return;
    }
    if (currentSHAnalyticsPolygonClickHandle) {
        currentSHAnalyticsPolygonClickHandle.remove();
    }
    currentSHAnalyticsPolygonClickHandle = currentSHAnalyticsLayer.on("click", function (evt) {
        if (!evt || !evt.graphic || !evt.graphic.attributes) {
            return;
        }
        var pos = evt.graphic.attributes.analyticsIndex;
        if (pos !== undefined && pos !== null) {
            showSHAnalyticsInfoPopup(pos, evt.mapPoint);
        }
    });
}

function bringSHAnalyticsPolygonsToFront() {
    if (!map || !currentSHAnalyticsLayer || !map.reorderLayer) {
        return;
    }
    try {
        var targetIndex = map.graphicsLayerIds && map.graphicsLayerIds.length ? map.graphicsLayerIds.length - 1 : map.layerIds.length;
        map.reorderLayer(currentSHAnalyticsLayer, targetIndex);
    } catch (err) {
        console.warn("No se pudo traer al frente los polígonos de Planet Analytics", err);
    }
}

function findSHAnalyticsPolygonAtMapPoint(mapPoint) {
    if (!mapPoint || !currentSHAnalyticsLayer || !currentSHAnalyticsLayer.graphics) {
        return null;
    }
    for (var i = currentSHAnalyticsLayer.graphics.length - 1; i >= 0; i--) {
        var graphic = currentSHAnalyticsLayer.graphics[i];
        if (!graphic || !graphic.geometry || !graphic.attributes) {
            continue;
        }
        try {
            if (esri.geometryEngine && esri.geometryEngine.contains && esri.geometryEngine.contains(graphic.geometry, mapPoint)) {
                return graphic;
            }
        } catch (err) {
            console.warn("No se pudo evaluar el clic sobre el polígono de Planet Analytics", err);
        }
    }
    return null;
}

function handleSHAnalyticsSelectedHexClick(evt) {
    if (!evt || currentSHAnalyticsSelectedHexKey === null) {
        return false;
    }
    var polygonGraphic = findSHAnalyticsPolygonAtMapPoint(evt.mapPoint);
    if (!polygonGraphic || !polygonGraphic.attributes) {
        return false;
    }
    var pos = polygonGraphic.attributes.analyticsIndex;
    if (pos === undefined || pos === null) {
        return false;
    }
    showSHAnalyticsInfoPopup(pos, evt.mapPoint);
    return true;
}

function zoomToSHAnalyticsHexAndShowChanges(graphic, mapPoint) {
    if (!graphic || !graphic.attributes) {
        return;
    }
    var indexes = graphic.attributes.indexes || [];
    currentSHAnalyticsSelectedHexKey = graphic.attributes.analyticsHexKey || null;
    currentSHAnalyticsSelectedIndex = null;
    currentSHAnalyticsLayer.clear();
    currentSHAnalyticsLayer.setVisibility(true);

    for (var i = 0; i < indexes.length; i++) {
        addSHAnalyticsPolygonToMap(indexes[i]);
    }

    resetSHAnalyticsHexSymbols(graphic);
    bindSHAnalyticsPolygonClickHandler();
    bringSHAnalyticsPolygonsToFront();
    if (currentSHAnalyticsBoundariesLoaded && $("#chkSHAnalyticsBoundaries").is(":checked")) {
        bringSHAnalyticsBoundariesToFront();
    }
    updateSHAnalyticsHexSelectionResults(graphic);

    var selectedHexKey = currentSHAnalyticsSelectedHexKey;
    if (graphic.geometry && graphic.geometry.getExtent) {
        map.setExtent(graphic.geometry.getExtent().expand(1.25), true);
    }
    window.setTimeout(function () {
        if (currentSHAnalyticsSelectedHexKey === selectedHexKey) {
            showSHAnalyticsPolygonInstructionPopup(graphic, mapPoint);
        }
    }, 650);
}

function loadMoreSHAnalytics() {
    if (!currentSHAnalyticsNextUrl) {
        return;
    }
    var loading = $.confirm({
        title: "",
        content: "<div style='text-align: center;'><img src='/images/ig124.gif' style='height: 200px;width: 200px;'></div>",
        buttons: {},
        closeIcon: true,
        lazyOpen: true,
        onContentReady: function () {},
        onOpenBefore: function () {
            loading.buttons.ok.hide();
            loading.buttons.close.hide();
        },
    });
    loading.open();
    loadSHAnalyticsPage($("#selectSHAnalyticsSubs").val(), currentSHAnalyticsNextUrl, true, loading, currentSHAnalyticsLoadRequestId);
}

function zoomSHAnalytics(pos) {
    var _geometry = getSHAnalyticsWebMercatorGeometry(pos);
    if (_geometry && _geometry.getCentroid) {
        map.centerAndZoom(_geometry.getCentroid(), 15);
    }
}

function showSHAnalyticsInfoPopup(pos, mapPoint) {
    if (pos == null || currentSHAnalyticsData == null || !currentSHAnalyticsData[pos]) {
        return;
    }
    var item = currentSHAnalyticsData[pos];

    // Resaltar únicamente el polígono seleccionado
    highlightSHAnalyticsPolygon(pos);

    openSHAnalyticsMosaicWindow(item, pos, "gallery");
}

function getSHAnalyticsSliderMax(item) {
    var dateBaseStr = item.properties["date"].substring(0, 10);
    var baseMoment = esri.moment(dateBaseStr);
    var monthsToNow = esri.moment().diff(baseMoment, "months");
    return Math.min(5, Math.max(-5, monthsToNow - 1));
}

function updateSHAnalyticsVisualization(pos, diff) {
    if (currentSHAnalyticsData == null || !currentSHAnalyticsData[pos]) {
        return;
    }
    var date_base = currentSHAnalyticsData[pos].properties["date"].substring(0, 10);
    var new_date_base = esri.moment(date_base).add(diff, "month").format("YYYY-MM-DD");
    currentSHAnalyticsID = "global_monthly_" + esri.moment(new_date_base).format("YYYY_MM") + "_mosaic";
    if (currentSHAnalyticsBGLayer != null) {
        map.removeLayer(currentSHAnalyticsBGLayer);
    }
    currentSHAnalyticsBGLayer = createSHAnalyticsTileLayer(currentSHAnalyticsID);
    map.addLayer(currentSHAnalyticsBGLayer);
}

function findSHAnalyticsGraphicByDataIndex(pos) {
    if (!currentSHAnalyticsLayer || !currentSHAnalyticsLayer.graphics) {
        return null;
    }
    for (var i = 0; i < currentSHAnalyticsLayer.graphics.length; i++) {
        var graphic = currentSHAnalyticsLayer.graphics[i];
        if (graphic && graphic.attributes && graphic.attributes.analyticsIndex === pos) {
            return graphic;
        }
    }
    return currentSHAnalyticsLayer.graphics[pos] || null;
}

function highlightSHAnalyticsPolygon(pos) {
    if (!currentSHAnalyticsLayer || !currentSHAnalyticsLayer.graphics) {
        return;
    }
    // Restaurar símbolo anterior
    if (currentSHAnalyticsSelectedIndex !== null) {
        var selectedGraphic = findSHAnalyticsGraphicByDataIndex(currentSHAnalyticsSelectedIndex);
        if (selectedGraphic) {
            selectedGraphic.setSymbol(createSHAnalyticsPolygonSymbol());
        }
    }
    // Resaltar actual
    var currentGraphic = findSHAnalyticsGraphicByDataIndex(pos);
    if (currentGraphic) {
        var cLineHighlight = esri.Color.fromArray([255, 255, 0, 1.0]);
        var cFillHighlight = esri.Color.fromArray([255, 255, 0, 0.2]);
        var symbolHighlight = new esri.SimpleFillSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineHighlight, 3), cFillHighlight);
        currentGraphic.setSymbol(symbolHighlight);
        currentSHAnalyticsSelectedIndex = pos;
    }
}

function getSHAnalyticsDetectionMoment(item) {
    var properties = item && item.properties ? item.properties : {};
    var detectionDate = properties.date || properties.acquired || properties.published;
    if (!detectionDate) {
        return null;
    }
    var detectionMoment = esri.moment(detectionDate);
    if (!detectionMoment.isValid()) {
        detectionMoment = esri.moment(detectionDate, "DD/MM/YYYY");
    }
    return detectionMoment.isValid() ? detectionMoment : null;
}

function openSHAnalyticsMosaicWindow(item, pos, mode) {
    var detectionMoment = getSHAnalyticsDetectionMoment(item);
    if (!detectionMoment) {
        showLoading("No se pudo identificar la fecha de detección para abrir los mosaicos", null, "red", true);
        return;
    }
    var properties = item && item.properties ? item.properties : {};
    var selectedGraphic = findSHAnalyticsGraphicByDataIndex(pos);
    var detectionDate = detectionMoment.format("DD/MM/YYYY");
    $("#shAnalyticsFloatingDetail").hide();
    openMonthlyMosaicFloatingWindowFromDates(detectionDate, detectionDate, "Planet Analytics - Detección de Cambios", selectedGraphic, mode, properties.date || detectionDate, pos);
}

function openMonthlyMosaicFloatingWindowFromDates(startDateStr, endDateStr, indexLabel, selectedGraphic, initialMode, detectionDateLabel, shAnalyticsDataIndex) {
    var monthNamesEs = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    var formatBurnsMonthYear = function (dateMoment) {
        return monthNamesEs[dateMoment.month()] + " " + dateMoment.format("YYYY");
    };
    var endMoment = esri.moment(endDateStr, ["DD/MM/YYYY", "DD/MM/yyyy", esri.moment.ISO_8601]);
    if (!endMoment.isValid()) {
        return;
    }
    var indexInfoHtml = "";
    if (indexLabel === "Zonas de quema (NBR)") {
        indexInfoHtml = "<span class='tooltip-container burns-nbr-info' title='Información del índice'><span class='icon'>i</span><span class='tooltip-text'>El índice de zonas de quema (NBR) se calcula con imágenes Sentinel siguiendo la metodología del evalscript de Sentinel Hub para áreas quemadas: <a href='https://custom-scripts.sentinel-hub.com/sentinel-2/burned_area_ms/' target='_blank' rel='noopener noreferrer'>Burned area mapping</a>. En el mapa principal se muestra la imagen Sentinel empleada para el índice. Esta ventana flotante muestra mosaicos mensuales de Planet, usados estrictamente para validaciones y comparaciones visuales, no para ejecutar el evalscript.</span></span>";
    }
    if (indexLabel === "Pérdida de cobertura vegetal") {
        indexInfoHtml = "<span class='tooltip-container burns-nbr-info' title='Información del índice'><span class='icon'>i</span><span class='tooltip-text'>El índice de pérdida de cobertura vegetal se calcula con imágenes Sentinel siguiendo metodologías del evalscript de Sentinel Hub: <a href='https://custom-scripts.sentinel-hub.com/custom-scripts/sentinel/sentinel-2/' target='_blank' rel='noopener noreferrer'>Sentinel Hub Custom Scripts</a>. En el mapa principal se muestra la imagen Sentinel empleada para el cálculo del índice. Esta ventana flotante muestra mosaicos mensuales de Planet, usados estrictamente para validaciones y comparaciones visuales, no para ejecutar el evalscript.</span></span>";
    }
    var hasSelectedPolygon = !!(selectedGraphic && selectedGraphic.geometry);
    var shAnalyticsDownloadHtml = "";
    var shAnalyticsPdfHtml = "";
    if (indexLabel === "Planet Analytics - Detección de Cambios" && shAnalyticsDataIndex !== undefined && shAnalyticsDataIndex !== null) {
        shAnalyticsDownloadHtml = "<button type='button' class='sh-analytics-floating-download-btn' title='Descargar polígono' data-sh-analytics-index='" + shAnalyticsDataIndex + "'><span class='glyphicon glyphicon-download-alt' aria-hidden='true'></span></button>";
        shAnalyticsPdfHtml = "<button type='button' class='sh-analytics-floating-pdf-btn' title='Descargar reporte PDF' data-sh-analytics-index='" + shAnalyticsDataIndex + "'><span class='sh-analytics-pdf-icon'>PDF</span></button>";
    }
    var panelHtml = "<div id='burnsFloatingHeader' style='display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#4f6b5a;color:#fff;border-radius:6px 6px 0 0;cursor:move;'>" +
        "<div style='font-weight:600;'>Visualización de mosaicos mensuales</div>" +
        "<a href='#' id='burnsFloatingClose' style='color:#fff;text-decoration:none;font-size:18px;line-height:18px;'>×</a></div>" +
        "<div style='padding:10px;background:#fff;'>" +
        "<table style='width:100%;border-collapse:collapse;background:#fff;border:1px solid #ddd;'>" +
        "<tr><td style='padding:8px;border-bottom:1px solid #eee;font-weight:600;'>Índice</td><td style='padding:8px;border-bottom:1px solid #eee;'><span class='burns-index-label'>" + indexLabel + "</span>" + shAnalyticsDownloadHtml + shAnalyticsPdfHtml + indexInfoHtml + "</td></tr>" +
        (detectionDateLabel ? "<tr><td style='padding:8px;border-bottom:1px solid #eee;font-weight:600;'>Fecha de detección</td><td style='padding:8px;border-bottom:1px solid #eee;'>" + detectionDateLabel + "</td></tr>" : "") +
        "</table>" +
        "<div id='burnsSelectPolygonMessage' style='display:" + (hasSelectedPolygon ? "none" : "block") + ";margin:8px 0 0;padding:9px 10px;border:1px solid #d9e2dc;background:#f6faf7;color:#3d5e4f;font-weight:600;text-align:center;border-radius:4px;'>Seleccione poligono en el mapa para desplegar los mosaicos</div>" +
        "<div style='display:flex;gap:8px;margin-top:8px;margin-bottom:10px;'>" +
            "<button id='burnsModeGallery' type='button' style='flex:1;padding:6px 10px;border:1px solid #3d5e4f;background:#4f6b5a;color:#fff;border-radius:4px;font-weight:600;'>Galería</button>" +
            "<button id='burnsModeSwipe' type='button' style='flex:1;padding:6px 10px;border:1px solid #3d5e4f;background:#fff;color:#3d5e4f;border-radius:4px;font-weight:600;'>Swipe</button>" +
        "</div>" +
        "<div id='burnsGalleryPane' style='margin-top:8px;'>" +
            "<div id='burnsGalleryGrid' style='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;'></div>" +
        "</div>" +
        "<div id='burnsSwipePane' style='display:none;'>" +
            "<div id='burnsSwipeMapWrap' style='position:relative;height:420px;border:1px solid #ddd;border-radius:4px;overflow:hidden;background:#f7f7f7;'>" +
                "<div id='burnsSwipeMap' style='position:absolute;inset:0;'></div>" +
                "<div id='burnsSwipeControl' style='position:absolute;inset:0;z-index:11;pointer-events:none;'></div>" +
                "<div id='burnsSwipeLeftLabel' style='position:absolute;left:80px;bottom:18px;z-index:12;padding:6px 14px;border:1px solid #3d5e4f;border-radius:4px;color:#3d5e4f;font-size:14px;font-weight:600;line-height:1;background:#fff;text-transform:capitalize;pointer-events:auto;display:flex;align-items:center;gap:8px;'>" +
                    "<span id='burnsSwipeLeftLabelText'></span>" +
                    "<button id='burnsSwipeMonthPickerBtn' type='button' style='border:0;background:#3d5e4f;color:#fff;border-radius:4px;padding:2px 6px;font-size:12px;line-height:1;cursor:pointer;' title='Seleccionar mes inicial'>▾</button>" +
                "</div>" +
                "<div id='burnsSwipeRightLabel' style='position:absolute;right:80px;bottom:18px;z-index:12;padding:6px 14px;border:1px solid #3d5e4f;border-radius:4px;color:#3d5e4f;font-size:14px;font-weight:600;line-height:1;background:#fff;text-transform:capitalize;pointer-events:none;'></div>" +
                "<div id='burnsMonthPickerPopover' style='display:none;position:absolute;left:80px;bottom:62px;z-index:13;background:#fff;border:1px solid #d5d5d5;border-radius:8px;box-shadow:0 8px 20px rgba(0,0,0,0.18);padding:10px;width:220px;'>" +
                    "<div style='display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;'>" +
                        "<button id='burnsMonthPickerPrevYear' type='button' style='border:0;background:transparent;color:#3d5e4f;font-size:18px;line-height:1;cursor:pointer;'>«</button>" +
                        "<div id='burnsMonthPickerYear' style='font-weight:700;color:#3d5e4f;'></div>" +
                        "<button id='burnsMonthPickerNextYear' type='button' style='border:0;background:transparent;color:#3d5e4f;font-size:18px;line-height:1;cursor:pointer;'>»</button>" +
                    "</div>" +
                    "<div id='burnsMonthPickerGrid' style='display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;'></div>" +
                "</div>" +
            "</div>" +
        "</div>" +
        "</div>";
    if ($("#burnsFloatingDetail").length === 0) {
        $("#mapViewDiv").append("<div id='burnsFloatingDetail' style='position:absolute;top:20px;left:20px;z-index:1200;width:780px;max-width:calc(100vw - 40px);box-shadow:0 4px 14px rgba(0,0,0,0.25);border-radius:6px;overflow:hidden;'></div>");
    }
    $("#burnsFloatingDetail").css({
        width: "780px",
        maxWidth: "calc(100vw - 40px)"
    });
    $("#burnsFloatingDetail").html(panelHtml).show();
    $("#burnsFloatingClose").off("click").on("click", function (evt) {
        evt.preventDefault();
        $("#burnsFloatingDetail").hide();
    });
    $(".sh-analytics-floating-download-btn").off("click").on("click", function (evt) {
        evt.preventDefault();
        downloadSHAnalyticsFeatureByIndex($(this).attr("data-sh-analytics-index"));
    });
    $(".sh-analytics-floating-pdf-btn").off("click").on("click", function (evt) {
        evt.preventDefault();
        downloadSHAnalyticsPolygonPdf($(this).attr("data-sh-analytics-index"));
    });

    var targetExtent = null;
    if (selectedGraphic && selectedGraphic.geometry && selectedGraphic.geometry.getExtent) {
        targetExtent = selectedGraphic.geometry.getExtent().expand(3);
        map.setExtent(targetExtent.expand(1.3), true);
    } else if (currentSearchArea2 && currentSearchArea2.getExtent) {
        targetExtent = currentSearchArea2.getExtent().expand(2);
    } else {
        targetExtent = map.extent;
    }
    if (!hasSelectedPolygon) {
        $("#burnsGalleryPane, #burnsSwipePane").hide();
        $("#burnsModeGallery, #burnsModeSwipe").prop("disabled", true).css({ opacity: 0.55, cursor: "not-allowed" });
    }
    var clearBurnsFloatingMaps = function () {
        burnsGallerySyncHandles.forEach(function (handle) {
            try { handle.remove(); } catch (e) {}
        });
        burnsGallerySyncHandles = [];
        burnsGallerySyncing = false;
        burnsGalleryMaps.forEach(function (m) { try { m.destroy(); } catch (e) {} });
        burnsGalleryMaps = [];
        if (burnsCompareMap) {
            try { burnsCompareMap.destroy(); } catch (e) {}
            burnsCompareMap = null;
        }
        if (burnsCompareSwipe) {
            try { burnsCompareSwipe.destroy(); } catch (e) {}
            burnsCompareSwipe = null;
        }
    };
    clearBurnsFloatingMaps();
    var buildMosaicLayer = function (dateMoment) {
        var mosaicId = "global_monthly_" + dateMoment.format("YYYY_MM") + "_mosaic";
        return createSHAnalyticsTileLayer(mosaicId);
    };
    var bindBurnsGallerySync = function () {
        burnsGallerySyncHandles.forEach(function (handle) {
            try { handle.remove(); } catch (e) {}
        });
        burnsGallerySyncHandles = [];
        burnsGalleryMaps.forEach(function (miniMap) {
            var handle = miniMap.on("extent-change", function (evt) {
                if (burnsGallerySyncing || !evt || !evt.extent || evt.levelChange) return;
                burnsGallerySyncing = true;
                burnsGalleryMaps.forEach(function (targetMap) {
                    if (targetMap === miniMap) return;
                    try {
                        targetMap.setExtent(evt.extent, true);
                    } catch (e) {}
                });
                burnsGallerySyncing = false;
            });
            burnsGallerySyncHandles.push(handle);
        });
    };
    var renderGallery = function () {
        $("#burnsGalleryGrid").empty();
        for (var i = 5; i >= 0; i--) {
            var dm = endMoment.clone().add(-i, "month");
            var cellId = "burnsGalleryCell_" + dm.format("YYYY_MM");
            $("#burnsGalleryGrid").append("<div><div id='" + cellId + "' style='height:190px;border:1px solid #ddd;border-radius:4px;overflow:hidden;background:#f7f7f7;'></div><div style='text-align:center;font-weight:600;margin-top:6px;'>" + formatBurnsMonthYear(dm) + "</div></div>");
            var miniMap = new esri.Map(cellId, { logo: false, slider: false, showAttribution: false, center: targetExtent.getCenter(), zoom: map.getZoom() });
            miniMap.addLayer(buildMosaicLayer(dm));
            if (selectedGraphic && selectedGraphic.geometry) {
                miniMap.graphics.add(new esri.Graphic(selectedGraphic.geometry, createClassifiedPolygonPreviewSymbol()));
            }
            miniMap.setExtent(targetExtent, true);
            burnsGalleryMaps.push(miniMap);
        }
        bindBurnsGallerySync();
    };
    var swipeFinalMoment = null;
    var swipeCompareMoment = null;
    var swipeMinMoment = esri.moment("2021-01-01").startOf("month");
    var monthPickerYear = null;
    var renderMonthPicker = function () {
        if (monthPickerYear === null) monthPickerYear = swipeCompareMoment.year();
        $("#burnsMonthPickerYear").text(monthPickerYear);
        var monthShortNamesEs = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        var html = "";
        for (var monthIdx = 0; monthIdx < 12; monthIdx++) {
            var monthMoment = esri.moment({ year: monthPickerYear, month: monthIdx, day: 1 });
            var isFutureThanEnd = monthMoment.isAfter(swipeFinalMoment, "month");
            var isBeforeMin = monthMoment.isBefore(swipeMinMoment, "month");
            var isDisabled = isFutureThanEnd || isBeforeMin;
            var isActive = swipeCompareMoment.year() === monthPickerYear && swipeCompareMoment.month() === monthIdx;
            html += "<button type='button' class='burns-month-option' data-month='" + monthIdx + "' style='padding:8px 0;border:1px solid " + (isActive ? "#3d5e4f" : "#e0e0e0") + ";background:" + (isActive ? "#e8efe9" : "#fff") + ";border-radius:6px;color:#3d5e4f;cursor:" + (isDisabled ? "not-allowed" : "pointer") + ";opacity:" + (isDisabled ? "0.45" : "1") + ";'>" + monthShortNamesEs[monthIdx] + "</button>";
        }
        $("#burnsMonthPickerGrid").html(html);
    };
    var updateSwipeLeftSelection = function (newCompareMoment) {
        swipeCompareMoment = newCompareMoment.clone().startOf("month");
        $("#burnsSwipeLeftLabelText").text(formatBurnsMonthYear(swipeCompareMoment).toLowerCase());
        if (burnsCompareMap) {
            burnsCompareMap.removeLayer(burnsCompareMap.getLayer("burnsSwipeLeftLayer"));
            var leftLayer = buildMosaicLayer(swipeCompareMoment);
            leftLayer.id = "burnsSwipeLeftLayer";
            burnsCompareMap.addLayer(leftLayer);
            if (burnsCompareSwipe) {
                burnsCompareSwipe.layers = [leftLayer];
            }
        }
        renderMonthPicker();
    };
    var renderSwipe = function () {
        var finalMoment = endMoment.clone();
        var compareMoment = finalMoment.clone().add(-1, "month").startOf("month");
        if (compareMoment.isBefore(swipeMinMoment, "month")) {
            compareMoment = swipeMinMoment.clone();
        }
        if (compareMoment.isAfter(finalMoment, "month")) {
            compareMoment = finalMoment.clone().startOf("month");
        }
        swipeFinalMoment = finalMoment.clone().startOf("month");
        swipeCompareMoment = compareMoment.clone().startOf("month");
        monthPickerYear = swipeCompareMoment.year();
        $("#burnsSwipeLeftLabelText").text(formatBurnsMonthYear(swipeCompareMoment).toLowerCase());
        $("#burnsSwipeRightLabel").text(formatBurnsMonthYear(finalMoment).toLowerCase());
        burnsCompareMap = new esri.Map("burnsSwipeMap", {
            logo: false,
            slider: false,
            showAttribution: false,
            center: targetExtent.getCenter(),
            zoom: map.getZoom()
        });
        var leftLayer = buildMosaicLayer(swipeCompareMoment);
        leftLayer.id = "burnsSwipeLeftLayer";
        var rightLayer = buildMosaicLayer(finalMoment);
        burnsCompareMap.addLayer(rightLayer);
        burnsCompareMap.addLayer(leftLayer);
        var swipeStarted = false;
        burnsCompareMap.on("update-end", function () {
            if (swipeStarted || !leftLayer.loaded || !rightLayer.loaded) return;
            swipeStarted = true;
            if (selectedGraphic && selectedGraphic.geometry) {
                burnsCompareMap.graphics.add(new esri.Graphic(selectedGraphic.geometry, createClassifiedPolygonPreviewSymbol()));
            }
            burnsCompareMap.setExtent(targetExtent, true);
            burnsCompareMap.resize();
            burnsCompareMap.reposition();
            var mapNode = document.getElementById("burnsSwipeMap");
            var defaultLeft = mapNode ? Math.round(mapNode.offsetWidth / 2) : 360;
            burnsCompareSwipe = new esri.LayerSwipe({
                type: "vertical",
                map: burnsCompareMap,
                left: defaultLeft,
                layers: [leftLayer]
            }, "burnsSwipeControl");
            burnsCompareSwipe.startup();
            if (burnsCompareSwipe.domNode) {
                // Permite navegar el mapa y dejar interactivo únicamente el control del swipe.
                burnsCompareSwipe.domNode.style.pointerEvents = "none";
                var swipeInteractiveNodes = burnsCompareSwipe.domNode.querySelectorAll(".handle, .bar, .vertical");
                if (swipeInteractiveNodes && swipeInteractiveNodes.length > 0) {
                    swipeInteractiveNodes.forEach(function (node) {
                        node.style.pointerEvents = "auto";
                    });
                } else if (burnsCompareSwipe.domNode.firstElementChild) {
                    burnsCompareSwipe.domNode.firstElementChild.style.pointerEvents = "auto";
                }
            }
        });
        renderMonthPicker();
    };
    var setBurnsMode = function (mode) {
        var isGallery = mode === "gallery";
        var isSwipe = mode === "swipe";
        $("#burnsGalleryPane").toggle(isGallery);
        $("#burnsSwipePane").toggle(isSwipe);
        $("#burnsModeGallery").css({ background: isGallery ? "#4f6b5a" : "#fff", color: isGallery ? "#fff" : "#3d5e4f" });
        $("#burnsModeSwipe").css({ background: isSwipe ? "#4f6b5a" : "#fff", color: isSwipe ? "#fff" : "#3d5e4f" });
        if (isSwipe && !burnsCompareMap) {
            renderSwipe();
        } else if (isSwipe && burnsCompareMap) {
            burnsCompareMap.resize();
            burnsCompareMap.reposition();
        }
    };
    if (hasSelectedPolygon) {
        renderGallery();
        setBurnsMode(initialMode === "swipe" ? "swipe" : "gallery");
    }
    $("#burnsModeGallery").off("click").on("click", function () { setBurnsMode("gallery"); });
    $("#burnsModeSwipe").off("click").on("click", function () { setBurnsMode("swipe"); });
    $("#burnsSwipeMonthPickerBtn").off("click").on("click", function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        $("#burnsMonthPickerPopover").toggle();
        renderMonthPicker();
    });
    $("#burnsMonthPickerPrevYear").off("click").on("click", function () {
        monthPickerYear -= 1;
        renderMonthPicker();
    });
    $("#burnsMonthPickerNextYear").off("click").on("click", function () {
        monthPickerYear += 1;
        renderMonthPicker();
    });
    $("#burnsMonthPickerGrid").off("click", ".burns-month-option").on("click", ".burns-month-option", function () {
        if ($(this).css("cursor") === "not-allowed") return;
        var monthIdx = parseInt($(this).attr("data-month"), 10);
        var selectedMoment = esri.moment({ year: monthPickerYear, month: monthIdx, day: 1 });
        updateSwipeLeftSelection(selectedMoment);
        $("#burnsMonthPickerPopover").hide();
    });
    $("#burnsFloatingDetail").off("click.burnsMonthPickerOutside").on("click.burnsMonthPickerOutside", function (evt) {
        if (!$(evt.target).closest("#burnsMonthPickerPopover, #burnsSwipeMonthPickerBtn").length) {
            $("#burnsMonthPickerPopover").hide();
        }
    });

    if ($("#burnsFloatingDetail").data("moveableInit") !== true && typeof esri !== "undefined" && esri.Moveable) {
        new esri.Moveable("burnsFloatingDetail", { handle: "burnsFloatingHeader" });
        $("#burnsFloatingDetail").data("moveableInit", true);
    }
    $("#burnsFloatingClose").off("click").on("click", function (evt) {
        evt.preventDefault();
        clearBurnsFloatingMaps();
        $("#burnsFloatingDetail").hide();
    });
}

function getMonthlyMosaicIndexLabel(index) {
    var normalizedIndex = (index || "").toString().toUpperCase();
    if (normalizedIndex === "NBR") return "Zonas de quema (NBR)";
    if (normalizedIndex === "MAP_DEFORESTATION") return "Pérdida de cobertura vegetal";
    return null;
}

function shouldShowSentinelOverlayForIndex(index) {
    var normalizedIndex = (index || "").toString().toUpperCase();
    return normalizedIndex === "NBR" || normalizedIndex === "MAP_DEFORESTATION";
}

function shouldForceDissolveForIndex(index) {
    var normalizedIndex = (index || "").toString().toUpperCase();
    return normalizedIndex === "NBR" || normalizedIndex === "MAP_DEFORESTATION";
}

var CLASSIFIED_POLYGON_MIN_AREA_M2 = 2500;
var CLASSIFIED_POLYGON_BORDER_COLOR = [80, 210, 210, 0.95];
var CLASSIFIED_POLYGON_BORDER_WIDTH = 0.75;

function createClassifiedPolygonPreviewSymbol() {
    var borderSymbol = new esri.SimpleLineSymbol(
        esri.SimpleLineSymbol.STYLE_SOLID,
        new esri.Color(CLASSIFIED_POLYGON_BORDER_COLOR),
        CLASSIFIED_POLYGON_BORDER_WIDTH
    );
    return new esri.SimpleFillSymbol(
        esri.SimpleFillSymbol.STYLE_NULL,
        borderSymbol,
        new esri.Color([80, 210, 210, 0])
    );
}

function createSHAnalyticsPolygonSymbol() {
    var borderSymbol = new esri.SimpleLineSymbol(
        esri.SimpleLineSymbol.STYLE_SOLID,
        new esri.Color(CLASSIFIED_POLYGON_BORDER_COLOR),
        CLASSIFIED_POLYGON_BORDER_WIDTH
    );
    return new esri.SimpleFillSymbol(
        esri.SimpleFillSymbol.STYLE_NULL,
        borderSymbol,
        new esri.Color([80, 210, 210, 0])
    );
}

function dissolveRasterPolygonsByValue(geojson, index) {
    var featureCount = geojson && geojson.features ? geojson.features.length : 0;
    var mustDissolve = shouldForceDissolveForIndex(index);
    var maxFeaturesWithoutForcedDissolve = 5000;

    if (!featureCount) return geojson;

    if (!mustDissolve && featureCount > maxFeaturesWithoutForcedDissolve) {
        console.warn("Skipping turf.dissolve because the raster contains too many polygons:", featureCount);
        return geojson;
    }

    try {
        return turf.dissolve(geojson, { propertyName: "value" });
    } catch (e) {
        console.warn("turf.dissolve failed, using raw geojson:", e);
        return geojson;
    }
}

function calculatePolygonPartAreaM2(coordinates) {
    if (!coordinates) return 0;
    try {
        return turf.area({
            type: "Feature",
            properties: {},
            geometry: {
                type: "Polygon",
                coordinates: coordinates,
            },
        });
    } catch (e) {
        console.warn("Could not calculate classified polygon area:", e);
        return 0;
    }
}

function filterClassifiedPolygons(polygons, index) {
    if (!polygons || !Array.isArray(polygons.features)) return polygons;

    var normalizedIndex = (index || "").toString().toLowerCase();
    var isNBR = normalizedIndex === "nbr";
    var filteredFeatures = [];
    var removedByArea = 0;
    var removedByValue = 0;

    polygons.features.forEach(function (feature) {
        var value = Number(feature && feature.properties ? feature.properties.value : null);
        if (value === 0 || Number.isNaN(value) || (isNBR && value !== 4)) {
            removedByValue++;
            return;
        }

        if (!feature.geometry) return;

        if (feature.geometry.type === "Polygon") {
            if (calculatePolygonPartAreaM2(feature.geometry.coordinates) >= CLASSIFIED_POLYGON_MIN_AREA_M2) {
                filteredFeatures.push(feature);
            } else {
                removedByArea++;
            }
            return;
        }

        if (feature.geometry.type === "MultiPolygon") {
            var retainedCoordinates = [];
            feature.geometry.coordinates.forEach(function (polygonCoordinates) {
                if (calculatePolygonPartAreaM2(polygonCoordinates) >= CLASSIFIED_POLYGON_MIN_AREA_M2) {
                    retainedCoordinates.push(polygonCoordinates);
                } else {
                    removedByArea++;
                }
            });

            if (retainedCoordinates.length === 1) {
                filteredFeatures.push({
                    type: "Feature",
                    properties: Object.assign({}, feature.properties),
                    geometry: {
                        type: "Polygon",
                        coordinates: retainedCoordinates[0],
                    },
                });
            } else if (retainedCoordinates.length > 1) {
                filteredFeatures.push({
                    type: "Feature",
                    properties: Object.assign({}, feature.properties),
                    geometry: {
                        type: "MultiPolygon",
                        coordinates: retainedCoordinates,
                    },
                });
            }
        }
    });

    polygons.features = filteredFeatures;
    console.log("[CLASSIFY] Filtro de polígonos:", {
        removedByValue: removedByValue,
        removedByArea: removedByArea,
        minAreaM2: CLASSIFIED_POLYGON_MIN_AREA_M2,
        remaining: polygons.features.length,
    });
    return polygons;
}

function bindBurnsLayerClickHandler() {
    if (!currentSHLayer) return;
    if (burnsLayerClickHandle) burnsLayerClickHandle.remove();
    burnsLayerClickHandle = currentSHLayer.on("click", function (evt) {
        if (!evt || !evt.graphic || !lastProcessedSHResult) return;
        var indexLabel = getMonthlyMosaicIndexLabel(lastProcessedSHResult.index);
        if (!indexLabel) return;
        openMonthlyMosaicFloatingWindowFromDates($("#selectSHStats1").val(), $("#selectSHStats2").val(), indexLabel, evt.graphic);
    });
}

function clearBurnsMonthlyMosaicWindow() {
    try {
        if (burnsLayerClickHandle) {
            burnsLayerClickHandle.remove();
            burnsLayerClickHandle = null;
        }
        burnsGallerySyncHandles.forEach(function (handle) {
            try { handle.remove(); } catch (e) {}
        });
        burnsGallerySyncHandles = [];
        burnsGallerySyncing = false;
        burnsGalleryMaps.forEach(function (m) {
            try { m.destroy(); } catch (e) {}
        });
        burnsGalleryMaps = [];
        if (burnsCompareMap) {
            try { burnsCompareMap.destroy(); } catch (e) {}
            burnsCompareMap = null;
        }
        if (burnsCompareSwipe) {
            try { burnsCompareSwipe.destroy(); } catch (e) {}
            burnsCompareSwipe = null;
        }
        $("#burnsFloatingDetail").hide().empty();
        lastProcessedSHResult = null;
    } catch (e) {
        console.warn("[BURNS] clearBurnsMonthlyMosaicWindow error", e);
    }
}

function detailSHAnalytics(pos) {
    currentSHAnalyticsChange = pos;
    $(".analyticsDivC").collapse("hide");
    $(".analyticssDivCollapse img").attr("src", "/images/iconos/Down_01.png");
    if ($("#analyticsDivBody" + pos).hasClass("in")) {
        $("#analyticsDivBody" + pos).collapse("hide");
        $("#analyticsDivHeading" + pos + " .analyticssDivCollapse img").attr("src", "/images/iconos/Down_01.png");
        // Restaurar símbolo del polígono al cerrar
        if (currentSHAnalyticsLayer.graphics.length > pos) {
            var cLineDef = esri.Color.fromArray([255, 0, 0, 1.0]);
            var cFillDef = esri.Color.fromArray([255, 0, 0, 0.05]);
            var symbol = new esri.SimpleFillSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineDef, 2), cFillDef);
            currentSHAnalyticsLayer.graphics[pos].setSymbol(symbol);
        }
    } else {
        $("#analyticsDivBody" + pos).collapse("show");
        var dataJSON = Terraformer.ArcGIS.fromGeoJSON(currentSHAnalyticsData[pos].geometry);
        var _geometry = esri.webMercatorUtils.geographicToWebMercator(esri.jsonUtilsGeometry.fromJson(dataJSON));
        map.centerAndZoom(_geometry.getCentroid(), 15);
        $("#analyticsDivHeading" + pos + " .analyticssDivCollapse img").attr("src", "/images/iconos/Up_01.png");

        // Cambiar símbolo del polígono seleccionado a color destacado
        if (currentSHAnalyticsLayer.graphics.length > pos) {
            var cLineHighlight = esri.Color.fromArray([255, 255, 0, 1.0]); // Amarillo
            var cFillHighlight = esri.Color.fromArray([255, 255, 0, 0.2]); // Amarillo semi-transparente
            var symbolHighlight = new esri.SimpleFillSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineHighlight, 3), cFillHighlight);
            currentSHAnalyticsLayer.graphics[pos].setSymbol(symbolHighlight);
        }

        openSHAnalyticsMosaicWindow(currentSHAnalyticsData[pos], pos, "gallery");
    }
}

function clearSHAnalyticsWorkArea(options) {
    options = options || {};
    if (options.resetControls !== false) {
        $("#selectSHAnalyticsSubs").val("");
        $("#txtSHAnalyticsMunicipalitySearch").val("");
        $("#selectSHAnalyticsResults").html("");
    }
    currentSHAnalyticsData = [];
    currentSHAnalyticsAllData = [];
    currentSHAnalyticsNextUrl = null;
    currentSHAnalyticsTotalCount = null;
    currentSHAnalyticsMunicipalityStats = [];
    currentSHAnalyticsDepartmentStats = [];
    currentSHAnalyticsSelectedIndex = null;
    currentSHAnalyticsSelectedHexKey = null;
    resetSHAnalyticsDateFilter();
    renderSHAnalyticsMunicipalityTable();
    hideSHAnalyticsLegend();
    if (currentSHAnalyticsLayer) {
        currentSHAnalyticsLayer.setVisibility(false);
        currentSHAnalyticsLayer.clear();
    }
    if (currentSHAnalyticsHexLayer) {
        currentSHAnalyticsHexLayer.setVisibility(false);
        currentSHAnalyticsHexLayer.clear();
    }
    if (currentSHAnalyticsClickHandle) {
        currentSHAnalyticsClickHandle.remove();
        currentSHAnalyticsClickHandle = null;
    }
    if (currentSHAnalyticsHoverHandle) {
        currentSHAnalyticsHoverHandle.remove();
        currentSHAnalyticsHoverHandle = null;
    }
    if (currentSHAnalyticsHoverOutHandle) {
        currentSHAnalyticsHoverOutHandle.remove();
        currentSHAnalyticsHoverOutHandle = null;
    }
    if (currentSHAnalyticsPolygonClickHandle) {
        currentSHAnalyticsPolygonClickHandle.remove();
        currentSHAnalyticsPolygonClickHandle = null;
    }
    if (map && map.infoWindow) {
        map.infoWindow.hide();
    }
    if (currentSHAnalyticsBoundaryLayer) {
        currentSHAnalyticsBoundaryLayer.setVisibility(false);
        currentSHAnalyticsBoundaryLayer.clear();
    }
    currentSHAnalyticsBoundariesLoaded = false;
    currentSHAnalyticsBoundariesLoading = false;
    if (currentSHAnalyticsAdminLayer) {
        currentSHAnalyticsAdminLayer.setVisibility(false);
        currentSHAnalyticsAdminLayer.clear();
    }
    setSHAnalyticsBoundaryStatus("");
    if (currentSHAnalyticsBGLayer != null && map) {
        map.removeLayer(currentSHAnalyticsBGLayer);
        currentSHAnalyticsBGLayer = null;
    }
    clearBurnsMonthlyMosaicWindow();
}

function closeSHAnalytics() {
    $("#panelSHAnalytics").hide();
    clearSHAnalyticsWorkArea();
}

function gotoRasterMosaicCatalog() {
    currentScreen = "RasterMosaicCatalog";
    reporteUso("Abrir descarga imagenes mosaico");
    minAll();
    toggleMenu("small");
    $("#panelRasterMosaics").show();
    areaLayerRasterMosaics.setVisibility(true);
    fileLayerRasterMosaics.setVisibility(true);
    $("#rasterMosaicsCatalogResults").html("Los resultados del catálogo aparecerán aquí...");
    $("#rasterMosaicsCatalogLoader").hide();
}

function closeRasterMosaicsCatalog() {
    $("#panelRasterMosaics").hide();
}

function closeRasterMosaicCatalog() {
    $("#rasterMosaicCatalogDialog").hide();
}

function getRasterMosaicSourceGraphic() {
    var layers = [areaLayerRasterMosaics, fileLayerRasterMosaics, areaLayer3, fileLayer2, areaLayer4, fileLayer3, areaLayer];
    for (var i = 0; i < layers.length; i++) {
        if (layers[i] && layers[i].graphics && layers[i].graphics.length > 0) {
            return layers[i].graphics[0].geometry;
        }
    }
    return map && map.extent ? map.extent : null;
}

function normalizeRasterMosaicGeometry(geometry) {
    if (!geometry) return null;
    var mapGeometry = geometry;
    var geoGeometry = geometry;
    if (geometry.type == "extent") {
        mapGeometry = esri.Polygon.fromExtent(geometry);
        geoGeometry = mapGeometry;
    }
    if (geoGeometry.spatialReference && geoGeometry.spatialReference.wkid != 4326) {
        geoGeometry = esri.webMercatorUtils.webMercatorToGeographic(geoGeometry);
    }
    if (geoGeometry.type == "extent") {
        geoGeometry = esri.Polygon.fromExtent(geoGeometry);
    }
    if (!geoGeometry || !geoGeometry.rings || geoGeometry.rings.length == 0) return null;
    return {
        mapGeometry: mapGeometry,
        geoGeometry: geoGeometry,
        geoJson: { type: "Polygon", coordinates: geoGeometry.rings }
    };
}

function getRasterMosaicAoi() {
    var aoi = normalizeRasterMosaicGeometry(getRasterMosaicSourceGraphic());
    if (!aoi) {
        showLoading("No se encontr&oacute; una geometr&iacute;a AOI v&aacute;lida para consultar el cat&aacute;logo", null, "red", true);
    }
    rasterMosaicCurrentAoi = aoi;
    return aoi;
}

function getRasterMosaicYears() {
    return $("input[name='rasterMosaicYearPanel']:checked").map(function () {
        return this.value;
    }).get();
}

function getRasterMosaicOutputSize(aoi, outputType) {
    var defaultSize = outputType == "image/tiff" ? 1600 : 1024;
    var maxSize = outputType == "image/tiff" ? 2200 : 1400;
    var extent = aoi && aoi.mapGeometry && aoi.mapGeometry.getExtent ? aoi.mapGeometry.getExtent() : null;
    if (!extent || !isFinite(extent.getWidth()) || !isFinite(extent.getHeight()) || extent.getWidth() <= 0 || extent.getHeight() <= 0) {
        return { width: defaultSize, height: defaultSize };
    }
    var width = extent.getWidth();
    var height = extent.getHeight();
    var scale = Math.min(maxSize / Math.max(width, height), defaultSize / Math.min(width, height));
    var pixelWidth = Math.max(64, Math.min(maxSize, Math.round(width * scale)));
    var pixelHeight = Math.max(64, Math.min(maxSize, Math.round(height * scale)));
    return { width: pixelWidth, height: pixelHeight };
}

function waitRasterMosaic(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

function isRasterMosaicRetryableError(err) {
    var status = err && err.status ? err.status : 0;
    return status == 0 || status == 408 || status == 429 || status >= 500;
}

function rasterMosaicAjaxWithRetry(options, maxAttempts) {
    maxAttempts = maxAttempts || 3;
    var attempt = 0;
    function execute() {
        attempt += 1;
        return new Promise(function (resolve, reject) {
            $.ajax(options).done(resolve).fail(reject);
        }).catch(function (err) {
            if (attempt < maxAttempts && isRasterMosaicRetryableError(err)) {
                return waitRasterMosaic(300 * attempt).then(execute);
            }
            throw err;
        });
    }
    return execute();
}

function readRasterMosaicError(err) {
    if (!err) return Promise.resolve("");
    if (err.response && err.response instanceof Blob) {
        return err.response.text().catch(function () {
            return Promise.resolve(err.statusText || err.toString());
        });
    }
    if (err.responseText && typeof err.responseText === "string" && err.responseText !== "[object Blob]") {
        return Promise.resolve(err.responseText);
    }
    if (err.responseJSON) return Promise.resolve(JSON.stringify(err.responseJSON));
    if (err.response && typeof err.response.text === "function") {
        return err.response.text().catch(function () {
            return Promise.resolve(err.statusText || err.toString());
        });
    }
    return Promise.resolve(err.statusText || err.toString());
}

function searchRasterMosaicCatalog() {
    var selectedYears = getRasterMosaicYears();
    if (selectedYears.length == 0) {
        showLoading("Selecciona al menos un a&ntilde;o de imagen", null, "red", true);
        return;
    }
    var aoi = getRasterMosaicAoi();
    if (!aoi) return;

    $("#btnRasterMosaicsCatalog").attr("disabled", "disabled");
    $("#rasterMosaicsCatalogLoader").show();
    $("#rasterMosaicsCatalogResults").html("");

    var requests = selectedYears.map(function (year) {
        var catalogBody = {
            collections: [rasterMosaicByocCollection],
            datetime: year + "-01-01T00:00:00Z/" + year + "-12-31T23:59:59Z",
            intersects: aoi.geoJson,
            limit: 50
        };
        return rasterMosaicAjaxWithRetry({
            url: sentinelHubCatalogProxyUrl,
            data: JSON.stringify(catalogBody),
            type: "POST",
            headers: { "Content-Type": "application/json" },
            contentType: "application/json; charset=utf-8",
            processData: true
        }, 3);
    });

    Promise.allSettled(requests).then(function (responses) {
        var features = [];
        var failedRequests = 0;
        for (var i = 0; i < responses.length; i++) {
            if (responses[i].status == "fulfilled" && responses[i].value && responses[i].value.features) {
                features = features.concat(responses[i].value.features);
            } else {
                failedRequests += 1;
                console.error("[RASTER_MOSAIC] Error consultando catálogo", responses[i].reason);
            }
        }
        renderRasterMosaicCatalogResults(features);
        if (failedRequests > 0) {
            showLoading("Algunos años no pudieron consultarse. Se muestran los resultados disponibles.", null, "orange", true);
        }
    }).catch(function (err) {
        console.error("[RASTER_MOSAIC] Error consultando catálogo", err);
        $("#rasterMosaicsCatalogResults").html("No se pudo consultar el catálogo de imágenes mosaico.");
        showLoading("No se pudo consultar el catálogo de imágenes mosaico", null, "red", true);
    }).finally(function () {
        $("#btnRasterMosaicsCatalog").removeAttr("disabled");
        $("#rasterMosaicsCatalogLoader").hide();
    });
}

function renderRasterMosaicCatalogResults(features) {
    var unique = {};
    var results = [];
    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        var datetime = feature.properties && feature.properties.datetime ? feature.properties.datetime : "";
        var key = feature.id + "|" + datetime;
        if (!unique[key]) {
            unique[key] = true;
            results.push(feature);
        }
    }
    results.sort(function (a, b) {
        var dateA = a.properties && a.properties.datetime ? a.properties.datetime : "";
        var dateB = b.properties && b.properties.datetime ? b.properties.datetime : "";
        return dateB.localeCompare(dateA);
    });
    if (results.length == 0) {
        $("#rasterMosaicsCatalogResults").html("No se encontraron resultados.");
        return;
    }
    var html = "";
    for (var j = 0; j < results.length; j++) {
        var result = results[j];
        var date = result.properties && result.properties.datetime ? result.properties.datetime.split("T")[0] : "Sin fecha";
        var geometryAttr = encodeURIComponent(JSON.stringify(result.geometry || null));
        var imageKey = getRasterMosaicImageKey(result.id, date);
        var footprintKey = getRasterMosaicFootprintKey(geometryAttr, date);
        var imageActiveClass = activeRasterMosaicImages[imageKey] ? " active" : "";
        var footprintActiveClass = activeRasterMosaicFootprints[footprintKey] ? " active" : "";
        html += "<div class='raster-mosaic-result'>";
        html += "<div class='raster-mosaic-result-date'>" + date + "</div>";
        html += "<div class='raster-mosaic-result-actions'>";
        html += "<button type='button' class='btn btn-xs raster-mosaic-action-btn' title='Descargar imagen' data-id='" + result.id + "' data-date='" + date + "' onclick='downloadRasterMosaicImage(this);'><span class='glyphicon glyphicon-download-alt' aria-hidden='true'></span></button>";
        html += "<button type='button' class='btn btn-xs raster-mosaic-action-btn raster-mosaic-footprint-btn" + footprintActiveClass + "' title='Mostrar footprint' data-geometry='" + geometryAttr + "' data-date='" + date + "' onclick='showRasterMosaicFootprint(this);'><span class='glyphicon glyphicon-unchecked' aria-hidden='true'></span></button>";
        html += "<button type='button' class='btn btn-xs raster-mosaic-action-btn raster-mosaic-image-btn" + imageActiveClass + "' title='Visualizar imagen' data-id='" + result.id + "' data-date='" + date + "' onclick='viewRasterMosaicImage(this);'><span class='glyphicon glyphicon-eye-open' aria-hidden='true'></span></button>";
        html += "</div>";
        html += "</div>";
    }
    $("#rasterMosaicsCatalogResults").html(html);
}

function getRasterMosaicImageKey(itemId, imageDate) {
    return String(rasterMosaicCurrentIdx || "TrueColor") + "|" + String(itemId || "") + "|" + String(imageDate || "");
}

function getRasterMosaicFootprintKey(geometryText, imageDate) {
    return String(imageDate || "") + "|" + String(geometryText || "");
}

function setRasterMosaicButtonActive(button, active) {
    if (!button) return;
    $(button).toggleClass("active", !!active);
}

function removeRasterMosaicFootprint(key) {
    var entry = activeRasterMosaicFootprints[key];
    if (!entry) return;
    if (rasterMosaicFootprintLayer && entry.graphic) {
        rasterMosaicFootprintLayer.remove(entry.graphic);
        if (rasterMosaicFootprintLayer.graphics.length == 0) {
            rasterMosaicFootprintLayer.setVisibility(false);
        }
    }
    delete activeRasterMosaicFootprints[key];
}

function removeRasterMosaicImage(key) {
    var entry = activeRasterMosaicImages[key];
    if (!entry) return;
    if (entry.layer) {
        map.removeLayer(entry.layer);
    }
    if (entry.objectUrl) {
        URL.revokeObjectURL(entry.objectUrl);
    }
    delete activeRasterMosaicImages[key];
}

function clearRasterMosaicCatalogOverlays() {
    clearRasterMosaicImages();
    clearRasterMosaicFootprints();
}

function clearRasterMosaicWorkArea() {
    if (areaLayerRasterMosaics) {
        areaLayerRasterMosaics.clear();
    }
    if (fileLayerRasterMosaics) {
        fileLayerRasterMosaics.clear();
    }
    clearRasterMosaicCatalogOverlays();
}

function clearSHStatsWorkArea() {
    if (areaLayer3) {
        areaLayer3.clear();
    }
    if (fileLayer2) {
        fileLayer2.clear();
    }
    if (currentSHLayer) {
        currentSHLayer.clear();
    }
    if (currentSHDataLayers && map) {
        map.removeLayer(currentSHDataLayers);
        currentSHDataLayers = null;
    }
    clearBurnsSentinelOverlay();
    clearBurnsMonthlyMosaicWindow();
    $("#divSHStats").hide();
    $("#btnSHDownloadStats").attr("disabled", "disabled");
}

function bindRasterMosaicCleanupTriggers() {
    $(document).on("click change", "#panelSearch a, #panelSearch button, #panelSearch select, #panelSearch input", function () {
        clearRasterMosaicWorkArea();
        clearSHStatsWorkArea();
        clearSHAnalyticsWorkArea();
    });
    $(document).on("click", ".tools .panel-tools", function () {
        clearSHAnalyticsWorkArea();
    });
}

function clearRasterMosaicImages() {
    for (var imageKey in activeRasterMosaicImages) {
        if (Object.prototype.hasOwnProperty.call(activeRasterMosaicImages, imageKey)) {
            removeRasterMosaicImage(imageKey);
        }
    }
    activeRasterMosaicImages = {};
    $(".raster-mosaic-image-btn.active").removeClass("active");
}

function clearRasterMosaicFootprints() {
    for (var footprintKey in activeRasterMosaicFootprints) {
        if (Object.prototype.hasOwnProperty.call(activeRasterMosaicFootprints, footprintKey)) {
            removeRasterMosaicFootprint(footprintKey);
        }
    }
    activeRasterMosaicFootprints = {};
    $(".raster-mosaic-footprint-btn.active").removeClass("active");
}

function showRasterMosaicFootprint(button) {
    if (!rasterMosaicFootprintLayer) {
        showLoading("No se pudo mostrar el footprint en el mapa", null, "red", true);
        return;
    }

    var geometryText = $(button).attr("data-geometry");
    var footprintKey = getRasterMosaicFootprintKey(geometryText, $(button).data("date"));
    if (activeRasterMosaicFootprints[footprintKey]) {
        removeRasterMosaicFootprint(footprintKey);
        setRasterMosaicButtonActive(button, false);
        return;
    }
    if (!geometryText) {
        showLoading("La imagen no tiene footprint disponible", null, "orange", true);
        return;
    }

    try {
        var geoJsonGeometry = JSON.parse(decodeURIComponent(geometryText));
        if (!geoJsonGeometry) {
            showLoading("La imagen no tiene footprint disponible", null, "orange", true);
            return;
        }

        var arcgisGeometry = Terraformer.ArcGIS.convert(new Terraformer.Primitive(geoJsonGeometry));
        var geometry = esri.jsonUtilsGeometry.fromJson(arcgisGeometry);
        if (geometry.setSpatialReference && esri.SpatialReference) {
            geometry.setSpatialReference(new esri.SpatialReference({ wkid: 4326 }));
        } else {
            geometry.spatialReference = { wkid: 4326 };
        }

        if (map && map.spatialReference && map.spatialReference.wkid !== 4326) {
            geometry = esri.webMercatorUtils.geographicToWebMercator(geometry);
        }

        var cLine = esri.Color.fromArray([255, 255, 255, 1.0]);
        var cFill = esri.Color.fromArray([40, 120, 210, 0.12]);
        var symbol = new esri.SimpleFillSymbol(
            esri.SimpleFillSymbol.STYLE_SOLID,
            new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLine, 2),
            cFill
        );
        var graphic = new esri.Graphic(geometry, symbol);
        graphic.attributes = { rasterMosaicKey: footprintKey };
        rasterMosaicFootprintLayer.setVisibility(true);
        rasterMosaicFootprintLayer.add(graphic);
        activeRasterMosaicFootprints[footprintKey] = { graphic: graphic };
        setRasterMosaicButtonActive(button, true);

        var extent = geometry.getExtent ? geometry.getExtent() : null;
        if (extent) {
            map.setExtent(extent.expand(1.2));
        }
        showLoading("Footprint " + ($(button).data("date") || "") + " agregado al mapa", "ok", "#6BD279", true);
    } catch (err) {
        console.error("[RASTER_MOSAIC] Error mostrando footprint", err);
        showLoading("No se pudo mostrar el footprint en el mapa", null, "red", true);
    }
}

function buildRasterMosaicProcessBody(itemId, imageDate, outputType) {
    var aoi = rasterMosaicCurrentAoi || getRasterMosaicAoi();
    if (!aoi) return null;
    
    // Get the evalscript based on the selected index
    var evalscript = rasterMosaicIdxScripts[rasterMosaicCurrentIdx];
    if (rasterMosaicCurrentIdx === rasterMosaicFullDatasetIdx && outputType == "image/tiff") {
        evalscript = rasterMosaicFullDatasetDownloadScript;
    }
    
    // Default to TrueColor if index not found
    if (!evalscript) {
        evalscript = rasterMosaicIdxScripts.TrueColor;
    }

    var outputSize = getRasterMosaicOutputSize(aoi, outputType);

    return {
        input: {
            bounds: {
                geometry: aoi.geoJson,
                properties: { crs: "http://www.opengis.net/def/crs/EPSG/0/4326" }
            },
            data: [{
                dataFilter: {
                    id: itemId,
                    timeRange: { from: imageDate + "T00:00:00Z", to: imageDate + "T23:59:59Z" },
                    mosaickingOrder: "mostRecent"
                },
                type: rasterMosaicByocCollection
            }]
        },
        output: {
            width: outputSize.width,
            height: outputSize.height,
            responses: [{ identifier: "default", format: { type: outputType } }]
        },
        evalscript: evalscript,
        implementation: "https://services-uswest2.sentinel-hub.com"
    };
}

function requestRasterMosaicImage(itemId, imageDate, outputType) {
    var body = buildRasterMosaicProcessBody(itemId, imageDate, outputType);
    if (!body) return Promise.reject("AOI inv&aacute;lido");

    return new Promise(function (resolve, reject) {
        var sendRequest = function (retryOnAuthError) {
            var processUrl = sentinelHubImageProxyUrl || sh_image_stats;
            var headers = { "Content-Type": "application/json" };

            if (!sentinelHubImageProxyUrl) {
                headers.Authorization = "Bearer " + currentSHToken;
            }

            var requestBody = sentinelHubImageProxyUrl ? body : JSON.parse(JSON.stringify(body));
            if (!sentinelHubImageProxyUrl) {
                delete requestBody.implementation;
            }

            fetch(processUrl, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(requestBody),
                mode: "cors"
            }).then(function (response) {
                if (!response.ok) {
                    return response.text().then(function (text) {
                        var err = new Error("HTTP " + response.status + " " + response.statusText);
                        err.status = response.status;
                        err.statusText = response.statusText;
                        err.responseText = text;
                        err.response = response;
                        throw err;
                    });
                }
                return response.blob();
            }).then(resolve).catch(function (err) {
                var isProxyError = sentinelHubImageProxyUrl && (!err.status || err.status === 0);
                var isProxyBadRequest = sentinelHubImageProxyUrl && err && err.status === 400;
                if (isProxyError || isProxyBadRequest) {
                    console.warn("[RASTER_MOSAIC] Error desde proxy local, reintentando con API directa", sentinelHubImageProxyUrl, err);
                    sentinelHubImageProxyUrl = null;
                    if (!currentSHToken) {
                        fetchSHToken(function (tokenOk) {
                            if (tokenOk) {
                                sendRequest(true);
                            } else {
                                reject(err);
                            }
                        });
                        return;
                    }
                    sendRequest(true);
                    return;
                }

                if (!sentinelHubImageProxyUrl && err && err.status === 401 && retryOnAuthError) {
                    fetchSHToken(function (tokenOk) {
                        if (tokenOk) {
                            sendRequest(false);
                        } else {
                            reject(err);
                        }
                    });
                    return;
                }

                reject(err);
            });
        };

        if (!sentinelHubImageProxyUrl && !currentSHToken) {
            fetchSHToken(function (tokenOk) {
                if (tokenOk) {
                    sendRequest(true);
                } else {
                    reject("No se pudo obtener token de Sentinel Hub");
                }
            });
        } else {
            sendRequest(false);
        }
    });
}

function downloadRasterMosaicImage(button) {
    var itemId = $(button).data("id");
    var imageDate = $(button).data("date");
    if (!itemId) {
        showLoading("No se encontr&oacute; el identificador de la imagen", null, "red", true);
        return;
    }
    $(button).attr("disabled", "disabled");
    requestRasterMosaicImage(itemId, imageDate, "image/tiff").then(function (blob) {
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        link.download = rasterMosaicCurrentIdx === rasterMosaicFullDatasetIdx
            ? "dataset_mosaico_8_bandas_" + imageDate + ".tif"
            : "imagen_mosaico_" + imageDate + ".tif";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }).catch(function (err) {
        console.error("[RASTER_MOSAIC] Error descargando imagen", err);
        readRasterMosaicError(err).then(function (detail) {
            if (detail) console.error("[RASTER_MOSAIC] Detalle descarga", detail);
        });
        showLoading("No se pudo descargar la imagen mosaico", null, "red", true);
    }).finally(function () {
        $(button).removeAttr("disabled");
    });
}

function viewRasterMosaicImage(button) {
    var itemId = $(button).data("id");
    var imageDate = $(button).data("date");
    var imageKey = getRasterMosaicImageKey(itemId, imageDate);
    if (!itemId) {
        showLoading("No se encontr&oacute; el identificador de la imagen", null, "red", true);
        return;
    }
    if (activeRasterMosaicImages[imageKey]) {
        removeRasterMosaicImage(imageKey);
        setRasterMosaicButtonActive(button, false);
        return;
    }
    $(button).attr("disabled", "disabled");
    showLoading("Cargando imagen mosaico " + imageDate + "...", null, null, true);
    requestRasterMosaicImage(itemId, imageDate, "image/png").then(function (blob) {
        addRasterMosaicLayer(blob, imageDate, imageKey, button);
    }).catch(function (err) {
        console.error("[RASTER_MOSAIC] Error visualizando imagen", err);
        readRasterMosaicError(err).then(function (detail) {
            if (detail) console.error("[RASTER_MOSAIC] Detalle visualización", detail);
        });
        showLoading("No se pudo visualizar la imagen mosaico", null, "red", true);
    }).finally(function () {
        $(button).removeAttr("disabled");
    });
}

function addRasterMosaicLayer(blob, imageDate, imageKey, button) {
    var aoi = rasterMosaicCurrentAoi || getRasterMosaicAoi();
    if (!aoi || !aoi.mapGeometry || !aoi.mapGeometry.getExtent) {
        console.error("[RASTER_MOSAIC] AOI inválida para agregar la capa");
        showLoading("No se pudo agregar la imagen mosaico al mapa: AOI inválido", null, "red", true);
        return;
    }
    var objectUrl = URL.createObjectURL(blob);
    console.log("[RASTER_MOSAIC] Blob recibido", {
        type: blob.type,
        size: blob.size,
        objectUrl: objectUrl,
        extent: aoi.mapGeometry.getExtent()
    });
    var testImage = new Image();
    testImage.onload = function () {
        console.log("[RASTER_MOSAIC] El objeto URL del mosaico se cargó correctamente como imagen", this.width, this.height);
    };
    testImage.onerror = function (err) {
        console.error("[RASTER_MOSAIC] No se pudo cargar el objeto URL del mosaico como imagen", err, objectUrl);
    };
    testImage.src = objectUrl;
    var layer = new esri.MapImageLayer({ id: "RasterMosaicPlanetLayer_" + imageKey.replace(/[^a-zA-Z0-9_]/g, "_"), opacity: 0.95 });
    layer.addImage(new esri.MapImage({
        extent: aoi.mapGeometry.getExtent(),
        href: objectUrl
    }));
    activeRasterMosaicImages[imageKey] = { layer: layer, objectUrl: objectUrl };
    map.addLayer(layer);
    setRasterMosaicButtonActive(button, true);
    if (typeof map.reorderLayer === "function") {
        try {
            map.reorderLayer(layer, map.layerIds.length - 1);
        } catch (e) {
            console.warn("[RASTER_MOSAIC] No se pudo reordenar la capa", e);
        }
    }
    map.setExtent(aoi.mapGeometry.getExtent().expand(1.2));
    if (layer.on && typeof layer.on === "function") {
        layer.on("load", function () {
            showLoading("Imagen mosaico " + imageDate + " agregada al mapa", "ok", "#6BD279", true);
        });
        layer.on("error", function (err) {
            console.error("[RASTER_MOSAIC] Error cargando capa de mosaico", err);
            removeRasterMosaicImage(imageKey);
            setRasterMosaicButtonActive(button, false);
            showLoading("Error cargando la imagen mosaico en el mapa", null, "red", true);
        });
    } else {
        showLoading("Imagen mosaico " + imageDate + " agregada al mapa", "ok", "#6BD279", true);
    }
}

function updateRaster() {
    if ($("#selectLayersRaster1").val() == null || $("#selectLayersRaster1").val() == "") {
        if (currentRaster != null) {
            map.removeLayer(currentRaster);
            currentRaster = null;
        }
        $("#layerRasterContainer").hide();
        return;
    }
    if (currentRaster != null) {
        map.removeLayer(currentRaster);
        currentRaster = null;
    }
    $("#layerRasterOutputR").empty(null);
    $("#layerRasterOutputG").empty(null);
    $("#layerRasterOutputB").empty(null);
    $("#layersRasterDiv").html();
    $("#layerRasterEnlacesContainer").html();
    $("#selectLayersRasterRender").empty();
    var t = new esri.ImageServiceParameters();
    t.bandIds = [5, 3, 1, 0, 2, 4, 6, 7];
    var rfInput = new esri.RasterFunction();
    rfInput.functionName = "ExtractBand";
    rfInput.functionArguments = {
        BandNames: ["B6 (Red)", "B4 (Green)", "B2 (Blue)"],
    };
    t.renderingRule = rfInput;
    currentRaster = new esri.RasterLayer($("#selectLayersRaster1").val(), {
        format: "jpgpng",
        imageServiceParameters: t,
    });
    currentRaster.on("load", function () {
        showLoading("¡Listo! La capa fue agregada al mapa.", "ok", "#6BD279", true);
        var p1 = proj4(sistemasCoordenadas["EPSG:9377"].proj, sistemasCoordenadas["EPSG:4326"].proj, new esri.Point({ x: currentRaster.extent.xmin, y: currentRaster.extent.ymin }));
        var p2 = proj4(sistemasCoordenadas["EPSG:9377"].proj, sistemasCoordenadas["EPSG:4326"].proj, new esri.Point({ x: currentRaster.extent.xmax, y: currentRaster.extent.ymax }));
        map.setExtent(new esri.Extent(new esri.Extent({ xmin: p1.x, ymin: p1.y, xmax: p2.x, ymax: p2.y })));
        $("#layerRasterInputTxt").html(currentRaster.bandNames.join(", "));
        for (var i = 0; i < currentRaster.bandNames.length; i++) {
            $("#layerRasterOutputR,#layerRasterOutputG,#layerRasterOutputB").append("<option value='" + currentRaster.bandNames[i] + "'>" + currentRaster.bandNames[i] + "</option>");
        }
        $("#layerRasterOutputR").val(currentRaster.bandNames[5]).trigger("change.select2");
        $("#layerRasterOutputG").val(currentRaster.bandNames[3]).trigger("change.select2");
        $("#layerRasterOutputB").val(currentRaster.bandNames[1]).trigger("change.select2");
        $("#layerRasterStretch").val(0).trigger("change.select2");
        $("#layerRasterEnlacesContainer").html("<li><a href='" + currentRaster.url.replace("rest/", "") + "/WMSServer?request=GetCapabilities&service=WMS' target='_blank'>Servicio (WMS)</a></li><li><a href='" + currentRaster.url.replace("rest/", "") + "/WCSServer?request=GetCapabilities&service=WCS' target='_blank'>Servicio (WCS)</a></li><li><a href='" + currentRaster.url + "' target='_blank'>Servicio (REST)</a></li></ul>");
        $("#layerRasterContainer").show();
        //setTimeout(updateRasterFunctions, 5000);
    });
    map.addLayer(currentRaster);
}

function getRasterFunction() {
    var rfInput = new esri.RasterFunction();
    rfInput.functionName = "ExtractBand";
    rfInput.functionArguments = {
        BandNames: [$("#layerRasterOutputR").val(), $("#layerRasterOutputG").val(), $("#layerRasterOutputB").val()],
    };

    var rfOutput = new esri.RasterFunction();
    rfOutput.functionName = "Stretch";
    if ($("#layerRasterStretch").val() == 0) {
        rfOutput.functionArguments = {
            StretchType: $("#layerRasterStretch").val(),
            Raster: rfInput,
        };
    }
    if ($("#layerRasterStretch").val() == 3) {
        rfOutput.functionArguments = {
            StretchType: $("#layerRasterStretch").val(),
            NumberOfStandardDeviations: parseFloat(rasterParamsDesvPercentage.val()),
            Min: 100,
            Max: 255,
            DRA: true,
            UseGamma: true,
            Gamma: [parseFloat(rasterParamsGammaPercentage.val())],
            Raster: rfInput,
        };
    }
    if ($("#layerRasterStretch").val() == 5) {
        rfOutput.functionArguments = {
            StretchType: $("#layerRasterStretch").val(),
            NumberOfStandardDeviations: parseFloat(rasterParamsDesvPercentage.val()),
            Min: 100,
            Max: 255,
            DRA: true,
            UseGamma: false,
            Raster: rfInput,
        };
    }
    if ($("#layerRasterStretch").val() == 6) {
        rfOutput.functionArguments = {
            StretchType: $("#layerRasterStretch").val(),
            MinPercent: parseFloat(rasterParamsPercentage1.val()),
            MaxPercent: parseFloat(rasterParamsPercentage2.val()),
            Min: 100,
            Max: 255,
            DRA: true,
            Gamma: [parseFloat(rasterParamsGammaPercentage.val())],
            UseGamma: false,
            Raster: rfInput,
        };
    }
    if ($("#layerRasterStretch").val() == 4) {
        rfOutput.functionArguments = {
            StretchType: $("#layerRasterStretch").val(),
            Raster: rfInput,
        };
    }
    if ($("#layerRasterStretch").val() == 9) {
        rfOutput.functionArguments = {
            StretchType: $("#layerRasterStretch").val(),
            SigmoidStrengthLevel: 1,
            Raster: rfInput,
        };
    }
    console.log(JSON.stringify(rfOutput.toJson()));
    return rfOutput;
}

function updateRasterFunctions() {
    currentRaster.setRenderingRule(getRasterFunction());
}

function updateRasterZoom() {
    var p1 = proj4(sistemasCoordenadas["EPSG:9377"].proj, sistemasCoordenadas["EPSG:4326"].proj, new esri.Point({ x: currentRaster.extent.xmin, y: currentRaster.extent.ymin }));
    var p2 = proj4(sistemasCoordenadas["EPSG:9377"].proj, sistemasCoordenadas["EPSG:4326"].proj, new esri.Point({ x: currentRaster.extent.xmax, y: currentRaster.extent.ymax }));
    map.setExtent(new esri.Extent(new esri.Extent({ xmin: p1.x, ymin: p1.y, xmax: p2.x, ymax: p2.y })));
}

function hideAllSearch() {
    $("#mainDiv").animate({ scrollTop: 0 });
    $(".panelSearchFiltro").hide();
    $("#panelSearchNivelImagenes").hide();
    $("#panelSearchImagenDetalle").hide();

    if (searchImageSwipeDetalle != null) {
        searchImageSwipeDetalle.disable();
    }
}

function gotoImagenDetalle(id) {
    hideAllSearch();
    searchGraphicsLayer.setVisibility(false);
    searchImageLayer.setVisibility(false);
    searchGraphicsLayerDetalle.setVisibility(true);
    searchImageLayerDetalle.setVisibility(true);
    map.reorderLayer(searchImageLayerDetalle, map.layerIds.length);
    map.reorderLayer(searchGraphicsLayerDetalle, map.layerIds.length);
    /*searchImageLayerDetalle.removeAllImages();*/
    searchImageLayerDetalle.setOpacity(1);
    searchGraphicsLayerDetalle.clear();
    $("#panelSearchImagenDetalle").show();
    $("#panelSearchFiltroImagenes").show();
    $("#detalleImagenAlerta").hide();
    $("#detalleImagen").html("");
    $("#detalleImagenTitle").html("");
    $("#detalleImagenThumb").hide();
    $("#detalleImagenDescarga").hide();

    var dataRow;
    if (currentMode == "media") {
        dataRow = tableSearchBni.data();
        $("#detalleImagenDescarga").hide();
    }
    if (currentMode == "alta") {
        $("#detalleImagenAlerta").show();
        dataRow = tableSearchBni2.data();
        if (cachePermisos.indexOf("IMAGENES_ALTA") != -1) {
            $("#detalleImagenDescarga").show();
        } else {
            $("#detalleImagenDescarga").show();
        }
    }
    for (var i = 0; i < dataRow.length; i++) {
        if (dataRow[i].ID_IMAGEN == id) {
            currentImagen = dataRow[i];
            updateImagenDetalle();
        }
    }
}

function updateImagenDetalle() {
    reporteUso("Detalle imagen", { imagen: currentImagen.ID_IMAGEN });

    if (currentMode == "media") {
        $("#detalleImagenTitle").html("Identificación: " + currentImagen.IMAGEN_ID);
    }
    if (currentMode == "alta") {
        $("#detalleImagenTitle").html("Identificación:<br/>" + currentImagen.IMAGEN_ID);
    }
    $("#detalleImagenTitle").css("padding-bottom", "20px");
    var img = new Image();
    img.onload = function () {
        $("#detalleImagenTitle").css("padding-bottom", "0px");
        $("#detalleImagenThumb").css("background-image", "url('" + this.src + "')");
        $("#detalleImagenThumb").show();
    };
    if (currentMode == "media") {
        img.src = web_service + "/imagenes2?cmd=thumbnail&ID_IMAGEN=" + currentImagen.IMAGEN_ID + "&token=" + currentAccessToken;
    }
    if (currentMode == "alta") {
        img.src = web_service + "/imagenes3?cmd=thumbnail&ID_IMAGEN=" + currentImagen.ID_IMAGEN + "&token=" + currentAccessToken;
    }

    var strHTML = "<table style='width: 100%;' class='table table-striped'>";

    if (currentImagen.FECHA != null && currentImagen.FECHA != "") {
        strHTML = strHTML + "<tr><td><label><b>Fecha de captura:&nbsp;</b></label></td><td>" + esri.moment(currentImagen.FECHA).format("DD/MM/YYYY") + "</td></tr>";
    }

    var dataJSON = JSON.parse(currentImagen.DATA);
    for (var prop in dataJSON) {
        if (dataJSON.hasOwnProperty(prop)) {
            if (currentMode == "media") {
                var p = getPropertyById(prop);
                if (p != null) {
                    if (p.visible == "TRUE") {
                        strHTML = strHTML + "<tr><td><label aria-hidden='true' data-container='body' data-toggle='popover' data-placement='bottom' data-content=\"<p style='font-size: x-small;'>" + p.tooltip + "</p>\" data-html='true' data-trigger='hover' data-original-title='' title=''><b>" + p.label + ":&nbsp;</b></label></td><td>" + dataJSON[prop] + "</td></tr>";
                    }
                }
            }
            if (currentMode == "alta") {
                var p = getPropertyByIdAlta(prop);
                if (p != null) {
                    if (p.visible == "TRUE") {
                        strHTML = strHTML + "<tr><td><label><b>" + p.label + ":&nbsp;</b></label></td><td>" + dataJSON[prop] + "</td></tr>";
                    }
                }
            }
        }
    }
    if (currentMode == "alta") {
        if (dataJSON.Consulta != null) {
            try {
                var tempStr = [];
                for (var i = 0; i < dataJSON.Consulta.length; i++) {
                    if (dataJSON.Consulta[i].length == 2) {
                        tempStr.push(getUnidadById(dataJSON.Consulta[i]).text);
                    }
                }
                if (tempStr.length > 0) {
                    strHTML = strHTML + "<tr><td><label><b>Departamentos:&nbsp;</b></label></td><td>" + tempStr.join(", ") + "</td></tr>";
                }
                tempStr = [];
                for (var i = 0; i < dataJSON.Consulta.length; i++) {
                    if (dataJSON.Consulta[i].length == 5) {
                        tempStr.push(getUnidadById(dataJSON.Consulta[i]).text);
                    }
                }
                if (tempStr.length > 0) {
                    strHTML = strHTML + "<tr><td><label><b>Municipios:&nbsp;</b></label></td><td>" + tempStr.join(", ") + "</td></tr>";
                }
            } catch (err) {}
        }
    }

    strHTML = strHTML + "</table>";
    $("#detalleImagen").html(strHTML);
    $("[data-toggle='popover']").popover();
    if (currentImagen.SHAPE != null) {
        var feature = Terraformer.ArcGIS.convert(new Terraformer.Primitive(JSON.parse(currentImagen.SHAPE)));
        var g = new esri.Graphic(esri.jsonUtilsGeometry.fromJson(feature));
        g.setSymbol(searchImagenSymbol);
        g.setAttributes({ ID_IMAGEN: currentImagen.ID_IMAGEN });
        searchGraphicsLayerDetalle.add(g);
        centrarImagen();

        if (currentMode == "media") {
            if (previewLayer != null) {
                map.removeLayer(previewLayer);
            }
            previewLayer = new esri.WebTiledLayer(web_service + "/imagenes2?cmd=tile_img&ID=" + currentImagen.IMAGEN_ID + "&Z=${level}&X=${col}&Y=${row}&token=" + currentAccessToken);
            map.addLayer(previewLayer);
        }
        if (currentMode == "alta") {
            /*
            var mi;
            mi = new esri.MapImage({
                extent: esri.jsonUtilsGeometry.fromJson(feature).getExtent(),
                href: web_service + "/imagenes3?cmd=thumbnail&ID_IMAGEN=" + currentImagen.ID_IMAGEN + "&token=" + currentAccessToken
            });
            searchImageLayerDetalle.addImage(mi);
            */
            for (var i = 0; i < configAlta.length; i++) {
                try {
                    if (JSON.parse(currentImagen.DATA).ConsultaFinal[0] == configAlta[i].codigo) {
                        searchImageLayerDetalle._url.path = configAlta[i].url;
                        var mosaicRule = new esri.MosaicRule();
                        mosaicRule.where = "name = '" + currentImagen.IMAGEN_ID + "'";
                        searchImageLayerDetalle.setMosaicRule(mosaicRule);
                        searchImageLayerDetalle.refresh();
                    }
                } catch (err) {}
            }
        }
    }
}

function toggleImagenDetalleSwipe() {
    if (searchImageSwipeDetalle.enabled) {
        searchImageSwipeDetalle.disable();
    } else {
        searchImageSwipeDetalle.enable();
        if (currentMode == "media") {
            searchImageSwipeDetalle.layers = [previewLayer];
        }
        if (currentMode == "alta") {
            searchImageSwipeDetalle.layers = [searchImageLayerDetalle];
        }
    }
}

function backImagenDetalle() {
    currentImagen = null;
    if (previewLayer != null) {
        map.removeLayer(previewLayer);
    }
    hideAllSearch();
    searchGraphicsLayer.setVisibility(true);
    searchImageLayer.setVisibility(true);
    searchGraphicsLayerDetalle.setVisibility(false);
    searchImageLayerDetalle.setVisibility(false);
    map.reorderLayer(searchImageLayer, map.layerIds.length);
    map.reorderLayer(searchGraphicsLayer, map.layerIds.length);
    centrarImagenes();
    $("#panelSearchNivelImagenes").show();
    $("#panelSearchFiltroImagenes").show();
}

function updateImagenes() {
    if (tableSearchBni == null) {
        tableSearchBni = $("#tableSearchBni").DataTable({
            dom: '<"bottom"p<"clear">><"#searchImagenesList"><"top"<"clear">>rt<"bottom"pil<"clear">>',
            lengthMenu: [
                [10, 25, 50, 100, 250],
                ["Mostrar 10 registros", "Mostrar 20 registros", "Mostrar 50 registros", "Mostrar 100 registros", "Mostrar 250 registros"],
            ],
            language: spanishDataTable,
            order: [[1, "desc"]],
            pageLength: 10,
            processing: false,
            serverSide: true,
            ajax: {
                url: web_service + "/imagenes2",
                deferLoading: 0,
                type: "POST",
                data: function (d) {
                    d.cmd = "query";
                    if (modoSearch == "entidad") {
                        if ($("#searchFiltro").select2("data")[0].type == "DEPTO" || $("#searchFiltro").select2("data")[0].type == "MUNI") {
                            d.codigo = $("#searchFiltro").val();
                        }
                    }
                    if (modoSearch == "area") {
                        if (areaLayer.graphics.length > 0) {
                            var data = [];
                            for (var i = 0; i < areaLayer.graphics.length; i++) {
                                if (areaLayer.graphics[i].geometry.type == "extent") {
                                    data.push(Terraformer.ArcGIS.toGeoJSON(esri.Polygon.fromExtent(areaLayer.graphics[i].geometry)));
                                } else {
                                    data.push(Terraformer.ArcGIS.toGeoJSON(areaLayer.graphics[i].geometry));
                                }
                            }
                            d.area = btoa(JSON.stringify(data));
                        }
                    }
                    if (modoSearch == "geojson") {
                        if (fileLayer.graphics.length > 0) {
                            var data = [];
                            for (var i = 0; i < fileLayer.graphics.length; i++) {
                                data.push(Terraformer.ArcGIS.toGeoJSON(fileLayer.graphics[i].geometry));
                            }
                            d.area = btoa(JSON.stringify(data));
                        }
                    }
                    var searchCloudValue2 = getSliderValueSafe(slider, "#searchImagenesCloud", 50);
                    if (searchCloudValue2 != null && searchCloudValue2 != "50") {
                        var cValue = parseInt(searchCloudValue2) / 100.0;
                        d.cloud = cValue;
                    }
                    if ($("#searchFiltro").select2("data")[0].type == "PAIS") {
                    }
                    if ($("#searchImagenesFechaInicial").val() != null) {
                        d.fechaInicial = $("#searchImagenesFechaInicial").val();
                    }
                    if ($("#searchImagenesFechaFinal").val() != null) {
                        d.fechaFinal = $("#searchImagenesFechaFinal").val();
                    }
                    d.token = currentAccessToken;
                    loading = $.confirm({
                        title: "",
                        content: "<div style='text-align: center;'><img src='/images/ig124.gif' style='height: 200px;width: 200px;'></div>",
                        buttons: {},
                        closeIcon: true,
                        lazyOpen: true,
                        onContentReady: function () {},
                        onOpenBefore: function () {
                            loading.buttons.ok.hide();
                            loading.buttons.close.hide();
                            //loading.showLoading();
                        },
                    });
                    loading.open();
                },
                dataSrc: function (dataRow) {
                    loading.close();
                    if (dataRow.COVERAGE != null) {
                        coberturaRow = dataRow.COVERAGE;
                    } else {
                        coberturaRow = null;
                    }
                    return dataRow.imagenes;
                },
            },
            fnInitComplete: function () {},
            drawCallback: function (settings) {
                var api = this.api();
                $("#searchImagenesList").html("");
                $("#searchImagenesCount").html("<i>" + api.page.info().recordsTotal + " resultados</i>");
                if (api.page.info().recordsTotal > 0) {
                    $("#searchImagenesTitle").html("Im&aacute;genes&nbsp<span class='titulo-interior2'>(" + api.page.info().recordsTotal + ")</span>");
                } else {
                    $("#searchImagenesTitle").html("Im&aacute;genes");
                }
                var dataRow = api.rows({ page: "current" }).data();
                var timeD = new Date().getTime();
                searchGraphicsLayer.clear();
                searchImageLayer.removeAllImages();

                for (var i = 0; i < dataRow.length; i++) {
                    var strHTML = "";
                    strHTML = strHTML + "<div class='media media-resultados2' data-id='" + dataRow[i].ID_IMAGEN + "' onclick='gotoImagenDetalle(" + dataRow[i].ID_IMAGEN + ");return false;' >";
                    strHTML = strHTML + "<div class='media-right panel-resultados-media-left'>";
                    var imgURL = web_service + "/imagenes2?cmd=thumbnail&ID_IMAGEN=" + dataRow[i].IMAGEN_ID + "&token=" + currentAccessToken;
                    //if (tableSearchBni.page.len() <= 50) {
                    strHTML = strHTML + "<div class='panel-resultados-media-thumb' style=\"background-image: url('" + imgURL + "'), url('/images/no-disponible.png')\" ></div>";
                    //}
                    strHTML = strHTML + "</div>";
                    strHTML = strHTML + "<div class='media-body'>";
                    strHTML = strHTML + "<div class='panel panel-default panel-resultados2'>";
                    strHTML = strHTML + "<div class='panel-body'>";
                    strHTML = strHTML + "<div class='panel-resultados-titulo'>" + dataRow[i].IMAGEN_ID + "</div>";
                    strHTML = strHTML + "<div class='panel-resultados-descripcion'>";
                    if (dataRow[i].FECHA != null && dataRow[i].FECHA != "") {
                        strHTML = strHTML + "<span class='fecha-servicio'>" + esri.moment(dataRow[i].FECHA).format("DD-MM-YYYY") + "</span>";
                    }
                    strHTML = strHTML + "</div>";
                    strHTML = strHTML + "</div>";
                    strHTML = strHTML + "</div>";
                    strHTML = strHTML + "</div>";
                    strHTML = strHTML + "<div class='media-right panel-resultados-media-right'>";
                    strHTML = strHTML + "<div onclick='gotoImagenDetalle(" + dataRow[i].ID_IMAGEN + ");return false;' class='btn-resultados2'><img src='/images/iconos/Forward_01.svg' alt='Ver Detalle' style='width: 25px; height: 25px;' /></div>";
                    strHTML = strHTML + "</div>";
                    strHTML = strHTML + "</div>";
                    $("#searchImagenesList").append(strHTML);

                    if (dataRow[i].SHAPE != null) {
                        var feature = Terraformer.ArcGIS.convert(new Terraformer.Primitive(JSON.parse(dataRow[i].SHAPE)));
                        var g = new esri.Graphic(esri.jsonUtilsGeometry.fromJson(feature));
                        g.setSymbol(searchImagenSymbol);
                        g.setAttributes({ ID_IMAGEN: dataRow[i].ID_IMAGEN });
                        searchGraphicsLayer.add(g);
                        //if (tableSearchBni.page.len() <= 50) {
                        var mi = new esri.MapImage({
                            extent: esri.jsonUtilsGeometry.fromJson(feature).getExtent(),
                            href: web_service + "/imagenes2?cmd=thumbnail&ID_IMAGEN=" + dataRow[i].IMAGEN_ID + "&token=" + currentAccessToken,
                        });
                        searchImageLayer.addImage(mi);
                        //}
                    }
                }
                if (coberturaRow != null) {
                    var feature = Terraformer.ArcGIS.convert(new Terraformer.Primitive(JSON.parse(coberturaRow)));
                    var g = new esri.Graphic(esri.jsonUtilsGeometry.fromJson(feature));
                    g.setSymbol(searchCoberturaSymbol);
                    searchGraphicsLayer.add(g);
                }
                if (modoSearch == "entidad") {
                    centrarImagenes();
                }
                $("#searchImagenesList .media-resultados2")
                    .on("hover")
                    .hover(function () {
                        var id = $(this).attr("data-id");
                        for (var i = 0; i < searchGraphicsLayer.graphics.length; i++) {
                            try {
                                if (searchGraphicsLayer.graphics[i].attributes["ID_IMAGEN"] == parseInt(id)) {
                                    searchGraphicsLayer.graphics[i].setSymbol(searchImagenActiveSymbol);
                                } else {
                                    searchGraphicsLayer.graphics[i].setSymbol(searchImagenSymbol);
                                }
                            } catch (err) {}
                        }
                    });
                $("#tableSearchBniTable tr")
                    .on("hover")
                    .hover(
                        function () {
                            var data = tableSearchBni.row(this).data();
                            for (var i = 0; i < searchGraphicsLayer.graphics.length; i++) {
                                if (searchGraphicsLayer.graphics[i].attributes["ID_IMAGEN"] == data.ID_IMAGEN) {
                                    searchGraphicsLayer.graphics[i].setSymbol(searchImagenActiveSymbol);
                                } else {
                                    searchGraphicsLayer.graphics[i].setSymbol(searchImagenSymbol);
                                }
                            }
                        },
                        function () {},
                    );
                var PageInfo = tableSearchBni.page.info();
                tableSearchBni
                    .column(0, { page: "current" })
                    .nodes()
                    .each(function (cell, i) {
                        cell.innerHTML = i + 1 + PageInfo.start;
                    });
            },
            columns: [
                {
                    orderable: false,
                    data: "ID_IMAGEN",
                    render: function (data, type, row, meta) {
                        return row.ID_IMAGEN;
                    },
                },
                {
                    data: "ID_IMAGEN",
                    orderable: false,
                    render: function (data, type, row, meta) {
                        return esri.moment(row.FECHA).format("DD/MM/YYYY");
                    },
                },
                {
                    orderable: false,
                    data: "ID_IMAGEN",
                    render: function (data, type, row, meta) {
                        return row.IMAGEN_ID;
                    },
                },
                {
                    data: "ID_IMAGEN",
                    orderable: false,
                    render: function (data, type, row, meta) {
                        return "<div class='btn-resultados3'><img src='/images/iconos/Forward_01.svg' alt='Ver Detalle' style='width: 25px; height: 25px;'></div>";
                    },
                },
            ],
        });
        $("#tableSearchBni tbody").on("click", "tr", function () {
            var data = tableSearchBni.row(this).data();
            gotoImagenDetalle(data.ID_IMAGEN);
        });
    } else {
        tableSearchBni.ajax.reload();
    }
}

function updateImagenes2() {
    if (tableSearchBni2 == null) {
        tableSearchBni2 = $("#tableSearchBni2").DataTable({
            dom: '<"bottom"p<"clear">><"#searchImagenesList2"><"top"<"clear">>rt<"bottom"pil<"clear">>',
            lengthMenu: [
                [10, 25, 50, 100, 250],
                ["Mostrar 10 registros", "Mostrar 20 registros", "Mostrar 50 registros", "Mostrar 100 registros", "Mostrar 250 registros"],
            ],
            language: spanishDataTable,
            order: [[1, "desc"]],
            pageLength: 10,
            processing: false,
            serverSide: true,
            scrollX: true,
            ajax: {
                url: web_service + "/imagenes3",
                deferLoading: 0,
                type: "POST",
                data: function (d) {
                    d.cmd = "query";
                    if (modoSearch == "entidad") {
                        if ($("#searchFiltro").select2("data")[0].type == "DEPTO" || $("#searchFiltro").select2("data")[0].type == "MUNI") {
                            d.codigo = $("#searchFiltro").val();
                        }
                    }
                    if (modoSearch == "area") {
                        if (areaLayer.graphics.length > 0) {
                            var data = [];
                            for (var i = 0; i < areaLayer.graphics.length; i++) {
                                if (areaLayer.graphics[i].geometry.type == "extent") {
                                    data.push(Terraformer.ArcGIS.toGeoJSON(esri.Polygon.fromExtent(areaLayer.graphics[i].geometry)));
                                } else {
                                    data.push(Terraformer.ArcGIS.toGeoJSON(areaLayer.graphics[i].geometry));
                                }
                            }
                            d.area = btoa(JSON.stringify(data));
                        }
                    }
                    if (modoSearch == "geojson") {
                        if (fileLayer.graphics.length > 0) {
                            var data = [];
                            for (var i = 0; i < fileLayer.graphics.length; i++) {
                                data.push(Terraformer.ArcGIS.toGeoJSON(fileLayer.graphics[i].geometry));
                            }
                            d.area = btoa(JSON.stringify(data));
                        }
                    }
                    var searchCloudValue = getSliderValueSafe(slider, "#searchImagenesCloud", 50);
                    if (searchCloudValue != null && searchCloudValue != "50") {
                        var cValue = parseInt(searchCloudValue) / 100.0;
                        d.cloud = cValue;
                    }
                    if ($("#searchFiltro").select2("data")[0].type == "PAIS") {
                    }
                    d.token = currentAccessToken;
                    loading = $.confirm({
                        title: "",
                        content: "<div style='text-align: center;'><img src='/images/ig124.gif' style='height: 200px;width: 200px;'></div>",
                        buttons: {},
                        closeIcon: true,
                        lazyOpen: true,
                        onContentReady: function () {},
                        onOpenBefore: function () {
                            loading.buttons.ok.hide();
                            loading.buttons.close.hide();
                            //loading.showLoading();
                        },
                    });
                    loading.open();
                },
                dataSrc: function (dataRow) {
                    loading.close();
                    if (dataRow.COVERAGE != null) {
                        coberturaRow = dataRow.COVERAGE;
                    } else {
                        coberturaRow = null;
                    }
                    return dataRow.imagenes;
                },
            },
            fnInitComplete: function () {},
            drawCallback: function (settings) {
                var api = this.api();
                $("#searchImagenesList2").html("");
                $("#searchImagenesCount2").html("<i>" + api.page.info().recordsTotal + " resultados</i>");
                var dataRow = api.rows({ page: "current" }).data();
                var timeD = new Date().getTime();
                searchGraphicsLayer.clear();
                searchImageLayer.removeAllImages();

                for (var i = 0; i < dataRow.length; i++) {
                    var strHTML = "";
                    strHTML = strHTML + "<div class='media media-resultados2' data-id='" + dataRow[i].ID_IMAGEN + "' onclick='gotoImagenDetalle(" + dataRow[i].ID_IMAGEN + ");return false;' >";
                    strHTML = strHTML + "<div class='media-right panel-resultados-media-left'>";
                    var imgURL = web_service + "/imagenes3?cmd=thumbnail&ID_IMAGEN=" + dataRow[i].ID_IMAGEN + "&token=" + currentAccessToken;
                    //if (tableSearchBni.page.len() <= 50) {
                    strHTML = strHTML + "<div class='panel-resultados-media-thumb' style=\"background-image: url('" + imgURL + "'), url('/images/no-disponible.png')\" ></div>";
                    //}
                    strHTML = strHTML + "</div>";
                    strHTML = strHTML + "<div class='media-body'>";
                    strHTML = strHTML + "<div class='panel panel-default panel-resultados2'>";
                    strHTML = strHTML + "<div class='panel-body'>";
                    strHTML = strHTML + "<div class='panel-resultados-titulo'>" + dataRow[i].IMAGEN_ID + "</div>";
                    strHTML = strHTML + "<div class='panel-resultados-descripcion'>";
                    if (dataRow[i].FECHA != null && dataRow[i].FECHA != "") {
                        strHTML = strHTML + "<span class='fecha-servicio'>" + esri.moment(dataRow[i].FECHA).format("DD-MM-YYYY") + "</span>";
                    }
                    strHTML = strHTML + "</div>";
                    strHTML = strHTML + "</div>";
                    strHTML = strHTML + "</div>";
                    strHTML = strHTML + "</div>";
                    strHTML = strHTML + "<div class='media-right panel-resultados-media-right'>";
                    strHTML = strHTML + "<div onclick='gotoImagenDetalle(" + dataRow[i].ID_IMAGEN + ");return false;' class='btn-resultados2'><img src='/images/iconos/Forward_01.svg' alt='Ver Detalle' style='width: 25px; height: 25px;' /></div>";
                    strHTML = strHTML + "</div>";
                    strHTML = strHTML + "</div>";
                    $("#searchImagenesList2").append(strHTML);

                    if (dataRow[i].SHAPE != null) {
                        var feature = Terraformer.ArcGIS.convert(new Terraformer.Primitive(JSON.parse(dataRow[i].SHAPE)));
                        var g = new esri.Graphic(esri.jsonUtilsGeometry.fromJson(feature));
                        g.setSymbol(searchImagenSymbol);
                        g.setAttributes({ ID_IMAGEN: dataRow[i].ID_IMAGEN });
                        searchGraphicsLayer.add(g);
                        //if (tableSearchBni.page.len() <= 50) {
                        var mi = new esri.MapImage({
                            extent: esri.jsonUtilsGeometry.fromJson(feature).getExtent(),
                            href: web_service + "/imagenes3?cmd=thumbnail&ID_IMAGEN=" + dataRow[i].ID_IMAGEN + "&token=" + currentAccessToken,
                        });
                        searchImageLayer.addImage(mi);
                        //}
                    }
                }
                if (coberturaRow != null) {
                    var feature = Terraformer.ArcGIS.convert(new Terraformer.Primitive(JSON.parse(coberturaRow)));
                    var g = new esri.Graphic(esri.jsonUtilsGeometry.fromJson(feature));
                    g.setSymbol(searchCoberturaSymbol);
                    searchGraphicsLayer.add(g);
                }
                if (modoSearch == "entidad") {
                    centrarImagenes();
                }
                $("#searchImagenesList2 .media-resultados2")
                    .on("hover")
                    .hover(function () {
                        var id = $(this).attr("data-id");
                        for (var i = 0; i < searchGraphicsLayer.graphics.length; i++) {
                            try {
                                if (searchGraphicsLayer.graphics[i].attributes["ID_IMAGEN"] == parseInt(id)) {
                                    searchGraphicsLayer.graphics[i].setSymbol(searchImagenActiveSymbol);
                                } else {
                                    searchGraphicsLayer.graphics[i].setSymbol(searchImagenSymbol);
                                }
                            } catch (err) {}
                        }
                    });
                $("#tableSearchBniTable2 tr")
                    .on("hover")
                    .hover(
                        function () {
                            var data = tableSearchBni2.row(this).data();
                            for (var i = 0; i < searchGraphicsLayer.graphics.length; i++) {
                                if (searchGraphicsLayer.graphics[i].attributes["ID_IMAGEN"] == data.ID_IMAGEN) {
                                    searchGraphicsLayer.graphics[i].setSymbol(searchImagenActiveSymbol);
                                } else {
                                    searchGraphicsLayer.graphics[i].setSymbol(searchImagenSymbol);
                                }
                            }
                        },
                        function () {},
                    );
                var PageInfo = tableSearchBni2.page.info();
                tableSearchBni2
                    .column(0, { page: "current" })
                    .nodes()
                    .each(function (cell, i) {
                        cell.innerHTML = i + 1 + PageInfo.start;
                    });
            },
            columns: [
                {
                    orderable: false,
                    data: "ID_IMAGEN",
                    render: function (data, type, row, meta) {
                        return row.ID_IMAGEN;
                    },
                },
                {
                    data: "ID_IMAGEN",
                    orderable: false,
                    render: function (data, type, row, meta) {
                        return esri.moment(row.FECHA).format("DD/MM/YYYY");
                    },
                },
                {
                    orderable: false,
                    data: "ID_IMAGEN",
                    render: function (data, type, row, meta) {
                        return row.IMAGEN_ID;
                    },
                },
                {
                    data: "ID_IMAGEN",
                    orderable: false,
                    render: function (data, type, row, meta) {
                        return "<div class='btn-resultados3'><img src='/images/iconos/Forward_01.svg' alt='Ver Detalle' style='width: 25px; height: 25px;'></div>";
                    },
                },
            ],
        });
        $("#tableSearchBni2 tbody").on("click", "tr", function () {
            var data = tableSearchBni2.row(this).data();
            gotoImagenDetalle(data.ID_IMAGEN);
        });
    } else {
        tableSearchBni2.ajax.reload();
    }
}

function centrarImagen() {
    if (searchGraphicsLayerDetalle.graphics.length > 0) {
        map.setExtent(esri.graphicsUtils.graphicsExtent(searchGraphicsLayerDetalle.graphics).expand(4));
    }
}

function centrarImagenes() {
    if (firstSearch) {
        firstSearch = false;
        return;
    }
    if (searchGraphicsLayer.visible) {
        if (searchGraphicsLayer.graphics.length > 0) {
            map.setExtent(esri.graphicsUtils.graphicsExtent(searchGraphicsLayer.graphics).expand(4));
        }
    }
}

function cancelBubble(e) {
    var evt = e ? e : window.event;
    if (evt.stopPropagation) evt.stopPropagation();
    if (evt.cancelBubble != null) evt.cancelBubble = true;
}

function gotoSearchUnidad(id) {
    $("#searchFiltro").val(id);
    $("#searchFiltro").trigger("change");
}

function gotoLayers() {
    currentScreen = "layers";
    reporteUso("Abrir mapa base y capas");
    toggleMenu("small");
    minAll();
    $("#selectBasemapPanel").val(currentBasemap);
    $("#panelLayers").show();
}

function closeLayers() {
    $("#panelLayers").hide();
}

function updateCoordenada(evt) {
    try {
        var to = sistemasCoordenadas[$("#querySearchConsultaFormat").val()].proj;
        var from = sistemasCoordenadas["EPSG:3857"].proj;
        var reprojectedCoordsNew = proj4(from, to, [evt.mapPoint.x, evt.mapPoint.y]);
        var coordTextX;
        var coordTextY;
        var labelLatitud = sistemasCoordenadas[$("#querySearchConsultaFormat").val()].labLat;
        var labelLongitud = sistemasCoordenadas[$("#querySearchConsultaFormat").val()].labLng;
        if ($("#querySearchConsultaFormat").val() == "EPSG:4326") {
            coordTextY = reprojectedCoordsNew[1].toFixed(6);
            coordTextX = reprojectedCoordsNew[0].toFixed(6);
        }
        if ($("#querySearchConsultaFormat").val() == "EPSG:4686") {
            coordTextY = reprojectedCoordsNew[1].toFixed(6);
            coordTextX = reprojectedCoordsNew[0].toFixed(6);
        }
        if ($("#querySearchConsultaFormat").val() == "EPSG:3857") {
            coordTextY = parseFloat(evt.mapPoint.y.toFixed(4)).toLocaleString("es");
            coordTextX = parseFloat(evt.mapPoint.x.toFixed(4)).toLocaleString("es");
        }
        if ($("#querySearchConsultaFormat").val() == "EPSG:9377") {
            coordTextY = reprojectedCoordsNew[1].toFixed(6);
            coordTextX = reprojectedCoordsNew[0].toFixed(6);
        }
        if ($("#querySearchConsultaFormat").val() == "EPSG:3114" || $("#querySearchConsultaFormat").val() == "EPSG:3115" || $("#querySearchConsultaFormat").val() == "EPSG:3116" || $("#querySearchConsultaFormat").val() == "EPSG:3117" || $("#querySearchConsultaFormat").val() == "EPSG:3118") {
            coordTextY = parseFloat(reprojectedCoordsNew[1].toFixed(4)).toLocaleString("es");
            coordTextX = parseFloat(reprojectedCoordsNew[0].toFixed(4)).toLocaleString("es");
        }
        if ($("#querySearchConsultaFormat").val() == "EPSG:32617" || $("#querySearchConsultaFormat").val() == "EPSG:32618" || $("#querySearchConsultaFormat").val() == "EPSG:32619" || $("#querySearchConsultaFormat").val() == "EPSG:32717" || $("#querySearchConsultaFormat").val() == "EPSG:32718" || $("#querySearchConsultaFormat").val() == "EPSG:32719") {
            coordTextY = parseFloat(reprojectedCoordsNew[1].toFixed(4)).toLocaleString("es");
            coordTextX = parseFloat(reprojectedCoordsNew[0].toFixed(4)).toLocaleString("es");
        }
        $("#resultadoConsultaCoordenadasY").html(labelLongitud + ":&nbsp;" + coordTextX);
        $("#resultadoConsultaCoordenadasX").html(labelLatitud + ":&nbsp;" + coordTextY);

        var labelLatitudSM;
        if (labelLatitud == "Norte (m)") {
            labelLatitudSM = "N: ";
        }
        if (labelLatitud == "Latitud (N)") {
            labelLatitudSM = "N: ";
        }
        var labelLongitudSM;
        if (labelLongitud == "Este (m)") {
            labelLongitudSM = "E: ";
        }
        if (labelLongitud == "Longitud (W)") {
            labelLongitudSM = "W: ";
        }
        $("#coordinatesDiv").html(labelLatitudSM + coordTextY + ", " + labelLongitudSM + coordTextX + " (" + $("#querySearchConsultaFormat").val() + ")");
    } catch (err) {}
}

function toggleViewImagenes() {
    clearRasterMosaicWorkArea();
    clearSHStatsWorkArea();
    if ($("#searchImagenesBtnList").hasClass("active")) {
        $("#searchImagenesBtnList").removeClass("active");
        $("#searchImagenesBtnGrid").addClass("active");
        $("#searchImagenesBtnList img").attr("src", "/images/iconos/List_Gray.svg");
        $("#searchImagenesBtnGrid img").attr("src", "/images/iconos/Tiles_Blue.svg");
        $("#searchImagenesList").show();
        $("#tableSearchBni").hide();
    } else {
        $("#searchImagenesBtnList").addClass("active");
        $("#searchImagenesBtnGrid").removeClass("active");
        $("#searchImagenesBtnList img").attr("src", "/images/iconos/List_Blue.svg");
        $("#searchImagenesBtnGrid img").attr("src", "/images/iconos/Tiles_Gray.svg");
        $("#searchImagenesList").hide();
        $("#tableSearchBni").show();
    }
}

function toggleViewImagenes2() {
    clearRasterMosaicWorkArea();
    clearSHStatsWorkArea();
    if ($("#searchImagenesBtnList2").hasClass("active")) {
        $("#searchImagenesBtnList2").removeClass("active");
        $("#searchImagenesBtnGrid2").addClass("active");
        $("#searchImagenesBtnList2 img").attr("src", "/images/iconos/List_Gray.svg");
        $("#searchImagenesBtnGrid2 img").attr("src", "/images/iconos/Tiles_Blue.svg");
        $("#searchImagenesList2").show();
        $("#tableSearchBni2").hide();
    } else {
        $("#searchImagenesBtnList2").addClass("active");
        $("#searchImagenesBtnGrid2").removeClass("active");
        $("#searchImagenesBtnList2 img").attr("src", "/images/iconos/List_Blue.svg");
        $("#searchImagenesBtnGrid2 img").attr("src", "/images/iconos/Tiles_Gray.svg");
        $("#searchImagenesList2").hide();
        $("#tableSearchBni2").show();
    }
}

function gotoCoordenadas() {
    currentScreen = "coordenadas";
    reporteUso("Abrir coordenadas");
    toggleMenu("small");
    minAll();
    $("#panelCoordenadas").show();
}

function buscarCoordenada() {
    coordsLayer.clear();
    map.infoWindow.hide();

    try {
        var strLatitud = replaceAll(replaceAll(replaceAll($("#querySearchCoordinateLatitud").val(), ", ", " "), ",", "."), "  ", " ").trim();
        var strLongitud = replaceAll(replaceAll(replaceAll($("#querySearchCoordinateLongitud").val(), ", ", " "), ",", "."), "  ", " ").trim();

        if (strLatitud != "" && strLongitud != "") {
            var lat = parseFloat(strLatitud);
            var lng = parseFloat(strLongitud);

            var to = sistemasCoordenadas["EPSG:4326"].proj;
            var from = sistemasCoordenadas[$("#querySearchCoordinateFormat").val()].proj;
            var reprojectedCoordsNew = proj4(from, to, [lng, lat]);

            lat = reprojectedCoordsNew[1];
            lng = reprojectedCoordsNew[0];

            var pst = esri.webMercatorUtils.geographicToWebMercator(
                new esri.Point({
                    x: lng,
                    y: lat,
                    spatialReference: {
                        wkid: 4686,
                    },
                }),
            );
            coordsLayer.add(
                new esri.Graphic(pst, pointMarker, {
                    Latitud: lat,
                    Longitud: lng,
                    Coordenadas: $("#querySearchCoordinateFormat :selected").text(),
                }),
            );
            map.centerAndZoom(esri.graphicsUtils.graphicsExtent(coordsLayer.graphics).getCenter(), 14);
        }
    } catch (err) {}
}

function closeCoordenadas() {
    if (coordsLayer != null) {
        coordsLayer.clear();
    }
    $("#panelCoordenadas").hide();
}

function gotoDibujar() {
    currentScreen = "dibujar";
    reporteUso("Abrir dibujo y medición");
    toggleMenu("small");
    minAll();
    $("#panelDibujar").show();
    toggleDibujoPunto();
}

function closeDibujar() {
    if (map != null) {
        map.enableMapNavigation();
        if (drawTool != null) {
            drawTool.deactivate();
        }
        if (editTool != null) {
            editTool.deactivate();
        }
    }
    $("#panelDibujar").hide();
}

function toggleDibujoPunto() {
    currentDibujoMode = "point";
    $("#dibujoPuntoHeader,#dibujoLineaHeader,#dibujoPoligonoHeader").removeClass("active");
    $("#dibujoPuntoHeader").addClass("active");
    $("#drawBar .btn").hide();
    $("#drawPointBtn").show();
    updateDibujoList();
    editTool.deactivate();
}

function toggleDibujoLinea() {
    currentDibujoMode = "line";
    $("#dibujoPuntoHeader,#dibujoLineaHeader,#dibujoPoligonoHeader").removeClass("active");
    $("#dibujoLineaHeader").addClass("active");
    $("#drawBar .btn").hide();
    $("#drawLineBtn,#drawPolylineBtn,#drawFreehandPolylineBtn").show();
    updateDibujoList();
    editTool.deactivate();
}

function toggleDibujoPoligono() {
    currentDibujoMode = "polygon";
    $("#dibujoPuntoHeader,#dibujoLineaHeader,#dibujoPoligonoHeader").removeClass("active");
    $("#dibujoPoligonoHeader").addClass("active");
    $("#drawBar .btn").hide();
    $("#drawTriangleBtn,#drawCircleBtn,#drawEllipseBtn,#drawPolygonBtn,#drawFreehandPolygonBtn").show();
    updateDibujoList();
    editTool.deactivate();
}

function modoDibujo(tipo) {
    clearRasterMosaicWorkArea();
    clearSHStatsWorkArea();
    if (drawToolRasterMosaics) {
        drawToolRasterMosaics.deactivate();
    }
    editTool.deactivate();
    map.disableMapNavigation();

    $("#drawEdit").show();
    $("#drawClean").hide();
    $("#drawIntro").hide();

    $("#measureDivContainer").hide();
    $("#drawOptsFill").hide();
    $("#drawOptsText").hide();
    $("#drawCurrentTool").hide();
    $("#drawOptsLine").hide();

    $("#drawText").val("Texto");
    $("#drawOptFillColor").colorpicker("setValue", "rgba(171, 156, 202, 0.75)");
    $("#drawOptLineColor").colorpicker("setValue", "rgba(62, 106, 149, 0.75)");

    activeTool = tipo.toLowerCase();
    if (activeTool == "text") {
        drawTool.activate("point");
        $("#drawOptsFill").show();
        $("#drawOptsText").show();
        //$("#drawCurrentTool").show();
        $("#drawCurrentTool").html("Texto");
    }
    if (activeTool == "point") {
        drawTool.activate("point");
        $("#drawOptsFill").hide();
        $("#drawOptsText").hide();
        //$("#drawCurrentTool").show();
        $("#drawCurrentTool").html("Punto");
    }
    if (activeTool == "line") {
        $("#drawOptsLine").show();
        drawTool.activate(activeTool);
        //$("#drawCurrentTool").show();
        $("#drawCurrentTool").html("L&iacute;nea");
    }
    if (activeTool == "polyline") {
        $("#drawOptsLine").show();
        drawTool.activate(activeTool);
        //$("#drawCurrentTool").show();
        $("#drawCurrentTool").html("Pol&iacute;nea");
    }
    if (activeTool == "freehandpolyline") {
        $("#drawOptsLine").show();
        drawTool.activate(activeTool);
        //$("#drawCurrentTool").show();
        $("#drawCurrentTool").html("Pol&iacute;nea a mano alzada");
    }
    if (activeTool == "triangle") {
        $("#drawOptsLine").show();
        $("#drawOptsFill").show();
        drawTool.activate(activeTool);
        //$("#drawCurrentTool").show();
        $("#drawCurrentTool").html("Tri&aacute;ngulo");
    }
    if (activeTool == "circle") {
        $("#drawOptsLine").show();
        $("#drawOptsFill").show();
        drawTool.activate(activeTool);
        //$("#drawCurrentTool").show();
        $("#drawCurrentTool").html("C&iacute;rculo");
    }
    if (activeTool == "ellipse") {
        $("#drawOptsLine").show();
        $("#drawOptsFill").show();
        drawTool.activate(activeTool);
        //$("#drawCurrentTool").show();
        $("#drawCurrentTool").html("Elipse");
    }
    if (activeTool == "polygon") {
        $("#drawOptsLine").show();
        $("#drawOptsFill").show();
        drawTool.activate(activeTool);
        //$("#drawCurrentTool").show();
        $("#drawCurrentTool").html("Pol&iacute;gono");
    }
    if (activeTool == "freehandpolygon") {
        $("#drawOptsLine").show();
        $("#drawOptsFill").show();
        drawTool.activate(activeTool);
        //$("#drawCurrentTool").show();
        $("#drawCurrentTool").html("Pol&iacute;gono a mano alzada");
    }
}

function updateDibujoList() {
    $("#drawList").html("");
    var pos = 1;
    for (var i = 0; i < dibujoLayer.graphics.length; i++) {
        if (currentDibujoMode == "point") {
            if (dibujoLayer.graphics[i].geometry.type == "point") {
                var strHTML;
                strHTML = "<a href='#' class='list-group-item'>";
                strHTML = strHTML + "<div role='group' class='btn-group pull-right'>";
                strHTML = strHTML + "<button type='button' data-toggle='tooltip' data-placement='bottom' title='Centrar' class='btn btn-xs btn-default' onclick='loadDibujo(" + i + ");'>";
                strHTML = strHTML + "Centrar";
                strHTML = strHTML + "</button>";
                strHTML = strHTML + "<button type='button' data-toggle='tooltip' data-placement='bottom' title='Eliminar' class='btn btn-xs btn-default' onclick='deleteDibujoL(" + i + ");'>";
                strHTML = strHTML + "Eliminar";
                strHTML = strHTML + "</span>";
                strHTML = strHTML + "</button>";
                strHTML = strHTML + "</div>";
                strHTML = strHTML + "Punto " + pos;
                strHTML = strHTML + "</a>";
                $("#drawList").append(strHTML);
                pos++;
            }
        }
        if (currentDibujoMode == "line") {
            if (dibujoLayer.graphics[i].geometry.type == "line" || dibujoLayer.graphics[i].geometry.type == "polyline" || dibujoLayer.graphics[i].geometry.type == "freehandpolyline") {
                var strHTML;
                strHTML = "<a href='#' class='list-group-item'>";
                strHTML = strHTML + "<div role='group' class='btn-group pull-right'>";
                strHTML = strHTML + "<button type='button' data-toggle='tooltip' data-placement='bottom' title='Centrar' class='btn btn-xs btn-default' onclick='loadDibujo(" + i + ");'>";
                strHTML = strHTML + "Centrar";
                strHTML = strHTML + "</button>";
                strHTML = strHTML + "<button type='button' data-toggle='tooltip' data-placement='bottom' title='Eliminar' class='btn btn-xs btn-default' onclick='deleteDibujoL(" + i + ");'>";
                strHTML = strHTML + "Eliminar";
                strHTML = strHTML + "</span>";
                strHTML = strHTML + "</button>";
                strHTML = strHTML + "</div>";
                strHTML = strHTML + "Linea " + pos;
                strHTML = strHTML + "</a>";
                $("#drawList").append(strHTML);
                pos++;
            }
        }
        if (currentDibujoMode == "polygon") {
            if (dibujoLayer.graphics[i].geometry.type == "triangle" || dibujoLayer.graphics[i].geometry.type == "circle" || dibujoLayer.graphics[i].geometry.type == "ellipse" || dibujoLayer.graphics[i].geometry.type == "polygon" || dibujoLayer.graphics[i].geometry.type == "freehandpolygon") {
                var strHTML;
                strHTML = "<a href='#' class='list-group-item'>";
                strHTML = strHTML + "<div role='group' class='btn-group pull-right'>";
                strHTML = strHTML + "<button type='button' data-toggle='tooltip' data-placement='bottom' title='Centrar' class='btn btn-xs btn-default' onclick='loadDibujo(" + i + ");'>";
                strHTML = strHTML + "Centrar";
                strHTML = strHTML + "</button>";
                strHTML = strHTML + "<button type='button' data-toggle='tooltip' data-placement='bottom' title='Eliminar' class='btn btn-xs btn-default' onclick='deleteDibujoL(" + i + ");'>";
                strHTML = strHTML + "Eliminar";
                strHTML = strHTML + "</span>";
                strHTML = strHTML + "</button>";
                strHTML = strHTML + "</div>";
                strHTML = strHTML + "Poligono " + pos;
                strHTML = strHTML + "</a>";
                $("#drawList").append(strHTML);
                pos++;
            }
        }
    }
}

function modoCleanDibujo() {
    $("#drawEdit").hide();
    $("#drawIntro").hide();
    $("#drawClean").show();
    $("#drawCurrentTool").html("");
}

function deleteDibujo() {
    dibujoLayer.remove(editTool.getCurrentState().graphic);
    editTool.deactivate();
}

function loadDibujo(pos) {
    if (currentDibujoMode == "point") {
        if (dibujoLayer.graphics[pos].geometry.spatialReference.wkid == 102100) {
            map.centerAt(esri.webMercatorUtils.webMercatorToGeographic(dibujoLayer.graphics[pos].geometry));
        } else {
            map.centerAt(dibujoLayer.graphics[pos].geometry);
        }
    }
    if (currentDibujoMode == "line") {
        var x = (dibujoLayer.graphics[pos].geometry.getExtent().xmin + dibujoLayer.graphics[pos].geometry.getExtent().xmax) / 2;
        var y = (dibujoLayer.graphics[pos].geometry.getExtent().ymin + dibujoLayer.graphics[pos].geometry.getExtent().ymax) / 2;
        if (dibujoLayer.graphics[pos].geometry.spatialReference.wkid == 102100) {
            map.centerAt(esri.webMercatorUtils.webMercatorToGeographic(new esri.Point({ x: x, y: y })));
        } else {
            map.centerAt(new esri.Point({ x: x, y: y }));
        }
    }
    if (currentDibujoMode == "polygon") {
        if (dibujoLayer.graphics[pos].geometry.spatialReference.wkid == 102100) {
            map.centerAt(esri.webMercatorUtils.webMercatorToGeographic(dibujoLayer.graphics[pos].geometry.getCentroid()));
        } else {
            map.centerAt(dibujoLayer.graphics[pos].geometry.getCentroid());
        }
    }
    editTool.activate(esri.Edit.MOVE | esri.Edit.EDIT_VERTICES | esri.Edit.SCALE | esri.Edit.ROTATE, dibujoLayer.graphics[pos], {
        allowAddVertices: true,
        allowDeleteVertices: true,
        uniformScaling: true,
    });
}

function deleteDibujoL(pos) {
    dibujoLayer.remove(dibujoLayer.graphics[pos]);
    editTool.deactivate();
    updateDibujoList();
}

function cleanDibujo() {
    currentDibujo = null;
    dibujoLayer.clear();
    editTool.deactivate();
    updateDibujoList();
}

function exportDibujo() {
    var features = [];
    for (var i = 0; i < dibujoLayer.graphics.length; i++) {
        var feature = dibujoLayer.graphics[i];
        if (currentDibujoMode == "point" && feature.geometry.type == "point") {
            feature.geometry = esri.webMercatorUtils.webMercatorToGeographic(feature.geometry);
            feature.properties = [];
            features.push(Terraformer.ArcGIS.toGeoJSON(feature));
        }
        if (currentDibujoMode == "line" && (feature.geometry.type == "line" || feature.geometry.type == "polyline" || feature.geometry.type == "freehandpolyline")) {
            feature.geometry = esri.webMercatorUtils.webMercatorToGeographic(feature.geometry);
            feature.properties = [];
            features.push(Terraformer.ArcGIS.toGeoJSON(feature));
        }
        if (currentDibujoMode == "polygon" && (feature.geometry.type == "triangle" || feature.geometry.type == "circle" || feature.geometry.type == "ellipse" || feature.geometry.type == "polygon" || feature.geometry.type == "freehandpolygon")) {
            feature.geometry = esri.webMercatorUtils.webMercatorToGeographic(feature.geometry);
            feature.properties = [];
            features.push(Terraformer.ArcGIS.toGeoJSON(feature));
        }
    }
    var jsonString = encodeURIComponent(
        JSON.stringify({
            type: "FeatureCollection",
            features: features,
        }),
    );
    var link = document.createElement("a");
    link.href = "data:text/json;charset=utf-8," + jsonString;
    link.download = "Export.json";
    link.target = "_self";
    link.click();
}

function volverDibujoMain() {
    editTool.deactivate();
    $("#drawEdit").hide();
    $("#drawIntro").show();
}

function updateEditMeasure(g) {
    if (g != null) {
        currentMeasureGraphic = g;
    }
    var strHTML = "";
    var strHTML2 = "";

    if (currentMeasureGraphic.geometry.type == "line" || currentMeasureGraphic.geometry.type == "polyline" || currentMeasureGraphic.geometry.type == "freehandpolyline") {
        $("#measureDivAreaUnits").hide();
        $("#measureDivLengthUnits").show();
        $("#measureDivContainer").show();

        try {
            if ($("#measureLengthUnit").val() == "kilometers") {
                strHTML2 = strHTML2 + "Longitud: " + esri.geometryEngine.geodesicLength(currentMeasureGraphic.geometry, "kilometers").toFixed(2) + " Kilómetros";
            }
            if ($("#measureLengthUnit").val() == "meters") {
                strHTML2 = strHTML2 + "Longitud: " + esri.geometryEngine.geodesicLength(currentMeasureGraphic.geometry, "meters").toFixed(2) + " Metros";
            }
            if ($("#measureLengthUnit").val() == "feet") {
                strHTML2 = strHTML2 + "Longitud: " + esri.geometryEngine.geodesicLength(currentMeasureGraphic.geometry, "feet").toFixed(2) + " Pies";
            }
            if ($("#measureLengthUnit").val() == "miles") {
                strHTML2 = strHTML2 + "Longitud: " + esri.geometryEngine.geodesicLength(currentMeasureGraphic.geometry, "miles").toFixed(2) + " Millas";
            }
            if ($("#measureLengthUnit").val() == "yards") {
                strHTML2 = strHTML2 + "Longitud: " + esri.geometryEngine.geodesicLength(currentMeasureGraphic.geometry, "yards").toFixed(2) + " Yardas";
            }
        } catch (err) {}
    } else {
        if (currentMeasureGraphic.geometry.type == "triangle" || currentMeasureGraphic.geometry.type == "circle" || currentMeasureGraphic.geometry.type == "ellipse" || currentMeasureGraphic.geometry.type == "polygon" || currentMeasureGraphic.geometry.type == "freehandpolygon") {
            $("#measureDivAreaUnits").show();
            $("#measureDivLengthUnits").show();
            $("#measureDivContainer").show();

            try {
                if ($("#measureAreaUnit").val() == "hectares") {
                    strHTML = strHTML + "&Aacute;rea: " + esri.geometryEngine.geodesicArea(currentMeasureGraphic.geometry, "hectares").toFixed(2) + " Hectareas";
                }
                if ($("#measureAreaUnit").val() == "square-kilometers") {
                    strHTML = strHTML + "&Aacute;rea: " + esri.geometryEngine.geodesicArea(currentMeasureGraphic.geometry, "square-kilometers").toFixed(2) + " Kilómetros cuadrados";
                }
                if ($("#measureAreaUnit").val() == "square-meters") {
                    strHTML = strHTML + "&Aacute;rea: " + esri.geometryEngine.geodesicArea(currentMeasureGraphic.geometry, "square-meters").toFixed(2) + " Metros cuadrados";
                }
                if ($("#measureAreaUnit").val() == "square-feet") {
                    strHTML = strHTML + "&Aacute;rea: " + esri.geometryEngine.geodesicArea(currentMeasureGraphic.geometry, "square-feet").toFixed(2) + " Pies cuadrados";
                }
                if ($("#measureAreaUnit").val() == "square-miles") {
                    strHTML = strHTML + "&Aacute;rea: " + esri.geometryEngine.geodesicArea(currentMeasureGraphic.geometry, "square-miles").toFixed(2) + " Millas cuadradas";
                }
                if ($("#measureAreaUnit").val() == "square-yards") {
                    strHTML = strHTML + "&Aacute;rea: " + esri.geometryEngine.geodesicArea(currentMeasureGraphic.geometry, "square-yards").toFixed(2) + " Yardas cuadradas";
                }
            } catch (err) {}
            try {
                if ($("#measureLengthUnit").val() == "kilometers") {
                    strHTML2 = strHTML2 + "Per&iacute;metro: " + esri.geometryEngine.geodesicLength(currentMeasureGraphic.geometry, "kilometers").toFixed(2) + " Kilómetros";
                }
                if ($("#measureLengthUnit").val() == "meters") {
                    strHTML2 = strHTML2 + "Per&iacute;metro: " + esri.geometryEngine.geodesicLength(currentMeasureGraphic.geometry, "meters").toFixed(2) + " Metros";
                }
                if ($("#measureLengthUnit").val() == "feet") {
                    strHTML2 = strHTML2 + "Per&iacute;metro: " + esri.geometryEngine.geodesicLength(currentMeasureGraphic.geometry, "feet").toFixed(2) + " Pies";
                }
                if ($("#measureLengthUnit").val() == "miles") {
                    strHTML2 = strHTML2 + "Per&iacute;metro: " + esri.geometryEngine.geodesicLength(currentMeasureGraphic.geometry, "miles").toFixed(2) + " Millas";
                }
                if ($("#measureLengthUnit").val() == "yards") {
                    strHTML2 = strHTML2 + "Per&iacute;metro: " + esri.geometryEngine.geodesicLength(currentMeasureGraphic.geometry, "yards").toFixed(2) + " Yardas";
                }
            } catch (err) {}
        } else {
            $("#measureDivContainer").hide();
        }
    }
    $("#measureDivArea").html(strHTML);
    $("#measureDivLength").html(strHTML2);
}

function updateEditGraphic() {
    var cLine = esri.Color.fromString($("#drawOptLineColorInput").val()).toRgba();
    var cFill = esri.Color.fromString($("#drawOptFillColorInput").val()).toRgba();

    var cLineDef = esri.Color.fromArray(cLine);
    var cFillDef = esri.Color.fromArray(cFill);

    if (editTool.getCurrentState().graphic.symbol.type == "textsymbol") {
        var csize = editTool.getCurrentState().graphic.symbol.font.size;
        editTool.getCurrentState().graphic.setSymbol(new esri.TextSymbol($("#drawText").val(), new esri.Font(csize), cFillDef));
    }
    if (editTool.getCurrentState().graphic.symbol.type == "simplelinesymbol") {
        editTool.getCurrentState().graphic.setSymbol(new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineDef, 2));
    }
    if (editTool.getCurrentState().graphic.symbol.type == "simplefillsymbol") {
        editTool.getCurrentState().graphic.setSymbol(new esri.SimpleFillSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineDef, 2), cFillDef));
    }
}

function gotoImprimir() {
    currentScreen = "imprimir";
    reporteUso("Abrir imprimir");
    toggleMenu("small");
    minAll();
    $("#panelImprimir").show();
}

function closeImprimir() {
    $("#panelImprimir").hide();
}

function printMap() {
    showLoading("Preparando impresi&oacute;n", "loading", "gold", false);
    printer.printMap({
        layout: $("#selectPrintTemplate").val(),
        format: $("#selectPrintFormat").val(),
        preserveScale: false,
        layoutOptions: {
            scalebarUnit: "Kilometers",
            titleText: $("#printTitle").val(),
        },
        exportOptions: {
            width: $(window).width(),
            height: $(window).height(),
            dpi: $("#selectPrintDPI").val(),
        },
    });
}

function gotoTutorial() {
    modeTutorial = true;
    if ($("#searchFiltro").val() != null) {
        toggleMenu("small");
        toggleFiltros("large");
    }
    toggleTools(false);
    toggleInfoTools(false);
    $("#modalTutorialDiv").html("<div class='header'><a href='#' class='close position-absolute py-0' onclick='cancelTutorial(); return false;' aria-label='Cerrar' style='top: 15px; right: 15px; color: #fff;'><span aria-hidden='true'>×</span></a><div style='font-size: 22px;'>Bienvenido al Observatorio de la <br/> Tierra y el Territorio&nbsp;<img alt='Bienvenido' src='/images/iconos/waving-hand-sign_1f44b.png' style='height: 20px;' /></div><br/></div>" + "<div class='px-4 text-left'>El Observatorio de la Tierra y el Territorio (OTT) es una plataforma especializada que integra datos geoespaciales y catastrales para el análisis y monitoreo de la tierra y el territorio en Colombia.Fue desarrollado por el Instituto Geográfico Agustín Codazzi(IGAC) con el objetivo de disponer información espacial para las entidades territoriales que permita la evaluación, monitoreo y seguimiento a los cambios que se generan en todo el territorio nacional.</div>" + "<br/><div class='text-center'><div id='terminosAlerta' style='display: none;'>Debes aceptar los t&eacute;rminos y condiciones para poder continuar<br/></div><input type='checkbox' id='checkTerminos' />&nbsp;Aceptar <a href='#' onclick='expandTerminos();' id='terminosLink'>T&eacute;rminos y condiciones</a></div>" + "<div id='terminos' class='px-4 mb-3 mt-2 text-left' style='display: none;'>Colombia en Mapas solo se hace responsable de la información relacionada con la elaboración y actualización del mapa oficial de la República de Colombia, políticas y planes del Gobierno nacional en materia de cartografía, agrología, catastro y geografía, mediante la producción, análisis y divulgación de información catastral y ambiental georreferenciada, funciones que son competencia del IGAC de conformidad con lo establecido en el Decreto 846 de 2021. En lo relacionado con asuntos de otra competencia, Colombia en Mapas solamente dispone y centraliza la información producida por las entidades nacionales, regionales y locales que generan datos del territorio, con el objetivo de promover y facilitar la toma de decisiones efectivas del gobierno, las industrias y el ciudadano.</div>");
    $("#modalTutorial").modal({ backdrop: "static", keyboard: false }, "show");
}

function expandTerminos() {
    $("#terminos").toggle();
}

function gotoTutorialStep2() {
    if (!$("#checkTerminos").is(":checked")) {
        $("#terminos").hide();
        $("#terminosAlerta").show();
        return;
    }
    $("#modalTutorial").modal("hide");
    var strHTML = "";
    strHTML = strHTML + "<div class='popover popover-tutorial' role='tooltip'>";
    strHTML = strHTML + "<div class='popover-tutorial-header modal-header' class='popover-tutorial-close'><div class='close btn-tutorial-close2' ><span aria-hidden='true'>×</span></div></div>";
    strHTML = strHTML + "<div class='arrow'></div>";
    strHTML = strHTML + "<span class='popover-tutorial-title d-flex mb-3 pb-2 border-bottom'><img class='pb-2' src='/images/iconos/white-left-pointing-backhand-index_1f448.png' style='height: 20px;' />&nbsp;Empieza tu b&uacute;squeda</span>";
    strHTML = strHTML + "<div class='popover-tutorial-content popover-content'>";
    strHTML = strHTML + "</div>";
    strHTML = strHTML + "<div class='popover-tutorial-content2'><i>Haz clic en ‘Siguiente’ para continuar</i></div>";
    strHTML = strHTML + "<div class='modal-footer popover-tutorial-footer'><span style='width: 100%;'>2 de 7</span><div class='btn btn-primary btn-tutorial btn-tutorial2'>Siguiente</a></div>";
    strHTML = strHTML + "</div>";
    $("#searchBarTabF").popover({
        container: "body",
        trigger: "manual",
        template: strHTML,
        html: true,
        content: "Para empezar tu búsqueda en el observatorio debes elegir tu zona de interés a traves de los filtros de Entidad Territorial, Área o Capa GeoJson",
    });
    $("#searchBarTabF").on("shown.bs.popover", function () {
        $(".btn-tutorial2").unbind("click");
        $(".btn-tutorial2").on("click", function () {
            $("#searchBarTabF").removeClass("tutorialMode");
            $("#searchBarTabF").popover("hide");
            gotoTutorialStep3();
            return false;
        });
        $(".btn-tutorial-close2").unbind("click");
        $(".btn-tutorial-close2").on("click", function () {
            cancelTutorial();
            return false;
        });
    });
    $("#searchBarTabF").popover("show");
    $("#searchBarTabF").addClass("tutorialMode");
}

function gotoTutorialStep3() {
    var strHTML = "";
    strHTML = strHTML + "<div class='popover popover-tutorial' role='tooltip'>";
    strHTML = strHTML + "<div class='popover-tutorial-header modal-header' class='popover-tutorial-close'><div class='close btn-tutorial-close2' ><span aria-hidden='true'>×</span></div></div>";
    strHTML = strHTML + "<div class='arrow'></div>";
    strHTML = strHTML + "<span class='popover-tutorial-title d-flex mb-3 pb-2 border-bottom'><img class='pb-2' src='/images/iconos/white-left-pointing-backhand-index_1f448.png' style='height: 20px;' />&nbsp;Complementa tu búsqueda</span>";
    strHTML = strHTML + "<div class='popover-tutorial-content popover-content'>";
    strHTML = strHTML + "</div>";
    strHTML = strHTML + "<div class='popover-tutorial-content2'><i>Haz clic en ‘Siguiente’ para continuar</i></div>";
    strHTML = strHTML + "<div class='modal-footer popover-tutorial-footer'><span style='width: 100%;'>3 de 7</span><div class='btn btn-primary btn-tutorial btn-tutorial3'>Siguiente</a></div>";
    strHTML = strHTML + "</div>";
    $("#panelSearchFiltroImagenes").popover({
        container: "body",
        trigger: "manual",
        template: strHTML,
        html: true,
        content: "Mediante el filtro de temporalidad y porcentaje de nubosidad podrás realizar una búsqueda mas especializada de los datos geoespaciales.",
    });
    $("#panelSearchFiltroImagenes").on("shown.bs.popover", function () {
        $(".btn-tutorial3").unbind("click");
        $(".btn-tutorial3").on("click", function () {
            $("#panelSearchFiltroImagenes").removeClass("tutorialMode");
            $("#panelSearchFiltroImagenes").popover("hide");
            $("#searchFiltro").val(0);
            $("#searchFiltro").trigger("change");
            toggleMenu("large");
            gotoTutorialStep4();
            return false;
        });
        $(".btn-tutorial-close3").unbind("click");
        $(".btn-tutorial-close3").on("click", function () {
            cancelTutorial();
            return false;
        });
    });
    $("#panelSearchFiltroImagenes").popover("show");
    $("#panelSearchFiltroImagenes").addClass("tutorialMode");
}

function gotoTutorialStep4() {
    var strHTML = "";
    strHTML = strHTML + "<div class='popover popover-tutorial' role='tooltip'>";
    strHTML = strHTML + "<div class='popover-tutorial-header modal-header' class='popover-tutorial-close'><div class='close btn-tutorial-close3' ><span aria-hidden='true'>×</span></div></div>";
    strHTML = strHTML + "<div class='arrow'></div>";
    strHTML = strHTML + "<span class='popover-tutorial-title d-flex mb-3 pb-2 border-bottom'><img class='pb-2' src='/images/iconos/white-left-pointing-backhand-index_1f448.png' style='height: 20px;' />&nbsp;Selecciona el conjunto de datos</span>";
    strHTML = strHTML + "<div class='popover-tutorial-content popover-content'>";
    strHTML = strHTML + "</div>";
    strHTML = strHTML + "<div class='popover-tutorial-content2'><i>Haz clic en ‘Siguiente’ para continuar</i></div>";
    strHTML = strHTML + "<div class='modal-footer popover-tutorial-footer'><span style='width: 100%;'>4 de 7</span><div class='btn btn-primary btn-tutorial btn-tutorial4'>Siguiente</a></div>";
    strHTML = strHTML + "</div>";
    $("#searchBarTab").popover({
        container: "body",
        trigger: "manual",
        template: strHTML,
        html: true,
        content: "Para ello disponemos de dos grandes grupos de datos geoespaciales: las imágenes de mediana resolución y alta resolución.",
    });
    $("#searchBarTab").on("shown.bs.popover", function () {
        $(".btn-tutorial4").unbind("click");
        $(".btn-tutorial4").on("click", function () {
            $("#searchBarTab").removeClass("tutorialMode");
            $("#searchBarTab").popover("hide");
            gotoTutorialStep5();
            return false;
        });
        $(".btn-tutorial-close4").unbind("click");
        $(".btn-tutorial-close4").on("click", function () {
            cancelTutorial();
            return false;
        });
    });
    $("#searchBarTab").popover("show");
    $("#searchBarTab").addClass("tutorialMode");
}

function gotoTutorialStep5() {
    modeTutorialItem = $("#searchImagenesList .media-resultados2").first();
    var strHTML = "";
    strHTML = strHTML + "<div class='popover popover-tutorial' role='tooltip'>";
    strHTML = strHTML + "<div class='popover-tutorial-header modal-header' class='popover-tutorial-close'><div class='close btn-tutorial-close4' ><span aria-hidden='true'>×</span></div></div>";
    strHTML = strHTML + "<div class='arrow'></div>";
    strHTML = strHTML + "<span class='popover-tutorial-title d-flex mb-3 pb-2 border-bottom'><img class='pb-2' src='/images/iconos/white-left-pointing-backhand-index_1f448.png' style='height: 20px;' />&nbsp;Accede al metadato de las imágenes</span>";
    strHTML = strHTML + "<div class='popover-tutorial-content popover-content'>";
    strHTML = strHTML + "</div>";
    strHTML = strHTML + "<div class='popover-tutorial-content2'><i>Haz clic en ‘Siguiente’ para continuar</i></div>";
    strHTML = strHTML + "<div class='modal-footer popover-tutorial-footer'><span style='width: 100%;'>5 de 7</span><div class='btn btn-primary btn-tutorial btn-tutorial5'>Siguiente</a></div>";
    strHTML = strHTML + "</div>";
    $(modeTutorialItem).popover({
        container: "body",
        trigger: "manual",
        template: strHTML,
        html: true,
        content: "Haz clic Sobre la imagen para acceder a la información adicional.",
    });
    $(modeTutorialItem).on("shown.bs.popover", function () {
        $(".btn-tutorial5").unbind("click");
        $(".btn-tutorial5").on("click", function () {
            $(modeTutorialItem).removeClass("tutorialMode");
            $(modeTutorialItem).popover("hide");
            gotoTutorialStep6();
            toggleMenu("small");
            return false;
        });
        $(".btn-tutorial-close5").unbind("click");
        $(".btn-tutorial-close5").on("click", function () {
            cancelTutorial();
            return false;
        });
    });
    $(modeTutorialItem).popover("show");
    $(modeTutorialItem).addClass("tutorialMode");
}

function gotoTutorialStep6() {
    var strHTML = "";
    strHTML = strHTML + "<div class='popover popover-tutorial' role='tooltip'>";
    strHTML = strHTML + "<div class='popover-tutorial-header modal-header' class='popover-tutorial-close'><div class='close btn-tutorial-close3' ><span aria-hidden='true'>×</span></div></div>";
    strHTML = strHTML + "<div class='arrow'></div>";
    strHTML = strHTML + "<span class='popover-tutorial-title d-flex mb-3 pb-2 border-bottom'><img class='pb-2' src='/images/iconos/white-left-pointing-backhand-index_1f448.png' style='height: 20px;' />&nbsp;Interactúa con mosaicos y vídeos</span>";
    strHTML = strHTML + "<div class='popover-tutorial-content popover-content'>";
    strHTML = strHTML + "</div>";
    strHTML = strHTML + "<div class='popover-tutorial-content2'><i>Haz clic en ‘Siguiente’ para continuar</i></div>";
    strHTML = strHTML + "<div class='modal-footer popover-tutorial-footer'><span style='width: 100%;'>6 de 7</span><div class='btn btn-primary btn-tutorial btn-tutorial6'>Siguiente</a></div>";
    strHTML = strHTML + "</div>";
    $("#tutorial6Div").popover({
        container: "body",
        trigger: "manual",
        placement: "left",
        template: strHTML,
        html: true,
        content: "Por medio de los mosaicos generados con imágenes de la mejor resolución, podrás realizar análisis multitemporales a través de comparaciones interactivas y vídeos multitemporales.",
    });
    $("#tutorial6Div").on("shown.bs.popover", function () {
        $(".btn-tutorial6").unbind("click");
        $(".btn-tutorial6").on("click", function () {
            $("#tutorial6Div").removeClass("tutorialMode");
            $("#tutorial6Div").popover("hide");
            gotoTutorialStep7();
            return false;
        });
        $(".btn-tutorial-close6").unbind("click");
        $(".btn-tutorial-close6").on("click", function () {
            cancelTutorial();
            return false;
        });
    });
    $("#tutorial6Div").popover("show");
    $("#tutorial6Div").addClass("tutorialMode");
}

function gotoTutorialStep7() {
    $("#modalFinTutorialDiv").html("<span style='color: #2b4d28;font-size: 22px;'>Est&aacute;s listo para empezar a explorar&nbsp;<img alt='Estas listo' src='/images/iconos/party-popper_1f389.png' style='height: 20px;' /></span>" + "<div style='padding: 20px;'><img alt='Tutorial Completo' src='/images/Logo_OBS.png' style='width: 200px;'></div>" + "<p>Esta fue una breve introducción al uso de nuestra plataforma. El Observatorio de la Tierra y el Territorio tiene muchas funcionalidades por descubrir por ello te invitamos a explorar el Tutorial y Guía de ayuda del OTT. Oprime ‘Finalizar’ y empieza explorar.</p>");
    $("#modalFinTutorial").modal("show");
}

function finTutorial() {
    cancelTutorial();
}

function cancelTutorial() {
    if (!$("#checkTerminos").is(":checked")) {
        $("#terminos").hide();
        $("#terminosAlerta").show();
        return;
    }
    modeTutorial = false;

    $("#modalTutorial").modal("hide");
    $("#searchBarTab").popover("hide");
    $("#searchBarTab").removeClass("tutorialMode");
    $("#panelSearchFiltroImagenes").popover("hide");
    $("#panelSearchFiltroImagenes").removeClass("tutorialMode");
    $("#searchBarTabF").popover("hide");
    $("#searchBarTabF").removeClass("tutorialMode");
    $(modeTutorialItem).popover("hide");
    $(modeTutorialItem).removeClass("tutorialMode");
    $("#tutorial6Div").popover("hide");
    $("#tutorial6Div").removeClass("tutorialMode");
    $("#modalFinTutorial").modal("hide");
}

function getShareUrl() {
    if (esri == null || map == null) {
        return "/";
    }
    var url = window.location.origin;
    url = url + window.location.pathname + "?";
    var mapext = esri.webMercatorUtils.webMercatorToGeographic(map.extent);
    url = url + "e=" + mapext.xmin + "," + mapext.ymin + "," + mapext.xmax + "," + mapext.ymax + "," + 4686;
    url = url + "&";
    url = url + "b=" + currentBasemap;
    if ($("#searchFiltro").val() != null) {
        url = url + "&u=" + $("#searchFiltro").val();
    }
    return url;
}

function copyShareLink() {
    Clipboard.copy($("#urlShare").val());
}

function reporteUso(funcionalidad, parametro) {
    /*
    if (parametro == null) {
        try {
            gtag('event', funcionalidad, {
                'send_to': 'G-7RHX7BC8DP',
                'event_category': funcionalidad
            });
        } catch (err) {
            console.log(err);
        }
        return;
    }
    var value = null;
    if (parametro.unidad != null) {
        value = parametro.unidad;
    }
    if (parametro.tematica != null) {
        value = parametro.tematica;
    }
    if (parametro.estacion != null) {
        value = parametro.estacion;
    }
    if (parametro.imagen != null) {
        value = parametro.imagen;
    }
    if (parametro.carto != null) {
        value = parametro.carto;
    }
    if (parametro.servicio != null) {
        value = parametro.servicio;
    }
    if (parametro.plancha != null) {
        value = parametro.plancha;
    }

    try {
        gtag('event', funcionalidad, {
            'send_to': 'G-7RHX7BC8DP',
            'event_category': funcionalidad,
            'event_action': parametro.action,
            'event_label': value,
        });
    } catch (err) {

    }
    */
}

function closeLoading() {
    $("#alertList").hide();
}

function showLoading(text, imagen, color, autohide) {
    $("#alertContent").html(text);
    if (imagen == null) {
        $("#alertContentLeft").hide();
    } else {
        if (imagen == "loading") {
            $("#alertContentLeft img").attr("src", "/images/iconos/clock-face-three-oclock_1f552.png");
        }
        if (imagen == "ok") {
            $("#alertContentLeft img").attr("src", "/images/iconos/thumbs-up-sign_1f44d.png");
        }
        if (imagen == "error") {
            $("#alertContentLeft img").attr("src", "/images/iconos/smiling-face-with-smiling-eyes-and-hand-covering-mouth_1f92d.png");
        }
        $("#alertContentLeft").show();
    }
    $("#alertHeader").css("background-color", color);
    if (autohide) {
        setTimeout(function () {
            closeLoading();
        }, defaultAlertTimer);
    }
    $("#alertList").show();
}

function gotoServicioDetalle() {
    hideAllSearch();
    $("#panelSearchServicioDetalle").show();
    $("#panelSearchFiltroImagenes").show();
    $("#detalleServicioNombre").html("");
    $("#detalleServicio").html("");
    $("#detalleServicioBtn").hide();
    $("#detalleServicioBtn2").hide();

    currentServicio = {
        NOMBRE: "Cobertura imágenes alta resolución",
        RESUMEN: "Cubrimiento de las imágenes satelitales de alta resolución dispuestas para la descarga bajo solicitud al IGAC y limitada dentro del Observatorio de la Tierra y el Territorio, actualmente se cuenta con un cubrimiento de aproximadamente el 50% del territorio Colombiano, con un alcance cerca de 55 millones de hectáreas para el 2024.",
        URL_SERVICIO: "https://mapas.igac.gov.co/server/rest/services/otros/coberturaaltaresolucion/MapServer",
        TIPO: "Arcgis MapServer",
    };
    updateServicioDetalle();
}

function updateServicioDetalle() {
    $("#detalleServicioNombre").html(currentServicio.NOMBRE);
    var strHTML = "";
    if (currentServicio.ID_ENTIDAD != null && currentServicio.ID_ENTIDAD != "") {
        strHTML = strHTML + "<b>Entidad:&nbsp;</b>" + getEntidadById(currentServicio.ID_ENTIDAD).text + "<br />";
    }
    if (currentServicio.RESUMEN != null && currentServicio.RESUMEN != "") {
        strHTML = strHTML + "<b>Resumen:&nbsp;</b><p style='line-height: 1.1em;'>" + currentServicio.RESUMEN + "</p>";
    }
    if (currentServicio.ESCALA != null && currentServicio.ESCALA != "") {
        strHTML = strHTML + "<b>Nivel de detalle:&nbsp;</b>" + currentServicio.ESCALA + "<br />";
    }
    if (currentServicio.FECHA != null && currentServicio.FECHA != "") {
        strHTML = strHTML + "<b>Fecha:&nbsp;</b>" + esri.moment(currentServicio.FECHA).format("DD-MM-YYYY") + "<br />";
    }
    if (currentServicio.LICENCIA != null && currentServicio.LICENCIA != "") {
        if (currentServicio.LICENCIA == "CC BY 4.0") {
            strHTML = strHTML + "<b>Licencia:&nbsp;</b><a href='https://creativecommons.org/licenses/by/4.0/deed.es' target='_blank'>" + currentServicio.LICENCIA + "</a><br/>";
        } else {
            if (currentServicio.LICENCIA == "CC BY SA 4.0") {
                strHTML = strHTML + "<b>Licencia:&nbsp;</b><a href='https://creativecommons.org/licenses/by-sa/4.0/deed.es' target='_blank'>" + currentServicio.LICENCIA + "</a><br/>";
            } else {
                strHTML = strHTML + "<b>Licencia:&nbsp;</b><p style='line-height: 1.1em;'>" + currentServicio.LICENCIA + "</p><br/>";
            }
        }
    }
    $("#detalleServicio").html(strHTML);

    if (currentServicio.URL_SERVICIO != null && currentServicio.URL_SERVICIO != "") {
        if (activeLayers.indexOf(currentServicio.NOMBRE) == -1) {
            $("#detalleServicioBtn").show();
            $("#detalleServicioBtn2").hide();
        } else {
            $("#detalleServicioBtn").hide();
            $("#detalleServicioBtn2").show();
        }
    } else {
        $("#detalleServicioBtn").hide();
        $("#detalleServicioBtn2").hide();
    }

    if (strHTML != "") {
        $("#detalleServicioDescarga").show();
    } else {
        $("#detalleServicioDescarga").hide();
    }
}

function backServicioDetalle() {
    $("#panelSearchServicioDetalle").hide();
    $("#panelSearchFiltroImagenes").show();
    $("#panelSearchNivelImagenes").show();
    $("#panelSearchNivelImagenesAlta").show();
}

function quitarServicio() {
    removeLayer(currentServicio.NOMBRE);
}

function removeLayer(id) {
    try {
        map.removeLayer(map.getLayer(id));
    } catch (err) {}
    try {
        activeLayers = activeLayers.filter((e) => e !== id);
    } catch (err) {}
    if (currentServicio != null) {
        if (currentServicio.NOMBRE == id) {
            $("#detalleServicioBtn").show();
            $("#detalleServicioBtn2").hide();
        }
    }
}

function loadServicio() {
    if (activeLayers.indexOf(currentServicio.NOMBRE) != -1) {
        showLoading("La capa ya se encuentra activa en el mapa", null, "red", true);
        return;
    }
    $("#detalleServicioBtn").hide();
    $("#detalleServicioBtn2").show();

    if (currentServicio.TIPO == "Arcgis MapServer") {
        addLayer_MapServer(currentServicio.URL_SERVICIO, currentServicio.NOMBRE);
    }
}

function addLayer_MapServer(url, name) {
    showLoading("Un segundo. Estamos agregando la capa...", "loading", "gold", false);
    var tlayer = new esri.ArcGISDynamicMapServiceLayer(url, {
        id: name,
    });
    tlayer.on("error", function (err) {
        if (err.message == "Request canceled") {
            return;
        }
        showLoading("No se pudo cargar la capa de informaci&oacute;n", null, "red", true);
    });
    tlayer.on("load", function () {
        showLoading("¡Listo! La capa fue agregada al mapa.", "ok", "#6BD279", true);
        var infoTemplates = {};
        for (var i = 0; i < this.layerInfos.length; i++) {
            infoTemplates[this.layerInfos[i].id] = {
                infoTemplate: new esri.InfoTemplate({ title: name }),
            };
        }
        this.setInfoTemplates(infoTemplates);
        activeLayers.unshift(this.id);
    });
    map.addLayer(tlayer);
}

function downloadServicio() {
    var pos = $("#detalleServicioFormato").val();
    if (currentUser == null) {
        showLoading("Para generar descargar archivos, debes iniciar la sesi&oacute;n", null, "red", true);
        gotoLogin();
        return;
    }
    showLoading("Descargando archivo", "loading", "gold", false);
    currentUser
        .getIdToken()
        .then(function (currentAccessToken) {
            var link = document.createElement("a");
            link.href = web_service + "/descargas?cmd=cobertura&tipo_descarga=" + pos + "&token=" + currentAccessToken;
            link.target = "_self";
            link.click();
        })
        .catch(function (_error) {
            showLoading("El archivo no se encuentra disponible para descarga", null, "red", true);
        });
}

function checkURL(url, mostrarAlerta) {
    var pattern = new RegExp("((http|https)(:\/\/))?([a-zA-Z0-9]+[.]{1}){2}[a-zA-z0-9]+(\/{1}[a-zA-Z0-9]+)*\/?", "i");
    if (pattern.test(url)) {
        return true;
    } else {
        if (mostrarAlerta) {
            showLoading("La URL ingresada no es valida", null, "red", true);
        }
        return false;
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return null;
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, "g"), replace);
}

window.Clipboard = (function (window, document, navigator) {
    var textArea, copy;

    function isOS() {
        return navigator.userAgent.match(/ipad|iphone/i);
    }

    function createTextArea(text) {
        textArea = document.createElement("textArea");
        textArea.value = text;
        document.body.appendChild(textArea);
    }

    function selectText() {
        var range, selection;

        if (isOS()) {
            range = document.createRange();
            range.selectNodeContents(textArea);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            textArea.setSelectionRange(0, 999999);
        } else {
            textArea.select();
        }
    }

    function copyToClipboard() {
        document.execCommand("copy");
        document.body.removeChild(textArea);
    }

    copy = function (text) {
        createTextArea(text);
        selectText();
        copyToClipboard();
    };

    return {
        copy: copy,
    };
})(window, document, navigator);

function initMap() {
    require(["esri/map", "esri/basemaps", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/ArcGISImageServiceLayer", "esri/layers/VectorTileLayer", "esri/layers/ImageParameters", "esri/layers/ImageServiceParameters", "esri/layers/MosaicRule", "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer", "esri/layers/RasterLayer", "esri/layers/RasterFunction", "esri/layers/WMSLayer", "esri/layers/WFSLayer", "esri/layers/WMTSLayer", "esri/layers/WebTiledLayer", "esri/layers/MapImageLayer", "esri/layers/MapImage", "app/geojsonlayer", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/CartographicLineSymbol", "esri/symbols/TextSymbol", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/Font", "esri/geometry/Point", "esri/geometry/Circle", "esri/geometry/Polyline", "esri/geometry/Polygon", "esri/geometry/Extent", "esri/graphic", "esri/Color", "esri/InfoTemplate", "esri/graphicsUtils", "esri/renderers/jsonUtils", "esri/renderers/SimpleRenderer", "esri/units", "esri/TimeExtent", "esri/geometry/screenUtils", "esri/geometry/scaleUtils", "esri/geometry/webMercatorUtils", "esri/geometry/geometryEngine", "esri/geometry/jsonUtils", "esri/geometry/ScreenPoint", "esri/tasks/query", "esri/tasks/QueryTask", "esri/tasks/RelationshipQuery", "esri/tasks/locator", "esri/tasks/GeometryService", "esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters", "esri/dijit/LocateButton", "esri/dijit/HomeButton", "esri/dijit/OverviewMap", "esri/dijit/Scalebar", "esri/dijit/Legend", "esri/dijit/Measurement", "esri/dijit/Print", "esri/dijit/LayerSwipe", "esri/dijit/Basemap", "esri/dijit/BasemapLayer", "esri/dijit/Popup", "esri/dijit/PopupTemplate", "esri/dijit/TimeSlider", "esri/toolbars/draw", "esri/toolbars/edit", "dojo/dom-construct", "dojo/dnd/Moveable", "esri/urlUtils", "moment", "esri/dijit/FeatureTable", "esri/layers/RasterFunction", "esri/request"], function (
        __Map,
        __Basemaps,

        __ArcGISTiledMapServiceLayer,
        __ArcGISDynamicMapServiceLayer,
        __ArcGISImageServiceLayer,
        __VectorTileLayer,
        __ImageParameters,
        __ImageServiceParameters,
        __MosaicRule,
        __GraphicsLayer,
        __FeatureLayer,
        __RasterLayer,
        __RasterFunction,
        __WMSLayer,
        __WFSLayer,
        __WMTSLayer,
        __WebTiledLayer,
        __MapImageLayer,
        __MapImage,
        __GeoJsonFeatureLayer,

        __PictureMarkerSymbol,
        __SimpleFillSymbol,
        __SimpleLineSymbol,
        __CartographicLineSymbol,
        __TextSymbol,
        __SimpleMarkerSymbol,
        __Font,

        __Point,
        __Circle,
        __Polyline,
        __Polygon,
        __Extent,

        __Graphic,
        __Color,
        __InfoTemplate,
        __graphicsUtils,
        __jsonUtilsRenderer,
        __SimpleRenderer,
        __units,
        __TimeExtent,

        __screenUtils,
        __scaleUtils,
        __webMercatorUtils,
        __geometryEngine,
        __jsonUtilsGeometry,
        __ScreenPoint,

        __Query,
        __QueryTask,
        __RelationshipQuery,
        __Locator,
        __GeometryService,
        __IdentifyTask,
        __IdentifyParameters,

        __LocateButton,
        __HomeButton,
        __OverviewMap,
        __Scalebar,
        __Legend,
        __Measurement,
        __Print,
        __LayerSwipe,
        __Basemap,
        __BasemapLayer,
        __Popup,
        __PopupTemplate,
        __TimeSlider,

        __Draw,
        __Edit,

        __domConstruct,
        __Moveable,

        __urlUtils,
        __Moment,

        __FeatureTable,
        __RasterFunction,

        __request,
    ) {
        esri.Map = __Map;
        esri.Basemaps = __Basemaps;

        esri.ArcGISTiledMapServiceLayer = __ArcGISTiledMapServiceLayer;
        esri.ArcGISDynamicMapServiceLayer = __ArcGISDynamicMapServiceLayer;
        esri.ArcGISImageServiceLayer = __ArcGISImageServiceLayer;
        esri.VectorTileLayer = __VectorTileLayer;

        esri.ImageParameters = __ImageParameters;
        ((esri.ImageServiceParameters = __ImageServiceParameters), (esri.MosaicRule = __MosaicRule), (esri.GraphicsLayer = __GraphicsLayer));
        esri.FeatureLayer = __FeatureLayer;
        esri.RasterLayer = __RasterLayer;
        esri.RasterFunction = __RasterFunction;
        esri.WMSLayer = __WMSLayer;
        esri.WFSLayer = __WFSLayer;
        esri.WMTSLayer = __WMTSLayer;
        esri.WebTiledLayer = __WebTiledLayer;
        esri.MapImageLayer = __MapImageLayer;
        esri.MapImage = __MapImage;
        esri.GeoJsonFeatureLayer = __GeoJsonFeatureLayer;

        esri.PictureMarkerSymbol = __PictureMarkerSymbol;
        esri.SimpleFillSymbol = __SimpleFillSymbol;
        esri.SimpleLineSymbol = __SimpleLineSymbol;
        esri.CartographicLineSymbol = __CartographicLineSymbol;
        esri.TextSymbol = __TextSymbol;
        esri.SimpleMarkerSymbol = __SimpleMarkerSymbol;
        esri.Font = __Font;

        esri.Point = __Point;
        esri.Circle = __Circle;
        esri.Polyline = __Polyline;
        esri.Polygon = __Polygon;
        esri.Extent = __Extent;

        esri.Graphic = __Graphic;
        esri.Color = __Color;
        esri.InfoTemplate = __InfoTemplate;
        esri.graphicsUtils = __graphicsUtils;
        esri.jsonUtilsRenderer = __jsonUtilsRenderer;
        esri.SimpleRenderer = __SimpleRenderer;
        esri.units = __units;
        esri.TimeExtent = __TimeExtent;

        esri.screenUtils = __screenUtils;
        esri.scaleUtils = __scaleUtils;
        esri.webMercatorUtils = __webMercatorUtils;
        esri.geometryEngine = __geometryEngine;
        esri.jsonUtilsGeometry = __jsonUtilsGeometry;
        esri.ScreenPoint = __ScreenPoint;

        esri.Query = __Query;
        esri.QueryTask = __QueryTask;
        esri.RelationshipQuery = __RelationshipQuery;
        esri.Locator = __Locator;
        esri.GeometryService = __GeometryService;
        esri.IdentifyTask = __IdentifyTask;
        esri.IdentifyParameters = __IdentifyParameters;

        esri.LocateButton = __LocateButton;
        esri.HomeButton = __HomeButton;
        esri.OverviewMap = __OverviewMap;
        esri.Scalebar = __Scalebar;
        esri.Legend = __Legend;
        esri.Measurement = __Measurement;
        esri.Print = __Print;
        esri.LayerSwipe = __LayerSwipe;
        esri.Basemap = __Basemap;
        esri.BasemapLayer = __BasemapLayer;
        esri.Popup = __Popup;
        esri.PopupTemplate = __PopupTemplate;
        esri.TimeSlider = __TimeSlider;

        esri.Draw = __Draw;
        esri.Edit = __Edit;

        esri.domConstruct = __domConstruct;
        esri.Moveable = __Moveable;
        esri.urlUtils = __urlUtils;

        esri.FeatureTable = __FeatureTable;

        esri.config.defaults.io.proxyUrl = web_service_proxy + "/proxy.jsp";
        esri.config.defaults.io.alwaysUseProxy = false;
        esri.moment = __Moment;

        esri.RasterFunction = __RasterFunction;
        esri.config.defaults.io.proxyUrl = web_service_proxy + "/proxy.jsp";
        esri.config.defaults.io.corsEnabledServers.push("services.sentinel-hub.com");
        esri.config.defaults.io.corsEnabledServers.push("mapas2.igac.gov.co");
        esri.config.defaults.io.corsEnabledServers.push("mapas_age.igac.gov.co");
        esri.config.defaults.io.corsEnabledServers.push("serviciosgeovisor.igac.gov.co");
        if (typeof esriConfig !== "undefined" && esriConfig.defaults && esriConfig.defaults.io) {
            esriConfig.defaults.io.corsEnabledServers.push("services.sentinel-hub.com");
            esriConfig.defaults.io.corsEnabledServers.push("mapas2.igac.gov.co");
            esriConfig.defaults.io.corsEnabledServers.push("mapas_age.igac.gov.co");
            esriConfig.defaults.io.corsEnabledServers.push("serviciosgeovisor.igac.gov.co");
        }

        __request.setRequestPreCallback(function myCallbackFunction(ioArgs) {
            if (ioArgs.url.indexOf("services.sentinel-hub.com") != -1) {
                if (currentSHToken != null) {
                    ioArgs.headers["Authorization"] = "Bearer " + currentSHToken;
                }
            }
            return ioArgs;
        });

        setupMap();
        signIn();
    });
}

function setupMap() {
    popup = new esri.Popup(
        {
            titleInBody: true,
            popupWindow: true,
        },
        esri.domConstruct.create("div"),
    );
    popup.on("selection-change", function () {
        if ($("#descargarPop").length == 0) {
        }
        popup.setContent("Cargando...");
        if (popup.getSelectedFeature()) {
            if (popup.getSelectedFeature().getLayer().declaredClass == "esri.layers.WMSLayer") {
            } else {
                popup.setContent(getItemtoText(popup.getSelectedFeature()));
                popup.show();
            }
        }
    });
    /*
    popup.on("clear-features", function () {
        $("#contentPopup").html("No hay elementos seleccionados");
    });
    */
    esri.basemaps.igac = {
        baseMapLayers: [{ type: "VectorTile", url: "https://tiles.arcgis.com/tiles/RVvWzU3lgJISqdke/arcgis/rest/services/Mapa_base_topografico/VectorTileServer" }],
        title: "Mapa Topográfico Colombia",
    };
    esri.basemaps.igachibrido = {
        baseMapLayers: [{ url: "https://tiles.arcgis.com/tiles/RVvWzU3lgJISqdke/arcgis/rest/services/Mapa_Hibrido/MapServer" }],
        title: "Mapa Híbrido Colombia",
    };
    esri.basemaps.igacsatelital = {
        baseMapLayers: [{ url: "https://tiles.arcgis.com/tiles/RVvWzU3lgJISqdke/arcgis/rest/services/Mapa_Satelital/MapServer" }],
        title: "Mapa Satelital Colombia",
    };
    esri.basemaps.igacusosuelo = {
        baseMapLayers: [{ type: "VectorTile", url: "https://tiles.arcgis.com/tiles/RVvWzU3lgJISqdke/arcgis/rest/services/MapaBaseConsultaUso/VectorTileServer" }],
        title: "Uso del suelo",
    };

    esri.basemaps.igacfisico = {
        baseMapLayers: [{ url: "https://tiles.arcgis.com/tiles/RVvWzU3lgJISqdke/arcgis/rest/services/Mapa_Fisico_Relieve/MapServer" }, { type: "VectorTile", url: "https://tiles.arcgis.com/tiles/RVvWzU3lgJISqdke/arcgis/rest/services/Mapa_base_fisico_vector/VectorTileServer" }],
        title: "Mapa Físico Colombia",
    };

    esri.basemaps.igacterreno = {
        baseMapLayers: [{ url: "https://tiles.arcgis.com/tiles/RVvWzU3lgJISqdke/arcgis/rest/services/MapaBaseTerreno/MapServer" }, { type: "VectorTile", url: "https://tiles.arcgis.com/tiles/RVvWzU3lgJISqdke/arcgis/rest/services/MapaBaseTerrenoVector/VectorTileServer" }],
        title: "Mapa Terreno Colombia",
    };

    esri.basemaps.igaclonanegra = {
        baseMapLayers: [{ type: "VectorTile", url: "https://tiles.arcgis.com/tiles/RVvWzU3lgJISqdke/arcgis/rest/services/MapaLonaNegra/VectorTileServer" }],
        title: "Mapa Lona Negra Colombia",
    };

    esri.basemaps.igaclonaazul = {
        baseMapLayers: [{ type: "VectorTile", url: "https://tiles.arcgis.com/tiles/RVvWzU3lgJISqdke/arcgis/rest/services/MapaLonaAzul/VectorTileServer" }],
        title: "Mapa Lona Azul Colombia",
    };

    esri.basemaps.igacsatelitaltopo = {
        baseMapLayers: [{ url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer" }],
        title: "Mapa Satelital Colombia",
    };

    currentBasemap = getParameterByName("b");
    if (currentBasemap != null) {
    } else {
        currentBasemap = "igac";
    }

    default_extent = new esri.Extent({
        xmin: -86.25559680664145,
        ymin: -4.496767298712775,
        xmax: -62.239483525397816,
        ymax: 14.437589074108095,
        spatialReference: {
            wkid: 4326,
        },
    });

    var extent_param = getParameterByName("e");
    var extent_value = esri.webMercatorUtils.geographicToWebMercator(default_extent);
    if (extent_param != null) {
        try {
            extent_value = esri.webMercatorUtils.geographicToWebMercator(
                new esri.Extent({
                    xmin: parseFloat(extent_param.split(",")[0]),
                    ymin: parseFloat(extent_param.split(",")[1]),
                    xmax: parseFloat(extent_param.split(",")[2]),
                    ymax: parseFloat(extent_param.split(",")[3]),
                    spatialReference: {
                        wkid: parseInt(extent_param.split(",")[4]),
                    },
                }),
            );
            extentInicial = extent_value;
        } catch (err) {}
        map = new esri.Map("mapViewDiv", {
            basemap: currentBasemap,
            sliderPosition: "bottom-right",
            extent: extent_value,
            infoWindow: popup,
            maxZoom: 19,
            minZoom: 4,
            showLabels: true,
        });
    } else {
        map = new esri.Map("mapViewDiv", {
            basemap: currentBasemap,
            sliderPosition: "bottom-right",
            center: default_extent.getCenter(),
            infoWindow: popup,
            maxZoom: 19,
            minZoom: 4,
            showLabels: true,
        });
        map.setZoom(5);
    }

    map.on("load", function () {});
    map.on("click", function (event) {
        if (event.graphic != null) {
            if (event.graphic.getLayer() != dibujoLayer) {
                editTool.deactivate();
            }
            if (event.graphic.getLayer() != areaLayer3) {
                editTool3.deactivate();
            }
        } else {
            if (editTool.getCurrentState().graphic != null) {
                editTool.deactivate();
            }
            if (editTool3.getCurrentState().graphic != null) {
                editTool.deactivate();
            }
        }
    });
    map.on("resize", function () {
        resizeCenter = map.extent.getCenter();
        setTimeout(function () {
            map.centerAt(resizeCenter);
        }, 100);
    });

    map.on("extent-change", function () {
        $("#panelLayersZoom").html(" - Zoom: " + map.getZoom());
    });
    map.on("click", function (event) {});

    overviewMap = new esri.OverviewMap({
        map: map,
        visible: false,
        attachTo: "bottom-left",
        height: 200,
        width: 200,
    });
    overviewMap.startup();
    locateBtn = new esri.LocateButton(
        {
            map: map,
            scale: 25000,
        },
        "locateButton",
    );
    locateBtn.startup();

    homeBtn = new esri.HomeButton(
        {
            map: map,
        },
        "homeButton",
    );
    homeBtn.startup();
    overviewMap = new esri.OverviewMap({
        map: map,
        visible: false,
        attachTo: "bottom-right",
        height: 200,
        width: 200,
    });
    scalebar = new esri.Scalebar(
        {
            map: map,
            scalebarUnit: "metric",
            attachTo: "bottom-left",
            scalebarStyle: "line",
        },
        $(".esriControlsBR")[0],
    );

    legend = new esri.Legend(
        {
            map: map,
            autoUpdate: false,
        },
        "legendDiv",
    );

    /* basemap */

    $("#selectBasemapPanel").on("change", function (e) {
        currentBasemap = e.target.options[e.target.selectedIndex].value;
        map.setBasemap(currentBasemap);
    });
    map.on("basemap-change", function (evt) {
        if (overviewMap.visible) {
            overviewMap.destroy();
            overviewMap = new esri.OverviewMap({
                map: map,
                visible: false,
                attachTo: "bottom-right",
            });
            overviewMap.startup();
            overviewMap.show();
        } else {
            overviewMap.destroy();
            overviewMap = new esri.OverviewMap({
                map: map,
                visible: false,
                attachTo: "bottom-right",
            });
            overviewMap.startup();
        }
    });

    map.on("extent-change", function (evt) {});

    map.on("zoom-end", function (evt) {});

    /* Coordenadas */
    hoverHandle = map.on("mouse-move", function (evt) {
        updateCoordenada(evt);
    });
    var infoTemplate = new esri.InfoTemplate();
    coordsLayer = new esri.GraphicsLayer({
        infoTemplate: infoTemplate,
    });
    pointMarker = new esri.PictureMarkerSymbol("/images/map-marker.png", 32, 32);
    map.addLayer(coordsLayer);

    $("#querySearchCoordinateFormat").on("change", function (e) {
        $("#querySearchCoordinateLatitudLabel").html(sistemasCoordenadas[$("#querySearchCoordinateFormat").val()].labLat);
        $("#querySearchCoordinateLongitudLabel").html(sistemasCoordenadas[$("#querySearchCoordinateFormat").val()].labLng);
        $("#querySearchCoordinateLatitud").attr("placeholder", sistemasCoordenadas[$("#querySearchCoordinateFormat").val()].labelLat);
        $("#querySearchCoordinateLongitud").attr("placeholder", sistemasCoordenadas[$("#querySearchCoordinateFormat").val()].labelLng);
    });

    /* Imprimir */
    printer = esri.Print(
        {
            map: map,
            url: print_service,
        },
        "printDiv",
    );
    printer.on("print-complete", function (evt) {
        closeLoading();
        var link = document.createElement("a");
        link.download = "PMB-Impresion." + $("#selectPrintFormat").val();
        link.href = evt.result.url;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    printer.on("error", function (_evt) {
        showLoading("No se pudo imprimir el mapa", null, "red", true);
    });
    printer.startup();

    /* Leyenda */
    legend = new esri.Legend(
        {
            map: map,
            autoUpdate: false,
        },
        "leyendaDiv",
    );
    legend.startup();

    var params = "";

    searchGraphicsLayer = new esri.GraphicsLayer({
        infoTemplate: new esri.InfoTemplate(),
    });
    searchGraphicsLayer.infoTemplate = null;
    searchGraphicsLayerDetalle = new esri.GraphicsLayer({
        infoTemplate: new esri.InfoTemplate(),
    });
    searchGraphicsLayerDetalle.infoTemplate = null;

    searchImageLayer = new esri.MapImageLayer();
    /*
      searchImageLayerDetalle = new esri.MapImageLayer();
    */
    var params = new esri.ImageServiceParameters();
    searchImageLayerDetalle = new esri.ArcGISImageServiceLayer(thumb_service, {
        imageServiceParameters: params,
        format: "jpgpng",
    });
    searchGraphicsLayer.setVisibility(false);
    searchGraphicsLayerDetalle.setVisibility(false);
    searchImageSwipeDetalle = new esri.LayerSwipe(
        {
            type: "vertical",
            map: map,
            layers: [searchImageLayerDetalle],
            enabled: false,
        },
        "swipeDiv",
    );
    searchImageSwipeDetalle.startup();

    map.addLayer(searchGraphicsLayer);
    map.addLayer(searchGraphicsLayerDetalle);

    swipeLayer = new esri.MapImageLayer();
    map.addLayer(swipeLayer);
    swipeWidget = new esri.LayerSwipe(
        {
            type: "vertical",
            map: map,
            layers: [swipeLayer],
            enabled: false,
        },
        "swipe2Div",
    );
    swipeWidget.startup();

    swipeWidget2 = new esri.LayerSwipe(
        {
            type: "horizontal",
            map: map,
            layers: [swipeLayer],
            enabled: false,
        },
        "swipe4Div",
    );
    swipeWidget2.startup();
    $("#btnTiempoMode2")
        .colorpicker({
            horizontal: true,
            customClass: "customPicker",
            color: "#000000FF",
            template: "<div class='colorpicker dropdown-menu'>" + "<div class='colorpicker-saturation'><i><b></b></i></div>" + "<div class='colorpicker-hue'><i></i></div>" + "<div class='colorpicker-alpha'><i></i></div>" + "<div class='colorpicker-text' data-layer-color='swipe'></div>" + "<div class='colorpicker-color'><div /></div>" + "</div>",
        })
        .on("changeColor", function (e) {
            currentAlpha = e.color.getValue().a;
            if (swipeLayer1 != null) {
                swipeLayer1.setOpacity(currentAlpha);
            }
            if (swipeLayer2 != null) {
                swipeLayer2.setOpacity(1 - currentAlpha);
            }
            $(".colorpicker-text[data-layer-color='swipe']").html((e.color.getValue().a * 100).toFixed(0) + "%");
        })
        .on("showPicker", function (e) {
            $(this).colorpicker("setValue", "rgba(0, 0, 0, " + currentAlpha + ")");
            $(".colorpicker-text[data-layer-color='swipe']").html((currentAlpha * 100).toFixed(0) + "%");
        });

    /*
    if (getParameterByName("imagen") != null) {
        params = params + "&imagen=" + getParameterByName("imagen");
    }
    */
    if (getParameterByName("u") != null) {
        params = params + "&unidad=" + getParameterByName("u");
    }
    $("#licenciaEntidad3").select2({
        language: {
            noResults: function () {
                return "¿No encuentra su entidad? Seleccione Otra Entidad";
            },
        },
    });

    $("#licenciaEntidad3").on("change", function (e) {
        $("#licenciaEntidad").val($("#licenciaEntidad3").val());
        if ($("#licenciaEntidad3").val() == "") {
            $("#licenciaEntidad").show();
        } else {
            $("#licenciaEntidad").hide();
        }
    });

    /* Raster */
    swipe2Layer = new esri.MapImageLayer();
    map.addLayer(swipe2Layer);
    rasterImageSwipe = new esri.LayerSwipe(
        {
            type: "vertical",
            map: map,
            layers: [swipe2Layer],
            enabled: false,
        },
        "swipe3Div",
    );
    rasterImageSwipe.startup();

    $("#rasterImagenOpacity")
        .colorpicker({
            horizontal: true,
            customClass: "customPicker",
            color: "#000000FF",
            template: "<div class='colorpicker dropdown-menu'>" + "<div class='colorpicker-saturation'><i><b></b></i></div>" + "<div class='colorpicker-hue'><i></i></div>" + "<div class='colorpicker-alpha'><i></i></div>" + "<div class='colorpicker-text' data-layer-color='imagen'></div>" + "<div class='colorpicker-color'><div /></div>" + "</div>",
        })
        .on("changeColor", function (e) {
            currentRaster.setOpacity(e.color.getValue().a);
            $(".colorpicker-text[data-layer-color='imagen']").html((e.color.getValue().a * 100).toFixed(0) + "%");
        })
        .on("showPicker", function (e) {
            $(this).colorpicker("setValue", "rgba(0, 0, 0, " + currentRaster.opacity + ")");
            $(".colorpicker-text[data-layer-color='imagen']").html((currentRaster.opacity * 100).toFixed(0) + "%");
        });

    /* Search */
    // Borde azul claro y relleno transparente para zonas clasificadas
    searchImagenSymbol = new esri.SimpleFillSymbol(
        esri.SimpleFillSymbol.STYLE_NULL,
        new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.Color(CLASSIFIED_POLYGON_BORDER_COLOR), CLASSIFIED_POLYGON_BORDER_WIDTH),
        new esri.Color([80, 210, 210, 0])
    );
    searchCoberturaSymbol = new esri.SimpleFillSymbol(esri.SimpleFillSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.Color([0, 0, 0, 0.5]), 4), new esri.Color([0, 0, 0, 0]));
    searchImagenActiveSymbol = new esri.SimpleFillSymbol(esri.SimpleFillSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.Color([64, 147, 208, 0.5]), 2), new esri.Color([64, 147, 208, 0]));

    $("html").keyup(function (e) {
        if (e.keyCode == 46) {
            if (editTool.getCurrentState().graphic != null) {
                if (modoSearch == "area") {
                    areaLayer.remove(editTool.getCurrentState().graphic);
                    editTool.deactivate();
                }
            }
            if (editTool3.getCurrentState().graphic != null) {
                areaLayer3.remove(editTool3.getCurrentState().graphic);
                editTool3.deactivate();
            }
        }
    });

    /* Area/GeoJSON */
    areaLayer = new esri.GraphicsLayer({
        id: "Area",
    });
    areaLayer.setVisibility(false);
    areaLayer.on("click", function (evt) {
        if (evt.graphic != null) {
            editTool.activate(esri.Edit.MOVE | esri.Edit.EDIT_VERTICES | esri.Edit.SCALE | esri.Edit.ROTATE, evt.graphic, {
                allowAddVertices: true,
                allowDeleteVertices: true,
                uniformScaling: true,
            });
        }
    });
    drawTool2 = new esri.Draw(map);
    drawTool2.on("draw-end", function (evt) {
        map.enableMapNavigation();
        drawTool2.deactivate();

        var cLineDef = esri.Color.fromArray([255, 0, 0, 1.0]);
        var cFillDef = esri.Color.fromArray([255, 0, 0, 0.5]);
        var symbol = new esri.SimpleFillSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineDef, 2), cFillDef);

        var g = new esri.Graphic(evt.geometry, symbol);
        areaLayer.clear();
        areaLayer.add(g);
        map.setExtent(esri.graphicsUtils.graphicsExtent(areaLayer.graphics).expand(2));
        editTool2.deactivate();
    });
    drawTool2.deactivate();
    editTool2 = new esri.Edit(map, {
        textSymbolEditorHolder: "txtSymbolEditorHolder",
    });
    editTool2.on("activate", function (evt) {
        var cLineDef = esri.Color.fromArray([255, 0, 0, 1.0]);
        var cFillDef = esri.Color.fromArray([255, 0, 0, 0.5]);
        if (editTool2.getCurrentState().graphic.symbol.type == "simplefillsymbol") {
            editTool2.getCurrentState().graphic.setSymbol(new esri.SimpleFillSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineDef, 2), cFillDef));
        }
    });
    editTool2.deactivate();
    map.addLayer(areaLayer);
    fileLayer = new esri.GraphicsLayer({
        id: "File",
    });
    fileLayer.setVisibility(false);
    map.addLayer(fileLayer);

    $("#file").change(function (e) {
        var files = $("#file")[0].files;
        for (var i = 0; i < files.length; i++) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var dataJSON = Terraformer.ArcGIS.fromGeoJSON(JSON.parse(e.target.result));
                var cLineDef = esri.Color.fromArray([255, 0, 0, 1.0]);
                var cFillDef = esri.Color.fromArray([255, 0, 0, 0.5]);
                var symbol = new esri.SimpleFillSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineDef, 2), cFillDef);

                for (var i = 0; i < dataJSON.length; i++) {
                    var _geometry = esri.webMercatorUtils.geographicToWebMercator(esri.jsonUtilsGeometry.fromJson(dataJSON[i].geometry));
                    var g = new esri.Graphic(_geometry, symbol);
                    fileLayer.add(g);
                }
                map.setExtent(esri.graphicsUtils.graphicsExtent(fileLayer.graphics).expand(2));
            };
            reader.readAsText(files[i]);
        }
    });

    /* SH Stats */
    areaLayer3 = new esri.GraphicsLayer({
        id: "Area3",
    });
    areaLayer3.setVisibility(false);
    areaLayer3.on("click", function (evt) {
        if (evt.graphic != null) {
            editTool3.activate(esri.Edit.MOVE | esri.Edit.EDIT_VERTICES | esri.Edit.SCALE | esri.Edit.ROTATE, evt.graphic, {
                allowAddVertices: true,
                allowDeleteVertices: true,
                uniformScaling: true,
            });
        }
    });
    drawTool3 = new esri.Draw(map);
    drawTool3.on("draw-end", function (evt) {
        map.enableMapNavigation();
        drawTool3.deactivate();

        var cLineDef = esri.Color.fromArray([255, 0, 0, 1.0]);
        var cFillDef = esri.Color.fromArray([255, 0, 0, 0]);
        var symbol = new esri.SimpleFillSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineDef, 2), cFillDef);

        var g = new esri.Graphic(evt.geometry, symbol);
        areaLayer3.clear();
        fileLayer2.clear();
        areaLayer3.add(g);
        ensureBurnPolygonsOnTop();
        map.setExtent(esri.graphicsUtils.graphicsExtent(areaLayer3.graphics).expand(2));
        editTool3.deactivate();
    });
    drawTool3.deactivate();
    editTool3 = new esri.Edit(map, {
        textSymbolEditorHolder: "txtSymbolEditorHolder",
    });
    editTool3.on("activate", function (evt) {
        var cLineDef = esri.Color.fromArray([255, 0, 0, 1.0]);
        var cFillDef = esri.Color.fromArray([255, 0, 0, 0.5]);
        if (editTool3.getCurrentState().graphic.symbol.type == "simplefillsymbol") {
            editTool3.getCurrentState().graphic.setSymbol(new esri.SimpleFillSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineDef, 2), cFillDef));
        }
    });
    editTool3.deactivate();
    map.addLayer(areaLayer3);
    fileLayer2 = new esri.GraphicsLayer({
        id: "File2",
    });
    fileLayer2.setVisibility(false);
    map.addLayer(fileLayer2);

    $("#areaFile2").change(function (e) {
        var files = $("#areaFile2")[0].files;
        for (var i = 0; i < files.length; i++) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var dataJSON = Terraformer.ArcGIS.fromGeoJSON(JSON.parse(e.target.result));
                var cLineDef = esri.Color.fromArray([255, 0, 0, 1.0]);
                var cFillDef = esri.Color.fromArray([255, 0, 0, 0]);
                var symbol = new esri.SimpleFillSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineDef, 2), cFillDef);
                clearSHStatsWorkArea();
                for (var i = 0; i < dataJSON.length; i++) {
                    var _geometry = esri.webMercatorUtils.geographicToWebMercator(esri.jsonUtilsGeometry.fromJson(dataJSON[i].geometry));
                    var g = new esri.Graphic(_geometry, symbol);
                    fileLayer2.add(g);
                }
                ensureBurnPolygonsOnTop();
                map.setExtent(esri.graphicsUtils.graphicsExtent(fileLayer2.graphics).expand(2));
            };
            reader.readAsText(files[i]);
        }
    });
    $("#selectSHStats1").datepicker({
        format: "dd/mm/yyyy",
        language: "es",
        orientation: "bottom",
    });
    $("#selectSHStatsIdx").on("change", function (e) {
        $("#divSHStatsTool").popover("hide");
        if (e.target.options[e.target.selectedIndex].value == null || e.target.options[e.target.selectedIndex].value == "NDSI" || e.target.options[e.target.selectedIndex].value == "") {
            $("#divSHStatsTool").hide();
        } else {
            $("#divSHStatsTool").show();
            $("#divSHStatsTool").attr("data-content", "<img class='image-sh-pop' width='400' src='../images/" + e.target.options[e.target.selectedIndex].value + ".png' style='background: white;' />");
        }
        // if (e.target.options[e.target.selectedIndex].value == "NBR" || e.target.options[e.target.selectedIndex].value == "NBR2" || e.target.options[e.target.selectedIndex].value == "MAP_DEFORESTATION") {
        if (e.target.options[e.target.selectedIndex].value == "NBR" || e.target.options[e.target.selectedIndex].value == "NBR2") {
            $("#sliderCCSHStatsContainer").show();
            $("#selectSHStatsAggContainer").hide();
            if (e.target.options[e.target.selectedIndex].value == "NBR") {
                $("#sliderCCSHStatsIndexContainer").show();
                $("#sliderCCSHStatsIndexContainer .sh-inline-info").popover({
                    container: "body",
                    html: true,
                    placement: "left",
                    trigger: "hover"
                });
            } else {
                $("#sliderCCSHStatsIndexContainer .sh-inline-info").popover("hide");
                $("#sliderCCSHStatsIndexContainer").hide();
            }
        } else {
            if (e.target.options[e.target.selectedIndex].value == "MAP_DEFORESTATION") {
                $("#sliderCCSHStatsContainer").hide();
                $("#selectSHStatsAggContainer").hide();
                $("#sliderCCSHStatsIndexContainer").hide();
            } else {
                $("#sliderCCSHStatsContainer").hide();
                $("#selectSHStatsAggContainer").show();
                $("#sliderCCSHStatsIndexContainer").hide();
            }
        }
    });
    $("#selectSHStats2").datepicker({
        format: "dd/mm/yyyy",
        language: "es",
        orientation: "bottom",
    });
    sliderSHStats = new Slider("#sliderSHStats");

    /* Prisma */
    areaLayer4 = new esri.GraphicsLayer({
        id: "Area4",
    });
    areaLayer4.setVisibility(false);
    areaLayer4.on("click", function (evt) {
        if (evt.graphic != null) {
            editTool4.activate(esri.Edit.MOVE | esri.Edit.EDIT_VERTICES | esri.Edit.SCALE | esri.Edit.ROTATE, evt.graphic, {
                allowAddVertices: true,
                allowDeleteVertices: true,
                uniformScaling: true,
            });
        }
    });
    drawTool4 = new esri.Draw(map);
    drawTool4.on("draw-end", function (evt) {
        map.enableMapNavigation();
        drawTool4.deactivate();

        var cLineDef = esri.Color.fromArray([255, 0, 0, 1.0]);
        var cFillDef = esri.Color.fromArray([255, 0, 0, 0]);
        var symbol = new esri.SimpleFillSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineDef, 2), cFillDef);

        var g = new esri.Graphic(evt.geometry, symbol);
        areaLayer4.clear();
        fileLayer3.clear();
        areaLayer4.add(g);
        map.setExtent(esri.graphicsUtils.graphicsExtent(areaLayer4.graphics).expand(2));
        editTool4.deactivate();
    });
    drawTool4.deactivate();
    editTool4 = new esri.Edit(map, {
        textSymbolEditorHolder: "txtSymbolEditorHolder",
    });
    editTool4.on("activate", function (evt) {
        var cLineDef = esri.Color.fromArray([255, 0, 0, 1.0]);
        var cFillDef = esri.Color.fromArray([255, 0, 0, 0.5]);
        if (editTool4.getCurrentState().graphic.symbol.type == "simplefillsymbol") {
            editTool4.getCurrentState().graphic.setSymbol(new esri.SimpleFillSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineDef, 2), cFillDef));
        }
    });
    editTool4.deactivate();
    map.addLayer(areaLayer4);
    fileLayer3 = new esri.GraphicsLayer({
        id: "File3",
    });
    fileLayer3.setVisibility(false);
    map.addLayer(fileLayer3);

    $("#areaFile3").change(function (e) {
        var files = $("#areaFile3")[0].files;
        for (var i = 0; i < files.length; i++) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var dataJSON = Terraformer.ArcGIS.fromGeoJSON(JSON.parse(e.target.result));
                var cLineDef = esri.Color.fromArray([255, 0, 0, 1.0]);
                var cFillDef = esri.Color.fromArray([255, 0, 0, 0]);
                var symbol = new esri.SimpleFillSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineDef, 2), cFillDef);
                areaLayer4.clear();
                fileLayer3.clear();
                for (var i = 0; i < dataJSON.length; i++) {
                    var _geometry = esri.webMercatorUtils.geographicToWebMercator(esri.jsonUtilsGeometry.fromJson(dataJSON[i].geometry));
                    var g = new esri.Graphic(_geometry, symbol);
                    fileLayer3.add(g);
                }
                map.setExtent(esri.graphicsUtils.graphicsExtent(fileLayer3.graphics).expand(2));
            };
            reader.readAsText(files[i]);
        }
    });
    $("#selectPrisma1").datepicker({
        format: "dd/mm/yyyy",
        language: "es",
        orientation: "bottom",
    });
    $("#selectPrisma2").datepicker({
        format: "dd/mm/yyyy",
        language: "es",
        orientation: "bottom",
    });

    /* Raster Mosaics */
    areaLayerRasterMosaics = new esri.GraphicsLayer({
        id: "AreaRasterMosaics",
    });
    areaLayerRasterMosaics.setVisibility(false);
    areaLayerRasterMosaics.on("click", function (evt) {
        if (evt.graphic != null) {
            editToolRasterMosaics.activate(esri.Edit.MOVE | esri.Edit.EDIT_VERTICES | esri.Edit.SCALE | esri.Edit.ROTATE, evt.graphic, {
                allowAddVertices: true,
                allowDeleteVertices: true,
                uniformScaling: true,
            });
        }
    });
    drawToolRasterMosaics = new esri.Draw(map);
    drawToolRasterMosaics.on("draw-end", function (evt) {
        map.enableMapNavigation();
        drawToolRasterMosaics.deactivate();
        var cLineDef = esri.Color.fromArray([255, 0, 0, 1.0]);
        var cFillDef = esri.Color.fromArray([255, 0, 0, 0]);
        var symbol = new esri.SimpleFillSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineDef, 2), cFillDef);
        var g = new esri.Graphic(evt.geometry, symbol);
        areaLayerRasterMosaics.clear();
        fileLayerRasterMosaics.clear();
        clearRasterMosaicCatalogOverlays();
        areaLayerRasterMosaics.add(g);
        map.setExtent(esri.graphicsUtils.graphicsExtent(areaLayerRasterMosaics.graphics).expand(2));
        editToolRasterMosaics.deactivate();
    });
    drawToolRasterMosaics.deactivate();
    editToolRasterMosaics = new esri.Edit(map, {
        textSymbolEditorHolder: "txtSymbolEditorHolder",
    });
    editToolRasterMosaics.on("activate", function (evt) {
        var cLineDef = esri.Color.fromArray([255, 0, 0, 1.0]);
        var cFillDef = esri.Color.fromArray([255, 0, 0, 0]);
        if (editToolRasterMosaics.getCurrentState().graphic.symbol.type == "simplefillsymbol") {
            editToolRasterMosaics.getCurrentState().graphic.setSymbol(new esri.SimpleFillSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineDef, 2), cFillDef));
        }
    });
    editToolRasterMosaics.deactivate();
    map.addLayer(areaLayerRasterMosaics);
    fileLayerRasterMosaics = new esri.GraphicsLayer({
        id: "FileRasterMosaics",
    });
    fileLayerRasterMosaics.setVisibility(false);
    map.addLayer(fileLayerRasterMosaics);
    rasterMosaicFootprintLayer = new esri.GraphicsLayer({
        id: "RasterMosaicFootprintLayer",
    });
    rasterMosaicFootprintLayer.setVisibility(false);
    map.addLayer(rasterMosaicFootprintLayer);

    $("#areaFileRasterMosaics").change(function (e) {
        var files = $("#areaFileRasterMosaics")[0].files;
        for (var i = 0; i < files.length; i++) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var dataJSON = Terraformer.ArcGIS.fromGeoJSON(JSON.parse(e.target.result));
                var cLineDef = esri.Color.fromArray([255, 0, 0, 1.0]);
                var cFillDef = esri.Color.fromArray([255, 0, 0, 0]);
                var symbol = new esri.SimpleFillSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineDef, 2), cFillDef);
                areaLayerRasterMosaics.clear();
                fileLayerRasterMosaics.clear();
                clearRasterMosaicCatalogOverlays();
                for (var i = 0; i < dataJSON.length; i++) {
                    var _geometry = esri.webMercatorUtils.geographicToWebMercator(esri.jsonUtilsGeometry.fromJson(dataJSON[i].geometry));
                    var g = new esri.Graphic(_geometry, symbol);
                    fileLayerRasterMosaics.add(g);
                }
                map.setExtent(esri.graphicsUtils.graphicsExtent(fileLayerRasterMosaics.graphics).expand(2));
            };
            reader.readAsText(files[i]);
        }
    });

    $("#selectRasterMosaicIdx").on("change", function (e) {
        rasterMosaicCurrentIdx = e.target.options[e.target.selectedIndex].value;
        clearRasterMosaicImages();
    });

    $("#selectPrismaIdx").on("change", function (e) {
        if (e.target.options[e.target.selectedIndex].value == "analytics/bosque_tiles/") {
            $("#prismaOpt").show();
        } else {
            $("#prismaOpt").hide();
        }
    });
    sliderPrismaCloud = new Slider("#sliderPrismaCloud");
    currentPrismaLayer = new esri.GraphicsLayer({
        id: "Prisma",
        infoTemplate: null,
    });
    currentPrismaLayer.setVisibility(false);
    currentSHLayer = new esri.GraphicsLayer({
        id: "SHStats",
        infoTemplate: null,
    });
    // Añadir la capa de resultados al mapa y mostrarla por defecto
    currentSHLayer.setVisibility(true);
    map.addLayer(currentPrismaLayer);
    map.addLayer(currentSHLayer);

    /* Dibujar */
    dibujoLayer = new esri.GraphicsLayer({
        id: "Dibujo",
        infoTemplate: null,
    });
    map.addLayer(dibujoLayer);
    dibujoLayer.on("click", function (evt) {
        if ($("#panelDibujar").is(":visible")) {
            if (evt.graphic != null) {
                editTool.activate(esri.Edit.MOVE | esri.Edit.EDIT_VERTICES | esri.Edit.SCALE | esri.Edit.ROTATE, evt.graphic, {
                    allowAddVertices: true,
                    allowDeleteVertices: true,
                    uniformScaling: true,
                });
            } else {
                if (editToolState) {
                    editTool.deactivate();
                    $("#drawEdit").hide();
                }
            }
        }
    });
    drawTool = new esri.Draw(map);
    drawTool.on("draw-end", function (evt) {
        map.enableMapNavigation();
        drawTool.deactivate();

        var symbol = null;

        var cLine = esri.Color.fromString($("#drawOptLineColorInput").val()).toRgba();
        var cFill = esri.Color.fromString($("#drawOptFillColorInput").val()).toRgba();

        var cLineDef = esri.Color.fromArray(cLine);
        var cFillDef = esri.Color.fromArray(cFill);

        if (activeTool == "text") {
            symbol = new esri.TextSymbol($("#drawText").val(), new esri.Font("100%"), cFillDef);
        }
        if (activeTool == "point" || activeTool == "multipoint") {
            symbol = pointMarker;
        }
        if (activeTool == "line" || activeTool == "polyline" || activeTool == "freehandpolyline") {
            symbol = new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineDef, 2);
        }
        if (symbol == null) {
            symbol = new esri.SimpleFillSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, cLineDef, 2), cFillDef);
        }

        var g = new esri.Graphic(evt.geometry, symbol);
        dibujoLayer.add(g);
        editTool.activate(esri.Edit.MOVE | esri.Edit.EDIT_VERTICES | esri.Edit.SCALE | esri.Edit.ROTATE, g, {
            allowAddVertices: true,
            allowDeleteVertices: true,
            uniformScaling: true,
        });
        updateDibujoList();
    });
    drawTool.deactivate();
    editTool = new esri.Edit(map, {
        textSymbolEditorHolder: "txtSymbolEditorHolder",
    });
    editTool.on("activate", function (evt) {
        $("#drawEdit").show();
        $("#drawIntro").hide();
        $("#drawOptsFill").hide();
        $("#drawOptsText").hide();
        $("#drawOptsLine").hide();

        updateLock = true;
        if (evt.graphic.symbol.type == "textsymbol") {
            $("#drawOptsText").show();
            $("#drawText").val(evt.graphic.symbol.text);
            $("#drawOptsFill").show();
            $("#drawOptFillColor").colorpicker("setValue", evt.graphic.symbol.color.toString());
        }
        if (evt.graphic.symbol.type == "simplelinesymbol") {
            $("#drawOptsLine").show();
            $("#drawOptLineColor").colorpicker("setValue", evt.graphic.symbol.color.toString());
        }
        if (evt.graphic.symbol.type == "simplefillsymbol") {
            try {
                $("#drawOptsFill").show();
                $("#drawOptFillColor").colorpicker("setValue", evt.graphic.symbol.color.toString());
                $("#drawOptsLine").show();
                $("#drawOptLineColor").colorpicker("setValue", evt.graphic.symbol.outline.color.toString());
            } catch (err) {}
        }
        updateLock = false;
        updateEditGraphic();
        updateEditMeasure(evt.graphic);
    });
    editTool.on("graphic-move", function (evt) {
        updateEditMeasure(evt.graphic);
    });
    editTool.on("graphic-move-stop", function (evt) {
        updateEditMeasure(evt.graphic);
    });
    editTool.on("rotate", function (evt) {
        updateEditMeasure(evt.graphic);
    });
    editTool.on("rotate-stop", function (evt) {
        updateEditMeasure(evt.graphic);
    });
    editTool.on("scale", function (evt) {
        updateEditMeasure(evt.graphic);
    });
    editTool.on("scale-stop", function (evt) {
        updateEditMeasure(evt.graphic);
    });
    editTool.on("vertex-add", function (evt) {
        updateEditMeasure(evt.graphic);
    });
    editTool.on("vertex-delete", function (evt) {
        updateEditMeasure(evt.graphic);
    });
    editTool.on("vertex-move", function (evt) {
        updateEditMeasure(evt.graphic);
    });
    editTool.on("vertex-move-stop", function (evt) {
        updateEditMeasure(evt.graphic);
    });
    editTool.on("deactivate", function (_evt) {
        $("#drawEdit").hide();
    });
    editTool.deactivate();

    $("#drawOptLineColor")
        .colorpicker({})
        .on("changeColor", function (e) {
            $("#drawOptLineColorInput").val(e.color);
            $("#drawOptLineColor").css("color", e.color);
            if (editTool.getCurrentState().tool != 0 && !updateLock) {
                updateEditGraphic();
            }
        });
    $("#drawOptFillColor")
        .colorpicker({})
        .on("changeColor", function (e) {
            $("#drawOptFillColorInput").val(e.color);
            $("#drawOptFillColor").css("color", e.color);
            if (editTool.getCurrentState().tool != 0 && !updateLock) {
                updateEditGraphic();
            }
        });

    $("#drawText").on("change keyup paste", function (_e) {
        if (editTool.getCurrentState().tool != 0) {
            updateEditGraphic();
        }
    });
    $("#measureAreaUnit").on("change", function (_e) {
        updateEditMeasure();
    });
    $("#measureLengthUnit").on("change", function (_e) {
        updateEditMeasure();
    });

    /* Imagenes */
    searchImageLayer.setVisibility(true);
    searchImageLayerDetalle.setVisibility(false);
    map.addLayer(searchImageLayer);
    map.addLayer(searchImageLayerDetalle);

    $("#detalleImagenOpacity")
        .colorpicker({
            horizontal: true,
            customClass: "customPicker",
            color: "#000000FF",
            template: "<div class='colorpicker dropdown-menu'>" + "<div class='colorpicker-saturation'><i><b></b></i></div>" + "<div class='colorpicker-hue'><i></i></div>" + "<div class='colorpicker-alpha'><i></i></div>" + "<div class='colorpicker-text' data-layer-color='imagen'></div>" + "<div class='colorpicker-color'><div /></div>" + "</div>",
        })
        .on("changeColor", function (e) {
            if (currentMode == "media") {
                previewLayer.setOpacity(e.color.getValue().a);
                $(".colorpicker-text[data-layer-color='imagen']").html((e.color.getValue().a * 100).toFixed(0) + "%");
            }
            if (currentMode == "alta") {
                searchImageLayerDetalle.setOpacity(e.color.getValue().a);
                $(".colorpicker-text[data-layer-color='imagen']").html((e.color.getValue().a * 100).toFixed(0) + "%");
            }
        })
        .on("showPicker", function (e) {
            if (currentMode == "media") {
                $(this).colorpicker("setValue", "rgba(0, 0, 0, " + previewLayer.opacity + ")");
                $(".colorpicker-text[data-layer-color='imagen']").html((previewLayer.opacity * 100).toFixed(0) + "%");
            }
            if (currentMode == "alta") {
                $(this).colorpicker("setValue", "rgba(0, 0, 0, " + searchImageLayerDetalle.opacity + ")");
                $(".colorpicker-text[data-layer-color='imagen']").html((searchImageLayerDetalle.opacity * 100).toFixed(0) + "%");
            }
        });

    new esri.Moveable("panelLayers", { handle: "headingLeyenda" });
    new esri.Moveable("panelLeyenda", { handle: "headingLeyenda" });
    new esri.Moveable("panelImprimir", { handle: "headingImprimir" });
    new esri.Moveable("panelTiempo", { handle: "headingTiempo" });
    new esri.Moveable("panelLogin", { handle: "headingLogin" });
    new esri.Moveable("panelSH", { handle: "headingSH" });
    new esri.Moveable("panelSHStats", { handle: "headingSHStats" });
    new esri.Moveable("panelPrisma", { handle: "headingPrisma" });
    new esri.Moveable("panelSHAnalytics", { handle: "headingSHAnalytics" });

    isMapReady = true;
    if (pendingInitData) {
        var dataToInit = pendingInitData;
        pendingInitData = null;
        initData(dataToInit);
    }
}

function getDataLocal() {
    $.ajax({
        url: "cache/config.json",
        type: "GET",
        success: function (data) {
            initData(data);
        },
        error: function (_data) {},
    });
}

function getConfigValue(data, upperKey, lowerKey) {
    if (data == null) {
        return [];
    }
    if (data[upperKey] != null) {
        return data[upperKey];
    }
    if (data[lowerKey] != null) {
        return data[lowerKey];
    }
    return [];
}

function initData(data) {
    if (!isMapReady) {
        pendingInitData = data;
        return;
    }
    cacheUnidades = getConfigValue(data, "UNIDAD", "unidad");
    cacheMosaicos = getConfigValue(data, "MOSAICOS", "mosaicos");
    cacheTematicas = getConfigValue(data, "TEMATICA", "tematica");
    cacheEntidades = getConfigValue(data, "ENTIDAD", "entidad");
    cacheUnidadesFiltro = getConfigValue(data, "UNIDAD", "unidad");

    for (var i = 0; i < cacheUnidadesFiltro.length; i++) {
        if (cacheUnidadesFiltro[i].type == "DEPTO") {
            cacheUnidadesFiltro[i].disabled = true;
        }
    }

    $("#searchFiltro").select2({
        data: cacheUnidadesFiltro,
        multiple: false,
        placeholder: "Ej: Colombia",
        query: function (query) {
            if (query.term == null || query.term == "") {
                query.callback({ results: cacheUnidadesFiltro });
            } else {
                var results = [];
                for (var i = 0; i < cacheUnidadesFiltro.length; i++) {
                    if (limpiarTexto(cacheUnidadesFiltro[i].text).indexOf(limpiarTexto(query.term)) != -1) {
                        if (cacheUnidadesFiltro[i].type == "MUNI") {
                            results.push({
                                type: cacheUnidadesFiltro[i].type,
                                id: cacheUnidadesFiltro[i].id,
                                text: cacheUnidadesFiltro[i].text + ", " + getDeptoByMuni(cacheUnidadesFiltro[i].id).text,
                            });
                        }
                        if (cacheUnidadesFiltro[i].type == "DEPTO") {
                            results.push({
                                type: cacheUnidadesFiltro[i].type,
                                id: cacheUnidadesFiltro[i].id,
                                text: cacheUnidadesFiltro[i].text,
                                disabled: true,
                            });
                        }
                        if (cacheUnidadesFiltro[i].type == "PAIS") {
                            results.push({
                                type: cacheUnidadesFiltro[i].type,
                                id: cacheUnidadesFiltro[i].id,
                                text: cacheUnidadesFiltro[i].text,
                            });
                        }
                    }
                }
                query.callback({ results: results });
            }
        },
        templateResult: function (data) {
            if (!data.type) {
                return data.text;
            }
            return $("<span class='" + data.type + "'>" + data.text + "</span>");
        },
    });
    $("#searchFiltro").val(null);
    $("#searchFiltro").trigger("change");
    $("#searchFiltro").on("change", function (e) {
        var data = $("#searchFiltro").select2("data")[0];
        if (data.type == "MUNI") {
            $("#limpiarBtn").show();
            var params = {};
            params.tipo = data.type;
            params.codigo = data.id;
            $.ajax({
                url: web_service + "/unidad?cmd=query_codigo",
                data: params,
                type: "POST",
                success: function (data) {
                    if (data.status) {
                        searchCurrent = esri.jsonUtilsGeometry.fromJson(Terraformer.ArcGIS.convert(new Terraformer.Primitive(JSON.parse(data.SHAPE))));
                        updateInicio();
                    } else {
                        showLoading("Ha ocurrido un error, consultando la unidad selecccionada.", null, "red", true);
                        $("#panelSearchNivel1").hide();
                        $("#searchBar").hide();
                        $("#searchBarTab").hide();
                    }
                },
                error: function (_data) {
                    showLoading("Ha ocurrido un error, consultando la unidad selecccionada.", null, "red", true);
                    $("#panelSearchNivel1").hide();
                    $("#searchBar").hide();
                    $("#searchBarTab").hide();
                },
            });
        }
        if (data.type == "DEPTO") {
            $("#limpiarBtn").show();
            var params = {};
            params.tipo = data.type;
            params.codigo = data.id;
            $.ajax({
                url: web_service + "/unidad?cmd=query_codigo",
                data: params,
                type: "POST",
                success: function (data) {
                    if (data.status) {
                        searchCurrent = esri.jsonUtilsGeometry.fromJson(Terraformer.ArcGIS.convert(new Terraformer.Primitive(JSON.parse(data.SHAPE))));
                        updateInicio();
                    } else {
                        showLoading("Ha ocurrido un error, consultando la unidad selecccionada.", null, "red", true);
                        $("#panelSearchNivel1").hide();
                        $("#searchBar").hide();
                        $("#searchBarTab").hide();
                    }
                },
                error: function (_data) {
                    showLoading("Ha ocurrido un error, consultando la unidad selecccionada.", null, "red", true);
                    $("#panelSearchNivel1").hide();
                    $("#searchBar").hide();
                    $("#searchBarTab").hide();
                },
            });
        }
        if (data.type == "PAIS") {
            $("#limpiarBtn").show();
            searchCurrent = esri.Polygon.fromExtent(default_extent);
            updateInicio();
        }
    });

    $("#searchImagenesFechaInicial").datepicker({
        format: "dd/mm/yyyy",
        language: "es",
        orientation: "bottom",
    });
    /*
    $("#searchImagenesFechaInicial").on("change", function (e) {
        tableSearchBni.ajax.reload();
    });
    */
    $("#searchImagenesFechaFinal").datepicker({
        format: "dd/mm/yyyy",
        language: "es",
        orientation: "bottom",
    });
    /*
    $("#searchImagenesFechaFinal").on("change", function (e) {
        tableSearchBni.ajax.reload();
    });
    */
    var dataMosaicos = [];
    var dataMosaicosYear = [];
    var dataMosaicosYear2 = [];
    dataMosaicosYear.push({ id: "", text: "Ninguna" });
    for (var i = 0; i < cacheMosaicos.length; i++) {
        dataMosaicos.push({ id: cacheMosaicos[i].id, text: cacheMosaicos[i].name });
        var y = cacheMosaicos[i].name.replaceAll("global_", "").replaceAll("monthly_", "").replaceAll("quarterly_", "").replaceAll("_mosaic", "").substr(0, 4);
        if (dataMosaicosYear2.indexOf(y) == -1) {
            if (y != "supe") {
                dataMosaicosYear.push({ id: y, text: y });
                dataMosaicosYear2.push(y);
                //console.log({ id: y, text: y });
            }
        }
    }
    $("#selectTile1YPanel").select2({
        data: dataMosaicosYear,
    });
    $("#selectTile1MPanel").select2({
        data: [],
    });
    $("#selectTile1YPanel").on("change", function (e) {
        if (!($("#selectTile1YPanel").val() == "")) {
            var dataMosaicosMonth = [];
            dataMosaicosMonth.push({ id: "", text: "Ninguna" });
            for (var i = 0; i < cacheMosaicos.length; i++) {
                var y = cacheMosaicos[i].name.replaceAll("global_", "").replaceAll("monthly_", "").replaceAll("quarterly_", "").replaceAll("_mosaic", "").substr(0, 4);
                var m = cacheMosaicos[i].name.replaceAll("global_", "").replaceAll("monthly_", "").replaceAll("quarterly_", "").replaceAll("_mosaic", "").substr(4).replace("_", "");
                if (y == $("#selectTile1YPanel").val()) {
                    dataMosaicosMonth.push({ id: m, text: getTextMonth(m) });
                }
            }
            $("#selectTile1MPanel").select2("destroy").empty().select2({ data: dataMosaicosMonth });
        } else {
            $("#selectTile1MPanel").select2("destroy").empty().select2({ data: [] });
        }
        updateTiempo();
    });
    $("#selectTile1MPanel").on("change", function (e) {
        updateTiempo();
    });

    $("#selectTile2YPanel").select2({
        data: dataMosaicosYear,
    });
    $("#selectTile2MPanel").select2({
        data: [],
    });
    $("#selectTile2YPanel").on("change", function (e) {
        if (!($("#selectTile2YPanel").val() == "")) {
            var dataMosaicosMonth = [];
            dataMosaicosMonth.push({ id: "", text: "Ninguna" });
            for (var i = 0; i < cacheMosaicos.length; i++) {
                var y = cacheMosaicos[i].name.replaceAll("global_", "").replaceAll("monthly_", "").replaceAll("quarterly_", "").replaceAll("_mosaic", "").substr(0, 4);
                var m = cacheMosaicos[i].name.replaceAll("global_", "").replaceAll("monthly_", "").replaceAll("quarterly_", "").replaceAll("_mosaic", "").substr(4).replace("_", "");
                if (y == $("#selectTile2YPanel").val()) {
                    dataMosaicosMonth.push({ id: m, text: getTextMonth(m) });
                }
            }
            $("#selectTile2MPanel").select2("destroy").empty().select2({ data: dataMosaicosMonth });
        } else {
            $("#selectTile2MPanel").select2("destroy").empty().select2({ data: [] });
        }
        updateTiempo();
    });
    $("#selectTile2MPanel").on("change", function (e) {
        updateTiempo();
    });

    $("#selectTile3YPanel").select2({
        data: dataMosaicosYear,
    });
    $("#selectTile3MPanel").select2({
        data: [],
    });
    $("#selectTile3YPanel").on("change", function (e) {
        if (!($("#selectTile3YPanel").val() == "")) {
            var dataMosaicosMonth = [];
            dataMosaicosMonth.push({ id: "", text: "Ninguna" });
            for (var i = 0; i < cacheMosaicos.length; i++) {
                var y = cacheMosaicos[i].name.replaceAll("global_", "").replaceAll("monthly_", "").replaceAll("quarterly_", "").replaceAll("_mosaic", "").substr(0, 4);
                var m = cacheMosaicos[i].name.replaceAll("global_", "").replaceAll("monthly_", "").replaceAll("quarterly_", "").replaceAll("_mosaic", "").substr(4).replace("_", "");
                if (y == $("#selectTile3YPanel").val()) {
                    dataMosaicosMonth.push({ id: cacheMosaicos[i].name, text: getTextMonth(m) });
                }
            }
            $("#selectTile3MPanel").select2("destroy").empty().select2({ data: dataMosaicosMonth });
        } else {
            $("#selectTile3MPanel").select2("destroy").empty().select2({ data: [] });
        }
        updateVideoFrame();
    });
    $("#selectTile3MPanel").on("change", function (e) {
        updateVideoFrame();
    });
    videoLogo1 = new window.Image();
    videoLogo1.src = "/images/LogoVideo1.png";
    videoLogo2 = new window.Image();
    videoLogo2.src = "/images/LogoVideo2.png";
    $("#panelSearch").show();

    /* Sentinel Hub */

    var dataSHYear = [];
    dataSHYear.push({ id: "", text: "Ninguna" });
    dataSHYear.push({ id: "2019", text: "2019" });
    dataSHYear.push({ id: "2020", text: "2020" });
    dataSHYear.push({ id: "2021", text: "2021" });
    dataSHYear.push({ id: "2022", text: "2022" });
    dataSHYear.push({ id: "2023", text: "2023" });
    dataSHYear.push({ id: "2024", text: "2024" });
    $("#selectSHY").select2({
        data: dataSHYear,
    });
    $("#selectSHY").on("change", function (e) {
        updateSHTiempo();
    });

    var dataSHMonth = [];
    dataSHMonth.push({ id: "", text: "Ninguna" });
    dataSHMonth.push({ id: "01", text: "Enero" });
    dataSHMonth.push({ id: "02", text: "Febrero" });
    dataSHMonth.push({ id: "03", text: "Marzo" });
    dataSHMonth.push({ id: "04", text: "Abril" });
    dataSHMonth.push({ id: "05", text: "Mayo" });
    dataSHMonth.push({ id: "06", text: "Junio" });
    dataSHMonth.push({ id: "07", text: "Julio" });
    dataSHMonth.push({ id: "08", text: "Agosto" });
    dataSHMonth.push({ id: "09", text: "Septiembre" });
    dataSHMonth.push({ id: "10", text: "Octubre" });
    dataSHMonth.push({ id: "11", text: "Noviembre" });
    dataSHMonth.push({ id: "12", text: "Diciembre" });
    $("#selectSHM").select2({
        data: dataSHMonth,
    });
    $("#selectSHM").on("change", function (e) {
        updateSHTiempo();
    });

    currentSHAnalyticsLayer = new esri.GraphicsLayer();
    currentSHAnalyticsHexLayer = new esri.GraphicsLayer();
    currentSHAnalyticsBoundaryLayer = new esri.GraphicsLayer();
    currentSHAnalyticsAdminLayer = new esri.GraphicsLayer();
    map.addLayer(currentSHAnalyticsHexLayer);
    map.addLayer(currentSHAnalyticsLayer);
    map.addLayer(currentSHAnalyticsBoundaryLayer);
    map.addLayer(currentSHAnalyticsAdminLayer);
    currentSHAnalyticsBoundaryLayer.setVisibility(false);
    currentSHAnalyticsAdminLayer.setVisibility(false);
    $("#selectSHAnalyticsSubs").on("change", function (e) {
        updateSHAnalytics();
    });
    $("#chkSHAnalyticsBoundaries").on("change", function () {
        updateSHAnalyticsBoundaryVisibility();
    });
    $("#txtSHAnalyticsMunicipalitySearch").on("input", function () {
        renderSHAnalyticsMunicipalityTable();
    });
    $(document).on("click", ".sh-analytics-admin-tab", function () {
        setSHAnalyticsAdminLevel($(this).attr("data-sh-analytics-admin-level"));
    });
    $(document).on("click", ".sh-analytics-municipality-row", function () {
        zoomToSHAnalyticsMunicipality($(this).attr("data-municipality-index"));
    });
    $(document).on("click", ".sh-analytics-download-btn", function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        downloadSHAnalyticsAdminData($(this).attr("data-admin-level"), $(this).attr("data-admin-index"));
    });
    $(".sh-analytics-month-trigger").on("click", function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        var field = $(this).attr("data-sh-analytics-month-field") || "start";
        if ($("#shAnalyticsMonthPickerPopover").is(":visible") && shAnalyticsMonthPickerState.field === field) {
            hideSHAnalyticsMonthPicker();
        } else {
            showSHAnalyticsMonthPicker(field);
        }
    });
    $("#shAnalyticsMonthPickerPrevYear").on("click", function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        shAnalyticsMonthPickerState.year -= 1;
        renderSHAnalyticsMonthPicker();
    });
    $("#shAnalyticsMonthPickerNextYear").on("click", function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        shAnalyticsMonthPickerState.year += 1;
        renderSHAnalyticsMonthPicker();
    });
    $("#shAnalyticsMonthPickerGrid").on("click", ".sh-analytics-month-option", function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if ($(this).prop("disabled")) {
            return;
        }
        var monthIdx = parseInt($(this).attr("data-month"), 10);
        if (isNaN(monthIdx)) {
            return;
        }
        var selectedMonth = esri.moment({ year: shAnalyticsMonthPickerState.year, month: monthIdx, day: 1 }).format("YYYY-MM");
        currentSHAnalyticsDateFilterUserChanged = true;
        if (shAnalyticsMonthPickerState.field === "end") {
            currentSHAnalyticsDateFilter.end = selectedMonth;
        } else {
            currentSHAnalyticsDateFilter.start = selectedMonth;
        }
        hideSHAnalyticsMonthPicker();
        var shAnalyticsDateLoading = createSHAnalyticsLoadingDialog();
        shAnalyticsDateLoading.open();
        window.setTimeout(function () {
            refreshSHAnalyticsFilteredView("Mostrando");
            closeSHAnalyticsLoadingDialog(shAnalyticsDateLoading, 300);
        }, 120);
    });
    $(document).on("click.shAnalyticsMonthPickerOutside", function (evt) {
        if (!$(evt.target).closest("#shAnalyticsMonthPickerPopover, .sh-analytics-month-trigger").length) {
            hideSHAnalyticsMonthPicker();
        }
    });

    /* Rasters */
    var dataRasterYear = [];
    var dataRasterYear2 = [];
    dataRasterYear.push({ id: "", text: "Ninguna" });
    for (var i = 0; i < dataRaster.length; i++) {
        var y = dataRaster[i]["Año"];
        if (dataRasterYear2.indexOf(y) == -1) {
            dataRasterYear.push({ id: y, text: y });
            dataRasterYear2.push(y);
        }
    }
    $("#selectLayersRasterY1").select2({
        data: dataRasterYear,
    });
    $("#selectLayersRasterY1").on("change", function (e) {
        if (!($("#selectLayersRasterY1").val() == "")) {
            var dataRasterYear = [];
            dataRasterYear.push({ id: "", text: "Ninguna" });
            for (var i = 0; i < dataRaster.length; i++) {
                var y = dataRaster[i]["Año"];
                if (y == $("#selectLayersRasterY1").val()) {
                    dataRasterYear.push({ id: dataRaster[i].id, text: dataRaster[i].text });
                }
            }
            $("#selectLayersRaster1").select2("destroy").empty().select2({ data: dataRasterYear });
        } else {
            $("#selectLayersRaster1").select2("destroy").empty().select2({ data: [] });
        }
        updateRaster();
    });
    $("#selectLayersRaster1").select2({
        data: [],
    });
    $("#selectLayersRaster1").on("change", function (e) {
        updateRaster();
    });

    $("#layerRasterOutputR,#layerRasterOutputG,#layerRasterOutputB,#layerRasterStretch").select2();
    $("#layerRasterOutputR,#layerRasterOutputG,#layerRasterOutputB").on("change", function (e) {
        updateRasterFunctions();
    });
    $("#layerRasterStretch").on("change", function (e) {
        $(".rasterParams").hide();
        if ($("#layerRasterStretch").val() == 3) {
            $("#rasterParamsDesv").show();
            $("#rasterParamsGamma").show();
        }
        if ($("#layerRasterStretch").val() == 5) {
            $("#rasterParamsGamma").show();
        }
        if ($("#layerRasterStretch").val() == 6) {
            $("#rasterParamsPercentage").show();
            $("#rasterParamsGamma").show();
        }
        updateRasterFunctions();
    });

    if (getParameterByName("u") != null) {
        var unidad = getUnidadById(getParameterByName("u"));
        currentCaracterizacion = data.UNIDAD_INICIAL;
        firstExpand = false;
        $("#panelSearchResultados").show();
        $("#headingSearch").show();
        toggleMenu("large");
        $("#searchFiltro").val(getParameterByName("u"));
        $("#searchFiltro").trigger("change");
    } else {
        var show_tutorial = true;
        if (getParameterByName("tutorial") != null) {
            if (getParameterByName("tutorial").toLowerCase() == "true") {
                show_tutorial = true;
            }
            if (getParameterByName("tutorial").toLowerCase() == "false") {
                show_tutorial = false;
            }
        } else {
            try {
                if (window.localStorage.getItem("tutorial") == null) {
                    window.localStorage.setItem("tutorial", new Date().getTime());
                    show_tutorial = true;
                } else {
                    var tutorial_date = esri.moment(new Date(parseInt(window.localStorage.getItem("tutorial"))));
                    if (esri.moment(new Date()).diff(tutorial_date, "months", true) > 2) {
                        window.localStorage.setItem("tutorial", new Date().getTime());
                        show_tutorial = true;
                    } else {
                        show_tutorial = false;
                    }
                }
            } catch (err) {
                show_tutorial = false;
            }
        }
        if (show_tutorial) {
            gotoTutorial();
        } else {
            $("#searchFiltro").val(0);
            $("#searchFiltro").trigger("change");
        }
    }
}

function getTextMonth(m) {
    if (m.startsWith("01")) {
        return "Enero";
    }
    if (m.startsWith("02")) {
        return "Febrero";
    }
    if (m.startsWith("03")) {
        return "Marzo";
    }
    if (m.startsWith("04")) {
        return "Abril";
    }
    if (m.startsWith("05")) {
        return "Mayo";
    }
    if (m.startsWith("06")) {
        return "Junio";
    }
    if (m.startsWith("07")) {
        return "Julio";
    }
    if (m.startsWith("08")) {
        return "Agosto";
    }
    if (m.startsWith("09")) {
        return "Septiembre";
    }
    if (m.startsWith("10")) {
        return "Octubre";
    }
    if (m.startsWith("11")) {
        return "Noviembre";
    }
    if (m.startsWith("12")) {
        return "Diciembre";
    }
    if (m.startsWith("q1")) {
        return "Enero-Marzo";
    }
    if (m.startsWith("q2")) {
        return "Abril-Junio";
    }
    if (m.startsWith("q3")) {
        return "Julio-Septiembre";
    }
    if (m.startsWith("q4")) {
        return "Octubre-Diciembre";
    }
}

function downloadImagen() {
    if (currentUser == null) {
        showLoading("Para generar descargar archivos, debes iniciar la sesi&oacute;n", null, "red", true);
        gotoLogin();
        return;
    }
    if (currentMode == "alta") {
        if (cachePermisos.indexOf("IMAGENES_ALTA") == -1) {
            $("#modalLicencia2").modal({ backdrop: "static", keyboard: false }, "show");
            $("#licenciaNombre2").val(currentImagen.IMAGEN_ID);
            return;
        }
    }
    showLoading("Descargando archivo", "loading", "gold", false);
    currentUser
        .getIdToken()
        .then(function (currentAccessToken) {
            $.ajax({
                //url: web_service + "/descargas?cmd=request&tipo=" + $("#detalleImagenDescargaFormato").val() + "&id=" + currentImagen.ID_IMAGEN + "&token=" + currentAccessToken,
                url: web_service + "/descargas?cmd=request&tipo=imagen_alta&id=" + currentImagen.ID_IMAGEN + "&token=" + currentAccessToken,
                success: function (data) {
                    if (data.status) {
                        closeLoading();
                        var link = document.createElement("a");
                        link.href = web_service + "/descargas?cmd=download&token=" + data.token;
                        link.target = "_self";
                        link.click();
                    } else {
                        if (data.msg != null) {
                            showLoading(data.msg, null, "red", true);
                        } else {
                            showLoading("El archivo no se encuentra disponible para descarga", null, "red", true);
                        }
                    }
                },
                error: function (_data) {
                    showLoading("El archivo no se encuentra disponible para descarga", null, "red", true);
                },
            });
        })
        .catch(function (_error) {
            showLoading("El archivo no se encuentra disponible para descarga", null, "red", true);
        });
}

function aplicarFiltro() {
    clearRasterMosaicWorkArea();
    clearSHStatsWorkArea();
    if (currentMode == "media") {
        tableSearchBni.ajax.reload();
    }
    if (currentMode == "alta") {
        tableSearchBni2.ajax.reload();
    }
}

function modoDibujo2(tool) {
    clearRasterMosaicWorkArea();
    clearSHStatsWorkArea();
    if (drawToolRasterMosaics) {
        drawToolRasterMosaics.deactivate();
    }
    editTool2.deactivate();
    map.disableMapNavigation();
    drawTool2.activate(tool);
}

function modoDibujo3(tool) {
    clearRasterMosaicWorkArea();
    clearSHStatsWorkArea();
    if (drawToolRasterMosaics) {
        drawToolRasterMosaics.deactivate();
    }
    editTool3.deactivate();
    map.disableMapNavigation();
    drawTool3.activate(tool);
}

function modoDibujo4(tool) {
    clearRasterMosaicWorkArea();
    clearSHStatsWorkArea();
    if (drawToolRasterMosaics) {
        drawToolRasterMosaics.deactivate();
    }
    editTool4.deactivate();
    map.disableMapNavigation();
    drawTool4.activate(tool);
}

function modoDibujoRasterMosaics(tool) {
    clearRasterMosaicWorkArea();
    editToolRasterMosaics.deactivate();
    map.disableMapNavigation();
    drawToolRasterMosaics.activate(tool);
}

function limpiarMain() {
    if (modoSearch == "entidad") {
        $("#searchFiltro").val(0);
        $("#searchFiltro").trigger("change");
    }
    if (modoSearch == "area") {
        areaLayer.clear();
    }
    if (modoSearch == "geojson") {
        fileLayer.clear();
    }
    aplicarFiltro();
    map.setExtent(default_extent);
}

function limpiarArea2() {
    clearBurnsSentinelOverlay();
    currentSHLayer.clear();
    areaLayer3.clear();
    fileLayer2.clear();
}

function limpiarArea3() {
    currentPrismaLayer.clear();
    areaLayer4.clear();
    fileLayer3.clear();
}

function limpiarAreaRasterMosaics() {
    clearRasterMosaicWorkArea();
}

function updateInicio() {
    if (firstExpand) {
        $("#panelSearchResultados").show();
        $("#headingSearch").show();
        toggleMenu("large");
        if (extentInicial == null) {
            if (searchCurrent != null) {
                if ($("#searchFiltro").select2("data")[0].type == "PAIS") {
                    map.setExtent(default_extent);
                } else {
                    map.setExtent(searchCurrent.getExtent().expand(1.5));
                }
            }
        }
        extentInicial = null;
        updateImagenes();
        firstExpand = false;
    } else {
        if (extentInicial == null) {
            if (searchCurrent != null) {
                if ($("#searchFiltro").select2("data")[0].type == "PAIS") {
                    map.setExtent(default_extent);
                } else {
                    map.setExtent(searchCurrent.getExtent().expand(1.5));
                }
            }
        }
        extentInicial = null;
    }
}

function gotoVideo() {
    currentScreen = "Video";
    reporteUso("Abrir video");
    minAll();
    toggleMenu("small");
    loading = $.confirm({
        title: "",
        content: "<div style='text-align: center;'><img src='/images/ig124.gif' style='height: 200px;width: 200px;'></div>",
        buttons: {},
        closeIcon: true,
        lazyOpen: true,
        onContentReady: function () {},
        onOpenBefore: function () {
            loading.buttons.ok.hide();
            loading.buttons.close.hide();
        },
    });
    loading.open();
    setTimeout(function () {
        loading.close();
        $("#modalVideo").modal({ backdrop: "static", keyboard: false }, "show");
        videoSlide = [];
        cYmin = Math.min(lat2tile(esri.webMercatorUtils.webMercatorToGeographic(map.extent).ymin, map.getZoom() + 2), lat2tile(esri.webMercatorUtils.webMercatorToGeographic(map.extent).ymax, map.getZoom() + 2));
        cYmax = Math.max(lat2tile(esri.webMercatorUtils.webMercatorToGeographic(map.extent).ymin, map.getZoom() + 2), lat2tile(esri.webMercatorUtils.webMercatorToGeographic(map.extent).ymax, map.getZoom() + 2));
        cXmin = Math.min(lon2tile(esri.webMercatorUtils.webMercatorToGeographic(map.extent).xmin, map.getZoom() + 2), lon2tile(esri.webMercatorUtils.webMercatorToGeographic(map.extent).xmax, map.getZoom() + 2));
        cXmax = Math.max(lon2tile(esri.webMercatorUtils.webMercatorToGeographic(map.extent).xmin, map.getZoom() + 2), lon2tile(esri.webMercatorUtils.webMercatorToGeographic(map.extent).xmax, map.getZoom() + 2));
        cSizeX = (cXmax - cXmin) * 256;
        cSizeY = (cYmax - cYmin) * 256;
        $("#frameCanvas").attr("width", cSizeX);
        $("#frameCanvas").attr("height", cSizeY);
        $("#videoCanvas").attr("width", cSizeX);
        $("#videoCanvas").attr("height", cSizeY);
        addVideoSlide();
    }, 3000);
}

function closeVideo() {
    $("#modalVideo").modal("hide");
}

function addVideoSlide() {
    var canvas = document.querySelector("#frameCanvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cSizeX, cSizeY);
    var img = new window.Image();
    img.src = canvas.toDataURL("image/png");
    videoSlide.push({
        time: null,
        duration: 5,
        img: img.src,
        imgObj: img,
    });
    gotoVideoSlide(videoSlide.length - 1);
}

function updateVideoPager() {
    var strHTML = "";
    for (var i = 0; i < videoSlide.length; i++) {
        if (i == currentSlide) {
            strHTML = strHTML + "<li class='active'><a href='#' onclick='gotoVideoSlide(" + i + ");'>" + (i + 1) + "</a></li>";
        } else {
            strHTML = strHTML + "<li><a href='#' onclick='gotoVideoSlide(" + i + ");'>" + (i + 1) + "</a></li>";
        }
    }
    strHTML = strHTML + "<li class='plus'><a href='#' onclick='addVideoSlide();'><span class='glyphicon glyphicon-plus' aria-hidden='true'></span></a></li>";
    $("#videoPager").html(strHTML);
}

function gotoVideoSlide(pos) {
    currentSlide = pos;
    $("#videoSlide").attr("src", videoSlide[currentSlide].img);
    if (videoSlide[currentSlide].time != null) {
        var y = videoSlide[currentSlide].time.replaceAll("global_", "").replaceAll("monthly_", "").replaceAll("quarterly_", "").replaceAll("_mosaic", "").substr(0, 4);
        $("#selectTile3YPanel").val(y);
        var dataMosaicosMonth = [];
        dataMosaicosMonth.push({ id: "", text: "Ninguna" });
        for (var i = 0; i < cacheMosaicos.length; i++) {
            var m = cacheMosaicos[i].name.replaceAll("global_", "").replaceAll("monthly_", "").replaceAll("quarterly_", "").replaceAll("_mosaic", "").substr(4).replace("_", "");
            if (y == $("#selectTile3YPanel").val()) {
                dataMosaicosMonth.push({ id: cacheMosaicos[i].name, text: getTextMonth(m) });
            }
        }
        $("#selectTile3MPanel").select2("destroy").empty().select2({ data: dataMosaicosMonth });
        $("#selectTile3MPanel").val(videoSlide[currentSlide].time);
    } else {
        $("#selectTile3YPanel").val(null);
        $("#selectTile3MPanel").val(null);
    }
    $("#selectTile3YPanel").trigger("change.select2");
    $("#selectTile3MPanel").trigger("change.select2");
    updateVideoPager();
}

function updateVideoFrame() {
    if ($("#selectTile3MPanel").val() == "" || $("#selectTile3MPanel").val() == null) {
        var canvas = document.querySelector("#frameCanvas");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, cSizeX, cSizeY);
        var img = new window.Image();
        img.src = canvas.toDataURL("image/png");
        videoSlide[currentSlide].time = null;
        videoSlide[currentSlide].img = img.src;
        videoSlide[currentSlide].imgObj = img;
        $("#videoSlide").attr("src", videoSlide[currentSlide].img);
        return;
    }
    loading = $.confirm({
        title: "",
        content: "<div style='text-align: center;'><img src='/images/ig124.gif' style='height: 200px;width: 200px;'></div>",
        buttons: {},
        closeIcon: true,
        lazyOpen: true,
        onContentReady: function () {},
        onOpenBefore: function () {
            loading.buttons.ok.hide();
            loading.buttons.close.hide();
        },
    });
    loading.open();
    cX = cXmin;
    cY = cYmin;
    videoSlide[currentSlide].time = $("#selectTile3MPanel").val();
    canvasVideo = document.querySelector("#videoCanvas");
    ctxVideo = canvasVideo.getContext("2d");
    getVideoFrame();
}

function getVideoFrame() {
    if (cY > cYmax) {
        ctxVideo.drawImage(videoLogo2, 0, 0, 350, 100, 20, 20, 350, 100);
        ctxVideo.drawImage(videoLogo1, 0, 0, 369, 100, cSizeX - 369, 20, 369, 100);
        var y = videoSlide[currentSlide].time.replaceAll("global_", "").replaceAll("monthly_", "").replaceAll("quarterly_", "").replaceAll("_mosaic", "").substr(0, 4);
        var m = videoSlide[currentSlide].time.replaceAll("global_", "").replaceAll("monthly_", "").replaceAll("quarterly_", "").replaceAll("_mosaic", "").substr(4).replace("_", "");
        ctxVideo.save();
        ctxVideo.font = "64px arial";
        ctxVideo.strokeStyle = "black";
        ctxVideo.lineWidth = 8;
        ctxVideo.lineJoin = "round";
        ctxVideo.miterLimit = 2;
        ctxVideo.strokeText(getTextMonth(m) + " " + y, 20, cSizeY - 30);
        ctxVideo.fillStyle = "white";
        ctxVideo.fillText(getTextMonth(m) + " " + y, 20, cSizeY - 30);
        ctxVideo.restore();
        var img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = canvasVideo.toDataURL("image/png");
        videoSlide[currentSlide].img = img.src;
        videoSlide[currentSlide].imgObj = img;
        $("#videoSlide").attr("src", videoSlide[currentSlide].img);
        loading.close();
        return;
    }
    imgLoad = new window.Image();
    imgLoad.crossOrigin = "anonymous";
    imgLoad.onload = function () {
        var xpos = cX - cXmin;
        var ypos = cY - cYmin;
        ctxVideo.drawImage(imgLoad, 0, 0, 256, 256, xpos * 256, ypos * 256, 256, 256);
        if (cX > cXmax) {
            cY = cY + 1;
            cX = cXmin;
        } else {
            cX = cX + 1;
        }
        getVideoFrame();
    };
    imgLoad.src = web_service + "/imagenes2?cmd=tile&ID=" + videoSlide[currentSlide].time + "&Z=" + (map.getZoom() + 2) + "&X=" + cX + "&Y=" + cY + "&token=" + currentAccessToken;
}

function generarVideo() {
    loading = $.confirm({
        title: "",
        content: "<div style='text-align: center;'><img src='/images/ig124.gif' style='height: 200px;width: 200px;'></div>",
        buttons: {},
        closeIcon: true,
        lazyOpen: true,
        onContentReady: function () {},
        onOpenBefore: function () {
            loading.buttons.ok.hide();
            loading.buttons.close.hide();
        },
    });
    loading.open();

    canvasVideo = document.querySelector("#videoCanvas");
    ctxVideo = canvasVideo.getContext("2d");
    var videoStream = canvasVideo.captureStream(60);
    mediaRecorder = new MediaRecorder(videoStream);

    chunks = [];
    cVideoFrame = 0;
    mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
    };

    mediaRecorder.onstop = function (e) {
        var blob = new Blob(chunks, videoConfig);
        chunks = [];
        var videoURL = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = videoURL;
        link.target = "_blank";
        link.click();
        loading.close();
    };
    mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
    };
    mediaRecorder.start();
    nextVideoFrame();
}

function nextVideoFrame() {
    if (cVideoFrame == videoSlide.length) {
        mediaRecorder.stop();
        return;
    }
    gotoVideoSlide(cVideoFrame);
    ctxVideo.drawImage(videoSlide[cVideoFrame].imgObj, 0, 0);
    cVideoFrame = cVideoFrame + 1;
    setTimeout(nextVideoFrame, 5000);
}

function deleteVideoSlide() {
    videoSlide.splice(currentSlide, 1);
    if (videoSlide.length == 0) {
        addVideoSlide();
    } else {
        gotoVideoSlide(0);
    }
}

function gotoInfo() {
    currentScreen = "Info";
    reporteUso("Abrir información");
    minAll();
    $("#panelInfo").show();
}

function closeInfo() {
    $("#panelInfo").hide();
}

function getSorted(selector, attrName) {
    return $(
        $(selector)
            .toArray()
            .sort(function (a, b) {
                var aVal = a.getAttribute(attrName),
                    bVal = b.getAttribute(attrName);
                return aVal > bVal ? 1 : -1;
            }),
    );
}

function getItemtoText(feature) {
    var sHTML = "";
    var _layer;
    var objectidc;
    try {
        _layer = feature.getLayer();
    } catch (err) {}
    if (feature.attributes == null) {
        if (feature.properties != null) {
            feature.attributes = feature.properties;
        }
    }
    for (var key in feature.attributes) {
        if (feature.attributes[key] !== null && feature.attributes[key] !== "" && feature.attributes.hasOwnProperty(key)) {
            var found = false;

            if (key.toLowerCase() == "globalid") {
                continue;
            }
            if (key.toLowerCase() == "objectid") {
                objectidc = feature.attributes[key];
                continue;
            }
            if (key.toLowerCase().startsWith("shape")) {
                continue;
            }

            if (_layer != null) {
                if (_layer.fields != null) {
                    for (var i = 0; i < _layer.fields.length; i++) {
                        if (key == _layer.fields[i].name) {
                            found = true;

                            var isDate = _layer.fields[i].type == "esriFieldTypeDate" ? true : false;
                            var isCurrency = _layer.fields[i].description == "currency" ? true : false;
                            var isNumber = _layer.fields[i].type == "esriFieldTypeDouble" ? true : false;
                            var isString = _layer.fields[i].type == "esriFieldTypeString" ? true : false;
                            var dateField = "",
                                numberField = "";

                            if (isDate) {
                                dateField = getDateText(feature.attributes[key].toString());
                            } else if (isCurrency) {
                                numberField = feature.attributes[key].toFixed(2);
                            } else if (isNumber) {
                                numberField = feature.attributes[key].toString();
                            }

                            if (_layer.fields[i].alias != null) {
                                sHTML = sHTML + "<b>" + _layer.fields[i].alias + ": </b>";
                            } else {
                                sHTML = sHTML + "<b>" + key + ": </b>";
                            }
                            if (feature.attributes.hasOwnProperty(key)) {
                                if (_layer.typeIdField == key) {
                                    for (var j = 0; j < _layer.types.length; j++) {
                                        if (feature.attributes[key] == _layer.types[j].id) {
                                            sHTML = sHTML + _layer.types[j].name + "<br />";
                                        }
                                    }
                                } else {
                                    if (_layer.fields[i].domain != null) {
                                        sHTML = sHTML + _layer.fields[i].domain.getName(feature.attributes[key]) + "<br />";
                                    } else {
                                        if (isDate) {
                                            sHTML = sHTML + dateField + "<br />";
                                        } else if (isNumber) {
                                            sHTML = sHTML + numberField + "<br />";
                                        } else if (isString) {
                                            var stringAttr = anchorme({
                                                input: feature.attributes[key],
                                                options: {
                                                    attributes: {
                                                        target: "_blank",
                                                    },
                                                },
                                            });

                                            sHTML = sHTML + stringAttr + "<br />";
                                        } else {
                                            sHTML = sHTML + feature.attributes[key] + "<br />";
                                        }
                                    }
                                }
                            } else {
                                if (isDate) {
                                    sHTML = sHTML + dateField + "<br />";
                                } else {
                                    sHTML = sHTML + feature.attributes[key] + "<br />";
                                }
                            }
                        }
                    }
                }
            }
        }
        if (!found) {
            sHTML = sHTML + "<b>" + key + ": </b>" + feature.attributes[key] + "<br />";
        }
    }
    if (_layer.hasAttachments) {
        try {
            sHTML = sHTML + "<b>Adjuntos: </b><div id='popupAttachment'></div>";
            _layer.queryAttachmentInfos(objectidc, function (infos) {
                var attachmentHTML = "";
                for (var i = 0; i < infos.length; i++) {
                    if (infos[i].contentType == "image/jpeg" || infos[i].contentType == "image/png") {
                        attachmentHTML = attachmentHTML + "<img src='" + infos[i].url + "' style='width: 100%;' /><br/>";
                    } else {
                        attachmentHTML = attachmentHTML + "<a href='" + infos[i].url + "' target='_blank'>" + infos[i].name + "</a><br/>";
                    }
                }
                $("#popupAttachment").html(attachmentHTML);
            });
        } catch (err) {}
    }
    return sHTML;
}

function getDateText(date) {
    if (typeof date == "string" || date instanceof String) {
        date = parseInt(date);
    }

    var d = new Date(date);
    var dformat = d.getFullYear() + "/" + ("00" + (d.getMonth() + 1)).slice(-2) + "/" + ("00" + d.getDate()).slice(-2);
    return dformat;
}

var sistemasCoordenadas = {
    "EPSG:9377": {
        proj: "+proj=tmerc +lat_0=4.0 +lon_0=-73.0 +k=0.9992 +x_0=5000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
        wkt: 'PROJCS["MAGNA-SIRGAS / CTM12",GEOGCS["MAGNA-SIRGAS",DATUM["Marco_Geocentrico_Nacional_de_Referencia",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6686"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4686"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",4.0],PARAMETER["central_meridian",-73.0],PARAMETER["scale_factor",0.9992],PARAMETER["false_easting",5000000],PARAMETER["false_northing",2000000],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AUTHORITY["EPSG","38820"]]',
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:4326": {
        proj: "+proj=longlat +datum=WGS84 +no_defs",
        wkid: 4326,
        labLat: "Latitud (N)",
        labLng: "Longitud (W)",
        labelLat: "4.668730",
        labelLng: "-74.100403",
    },
    "EPSG:3857": {
        proj: "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs",
        wkid: 3857,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "517000",
        labelLng: "-8230000",
    },
    "EPSG:4686": {
        proj: "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
        wkid: 4686,
        labLat: "Norte (N)",
        labLng: "Este (W)",
        labelLat: "4.668730",
        labelLng: "-74.100403",
    },
    "EPSG:21894": {
        proj: "+proj=tmerc +lat_0=4.59904722222222 +lon_0=-68.0809166666667 +k=1 +x_0=1000000 +y_0=1000000 +ellps=intl +towgs84=221.899,274.136,-397.554,-2.80844591036278,0.44850858891268,2.81017234679107,-2.199943 +units=m +no_defs",
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:21896": {
        proj: "+proj=tmerc +lat_0=4.59904722222222 +lon_0=-77.0809166666667 +k=1 +x_0=1000000 +y_0=1000000 +ellps=intl +towgs84=307,304,-318,0,0,0,0 +units=m +no_defs",
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:21897": {
        proj: "+proj=tmerc +lat_0=4.59904722222222 +lon_0=-74.0809166666667 +k=1 +x_0=1000000 +y_0=1000000 +ellps=intl +towgs84=307,304,-318,0,0,0,0 +units=m +no_defs",
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:21898": {
        proj: "+proj=tmerc +lat_0=4.59904722222222 +lon_0=-71.0809166666667 +k=1 +x_0=1000000 +y_0=1000000 +ellps=intl +towgs84=307,304,-318,0,0,0,0 +units=m +no_defs",
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:21899": {
        proj: "+proj=tmerc +lat_0=4.59904722222222 +lon_0=-68.0809166666667 +k=1 +x_0=1000000 +y_0=1000000 +ellps=intl +towgs84=221.899,274.136,-397.554,-2.80844591036278,0.44850858891268,2.81017234679107,-2.199943 +units=m +no_defs",
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:3114": {
        proj: "+proj=tmerc +lat_0=4.59620041666667 +lon_0=-80.0775079166667 +k=1 +x_0=1000000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
        wkid: 3114,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:3115": {
        proj: "+proj=tmerc +lat_0=4.59620041666667 +lon_0=-77.0775079166667 +k=1 +x_0=1000000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
        wkid: 3115,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:3116": {
        proj: "+proj=tmerc +lat_0=4.59620041666667 +lon_0=-74.0775079166667 +k=1 +x_0=1000000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
        wkid: 3116,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:3117": {
        proj: "+proj=tmerc +lat_0=4.59620041666667 +lon_0=-71.0775079166667 +k=1 +x_0=1000000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
        wkid: 3117,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:3118": {
        proj: "+proj=tmerc +lat_0=4.59620041666667 +lon_0=-68.0775079166667 +k=1 +x_0=1000000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
        wkid: 3118,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:32617": {
        proj: "+proj=utm +zone=17 +datum=WGS84 +units=m +no_defs",
        wkid: 32617,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:32618": {
        proj: "+proj=utm +zone=18 +datum=WGS84 +units=m +no_defs",
        wkid: 32618,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:32619": {
        proj: "+proj=utm +zone=19 +datum=WGS84 +units=m +no_defs",
        wkid: 32619,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:32717": {
        proj: "+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs",
        wkid: 32717,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:32718": {
        proj: "+proj=utm +zone=18 +south +datum=WGS84 +units=m +no_defs",
        wkid: 32718,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:32719": {
        proj: "+proj=utm +zone=19 +south +datum=WGS84 +units=m +no_defs",
        wkid: 32719,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6244": {
        wkid: 102769,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6245": {
        wkid: 102790,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6246": {
        wkid: 102770,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6247": {
        wkid: 102771,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6248": {
        wkid: 102793,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6249": {
        wkid: 102796,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6250": {
        wkid: 102772,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6251": {
        wkid: 102788,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6252": {
        wkid: 102775,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6253": {
        wkid: 102795,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6254": {
        wkid: 102781,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6255": {
        wkid: 102767,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6256": {
        wkid: 102774,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6257": {
        wkid: 102768,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6258": {
        wkid: 102797,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6259": {
        wkid: 102789,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6260": {
        wkid: 102780,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6261": {
        wkid: 102783,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6262": {
        wkid: 102787,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6263": {
        wkid: 102791,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6264": {
        wkid: 102777,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6265": {
        wkid: 102798,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6266": {
        wkid: 102779,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6267": {
        wkid: 102784,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6268": {
        wkid: 102792,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6269": {
        wkid: 102782,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6270": {
        wkid: 102785,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6271": {
        wkid: 102794,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6272": {
        wkid: 102773,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6273": {
        wkid: 102778,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6274": {
        wkid: 102786,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
    "EPSG:6275": {
        wkid: 102776,
        labLat: "Norte (m)",
        labLng: "Este (m)",
        labelLat: "1000000.000",
        labelLng: "996000.000",
    },
};

var spanishDataTable = {
    sProcessing: "Procesando...",
    sLengthMenu: "_MENU_",
    sZeroRecords: "No se encontraron resultados",
    sEmptyTable: "Ningún dato disponible en esta tabla",
    sInfo: "_START_ - _END_ de _TOTAL_ resultados",
    sInfoEmpty: "No hay resultados",
    sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
    sInfoPostFix: "",
    sSearch: "Buscar:",
    sUrl: "",
    sInfoThousands: ",",
    sLoadingRecords: "Cargando...",
    oPaginate: {
        sFirst: "Primero",
        sLast: "Último",
        sNext: "Siguiente",
        sPrevious: "Anterior",
    },
    oAria: {
        sSortAscending: ": Activar para ordenar la columna de manera ascendente",
        sSortDescending: ": Activar para ordenar la columna de manera descendente",
    },
};

function limpiarTexto(str) {
    return accentFold(str.toLowerCase());
}

function accentFold(inStr) {
    return inStr.replace(/([àáâãäå])|([çčć])|([èéêë])|([ìíîï])|([ñ])|([òóôõöø])|([ß])|([ùúûü])|([ÿ])|([æ])/g, function (str, a, c, e, i, n, o, s, u, y, ae) {
        if (a) return "a";
        if (c) return "c";
        if (e) return "e";
        if (i) return "i";
        if (n) return "n";
        if (o) return "o";
        if (s) return "s";
        if (u) return "u";
        if (y) return "y";
        if (ae) return "ae";
    });
}

function getPropertyById(id) {
    for (var i = 0; i < configProperties.length; i++) {
        if (configProperties[i].property == id) {
            return configProperties[i];
        }
    }
    return null;
}

function getPropertyByIdAlta(id) {
    for (var i = 0; i < configPropertiesAlta.length; i++) {
        if (configPropertiesAlta[i].property == id) {
            return configPropertiesAlta[i];
        }
    }
    return null;
}

function getDeptoByMuni(id) {
    for (var i = 0; i < cacheUnidades.length; i++) {
        if (cacheUnidades[i].type == "DEPTO") {
            if (id.startsWith(cacheUnidades[i].id)) {
                return cacheUnidades[i];
            }
        }
    }
    return null;
}

function getUnidadById(id) {
    for (var i = 0; i < cacheUnidades.length; i++) {
        if (cacheUnidades[i].id == id) {
            return cacheUnidades[i];
        }
    }
}

function getEntidadById(id) {
    for (var i = 0; i < cacheEntidades.length; i++) {
        if (cacheEntidades[i].id == id) {
            return cacheEntidades[i];
        }
    }
}

function lon2tile(lon, zoom) {
    return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}

function lat2tile(lat, zoom) {
    return Math.floor(((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * Math.pow(2, zoom));
}

function arrayToWktPolygon(coordinates) {
    if (!Array.isArray(coordinates) || !Array.isArray(coordinates[0]) || coordinates[0].length < 3) {
        console.warn("[BURNS_OVERLAY] Coordenadas inválidas para construir WKT", coordinates);
        return null;
    }
    const formattedCoords = coordinates[0]
        .filter((pair) => Array.isArray(pair) && pair.length >= 2)
        .map((pair) => pair.join(" "))
        .join(", ");
    if (!formattedCoords) {
        console.warn("[BURNS_OVERLAY] No se pudieron formatear coordenadas para WKT", coordinates);
        return null;
    }
    const wktPolygon = `POLYGON ((${formattedCoords}))`;
    return wktPolygon;
}

var combined_state = {
    ndvi: {
        1: ["Ausencia de vegetación o cobertura vegetal muy escasa", "< 0"],
        2: ["Vegetación escasa o estresada", "0 - 0.2"],
        3: ["Vegetación en condiciones moderadas", "0.2 - 0.5"],
        4: ["Vegetación densa y saludable", "0.5 - 0.8"],
        5: ["Vegetación extremadamente densa y saludable", "0.8 - 1"],
    },
    gndvi: {
        1: ["Áreas con baja o nula vegetación, suelos desnudos, agua o superficies construidas", "< 0"],
        2: ["Vegetación en condiciones saludables, pero no particularmente densa", "0 - 0.5"],
        3: ["Vegetación densa y saludable", "0.5 - 0.8"],
        4: ["Vegetación extremadamente densa y saludable", "0.8 - 1"],
    },
    evi: {
        1: ["Zonas con muy poca o ninguna vegetacion", "< 0"],
        2: ["Presencia creciente de vegetacion", "0 - 0.5"],
        3: ["Vegetacion mas densa y saludable que las areas verdes", "0.5 - 0.8"],
        4: ["Vegetacion con la maxima densidad y salud de la vegetación", "0.8 - 1"],
    },
    savi: {
        1: ["Muy baja vegetacion o suelo expuesto", "< 0"],
        2: ["Vegetación escasa", "0  0.5"],
        3: ["Vegetación moderada", "0.5 - 0.8"],
        4: ["Vegetación extremadamente densa", "0.8 - 1"],
    },
    ndci: {
        1: ["Vegetacion con baja concentacion de clorofila", "< 0"],
        2: ["Vegetación con concentracion de clorofila moderada", "0 - 0.2"],
        3: ["Vegetacion con alta concentacion de clorofila", "0.2 - 1"],
    },
    ndmi: {
        1: ["Baja humedad en la vegetación", "< 0"],
        2: ["Moderada humedad en la vegetacion", "0 - 0.5"],
        3: ["Alta humedad en la vegetación", "0.5 0.8"],
        4: ["Muy alta humedad en la vegetación", "0.8 - 1"],
    },
    ndsi: {
        1: ["Zonas Ausencia de Nieve", "< 0"],
        2: ["Zonas con poca nieve", "0 - 0.4"],
        3: ["Zonas con nieve densa", "0.4 - 1"],
    },
    ndwi: {
        1: ["Zonas sin presencia de agua", "< 0"],
        2: ["Zonas inundadas", " 0 - 1"],
    },
    ndbi: {
        1: ["baja presencia de superficies construidas o una alta presencia de vegetación y áreas naturales", "< -0.05"],
        2: ["Zonas construidas con vegetación", "-0.05 - 0.05"],
        3: ["Zonas con alta construccion", "0.05 - 1"],
    },
    nbr: {
        1: ["Zonas no quemadas", "< 0.01"],
        2: ["Suelo desnudo o vegetación escasa", "0.01 - 0.02"],
        3: ["Zonas con baja densidad de construcción", "0.02 - 0.1"],
        4: ["Zonas severamente quemadas", "0.1 - 1"],
    },
    nbr2: {
        0: ["Sin clasificar", "0"],
        1: ["Zona quemada", "1"],
    },
    map_deforestation: {
        0: ["Sin clasificar", "0"],
        1: ["Pérdida de cobertura vegetal", "1"],
    },
};

function getClassification(index) {
    if (index === "NDVI") {
        return combined_state.ndvi;
    } else if (index === "GNDMI") {
        return combined_state.gndvi;
    } else if (index === "EVI") {
        return combined_state.evi;
    } else if (index === "SAVI") {
        return combined_state.savi;
    } else if (index === "NDCI") {
        return combined_state.ndci;
    } else if (index === "NDMI") {
        return combined_state.ndmi;
    } else if (index === "NDSI") {
        return combined_state.ndsi;
    } else if (index === "NDWI") {
        return combined_state.ndwi;
    } else if (index === "NDBI") {
        return combined_state.ndbi;
    } else if (index === "NBR") {
        return combined_state.nbr;
    } else if (index === "NBR2") {
        return combined_state.nbr2;
    } else if (index === "MAP_DEFORESTATION") {
        return combined_state.map_deforestation;
    }
    return null;
}

function clasifyIndex(image, indice) {
    console.log("[CLASSIFY] Iniciando procesamiento de imagen TIFF, índice:", indice);
    GeoTIFF.fromArrayBuffer(image).then(
        function (imageTiff) {
            console.log("[CLASSIFY] GeoTIFF parseado");
            imageTiff.getImage().then(
                function (image1) {
                    console.log("[CLASSIFY] Imagen obtenida, dimensiones:", image1.getWidth(), "x", image1.getHeight());
                    image1.readRasters().then(
                        function (rasterData) {
                            console.log("[CLASSIFY] Datos raster leídos");
                            var width = image1.getWidth();
                            var height = image1.getHeight();
                            var bbox = image1.getBoundingBox();
                            var reclasificado = new Uint8Array(width * height);

                            // define reclasifitacion methods
                            var reclasificationMethods = {
                                ndvi: (x) => (x == null || Number.isNaN(x) ? x : x < 0 ? 1 : x <= 0.2 ? 2 : x <= 0.5 ? 3 : x <= 0.8 ? 4 : 5),
                                gndvi: (x) => (x == null || Number.isNaN(x) ? x : x < 0 ? 1 : x <= 0.5 ? 2 : x <= 0.8 ? 3 : 4),
                                evi: (x) => (x == null || Number.isNaN(x) ? x : x < 0 ? 1 : x <= 0.5 ? 2 : x <= 0.8 ? 3 : 4),
                                savi: (x) => (x == null || Number.isNaN(x) ? x : x < 0 ? 1 : x <= 0.5 ? 2 : x <= 0.8 ? 3 : 4),
                                ndci: (x) => (x == null || Number.isNaN(x) ? x : x < 0 ? 1 : x <= 0.2 ? 2 : 3),
                                ndmi: (x) => (x == null || Number.isNaN(x) ? x : x < 0 ? 1 : x <= 0.5 ? 2 : x <= 0.8 ? 3 : 4),
                                ndsi: (x) => (x == null || Number.isNaN(x) ? x : x < 0 ? 1 : x <= 0.45 ? 2 : 3),
                                ndwi: (x) => (x == null || Number.isNaN(x) ? x : x < 0 ? 1 : 2),
                                ndbi: (x) => (x == null || Number.isNaN(x) ? x : x <= -0.05 ? 1 : x <= 0.05 ? 2 : 3),
                                nbr: (x) => (x == null || Number.isNaN(x) ? x : x <= 0.1 ? 1 : x <= 0.44 ? 2 : x <= 0.66 ? 3 : 4),
                                nbr2: (x) => (x == null || Number.isNaN(x) ? x : x === 0 ? 0 : 1),
                                map_deforestation: (x) => (x == null || Number.isNaN(x) ? x : x === 0 ? 0 : 1),
                            };

                            var IndexGroups = {
                                ndvi: { 1: [], 2: [], 3: [], 4: [], 5: [] },
                                gndvi: { 1: [], 2: [], 3: [], 4: [] },
                                evi: { 1: [], 2: [], 3: [], 4: [] },
                                savi: { 1: [], 2: [], 3: [], 4: [] },
                                ndci: { 1: [], 2: [], 3: [] },
                                ndmi: { 1: [], 2: [], 3: [], 4: [] },
                                ndsi: { 1: [], 2: [], 3: [] },
                                ndwi: { 1: [], 2: [] },
                                ndbi: { 1: [], 2: [], 3: [] },
                                nbr: { 1: [], 2: [], 3: [], 4: [] },
                                nbr2: { 0: [], 1: [] },
                                map_deforestation: { 0: [], 1: [] },
                            };

                            var sumMethods = {
                                ndvi: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x < 0 ? 1 : x <= 0.2 ? 2 : x <= 0.5 ? 3 : x <= 0.8 ? 4 : 5;
                                    IndexGroups.ndvi[group].push(x);
                                },
                                gndvi: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x < 0 ? 1 : x <= 0.5 ? 2 : x <= 0.8 ? 3 : 4;
                                    IndexGroups.gndvi[group].push(x);
                                },
                                evi: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x < 0 ? 1 : x <= 0.5 ? 2 : x <= 0.8 ? 3 : 4;
                                    IndexGroups.evi[group].push(x);
                                },
                                savi: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x < 0 ? 1 : x <= 0.5 ? 2 : x <= 0.8 ? 3 : 4;
                                    IndexGroups.savi[group].push(x);
                                },
                                ndci: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x < 0 ? 1 : x <= 0.2 ? 2 : 3;
                                    IndexGroups.ndci[group].push(x);
                                },
                                ndmi: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x < 0 ? 1 : x <= 0.5 ? 2 : x <= 0.8 ? 3 : 4;
                                    IndexGroups.ndmi[group].push(x);
                                },
                                ndsi: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x < 0 ? 1 : x <= 0.45 ? 2 : 3;
                                    IndexGroups.ndsi[group].push(x);
                                },
                                ndwi: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x < 0 ? 1 : 2;
                                    IndexGroups.ndwi[group].push(x);
                                },
                                ndbi: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x <= -0.05 ? 1 : x <= 0.05 ? 2 : 3;
                                    IndexGroups.ndbi[group].push(x);
                                },
                                nbr: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x <= 0.1 ? 1 : x <= 0.44 ? 2 : x <= 0.66 ? 3 : 4;
                                    IndexGroups.nbr[group].push(x);
                                },
                                nbr2: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x === 0 ? 0 : 1;
                                    IndexGroups.nbr2[group].push(x);
                                },
                                map_deforestation: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x === 0 ? 0 : 1;
                                    IndexGroups.map_deforestation[group].push(x);
                                },
                            };

                            var reclasify = reclasificationMethods[indice.toLowerCase()];

                            //starting to reclasify raster data
                            for (var row = 0; row < height; row++) {
                                for (var col = 0; col < width; col++) {
                                    var index = row * width + col; //calculate lineal postion
                                    reclasificado[index] = reclasify(rasterData[0][index]);
                                    sumMethods[indice.toLowerCase()](rasterData[0][index]);
                                }
                            }

                            var [minX, minY, maxX, maxY] = bbox;
                            var resX = (maxX - minX) / width; // Resolución en X
                            var resY = (maxY - minY) / height; // Resolución en Y

                            // Build polygons using run-length encoding per row to reduce polygon count
                            var pixelPolygons = [];
                            for (var row = 0; row < height; row++) {
                                var col = 0;
                                while (col < width) {
                                    var idx = row * width + col;
                                    var value = reclasificado[idx];
                                    var isNBR = indice.toLowerCase() === "nbr";
                                    var shouldIncludeValue = value !== null && !Number.isNaN(value) && value !== 0 && (!isNBR || Number(value) === 4);
                                    if (!shouldIncludeValue) {
                                        col++;
                                        continue;
                                    }
                                    var startCol = col;
                                    col++;
                                    while (col < width && reclasificado[row * width + col] === value) {
                                        col++;
                                    }
                                    var endCol = col - 1;

                                    var xMin = Math.trunc((minX + startCol * resX) * 1e6) / 1e6;
                                    var xMax = Math.trunc((minX + (endCol + 1) * resX) * 1e6) / 1e6;
                                    var yMax = Math.trunc((maxY - row * resY) * 1e6) / 1e6;
                                    var yMin = Math.trunc((yMax - resY) * 1e6) / 1e6;

                                    var coords = [
                                        [
                                            [xMin, yMin],
                                            [xMin, yMax],
                                            [xMax, yMax],
                                            [xMax, yMin],
                                            [xMin, yMin],
                                        ],
                                    ];
                                    pixelPolygons.push(turf.polygon(coords, { value: value }));
                                }
                            }
                            //define a feature collection polygons
                            var geojson = {
                                type: "FeatureCollection",
                                features: pixelPolygons,
                            };
                            // dissolve pixel polygons in each category using value field
                            var polygons = dissolveRasterPolygonsByValue(geojson, indice);

                            var stateClasification = getClassification(indice);
                            // for each polygon you define the classification status and convert coordinates to wgs84
                            polygons.features.forEach(function (feature) {
                                val = Number(feature.properties.value);
                                feature.properties.IndexState = stateClasification[val][0] || "Sin clasificacion";
                                feature.properties.IndexRange = stateClasification[val][1] || "Sin clasificacion";
                                
                                // Calcular media con validación
                                var valuesArray = IndexGroups[indice.toLowerCase()] && IndexGroups[indice.toLowerCase()][val];
                                if (valuesArray && valuesArray.length > 0) {
                                    var sum = valuesArray.reduce((sum, vals) => sum + vals, 0);
                                    var mean = sum / valuesArray.length;
                                    feature.properties.IndexRangeMean = +(mean).toFixed(4);
                                } else {
                                    feature.properties.IndexRangeMean = 0;
                                }
                            });
                            //the polygons are filtered to eliminate null data and areas under 200 m²
                            polygons = filterClassifiedPolygons(polygons, indice);

                            // create blob file from the geojson
                            var blob = new Blob([JSON.stringify(polygons)], { type: "application/json" });

                            // create a URL to blob file
                            var url = URL.createObjectURL(blob);

                            console.log("[CLASSIFY] Descargando GeoJSON con", polygons.features.length, "features");

                            // create a link to download the file
                            var a = document.createElement("a");
                            a.href = url;
                            if ($("#selectSHStatsIdx").val() == "NBR" || $("#selectSHStatsIdx").val() == "NBR2" || $("#selectSHStatsIdx").val() == "MAP_DEFORESTATION") {
                                a.download = $("#selectSHStatsIdx").val() + "_reclasificado.geojson";
                            } else {
                                a.download = $("#selectSHStatsIdx").val() + "_reclasificado_" + currentSHStatsLabels[sliderSHStats.getValue()].substring(0, 10) + ".geojson";
                            }
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);

                            console.log("[CLASSIFY] Archivo descargado:", a.download);

                            // release the blob file url
                            URL.revokeObjectURL(url);

                            loading.close();
                        },
                        function () {
                            loading.close();
                            showLoading("No se pudo descargar el archivo GeoJSON", null, "red", true);
                        },
                    );
                },
                function () {
                    loading.close();
                    showLoading("No se pudo descargar el archivo GeoJSON", null, "red", true);
                },
            );
        },
        function () {
            loading.close();
            showLoading("No se pudo descargar el archivo GeoJSON", null, "red", true);
        },
    );
}

function clasifyIndexDisplay(image, indice) {
    GeoTIFF.fromArrayBuffer(image).then(
        function (imageTiff) {
            imageTiff.getImage().then(
                function (image1) {
                    image1.readRasters().then(
                        function (rasterData) {
                            // waiting for raster data be resolved
                            var width = image1.getWidth();
                            var height = image1.getHeight();
                            var bbox = image1.getBoundingBox();
                            var reclasificado = new Uint8Array(width * height);

                            // define reclasifitacion methods
                            var reclasificationMethods = {
                                ndvi: (x) => (x == null || Number.isNaN(x) ? x : x < 0 ? 1 : x <= 0.2 ? 2 : x <= 0.5 ? 3 : x <= 0.8 ? 4 : 5),
                                gndvi: (x) => (x == null || Number.isNaN(x) ? x : x < 0 ? 1 : x <= 0.5 ? 2 : x <= 0.8 ? 3 : 4),
                                evi: (x) => (x == null || Number.isNaN(x) ? x : x < 0 ? 1 : x <= 0.5 ? 2 : x <= 0.8 ? 3 : 4),
                                savi: (x) => (x == null || Number.isNaN(x) ? x : x < 0 ? 1 : x <= 0.5 ? 2 : x <= 0.8 ? 3 : 4),
                                ndci: (x) => (x == null || Number.isNaN(x) ? x : x < 0 ? 1 : x <= 0.2 ? 2 : 3),
                                ndmi: (x) => (x == null || Number.isNaN(x) ? x : x < 0 ? 1 : x <= 0.5 ? 2 : x <= 0.8 ? 3 : 4),
                                ndsi: (x) => (x == null || Number.isNaN(x) ? x : x < 0 ? 1 : x <= 0.45 ? 2 : 3),
                                ndwi: (x) => (x == null || Number.isNaN(x) ? x : x < 0 ? 1 : 2),
                                ndbi: (x) => (x == null || Number.isNaN(x) ? x : x <= -0.05 ? 1 : x <= 0.05 ? 2 : 3),
                                nbr: (x) => (x == null || Number.isNaN(x) ? x : x <= 0.1 ? 1 : x <= 0.44 ? 2 : x <= 0.66 ? 3 : 4),
                                nbr2: (x) => (x == null || Number.isNaN(x) ? x : x === 0 ? 0 : 1),
                                map_deforestation: (x) => (x == null || Number.isNaN(x) ? x : x === 0 ? 0 : 1),
                            };

                            var IndexGroups = {
                                ndvi: { 1: [], 2: [], 3: [], 4: [], 5: [] },
                                gndvi: { 1: [], 2: [], 3: [], 4: [] },
                                evi: { 1: [], 2: [], 3: [], 4: [] },
                                savi: { 1: [], 2: [], 3: [], 4: [] },
                                ndci: { 1: [], 2: [], 3: [] },
                                ndmi: { 1: [], 2: [], 3: [], 4: [] },
                                ndsi: { 1: [], 2: [], 3: [] },
                                ndwi: { 1: [], 2: [] },
                                ndbi: { 1: [], 2: [], 3: [] },
                                nbr: { 1: [], 2: [], 3: [], 4: [] },
                                nbr2: { 0: [], 1: [] },
                                map_deforestation: { 0: [], 1: [] },
                            };

                            var sumMethods = {
                                ndvi: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x < 0 ? 1 : x <= 0.2 ? 2 : x <= 0.5 ? 3 : x <= 0.8 ? 4 : 5;
                                    IndexGroups.ndvi[group].push(x);
                                },
                                gndvi: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x < 0 ? 1 : x <= 0.5 ? 2 : x <= 0.8 ? 3 : 4;
                                    IndexGroups.gndvi[group].push(x);
                                },
                                evi: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x < 0 ? 1 : x <= 0.5 ? 2 : x <= 0.8 ? 3 : 4;
                                    IndexGroups.evi[group].push(x);
                                },
                                savi: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x < 0 ? 1 : x <= 0.5 ? 2 : x <= 0.8 ? 3 : 4;
                                    IndexGroups.savi[group].push(x);
                                },
                                ndci: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x < 0 ? 1 : x <= 0.2 ? 2 : 3;
                                    IndexGroups.ndci[group].push(x);
                                },
                                ndmi: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x < 0 ? 1 : x <= 0.5 ? 2 : x <= 0.8 ? 3 : 4;
                                    IndexGroups.ndmi[group].push(x);
                                },
                                ndsi: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x < 0 ? 1 : x <= 0.45 ? 2 : 3;
                                    IndexGroups.ndsi[group].push(x);
                                },
                                ndwi: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x < 0 ? 1 : 2;
                                    IndexGroups.ndwi[group].push(x);
                                },
                                ndbi: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x <= -0.05 ? 1 : x <= 0.05 ? 2 : 3;
                                    IndexGroups.ndbi[group].push(x);
                                },
                                nbr: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x <= 0.1 ? 1 : x <= 0.44 ? 2 : x <= 0.66 ? 3 : 4;
                                    IndexGroups.nbr[group].push(x);
                                },
                                nbr2: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x === 0 ? 0 : 1;
                                    IndexGroups.nbr2[group].push(x);
                                },
                                map_deforestation: (x) => {
                                    if (x == null || Number.isNaN(x)) return;
                                    const group = x === 0 ? 0 : 1;
                                    IndexGroups.map_deforestation[group].push(x);
                                },
                            };

                            var reclasify = reclasificationMethods[indice.toLowerCase()];

                            //starting to reclasify raster data
                            for (var row = 0; row < height; row++) {
                                for (var col = 0; col < width; col++) {
                                    var index = row * width + col; //calculate lineal postion
                                    reclasificado[index] = reclasify(rasterData[0][index]);
                                    sumMethods[indice.toLowerCase()](rasterData[0][index]);
                                }
                            }

                            var [minX, minY, maxX, maxY] = bbox;
                            var resX = (maxX - minX) / width; // Resolución en X
                            var resY = (maxY - minY) / height; // Resolución en Y

                            // Build polygons using run-length encoding per row to reduce polygon count
                            var pixelPolygons = [];
                            for (var row = 0; row < height; row++) {
                                var col = 0;
                                while (col < width) {
                                    var idx = row * width + col;
                                    var value = reclasificado[idx];
                                    var isNBR = indice.toLowerCase() === "nbr";
                                    var shouldIncludeValue = value !== null && !Number.isNaN(value) && value !== 0 && (!isNBR || Number(value) === 4);
                                    if (!shouldIncludeValue) {
                                        col++;
                                        continue;
                                    }
                                    var startCol = col;
                                    col++;
                                    while (col < width && reclasificado[row * width + col] === value) {
                                        col++;
                                    }
                                    var endCol = col - 1;

                                    var xMin = Math.trunc((minX + startCol * resX) * 1e6) / 1e6;
                                    var xMax = Math.trunc((minX + (endCol + 1) * resX) * 1e6) / 1e6;
                                    var yMax = Math.trunc((maxY - row * resY) * 1e6) / 1e6;
                                    var yMin = Math.trunc((yMax - resY) * 1e6) / 1e6;

                                    var coords = [
                                        [
                                            [xMin, yMin],
                                            [xMin, yMax],
                                            [xMax, yMax],
                                            [xMax, yMin],
                                            [xMin, yMin],
                                        ],
                                    ];
                                    pixelPolygons.push(turf.polygon(coords, { value: value }));
                                }
                            }
                            //define a feature collection polygons
                            var geojson = {
                                type: "FeatureCollection",
                                features: pixelPolygons,
                            };
                            // dissolve pixel polygons in each category using value field
                            var polygons = dissolveRasterPolygonsByValue(geojson, indice);

                            var stateClasification = getClassification(indice);
                            // for each polygon you define the classification status and convert coordinates to wgs84
                            polygons.features.forEach(function (feature) {
                                val = Number(feature.properties.value);
                                feature.properties.IndexState = stateClasification[val][0] || "Sin clasificacion";
                                feature.properties.IndexRange = stateClasification[val][1] || "Sin clasificacion";
                                
                                // Calcular media con validación
                                var valuesArray = IndexGroups[indice.toLowerCase()] && IndexGroups[indice.toLowerCase()][val];
                                if (valuesArray && valuesArray.length > 0) {
                                    var sum = valuesArray.reduce((sum, vals) => sum + vals, 0);
                                    var mean = sum / valuesArray.length;
                                    feature.properties.IndexRangeMean = +(mean).toFixed(4);
                                } else {
                                    feature.properties.IndexRangeMean = 0;
                                }
                            });
                            //the polygons are filtered to eliminate null data and areas under 200 m²
                            polygons = filterClassifiedPolygons(polygons, indice);

                            var features = Terraformer.ArcGIS.convert(new Terraformer.Primitive(polygons));
                            for (var m = 0; m < features.length; m++) {
                                var g = new esri.Graphic(features[m]);
                                g.setSymbol(searchImagenSymbol);
                                currentSHLayer.add(g);
                            }

                            var activeLayerName = indice && indice.toLowerCase() === "map_deforestation" ? "Polígonos de pérdida de cobertura vegetal" : "Polígonos de quemas";
                            if (typeof setActiveLayer === 'function') {
                                setActiveLayer({
                                    tipo: 'quemas',
                                    nombre: activeLayerName,
                                    datos: {
                                        Indice: indice,
                                        'Cantidad de polígonos': polygons.features.length
                                    },
                                    toggle: function (visible) {
                                        if (currentSHLayer) {
                                            currentSHLayer.setVisibility(visible);
                                            if (visible) {
                                                ensureBurnPolygonsOnTop();
                                            }
                                        }
                                    }
                                });
                            }

                            lastProcessedSHResult = {
                                index: indice,
                                polygons: polygons,
                                fileName: ($("#selectSHStatsIdx").val() == "NBR" || $("#selectSHStatsIdx").val() == "NBR2" || $("#selectSHStatsIdx").val() == "MAP_DEFORESTATION")
                                    ? $("#selectSHStatsIdx").val() + "_reclasificado.geojson"
                                    : $("#selectSHStatsIdx").val() + "_reclasificado_" + new Date().toISOString().split("T")[0] + ".geojson",
                            };
                            $("#btnSHDownloadStats").removeAttr("disabled");
                            bindBurnsLayerClickHandler();
                            ensureBurnPolygonsOnTop();
                            if (shouldShowSentinelOverlayForIndex(indice)) {
                                fetchBurnsSentinelOverlay();
                            }
                            console.log("[CLASSIFY_DISPLAY] Resultados mostrados en mapa:", lastProcessedSHResult.fileName);
                            loading.close();
                        },
                        function () {
                            loading.close();
                            showLoading("No se pudo descargar el archivo GeoJSON", null, "red", true);
                        },
                    );
                },
                function () {
                    loading.close();
                    showLoading("No se pudo descargar el archivo GeoJSON", null, "red", true);
                },
            );
        },
        function () {
            loading.close();
            showLoading("No se pudo descargar el archivo GeoJSON", null, "red", true);
        },
    );
}

var evalScripts_download = {
    NDVI: `//VERSION=3
    function setup() {
      return{
        input: [{
          bands: ["B04", "B08"],
          units: "REFLECTANCE"
          }],
        output: {
        id: "default",
        bands: 1,
        sampleType: SampleType.FLOAT32}
      }
    }

    function evaluatePixel(sample) {
      let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04)
      return [ ndvi ]
    }`,
    GNDVI: `//VERSION=3
    function setup() {
      return{
        input: [{
          bands: ["B03", "B08"],
          units: "REFLECTANCE"
          }],
        output: {
        id: "default",
        bands: 1,
        sampleType: SampleType.FLOAT32}
      }
    }

    function evaluatePixel(sample) {
      let gndvi = (sample.B08 - sample.B03) / (sample.B08 + sample.B03)
      return [ gndvi ]
    }`,
    EVI: `//VERSION=3
    function setup() {
      return{
        input: [{
          bands: ["B02", "B04", "B08",  "dataMask" ],
          units: "REFLECTANCE"
          }],
        output: {
        id: "default",
        bands: 1,
        sampleType: SampleType.FLOAT32
        }
      }
    }

    function evaluatePixel(sample) {
      
      if (sample.dataMask === 0) {
      return [NaN];
      }
  
      let evi = 2.5 * ((sample.B08 - sample.B04) / (sample.B08 + 6 * sample.B04 - 7.5 * sample.B02 + 1));
      return [evi];
}`,
    NDMI: `//VERSION=3
    function setup() {
      return{
        input: [{
          bands: ["B08", "B11"],
          units: "REFLECTANCE"
          }],
        output: {
        id: "default",
        bands: 1,
        sampleType: SampleType.FLOAT32}
      }
    }

    function evaluatePixel(sample) {
      let ndmi = (sample.B08 - sample.B11) / (sample.B08 + sample.B11)
      return [ ndmi ]
    }
  `,
    SAVI: `//VERSION=3
    function setup() {
      return{
        input: [{
          bands: ["B04", "B08", "dataMask"],
          units: "REFLECTANCE"
          }],
        output: {
        id: "default",
        bands: 1,
        sampleType: SampleType.FLOAT32}
      }
    }

    function evaluatePixel(sample) {
      
      if (sample.dataMask === 0) {
        return [NaN];
      }

      let L = 0.428
      savi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04 + L) * (1.0 + L);
      return [ savi ]
    }`,
    NDSI: `//VERSION=3
    function setup() {
      return{
        input: [{
          bands: ["B03", "B11"],
          units: "REFLECTANCE"
          }],
        output: {
        id: "default",
        bands: 1,
        sampleType: SampleType.FLOAT32}
      }
    }

    function evaluatePixel(sample) {
      let ndsi = (sample.B03 - sample.B11) / (sample.B11 + sample.B03)
      return [ ndsi ]
    }`,
    NDWI: `//VERSION=3
    function setup() {
      return{
        input: [{
          bands: ["B03", "B08"],
          units: "REFLECTANCE"
          }],
        output: {
        id: "default",
        bands: 1,
        sampleType: SampleType.FLOAT32}
      }
    }

    function evaluatePixel(sample) {
      let ndwi = (sample.B03 - sample.B08) / (sample.B03 + sample.B08)
      return [ ndwi ]
    }
   `,
    NDBI: `//VERSION=3
    function setup() {
      return{
        input: [{
          bands: ["B08", "B11"],
          units: "REFLECTANCE"
          }],
        output: {
        id: "default",
        bands: 1,
        sampleType: SampleType.FLOAT32}
      }
    }

    function evaluatePixel(sample) {
      let ndbi = (sample.B11 - sample.B08) / (sample.B08 + sample.B11)
      return [ ndbi ]
    }`,
    NDCI: `//VERSION=3
    function setup() {
      return{
        input: [{
          bands: ["B05", "B04"],
          units: "REFLECTANCE"
          }],
        output: {
        id: "default",
        bands: 1,
        sampleType: SampleType.FLOAT32}
      }
    }

    function evaluatePixel(sample) {
      let ndci = (sample.B05 - sample.B04) / (sample.B05 + sample.B04)
      return [ ndci ]
      }`,
    NBR: `//VERSION=3
    function setup( ){
      return{
        input: [{
          bands: ["B02", "B03", "B04", "B08", "B11", "B12"],
            }],
            output: [{
              id: "default", bands: 1, sampleType: SampleType.FLOAT32},
            ]
            }
    }
      
    function evaluatePixel(sample) {

      let ndwi = (sample.B03 - sample.B08) / (sample.B03 + sample.B08)
      let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
      let indice = ((sample.B11 - sample.B12) /(sample.B11 + sample.B12))+(sample.B08);

      var burn;

      if (
        (indice > {{THRESHOLD}}) ||
        (sample.B02 > 0.1) ||
        (sample.B11 < 0.1) ||
        (ndvi > 0.3) ||
        (ndwi > 0.8)
      ) {
        burn = [0];
      } else {
        burn = [1];
      }

    return {
      default:[burn]
    }
    }
    `,
    NBR2: `
    //VERSION=3
    function setup() {
      return {
        input: [{
          bands: ["B02", "B03", "B04", "B08", "B11", "B12"],
        }],
        output: [
          { id: "default", bands: 3, sampleType: SampleType.AUTO }
        ]
      }
    }

    function evaluatePixel(sample) {

      let ndwi = (sample.B03 - sample.B08) / (sample.B03 + sample.B08)
      let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
      let indice = ((sample.B11 - sample.B12) / (sample.B11 + sample.B12)) + (sample.B08);

      var image;

      if (
        (indice > {{THRESHOLD}}) ||
        (sample.B02 > 0.1) ||
        (sample.B11 < 0.1) ||
        (ndvi > 0.3) ||
        (ndwi > 0.8)
      ) {
        image = [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
      } else {
        image = [1, 0, 0];
      }
      return {
        default: image,   
      }
    }
        
    `,
    MAP_DEFORESTATION: `//VERSION=3
    
  // Thresholds and constants
  const NDVI_THRESHOLD = 0.3; // Minimum NDVI difference between periods
  const NDWI_THRESHOLD = 0.5; // Threshold to classify water using NDWI
  const BRIGHTNESS_THRESHOLD = 0.18; // Reflectance threshold for Blue band
  const WINDOW_DAYS = 0; // Time window for averaging NDVI
  const CLOUD_PROBABILITY_THRESHOLD = 0.3;

  function setup() {
  return {
    input: [
      {
        bands: ["B02", "B03", "B04", "B08", "CLD"],
      },
    ],
    output: [
      {
        id: "default",
        bands: 1,
        sampleType: "UINT8"
      }
    ],
    mosaicking: "ORBIT",
  };
  }

  function evaluatePixel(samples, scenes) {
    // Sort scenes to find the most recent and oldest
    if (!Array.isArray(scenes) || scenes.length === 0) {
      return {
        default: [0],
      };
    }
    const sortedScenes = scenes.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
    const recentDate = sortedScenes[0].date;
    const oldestDate = sortedScenes[sortedScenes.length - 1].date;

    // Filter scenes within the n-day window for recent and oldest periods
    const recentWindowScenes = sortedScenes.filter(
      (scene) =>
        recentDate.getTime() - scene.date.getTime() <=
        WINDOW_DAYS * 24 * 3600 * 1000
    );
    const oldestWindowScenes = sortedScenes.filter(
      (scene) =>
        scene.date.getTime() - oldestDate.getTime() <=
        WINDOW_DAYS * 24 * 3600 * 1000
    );

    // Calculate mean NDVI for the recent and oldest windows
    function calculateMeanNDVI(scenesArray) {
      let sumNDVI = 0;
      let count = 0;
      scenesArray.forEach((scene) => {
        const sample = samples[scenes.indexOf(scene)];
        if (sample && !isCloudOrWater(sample)) {
          const ndvi = index(sample.B08, sample.B04);
          sumNDVI += ndvi;
          count += 1;
        }
      });
      // if the ndvi was not calculated because of cloud or water the function return null
      return count > 0 ? sumNDVI / count : null;
    }

    // Helper function to detect clouds using Blue and CLD
    function isCloudOrWater(sample) {
      const brightness = sample.B02; // Blue band reflectance
      const cloudProb = sample.CLD; // Cloud probability, based on Sen2Cor processor
      const NDWI = index(sample.B03, sample.B08);

      // Clouds: High reflectance in Blue or high CLD
      const isCloud =
        brightness > BRIGHTNESS_THRESHOLD || cloudProb > CLOUD_PROBABILITY_THRESHOLD;

      // Water: NDWI above threshold
      const isWater = NDWI >= NDWI_THRESHOLD;

      return isCloud || isWater;
    }

    const recentMeanNDVI = calculateMeanNDVI(recentWindowScenes);
    const oldestMeanNDVI = calculateMeanNDVI(oldestWindowScenes);

    const ndviDifference =
      recentMeanNDVI !== null && oldestMeanNDVI !== null
        ? oldestMeanNDVI - recentMeanNDVI
        : 0;

    // Initialize result values
    let deforestation = 0;


    if (ndviDifference >= NDVI_THRESHOLD) {
      deforestation = 1; // Deforestation detected
    }

    // Return values with water and cloud masking
    if (deforestation === 1) {
      return {
        default: [1], // Deforestation detected
      };
    } else {
      return {
        default: [0], // No significant change
      };
    }
  }
      `,
};

// --- Image overlay helpers ---
var shImageOverlay = null;
var shImageOverlayContainer = null;
var shImageOverlayLayer = null;
var shImageOverlayUrl = null;

function getLayerDomNode(layer) {
    if (!layer) return null;
    if (layer._div) return layer._div;
    if (layer.domNode) return layer.domNode;
    if (typeof layer.getNode === "function") {
        try {
            return layer.getNode();
        } catch (e) {}
    }
    if (layer.id) {
        return document.getElementById(layer.id) || document.querySelector("[id$='" + layer.id + "']");
    }
    return null;
}

function keepSentinelOverlayBelowBurnGraphics() {
    try {
        if (!shImageOverlayLayer || !map) return;

        var overlayNode = getLayerDomNode(shImageOverlayLayer);
        if (overlayNode && overlayNode.style) {
            overlayNode.style.pointerEvents = "none";
        }

        var graphicsNode = getLayerDomNode(currentSHLayer) || getLayerDomNode(areaLayer3) || getLayerDomNode(fileLayer2);
        if (overlayNode && graphicsNode && overlayNode.parentNode === graphicsNode.parentNode) {
            if (overlayNode.nextSibling !== graphicsNode) {
                overlayNode.parentNode.insertBefore(overlayNode, graphicsNode);
            }
        }
    } catch (e) {
        console.warn("[OVERLAY] keepSentinelOverlayBelowBurnGraphics error", e);
    }
}

function setBurnLayerDomZIndex(layers) {
    try {
        (layers || []).forEach(function (layer) {
            var layerNode = getLayerDomNode(layer);
            if (layerNode && layerNode.style) {
                layerNode.style.pointerEvents = "auto";
            }
        });
    } catch (e) {
        console.warn("[OVERLAY] setBurnLayerDomZIndex error", e);
    }
}

function ensureBurnPolygonsOnTop() {
    try {
        if (!map) return;

        keepSentinelOverlayBelowBurnGraphics();

        var burnLayers = [areaLayer3, fileLayer2, currentSHLayer].filter(function (layer) {
            return !!layer;
        });
        if (!burnLayers.length) return;

        if (typeof map.reorderLayer === "function" && map.graphicsLayerIds && map.graphicsLayerIds.length > 0) {
            var topIndex = map.graphicsLayerIds.length - 1;
            burnLayers.forEach(function (layer) {
                if (topIndex >= 0) {
                    map.reorderLayer(layer, topIndex);
                    topIndex--;
                }
            });

            // Reafirmar que la capa de poligonos reclasificados quede de ultima (mas arriba).
            if (currentSHLayer) {
                map.reorderLayer(currentSHLayer, map.graphicsLayerIds.length - 1);
            }
        }

        setBurnLayerDomZIndex(burnLayers);
    } catch (e) {
        console.warn("[OVERLAY] ensureBurnPolygonsOnTop error", e);
    }
}

function clearBurnsSentinelOverlay() {
    try {
        if (shImageOverlayLayer && map) {
            map.removeLayer(shImageOverlayLayer);
        }
        shImageOverlayLayer = null;
        if (shImageOverlayUrl) {
            URL.revokeObjectURL(shImageOverlayUrl);
            shImageOverlayUrl = null;
        }
        if (shImageOverlay) {
            shImageOverlay.src = "";
            shImageOverlay.style.display = "none";
            shImageOverlay._extent = null;
        }
    } catch (e) {
        console.warn("[OVERLAY] clearBurnsSentinelOverlay error", e);
    }
}

function placeOverlayContainerBelowGraphics(mapDiv) {
    if (!shImageOverlayContainer) return;
    try {
        var mapRoot = map && map.root ? map.root : null;
        if (mapRoot) {
            var anchorGraphicsDiv = mapRoot.querySelector(".graphicsDiv, .esriGraphicsLayer");
            var anchorBaseDiv = mapRoot.querySelector(".basemapLayer, .esriBasemapLayer");

            if (anchorGraphicsDiv && anchorGraphicsDiv.parentNode) {
                var gParent = anchorGraphicsDiv.parentNode;
                if (shImageOverlayContainer.parentNode !== gParent || shImageOverlayContainer.nextSibling !== anchorGraphicsDiv) {
                    gParent.insertBefore(shImageOverlayContainer, anchorGraphicsDiv);
                }
            } else if (anchorBaseDiv && anchorBaseDiv.parentNode) {
                var bParent = anchorBaseDiv.parentNode;
                if (shImageOverlayContainer.parentNode !== bParent) {
                    bParent.insertBefore(shImageOverlayContainer, anchorBaseDiv.nextSibling);
                } else if (anchorBaseDiv.nextSibling !== shImageOverlayContainer) {
                    bParent.insertBefore(shImageOverlayContainer, anchorBaseDiv.nextSibling);
                }
            } else {
                if (shImageOverlayContainer.parentNode !== mapRoot) {
                    mapRoot.appendChild(shImageOverlayContainer);
                }
            }
            return;
        }

        if (mapDiv && shImageOverlayContainer.parentNode !== mapDiv) {
            mapDiv.appendChild(shImageOverlayContainer);
        }
    } catch (e) {
        console.warn('[OVERLAY] placeOverlayContainerBelowGraphics error', e);
    }
}

function addImageOverlayFromBlob(blob, extent) {
    try {
        clearBurnsSentinelOverlay();

        shImageOverlayUrl = URL.createObjectURL(blob);
        shImageOverlayLayer = new esri.MapImageLayer({
            id: "SHBurnsSentinelOverlay",
            opacity: 0.95
        });
        shImageOverlayLayer.addImage(new esri.MapImage({
            extent: extent,
            href: shImageOverlayUrl
        }));

        map.addLayer(shImageOverlayLayer);
        ensureBurnPolygonsOnTop();
        if (typeof shImageOverlayLayer.on === "function") {
            shImageOverlayLayer.on("load", function () {
                ensureBurnPolygonsOnTop();
            });
        }
    } catch (e) {
        console.warn('[OVERLAY] addImageOverlayFromBlob error', e);
    }
}

function fetchBurnsSentinelOverlay() {
    try {
        var burnsSearchAreaMap = currentSearchArea2 || currentSearchArea;
        var burnsSearchAreaGeo = currentSearchArea || burnsSearchAreaMap;
        if (!currentSHToken || !burnsSearchAreaMap || !map) {
            console.warn("[BURNS_OVERLAY] Faltan datos para cargar Sentinel", {
                hasToken: !!currentSHToken,
                hasSearchArea: !!burnsSearchAreaMap,
                hasMap: !!map
            });
            return;
        }

        var sliderValue = (sliderSHStats && typeof sliderSHStats.getValue === "function") ? parseInt(sliderSHStats.getValue(), 10) : 0;
        var selectedLabel = (Array.isArray(currentSHStatsLabels) && currentSHStatsLabels.length > 0)
            ? currentSHStatsLabels[Math.max(0, Math.min(sliderValue, currentSHStatsLabels.length - 1))]
            : null;

        // Fallback para flujo de quema: cuando no hay serie temporal/slider, usar fecha final del panel.
        if (!selectedLabel || typeof selectedLabel !== "string") {
            var fallbackEndDate = ($("#selectSHStats2").val() || "").trim();
            if (fallbackEndDate) {
                var fallbackMoment = esri.moment(fallbackEndDate, "DD/MM/YYYY");
                if (fallbackMoment.isValid()) {
                    selectedLabel = fallbackMoment.format("YYYY-MM-DD");
                }
            }
        }

        if (!selectedLabel || typeof selectedLabel !== "string") {
            console.warn("[BURNS_OVERLAY] No hay fecha seleccionada para cargar Sentinel", {
                sliderValue: sliderValue,
                labelsCount: Array.isArray(currentSHStatsLabels) ? currentSHStatsLabels.length : 0,
                fallbackEndDate: $("#selectSHStats2").val()
            });
            return;
        }

        var dateBase = selectedLabel.substring(0, 10);
        var rangeStart = esri.moment($("#selectSHStats1").val(), "DD/MM/YYYY");
        var rangeEnd = esri.moment($("#selectSHStats2").val(), "DD/MM/YYYY");
        var selectedMoment = esri.moment(dateBase, "YYYY-MM-DD");
        if (!rangeEnd.isValid()) rangeEnd = selectedMoment.clone();
        if (!rangeStart.isValid() || rangeStart.isAfter(rangeEnd)) rangeStart = rangeEnd.clone().subtract(30, "days");
        var dateStart = rangeStart.format("YYYY-MM-DD");
        var dateEnd = rangeEnd.format("YYYY-MM-DD");
        var maxCloudCoveragePercent = getSHCloudCoverageMaxPercent();

        // Sentinel Process API espera geometría en EPSG:4326 para este payload.
        var searchArea4326 = burnsSearchAreaGeo;
        if (
            searchArea4326 &&
            searchArea4326.spatialReference &&
            searchArea4326.spatialReference.wkid === 3857
        ) {
            searchArea4326 = esri.webMercatorUtils.webMercatorToGeographic(searchArea4326);
        }
        var requestRings = searchArea4326 && searchArea4326.rings ? searchArea4326.rings : null;
        if (!requestRings || !requestRings.length) {
            console.warn("[BURNS_OVERLAY] Geometría inválida para solicitud Sentinel", {
                hasSearchAreaGeo: !!searchArea4326,
                sr: searchArea4326 && searchArea4326.spatialReference ? searchArea4326.spatialReference.wkid : null
            });
            return;
        }

        var params = {
            input: {
                bounds: {
                    geometry: { type: "Polygon", coordinates: requestRings },
                    properties: { crs: "http://www.opengis.net/def/crs/EPSG/0/4326" },
                },
                data: [{
                     dataFilter: {
                        timeRange: { from: dateStart + "T00:00:00Z", to: dateEnd + "T23:59:59Z" },
                        maxCloudCoverage: maxCloudCoveragePercent,
                        mosaickingOrder: "mostRecent"
                    },
                    type: "sentinel-2-l2a",
                }],
            },
            output: {
                resx: 0.000269494697,
                resy: 0.000269494697,
                responses: [{ identifier: "default", format: { type: "image/png" } }],
            },
            evalscript: `//VERSION=3
function setup() {
  return { input: ["B04", "B03", "B02", "dataMask"], output: { bands: 4 } };
}
function evaluatePixel(s) {
  if (s.dataMask === 0) return [0, 0, 0, 0];
  return [2.5 * s.B04, 2.5 * s.B03, 2.5 * s.B02, 1];
}`
        };

        $.ajax({
            url: sh_image_stats,
            data: JSON.stringify(params),
            type: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + currentSHToken },
            xhr: function () {
                var xhrOverride = new XMLHttpRequest();
                xhrOverride.responseType = "blob";
                return xhrOverride;
            },
            success: function (blob) {
                var extent = burnsSearchAreaMap.getExtent ? burnsSearchAreaMap.getExtent() : null;
                if (extent) addImageOverlayFromBlob(blob, extent);
            },
            error: function (err) {
                console.warn("[BURNS_OVERLAY] No se pudo cargar imagen Sentinel", err && err.status);
            },
            cache: false,
            contentType: false,
            processData: false,
        });
    } catch (e) {
        console.warn("[BURNS_OVERLAY] Error preparando overlay", e);
    }
}

function updateImageOverlayPosition() {
    if (!shImageOverlay || !shImageOverlay._extent) return;
    var ext = shImageOverlay._extent;
    var minX = ext.xmin, minY = ext.ymin, maxX = ext.xmax, maxY = ext.ymax;
    try {
        // Usar SR real del extent para evitar reproyección doble (causaba overlay fuera de vista).
        var extentSR = ext.spatialReference || map.spatialReference || new esri.SpatialReference({ wkid: 4326 });
        var pTL = new esri.geometry.Point(minX, maxY, extentSR);
        var pBR = new esri.geometry.Point(maxX, minY, extentSR);

        if (
            map.spatialReference &&
            map.spatialReference.wkid === 3857 &&
            extentSR &&
            extentSR.wkid === 4326
        ) {
            pTL = esri.geometry.geographicToWebMercator(pTL);
            pBR = esri.geometry.geographicToWebMercator(pBR);
        }
        var tl = map.toScreen(pTL);
        var br = map.toScreen(pBR);
        var left = Math.min(tl.x, br.x);
        var top = Math.min(tl.y, br.y);
        var width = Math.abs(br.x - tl.x);
        var height = Math.abs(br.y - tl.y);
        shImageOverlay.style.left = left + 'px';
        shImageOverlay.style.top = top + 'px';
        shImageOverlay.style.width = width + 'px';
        shImageOverlay.style.height = height + 'px';
    } catch (e) {
        console.warn('[OVERLAY] update position error', e);
    }
}

