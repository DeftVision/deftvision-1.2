const evaluationModel = require ('../models/evaluationModel')


exports.getEvaluations = async (req, res) => {
    try {
        const evaluations = await evaluationModel.find({});
        if(!evaluations) {
            return res.send({
                message: 'No evaluations found',
            })
        } else {
            return res.send({
                evaluationCount: evaluations.length,
                evaluations,
            })
        }
    } catch (error) {
        console.log(error)
        return res.send({
            message: 'Oops, something went wrong fetching the evaluations',
            error,
        })
    }
}

exports.getDashboardEvaluationData = async (req, res) => {
    try {
        const evaluations = await evaluationModel
            .find({})
            .select('date location foodScore cleanScore serviceScore finalScore');
        if(!evaluations) {
            return res.send({
                message: 'No evaluations found',
            });
        } else {
            return res.send({
                evaluationCount: evaluations.length,
                evaluations
            })
        }
    } catch (error) {
        console.log(error)
        return res.send({
            message: 'Oops, something went wrong fetching the evaluations',
            error,
        })
    }
}

exports.getEvaluation = async (req, res) => {
    try {
        const { id } = req.params
        const evaluation = await evaluationModel.findById(id);
        if(!evaluation) {
            return res.send({
                message: 'Evaluation not found',
            })
        } else {
            return res.send({
                evaluation,
            })
        }

    } catch (error) {
        console.log(error);
        return res.send({
            message: 'Oops, something went wrong fetching the evaluation',
            error,
        })
    }
}

exports.newEvaluation = async (req, res) => {
    try {
        const {
            userId,
            foodScore,
            cleanScore,
            serviceScore,
            finalScore,
            date,
            location,
            comments,
            cashier,
            upsell,
            greeting,
            repeatOrder,
            idManager,
            waitTime,
            uniqueFileName,
            downloadUrl,
        } = req.body;

        if(!userId || !foodScore || !cleanScore || !serviceScore || !finalScore || !date || !location || !cashier || !waitTime || !comments) {
            return res.send({
                message: 'Missing values in required fields'
            })
        } else {
            const evaluation = new evaluationModel({
                userId,
                foodScore,
                cleanScore,
                serviceScore,
                finalScore,
                date,
                location,
                comments,
                cashier,
                upsell,
                greeting,
                repeatOrder,
                idManager,
                waitTime,
                uniqueFileName,
                downloadUrl,
            })
            await evaluation.save()
            return res.status(200).send({
                evaluation,
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'oops, failed to submit evaluation',
            error,
        })
    }
}

exports.updateEvaluation = async (req, res) => {
    try {
        const {id} = req.params
        const {
            userId,
            foodScore,
            cleanScore,
            serviceScore,
            finalScore,
            date,
            location,
            comments,
            cashier,
            upsell,
            greeting,
            repeatOrder,
            idManager,
            waitTime,
            uniqueFileName,
            downloadUrl,
        } = req.body;
        const evaluation = await evaluationModel.findByIdAndUpdate(id, req.body, {new: true})
        if(!evaluation) {
            return res.send({
                message: 'Evaluation not found',
            })
        } else {
            return res.send({
                message: 'Evaluation updated successfully',
                evaluation,
            })
        }
    } catch (error) {
        console.log(error);
        return res.send({
            message: 'oops, something went saving the evaluation',
            error,
        })
    }
}

exports.deleteEvaluation = async (req, res) => {
    try {
        const {id} = req.params;
        const evaluation = await evaluationModel.findByIdAndDelete(id);
        if(!evaluation) {
            return res.send({
                message: 'Evaluation not found'
            })
        } else {
            return res.send({
                message: `Evaluation deleted successfully`
            })
        }
    } catch (error) {
        console.log(error);
        return res.send({
            message: 'Oops, something went wrong deleting the evaluation',
            error,
        })
    }
}