const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { color, duplex } = req.body;
    let destinationFolder = 'default';
    if (color === 'true' && duplex === 'true') {
      destinationFolder = 'color-duplex';
    } else if (color === 'true') {
      destinationFolder = 'color';
    } else if (duplex === 'true') {
      destinationFolder = 'duplex';
    }
    cb(null, path.join(__dirname, 'uploads', destinationFolder));
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

app.post('/upload', upload.single('pdfFile'), (req, res) => {
  res.send('File uploaded successfully!');
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
