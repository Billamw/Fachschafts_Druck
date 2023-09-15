function uploadPDF() {
    const pdfInput = document.getElementById('pdfInput');
    const file = pdfInput.files[0];

    if (file) {
        // Hier kannst du den Code für das Hochladen der PDF-Datei implementieren.
        // Du könntest beispielsweise eine AJAX-Anfrage an einen Server senden,
        // der die Datei verarbeitet und speichert.

        // Hier ist ein einfaches Beispiel, wie du den Dateinamen anzeigen kannst:
        alert('Du hast die PDF-Datei ' + file.name + ' ausgewählt.');
    } else {
        alert('Bitte wähle zuerst eine PDF-Datei aus.');
    }
}