import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import {Box, Paper, Typography} from "@mui/material";



export default function ScoreBarChart({ evaluations, setSelectedEvaluation }) {
    const mostRecentEvaluations = getMostRecentEvaluations(evaluations);


    return (
        <Box sx={{padding: 10}}>
            <Paper elevation={8} sx={{padding: 5}}>
                <Typography variant='overline' sx={{fontSize: '1rem', textAlign: 'left', marginLeft: 10}}>final scores</Typography>
                <ResponsiveContainer width='100%' height={300}>
                    <RechartsBarChart data={mostRecentEvaluations}>
                        <CartesianGrid strokeDasharray={ '3 3'} />
                        <XAxis dataKey='location' />
                        <YAxis />
                        <Tooltip content={({ payload }) => {
                            if(payload && payload.length) {
                                const evaluation = payload[0].payload;
                                return (
                                    <Box sx={{ backgroundColor: '#fff', color: '#000', padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}}>
                                        <Typography>{`Location : ${evaluation.location}`}</Typography>
                                        <Typography>{`Date : ${new Date(evaluation.date).toLocaleDateString()}`}</Typography>
                                        <Typography>{`Food Score : ${evaluation.foodScore}`}</Typography>
                                        <Typography>{`Clean Score : ${evaluation.cleanScore}`}</Typography>
                                        <Typography>{`Service Score : ${evaluation.serviceScore}`}</Typography>
                                        <Typography>{`Final Score : ${evaluation.finalScore}`}</Typography>
                                    </Box>
                                )
                            }
                            return null;
                        }}/>
                        <Bar dataKey="finalScore" fill='#8884d8' onClick={(data) => setSelectedEvaluation(data)} />
                    </RechartsBarChart>
                </ResponsiveContainer>
            </Paper>
        </Box>
    );

}

const getMostRecentEvaluations = (evaluations) => {
    const mostRecentEvaluations = {};

    evaluations.forEach(evaluation => {
        const { location, date } = evaluation;
        if(!mostRecentEvaluations[location] || new Date(evaluation.date) > new Date(mostRecentEvaluations[location].date)) {
            mostRecentEvaluations[location] = evaluation;
        }
    });

    return Object.values(mostRecentEvaluations)
}