import { useState} from 'react'
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { jwtDecode }  from 'jwt-decode';
import { Link } from 'react-router-dom'


export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('');


        if(!username || !password) {
            setError('username and password are required fields')
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/auth/login`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if(response.ok) {
                const { token } = data;
                localStorage.setItem('token', token);

                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId;
                localStorage.setItem('userId', userId);

                setSuccess(true);
                navigate('/dashboard')
            } else {
                setError(data.error || 'login failed miserably')
            }
        } catch (error) {
            setError('oops... wait a few seconds try again');
        }
    };

    return (
        <div>
            <Box component='form' onSubmit={handleLogin} sx={{maxWidth: 400, margin: 'auto', padding: 2}}>
                <Stack direction='column' spacing={3}>
                    <Typography variant='overline' sx={{fontSize: '1rem', justifyContent: 'center'}} gutterBottom>
                        Login
                    </Typography>

                    {error && (
                        <Alert severity='error' sx={{marginBottom: 2}}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity='success' sx={{marginBottom: 2}}>
                            Login successful
                        </Alert>
                    )}

                    <TextField
                        label='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}

                    />
                    <TextField
                        label='password'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                    />

                    <Button type='submit' variant='contained' sx={{marginTop: 3, alignContent: 'center'}}>
                        Login
                    </Button>

                <Button
                    variant='text'
                    sx={{marginTop: 3, alignSelf: 'center'}}
                    component={Link}
                    to='/forgot-password'
                >
                    forgot password
                </Button>
                </Stack>
            </Box>
        </div>
    );
}