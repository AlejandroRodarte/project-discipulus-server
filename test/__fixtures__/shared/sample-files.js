const { Types } = require('mongoose');

const sampleFiles = {
    jpgImage: {
        _id: new Types.ObjectId(),
        originalname: 'sample-avatar.jpg',
        mimetype: 'image/jpg'
    },
    textFile: {
        _id: new Types.ObjectId(),
        originalname: 'sample-file.txt',
        mimetype: 'text/plain'
    },
    pngImage: {
        _id: new Types.ObjectId(),
        originalname: 'sample-image.png',
        mimetype: 'image/png'
    },
    pdfFile: {
        _id: new Types.ObjectId(),
        originalname: 'sample-pdf.pdf',
        mimetype: 'application/pdf'
    },
    presentationFile: {
        _id: new Types.ObjectId(),
        originalname: 'sample-presentation.pptx',
        mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    },
    sheetFile: {
        _id: new Types.ObjectId(),
        originalname: 'sample-sheet.xlsx',
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    },
    documentFile: {
        _id: new Types.ObjectId(),
        originalname: 'sample-word-document.docx',
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    zipFile: {
        _id: new Types.ObjectId(),
        originalname: 'sample-zip.zip',
        mimetype: 'application/zip'
    }
};

module.exports = sampleFiles;
