import React, { useContext, useState } from 'react';
import { Box } from '@mui/material';
import {Navigate, Route, Routes} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './utilities/store';
import { AuthProvider, AuthContext } from './context/AuthContext';

import { Error } from './pages/index';
import { Dashboard, Login, Navbar } from './components/index';
import { PrivateRoute } from './utilities/index';
import { Documents, EndUserDocuments } from './documents/index';


import Evaluations from './evaluations/Evaluations';
import Announcements from './announcements/Announcements';
import Users from './users/Users';
import Employees from './employees/Employees';
import Schedules from './schedules/Schedules';
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";


function AppContent() {
    const { isAuthenticated } = useContext(AuthContext);
    return (
        <Box sx={{marginBottom: 10}}>
            <Navbar/>
        <Box>
            <div className="App">
                <Routes>
                    <Route path='/login' element={!isAuthenticated ? <Login /> : <Navigate to='/dashboard'/>} />
                    <Route path='*' element={<Error/>}/>
                    <Route path='/forgot-password' element={<ForgotPassword/>} />
                    <Route path='/reset-password' element={<ResetPassword/>} />
                    <Route element={<PrivateRoute />}>
                        <Route path='/announcements' element={<Announcements/>} />
                        <Route path='/evaluations' element={<Evaluations/>} />
                        <Route path='/documents' element={<Documents/>} />
                        <Route path='/end-user-documents' element={<EndUserDocuments/>} />
                        <Route path='/dashboard' element={<Dashboard/>} />
                        <Route path='/employees' element={<Employees/>}/>
                        <Route path='/users' element={<Users/>} />
                        <Route path='/schedule' element={<Schedules/>} />
                    </Route>
                </Routes>
            </div>
        </Box>
        </Box>
    );
}


function App() {
    return (
        <AuthProvider>
        <Provider store={store}>
                <AppContent />
        </Provider>
        </AuthProvider>
    );
}

export default App;
