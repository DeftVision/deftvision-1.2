import { useState, useEffect } from 'react'
import { Box, Card, CardActions, CardHeader, CardContent, Divider, FormControl, InputLabel, MenuItem, Paper, Skeleton, Select, Typography} from '@mui/material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'


export default function ScoresTrend() {
    const [foodEvaluations, setFoodEvaluations] = useState([])
    const [cleanEvaluations, setCleanEvaluations] = useState([])
    const [serviceEvaluations, setServiceEvaluations] = useState([])
    const [selectedLocation, setSelectedLocation] = useState('All')
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

    /* const formatDate = (date) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };*/

    const renderLineChart = (data, dataKey, title) => (
            <ResponsiveContainer width="100%" height={150}>
                <LineChart data={data} type='monotone' sx={{justifyContent: 'start'}}>
                    <XAxis dataKey="date" tick={false} axisLine={false} />
                    <YAxis tick={false} axisLine={false} />
                    <Line dataKey={dataKey} strokeWidth={2} dot={false} />
                    <Tooltip
                        sx={{backgroundColor: 'none'}}
                    />
                </LineChart>
            </ResponsiveContainer>

    )


    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center'}}>
            <Card sx={{ maxWidth: '350px', minWidth: '300px', textAlign: 'center'}}>
                <CardHeader>
                    <Typography variant='overline' sx={{textAlign: 'center'}}>
                        food
                    </Typography>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <Skeleton variant="rectangular" height={200} />
                    ) : (
                        renderLineChart(foodEvaluations, 'foodScore', 'Food Score')
                    )}
                </CardContent>
                    <Divider />
                <CardActions sx={{justifyContent: 'center', verticalAlign: 'center', marginTop: 1}}>
                    <FormControl>
                        <Select
                            variant='standard'
                            sx={{
                                minWidth: '175px',
                                textAlign: 'start',
                                marginBottom: 3
                            }}
                        >
                            {locations.map((location) => (
                                <MenuItem key={location} value={location}>{location}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardActions>
            </Card>

            <Card sx={{ maxWidth: '350px', minWidth: '300px', textAlign: 'center', marginLeft: 3, marginRight: 3 }}>
                <CardContent>

                    {loading ? (
                        <Skeleton variant="rectangular" height={200} />
                    ) : (
                        renderLineChart(cleanEvaluations, 'cleanScore', 'Clean Score')
                    )}
                </CardContent>
                <Divider />
                <CardActions sx={{justifyContent: 'center', verticalAlign: 'center' }}>
                    <FormControl>
                        <Select
                            variant='standard'
                            margin='normal'
                            sx={{
                                justifyContent: 'center',
                                minWidth: '175px',
                                textAlign: 'start',
                            }}
                        >
                            {locations.map((location) => (
                                <MenuItem key={location} value={location}>{location}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardActions>
            </Card>
                <Card sx={{ maxWidth: '350px', minWidth: '300px', textAlign: 'center' }}>
                    <CardContent sx={{justifyContent: 'center'}}>
                        {loading ? (
                            <Skeleton variant="rectangular" height={200} />
                        ) : (
                            renderLineChart(serviceEvaluations, 'serviceScore', 'Service Score')
                        )}
                    </CardContent>
                    {/*<Divider />*/}
                    <CardActions sx={{justifyContent: 'center', verticalAlign: 'center'}}>
                        <FormControl>
                            <Select
                                variant='standard'
                                margin='normal'
                                sx={{
                                    minWidth: '175px',
                                    textAlign: 'start',
                                }}
                            >
                                {locations.map((location) => (
                                    <MenuItem key={location} value={location}>{location}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </CardActions>
                </Card>
        </Box>
    );
}

