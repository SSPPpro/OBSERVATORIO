"""Prepare territorial clusters without loading the soil dataset in the browser."""
import argparse
import json
from pathlib import Path
from datetime import datetime, timezone

import ijson
import shapefile
from pyproj import Transformer
from shapely import make_valid, normalize
from shapely.geometry import shape, mapping
from shapely.ops import transform, unary_union
from shapely.strtree import STRtree

ROOT = Path(__file__).resolve().parents[1]


def cluster(geometries, max_distance=50):
    """Connected components, using polygon-edge distance in projected metres."""
    tree = STRtree(geometries)
    parents = list(range(len(geometries)))

    def root(i):
        while parents[i] != i:
            parents[i] = parents[parents[i]]
            i = parents[i]
        return i

    for i, geometry in enumerate(geometries):
        for j in tree.query(geometry, predicate="dwithin", distance=max_distance):
            if j > i:
                parents[root(int(j))] = root(i)
    groups = {}
    for i in range(len(geometries)):
        groups.setdefault(root(i), []).append(i)
    return [ids for ids in groups.values() if len(ids) >= 5]


def category(count):
    return "rojo" if count >= 20 else "naranja" if count >= 10 else "amarillo"


def eligible(geometry, urban_tree):
    # Exclude intersections, including buildings straddling the urban boundary.
    return (not len(urban_tree.query(geometry, predicate="intersects"))
            and bool(len(urban_tree.query(geometry, predicate="dwithin", distance=1000))))


def assign_municipalities(features, municipalities):
    """Name each cluster by the municipality with the largest intersecting footprint area."""
    project = Transformer.from_crs(4326, 9377, always_xy=True).transform
    areas, properties = [], []
    with municipalities.open('rb') as stream:
        for feature in ijson.items(stream, 'features.item', use_float=True):
            areas.append(make_valid(transform(project, shape(feature['geometry']))))
            properties.append(feature['properties'])
    tree = STRtree(areas)
    for feature in features:
        geometry = transform(project, shape(feature['geometry']))
        matches = tree.query(geometry, predicate='intersects')
        if not len(matches):
            feature['properties']['municipio'] = 'Municipio no identificado'
            continue
        index = max(matches, key=lambda i: geometry.intersection(areas[i]).area)
        props = properties[index]
        feature['properties'].update(municipio=props['MpNombre'], codigo_municipio=props.get('MpCodigo', ''),
                                     departamento=props.get('Depto', ''))


def generate(buildings, soil, output, municipalities=ROOT / 'visor/data/limite-municipal.geojson'):
    to_meters = Transformer.from_crs(4326, 9377, always_xy=True).transform
    to_wgs84 = Transformer.from_crs(9377, 4326, always_xy=True).transform
    urban = []
    expansion = []
    if soil.suffix.lower() == '.shp':
        # The supplied .prj is EPSG:9377. Read it rather than assuming the CRS.
        soil_to_meters = Transformer.from_crs(soil.with_suffix('.prj').read_text(), 9377, always_xy=True).transform
        with shapefile.Reader(str(soil), encoding='utf-8', encodingErrors='replace') as reader:
            for record in reader.iterShapeRecords():
                if record.record['Tipo_Clasi'] == 1:
                    urban.append(make_valid(transform(soil_to_meters, shape(record.shape.__geo_interface__))))
                elif record.record['Tipo_Clasi'] == 3:
                    expansion.append(make_valid(transform(soil_to_meters, shape(record.shape.__geo_interface__))))
    else:
        with soil.open('rb') as stream:
            for feature in ijson.items(stream, 'features.item', use_float=True):
                props = feature['properties']
                value = props.get('Tipo_Clasificacion_Suelo', props.get('Tipo_Clasi', props.get('tipo suelo')))
                if str(value).strip().lower() in ('1', 'urbano'):
                    urban.append(make_valid(transform(to_meters, shape(feature['geometry']))))
                elif str(value).strip().lower() in ('3', 'expansion urbana', 'expansi\u00f3n urbana'):
                    expansion.append(make_valid(transform(to_meters, shape(feature['geometry']))))
    if not urban:
        raise ValueError('No se encontraron polígonos urbanos en la capa de suelo.')
    print(f'Polígonos urbanos: {len(urban)}', flush=True)
    tree = STRtree(urban)
    expansion_tree = STRtree(expansion)
    geometries, dates, seen = [], [], set()
    total = 0
    with buildings.open('rb') as stream:
        for feature in ijson.items(stream, 'features.item', use_float=True):
            props = feature.get('properties', {})
            if props.get('class_label', 'building') != 'building' or props.get('change_direction', 'positive') != 'positive':
                continue
            total += 1
            geom = make_valid(transform(to_meters, shape(feature['geometry'])))
            if geom.is_empty or geom.geom_type not in ('Polygon', 'MultiPolygon'):
                raise ValueError(f'Geometría no poligonal en detección {total}')
            if not eligible(geom, tree):
                continue
            # Identical footprints repeated across monthly reports count once.
            key = normalize(geom).wkb
            if key in seen:
                continue
            seen.add(key)
            geometries.append(geom)
            dates.append(str(props.get('observed') or props.get('date') or '')[:10])
    print(f'Detecciones: {total}; candidatas únicas: {len(geometries)}', flush=True)
    groups = cluster(geometries)
    groups.sort(key=lambda ids: (-len(ids), ids[0]))
    features = []
    for number, ids in enumerate(groups, 1):
        geom = unary_union([geometries[i] for i in ids])
        observed = sorted(dates[i] for i in ids if dates[i])
        features.append({'type': 'Feature', 'geometry': mapping(transform(to_wgs84, geom)), 'properties': {
            'grupo': number, 'construcciones': len(ids), 'categoria': category(len(ids)),
            'expansion_urbana_ids': ['expansion-' + str(i) for i in sorted(expansion_tree.query(geom, predicate='dwithin', distance=1000))],
            'suelo_urbano_ids': sorted(int(i) for i in tree.query(geom, predicate='dwithin', distance=1000)),
            'fecha_inicial': observed[0] if observed else '', 'fecha_final': observed[-1] if observed else '',
        }})
    assign_municipalities(features, municipalities)
    result = {'type': 'FeatureCollection', 'metadata': {
        'generado': datetime.now(timezone.utc).isoformat(), 'detecciones': total,
        'candidatas': len(geometries), 'poligonos_urbanos': len(urban),
        'buffer_m': 1000, 'distancia_m': 50, 'crs_calculo': 'EPSG:9377',
        'fuente_construcciones': buildings.name, 'fuente_suelo': soil.name,
    }, 'features': features}
    output.parent.mkdir(parents=True, exist_ok=True)
    urban_ids = sorted({i for feature in features for i in feature['properties']['suelo_urbano_ids']})
    urban_output = output.with_name(output.stem + '-suelo-urbano.geojson')
    urban_result = {'type': 'FeatureCollection', 'features': [
        {'type': 'Feature', 'id': i, 'properties': {'tipo_suelo': 'urbano'},
         'geometry': mapping(transform(to_wgs84, urban[i]))} for i in urban_ids
    ]}
    expansion_ids = sorted({int(i.split('-')[1]) for feature in features for i in feature['properties']['expansion_urbana_ids']})
    urban_result['features'].extend([
        {'type': 'Feature', 'id': 'expansion-' + str(i), 'properties': {'tipo_suelo': 'expansion urbana'},
         'geometry': mapping(transform(to_wgs84, expansion[i]))} for i in expansion_ids
    ])
    urban_temporary = urban_output.with_suffix('.tmp')
    urban_temporary.write_text(json.dumps(urban_result, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    urban_temporary.replace(urban_output)
    temporary = output.with_suffix('.tmp')
    temporary.write_text(json.dumps(result, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    temporary.replace(output)
    print(f'{len(features)} grupos guardados en {output}', flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--buildings', type=Path, default=ROOT / 'visor/data/reportes/resultado_unido_construcciones.geojson')
    parser.add_argument('--soil', type=Path, default=ROOT / 'visor/data/ClasificacionSuelo.shp')
    parser.add_argument('--output', type=Path, default=ROOT / 'visor/data/ordenamiento-territorial.geojson')
    parser.add_argument('--municipalities', type=Path, default=ROOT / 'visor/data/limite-municipal.geojson')
    args = parser.parse_args()
    generate(args.buildings, args.soil, args.output, args.municipalities)
