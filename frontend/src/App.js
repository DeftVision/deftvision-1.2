import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
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


function App() {

    return (
        <Provider store={store}>
            {/* Moved Provider here to ensure all components have access to the Redux store */}
            <Box sx={{marginBottom: 10}}>
                <Navbar/>
                <Box>
                    <div className="App">
                        <Routes>
                            <Route path='/login' element={<Login/>}/>
                            <Route path='*' element={<Error/>}/>

                            <Route path='/announcements' element={
                                <PrivateRoute>
                                    <Announcements/>
                                </PrivateRoute>
                            }/>
                            <Route path='/evaluations' element={
                                <PrivateRoute>
                                    <Evaluations/>
                                </PrivateRoute>
                            }/>
                            <Route path='/documents' element={
                                <PrivateRoute>
                                    <Documents/>
                                </PrivateRoute>
                            }/>

                            <Route path='/enduserdocuments' element={
                                <PrivateRoute>
                                    <EndUserDocuments/>
                                </PrivateRoute>
                            }/>

                            <Route path='/dashboard' element={
                                <PrivateRoute>
                                    <Dashboard/>
                                </PrivateRoute>
                            }/>
                            <Route path='/employees' element={
                                <PrivateRoute>
                                    <Employees/>
                                </PrivateRoute>
                            }/>
                            <Route path='/users' element={
                                <PrivateRoute>
                                    <Users/>
                                </PrivateRoute>
                            }/>
                            <Route path='/schedule' element={
                                <PrivateRoute>
                                    <Schedules/>
                                </PrivateRoute>
                            }/>
                        </Routes>
                    </div>
                </Box>
            </Box>
        </Provider>
    );
}

export default App;
