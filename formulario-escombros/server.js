const express = require('express');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/generar-pdf', (req, res) => {
  const {
    nombre,
    empresa,
    direccion,
    tipo,
    cantidad,
    telefono,
    comentarios,
  } = req.body;

  // Estimación aleatoria
  const hora = Math.floor(Math.random() * (18 - 9 + 1)) + 9;
  const minutos = Math.floor(Math.random() * 60);
  const llegada = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')} hrs`;

  const doc = new PDFDocument();
  let chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  doc.on('end', () => {
    const pdfBuffer = Buffer.concat(chunks);
    res.setHeader('Content-Disposition', 'attachment; filename=solicitud.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  });

  // Estilo general
  doc.fillColor('#2c3e50');
  doc.fontSize(20).text('Solicitud de Retiro de Escombros', { align: 'center' });
  doc.moveDown(0.5);

  // Línea separadora
  doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').stroke();
  doc.moveDown(1);

  // Datos
  doc.fontSize(12).fillColor('#000000');
  doc.text('Nombre del solicitante: ', { continued: true }).font('Helvetica-Bold').text(nombre);
  doc.font('Helvetica').text('Empresa: ', { continued: true }).font('Helvetica-Bold').text(empresa || 'No aplica');
  doc.font('Helvetica').text('Dirección de la obra: ', { continued: true }).font('Helvetica-Bold').text(direccion);
  doc.font('Helvetica').text('Tipo de residuos: ', { continued: true }).font('Helvetica-Bold').text(tipo);
  doc.font('Helvetica').text('Cantidad estimada: ', { continued: true }).font('Helvetica-Bold').text(cantidad);
  doc.font('Helvetica').text('Teléfono: ', { continued: true }).font('Helvetica-Bold').text(telefono);
  doc.font('Helvetica').text('Comentarios: ', { continued: true }).font('Helvetica-Bold').text(comentarios || 'Sin comentarios');
  doc.font('Helvetica').text('Hora estimada de retiro: ', { continued: true }).font('Helvetica-Bold').text(llegada);
  doc.moveDown(1);

  // Línea final
  doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').stroke();
  doc.moveDown(1);

  // Pie de página
  doc.fontSize(10).fillColor('#555').text('Gracias por utilizar nuestro servicio.', {
    align: 'center'
  });

  // Cierre del documento
  doc.end();
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
