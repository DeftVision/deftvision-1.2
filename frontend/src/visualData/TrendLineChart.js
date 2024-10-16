// DONE: adjust some colors
// DONE: condense the location names
// TODO: add more filters - date range, multiple locations, values
// TODO: clean up the date on x-axis

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Box, FormControl, IconButton, InputLabel, MenuItem, Paper, Stack, Select, Tooltip as MuiTooltip, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';

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

    // Limit x-axis ticks to dates from today to 30 days prior
    const xTicks = getXTicksForLast30Days();

    const handleLocationChange = (e) => {
        setFilteredLocation(e.target.value);
    };



    return (
        <Box sx={{padding: 10}}>
            <Paper elevation={8} sx={{padding: 5}}>
                <Typography variant='overline' sx={{fontSize: '1rem', textAlign: 'left', marginLeft: 10, marginTop: 5}} gutterBottom>trends</Typography>
                <MuiTooltip title={
                    <Box>
                        {Object.keys(evaluationsByLocation).map((location) => (
                            <Typography key={location} style={{color: getColorForLocation(location)}}>
                                {location}
                            </Typography>
                        ))}
                    </Box>
                }>
                    <IconButton aria-label='info' sx={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
                        <Info  sx={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}/>
                    </IconButton>
                </MuiTooltip>
                <ResponsiveContainer width='100%' height={400}>
                    <LineChart data={flattenEvaluationByLocation(evaluationsByLocation)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            ticks={xTicks}  // Limit the ticks to major dates in the last 30 days
                            tickFormatter={(date) => new Date(date).toLocaleDateString()}  // Format the date
                        />
                        <YAxis />
                        <Tooltip />
                        {/* Render lines for each location */}
                        {Object.keys(evaluationsByLocation).map((location, index) => (
                            <Line
                                key={index}
                                type="monotone"
                                data={evaluationsByLocation[location]}
                                dataKey="finalScore"
                                stroke={getColorForLocation(location)}
                                strokeWidth={2}
                                name={location}
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
        const formattedDate = new Date(date).toISOString().split('T')[0]; // ISO format (YYYY-MM-DD)
        if(!grouped[location]) {
            grouped[location] = [];
        }
        grouped[location].push({ date: formattedDate, finalScore });
    });
    return grouped;
};

// helper function to flatten grouped evaluations into an array
const flattenEvaluationByLocation = (groupedEvaluations) => {
    return Object.values(groupedEvaluations).flat();
};

// Helper function to generate x-axis ticks for the last 30 days
const getXTicksForLast30Days = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const tickDates = [thirtyDaysAgo.getTime(), new Date((today.getTime() + thirtyDaysAgo.getTime()) / 2).getTime(), today.getTime()];
    return tickDates;
};

// Helper function to assign a fixed color to each location
const getColorForLocation = (location) => {
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
    }
    return colorMapping[location] || '#000';
};