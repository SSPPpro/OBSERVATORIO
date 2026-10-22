"""Exporta por año los footprints del catálogo BYOC usado por el visor.

Python 3.9+, sin dependencias externas. Ver extraer_footprints_planet.md.
"""

import argparse
import json
import re
import sys
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


DATA_DIR = Path(__file__).resolve().parent


def default_collection():
    text = (DATA_DIR.parent / "env.js").read_text(encoding="utf-8")
    match = re.search(r'rasterMosaicByocCollection\s*:\s*[\"\']([^\"\']+)', text)
    if not match:
        raise ValueError("No se encontró rasterMosaicByocCollection en visor/env.js")
    return match.group(1)


def request_page(url, payload):
    for attempt in range(5):
        request = Request(url, data=json.dumps(payload).encode("utf-8"), headers={
            "Content-Type": "application/json", "Accept": "application/geo+json",
        }, method="POST")
        try:
            with urlopen(request, timeout=120) as response:
                page = json.load(response)
            if not isinstance(page, dict) or not isinstance(page.get("features"), list):
                raise ValueError("El servidor no devolvió una colección de features válida")
            return page
        except HTTPError as error:
            if error.code not in (408, 429, 500, 502, 503, 504) or attempt == 4:
                detail = error.read(4000).decode("utf-8", errors="replace")
                raise RuntimeError("Error HTTP {} consultando el catálogo: {}".format(error.code, detail)) from error
        except (URLError, TimeoutError):
            if attempt == 4:
                raise
        time.sleep(2 ** attempt)


def export_year(url, collection, year, output_dir, page_size):
    payload = {
        "collections": [collection],
        # El catálogo BYOC exige un filtro espacial; esta extensión cubre el mundo.
        "bbox": [-180, -90, 180, 90],
        "datetime": "{}-01-01T00:00:00Z/{}-12-31T23:59:59.999999Z".format(year, year),
        "limit": page_size,
    }
    target = output_dir / "planet_footprints_{}.geojson".format(year)
    temporary = target.with_suffix(".geojson.part")
    seen_ids, seen_tokens = set(), set()
    count = 0
    try:
        with temporary.open("w", encoding="utf-8") as stream:
            stream.write('{"type":"FeatureCollection","features":[')
            while True:
                page = request_page(url, payload)
                for feature in page["features"]:
                    geometry = feature.get("geometry")
                    if (feature.get("type") != "Feature" or not isinstance(geometry, dict)
                            or geometry.get("type") not in ("Polygon", "MultiPolygon")
                            or not geometry.get("coordinates")):
                        raise ValueError("Footprint inválido: {}".format(feature.get("id")))
                    identity = json.dumps([feature.get("collection", collection), feature.get("id")])
                    if feature.get("id") is not None:
                        if identity in seen_ids:
                            continue
                        seen_ids.add(identity)
                    if count:
                        stream.write(",")
                    json.dump(feature, stream, ensure_ascii=False, allow_nan=False, separators=(",", ":"))
                    count += 1
                print("{}: {} footprints".format(year, count), flush=True)
                token = (page.get("context") or {}).get("next")
                if token is None:
                    if any(link.get("rel") == "next" for link in page.get("links", [])):
                        raise ValueError("El catálogo indica otra página sin context.next")
                    break
                token_key = json.dumps(token, sort_keys=True)
                if token_key in seen_tokens:
                    raise ValueError("El catálogo repitió el token de paginación")
                seen_tokens.add(token_key)
                payload["next"] = token
            stream.write("]}")
        temporary.replace(target)
    except BaseException:
        temporary.unlink(missing_ok=True)
        raise
    return count, target


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--years", nargs="+", type=int, default=[2023, 2024, 2025])
    parser.add_argument("--collection", help="Colección BYOC; por defecto se lee de visor/env.js")
    parser.add_argument("--catalog-url", default="https://ccg.igac.gov.co/get-catalog",
                        help="Endpoint del proxy /get-catalog")
    parser.add_argument("--output-dir", type=Path, default=DATA_DIR / "footprints_planet")
    parser.add_argument("--page-size", type=int, default=100)
    args = parser.parse_args()
    if not 1 <= args.page_size <= 100 or any(y < 1 or y > 9998 for y in args.years):
        parser.error("Use años entre 1 y 9998 y --page-size entre 1 y 100")
    collection = args.collection or default_collection()
    if not collection.startswith("byoc-"):
        collection = "byoc-" + collection
    args.output_dir.mkdir(parents=True, exist_ok=True)
    failed = False
    for year in dict.fromkeys(args.years):
        try:
            count, target = export_year(args.catalog_url, collection, year, args.output_dir, args.page_size)
            print("Guardado: {} ({} footprints)".format(target, count))
            if count == 0:
                print("AVISO: el catálogo no devolvió registros para {}".format(year), file=sys.stderr)
        except Exception as error:
            failed = True
            print("ERROR {}: {}".format(year, error), file=sys.stderr)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
