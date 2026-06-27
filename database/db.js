const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const dbPath = path.join(__dirname, 'inventario.db')
const schemaPath = path.join(__dirname, 'schema.sql')

const db = new Database(dbPath)

const schema = fs.readFileSync(schemaPath, 'utf8')
db.exec(schema)

console.log('Base de datos lista')

module.exports = db