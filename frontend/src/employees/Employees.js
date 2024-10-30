import { EmployeeForm, EmployeeDataTable } from '../employees/index'
import { Box, Stack, Typography } from '@mui/material'
import { useState } from 'react'

export default function Employees() {
    const [refreshEmployees, setRefreshEmployees] = useState(false);

    const toggleRefresh = () => setRefreshEmployees(prev => !prev);

    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginTop: 5, textAlign: 'center', width: '100%'}}>
            <Stack direction='column' space={3} sx={{ width: '100%', maxWidth: '1200px'}}>
                <Typography variant='overline' sx={{fontSize: '1rem'}}>Employee Management</Typography>

                <EmployeeForm onEmployeeCreated={toggleRefresh} />
                <Box sx={{alignSelf: 'center', justifyContent: 'center', alignContent: 'center', width: '100%'}}>
                    <EmployeeDataTable refreshTrigger={refreshEmployees}/>
                </Box>
            </Stack>
        </Box>
    );
}