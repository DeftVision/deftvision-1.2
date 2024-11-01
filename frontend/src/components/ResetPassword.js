import {Box, Button, TextField, Typography, List, ListItem, ListItemText, Stack} from '@mui/material';
import { Link } from 'react-router-dom'
import { useState } from 'react';


export default function ResetPassword() {
    const [password, setPassword] = useState('');
    return (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', backgroundColor: '#f5f5f5'}}>
            <Stack direction='column' spacing={2}>
                <Typography variant='overline'>passwords must match</Typography>
                <List>
                    <ListItem>
                        <ListItemText>minimum 8 characters</ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText>One Uppercase</ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText>One Lowercase</ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText>One special character</ListItemText>
                    </ListItem>
                </List>
            <form>
            <TextField
                    label='Password'
                />

                <TextField
                    label='Confirm Password'
                />
                <Button>
                    reset
                </Button>
            </form>
            </Stack>
        </Box>
    );
}