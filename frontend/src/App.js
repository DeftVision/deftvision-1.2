import React, { useState } from 'react';
import { Box } from '@mui/material';
import {Navigate, Route, Routes} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './utilities/store';

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


function App() {

    return (
        <Provider store={store}>
            {/* Moved Provider here to ensure all components have access to the Redux store */}
            <Box sx={{marginBottom: 10}}>
                <Navbar/>
                <Box>
                    <div className="App">
                        <Routes>
                            {/*<Route path='/login' element={!isAuthenticated ? <Login /> : <Navigate to='/dashboard'/>} />*/}
                            <Route path='/login' element={<Login/>}/>
                            <Route path='*' element={<Error/>}/>
                            <Route path='/forgot-password' elemen={<ForgotPassword/>} />
                            {/*<Route element={<PrivateRoute />}>*/}
                                <Route path='/announcements' element={<Announcements/>} />
                                <Route path='/evaluations' element={<Evaluations/>} />
                                <Route path='/documents' element={<Documents/>} />
                                <Route path='/enduserdocuments' element={<EndUserDocuments/>} />
                                <Route path='/dashboard' element={<Dashboard/>} />
                                <Route path='/employees' element={<Employees/>}/>
                                <Route path='/users' element={<Users/>} />
                                <Route path='/schedule' element={<Schedules/>} />
                            {/*</Route>*/}
                        </Routes>
                    </div>
                </Box>
            </Box>
        </Provider>
    );
}

export default App;
