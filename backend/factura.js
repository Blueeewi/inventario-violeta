const PDFDocument = require('pdfkit')

function generarFactura(res, venta) {
  const doc = new PDFDocument({ margin: 50 })

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename=factura-${venta.id}.pdf`)
  doc.pipe(res)

  // Colores
  const morado = '#6c3483'
  const gris = '#777777'

  // Encabezado
  doc.fillColor(morado).fontSize(24).font('Helvetica-Bold').text('Violeta 360 Studio', 50, 50)
  doc.fillColor(gris).fontSize(10).font('Helvetica')
    .text('Dirección: Diagonal 63 # 19C-36 Sur', 50, 80)
    .text('Teléfono: 313 2852653', 50, 93)
    .text('Email: violeta360studio@gmail.com', 50, 106)

  // Línea separadora
  doc.moveTo(50, 125).lineTo(550, 125).strokeColor(morado).lineWidth(2).stroke()

  // Título factura
  doc.fillColor(morado).fontSize(16).font('Helvetica-Bold').text('FACTURA DE VENTA', 50, 135)
  doc.fillColor('#333').fontSize(10).font('Helvetica')
    .text(`N° ${String(venta.id).padStart(6, '0')}`, 400, 135)
    .text(`Fecha: ${venta.fecha}`, 400, 148)

  // Datos cliente y colaborador
  doc.fillColor(morado).fontSize(11).font('Helvetica-Bold').text('DATOS DEL CLIENTE', 50, 175)
  doc.fillColor('#333').fontSize(10).font('Helvetica')
    .text(`Cliente: ${venta.cliente || '—'}`, 50, 190)
    .text(`Colaborador: ${venta.colaborador || '—'}`, 50, 203)

  // Línea
  doc.moveTo(50, 225).lineTo(550, 225).strokeColor('#dddddd').lineWidth(1).stroke()

  // Encabezado tabla productos
  doc.fillColor('white').rect(50, 230, 500, 22).fill(morado).stroke()
  doc.fillColor('white').fontSize(10).font('Helvetica-Bold')
    .text('Producto', 55, 236)
    .text('Cant.', 340, 236)
    .text('Precio unit.', 390, 236)
    .text('Total', 490, 236)

  // Filas de productos
  let y = 252
  let fondo = false

  for (const item of venta.detalle) {
    if (fondo) {
      doc.fillColor('#f9f4ff').rect(50, y, 500, 20).fill().stroke()
    }
    fondo = !fondo

    const precio = item.precio_manual || item.precio_unitario
    doc.fillColor('#333').fontSize(9).font('Helvetica')
      .text(item.nombre, 55, y + 5, { width: 280 })
      .text(item.cantidad, 345, y + 5)
      .text('$' + Number(precio).toLocaleString('es-CO'), 390, y + 5)
      .text('$' + Number(item.total).toLocaleString('es-CO'), 490, y + 5)

    y += 20
  }

  // Línea final tabla
  doc.moveTo(50, y + 5).lineTo(550, y + 5).strokeColor('#dddddd').lineWidth(1).stroke()

  // Totales
  y += 20
  doc.fillColor(gris).fontSize(10).font('Helvetica')
    .text('Subtotal:', 390, y)
    .text('$' + Number(venta.subtotal).toLocaleString('es-CO'), 490, y)

  y += 16
  doc.text('IVA:', 390, y)
    .text('$0', 490, y)

  y += 16
  doc.fillColor(morado).font('Helvetica-Bold').fontSize(12)
    .text('TOTAL:', 390, y)
    .text('$' + Number(venta.total).toLocaleString('es-CO'), 490, y)

  if (venta.porcentaje_comision > 0) {
    y += 16
    doc.fillColor(gris).font('Helvetica').fontSize(9)
      .text(`Comisión (${venta.porcentaje_comision}%): $${Number(venta.valor_comision).toLocaleString('es-CO')}`, 390, y)
  }

  // Mensaje final
  y += 50
  doc.moveTo(50, y).lineTo(550, y).strokeColor(morado).lineWidth(1).stroke()
  y += 15
  doc.fillColor(morado).fontSize(12).font('Helvetica-Bold')
    .text('¡Gracias por confiar en nosotros!', 50, y, { align: 'center' })
  y += 18
  doc.fillColor(gris).fontSize(9).font('Helvetica')
    .text('Violeta 360 Studio — Tu belleza, nuestra pasión', 50, y, { align: 'center' })

  doc.end()
}

module.exports = generarFactura