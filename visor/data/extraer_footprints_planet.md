Extracción de footprints de Planet por año
=========================================

Desde la raíz del repositorio, con Python 3.9 o posterior:

```powershell
py -3.13 visor/data/extraer_footprints_planet.py
```

Genera `planet_footprints_2023.geojson`, `planet_footprints_2024.geojson` y
`planet_footprints_2025.geojson` en `visor/data/footprints_planet/`.
Cada archivo conserva las geometrías y los metadatos originales del catálogo,
en coordenadas geográficas GeoJSON (longitud, latitud). No descarga imágenes.

La fuente asumida es la colección de mosaicos Planet configurada en
`rasterMosaicByocCollection` de `visor/env.js`. Se consulta mediante el proxy
existente `https://ccg.igac.gov.co/get-catalog`, que gestiona la autenticación.
**El alcance son todos los footprints indexados en esa colección BYOC**, no
objetos del bucket que aún no se hayan incorporado al catálogo. No hay una
configuración de acceso directo al bucket en este repositorio.

Se consulta cada año por la fecha del catálogo, con una extensión mundial
(`bbox: [-180, -90, 180, 90]`) porque el servicio exige un filtro espacial, recorriendo
todas las páginas con `context.next`, según la
[documentación de Sentinel Hub](https://docs.sentinel-hub.com/api/latest/api/catalog/).
Se eliminan duplicados por colección e ID dentro de cada año.

Para usar el proxy local (iniciado por separado) u otra colección:

```powershell
py -3.13 visor/data/extraer_footprints_planet.py --catalog-url http://localhost:3000/get-catalog --collection byoc-ID --years 2023 2024 2025
```

Opciones adicionales: `--output-dir RUTA` y `--page-size 100`.
El proxy debe estar disponible y tener acceso a la colección. No se necesitan
paquetes adicionales ni claves dentro del script.

Cada archivo se escribe primero como `.part` y reemplaza el GeoJSON anterior
solo al terminar el año completo. Si falla un año, se informa el error, se
conserva su archivo anterior si existía y se continúa con los demás; el proceso
termina con código 1. Un año sin registros genera una colección vacía y un aviso.
