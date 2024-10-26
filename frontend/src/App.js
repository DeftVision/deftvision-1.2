import {Box} from '@mui/material'
import {Route, Routes} from 'react-router-dom';

import {Error, Home} from './pages/index';
import {Dashboard, Login, Navbar} from './components/index';
import {PrivateRoute} from './utilities/index';
import Documents from './documents/Documents';
import Evaluations from './evaluations/Evaluations'
import Announcements from './announcements/Announcements'
import Users from './users/Users'


function App() {
    return (

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

                        <Route path='/dashboard' element={
                            <PrivateRoute>
                                <Dashboard/>
                            </PrivateRoute>
                        }/>

                        <Route path='/users' element={
                            <PrivateRoute>
                                <Users />
                            </PrivateRoute>
                        } />

                    </Routes>
                </div>
            </Box>
        </Box>

    );
}

export default App;
