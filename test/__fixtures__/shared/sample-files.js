const { Types } = require('mongoose');

const sampleFiles = {
    jpgImage: {
        originalname: 'sample-avatar.jpg',
        mimetype: 'image/jpg'
    },
    textFile: {
        originalname: 'sample-file.txt',
        mimetype: 'text/plain'
    },
    pngImage: {
        originalname: 'sample-image.png',
        mimetype: 'image/png'
    },
    pdfFile: {
        originalname: 'sample-pdf.pdf',
        mimetype: 'application/pdf'
    },
    presentationFile: {
        originalname: 'sample-presentation.pptx',
        mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    },
    sheetFile: {
        originalname: 'sample-sheet.xlsx',
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    },
    documentFile: {
        originalname: 'sample-word-document.docx',
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    zipFile: {
        originalname: 'sample-zip.zip',
        mimetype: 'application/zip'
    }
};

module.exports = sampleFiles;
