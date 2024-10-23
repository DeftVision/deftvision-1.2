import { Box } from '@mui/material'
import { Route, Routes } from 'react-router-dom';

import { Error, Home } from './pages/index';
import { Dashboard, Login, Navbar } from './components/index';
import { PrivateRoute } from './utilities/index';
import DocumentForm from './documents/DocumentForm';
import EvaluationForm from './evaluations/EvaluationForm'


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

                        <Route path='/evaluations' element={<EvaluationForm/>} />

                        <Route path='/documents' element={<DocumentForm/>} />

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
