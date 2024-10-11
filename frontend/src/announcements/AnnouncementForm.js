import { Box, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'



const form_default = {
    name: '',
    priority: '',
    audience: '',
    publish: false,
    subject: '',
    content: '',
}


export default function AnnouncementForm() {
    const [formData, setFormData] = useState(form_default)

    const handleChange = async (e) => {
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if(!formData.name || !formData.priority || !formData.audience || !formData.subject || !formData.content) {}
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <Box sx={{justifyContent: 'center', alignItems: 'center', marginTop: 3, marginBottom: 4}}>
            <Stack direction='column' spacing={3} sx={{marginTop: 4}}>
                <Typography variant="overline" sx={{fontSize: '1rem'}}>Announcement Form</Typography>
            </Stack>
            <Box
                component='form'
                onSubmit={handleSubmit}
                noValidate sx={{marginTop: 4}}
            >
                <Stack direction='column' spacing={3}>
                    <TextField
                        type='text'
                        label='Name'
                        value={formData.name}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                name: e.target.value,
                            })
                        }}
                    />
                    <TextField
                        type='text'
                        label='Priority'
                    />

                    <FormControl>
                        <InputLabel id='audience'>Audience</InputLabel>
                        <Select
                            name='audience'
                            variant='outlined'
                            label='Audience'
                            value={formData.audience}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    audience: e.target.value,
                                })
                            }}
                        >
                            <MenuItem value='All'>All</MenuItem>
                            <MenuItem value='General Manager'>General Manager</MenuItem>
                            <MenuItem value='Shopper'>Shopper</MenuItem>
                            <MenuItem value='Admin'>Admin</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControlLabel
                    control={<Switch
                        name='publish'
                    />}
                    label='Publish'>

                    </FormControlLabel>
                    <TextField
                        type='text'
                        label='Subject'


                    />
                    <TextField
                        type='text'
                        label='Content'
                        multiline
                        maxRows={8}


                    />

                    <Stack direction='row' spacing={2} sx={{justifyContent: 'center', alignItems: 'center'}}>
                        <Button variant='outlined'>cancel</Button>
                        <Button variant='outlined'>save</Button>
                    </Stack>

                </Stack>
            </Box>
        </Box>
    );
}