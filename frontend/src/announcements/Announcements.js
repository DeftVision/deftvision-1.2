import { Box, Typography } from '@mui/material'
import { AnnouncementForm, AnnouncementDataTable } from '../announcements/index';
export default function Announcements() {

    return (
        <Box sx={{justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
            <Typography variant="overline" sx={{fontSize: '1rem'}}>Announcement Data</Typography>

            <AnnouncementForm />
            <AnnouncementDataTable />
        </Box>
    );
}