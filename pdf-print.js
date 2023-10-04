const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
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


// Benutzername und Passwort für den Zugriff auf die Seite
const password = '1234';

// Middleware zur Überprüfung des Benutzernamens und Passworts
const checkAuthentication = (req, res, next) => {
  const providedPassword = req.query.password;

  if (providedPassword === password) {
    // Authentifizierung erfolgreich
    next();
  } else {
    // Authentifizierung fehlgeschlagen
    res.status(401).send('Ungültige Anmeldeinformationen');
  }
};

// Middleware für den Zugriff auf die geschützte Seite
app.get('/geschuetzte-seite', checkAuthentication, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'login.html'));
});

app.post('/submit', upload.single('pdfFile'), (req, res) => {

  const color = req.body.color;
  const duplex = req.body.duplex;

  let destinationFolder = 'default';
  let printer = "-default";
  let isDuplex = false;
  if (color === 'true' && duplex === 'true') {
    destinationFolder = 'color-duplex';
    isDuplex = true;
    printer = ' CanoniP4300';
  } else if (color === 'true') {
    destinationFolder = 'color';
    printer = ' Duplex';
  } else if (duplex === 'true') {
    destinationFolder = 'color-duplex';
    printer = ' CanoniP4300';
    isDuplex = true;
  }

  fs.rename( path.join( req.file.destination, req.file.filename ), path.join( req.file.destination, destinationFolder, "file.pdf" ) );
  
  const numPrints = req.body.numPrints;


  // Execute the sumatra.exe -print command
 let printCommand = `SumatraPDF.exe -print-settings "${numPrints}x" -print-to${printer} C:\\print-pdf\\uploads\\${destinationFolder}\\file.pdf`;

  if(isDuplex)
    printCommand = `SumatraPDF.exe -print-settings "${numPrints}x, duplex" -print-to${printer} C:\\print-pdf\\uploads\\${destinationFolder}\\file.pdf`;



  exec(printCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      console.error(`Command stderr: ${stderr}`);
      return;
    }
    console.log(printCommand);
  });



  // Log or use the data as needed
  console.log(`Color: ${color}, Duplex: ${duplex}`);

  res.send('File uploaded successfully!');
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
