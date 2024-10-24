import { Box, styled, Table, TableHead, TableBody, TableContainer, TableRow, TableCell, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EvaluationForm, EvaluationDataTable } from '../evaluations/index'

export default function Evaluations() {

    return (
        <Box>
            <Typography variant='overline'>evaluation home page</Typography>

            <EvaluationForm/>

            <EvaluationDataTable />
        </Box>
    );
}