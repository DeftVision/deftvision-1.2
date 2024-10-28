import {Box, Modal, Stack, Typography} from '@mui/material'
import {useEffect, useState} from 'react'

import ScoreBarChart from '../visualData/ScoreBarChart'
import ScoreDataTable from '../visualData/ScoreDataTable'
import TrendLineChart from '../visualData/TrendLineChart'
import ScoresTrend from '../visualData/ScoresTrend'

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


    //calculate the average score
    const averageFinalScore = evaluations.length > 0
        ? ((evaluations.reduce((acc, curr) => acc + curr.finalScore, 0) / evaluations.length).toFixed(2)) : 0;


    return (
        <Box sx={{display: 'flex', flexDirection: 'column', marginTop: 5, justifyContent: 'center'}}>
            <Typography variant='overline'
                        sx={{fontSize: '1.5rem', textAlign: 'center', marginBottom: 5}}>Dashboard</Typography>

            {/* trend cards */}
            <ScoresTrend/>

            {/* bar chart */}
            <ScoreBarChart evaluations={evaluations} setSelectedEvaluation={setSelectedEvaluation}/>

            <Typography variant='overline' sx={{fontSize: '1rem', textAlign: 'center'}}>
                Average Score [all locations]:{<br/>} {<strong>{averageFinalScore}</strong>}
            </Typography>

            {/* data grid */}
            <ScoreDataTable evaluations={evaluations} setSelectedEvaluation={setSelectedEvaluation}/>

            {/* trend line chart */}
            <TrendLineChart/>

            {/* performance pie chart*/}
            {/*<PerformancePieChart evaluations={evaluations}/>*/}

            {/* evaluation details modal */}
            {selectedEvaluation && (
                <Modal open={true} onClose={() => setSelectedEvaluation(null)}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '10%',
                            left: '40%',
                            padding: 4,
                            backgroundColor: 'white',
                            color: '#000',
                            borderRadius: 2,
                            width: 400,
                            border: 'none',
                            outline: 'none'
                        }}
                    >
                        <Stack direction='column'>
                            <Typography variant='overline'
                                        sx={{fontSize: '.75rem'}}
                                        gutterBottom>{`evaluation for ${selectedEvaluation.location}`}</Typography>
                            <Typography
                                variant='overline'>{`Date: ${new Date(selectedEvaluation.date).toLocaleDateString()}`}</Typography>
                            <Typography variant='overline'>{`Cashier: ${selectedEvaluation.cashier}`}</Typography>
                            <Typography variant='overline'>{`Food: ${selectedEvaluation.foodScore}`}</Typography>
                            <Typography variant='overline'>{`Clean: ${selectedEvaluation.cleanScore}`}</Typography>
                            <Typography variant='overline'>{`Service: ${selectedEvaluation.serviceScore}`}</Typography>
                            <Typography variant='overline'>{`Final: ${selectedEvaluation.finalScore}`}</Typography>
                            <Typography
                                variant='overline'>{`Upsold: ${selectedEvaluation.upsell ? "Yes" : "No"}`}</Typography>
                            <Typography
                                variant='overline'>{`Greeting: ${selectedEvaluation.greeting ? "Yes" : "No"}`}</Typography>
                            <Typography
                                variant='overline'>{`Order Repeated: ${selectedEvaluation.repeatOrder ? "Yes" : "No"}`}</Typography>
                            <Typography
                                variant='overline'>{`Management Identified: ${selectedEvaluation.idManager ? "Yes" : "NO"}`}</Typography>
                            <Typography variant='overline'>{`Wait Time: ${selectedEvaluation.waitTime}`}</Typography>
                        </Stack>
                    </Box>
                </Modal>
            )}
        </Box>
    );
}
