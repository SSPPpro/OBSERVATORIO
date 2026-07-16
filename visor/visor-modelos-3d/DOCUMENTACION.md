# Documentación técnica — Visor M3D IGAC

## Propósito

Aplicación web estática para visualizar servicios `SceneServer` de modelos 3D de IGAC. No utiliza backend ni base de datos: el catálogo se mantiene en un archivo JSON y el modelo se consume directamente desde su URL pública.

## Archivos principales

| Archivo | Responsabilidad |
| --- | --- |
| `index.html` | Estructura de la interfaz: catálogo, escena y controles. |
| `styles.css` | Diseño visual y comportamiento adaptable a pantallas pequeñas. |
| `app.js` | Inicialización de ArcGIS, carga de modelos y herramientas de análisis. |
| `catalogo.json` | Fuente única de los servicios disponibles. |

## Flujo de funcionamiento

1. `app.js` solicita `catalogo.json` al iniciar.
2. Se valida que la propiedad `services` sea una lista y se pinta el catálogo lateral.
3. Al seleccionar un registro, se crea una capa `IntegratedMeshLayer` con su URL `SceneServer`.
4. La capa previa se retira y la cámara se desplaza a la extensión del nuevo modelo.
5. Las herramientas de medición y análisis se crean bajo demanda y se elimina la anterior para evitar conflictos.

## Gestión del catálogo

Cada elemento del arreglo `services` debe tener tres propiedades:

```json
{
  "source": "GD1_15189000_Ciénega_20250409",
  "name": "M3D_15189000_20250409",
  "url": "https://mapas2.igac.gov.co/host/rest/services/Escenas3D/m3d15189000cienaga/SceneServer"
}
```

- Para agregar un modelo, añada un objeto dentro de `services`.
- Para retirar uno, elimine su objeto completo.
- La URL debe apuntar a un `SceneServer` accesible desde el navegador.
- Mantenga comas entre objetos y compruebe que el JSON siga siendo válido.

## Herramientas

- **Distancia:** activa `Measurement` con `direct-line`; seleccione dos puntos de la escena.
- **Área:** activa `Measurement` con `area`; dibuje el polígono y finalice con doble clic.
- **Perfil:** usa `ElevationProfile` sobre el terreno global de ArcGIS.
- **Línea de visión:** crea el widget `LineOfSight`.
- **Fecha, hora y clima:** la fecha/hora ajusta la iluminación solar y las sombras; los climas son efectos visuales superpuestos.

## Ejecución local

Ejecute un servidor desde la carpeta del visor para que el navegador pueda leer `catalogo.json`:

```powershell
cd outputs\visor-modelos-3d
python -m http.server 8080
```

Después abra `http://localhost:8080`. Se requiere conexión a Internet para la API de ArcGIS y los servicios IGAC.
