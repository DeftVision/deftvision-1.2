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
    OutlinedInput,
    InputAdornment,
    FormControl
} from '@mui/material'
import {Delete, Visibility, VisibilityOff, Search} from '@mui/icons-material'
import {useState, useEffect} from 'react';
import { useTheme } from '@mui/material/styles'
import console from 'console-browserify';



export default function AnnouncementDataTable({ refreshTrigger }) {
    const theme = useTheme();
    const [announcements, setAnnouncements] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState({key: 'name', direction: 'asc'});


    async function getAnnouncements() {
        try {
            const response = await fetch('http://localhost:5000/api/announcement/announcements', {
                method: 'GET'
            });

            const _response = await response.json();

            if (response.ok && _response.announcements) {
                setAnnouncements(_response.announcements)

            } else {
                console.error('Failed to fetch announcements');
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        getAnnouncements();
    }, [refreshTrigger])

    // delete record from the backend and update the ui in data table
    const handleDelete = async (announcementId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/announcement/delete/${announcementId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Remove the deleted announcement from the local state
                setAnnouncements((prev) =>
                    prev.filter((announcement) => announcement._id !== announcementId)
                );
            } else {
                console.error('Failed to delete announcement');
            }
        } catch (error) {
            console.error('Error deleting announcement:', error);
        }
    };

    // toggle publish status in data table
    const handleTogglePublish = async (announcementId, currentStatus) => {
        try {
            const response = await fetch (`http://localhost:5000/api/announcement/toggle-publish/${announcementId}`, {
                method: 'PATCH',
                body: JSON.stringify({ publish: !currentStatus }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                setAnnouncements((prev) =>
                    prev.map((announcement) =>
                        announcement._id === announcementId
                        ? { ...announcement, publish: !currentStatus }
                            : announcement
                    )
                )
            } else {
                console.log('Failed to update published status')
            }
        } catch (error) {
            console.error('Error toggling publish status:', error);
        }
    }

    // search sort filter in data table

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleSort = (key) => {
        setSortConfig((prevSortConfig) => ({
            key,
            direction: prevSortConfig.key === key && prevSortConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedAnnouncements = [...announcements].sort((a, b) => {
        if (sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
    })

    const filteredAnnouncements = sortedAnnouncements.filter((announcement) => {
        return announcement.name.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const displayedAnnouncements = filteredAnnouncements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (e) => {
        const value = +e.target.value || 5;
        setRowsPerPage(value)
        setPage(0)
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

                <TableContainer sx={{justifyContent: 'center', alignItems: 'center'}}>
                    <Table sx={{minWidth: 700}} stickyHeader aria-label='announcement data table grid'>
                        <TableHead sx={{justifyContent: 'center'}}>
                            <TableRow>
                                <TableCell sx={{textAlign: 'center'}}>
                                    <TableSortLabel
                                        active={sortConfig.key === 'name'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('name')}
                                    >
                                        Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{textAlign: 'center'}}>
                                    <TableSortLabel
                                        active={sortConfig.key === 'subject'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('subject')}
                                    >
                                        Subject
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{textAlign: 'center'}}>
                                    <TableSortLabel
                                        active={sortConfig.key === 'publish'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('publish')}
                                    >
                                        Published
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{textAlign: 'center'}}>
                                    Delete
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedAnnouncements.map((announcement) => (
                                <TableRow
                                    key={announcement._id}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                            color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                                            cursor: 'default',
                                        }
                                    }}
                                >
                                    <TableCell sx={{textAlign: 'center'}}>{announcement.name}</TableCell>
                                    <TableCell sx={{textAlign: 'center'}}>{announcement.subject}</TableCell>
                                    <TableCell sx={{textAlign: 'center'}}>
                                        {announcement.publish ? (
                                            <Visibility
                                                onClick={() => handleTogglePublish(announcement._id, announcement.publish)}
                                                sx={{ cursor: 'pointer', color: '#1976d2' }}
                                            />
                                            ) : (
                                            <VisibilityOff
                                                onClick={() => handleTogglePublish(announcement._id, announcement.publish)}
                                                sx={{ cursor: 'pointer', color: '#aaa' }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <IconButton onClick={() => handleDelete(announcement._id)}>
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