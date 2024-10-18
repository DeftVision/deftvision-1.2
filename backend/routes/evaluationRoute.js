const express = require('express');
const router = express.Router();

const { deleteEvaluation, getEvaluation, getEvaluations, newEvaluation, updateEvaluation, getDashboardEvaluationData, getFoodScoresTrendData, getCleanScoresTrendData, getServiceScoresTrendData } = require('../controllers/evaluationController')




router.post('/new',newEvaluation);
router.get('/evaluations', getEvaluations);
router.get('/evaluation/:id', getEvaluation, )
router.patch('/update/:id', updateEvaluation);
router.delete('/delete/:id', deleteEvaluation);


router.get('/evaluation-data', getDashboardEvaluationData)
router.get('/evaluation-food', getFoodScoresTrendData)
router.get('/evaluation-clean', getCleanScoresTrendData)
router.get('/evaluation-service', getServiceScoresTrendData)

module.exports = router;