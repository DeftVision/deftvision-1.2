import { Box, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { DocumentForm, DocumentDataTable } from '../documents/index'

export default function Documents() {
    const [refreshDocuments, setRefreshDocuments] = useState(false);

    const toggleRefresh = () => setRefreshDocuments(prev => !prev);

    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginTop: 5, textAlign: 'center', width: '100%'}}>
            <Stack direction='column' space={3} sx={{ width: '100%', maxWidth: '1200px'}}>
            <Typography variant='overline' sx={{fontSize: '1rem'}}>Document Management</Typography>

            <DocumentForm onDocumentCreated={toggleRefresh} />
                <Box sx={{alignSelf: 'center', justifyContent: 'center', alignContent: 'center', width: '100%'}}>
                <DocumentDataTable refreshTrigger={refreshDocuments}/>
                </Box>
            </Stack>
        </Box>
    );
}