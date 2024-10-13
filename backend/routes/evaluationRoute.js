const express = require('express');
const router = express.Router();
const { deleteEvaluation, getEvaluation, getEvaluations, newEvaluation, updateEvaluation } = require('../controllers/evaluationController')

router.get('/evaluations', getEvaluations);
router.get('/evaluation/:id', getEvaluation, )
router.post('/new', newEvaluation);
router.patch('/update/:id', updateEvaluation);
router.delete('/delete/:id', deleteEvaluation);

module.exports = router;