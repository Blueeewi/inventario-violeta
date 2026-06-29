const express = require('express')
const router = express.Router()
const db = require('../database/db')

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

router.post('/', (req, res) => {
  const { codigo, nombre, marca, precio_compra, precio_venta, tipo } = req.body
  const forzar = req.query.forzar === 'true'

  if (!codigo || !nombre) {
    return res.status(400).json({ error: 'El código y nombre son obligatorios' })
  }

  if (!forzar) {
    const duplicadoExacto = db.prepare(`
      SELECT id, nombre, codigo FROM productos 
      WHERE LOWER(TRIM(codigo)) = LOWER(TRIM(?)) 
      OR LOWER(TRIM(nombre)) = LOWER(TRIM(?))
    `).get(codigo, nombre)

    if (duplicadoExacto) {
      return res.status(400).json({ 
        error: `Ya existe un producto con ese código o nombre: "${duplicadoExacto.nombre}" (${duplicadoExacto.codigo})`
      })
    }

    const similar = db.prepare(`
      SELECT id, nombre, codigo FROM productos 
      WHERE LOWER(nombre) LIKE LOWER(?) 
      AND LOWER(TRIM(nombre)) != LOWER(TRIM(?))
    `).get(`%${nombre.substring(0, 6)}%`, nombre)

    if (similar) {
      return res.status(409).json({ 
        advertencia: true,
        mensaje: `Existe un producto similar: "${similar.nombre}" (${similar.codigo}). ¿Deseas continuar de todas formas?`,
        continuar: true
      })
    }
  }

  const resultado = db.prepare(`
    INSERT INTO productos (codigo, nombre, marca, precio_compra, precio_venta, tipo)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(codigo, nombre, marca, precio_compra, precio_venta, tipo || 'PRODUCTO')

  res.json({ id: resultado.lastInsertRowid, mensaje: 'Producto creado correctamente' })
})

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

router.delete('/:id', (req, res) => {
  const { id } = req.params
  db.prepare('DELETE FROM productos WHERE id = ?').run(id)
  res.json({ mensaje: 'Producto eliminado correctamente' })
})

module.exports = router