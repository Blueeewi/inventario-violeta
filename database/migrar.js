const XLSX = require('xlsx')
const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(path.join(__dirname, 'inventario.db'))

const rutaExcel = path.join(__dirname, 'InventarioAutomatizadoVioleta.xlsm')
const workbook = XLSX.readFile(rutaExcel)
const hoja = workbook.Sheets['PRODUCTOS']
const filas = XLSX.utils.sheet_to_json(hoja, { range: 1 })

const insertar = db.prepare(`
  INSERT OR IGNORE INTO productos (codigo, nombre, marca, precio_compra, precio_venta, tipo)
  VALUES (?, ?, ?, ?, ?, 'PRODUCTO')
`)

let contador = 0

for (const fila of filas) {
  const codigo = fila['CODIGO'] || ''
  const nombre = fila['NOMBRE'] || ''
  const marca = fila['MARCA'] || ''
  const precio_compra = parseFloat(fila['PRECIO C/U'] || 0)
  const precio_venta = parseFloat(fila['PRECIO V/U'] || 0)

  if (!nombre) continue
  const codigoFinal = codigo || `SIN-CODIGO-${contador + 1}`

  insertar.run(codigoFinal, nombre.toString().trim(), marca.toString().trim(), precio_compra, precio_venta)
}

console.log(`✅ ${contador} productos importados correctamente`)