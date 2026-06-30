const express = require('express')
const path = require('path')
const os = require('os')
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

function obtenerIPLocal() {
  const interfaces = os.networkInterfaces()
  for (const nombre of Object.keys(interfaces)) {
    for (const iface of interfaces[nombre]) {
      // Buscamos una IP IPv4, que no sea "loopback" (127.0.0.1)
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return 'localhost'
}

app.listen(PORT, '0.0.0.0', () => {
  const ip = obtenerIPLocal()
  console.log('')
  console.log('✅ Servidor corriendo correctamente')
  console.log(`   En esta computadora: http://localhost:${PORT}`)
  console.log(`   Desde el celular (mismo wifi): http://${ip}:${PORT}`)
  console.log('')
})