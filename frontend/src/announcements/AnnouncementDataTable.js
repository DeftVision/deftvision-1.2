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
    Typography,
    Paper,
    TextField
} from '@mui/material'
import { Visibility, VisibilityOff, Search } from '@mui/icons-material'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'



export default function AnnouncementDataTable() {
    const [announcements, setAnnouncements] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState({key: 'name', direction: 'asc'});


        async function getAnnouncements() {
            try {
                const response = await fetch('http://localhost:5000/api/announcement/announcements', {
                    method: 'GET',
                    header: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if(response.ok && data.announcements) {
                    setAnnouncements(announcements.filter(announcement => announcement._id !== announcementId));
                } else {
                    console.error('Failed to fetch announcements');
                }
            } catch (error) {
                console.log(error);

            }
        }
    useEffect(() => {
        getAnnouncements();
    }, [])

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleSort = (key) => {
        let direction = 'asc'
        if(sortConfig.key === sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({key, direction})
    }

    const sortedAnnouncements = [...announcements].sort((a, b) => {
        if(sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
    })

    const filteredAnnouncements = sortedAnnouncements.filter((announcement) => {
        return announcement.name.toLowerCase().includes(searchQuery.toLowerCase())
    })

    // TODO : where does this get called??
    const displayedAnnouncements = filteredAnnouncements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (e) => {
        setRowsPerPage(+e.target.value)
        setPage(0);
    }

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value)
        setPage(0)
    }

    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}} >
           <Paper elevation={8} width='100%' sx={{padding: 5, maxWidth: '1200px', width: '90%'}}>
               <Box sx={{width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 2}}>
                   <TextField
                       variant='outlined'
                       value={searchQuery}
                       onChange={handleSearch}
                       label='search'
                       sx={{width: '300px'}}
                   />
               </Box>

               <TableContainer sx={{justifyContent: 'center', alignItems: 'center'}}>
                   <Table sx={{minWidth: 700}} stickyHeader aria-label='location scores table grid'>
                       <TableHead sx={{justifyContent: 'center'}}>
                           <TableRow>
                               <TableCell sx={{backgroundColor: '#1976d2', color: '#fff', textAlign: 'center'}}>
                                   <TableSortLabel
                                       active={sortConfig.key === 'name'}
                                       direction={sortConfig.direction}
                                       onClick={() => handleSort('name')}
                                   >
                                       Name
                                   </TableSortLabel>
                               </TableCell>
                               <TableCell sx={{backgroundColor: '#1976d2', color: '#fff', textAlign: 'center'}}>
                                   <TableSortLabel
                                       active={sortConfig.key === 'subject'}
                                       direction={sortConfig.direction}
                                       onClick={() => handleSort('subject')}
                                   >
                                       Subject
                                   </TableSortLabel>
                               </TableCell>
                               <TableCell sx={{backgroundColor: '#1976d2', color: '#fff', textAlign: 'center'}}>
                                   <TableSortLabel
                                       active={sortConfig.key === 'publish'}
                                       direction={sortConfig.direction}
                                       onClick={() => handleSort('publish')}
                                   >
                                       Published
                                   </TableSortLabel>
                               </TableCell>
                           </TableRow>
                       </TableHead>
                       <TableBody>
                           {announcements.map((announcement) => (
                               <TableRow
                                   key={announcement._id}
                                   sx={{
                                       '&:hover': {
                                           backgroundColor: '#f5f5f5',
                                           cursor: 'default',

                                       }
                                   }}
                               >
                                   <TableCell sx={{textAlign: 'center'}}>{announcement.name}</TableCell>
                                   <TableCell sx={{textAlign: 'center'}}>{announcement.subject}</TableCell>
                                   <TableCell sx={{textAlign: 'center'}}>{announcement.publish ? <Visibility /> : <VisibilityOff/>}</TableCell>
                               </TableRow>
                           ))}

                       </TableBody>
                   </Table>
               </TableContainer>
               <TablePagination
                   rowsPerPageOptions={[5, 10, 25, 50]}
                   component='div'
                   count={announcements.length}
                   rowsPerPage={rowsPerPage}
                   page={page}
                   onPageChange={handleChangePage}
                   onRowsPerPageChange={handleChangeRowsPerPage}



               />
           </Paper>
        </Box>
    );
}