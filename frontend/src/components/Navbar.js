import {useContext, useState} from 'react'
import {
    AppBar,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import {AnalyticsOutlined, AnnouncementOutlined, Brightness4, Brightness7, DocumentScanner, CalendarMonth, SpaceDashboardOutlined, PeopleOutlined, LoginOutlined} from '@mui/icons-material';
import {ThemeContext} from '../context/ThemeContext';
import useMediaQuery from '@mui/material/useMediaQuery'
import {useTheme} from '@mui/material/styles'
import { Link } from 'react-router-dom'

export default function Navbar() {
    const {darkMode, toggleDarkMode} = useContext(ThemeContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const menuItems = [
        { text: 'Login', icon: <LoginOutlined /> },
        { text: 'Dashboard', icon: <SpaceDashboardOutlined /> },
        { text: 'Announcements', icon: <AnnouncementOutlined /> },
        { text: 'Documents', icon: <DocumentScanner /> },
        { text: 'Evaluations', icon: <AnalyticsOutlined /> },
        { text: 'Users', icon: <PeopleOutlined /> },
        { text: 'Employees', icon: <PeopleOutlined /> },
        { text: 'Schedule', icon: <CalendarMonth /> },
    ]

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
                                <MenuIcon/>
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
                                    <Typography variant='overline' sx={{marginBottom: 2}}>
                                        version 1.2
                                    </Typography>
                                    <Divider />
                                    <List>
                                        {menuItems.map((item, index) => (
                                            <ListItem
                                                key={index}

                                                onClick={handleDrawerToggle}
                                                component={Link}
                                                to={`/${item.text.toLowerCase()}`}
                                                sx={{
                                                    width: '100%',
                                                    '&:hover': {
                                                        backgroundColor: darkMode ? '#444' : '#f0f0f0',
                                                    },
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <ListItemIcon
                                                    sx={{
                                                        color: darkMode ? '#fff' : '#000'
                                                    }}
                                                >
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText primary={item.text} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Drawer>
                        </>
                    ) : (
                        <>
                            <Typography variant="overline" style={{flexGrow: "1"}}>
                                version 1.2
                            </Typography>
                            {menuItems.map((item, index) => (
                                <Button
                                    key={index}
                                    color="inherit"
                                    component={Link}
                                    to={`/${item.text.toLowerCase()}`}
                                >
                                    {item.text}
                                </Button>
                            ))}
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