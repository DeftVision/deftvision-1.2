import { Box } from '@mui/material'
import { Routes, Route } from 'react-router-dom';

import { Home, Error} from './pages/index';
import { AnnouncementForm, Announcements } from './announcements/index';
import Navbar from './components/Navbar';



function App() {
  return (

     <Box>
       <Navbar />
         <Box>
         <div className="App">
           <Routes>
             <Route path='/home' element={<Home/>}/>

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
