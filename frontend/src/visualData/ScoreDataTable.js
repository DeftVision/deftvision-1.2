import { Box, Table, TableCell, TableRow, TableBody, TableHead, TableContainer, TablePagination, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import * as React from 'react';



export default function ScoreDataTable() {
    const [evaluations, setEvaluations] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)


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

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value)
        setPage(0);
    }
    const displayedEvaluations = evaluations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{padding: 10}}>
            <Paper elevation={8} sx={{padding: 5}}>
                <TableContainer>
                    <Table sx={{minWidth: 700}} stickyHeader aria-label='location scores table grid'>
                        {/*<caption>scores for all locations</caption>*/}
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Food</TableCell>
                                <TableCell>Clean</TableCell>
                                <TableCell>Service</TableCell>
                                <TableCell>Final</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                                {displayedEvaluations.map((evaluation) => (
                                        <TableRow key={evaluation._id}>
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