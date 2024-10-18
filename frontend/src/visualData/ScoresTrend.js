import { useState, useEffect } from 'react'
import { Box, Card, CardActionArea, CardHeader, CardContent, CardMedia, FormControl, InputLabel, MenuItem, Paper, Skeleton, Stack, styled, Select, Typography} from '@mui/material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'


export default function ScoresTrend() {
    const [foodEvaluations, setFoodEvaluations] = useState([])
    const [cleanEvaluations, setCleanEvaluations] = useState([])
    const [serviceEvaluations, setServiceEvaluations] = useState([])
    const [selectedLocations, setSelectedLocations] = useState('All')
    const [locations, setLocations] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {

        // load food scores
        const getFoodScores = async () => {
            try {
                setLoading(true);

                const response = await fetch ('http://localhost:5000/api/evaluation/evaluation-food', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const data = await response.json();
                setFoodEvaluations(data.evaluations);

                const uniqueLocations = [...new Set(data.evaluations.map((evaluation) => evaluation.location))]
                setLocations(uniqueLocations)

            } catch (error) {
                console.error('Error Loading Food Scores', error);
            } finally {
                setLoading(false)
            }
        }
        getFoodScores();
    }, []);

    // load clean scores
    useEffect(() => {
        const getCleanScores = async () => {
            try {
                setLoading(true);

                const response = await fetch ('http://localhost:5000/api/evaluation/evaluation-clean', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const data = await response.json();
                setCleanEvaluations(data.evaluations);
            } catch (error) {
                console.error('Error Loading Clean Scores', error);
            } finally {
                setLoading(false)
            }
        }
        getCleanScores();
    }, []);


    // load service scores
    useEffect(() => {
        const getServiceScores = async () => {
            try {
                setLoading(true);

                const response = await fetch (`http://localhost:5000/api/evaluation/evaluation-service`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const data = await response.json();
                setServiceEvaluations(data.evaluations);
                console.log(data.evaluations);

            } catch (error) {
                console.error('Error Loading Service Scores', error);
            } finally {
                setLoading(false)
            }
        }
        getServiceScores();
    }, []);

    const filterEvaluationByLocation = (evaluations) => {
        if(selectedLocation === 'All') return evaluations;
        return evaluations.filter((evaluation) => evaluation.location === selectedLocation);

    }

/*    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };*/

    const renderLineChart = (data, dataKey, title) => (
        <Paper elevation={12} sx={{backgroundColor: 'red', padding: 2, borderRadius: 2}}>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                    {/*<CartesianGrid strokeDasharray="3 3" />*/}
                    <XAxis dataKey="date" tick={false} axisLine={false} />
                    <YAxis tick={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey={dataKey} stroke="#ffffff" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </Paper>
    )


    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center'}}>
            <Card sx={{ maxWidth: '350px', minWidth: '300px', textAlign: 'center' }}>
                <CardContent>
                    <FormControl>
                        <InputLabel>Location</InputLabel>
                        <Select variant='outlined'>
                            {locations.map((location) => (
                                <MenuItem key={location} value={location}>{location}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {loading ? (
                        <Skeleton variant="rectangular" height={200} />
                    ) : (
                        renderLineChart(foodEvaluations, 'foodScore', 'Food Score')
                    )}
                </CardContent>
            </Card>

            <Card sx={{ maxWidth: '350px', minWidth: '300px', textAlign: 'center' }}>
                <CardContent>

                    {loading ? (
                        <Skeleton variant="rectangular" height={200} />
                    ) : (
                        renderLineChart(cleanEvaluations, 'cleanScore', 'Clean Score')
                    )}
                </CardContent>
            </Card>

            <Card sx={{maxWidth: '350px', minWidth: '200px', textAlign: 'center', justifyContent: 'space-between', alignContent: 'space-between'}}>
                <Card sx={{ maxWidth: '350px', minWidth: '300px', textAlign: 'center' }}>
                    <CardContent>

                        {loading ? (
                            <Skeleton variant="rectangular" height={200} />
                        ) : (
                            renderLineChart(serviceEvaluations, 'serviceScore', 'Service Score')
                        )}
                    </CardContent>
                </Card>
            </Card>
        </Box>
    );
}

