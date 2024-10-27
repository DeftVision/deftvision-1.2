import {
    Box,
    Table,
    TableHead,
    TableContainer,
    TableBody,
    TableRow,
    TableCell,
    TableSortLabel,
    TablePagination,
    Paper,
    OutlinedInput,
    InputAdornment,
    FormControl, Typography
} from '@mui/material'
import { useState, useEffect } from 'react';
import {useTheme} from "@mui/material/styles";
import console from 'console-browserify';
import {MovieCreation, Search} from "@mui/icons-material";
import * as React from "react";

export default function EvaluationDataTable({ refreshTrigger }) {
    const theme = useTheme();
    const [evaluations, setEvaluations] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState({key: 'name', direction: 'asc'});

    async function getEvaluationData () {
        try {
            const response = await fetch ('http://localhost:5000/api/evaluation/evaluations', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json();

            if(response.ok && data.evaluations) {
                setEvaluations(data.evaluations)
            } else {
                console.log('error')

            }
        } catch (error) {
            console.log('oops...', error);
        }
    }

    useEffect(() => {
        getEvaluationData();
    }, []);

    // search input
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    }

    // sort columns
    const handleSort = (key) => {
        let direction = 'asc';
        if(sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({key, direction})
    }

    // sort logic
    const sortedEvaluations = [...evaluations].sort((a,b) => {
        if(sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
    })

    const filteredEvaluations = sortedEvaluations.filter((evaluation) => {
        return evaluation.location.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const displayedEvaluations = filteredEvaluations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value)
        setPage(0);
    }

    const renderFileTypeIcon = (url) => {
        const fileExtension = url.split('?')[0].split('.').pop().toLowerCase();

        switch(fileExtension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
                return <img src={url} alt='document thumbnail' style={{width: '50px', height: '50px', objectFit: 'cover'}} />
            case 'mp4':
                return <MovieCreation style={{color: '#ed5d09' }} />
            default:
                return <Typography variant='overline'>no preview</Typography>
        }
    }

    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
            <Paper elevation={8} width='100%' sx={{padding: 5, maxWidth: '1200px', width: '90%'}}>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    marginBottom: 2
                }}>
                    <FormControl sx={{m: 1}}>
                        <OutlinedInput
                            id='outlined-adornment-search'
                            startAdornment={<InputAdornment position='start'><Search /></InputAdornment>}
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </FormControl>
                </Box>
                <TableContainer  sx={{justifyContent: 'center', alignItems: 'center'}}>
                    <Table sx={{minWidth: 700}} stickyHeader aria-label='evaluation data table grid'>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'date'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('date')}
                                    >
                                        Date
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'location'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('location')}
                                    >
                                        Location
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'finalScore'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('finalScore')}
                                    >
                                        Score
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    Image
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedEvaluations.map((evaluation) => (
                                <TableRow
                                    key={evaluation._id}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                            color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                                            cursor: 'default',

                                        }
                                    }}
                                >
                                    <TableCell sx={{justifyContent: 'center'}}>{new Date(evaluation.date).toLocaleDateString()}</TableCell>
                                    <TableCell sx={{justifyContent: 'center'}}>{evaluation.location}</TableCell>
                                    <TableCell sx={{justifyContent: 'center'}}>{evaluation.finalScore}</TableCell>
                                    <TableCell sx={{justifyContent: 'center'}}>
                                        {renderFileTypeIcon(evaluation.downloadUrl)}
                                    </TableCell>

                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component='div'
                    count={evaluations.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}