import {useEffect, useState} from 'react'
import {Box, Card, CardActions, CardContent, CardHeader, Typography} from '@mui/material';
import {Line, LineChart, ResponsiveContainer, XAxis} from 'recharts';
import {ArrowDownward, ArrowUpward} from '@mui/icons-material';

export default function ScoresTrend() {
    const [evaluations, setEvaluations] = useState([])
    const [averageScores, setAverageScores] = useState([])
    const [totalEvaluations, setTotalEvaluations] = useState(0);
    const [finalPercentageChange, setFinalPercentageChange] = useState(null);
    const [foodPercentageChange, setFoodPercentageChange] = useState(null);
    const [cleanPercentageChange, setCleanPercentageChange] = useState(null);
    const [servicePercentageChange, setServicePercentageChange] = useState(null);

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
                const scoresByDate = groupByDate(data.evaluations);
                setAverageScores(scoresByDate);

                // TODO: set total evaluation count
                setTotalEvaluations(data.evaluations.length);

                if (scoresByDate.length > 1) {
                    const finalFirstScore = parseFloat(scoresByDate[0].avgFinalScore);
                    const finalLastScore = parseFloat(scoresByDate[scoresByDate.length - 1].avgFinalScore);
                    const finalPercentageChange = ((finalLastScore - finalFirstScore) / finalFirstScore) * 100;
                    setFinalPercentageChange(finalPercentageChange.toFixed(2));
                }

            } catch (error) {
                console.error('Error loading evaluations', error);
            }
        }
        getEvaluations();
    }, []);

    const groupByDate = (evaluations) => {
        const grouped = {};
        evaluations.forEach((evaluation) => {
            const date = new Date(evaluation.date).toLocaleDateString();
            if (!grouped[date]) {
                grouped[date] = {total: 0, count: 0}
            }
            grouped[date].total += evaluation.finalScore;
            grouped[date].count += 1;
        });

        return Object.keys(grouped).map((date) => ({
            date,
            avgFinalScore: (grouped[date].total / grouped[date].count).toFixed(2),
        }));
    };

    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
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
                            {finalPercentageChange > 0 ? (<ArrowUpward style={{color: 'green'}}/>
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
                            <LineChart data={averageScores}>
                                <XAxis dataKey='date' stroke='#fff'/>
                                <Line type='monotone' dataKey='avgFinalScore' stroke='#fff' strokeWidth={2}
                                      dot={false}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>

                <CardActions sx={{padding: 2, color: '#000'}}>
                    {/*  evaluation Count  */}
                    {/*<Typography variant='caption'>Evaluations Count: </Typography>
                    <Typography variant='caption'>{totalEvaluations}</Typography>
                    <br/>*/}

                    <Typography variant='caption'>Avg Final Score: </Typography>
                    <Typography
                        variant='caption'>{averageScores.length > 0 ? averageScores[averageScores.length - 1].avgFinalScore : 'N/A'}</Typography>
                </CardActions>
            </Card>

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
                            {finalPercentageChange > 0 ? (<ArrowUpward style={{color: 'green'}}/>
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
                            <LineChart data={averageScores}>
                                <XAxis dataKey='date' stroke='#fff'/>
                                <Line type='monotone' dataKey='avgFinalScore' stroke='#fff' strokeWidth={2}
                                      dot={false}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>

                <CardActions sx={{padding: 2, color: '#000'}}>
                    {/*  evaluation Count  */}
                    {/*<Typography variant='caption'>Evaluations Count: </Typography>
                    <Typography variant='caption'>{totalEvaluations}</Typography>
                    <br/>*/}

                    <Typography variant='caption'>Avg Food Score: </Typography>
                    <Typography
                        variant='caption'>{averageScores.length > 0 ? averageScores[averageScores.length - 1].avgFinalScore : 'N/A'}</Typography>
                </CardActions>
            </Card>

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
                            {finalPercentageChange > 0 ? (<ArrowUpward style={{color: 'green'}}/>
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
                            <LineChart data={averageScores}>
                                <XAxis dataKey='date' stroke='#fff'/>
                                <Line type='monotone' dataKey='avgFinalScore' stroke='#fff' strokeWidth={2}
                                      dot={false}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>

                <CardActions sx={{padding: 2, color: '#000'}}>
                    {/*  evaluation Count  */}
                   {/* <Typography variant='caption'>Evaluations Count: </Typography>
                    <Typography variant='caption'>{totalEvaluations}</Typography>*/}
                    <Typography variant='caption'>Avg Clean Score: </Typography>
                    <Typography
                        variant='caption'>{averageScores.length > 0 ? averageScores[averageScores.length - 1].avgFinalScore : 'N/A'}</Typography>
                </CardActions>
            </Card>

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
                            {finalPercentageChange > 0 ? (<ArrowUpward style={{color: 'green'}}/>
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
                            <LineChart data={averageScores}>
                                <XAxis dataKey='date' stroke='#fff'/>
                                <Line type='monotone' dataKey='avgFinalScore' stroke='#fff' strokeWidth={2}
                                      dot={false}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>

                <CardActions sx={{padding: 2, color: '#000'}}>
                    {/*  evaluation Count  */}
                    {/*<Typography variant='caption'>Evaluations Count: </Typography>
                    <Typography variant='caption'>{totalEvaluations}</Typography>*/}
                    <Typography variant='caption'>Avg Service Score: </Typography>
                    <Typography
                        variant='caption'>{averageScores.length > 0 ? averageScores[averageScores.length - 1].avgFinalScore : 'N/A'}</Typography>
                </CardActions>
            </Card>
        </Box>
    );

}

