# Evaluación Parcial 2: QuickTrack

Base de Datos No Relacionales (BDY0101), sección 002D, Duoc UC.

Integrantes: Anyara Rosso e Italo Zapata.

Implementamos la base de datos de QuickTrack en Azure Cosmos DB for MongoDB. El proyecto incluye la carga de los datos, consultas de lectura, operaciones CRUD y la integración con Python.

## Contenido

- `Informe_EP2_Grupo07.pdf`: informe técnico.
- `EP2_Grupo07_QuickTrack.ipynb`: notebook de Google Colab con la conexión, las funciones CRUD y el registro de errores.
- `consultas/04_lecturas.js`: consultas de lectura.
- `consultas/05_crud.js`: corrección de datos y casos de negocio.
- `quick-track-data/`: datos del caso.
- `capturas/`: capturas de las consultas y sus resultados.

## Carga de datos

Los datos se cargaron con mongoimport en la base `quick-track-company`. Las colecciones son clientes, ordenes-entrega, rutas, seguimientos y valoraciones.

El archivo `clientes.json` es un arreglo JSON, por eso lleva `--jsonArray`. Los demás están en formato JSON Lines. Ejemplo:

```
mongoimport --uri "$COSMOS_URI" --db quick-track-company --collection clientes --file clientes.json --jsonArray --numInsertionWorkers 1 --batchSize 1
```

## Consultas

Los scripts de la carpeta `consultas` se ejecutaron en la consola mongosh de MongoDB Compass.

## Notebook

La cadena de conexión no está en el repositorio. Para ejecutar el notebook hay que guardarla en los Secrets de Colab con el nombre `COSMOS_URI`.
