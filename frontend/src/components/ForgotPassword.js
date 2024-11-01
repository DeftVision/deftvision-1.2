import {Box, TextField, Typography, Button, Stack} from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'


export default function ForgotPassword() {
    const [email, setEmail] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!email) {
            console.log('enter the email used to register the account')
        }

        try {
            if(email) {
                console.log('password recovery email has been sent')
            }
        } catch (error) {
            console.log('there was a problem sending the password reset link')
        }
    }


    return (
        <Box component='form' onSubmit={handleSubmit}>
            <Typography variant='overline'>Reset Password</Typography>
            <Stack direction='column' spacing={2}>
                <TextField
                    type='text'
                    label='username'

                />
                <Button type='submit' variant='outlined'>
                    reset password
                </Button>
                <Button type='submit' variant='text'> back to login</Button>
            </Stack>
        </Box>
    );
}