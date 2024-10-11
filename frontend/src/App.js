import { Box } from '@mui/material'
import { Routes, Route } from 'react-router-dom';

import { Home, Error} from './pages/index';
import { AnnouncementForm, Announcements } from './announcements/index';


function App() {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', marginTop: 5, marginBottom: 5, padding: 10, justifyContent: 'center', alignItems: 'center'}}>
      <Box>
        <div className="App">
          <Routes>
            <Route path='/' element={<Home/>}/>


              <Route path='*' element={<Error/>}/>


              <Route path='/announcement-form' element={<AnnouncementForm/>}/>
            <Route path='/announcements' element={<Announcements/>}/>

          </Routes>
        </div>
      </Box>
    </Box>
  );
}

export default App;
