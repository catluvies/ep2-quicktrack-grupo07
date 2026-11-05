// Revisión 1: Órdenes sin cliente
db.getCollection("ordenes-entrega").aggregate([
  { $lookup: { from: "clientes", localField: "cliente_id", foreignField: "_id", as: "cliente" } },
  { $match: { cliente: { $size: 0 } } },
  { $count: "sin_cliente" }
])

db.getCollection("ordenes-entrega").findOne({}, { cliente_id: 1 })

db.clientes.findOne({}, { nombre: 1 })

db.getCollection("ordenes-entrega").updateMany(
  { cliente_id: { $type: "string" } },
  [{ $set: { cliente_id: { $toInt: { $substrCP: ["$cliente_id", 4, 3] } } } }]
)

db.getCollection("ordenes-entrega").aggregate([
  { $lookup: { from: "clientes", localField: "cliente_id", foreignField: "_id", as: "cliente" } },
  { $match: { "cliente.0": { $exists: true } } },
  { $count: "con_cliente" }
])


// Revisión 2: País mal escrito
db.clientes.find({ pais: "Vietman" }, { nombre: 1, pais: 1 })

db.clientes.updateMany({ pais: "Vietman" }, { $set: { pais: "Vietnam" } })

db.clientes.countDocuments({ pais: "Vietman" })


// Revisión 3: Estado actual distinto al historial
db.seguimientos.countDocuments({
  $expr: { $ne: ["$estado_actual", { $arrayElemAt: ["$historial.estado", -1] }] }
})

db.seguimientos.updateMany(
  { $expr: { $ne: ["$estado_actual", { $arrayElemAt: ["$historial.estado", -1] }] } },
  [{ $set: { estado_actual: { $arrayElemAt: ["$historial.estado", -1] } } }]
)

db.seguimientos.countDocuments({
  $expr: { $ne: ["$estado_actual", { $arrayElemAt: ["$historial.estado", -1] }] }
})


// Caso 1: Registrar un cliente nuevo y su primera orden
db.clientes.insertOne({
  _id: 101,
  nombre: "Camila Soto",
  correo: "camila.soto@gmail.com",
  pais: "Chile",
  fecha_registro: "2026-11-05"
})

db.getCollection("ordenes-entrega").insertOne({
  _id: "orden_101",
  cliente_id: 101,
  ruta_id: "ruta_10",
  fecha_envio: "2026-11-05T00:00:00",
  estado: "En preparación",
  medio_pago: "Tarjeta",
  total: 85000
})

db.seguimientos.insertOne({
  _id: "seg_101",
  orden_id: "orden_101",
  estado_actual: "En preparación",
  historial: [{ estado: "En preparación", fecha: "2026-11-05T00:00:00" }]
})

db.getCollection("ordenes-entrega").aggregate([
  { $match: { _id: "orden_101" } },
  { $lookup: { from: "clientes", localField: "cliente_id", foreignField: "_id", as: "cliente" } }
])


// Caso 2: La orden sale a reparto
db.getCollection("ordenes-entrega").updateOne(
  { _id: "orden_101" },
  { $set: { estado: "En tránsito" } }
)

db.seguimientos.updateOne(
  { orden_id: "orden_101" },
  {
    $set: { estado_actual: "En tránsito" },
    $push: { historial: { estado: "En tránsito", fecha: "2026-11-06T00:00:00" } }
  }
)

db.seguimientos.find({ orden_id: "orden_101" })


// Caso 3: Registrar la misma orden otra vez
db.getCollection("ordenes-entrega").insertOne({
  _id: "orden_101",
  cliente_id: 101,
  ruta_id: "ruta_10",
  fecha_envio: "2026-11-05T00:00:00",
  estado: "En preparación",
  medio_pago: "Tarjeta",
  total: 85000
})


// Caso 4: El cliente anula la orden
db.getCollection("ordenes-entrega").deleteOne({ _id: "orden_101" })

db.seguimientos.deleteOne({ orden_id: "orden_101" })

db.seguimientos.countDocuments({ orden_id: "orden_101" })

db.valoraciones.countDocuments({ orden_id: "orden_101" })

db.getCollection("ordenes-entrega").countDocuments()
