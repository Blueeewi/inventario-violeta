const express = require('express')
const router = express.Router()
const db = require('../database/db')

// Obtener todos los productos (con búsqueda opcional)
router.get('/', (req, res) => {
  const { q } = req.query
  let productos

  if (q) {
    productos = db.prepare(`
      SELECT * FROM productos 
      WHERE nombre LIKE ? OR codigo LIKE ? OR marca LIKE ?
      ORDER BY nombre ASC
    `).all(`%${q}%`, `%${q}%`, `%${q}%`)
  } else {
    productos = db.prepare(`
      SELECT * FROM productos ORDER BY nombre ASC
    `).all()
  }

  res.json(productos)
})

// Agregar un producto nuevo
router.post('/', (req, res) => {
  const { codigo, nombre, marca, precio_compra, precio_venta, tipo } = req.body

  if (!codigo || !nombre) {
    return res.status(400).json({ error: 'El código y nombre son obligatorios' })
  }

  const resultado = db.prepare(`
    INSERT INTO productos (codigo, nombre, marca, precio_compra, precio_venta, tipo)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(codigo, nombre, marca, precio_compra, precio_venta, tipo || 'PRODUCTO')

  res.json({ id: resultado.lastInsertRowid, mensaje: 'Producto creado correctamente' })
})

// Editar un producto
router.put('/:id', (req, res) => {
  const { codigo, nombre, marca, precio_compra, precio_venta, tipo } = req.body
  const { id } = req.params

  db.prepare(`
    UPDATE productos 
    SET codigo = ?, nombre = ?, marca = ?, precio_compra = ?, precio_venta = ?, tipo = ?
    WHERE id = ?
  `).run(codigo, nombre, marca, precio_compra, precio_venta, tipo, id)

  res.json({ mensaje: 'Producto actualizado correctamente' })
})

// Eliminar un producto
router.delete('/:id', (req, res) => {
  const { id } = req.params
  db.prepare('DELETE FROM productos WHERE id = ?').run(id)
  res.json({ mensaje: 'Producto eliminado correctamente' })
})

module.exports = router