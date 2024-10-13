import {Box, Modal, Stack, Typography} from '@mui/material'
import {useState} from 'react'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

//      color palette for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


export default function Dashboard() {
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const handleClose = () => {
        setOpenModal(false);
        setSelectedEvaluation(null);
    }

    //      example evaluation Data
    const evaluationData = [
        {id: 1, date: '2024-01-10', score: 60, type: 'Performance'},
        {id: 2, date: '2024-02-15', score: 52, type: 'Communication'},
        {id: 3, date: '2024-03-20', score: 35, type: 'Teamwork'},
        {id: 4, date: '2024-04-05', score: 78, type: 'Performance'},
        // Add more data as needed
    ];

    //      calculate the average score
    const averageScore = evaluationData.reduce((acc, curr) => acc + curr.score, 0);

    // Example data for pie chart (grouping scores)
    const scoreRanges = [
        {name: '0-50', value: evaluationData.filter(e => e.score <= 50).length},
        {name: '51-75', value: evaluationData.filter(e => e.score > 50 && e.score <= 75).length},
        {name: '76-100', value: evaluationData.filter(e => e.score > 75 && e.score <= 100).length},
    ];


    return (
        <Box sx={{padding: 3}}>
            <Stack direction='column' spacing={3}>

                {/*     WELCOME AND OVERVIEW      */}
                <Typography variant='overline' sx={{fontSize: '2rem', justifyContent: 'center'}} gutterBottom>
                    dashboard overview
                </Typography>
                <Typography variant='overline' sx={{fontSize: '1rem', justifyContent: 'center'}} gutterBottom>
                    average score: {averageScore.toFixed(2)}
                </Typography>

                {/*   BARCHART FOR SCORES OVER TIME   */}
                <Typography variant='overline' sx={{fontSize: '1rem', justifyContent: 'center'}} gutterBottom>
                    scores over time
                </Typography>
                <ResponsiveContainer width='100%' height={300}>
                    <BarChart data={evaluationData} margin={{ top: 20, right: 30, left: 20, bottom: 5}}>
                        <CartesianGrid strokeDasharray={ '3 3'} />
                        <XAxis dataKey='date' />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="score" fill="#8884d8" onClick={(data) => { setSelectedEvaluation(data); setOpenModal(true); }} />>
                    </BarChart>
                </ResponsiveContainer>

                {/*     PIE CHART FOR SCORE DISTRIBUTION    */}
                <Typography variant='overline' gutterBottom sx={{marginTop: 4, fontSize: '1rem'}}>
                    score distribution
                </Typography>
                <ResponsiveContainer width='100%' height={300}>
                    <PieChart>
                        <Pie
                            data={scoreRanges}
                            cx={'50%'}
                            cy={'50%'}
                            outerRadius={100}
                            fill='#8884d8'
                            dataKey='value'
                            label>
                            {scoreRanges.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>

                {/*     LINE CHART FOR SCORES TREND     */}
                <Typography variant='overline' gutterBottom sx={{marginTop: 4, fontSize: '1rem'}}>
                    score trend over time
                </Typography>
                <ResponsiveContainer width='100%' height={300}>
                    <LineChart data={evaluationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='date' />
                    <YAxis />
                    <Tooltip />
                    <Line type='monotone' dataKey='score' stroke='#82ca9d' />
                    </LineChart>
                </ResponsiveContainer>

                {/*     MODAL FOR EVALUATION DRILL-DOWN     */}
                <Modal open={openModal} onClose={handleClose}>
                    <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', marginTop: 10, width: 300 }}>
                        <Stack direction='column' spacing={1}>
                            <Typography variant='overline' gutterButton>
                                evaluation details
                            </Typography>
                            {selectedEvaluation && (
                                <Typography variant='overline'>
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