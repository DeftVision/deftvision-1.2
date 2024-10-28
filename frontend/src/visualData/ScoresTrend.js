import {useEffect, useState} from 'react'
import {Box, Card, CardActions, CardContent, CardHeader, Typography} from '@mui/material';
import {Line, LineChart, ResponsiveContainer, XAxis} from 'recharts';
import {ArrowDownward, ArrowUpward} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';


export default function ScoresTrend() {
    const [evaluations, setEvaluations] = useState([])
    const [averageFinalScores, setAverageFinalScores] = useState([])
    const [averageFoodScores, setAverageFoodScores] = useState([])
    const [averageCleanScores, setAverageCleanScores] = useState([])
    const [averageServiceScores, setAverageServiceScores] = useState([])
    const [totalEvaluations, setTotalEvaluations] = useState(0);
    const [finalPercentageChange, setFinalPercentageChange] = useState(null);
    const [foodPercentageChange, setFoodPercentageChange] = useState(null);
    const [cleanPercentageChange, setCleanPercentageChange] = useState(null);
    const [servicePercentageChange, setServicePercentageChange] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        const getEvaluations = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/evaluation/evaluation-data', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const data = await response.json();
                setEvaluations(data.evaluations);

                // TODO: calculate the average final score
                const finalScoresByDate = groupFinalByDate(data.evaluations);
                setAverageFinalScores(finalScoresByDate);

                const foodScoresByDate = groupFoodByDate(data.evaluations);
                setAverageFoodScores(foodScoresByDate);

                const cleanScoresByDate = groupCleanByDate(data.evaluations);
                setAverageCleanScores(cleanScoresByDate);

                const serviceScoresByDate = groupServiceByDate(data.evaluations);
                setAverageServiceScores(serviceScoresByDate);

                // TODO: set total evaluation count
                setTotalEvaluations(data.evaluations.length);

                if (finalScoresByDate.length > 1) {
                    const finalFirstScore = parseFloat(finalScoresByDate[0].avgFinalScore);
                    const finalLastScore = parseFloat(finalScoresByDate[finalScoresByDate.length - 1].avgFinalScore);
                    const finalPercentageChange = ((finalLastScore - finalFirstScore) / finalFirstScore) * 100;
                    setFinalPercentageChange(finalPercentageChange.toFixed(2));
                }

                if (foodScoresByDate.length > 1) {
                    const foodFirstScore = parseFloat(foodScoresByDate[0].avgFoodScore);
                    const foodLastScore = parseFloat(foodScoresByDate[foodScoresByDate.length - 1].avgFoodScore);
                    const foodPercentageChange = ((foodLastScore - foodFirstScore) / foodFirstScore) * 100;
                    setFoodPercentageChange(foodPercentageChange.toFixed(2));
                }

                if(cleanScoresByDate.length > 1) {
                    const cleanFirstScore = parseFloat(cleanScoresByDate[0].avgCleanScore);
                    const cleanLastScore = parseFloat(cleanScoresByDate[cleanScoresByDate.length - 1].avgCleanScore);
                    const cleanPercentageChange = ((cleanLastScore - cleanFirstScore) / cleanFirstScore) * 100;
                    setCleanPercentageChange(cleanPercentageChange.toFixed(2));
                }

                if(serviceScoresByDate.length > 1) {
                    const serviceFirstScore = parseFloat(serviceScoresByDate[0].avgServiceScore);
                    const serviceLastScore = parseFloat(serviceScoresByDate[serviceScoresByDate.length - 1].avgServiceScore);
                    const servicePercentageChange = ((serviceLastScore - serviceFirstScore) / serviceFirstScore) * 100;
                    setServicePercentageChange(servicePercentageChange.toFixed(2));
                }

            } catch (error) {
                console.error('Error loading evaluations', error);
            }
        }
        getEvaluations();
    }, []);

    const groupFinalByDate = (evaluations) => {
        const finalGrouped = {};
        evaluations.forEach((evaluation) => {
            const date = new Date(evaluation.date).toLocaleDateString();
            if (!finalGrouped[date]) {
                finalGrouped[date] = {total: 0, count: 0}
            }
            finalGrouped[date].total += evaluation.finalScore;
            finalGrouped[date].count += 1;
        });
        return Object.keys(finalGrouped).map((date) => ({
            date,
            avgFinalScore: (finalGrouped[date].total / finalGrouped[date].count).toFixed(2),
        }));

    };
        const groupFoodByDate = (evaluations) => {
            const foodGrouped = {};
            evaluations.forEach((evaluation) => {
                const date = new Date(evaluation.date).toLocaleDateString();
                if (!foodGrouped[date]) {
                    foodGrouped[date] = {total: 0, count: 0}
                }
                foodGrouped[date].total += evaluation.foodScore;
                foodGrouped[date].count += 1;
            });
            return Object.keys(foodGrouped).map((date) => ({
                date,
                avgFoodScore: (foodGrouped[date].total / foodGrouped[date].count).toFixed(2),
            }));
        }

    const groupCleanByDate = (evaluations) => {
        const cleanGrouped = {};
        evaluations.forEach((evaluation) => {
            const date = new Date(evaluation.date).toLocaleDateString();
            if (!cleanGrouped[date]) {
                cleanGrouped[date] = {total: 0, count: 0}
            }
            cleanGrouped[date].total += evaluation.cleanScore;
            cleanGrouped[date].count += 1;
        });
        return Object.keys(cleanGrouped).map((date) => ({
            date,
            avgCleanScore: (cleanGrouped[date].total / cleanGrouped[date].count).toFixed(2),
        }));
    }

    const groupServiceByDate = (evaluations) => {
        const serviceGrouped = {};
        evaluations.forEach((evaluation) => {
            const date = new Date(evaluation.date).toLocaleDateString();
            if (!serviceGrouped[date]) {
                serviceGrouped[date] = {total: 0, count: 0}
            }
            serviceGrouped[date].total += evaluation.serviceScore;
            serviceGrouped[date].count += 1;
        });
        return Object.keys(serviceGrouped).map((date) => ({
            date,
            avgServiceScore: (serviceGrouped[date].total / serviceGrouped[date].count).toFixed(2),
        }));
    }



    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
            {/* final score */}
            <Card sx={{minWidth: 300, color: '#fff', margin: 2, position: 'relative'}}>
                <CardHeader sx={{backgroundColor: '#1976d2', color: '#fff'}}>
                    {/* title section */}
                    <Typography variant='overline' sx={{fontSize: '1rem', marginBottom: 1 }}>
                        Final Score
                    </Typography>

                </CardHeader>
                <CardContent sx={{backgroundColor: '#1976d2'}}>
                    {finalPercentageChange !== null && (
                        <Box sx={{position: 'absolute', top: 17, right: 16, display: 'flex', alignItems: 'center'}}>
                            {finalPercentageChange > 0 ? (<ArrowUpward style={{color: '#0ee648'}}/>
                            ) : (
                                <ArrowDownward style={{color: 'red'}}/>
                            )}
                            <Typography sx={{fontSize: '1rem', marginLeft: '4px'}}>
                                {Math.abs(finalPercentageChange)} %
                            </Typography>
                        </Box>
                    )}

                    {/*  line chart  */}
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150}}>
                        <ResponsiveContainer width='100%' height={100}>
                            <LineChart data={averageFinalScores}>
                                {/*<XAxis dataKey='date' stroke='#fff'/>*/}
                                <Line type='monotone' dataKey='avgFinalScore' stroke='#fff' strokeWidth={2}
                                      dot={false}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>

                <CardActions sx={{
                        padding: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? '#fff' : 'default',
                        color: theme.palette.mode === 'dark' ? '#000' : '#000'
                }}>
                    <Typography variant='overline'>Avg Final Score: </Typography>
                    <Typography
                        variant='overline'>{averageFinalScores.length > 0 ? averageFinalScores[averageFinalScores.length - 1].avgFinalScore : 'N/A'}</Typography>
                </CardActions>
            </Card>

            {/*  food score  */}
            <Card sx={{minWidth: 300, color: '#fff', margin: 2, position: 'relative'}}>
                <CardHeader sx={{backgroundColor: '#1976d2', color: '#fff'}}>
                    <Typography variant='overline' sx={{fontSize: '1rem', marginBottom: 1 }}>
                        Food Score
                    </Typography>
                </CardHeader>
                <CardContent sx={{backgroundColor: '#1976d2'}}>
                    {foodPercentageChange !== null && (
                        <Box sx={{position: 'absolute', top: 17, right: 16, display: 'flex', alignItems: 'center'}}>
                            {foodPercentageChange > 0 ? (<ArrowUpward style={{color: 'green'}}/>
                            ) : (
                                <ArrowDownward style={{color: 'red'}}/>
                            )}
                            <Typography sx={{fontSize: '1rem', marginLeft: '4px'}}>
                                {Math.abs(foodPercentageChange)} %
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150}}>
                        <ResponsiveContainer width='100%' height={100}>
                            <LineChart data={averageFoodScores}>
                                {/*<XAxis dataKey='date' stroke='#fff'/>*/}
                                <Line type='monotone' dataKey='avgFoodScore' stroke='#fff' strokeWidth={2}
                                      dot={false}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>

                <CardActions
                    sx={{
                        padding: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? '#fff' : 'default',
                        color: theme.palette.mode === 'dark' ? '#000' : '#000'
                    }}
                >
                    <Typography variant='overline'>Avg Food Score: </Typography>
                    <Typography
                        variant='overline'>{averageFoodScores.length > 0 ? averageFoodScores[averageFoodScores.length - 1].avgFoodScore : 'N/A'}</Typography>
                </CardActions>
            </Card>

            {/* clean score  */}
            <Card sx={{minWidth: 300, color: '#fff', margin: 2, position: 'relative'}}>
                <CardHeader sx={{backgroundColor: '#1976d2', color: '#fff'}}>
                    <Typography variant='overline' sx={{fontSize: '1rem', marginBottom: 1 }}>
                        Clean Score
                    </Typography>
                </CardHeader>
                <CardContent sx={{backgroundColor: '#1976d2'}}>
                    {cleanPercentageChange !== null && (
                        <Box sx={{position: 'absolute', top: 17, right: 16, display: 'flex', alignItems: 'center'}}>
                            {cleanPercentageChange > 0 ? (<ArrowUpward style={{color: 'green'}}/>
                            ) : (
                                <ArrowDownward style={{color: 'red'}}/>
                            )}
                            <Typography sx={{fontSize: '1rem', marginLeft: '4px'}}>
                                {Math.abs(cleanPercentageChange)} %
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150}}>
                        <ResponsiveContainer width='100%' height={100}>
                            <LineChart data={averageCleanScores}>
                                {/*<XAxis dataKey='date' stroke='#fff'/>*/}
                                <Line type='monotone' dataKey='avgCleanScore' stroke='#fff' strokeWidth={2}
                                      dot={false}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>

                <CardActions
                    sx={{
                        padding: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? '#fff' : 'default',
                        color: theme.palette.mode === 'dark' ? '#000' : '#000'
                    }}
                >
                    <Typography variant='overline'>Avg Clean Score: </Typography>
                    <Typography
                        variant='overline'>{averageCleanScores.length > 0 ? averageCleanScores[averageCleanScores.length - 1].avgCleanScore : 'N/A'}</Typography>
                </CardActions>
            </Card>

            {/*  service score  */}
            <Card sx={{minWidth: 300, color: '#fff', margin: 2, position: 'relative'}}>
                <CardHeader sx={{backgroundColor: '#1976d2', color: '#fff'}}>
                </CardHeader>
                <CardContent sx={{backgroundColor: '#1976d2'}}>
                    {servicePercentageChange !== null && (
                        <Box sx={{position: 'absolute', top: 17, right: 16, display: 'flex', alignItems: 'center'}}>
                            {servicePercentageChange > 0 ? (<ArrowUpward style={{color: 'green'}}/>
                            ) : (
                                <ArrowDownward style={{color: 'red'}}/>
                            )}
                            <Typography sx={{fontSize: '1rem', marginLeft: '4px'}}>
                                {Math.abs(servicePercentageChange)} %
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150}}>
                        <ResponsiveContainer width='100%' height={100}>
                            <LineChart data={averageServiceScores}>
                                {/*<XAxis dataKey='date' stroke='#fff'/>*/}
                                <Line type='monotone' dataKey='avgServiceScore' stroke='#fff' strokeWidth={2}
                                      dot={false}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>

                <CardActions
                    sx={{
                        padding: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? '#fff' : 'default',
                        color: theme.palette.mode === 'dark' ? '#000' : '#000'
                    }}
                >
                    <Typography variant='overline'>Avg Service Score: </Typography>
                    <Typography
                        variant='overline'>{averageServiceScores.length > 0 ? averageServiceScores[averageServiceScores.length - 1].avgServiceScore : 'N/A'}</Typography>
                </CardActions>
            </Card>
        </Box>
    );

}

