import { Box } from '@mui/material'
import { Route, Routes } from 'react-router-dom';

import { Error, Home } from './pages/index';
import { Dashboard, Login, Navbar } from './components/index';
import { PrivateRoute } from './utilities/index';
import Documents from './documents/Documents';
import Evaluations from './evaluations/Evaluations'
import Announcements from './announcements/Announcements'


function App() {
    return (

        <Box sx={{marginBottom: 10}}>
            <Navbar/>
            <Box>
                <div className="App">
                    <Routes>
                        <Route path='/login' element={<Login />} />

                        <Route path='/home' element={<Home/>}/>
                        <Route path='*' element={<Error/>}/>

                        <Route path='/announcements' element={<Announcements />}/>
                        <Route path='/evaluations' element={<Evaluations/>} />

                        <Route path='/documents' element={<Documents/>} />

                        <Route path='/dashboard' element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } />

                    </Routes>
                </div>
            </Box>
        </Box>

    );
}

export default App;
