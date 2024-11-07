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

export default function Navbar() {
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    const handleDrawerToggle = () => {
        setDrawerOpen((prevOpen) => !prevOpen);
    }


    return (
        <Box>

        </Box>
    );


}