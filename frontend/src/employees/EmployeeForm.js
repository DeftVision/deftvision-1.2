import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Switch,
    TextField
} from '@mui/material';
import {useState} from 'react';
import { positionSelect as position, locationSelect as location } from '../utilities/index'
import { v4 as uuidv4 } from 'uuid';


const form_default = {
    employeeId: uuidv4(),
    name: '',
    location: '',
    position: '',
    isActive: true,
}

export default function EmployeeForm({onEmployeeCreated}) {
    const [formData, setFormData] = useState(form_default)

    const handleFieldChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/employee/new', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const _response = await response.json();
            console.log(_response)
            if (response.ok) {
                setFormData(form_default);
                onEmployeeCreated();
            } else {
                console.log('error saving employee', _response.message);
            }
        } catch (error) {
            console.error('submission error', error);
        }
    }

    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
            <Paper elevation={8} width='100%' sx={{padding: 5, maxWidth: '1200px', width: '90%'}}>
                <Box component='form' onSubmit={handleSubmit}>
                    <Stack direction='column' spacing={2}>
                        <input type='hidden' name='employeeId'
                                   value={formData.employeeId} onChange={handleFieldChange} />
                        <TextField type='text' name='name' id='name' label='name' value={formData.name}
                                   onChange={handleFieldChange}/>
                        <FormControl>
                            <InputLabel>location</InputLabel>
                            <Select variant='outlined'
                                    name='location'
                                    id='location'
                                    value={formData.location}
                                    onChange={handleFieldChange} label='Location' sx={{textAlign: 'start'}}>
                                {location.map((location) => (
                                    <MenuItem key={location} value={location}>
                                        {location}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel>position</InputLabel>
                            <Select variant='outlined'
                                    name='position'
                                    id='position'
                                    value={formData.position}
                                    onChange={handleFieldChange} label='position' sx={{textAlign: 'start'}}>
                                {position.map((position) => (
                                    <MenuItem key={position} value={position}>
                                        {position}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={
                            <Switch name='isActive' id='isActive' checked={formData.isActive} onChange={handleFieldChange}/>
                        }
                            label='active'/>
                        <Button type='submit' variant='outlined'>save</Button>
                    </Stack>
                </Box>

            </Paper>
        </Box>
    );


}
