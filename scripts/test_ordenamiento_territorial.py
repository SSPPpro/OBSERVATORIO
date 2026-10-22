import unittest
import json
import tempfile
from pathlib import Path
from pyproj import Transformer
from shapely.ops import transform
from shapely.geometry import mapping
from shapely.geometry import box, Polygon
from shapely.strtree import STRtree
from ordenamiento_territorial import category, cluster, eligible, generate


class TerritorialTests(unittest.TestCase):
    def test_thresholds_and_transitive_connections(self):
        for count in (4, 5, 9, 10, 19, 20):
            # Each successive footprint is exactly 50 metres from its neighbour.
            geoms = [box(i * 60, 0, i * 60 + 10, 10) for i in range(count)]
            groups = cluster(geoms)
            self.assertEqual([len(g) for g in groups], [count] if count >= 5 else [])
        self.assertEqual([category(n) for n in (5, 9, 10, 19, 20)],
                         ['amarillo', 'amarillo', 'naranja', 'naranja', 'rojo'])

    def test_distance_between_edges_not_centroids(self):
        self.assertEqual(len(cluster([box(i * 150, 0, i * 150 + 100, 100) for i in range(5)])), 1)
        self.assertEqual(cluster([box(i * 150.01, 0, i * 150.01 + 100, 100) for i in range(5)]), [])

    def test_urban_exclusion_and_outer_buffer(self):
        tree = STRtree([box(0, 0, 100, 100), box(200, 0, 300, 100)])
        for geom in (box(10, 10, 20, 20), box(90, 10, 110, 20), box(100, 10, 110, 20), box(210, 10, 220, 20)):
            self.assertFalse(eligible(geom, tree))
        self.assertTrue(eligible(box(1300, 10, 1310, 20), tree))
        self.assertFalse(eligible(box(1300.01, 10, 1310, 20), tree))

    def test_holes_are_outside_urban_soil(self):
        urban = Polygon([(0, 0), (100, 0), (100, 100), (0, 100)],
                        [[(20, 20), (80, 20), (80, 80), (20, 80)]])
        self.assertTrue(eligible(box(30, 30, 40, 40), STRtree([urban])))

    def test_geojson_pipeline_excludes_urban_negative_and_duplicates(self):
        project = Transformer.from_crs(9377, 4326, always_xy=True).transform

        def feature(geometry, properties):
            return {'type': 'Feature', 'geometry': mapping(transform(project, geometry)), 'properties': properties}

        x, y = 5000000, 2000000
        soil = feature(box(x, y, x + 100, y + 100), {'Tipo_Clasificacion_Suelo': 1})
        buildings = [feature(box(x + 200 + i * 30, y, x + 210 + i * 30, y + 10),
                             {'class_label': 'building'}) for i in range(5)]
        buildings += [buildings[0], feature(box(x + 20, y + 20, x + 30, y + 30), {})]
        buildings += [feature(box(x + 210, y + 30, x + 220, y + 40), {'change_direction': 'negative'})]
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for name, features in [('soil', [soil, feature(box(x + 190, y - 10, x + 350, y + 20), {'Tipo_Clasificacion_Suelo': 3})]), ('buildings', buildings)]:
                (root / (name + '.geojson')).write_text(json.dumps({'type': 'FeatureCollection', 'features': features}))
            generate(root / 'buildings.geojson', root / 'soil.geojson', root / 'output.geojson')
            result = json.loads((root / 'output.geojson').read_text(encoding='utf-8'))
            self.assertEqual(len(result['features']), 1)
            self.assertEqual(result['features'][0]['properties']['construcciones'], 5)
            self.assertEqual(result['features'][0]['properties']['categoria'], 'amarillo')
            self.assertEqual(result['features'][0]['properties']['suelo_urbano_ids'], [0])
            urban = json.loads((root / 'output-suelo-urbano.geojson').read_text(encoding='utf-8'))
            self.assertEqual(len(urban['features']), 2)
            self.assertEqual(result['features'][0]['properties']['expansion_urbana_ids'], ['expansion-0'])
            self.assertEqual(urban['features'][1]['properties']['tipo_suelo'], 'expansion urbana')
            self.assertEqual(urban['features'][0]['id'], 0)
            self.assertEqual(urban['features'][0]['properties']['tipo_suelo'], 'urbano')


if __name__ == '__main__':
    unittest.main()
