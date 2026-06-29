const express = require('express')
const path = require('path')
const db = require('../database/db')
const productosRouter = require('./productos')
const inventarioRouter = require('./inventario')
const ventasRouter = require('./ventas')
const reportesRouter = require('./reportes')
const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, '../frontend')))

app.use('/api/productos', productosRouter)
app.use('/api/inventario', inventarioRouter)
app.use('/api/ventas', ventasRouter)
app.use('/api/reportes', reportesRouter)

app.get('/ping', (req, res) => {
  res.json({ mensaje: 'El servidor está funcionando' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://192.168.1.148:${PORT}`)
})