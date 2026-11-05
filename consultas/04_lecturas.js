use("quick-track-company")


// Consulta 1
db.getCollection("ordenes-entrega").find(
  { estado: { $in: ["En preparación", "En tránsito"] }, total: { $gt: 150000 } },
  { cliente_id: 1, estado: 1, total: 1 }
).sort({ total: -1 })


// Consulta 2
db.getCollection("ordenes-entrega").find(
  {
    $and: [
      { medio_pago: "Efectivo" },
      { estado: "Entregado" },
      { fecha_envio: { $gte: "2023-01-01", $lt: "2024-01-01" } }
    ]
  },
  { fecha_envio: 1, total: 1 }
)


// Consulta 3
db.getCollection("ordenes-entrega").aggregate([
  { $match: { estado: { $nin: ["Cancelado"] } } },
  {
    $group: {
      _id: "$medio_pago",
      cantidad: { $sum: 1 },
      total_vendido: { $sum: "$total" },
      promedio: { $avg: "$total" }
    }
  },
  { $sort: { total_vendido: -1 } }
])


// Consulta 4
db.getCollection("ordenes-entrega").aggregate([
  { $match: { estado: "Cancelado" } },
  {
    $lookup: {
      from: "rutas",
      localField: "ruta_id",
      foreignField: "_id",
      as: "ruta"
    }
  },
  { $unwind: "$ruta" },
  { $group: { _id: "$ruta.zona", canceladas: { $sum: 1 } } },
  { $sort: { canceladas: -1 } }
])


// Consulta 5
db.valoraciones.aggregate([
  {
    $lookup: {
      from: "ordenes-entrega",
      localField: "orden_id",
      foreignField: "_id",
      as: "orden"
    }
  },
  { $unwind: "$orden" },
  { $match: { "orden.estado": "Entregado" } },
  {
    $group: {
      _id: "$comentario",
      cantidad: { $sum: 1 },
      promedio_puntaje: { $avg: "$puntaje" },
      puntaje_min: { $min: "$puntaje" },
      puntaje_max: { $max: "$puntaje" }
    }
  },
  { $sort: { promedio_puntaje: -1 } }
])
