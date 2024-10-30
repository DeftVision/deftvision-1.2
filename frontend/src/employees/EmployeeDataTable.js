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
import { DoNotDisturbOnOutlined, CheckCircleOutline, Search } from '@mui/icons-material'
import {useState, useEffect} from 'react';
import { useTheme } from '@mui/material/styles'
import console from 'console-browserify';



export default function EmployeeDataTable({ refreshTrigger }) {
    const theme = useTheme();
    const [employees, setEmployees] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState({key: 'name', direction: 'asc'});


    async function getEmployees() {
        try {
            const response = await fetch('http://localhost:5000/api/employee/employees', {
                method: 'GET'
            });

            const _response = await response.json();

            if (response.ok && _response.employees) {
                setEmployees(_response.employees)

            } else {
                console.error('Failed to fetch employees');
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        getEmployees();
    }, [refreshTrigger])

    /*// delete record from the backend and update the ui in data table
    const handleDelete = async (employeeId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/employee/delete/${employeeId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Remove the deleted announcement from the local state
                setEmployees((prev) =>
                    prev.filter((employees) => employees._id !== employeesId)
                );
            } else {
                console.log('Failed to delete employee');
            }
        } catch (error) {
            console.log('Error deleting employee:', error);
        }
    };*/

    // toggle employee status in data table
    const handleToggleStatus = async (employeeId, currentStatus) => {
        try {
            const response = await fetch (`http://localhost:5000/api/employee/toggle-status/${employeeId}`, {
                method: 'PATCH',
                body: JSON.stringify({ isActive: !currentStatus }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                setEmployees((prev) =>
                    prev.map((employees) =>
                        employees._id === employeeId
                            ? { ...employees, isActive: !currentStatus }
                            : employees
                    )
                )
            } else {
                console.log('Failed to update employee status')
            }
        } catch (error) {
            console.error('Error toggling employee status:', error);
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

    const sortedEmployees = [...employees].sort((a, b) => {
        if (sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
    })

    const filteredEmployees = sortedEmployees.filter((employee) => {
        return employee.name.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const displayedEmployees = filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                    <Table sx={{minWidth: 700}} stickyHeader aria-label='employee data table grid'>
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
                                        Position
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{textAlign: 'center'}}>
                                    Status
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedEmployees.map((employee) => (
                                <TableRow
                                    key={employee._id}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                            color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                                            cursor: 'default',
                                        }
                                    }}
                                >
                                    <TableCell sx={{textAlign: 'center'}}>{employee.name}</TableCell>
                                    <TableCell sx={{textAlign: 'center'}}>{employee.position}</TableCell>
                                    <TableCell sx={{textAlign: 'center'}}>
                                        {employee.isActive ? (
                                            <CheckCircleOutline
                                                onClick={() => handleToggleStatus(employee._id, employee.isActive)}
                                                sx={{ cursor: 'pointer', color: '#1976d2' }}
                                            />
                                        ) : (
                                            <CheckCircleOutline
                                                onClick={() => handleToggleStatus(employee._id, employee.isActive)}
                                                sx={{ cursor: 'pointer', color: '#aaa' }}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component='div'
                    count={employees.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}