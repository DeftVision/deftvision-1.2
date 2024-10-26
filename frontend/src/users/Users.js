import { UserForm, UserDataTable } from '../users/index'
import { Box, Stack, Typography } from '@mui/material'
import { useState } from 'react'



export default function Users() {
    const [refreshUsers, setRefreshUsers] = useState(false);

    const toggleRefresh = () => setRefreshUsers(prev => !prev);

    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginTop: 5, textAlign: 'center', width: '100%'}}>
            <Stack direction='column' space={3} sx={{ width: '100%', maxWidth: '1200px'}}>
                <Typography variant='overline' sx={{fontSize: '1rem'}}>User Management</Typography>
            <UserForm onUserCreated={toggleRefresh} />

                <Box sx={{alignSelf: 'center', justifyContent: 'center', alignContent: 'center', width: '100%'}}>
                    <UserDataTable refreshTrigger={refreshUsers}/>
                </Box>
            </Stack>
        </Box>
    );
}