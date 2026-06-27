const express = require('express')
const router = express.Router()
const db = require('../database/db')

// Ver todas las ventas
router.get('/', (req, res) => {
  const ventas = db.prepare(`
    SELECT * FROM ventas ORDER BY fecha DESC
  `).all()
  res.json(ventas)
})

// Ver detalle de una venta
router.get('/:id', (req, res) => {
  const venta = db.prepare(`SELECT * FROM ventas WHERE id = ?`).get(req.params.id)
  const detalle = db.prepare(`
    SELECT d.*, p.nombre, p.codigo, p.tipo
    FROM detalle_venta d
    JOIN productos p ON p.id = d.producto_id
    WHERE d.venta_id = ?
  `).all(req.params.id)
  res.json({ ...venta, detalle })
})

// Crear venta
router.post('/', (req, res) => {
  const { cliente, colaborador, porcentaje_comision, items } = req.body

  // Validaciones
  if (!cliente || cliente.trim() === '') {
    return res.status(400).json({ error: 'El nombre del cliente es obligatorio' })
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'La venta debe tener al menos un producto o servicio' })
  }

  for (const item of items) {
    if (!item.producto_id) {
      return res.status(400).json({ error: 'Todos los items deben tener un producto seleccionado' })
    }

    if (!item.cantidad || item.cantidad <= 0) {
      return res.status(400).json({ error: 'Todos los items deben tener una cantidad válida' })
    }

    const precio = item.precio_manual || item.precio_unitario
    if (!precio || precio <= 0) {
      return res.status(400).json({ error: 'Todos los items deben tener un precio mayor a cero' })
    }

    const producto = db.prepare(`SELECT tipo, id FROM productos WHERE id = ?`).get(item.producto_id)
    if (!producto) {
      return res.status(400).json({ error: 'Uno de los productos no existe' })
    }

    if (producto.tipo === 'PRODUCTO') {
      const stockActual = db.prepare(`
        SELECT COALESCE(SUM(CASE WHEN tipo = 'ENTRADA' THEN cantidad ELSE -cantidad END), 0) AS stock
        FROM movimientos WHERE producto_id = ?
      `).get(item.producto_id)

      if (stockActual.stock < item.cantidad) {
        const prod = db.prepare(`SELECT nombre FROM productos WHERE id = ?`).get(item.producto_id)
        return res.status(400).json({ error: `Stock insuficiente para "${prod.nombre}". Stock actual: ${stockActual.stock}` })
      }
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const iva = 0
  const total = subtotal + iva
  const valor_comision = (subtotal * (porcentaje_comision || 0)) / 100

  const crearVenta = db.transaction(() => {
    const venta = db.prepare(`
      INSERT INTO ventas (fecha, cliente, colaborador, subtotal, iva, total, porcentaje_comision, valor_comision)
      VALUES (datetime('now', 'localtime'), ?, ?, ?, ?, ?, ?, ?)
    `).run(cliente, colaborador, subtotal, iva, total, porcentaje_comision || 0, valor_comision)

    const ventaId = venta.lastInsertRowid

    for (const item of items) {
      db.prepare(`
        INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, precio_manual, total)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(ventaId, item.producto_id, item.cantidad, item.precio_unitario, item.precio_manual || null, item.total)

      const producto = db.prepare(`SELECT tipo FROM productos WHERE id = ?`).get(item.producto_id)
      if (producto.tipo === 'PRODUCTO') {
        db.prepare(`
          INSERT INTO movimientos (fecha, tipo, producto_id, cantidad, nota)
          VALUES (datetime('now', 'localtime'), 'SALIDA', ?, ?, 'Venta #' || ?)
        `).run(item.producto_id, item.cantidad, ventaId)
      }
    }

    return ventaId
  })

  const ventaId = crearVenta()
  res.json({ id: ventaId, mensaje: 'Venta registrada correctamente' })
})

module.exports = router