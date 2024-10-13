import { Box, Modal, Stack, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

//      color palette for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


export default function Dashboard() {
    const theme = useTheme();
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);
    const [evaluations, setEvaluations] = useState([])
    const [openModal, setOpenModal] = useState(false);

    const upsellData = [
        { name: 'Upsell', value: evaluations.filter(e => e.upsell).length },
        { name: 'No Upsell', value: evaluations.filter(e => !e.upsell).length },
    ]

    const finalScoresData = evaluations.map(evaluation => ({
        date: new Date(evaluation.date).toLocaleDateString(),
        finalScore: evaluation.finalScore,
    }));

    const handleClose = () => {
        setOpenModal(false);
        setSelectedEvaluation(null);
    }

    useEffect(() => {
        const getEvaluations = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/evaluation/evaluations', {
                    method: 'GET',
                    headers: { 'Content-Type' : 'application/json'}
                })
                const data = await response.json();
                setEvaluations(data.evaluations);
            } catch (error) {
                console.error('Error loading evaluations:', error)
            }
        };
        getEvaluations();
    }, []);


    //      calculate the average score
    const averageFinalScore = evaluations.length > 0
    ? evaluations.reduce((acc, curr) => acc + curr.finalScore, 0) / evaluations.length : 0;

    const scoresData = evaluations.map(evaluation => ({
        location: evaluation.location,
        foodScore: evaluation.location,
        cleanScore: evaluation.cleanScore,
        serviceScore: evaluation.serviceScore,
        date: new Date(evaluation.date).toLocaleDateString(),
    }))

    return (
        <Box sx={{padding: 3}}>
            <Stack direction='column' spacing={3}>

                {/*     WELCOME AND OVERVIEW      */}
                <Typography variant='overline' sx={{fontSize: '1.5rem', justifyContent: 'center'}} gutterBottom>
                    dashboard overview
                </Typography>
                <Typography variant='overline' sx={{fontSize: '.75rem', justifyContent: 'center'}} gutterBottom>
                    average final score: {averageFinalScore.toFixed(2)}
                </Typography>

                {/*   BARCHART FOR SCORES OVER TIME   */}
                <Typography variant='overline' sx={{fontSize: '.75rem', justifyContent: 'center'}} gutterBottom>
                    scores over time
                </Typography>
                <ResponsiveContainer width='100%' height={300}>
                    <BarChart data={scoresData}>
                        <CartesianGrid strokeDasharray={ '3 3'} />
                        <XAxis dataKey='location' />
                        <YAxis />
                        <Tooltip content={({ payload }) => {
                            if(payload && payload.length) {
                                const { location, date, foodScore, cleanScore, serviceScore } = payload[0].payload;
                                return (
                                    <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}}>
                                        <p>{`Location : ${location}`}</p>
                                        <p>{`Date : ${date}`}</p>
                                        <p>{`Food Score : ${foodScore}`}</p>
                                        <p>{`Clean Score : ${cleanScore}`}</p>
                                        <p>{`Service Score : ${serviceScore}`}</p>
                                    </div>
                                )
                            }
                            return null;
                        }}/>
                        <Bar dataKey="foodScore" fill="#8884d8" />>
                        <Bar dataKey="cleanScore" fill="#8884d8" />>
                        <Bar dataKey="serviceScore" fill="#8884d8" />>
                    </BarChart>
                </ResponsiveContainer>


                {/*     PIE CHART FOR SCORE DISTRIBUTION    */}
                <Typography variant='overline' gutterBottom sx={{marginTop: 4, fontSize: '1rem'}}>
                    score distribution
                </Typography>
                <ResponsiveContainer width='100%' height={300}>
                    <PieChart>
                        <Pie
                            data={upsellData}
                            dataKey='value'
                            nameKey='name'
                            cx={'50%'}
                            cy={'50%'}
                            outerRadius={100}
                            fill='#8884d8'
                            label
                        >
                            {upsellData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>

                {/*     LINE CHART FOR SCORES TREND     */}
                <Typography variant='overline' gutterBottom sx={{marginTop: 4, fontSize: '.75rem'}}>
                    score trend over time
                </Typography>
                <ResponsiveContainer width='100%' height={300}>
                    <LineChart data={finalScoresData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='date' />
                    <YAxis />
                    <Tooltip />
                    <Line type='monotone' dataKey='finalScore' stroke='#82ca9d' />
                    </LineChart>
                </ResponsiveContainer>

                {/*     MODAL FOR EVALUATION DRILL-DOWN     */}
                <Modal open={openModal} onClose={handleClose}>
                    <Box sx={{
                        padding: 4,
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        margin: 'auto',
                        marginTop: 10,
                        width: 300 }}
                    >
                        <Stack direction='column' spacing={1}>
                            <Typography variant='overline' gutterBottom>
                                evaluation details
                            </Typography>
                            {selectedEvaluation && (
                                <Typography variant='overline'>
                                    <strong>Location:</strong> {selectedEvaluation.location} <br />
                                    <strong>Type:</strong> {selectedEvaluation.type} <br />
                                    <strong>Date:</strong> {selectedEvaluation.date} <br />
                                    <strong>Score:</strong> {selectedEvaluation.score}
                                </Typography>
                            )}
                        </Stack>
                    </Box>

                </Modal>


            </Stack>
        </Box>
    );
}