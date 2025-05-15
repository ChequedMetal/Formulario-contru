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

  doc.fontSize(18).text('Solicitud de Retiro de Escombros', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Nombre: ${nombre}`);
  doc.text(`Empresa: ${empresa || 'No aplica'}`);
  doc.text(`Dirección: ${direccion}`);
  doc.text(`Tipo de residuos: ${tipo}`);
  doc.text(`Cantidad estimada: ${cantidad}`);
  doc.text(`Teléfono: ${telefono}`);
  doc.text(`Comentarios: ${comentarios || 'Sin comentarios'}`);
  doc.text(`Hora estimada de retiro: ${llegada}`);
  doc.end();
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
