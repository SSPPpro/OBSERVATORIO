# Ordenamiento Territorial

El selector de Detección de cambios carga `visor/data/ordenamiento-territorial.geojson`.
La Galería y el Swipe cargan también `visor/data/ordenamiento-territorial-suelo-urbano.geojson`,
generado desde la misma capa de suelo, sin simplificar. Cada agrupación referencia los
polígonos urbanos a una distancia máxima de 1 km mediante `suelo_urbano_ids`.
Se dibujan con borde amarillo y relleno transparente sobre los mosaicos; las
construcciones conservan sus bordes azules. Publicar ambos archivos juntos.
El análisis se prepara fuera del navegador: la capa original de suelo pesa aproximadamente 767 MB.

Para regenerar después de actualizar las detecciones o el suelo, desde la raíz:

```powershell
py -3.13 -m pip install -r scripts/requirements-ordenamiento.txt
py -3.13 scripts/ordenamiento_territorial.py
py -3.13 -m unittest discover -s scripts -p "test_ordenamiento*.py"
```

La entrada predeterminada es el total `visor/data/reportes/resultado_unido_construcciones.geojson`,
la misma fuente de Detección de Construcciones. Si se configura otra fuente en `env.js`,
pasar su archivo local mediante `--buildings`. Publicar también el GeoJSON generado.
El resultado es una instantánea: **no se actualiza automáticamente** al cambiar las fuentes.

Se admite `--soil "visor/data/clasificacion suelo.geojson"` como alternativa al shapefile.
El shapefile usa su `.prj`; el GeoJSON debe estar en WGS84. El alias «Tipo suelo» se
exportó como `Tipo_Clasi` / `Tipo_Clasificacion_Suelo`, con código urbano 1.
El análisis usa EPSG:9377 (metros), sin simplificar las geometrías de cálculo.

Se consideran detecciones positivas de construcciones. Se excluyen las que intersectan
cualquier polígono urbano, incluso las que cruzan o tocan el perímetro. Son candidatas
las restantes cuya distancia mínima al suelo urbano es <= 1000 m. Una construcción
que cruza el borde exterior del buffer se incluye si su borde más próximo está dentro.
Se eliminan huellas geométricamente idénticas repetidas; detecciones con huellas
distintas se cuentan por separado. No se infiere un número de edificios físicos distinto
del número de huellas de detección.

Los grupos son componentes conexos: cada construcción se conecta con otra a <= 50 m
entre bordes. Una cadena puede tener un diámetro mayor de 50 m. No se agrupa por
centroides ni por hexágonos. Se omiten grupos con menos de cinco detecciones.
Amarillo: 5–9; naranja: 10–19; rojo: >=20. Se dibujan las huellas reales con borde azul y relleno transparente, y un marcador
por grupo para encontrarlos a escala nacional. La lista y el mapa permiten acercarse
a cada agrupación. El GeoJSON descargable contiene conteos, categoría, fechas y
metadatos del análisis. Los filtros temporales de las otras detecciones no se aplican.

Al seleccionar un grupo en el mapa o en la lista se abre la ventana de mosaicos
mensuales con Galer?a y Swipe, centrada en sus huellas y usando la fecha m?s reciente
del grupo. Los bordes azules tambi?n se muestran en ambas vistas.

La misma capa de contexto incluye las zonas de expansion urbana (codigo 3),
referenciadas por `expansion_urbana_ids` a un maximo de 1 km de la agrupacion.
Se muestran con borde morado y relleno transparente en Galeria y Swipe.
Esta capa es de referencia visual y no modifica los criterios de agrupacion.
