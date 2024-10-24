import { Box, styled, Table, TableHead, TableBody, TableContainer, TableRow, TableCell, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DocumentForm, DocumentDataTable } from '../documents/index'

export default function Documents() {

    return (
        <Box>
            <Typography variant='overline'>Document home page</Typography>

            <DocumentForm />

            <DocumentDataTable />
        </Box>
    );
}