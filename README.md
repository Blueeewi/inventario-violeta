# Inventario Violeta

Sistema de gestión de inventario, ventas y reportes para negocio de productos cosméticos y servicios de peluquería. Funciona de forma local o en red local WiFi.

## ¿Qué hace el sistema?

- Gestión de productos y servicios con validación de duplicados
- Control de inventario con entradas, salidas y stock en tiempo real
- Registro de ventas con cálculo automático de comisiones
- Generación automática de facturas en PDF al cerrar cada venta
- Reportes con filtro por fecha y exportación a Excel
- Dashboard con resumen del día
- Responsive — funciona desde celular en red local WiFi

## Tecnologías

- **Backend:** Node.js + Express
- **Base de datos:** SQLite (better-sqlite3)
- **Frontend:** HTML + CSS + JavaScript vanilla
- **PDF:** PDFKit
- **Excel:** xlsx

## Requisitos

- Node.js v18 o superior
- npm

## Instalación

1. git clone https://github.com/Blueeewi/inventario-violeta.git
   cd inventario-violeta

2. Instala las dependencias: npm install

3. Migra los productos desde el Excel: node database/migrar.js

4. Arranca el servidor: node backend/server.js

5. Abre el navegador en `http://localhost:3000`

## Arranque rápido

**Windows:** doble clic en `iniciar.bat`

**Linux:** doble clic en `iniciar.sh` → Ejecutar como programa

## Acceso desde celular (red local WiFi)

Con el servidor corriendo, obtén la IP del PC: hostname -I

Luego desde cualquier dispositivo en la misma red entra a `http://[IP]:3000`

## Estructura del proyecto

inventario-violeta/

├── backend/

│   ├── server.js

│   ├── productos.js

│   ├── inventario.js

│   ├── ventas.js

│   ├── reportes.js

│   └── factura.js

├── database/

│   ├── db.js

│   ├── schema.sql

│   └── migrar.js

├── frontend/

│   ├── index.html

│   ├── inventario.html

│   ├── ventas.html

│   ├── reportes.html

│   └── css/

│       └── style.css

├── iniciar.bat

├── iniciar.sh

└── package.json

## Módulos

### Productos
Listado completo con búsqueda en tiempo real. Agregar, editar y eliminar. Diferencia entre PRODUCTO (tiene stock) y SERVICIO (precio manual). Detecta duplicados exactos y similares antes de guardar. Al agregar un producto se pueden registrar las existencias iniciales directamente.

### Inventario
Entradas y salidas de stock con nota opcional. El stock se calcula automáticamente. Historial de movimientos por producto. Vista adaptada para celular.

### Ventas
Nota de venta con múltiples productos y servicios. Precio manual para servicios. Comisión por colaborador. Validación de stock antes de guardar. Genera factura PDF automáticamente al registrar la venta.

### Reportes
Historial completo de ventas con filtro por fecha. Totales de ingresos y comisiones. Exportación a Excel.

## Limpieza de datos de prueba

Para borrar ventas y movimientos sin afectar los productos: 

node -e "
const db = require('./database/db');
db.prepare('DELETE FROM detalle_venta').run();
db.prepare('DELETE FROM movimientos').run();
db.prepare('DELETE FROM ventas').run();
console.log('Datos eliminados correctamente');
"

## Notas importantes

## Entrega al cliente

1. Borrar `database/inventario.db`
2. Arrancar el servidor una vez para recrearla
3. Correr `node database/migrar.js`
4. Usar `iniciar.bat` o `iniciar.sh` desde ese momento

- La base de datos `inventario.db` se crea automáticamente al arrancar el servidor por primera vez.
- El archivo Excel original debe estar en `database/InventarioAutomatizadoVioleta.xlsm` para poder migrar los productos.
