CREATE TABLE IF NOT EXISTS productos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT NOT NULL,
  nombre TEXT NOT NULL,
  marca TEXT,
  precio_compra REAL DEFAULT 0,
  precio_venta REAL DEFAULT 0,
  tipo TEXT DEFAULT 'PRODUCTO'
);

CREATE TABLE IF NOT EXISTS movimientos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha TEXT NOT NULL,
  tipo TEXT NOT NULL,
  producto_id INTEGER NOT NULL,
  cantidad INTEGER NOT NULL,
  nota TEXT DEFAULT '',
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE IF NOT EXISTS ventas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha TEXT NOT NULL,
  cliente TEXT,
  colaborador TEXT,
  subtotal REAL DEFAULT 0,
  iva REAL DEFAULT 0,
  total REAL DEFAULT 0,
  porcentaje_comision REAL DEFAULT 0,
  valor_comision REAL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS detalle_venta (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  venta_id INTEGER NOT NULL,
  producto_id INTEGER NOT NULL,
  cantidad INTEGER NOT NULL,
  precio_unitario REAL NOT NULL,
  precio_manual REAL,
  total REAL NOT NULL,
  FOREIGN KEY (venta_id) REFERENCES ventas(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);