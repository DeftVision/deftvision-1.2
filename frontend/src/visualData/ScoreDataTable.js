import {
    Box,
    Paper,
    Table,
    TableCell,
    TableRow,
    TableBody,
    TableHead,
    TableContainer,
    TablePagination,
    TableSortLabel,
    TextField,
    Typography
} from "@mui/material";
import { useState, useEffect } from "react";
import * as React from 'react';



export default function ScoreDataTable() {
    const [evaluations, setEvaluations] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState({key: 'date', direction: 'asc'});


    async function getEvaluations () {
        try {
            const response = await fetch ('http://localhost:5000/api/evaluation/evaluation-data/', {
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
        getEvaluations();
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
        /*const matchesSearch = evaluation.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLocation = filterLocation === 'All' || evaluation.location === filterLocation;*/
        // return matchesSearch && matchesLocation;
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

    return (
        <Box sx={{padding: 10}}>
            <Paper elevation={8} sx={{padding: 5}}>
                <Typography variant='overline' sx={{fontSize: '1rem', textAlign: 'left', marginLeft: 10, marginTop: 5}} gutterBottom>All Scores</Typography>

                <Box sx={{display: 'flex', justifyContent: 'space-between', marginBottom: 2}}>
                    <TextField
                        variant='outlined'
                        value={searchQuery}
                        onChange={handleSearch}
                        label='search'
                        sx={{width: '30%'}}
                    />
                </Box>

                <TableContainer>
                    <Table sx={{minWidth: 700}} stickyHeader aria-label='location scores table grid'>
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
                                        active={sortConfig.key === 'foodScore'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('foodScore')}
                                    >
                                        Food
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'cleanScore'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('cleanScore')}
                                    >
                                        Clean
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'serviceScore'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('serviceScore')}
                                    >
                                        Service
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'finalScore'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('finalScore')}
                                    >
                                        Final
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                                {displayedEvaluations.map((evaluation) => (
                                        <TableRow
                                            key={evaluation._id}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: '#f5f5f5',
                                                    cursor: 'none'
                                                }
                                            }}
                                        >
                                            <TableCell>{new Date(evaluation.date).toLocaleDateString()}</TableCell>
                                            <TableCell>{evaluation.location}</TableCell>
                                            <TableCell>{evaluation.foodScore}</TableCell>
                                            <TableCell>{evaluation.cleanScore}</TableCell>
                                            <TableCell>{evaluation.serviceScore}</TableCell>
                                            <TableCell>{evaluation.finalScore}</TableCell>
                                        </TableRow>
                                    ))}

                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
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