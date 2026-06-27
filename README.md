# Inventario Violeta

Sistema de gestión de inventario, ventas y reportes para negocio de productos cosméticos y servicios de peluquería.

## ¿Qué hace el sistema?

- Gestión de productos y servicios
- Control de inventario con entradas y salidas
- Registro de ventas con cálculo automático de comisiones
- Reportes con exportación a Excel
- Dashboard con resumen del día

## Tecnologías

- **Backend:** Node.js + Express
- **Base de datos:** SQLite (better-sqlite3)
- **Frontend:** HTML + CSS + JavaScript vanilla

## Requisitos

- Node.js v18 o superior
- npm

## Instalación

1. Clona el repositorio: git clone https://github.com/Blueeewi/inventario-violeta.git

2. Instala las dependencias: npm install

3. Migra los productos desde el Excel: node database/migrar.js

4. Arranca el servidor: node backend/server.js

5. Abre el navegador en `http://localhost:3000`

## Arranque rápido

**Windows:** doble clic en `iniciar.bat`

**Linux:** doble clic en `iniciar.sh` → Ejecutar como programa

## Estructura del proyecto

inventario-violeta/

├── backend/

│   ├── server.js

│   ├── productos.js

│   ├── inventario.js

│   ├── ventas.js

│   └── reportes.js

├── database/

│   ├── db.js

│   ├── schema.sql

│   ├── migrar.js

│   └── inventario.db

├── frontend/

│   ├── index.html

│   ├── inventario.html

│   ├── ventas.html

│   └── reportes.html

├── iniciar.bat

├── iniciar.sh

└── package.json

## Módulos

### Productos
Listado completo de productos y servicios con búsqueda en tiempo real. Permite agregar, editar y eliminar. Diferencia entre PRODUCTO (tiene stock) y SERVICIO (precio manual por venta).

### Inventario
Registro de entradas y salidas de stock. El stock se calcula automáticamente como entradas menos salidas. Incluye historial de movimientos por producto.

### Ventas
Creación de notas de venta con múltiples productos y servicios. Calcula subtotal, IVA y total. Soporta precio manual para servicios y porcentaje de comisión por colaborador. Al guardar descuenta el stock automáticamente.

### Reportes
Historial completo de ventas con filtro por fecha. Muestra totales de ingresos y comisiones. Exportación a Excel.

## Notas importantes

- La base de datos `inventario.db` se crea automáticamente al arrancar el servidor por primera vez.
- Para entregar el sistema limpio al cliente: borrar `inventario.db`, arrancar el servidor y correr `node database/migrar.js`.
- El archivo Excel original debe estar en `database/InventarioAutomatizadoVioleta.xlsm` para poder migrar los productos.
