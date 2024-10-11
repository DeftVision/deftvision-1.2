import { Box, Typography } from '@mui/material'

export default function Error() {

    return (
        <Box>
            <Typography variant='overline' sx={{textAlign: 'center', justifyContent: 'center'}}>
                error 404: page not found
            </Typography>
        </Box>
    );
}