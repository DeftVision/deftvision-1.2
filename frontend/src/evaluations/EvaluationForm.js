// TODO: update the URL when the data table is built

import { Alert, Box, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography, } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'




export default function EvaluationForm() {
    const [evaluationData, setEvaluationData] = useState({
        foodScore: '',
        cleanScore: '',
        serviceScore: '',
        finalScore: '',
        location: '',
        comments: '',
        cashier: '',
        upsell: false,
        greeting: false,
        repeatOrder: false,
        idManager: false,
        date: '',
        waitTime: '',

    })

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleFieldChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEvaluationData((prevData) => ({
          ...prevData,
          [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        const { foodScore, cleanScore, serviceScore, finalScore, location, comments, cashier, waitTime, date } = evaluationData;
        // validation to ensure fields aren't empty
        if (!foodScore || !cleanScore || !serviceScore || !finalScore || !location || !comments || !cashier || !waitTime || !date) {
            setError('Please fill out all required fields.');
            return;
        }

        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:5000/api/evaluation/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...evaluationData,
                    userId,
                    foodScore: Number(foodScore),
                    cleanScore: Number(cleanScore),
                    serviceScore: Number(serviceScore),
                    finalScore: Number(finalScore),
                    waitTime: Number(evaluationData.waitTime),
                }),
            });

            const data = await response.json();

            if(response.ok) {
                setSuccess('evaluation submitted successfully');
                //navigate('/dashboard')
            } else {
                setError(data.error || 'Submission failed. Try again.');
            }

        } catch (error) {
            setError('An error occurred. Try again.');
        }
    };


    return (
        <Box component='form' onSubmit={handleSubmit} sx={{padding: 3, marginTop: 5}}>
            <Stack direction='column' spacing={2}>
                <Typography variant='overline' sx={{fontSize: '2rem', marginBottom: 2}}>
                    submit evaluation
                </Typography>
                {/* Error and Success Alerts */}
                {error && (
                    <Alert severity="error" sx={{ marginBottom: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ marginBottom: 2 }}>
                        {success}
                    </Alert>
                )}

                <TextField
                    type='date'
                    name='date'
                    value={evaluationData.date}
                    onChange={handleFieldChange}
                    fullWidth
                    margin='none'
                    inputlabelprops={{ shrink: true }}
                    required
                />
                <FormControl required>
                    <InputLabel>Location</InputLabel>
                    <Select
                        name="location"
                        label="location"
                        variant="outlined"
                        fullWidth
                        margin="none"
                        value={evaluationData.location}
                        onChange={handleFieldChange}
                    >
                        <MenuItem value="Sandy">Sandy</MenuItem>
                        <MenuItem value="Draper">Draper</MenuItem>
                        <MenuItem value="Bountiful">Bountiful</MenuItem>
                        <MenuItem value="Logan">Logan</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    type='text'
                    name='cashier'
                    label='cashier'
                    value={evaluationData.cashier}
                    onChange={handleFieldChange}
                    fullWidth
                    margin='none'
                    required
                />
                <TextField
                    type='text'
                    name='comments'
                    label='comments'
                    value={evaluationData.comments}
                    onChange={handleFieldChange}
                    multiline
                    maxRows={5}
                    fullWidth
                    margin='none'
                    required
                />
                <TextField
                    type='Number'
                    name='waitTime'
                    label='wait time'
                    value={evaluationData.waitTime}
                    onChange={handleFieldChange}
                    fullWidth
                    margin='none'
                    required
                />
                <FormControlLabel
                    control={<Switch
                        name='greeting'
                        checked={evaluationData.greeting} onChange={handleFieldChange}/>}
                    label='greeting'
                >
                </FormControlLabel>
                <FormControlLabel
                    control={<Switch
                        name='upsell'
                        checked={evaluationData.upsell} onChange={handleFieldChange}/>}
                    label='upsell'
                >
                </FormControlLabel>
                <FormControlLabel
                    control={<Switch
                        name='repeatOrder'
                        checked={evaluationData.repeatOrder} onChange={handleFieldChange}/>}
                    label='repeat order'
                >
                </FormControlLabel>
                <FormControlLabel
                    control={<Switch
                        name='idManager'
                        checked={evaluationData.idManager} onChange={handleFieldChange}/>}
                    label='ID Manager'
                >
                </FormControlLabel>
                <TextField
                    type='Number'
                    name='foodScore'
                    label='food score'
                    value={evaluationData.foodScore}
                    onChange={handleFieldChange}
                    fullWidth
                    margin='none'
                    required
                />
                <TextField
                    type='Number'
                    name='serviceScore'
                    label='service score'
                    value={evaluationData.serviceScore}
                    onChange={handleFieldChange}
                    fullWidth
                    margin='none'
                    required
                />
                <TextField
                    type='Number'
                    name='cleanScore'
                    label='clean score'
                    value={evaluationData.cleanScore}
                    onChange={handleFieldChange}
                    fullWidth
                    margin='none'
                    required
                />
                <TextField
                    type='Number'
                    name='finalScore'
                    label='final Score'
                    value={evaluationData.finalScore}
                    onChange={handleFieldChange}
                    fullWidth
                    margin='none'
                    required
                />
                <Button variant='contained' onClick={handleSubmit}>
                    save
                </Button>
                <Button variant='contained' component={Link} to='/home'>
                    cancel
                </Button>
            </Stack>
        </Box>
    );
}