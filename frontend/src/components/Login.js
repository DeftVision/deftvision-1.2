import { useContext, useState } from 'react';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

export default function Login() {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Username and password are required fields');
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

            if (response.ok) {
                const { token } = data;
                login(token); // Update the authentication state
                navigate('/dashboard'); // Redirect on successful login
            } else {
                setError(data.error || 'Login failed miserably');
            }
        } catch (error) {
            setError('Oops... wait a few seconds and try again');
        }
    };

    return (
        <div>
            <Box component='form' onSubmit={handleLogin} sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
                <Stack direction='column' spacing={3} sx={{ marginTop: 5 }}>
                    <Typography variant='overline' sx={{ fontSize: '1rem', justifyContent: 'center', alignSelf: 'center' }} gutterBottom>
                        Login
                    </Typography>

                    {error && (
                        <Alert severity='error' sx={{ marginBottom: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        label='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label='Password'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                    />

                    <Button type='submit' variant='contained' sx={{ marginTop: 3, alignContent: 'center' }}>
                        Login
                    </Button>

                    <Button
                        variant='text'
                        sx={{ marginTop: 3, alignSelf: 'center' }}
                        component={Link}
                        to='/forgot-password'
                    >
                        Forgot password
                    </Button>
                </Stack>
            </Box>
        </div>
    );
}
