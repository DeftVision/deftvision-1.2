import { useContext, useState, useEffect } from 'react';
import {
    AppBar,
    Box,
    Button,
    Collapse,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {
    AnalyticsOutlined,
    AnnouncementOutlined,
    Brightness4,
    Brightness7,
    DocumentScanner,
    CalendarMonth,
    SpaceDashboardOutlined,
    PeopleOutlined,
    LoginOutlined,
    ExpandMore,
    ExpandLess,
} from '@mui/icons-material';

import { ThemeContext } from '../context/ThemeContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


export default function Navbar() {
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            setIsLoggedIn(true);
        }
    }, [])


    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);

    if(!isLoggedIn) {
        return <Navigate to="/login" />;
    }
    }
    const handleMenuToggle = (menuIndex) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menuIndex]: !prev[menuIndex],
        }));
    };

    const handleSubLinkClick = () => {
        setOpenMenus({}); // Close all menus after clicking a sub-link
        setDrawerOpen(false); // Close the drawer if in mobile view
    };

    const menuItems = [
       /* { text: 'Login', icon: <LoginOutlined /> },*/
        { text: 'Dashboard', icon: <SpaceDashboardOutlined /> },
        {
            text: 'Documents',
            icon: <DocumentScanner />,
            subLinks: [
                { text: 'Documents', path: '/documents' },
                { text: 'EndUserDocuments', path: '/end-user-documents' },
            ],
        },
        { text: 'Announcements', icon: <AnnouncementOutlined /> },
        { text: 'Evaluations', icon: <AnalyticsOutlined /> },
        {
            text: 'People',
            icon: <PeopleOutlined />,
            subLinks: [
                { text: 'Users', path: '/users' },
                { text: 'Employees', path: '/employees' },
            ],
        },
        { text: 'Schedule', icon: <CalendarMonth /> },
    ];

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    {isMobile ? (
                        <>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleDrawerToggle}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Drawer
                                anchor='left'
                                open={drawerOpen}
                                onClose={handleDrawerToggle}
                                PaperProps={{
                                    sx: {
                                        backgroundColor: darkMode ? '#333' : '#fff',
                                        color: darkMode ? '#fff' : '#000',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 250,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        padding: 2,
                                    }}
                                >
                                    <Typography variant='overline' sx={{ marginBottom: 2 }}>
                                        version 1.2
                                    </Typography>
                                    <Divider />
                                    <List>
                                        {menuItems.map((item, index) => (
                                            <div key={index}>
                                                <ListItem
                                                    button
                                                    onClick={() => item.subLinks ? handleMenuToggle(index) : handleDrawerToggle()}
                                                    component={!item.subLinks ? Link : undefined}
                                                    to={!item.subLinks ? `/${item.text.toLowerCase()}` : undefined}
                                                    sx={{
                                                        width: '100%',
                                                        '&:hover': {
                                                            backgroundColor: darkMode ? '#444' : '#f0f0f0',
                                                        },
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <ListItemIcon sx={{ color: darkMode ? '#fff' : '#000' }}>
                                                        {item.icon}
                                                    </ListItemIcon>
                                                    <ListItemText primary={item.text} />
                                                    {item.subLinks ? (
                                                        openMenus[index] ? <ExpandLess /> : <ExpandMore />
                                                    ) : null}
                                                </ListItem>
                                                {item.subLinks && (
                                                    <Collapse in={openMenus[index]} timeout="auto" unmountOnExit>
                                                        <List component="div" disablePadding>
                                                            {item.subLinks.map((subItem, subIndex) => (
                                                                <ListItemButton
                                                                    key={subIndex}
                                                                    component={Link}
                                                                    to={subItem.path}
                                                                    sx={{
                                                                        pl: 4,
                                                                        backgroundColor: darkMode ? '#444' : '#f9f9f9',
                                                                        color: darkMode ? '#fff' : '#000',
                                                                    }}
                                                                    onClick={handleSubLinkClick}
                                                                >
                                                                    <ListItemText primary={subItem.text} />
                                                                </ListItemButton>
                                                            ))}
                                                        </List>
                                                    </Collapse>
                                                )}
                                            </div>
                                        ))}
                                    </List>
                                </Box>
                            </Drawer>
                        </>
                    ) : (
                        <>
                            <Typography variant="overline" style={{ flexGrow: "1" }}>
                                version 1.2
                            </Typography>
                            {menuItems.map((item, index) => (
                                <div key={index}>
                                    {item.subLinks ? (
                                        <Box>
                                            <Button
                                                color="inherit"
                                                onClick={() => handleMenuToggle(index)}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                {item.text}
                                            </Button>
                                            {openMenus[index] && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        zIndex: 1,
                                                        backgroundColor: theme.palette.background.paper,
                                                        boxShadow: theme.shadows[3],
                                                    }}
                                                >
                                                    <List>
                                                        {item.subLinks.map((subItem, subIndex) => (
                                                            <ListItemButton
                                                                key={subIndex}
                                                                component={Link}
                                                                to={subItem.path}
                                                                onClick={() => handleSubLinkClick()}
                                                                sx={{
                                                                    backgroundColor: darkMode ? '#333' : '#fff',
                                                                    color: darkMode ? '#fff' : '#000',
                                                                }}
                                                            >
                                                                <ListItemText primary={subItem.text} />
                                                            </ListItemButton>
                                                        ))}
                                                    </List>
                                                </Box>
                                            )}
                                        </Box>
                                    ) : (
                                        <Button
                                            key={index}
                                            color="inherit"
                                            component={Link}
                                            to={`/${item.text.toLowerCase()}`}
                                        >
                                            {item.text}
                                        </Button>
                                    )}
                                </div>
                            ))}
                            {isLoggedIn ? (
                                <Button color="inherit" onClick={handleLogout}>
                                    Logout
                                </Button>
                            ) : (
                                <Button color="inherit" component={Link} to="/login">
                                    Login
                                </Button>
                            )}
                        </>
                    )}
                    <Button color='inherit' onClick={toggleDarkMode}>
                        {darkMode ? <Brightness7 /> : <Brightness4 />}
                    </Button>
                </Toolbar>
            </AppBar>
        </>
    );
}
