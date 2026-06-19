import geopandas as gpd
import os

# 1. Definir la ruta de la carpeta
ruta_carpeta = r'C:\Users\maico\OneDrive\Escritorio\PROCALCULO SAS\OneDrive - Procalculo Prosis S.A.S\GOB CIVIL\CLIENTES\IGAC\OBSERVATORIO TIERRA Y TERRITORIO\ott_princ_24_05\ott\visor\data\reportes'

# 2. Listar todos los archivos GeoJSON en la ruta
archivos = [os.path.join(ruta_carpeta, f) for f in os.listdir(ruta_carpeta) if f.endswith('.geojson')]

if not archivos:
    print("No se encontraron archivos .geojson en la ruta especificada.")
else:
    # 3. Leer y almacenar cada GeoDataFrame en una lista
    gdfs = [gpd.read_file(f) for f in archivos]

    # 4. Concatenar todos los GeoDataFrames
    gdf_final = gpd.pd.concat(gdfs, ignore_index=True)

    # 5. Guardar el resultado en la misma carpeta
    ruta_salida = os.path.join(ruta_carpeta, 'resultado_unido_total.geojson')
    gdf_final.to_file(ruta_salida, driver='GeoJSON')

    print(f"¡Proceso completado! Se unieron {len(archivos)} archivos.")
    print(f"Archivo guardado en: {ruta_salida}")