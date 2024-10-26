import {
    Box,
    IconButton,
    Table,
    TableHead,
    TableContainer,
    TableBody,
    TableRow,
    TableCell,
    TableSortLabel,
    TablePagination,
    Paper,
    TextField,
    Typography
} from '@mui/material'
import {Delete, MovieCreation, Search } from '@mui/icons-material'
import PdfIcon from '@mui/icons-material/PictureAsPdf'
import ExcelIcon from '@mui/icons-material/GridOn'
import WordIcon from '@mui/icons-material/Description'
import PowerPointIcon from '@mui/icons-material/Slideshow'
import { useTheme } from '@mui/material/styles'
import { useState, useEffect } from 'react';
import console from 'console-browserify';

import { storage } from '../utilities/firebase'; // Ensure this path is correct
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function DocumentDataTable({ refreshTrigger }) {
    const theme = useTheme();
    const [documents, setDocuments] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc'})


    // fetch all documents
    async function getDocuments() {
        try {
            const response = await fetch('http://localhost:5000/api/document/documents', {
                method: 'GET'
            });

            const _response = await response.json();

            if(response.ok && _response.documents) {
                setDocuments(_response.documents)
            } else {
                console.error('Failed to fetch documents')
            }

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getDocuments();
    }, [refreshTrigger]);

    // delete record from the backend and update the ui in data table
    const handleDelete = async (documentId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/document/delete/${documentId}`, {
                method: 'DELETE',
            })

            if(response.ok) {
                setDocuments((prev) =>
                prev.filter((document) => document._id !== documentId)
                );
            } else {
                console.error('Failed to delete document');
            }
        } catch (error) {
            console.error('Error deleting document', error)
        }
    }

    // search in data table
    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    // sort in data table
    const handleSort = (key) => {
        setSortConfig((prevSortConfig) => ({
            key,
            direction: prevSortConfig.key === key && prevSortConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // sorts direction of the selected column to be asc or desc
    const sortedDocuments = [...documents].sort((a, b) => {
        if (sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
    })

    // filter title of the documents in data table
    const filteredDocuments = sortedDocuments.filter((document) => {
        return document.title.toLowerCase().includes(searchQuery.toLowerCase())
    })

    // pagination footer in data table
    const displayedDocuments = filteredDocuments.slice(page * rowsPerPage, page + rowsPerPage + rowsPerPage);

    // logic to scroll pages of data
    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    }

    // logic to change row count being displayed
    const handleChangeRowsPerPage = (e) => {
        const value = +e.target.value
        setRowsPerPage(value);
        setPage(0)
    }

    const renderFileTypeIcon = (url) => {
        const fileExtension = url.split('?')[0].split('.').pop().toLowerCase();

        switch(fileExtension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
                return <img src={url} alt='document thumbnail' style={{width: '60px', height: '60px', objectFit: 'cover'}} />
            case 'mp4':
                return <MovieCreation style={{color: '#ed5d09' }} />
            case 'pdf':
                return <PdfIcon style={{ color: '#ED2224' }} />
            case 'xlsx':
            case 'xls':
                return <ExcelIcon style={{ color: '#1D6F42' }} />
            case 'docx':
            case 'doc':
                return <WordIcon style={{ color: '#2b579a' }} />
            case 'pptx':
            case 'ppt':
                return <PowerPointIcon style={{ color: '#D04423'}} />
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
                    <TextField
                        variant='outlined'
                        value={searchQuery}
                        onChange={handleSearch}
                        label='search'
                        sx={{width: '300px'}}
                    />
                </Box>
                <TableContainer sx={{justifyContent: 'center', alignItems: 'center'}}>
                    <Table sx={{minWidth: 700}} stickyHeader aria-label='document records table grid'>
                        <TableHead sx={{justifyContent: 'center'}}>
                            <TableRow>
                                <TableCell sx={{textAlign: 'center'}}>
                                    <TableSortLabel
                                        active={sortConfig.key === 'title'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('title')}
                                    >
                                        Title
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{textAlign: 'center'}}>
                                    <TableSortLabel
                                        active={sortConfig.key === 'category'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('category')}
                                    >
                                        Category
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{textAlign: 'center'}}>
                                        Type
                                </TableCell>
                                <TableCell sx={{textAlign: 'center'}}>
                                    Delete
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedDocuments.map((document) => (
                                <TableRow
                                    key={document._id}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                            color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                                            cursor: 'default',

                                        }
                                    }}
                                >
                                    <TableCell sx={{textAlign: 'center'}}>{document.title}</TableCell>
                                    <TableCell sx={{textAlign: 'center'}}>{document.category}</TableCell>
                                    <TableCell sx={{textAlign: 'center'}}>
                                        {renderFileTypeIcon(document.downloadUrl)}
                                    </TableCell>
                                    <TableCell sx={{textAlign: 'center'}}>
                                        <IconButton onClick={() => handleDelete(document._id)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component='div'
                    count={documents.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}