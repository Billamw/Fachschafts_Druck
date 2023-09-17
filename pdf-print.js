const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const app = express();

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Create multer instance
const upload = multer({ storage });

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.post('/submit', upload.single('pdfFile'), (req, res) => {

  const color = req.body.color;
  const duplex = req.body.duplex;

  let destinationFolder = 'default';
  if (color === 'true' && duplex === 'true') {
    destinationFolder = 'color-duplex';
  } else if (color === 'true') {
    destinationFolder = 'color';
  } else if (duplex === 'true') {
    destinationFolder = 'duplex';
  }

  fs.rename( path.join( req.file.destination, req.file.filename ), path.join( req.file.destination, destinationFolder, "file.pdf" ) );

  // Log or use the data as needed
  console.log(`Color: ${color}, Duplex: ${duplex}`);

  res.send('File uploaded successfully!');
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
