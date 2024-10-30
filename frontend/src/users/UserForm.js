import { Box, Button,  FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select, Stack, Switch, TextField } from '@mui/material';
import { useState } from 'react';
import roles from '../utilities/roleSelect'
import locations from "../utilities/locationSelect";


const form_default = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    location: 'Corporate Office',
    role: 'User',
    isActive: true,
}

export default function UserForm( { onUserCreated }) {
    const [formData, setFormData] = useState(form_default)


    const handleFieldChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const _response = await response.json();
            console.log(_response)
            if(response.ok) {
                onUserCreated();
            } else {
                console.log('error saving user')
            }
            console.log(formData)

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
            <Paper elevation={8} width='100%' sx={{padding: 5, maxWidth: '1200px', width: '90%'}}>
                <Box
                    component='form'
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{marginTop: 4}}

                >
                    <Stack direction='column' spacing={4}>
                        <TextField
                            type='text'
                            name='username'
                            id='username'
                            label='username'
                            value={formData.username}
                            sx={{}}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    username: e.target.value
                                })
                            }}
                        />

                        <TextField
                            type='password'
                            name='password'
                            id='password'
                            label='password'
                            value={formData.password}
                            sx={{}}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    password: e.target.value
                                })
                            }}
                        />

                        <TextField
                            type='text'
                            label='first name'
                            name='firstName'
                            id='firstName'
                            value={formData.firstName}
                            sx={{}}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    firstName: e.target.value
                                })
                            }}
                        />

                        <TextField
                            type='text'
                            name='lastName'
                            id='lastName'
                            label='last name'
                            value={formData.lastName}
                            sx={{}}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    lastName: e.target.value
                                })
                            }}
                        />

                        <TextField
                            type='email'
                            name='email'
                            id='email'
                            label='email'
                            value={formData.email}
                            sx={{}}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    email: e.target.value
                                })
                            }}
                        />

                        <FormControl>
                            <InputLabel>role</InputLabel>
                            <Select
                                name='role'
                                variant='outlined'
                                label='role'
                                value={formData.role || ''}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        role: e.target.value
                                    })
                                }}
                                sx={{ textAlign: 'start' }}
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <InputLabel>location</InputLabel>
                            <Select
                                name='location'
                                variant='outlined'
                                label='location'
                                value={formData.location || ''}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        location: e.target.value
                                    })
                                }}
                                sx={{ textAlign: 'start' }}
                            >
                                {locations.map((location) => (
                                    <MenuItem key={location} value={location}>
                                        {location}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControlLabel

                            control={
                                <Switch
                                    name='isActive'
                                    id='isActive'
                                    value={formData.isActive}
                                    onChange={handleFieldChange}
                                    checked={formData.isActive}
                                />}
                            label='is active'
                        />


                    </Stack>
                    <Stack direction='row' spacing={2} sx={{justifyContent: 'center', alignItems: 'center'}}>
                        <Button variant='outlined'>cancel</Button>
                        <Button variant='outlined' type='submit'>save</Button>
                    </Stack>
                </Box>

            </Paper>
        </Box>
    );
}