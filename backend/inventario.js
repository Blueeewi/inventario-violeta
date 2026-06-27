const express = require('express')
const router = express.Router()
const db = require('../database/db')

// Ver stock actual de todos los productos
router.get('/', (req, res) => {
  const productos = db.prepare(`
    SELECT 
      p.id,
      p.codigo,
      p.nombre,
      p.marca,
      p.tipo,
      COALESCE(SUM(CASE WHEN m.tipo = 'ENTRADA' THEN m.cantidad ELSE 0 END), 0) AS entradas,
      COALESCE(SUM(CASE WHEN m.tipo = 'SALIDA' THEN m.cantidad ELSE 0 END), 0) AS salidas,
      COALESCE(SUM(CASE WHEN m.tipo = 'ENTRADA' THEN m.cantidad ELSE -m.cantidad END), 0) AS stock
    FROM productos p
    LEFT JOIN movimientos m ON m.producto_id = p.id
    WHERE p.tipo = 'PRODUCTO'
    GROUP BY p.id
    ORDER BY p.nombre ASC
  `).all()

  res.json(productos)
})

// Ver historial de movimientos de un producto
router.get('/movimientos/:producto_id', (req, res) => {
  const movimientos = db.prepare(`
    SELECT m.*, p.nombre, p.codigo
    FROM movimientos m
    JOIN productos p ON p.id = m.producto_id
    WHERE m.producto_id = ?
    ORDER BY m.fecha DESC
  `).all(req.params.producto_id)

  res.json(movimientos)
})

// Registrar entrada
router.post('/entrada', (req, res) => {
  const { producto_id, cantidad, nota } = req.body

  if (!producto_id || !cantidad || cantidad <= 0) {
    return res.status(400).json({ error: 'Producto y cantidad son obligatorios' })
  }

  db.prepare(`
    INSERT INTO movimientos (fecha, tipo, producto_id, cantidad, nota)
    VALUES (datetime('now', 'localtime'), 'ENTRADA', ?, ?, ?)
  `).run(producto_id, cantidad, nota || '')

  res.json({ mensaje: 'Entrada registrada correctamente' })
})

// Registrar salida
router.post('/salida', (req, res) => {
  const { producto_id, cantidad, nota } = req.body

  if (!producto_id || !cantidad || cantidad <= 0) {
    return res.status(400).json({ error: 'Producto y cantidad son obligatorios' })
  }

  const stockActual = db.prepare(`
    SELECT COALESCE(SUM(CASE WHEN tipo = 'ENTRADA' THEN cantidad ELSE -cantidad END), 0) AS stock
    FROM movimientos WHERE producto_id = ?
  `).get(producto_id)

  if (stockActual.stock < cantidad) {
    return res.status(400).json({ error: `Stock insuficiente. Stock actual: ${stockActual.stock}` })
  }

  db.prepare(`
    INSERT INTO movimientos (fecha, tipo, producto_id, cantidad, nota)
    VALUES (datetime('now', 'localtime'), 'SALIDA', ?, ?, ?)
  `).run(producto_id, cantidad, nota || '')

  res.json({ mensaje: 'Salida registrada correctamente' })
})

module.exports = router