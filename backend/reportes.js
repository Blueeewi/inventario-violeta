const express = require('express')
const router = express.Router()
const db = require('../database/db')
const XLSX = require('xlsx')

router.get('/exportar', (req, res) => {
  const ventas = db.prepare(`SELECT * FROM ventas ORDER BY fecha DESC`).all()

  const datos = ventas.map(v => ({
    'ID': v.id,
    'Fecha': v.fecha,
    'Cliente': v.cliente || '',
    'Colaborador': v.colaborador || '',
    'Subtotal': v.subtotal,
    'IVA': v.iva,
    'Total': v.total,
    '% Comisión': v.porcentaje_comision,
    'Valor Comisión': v.valor_comision
  }))

  const hoja = XLSX.utils.json_to_sheet(datos)
  const libro = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(libro, hoja, 'Ventas')

  const buffer = XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' })

  res.setHeader('Content-Disposition', 'attachment; filename=reporte-ventas.xlsx')
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.send(buffer)
})

module.exports = router