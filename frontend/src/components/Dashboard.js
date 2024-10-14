import { Box, Modal, Stack, Typography } from '@mui/material'
import { useState, useEffect } from 'react'

import ScoreBarChart from '../visualData/ScoreBarChart'
import PerformancePieChart from '../visualData/PerformancePieChart'
import TrendLineChart from '../visualData/TrendLineChart'

export default function Dashboard() {
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);
    const [evaluations, setEvaluations] = useState([])

    useEffect(() => {
        const getEvaluations = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/evaluation/evaluations')
                const data = await response.json();
                setEvaluations(data.evaluations);
            } catch (error) {
                console.error('Error loading evaluations:', error)
            }
        };
        getEvaluations();
    }, []);


    //      calculate the average score
    // const averageFinalScore = evaluations.length > 0
    // ? evaluations.reduce((acc, curr) => acc + curr.finalScore, 0) / evaluations.length : 0;
    //

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', marginTop: 5, justifyContent: 'center'}}>
            <Typography variant='overline' sx={{fontSize: '1.5rem', textAlign: 'center', marginBottom: 5}}>Dashboard</Typography>

            {/* bar chart */}
            <ScoreBarChart evaluations={evaluations} setSelectedEvaluation={setSelectedEvaluation} />

            {/* trend line chart */}
            <TrendLineChart />

            {/* performance pie chart*/}
            <PerformancePieChart evaluations={evaluations}/>

            {/* evaluation details modal */}
            {selectedEvaluation && (
                <Modal open={true} onClose={() => setSelectedEvaluation(null)}>
                    <Box sx={{
                        padding: 4,
                        backgroundColor: 'white',
                        margin: 'auto',
                        borderRadius: 2,
                        width: 400 }}
                    >
                        <Stack direction='column' spacing={.25}>
                            <Typography variant='overline' gutterBottom>{`evaluation details for ${selectedEvaluation.location}`}</Typography>
                            <Typography variant='overline'>{`Date: ${new Date(selectedEvaluation.date).toLocaleDateString()}`}</Typography>
                            <Typography variant='overline'>{`Food: ${selectedEvaluation.foodScore}`}</Typography>
                            <Typography variant='overline'>{`Clean: ${selectedEvaluation.cleanScore}`}</Typography>
                            <Typography variant='overline'>{`Service: ${selectedEvaluation.serviceScore}`}</Typography>
                            <Typography variant='overline'>{`Final: ${selectedEvaluation.finalScore}`}</Typography>
                            <Typography variant='overline'>{`Comments: ${selectedEvaluation.comments}`}</Typography>
                            <Typography variant='overline'>{`Upsold: ${selectedEvaluation.upsell ? "Yes" : "No"}`}</Typography>
                            <Typography variant='overline'>{`Greeting: ${selectedEvaluation.greeting ? "Yes" : "No"}`}</Typography>
                            <Typography variant='overline'>{`Order Repeated: ${selectedEvaluation.repeatOrder ? "Yes" : "No"}`}</Typography>
                            <Typography variant='overline'>{`Identify Management: ${selectedEvaluation.idManager ? "Yes" : "NO"}`}</Typography>
                            <Typography variant='overline'>{`Wait Time: ${selectedEvaluation.waitTime}`}</Typography>
                        </Stack>
                    </Box>
                </Modal>
            )}
        </Box>
    );
}
