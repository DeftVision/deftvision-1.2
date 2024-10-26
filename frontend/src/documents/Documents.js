import { Box, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { DocumentForm, DocumentDataTable } from '../documents/index'

export default function Documents() {
    const [refreshDocuments, setRefreshDocuments] = useState(false);



    return (
        <Box>
            <Typography variant='overline'>Document Manager</Typography>

            <DocumentForm />

            <DocumentDataTable />
        </Box>
    );
}