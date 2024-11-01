import {Box, TextField, Typography, Button, Stack} from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'

// the purpose of this component is to trigger an email with a link to reset the password

export default function ForgotPassword() {
    const [trigger, setTrigger] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
    }
    return (
        <Box
            sx={{

                marginTop: 4}}
        >
            <Typography variant='overline' sx={{fontSize: '1rem', textAlign: 'center'}}>Reset Password</Typography>

            <Stack
                direction='column'
                sx={{justifyContent: 'center',
                    display: 'flex'
                }}
            >

                <form onSubmit={handleSubmit}>
                <TextField
                    type='text'
                    label='username'
                />
                <Button type='submit' variant='outlined'>
                    reset password
                </Button>

                </form>

            <Button
                    sx={{marginTop: 5}}
                    variant='text'
                    component={Link} to='/login'>
                back to login
            </Button>
            </Stack>
        </Box>

    );
}