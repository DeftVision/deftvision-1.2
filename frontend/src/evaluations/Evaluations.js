import { Box, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { EvaluationFormSteps, EvaluationDataTable } from '../evaluations/index'

export default function Evaluations() {
    const [refreshEvaluations, setRefreshEvaluations] = useState(false);

    const toggleRefresh = () => setRefreshEvaluations(prev => !prev);

    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginTop: 5, textAlign: 'center', width: '100%'}}>
            <Stack direction='column' space={3} sx={{ width: '100%', maxWidth: '1200px'}}>
                <Typography variant='overline' sx={{fontSize: '1rem'}}>Evaluation Management</Typography>

                <EvaluationFormSteps onDocumentCreated={toggleRefresh} />
                <Box sx={{alignSelf: 'center', justifyContent: 'center', alignContent: 'center', width: '100%'}}>
                    <EvaluationDataTable refreshTrigger={refreshEvaluations}/>
                </Box>
            </Stack>
        </Box>
    );
}