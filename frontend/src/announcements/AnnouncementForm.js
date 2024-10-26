import { Box, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select, Switch, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import roles from '../utilities/roleSelect';
import priority from '../utilities/prioritySelect'

const form_default = {
    name: '',
    priority: '',
    audience: '',
    publish: false,
    subject: '',
    content: '',
}

export default function AnnouncementForm({ onAnnouncementCreated}) {
    const [formData, setFormData] = useState(form_default)

    const handleFieldChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:5000/api/announcement/new', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const _response = await response.json();
            console.log(_response);
            if(response.ok) {
               onAnnouncementCreated();
            } else {
                console.log('error posting announcement')
            }

        } catch (error) {
            console.log('something went wrong: ', error);
        }
    }

console.log(formData)

    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}} >
            <Paper elevation={8} width='100%' sx={{padding: 5, maxWidth: '1200px', width: '90%'}}>
            <Box
                component='form'
                onSubmit={handleSubmit}
                noValidate
                sx={{marginTop: 4}}

            >
                <Stack direction='column' spacing={3}>
                    <TextField
                        type='text'
                        label='Name'
                        value={formData.name}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                name: e.target.value,
                            })
                        }}
                    />
                    <FormControl>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            name='priority'
                            variant='outlined'
                            label='Priority'
                            value={formData.priority || ''}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    priority: e.target.value
                                })
                            }}
                            sx={{
                                textAlign: 'start'
                            }}
                        >
                            {priority.map((priority) => (
                                <MenuItem key={priority} value={priority}>
                                    {priority}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl>
                        <InputLabel>Audience</InputLabel>
                        <Select
                            name='audience'
                            variant='outlined'
                            label='Audience'
                            value={formData.audience || ''}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    audience: e.target.value
                                })
                            }}
                            sx={{
                                textAlign: 'start'
                            }}
                        >
                            {roles.map((role) => (
                                <MenuItem key={role} value={role}>
                                    {role}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControlLabel
                    control={<Switch
                        name='publish'
                        id='publish'
                        checked={formData.publish}
                        onChange={handleFieldChange}
                    />}
                    label='Publish'>

                    </FormControlLabel>
                    <TextField
                        type='text'
                        label='Subject'
                        value={formData.subject}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                subject: e.target.value
                            })
                        }}


                    />
                    <TextField
                        type='text'
                        id='content'
                        label='Content'
                        multiline
                        maxRows={8}
                        value={formData.content}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                content: e.target.value
                            })

                        }}


                    />

                    <Stack direction='row' spacing={2} sx={{justifyContent: 'center', alignItems: 'center'}}>
                        <Button variant='outlined'>cancel</Button>
                        <Button variant='outlined' type='submit'>save</Button>
                    </Stack>

                </Stack>
            </Box>
            </Paper>
        </Box>
    );
}