// TODO: adjust some colors
// TODO: condense the location names
// TODO: add more filters - date range, multiple locations, values
// TODO: clean up the date on x-axis

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Box, FormControl, InputLabel, MenuItem, Paper, Stack, Select, Typography } from '@mui/material';

export default function TrendLineChart() {
    const [evaluations, setEvaluations] = useState([])
    const [filteredLocation, setFilteredLocation] = useState('All')

    useEffect(() => {
        const getEvaluations = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/evaluation/evaluations', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();
                setEvaluations(data.evaluations);

            } catch (error) {
                console.error('Error loading evaluations', error);
            }
        }
        getEvaluations();
    }, []);

    // FILTER EVALUATIONS BASED ON SELECTED LOCATION || SHOW ALL IF SELECTED
    const filteredEvaluations = filteredLocation === 'All' ? evaluations : evaluations.filter(evaluation => evaluation.location === filteredLocation);

    // GROUP EVALUATIONS BY LOCATION AND PREPARE DATA FOR THE LINE CHART
    const evaluationsByLocation = groupByLocation(filteredEvaluations)

    const colorMapping = {
        'Sandy': '#FF5733',
        'Draper': '#33FF57',
        'Bountiful': '#3357FF',
        'Logan': '#FF33A6',
        'Riverdale': '#800080',
        'Jordan Landing': '#FFD700',
        'Layton': '#00FFFF',
        'Murray': '#FF4500',
        'Lehi': '#00FF7F',
        'Orem': '#FF69B4',
        'Provo': '#8B4513',
        'Spanish Fork': '#20B2AA',
        'East Mesa': '#DC143C',
        'Mesa': '#1E90FF',
    };


    const handleLocationChange = (e) => {
        setFilteredLocation(e.target.value);
    };

    return (
        <Box sx={{padding: 10}}>
            <Paper elevation={8} sx={{padding: 5}}>
                <Typography variant='overline' sx={{fontSize: '1rem', textAlign: 'left', marginLeft: 10, marginTop: 5}} gutterTop>trends</Typography>
                <ResponsiveContainer width='100%' height={400}>
                    <LineChart data={evaluationsByLocation}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {Object.keys(evaluationsByLocation).map((location, index) => (
                            <Line
                                sx={{width: '1.5px'}}
                                key={index}
                                type="monotone"
                                data={evaluationsByLocation[location]}
                                dataKey='finalScore'
                                name={location}
                                stroke={colorMapping[location] || '#00000'}
                                strokeWidth={1.5}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
                <FormControl sx={{minWidth: 250, marginBottom: 4, marginLeft: 7, marginTop: 2}}>
                    <InputLabel>Filter</InputLabel>
                    <Select variant="outlined" value={filteredLocation} onChange={handleLocationChange} label='Filter'>
                        <MenuItem value='All'>All</MenuItem>
                        {[...new Set(evaluations.map(evaluation => evaluation.location))].map(location => (
                            <MenuItem key={location} value={location}>{location}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>
        </Box>
    );
}

const groupByLocation = (evaluations) => {
    const grouped = {};
    evaluations.forEach(evaluation => {
        const { location, date, finalScore } = evaluation;
        const formattedDate = new Date(date).toLocaleDateString();
        if(!grouped[location]) {
            grouped[location] = [];
        }
        grouped[location].push({ date: formattedDate, finalScore });
    });
    return grouped;
};
