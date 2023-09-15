const express = require('express');
const multer = require('multer');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

// GET route for the upload page
app.get('', (req, res) => {
  // Render your HTML upload form here
  res.send('Upload page');
});

// POST route for handling the file upload
app.post('', upload.single('pdfFile'), (req, res) => {
  const { color, duplex } = req.body;
  const { path, originalname } = req.file;

  let destinationFolder = 'default';
  if (color && duplex) {
    destinationFolder = 'color-duplex';
  } else if (color) {
    destinationFolder = 'color';
  } else if (duplex) {
    destinationFolder = 'duplex';
  }

  // Logic to move the uploaded file to the appropriate folder
  // You can use the 'fs' module to accomplish this
  const fs = require('fs');
  const newPath = `uploads/${destinationFolder}/${originalname}`;
  fs.renameSync(path, newPath);
  alert('test');
  res.send('File uploaded successfully!');
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
