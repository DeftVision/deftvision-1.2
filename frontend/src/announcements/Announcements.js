import { Box, Stack, Typography } from '@mui/material'
import { AnnouncementForm, AnnouncementDataTable } from '../announcements/index';
export default function Announcements() {

    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginTop: 5, textAlign: 'center', width: '100%'}}>
           <Stack direction='column' space={3} sx={{ width: '100%', maxWidth: '1200px'}}>

               <Typography variant="overline" sx={{fontSize: '1rem'}}>Announcement manager</Typography>

               <AnnouncementForm />

               <Box sx={{alignSelf: 'center', justifyContent: 'center', alignContent: 'center', width: '100%'}}>
                <AnnouncementDataTable/>
               </Box>
           </Stack>
        </Box>
    );
}