const XLSX = require('xlsx')
const path = require('path')

const workbook = XLSX.readFile(path.join(__dirname, 'InventarioAutomatizadoVioleta.xlsm'))
const hoja = workbook.Sheets['PRODUCTOS']
const filas = XLSX.utils.sheet_to_json(hoja, { range: 1 })

console.log('Total filas:', filas.length)
console.log('Fila 0:', filas[0])
console.log('Fila 1:', filas[1])