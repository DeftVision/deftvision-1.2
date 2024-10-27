import {useState} from 'react';
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
    Step,
    StepButton,
    Stepper,
    Switch,
    TextField
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import location from '../utilities/locationSelect'

const form_defaults = {
    date: new Date().toISOString().slice(0, 16),
    location: '',
    cashier: '',
    waitTime: '',
    upsell: false,
    greeting: false,
    repeatOrder: false,
    idManager: false,
    foodScore: '',
    cleanScore: '',
    serviceScore: '',
    finalScore: '',
    comments: '',
    downloadUrl: '',
    uniqueFileName: ''

}


export default function EvaluationForm() {
    const [formData, setFormData] = useState(form_defaults);
    const [currentStep, setCurrentStep] = useState(0);
    const [completed, setCompleted] = useState({});

    const steps = ['Basic Info', 'Interaction', 'Scores', 'Final Details'];

    const handleFieldChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: type === 'checkbox' ? checked : value,
            };

            if (['foodScore', 'serviceScore', 'cleanScore'].includes(name)) {
                const food = parseFloat(updatedData.foodScore) || 0;
                const clean = parseFloat(updatedData.cleanScore) || 0;
                const service = parseFloat(updatedData.serviceScore) || 0;

                updatedData.finalScore = ((food + service + clean) / 3).toFixed(1);
            }
            return updatedData;
        })
    };

    const handleStep = (step) => () => {
        setCurrentStep(step);
    }

    const handleNext = () => {
        setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }

    const handleBack = () => {
        setCurrentStep((prev) => (prev > 0 ? prev - 1: prev));
    };

    const handleComplete = () => {
        setCompleted((prevCompleted) => ({
            ...prevCompleted,
            [currentStep]: true,
        }))
        handleNext();
    }

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Stack spacing={2}>
                        <TextField type='datetime-local' name='date' label='Date' value={formData.date} onChange={handleFieldChange} />
                        <FormControl>
                            <InputLabel>Location</InputLabel>
                            <Select variant='outlined' name='location' value={formData.location} onChange={handleFieldChange} label='Location' sx={{textAlign: 'start'}}>
                                {location.map((location) => (
                                    <MenuItem key={location} value={location}>
                                        {location}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControlLabel control={<Switch name='greeting' checked={formData.greeting} onChange={handleFieldChange} />} label='Greeting' />
                    </Stack>
                );
            case 1:
                return (
                    <Stack spacing={2}>
                        <TextField name='cashier' label='Cashier' value={formData.cashier} onChange={handleFieldChange} />
                        <TextField name='waitTime' label='waiting time (minutes)' type='number' value={formData.waitTime} onChange={handleFieldChange} />
                        <FormControlLabel control={<Switch name='upsell' checked={formData.upsell} onChange={handleFieldChange} />} label='Upsell' />
                        <FormControlLabel control={<Switch name='repeatOrder' checked={formData.repeatOrder} onChange={handleFieldChange}/>} label='Order Repeated' />
                        <FormControlLabel control={<Switch name='idManager' checked={formData.idManager} onChange={handleFieldChange}/>} label='Identified Manager' />
                    </Stack>
                );
            case 2:
                return (
                    <Stack spacing={2}>
                        <TextField name='foodScore' label='Food Score' type='number' value={formData.foodScore} onChange={handleFieldChange} />
                        <TextField name='cleanScore' label='Clean Score' type='number' value={formData.cleanScore} onChange={handleFieldChange} />
                        <TextField name='serviceScore' label='Service Score' type='number' value={formData.serviceScore} onChange={handleFieldChange} />
                        <TextField name='finalScore' label='Final Score' type='number' value={formData.finalScore} readOnly />
                    </Stack>
                );
            case 3:
                return (
                   <Stack spacing={2}>
                       <TextField name='comments' label='Comments' multiline maxRows={4} value={formData.comments} onChange={handleFieldChange} />
                       <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                           Upload File
                           <input type="file" hidden onChange={(e) => console.log("File Upload")} />
                       </Button>
                   </Stack>
                );
            default:
                return null;
        }
    }

    return (
        <Paper sx={{ padding: 4, maxWidth: '600px', margin: 'auto'}}>
            <Stepper nonLinear activeStep={currentStep} sx={{marginBottom: 4}}>
                {steps.map((label, index) => (
                    <Step key={label} completed={completed[index]}>
                        <StepButton color='inherit' onClick={handleStep(index)}>
                            {label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            <form>
                {getStepContent(currentStep)}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2}}>
                    <Button onClick={handleBack} disabled={currentStep === 0}>Back</Button>
                    {currentStep < steps.length -1 ? (
                        <Button onClick={handleNext}>Next</Button>
                    ) : (
                        <Button onClick={handleComplete}>Save</Button>
                    )}
                </Box>
            </form>
        </Paper>
    );


}