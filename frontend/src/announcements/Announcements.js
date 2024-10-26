import { Box, Stack, Typography } from '@mui/material'
import { AnnouncementForm, AnnouncementDataTable } from '../announcements/index';
import { useState } from 'react';


export default function Announcements() {
    const [refreshAnnouncements, setRefreshAnnouncements] = useState(false);

    const toggleRefresh = () => setRefreshAnnouncements(prev => !prev);

    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginTop: 5, textAlign: 'center', width: '100%'}}>
           <Stack direction='column' space={3} sx={{ width: '100%', maxWidth: '1200px'}}>

               <Typography variant="overline" sx={{fontSize: '1rem'}}>Announcement manager</Typography>

               <AnnouncementForm  onAnnouncementCreated={toggleRefresh} />

               <Box sx={{alignSelf: 'center', justifyContent: 'center', alignContent: 'center', width: '100%'}}>
                <AnnouncementDataTable refreshTrigger={refreshAnnouncements } />
               </Box>
           </Stack>
        </Box>
    );
}