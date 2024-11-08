const express = require('express');
const router = express.Router();

const {getDocuments, getDocument, newDocument, updateDocument, deleteDocument} = require('../controllers/documentController')


router.get('/documents', getDocuments);
router.get('/document/:id', getDocument);
router.post('/new', newDocument);
router.patch('/update/:id', updateDocument);
router.delete('/delete/:id', deleteDocument);

module.exports = router;