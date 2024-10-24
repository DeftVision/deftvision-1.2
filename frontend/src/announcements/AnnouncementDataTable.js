import { Box, Table, TableHead, TableContainer, TableBody, TableRow, TableCell, Typography } from '@mui/material'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'


export default function AnnouncementDataTable() {
    const [formData, setFormData] = useState({})


    return (
        <Box>
            <Typography variant='overline'>Announcement Data Table</Typography>
        </Box>
    );
}