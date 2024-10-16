const express = require('express');
const router = express.Router();

const { deleteEvaluation, getEvaluation, getEvaluations, newEvaluation, updateEvaluation, getDashboardEvaluationData } = require('../controllers/evaluationController')




router.post('/new',newEvaluation);
router.get('/evaluations', getEvaluations);
router.get('/evaluation/:id', getEvaluation, )
router.patch('/update/:id', updateEvaluation);
router.delete('/delete/:id', deleteEvaluation);


router.get('/evaluation-data', getDashboardEvaluationData)

module.exports = router;