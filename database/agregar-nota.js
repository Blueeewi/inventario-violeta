const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(path.join(__dirname, 'inventario.db'))

db.prepare(`ALTER TABLE movimientos ADD COLUMN nota TEXT DEFAULT ''`).run()

console.log('Columna nota agregada correctamente')