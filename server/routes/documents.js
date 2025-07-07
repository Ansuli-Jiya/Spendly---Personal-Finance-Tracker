const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const auth = require('../middleware/auth');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// GET /api/documents - List all documents
router.get('/', auth.protect, async (req, res) => {
  try {
    const docs = await Document.find().sort({ uploadedAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching documents' });
  }
});

// POST /api/documents - Upload a new document
router.post('/', auth.protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    const doc = new Document({
      name: req.body.name,
      description: req.body.description,
      fileUrl,
      uploadedBy: req.user ? req.user.id : undefined
    });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: 'Error uploading document', error: err.message });
  }
});

// DELETE /api/documents/:id - Delete a document
router.delete('/:id', auth.protect, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    // Delete file from disk
    const filePath = path.join(__dirname, '../', doc.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await doc.deleteOne();
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting document', error: err.message });
  }
});

module.exports = router; 