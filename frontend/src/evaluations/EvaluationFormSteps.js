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
    styled,
    Switch,
    TextField,
    LinearProgress,
    Typography
} from '@mui/material';
import dateTimeConfiguration from '../utilities/dateTimeConfiguration'
import {deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {v4 as uuidv4} from 'uuid';
import location from '../utilities/locationSelect'
import {useTheme} from "@mui/material/styles";


const form_defaults = {
    userId: '',
    date: dateTimeConfiguration(),
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

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});



export default function EvaluationForm({ triggerRefresh }) {
    const userId = localStorage.getItem('userId')
    const [formData, setFormData] = useState(form_defaults);
    const [currentStep, setCurrentStep] = useState(0);
    const [completed, setCompleted] = useState({});
    const steps = ['Basic Info', 'Interaction', 'Scores', 'Final Details'];
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState('default');
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);


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

    const handleComplete = async (e) => {
        e.preventDefault();
        try {
            setCompleted((prevCompleted) => ({
                ...prevCompleted,
                [currentStep]: true,
            }))
            handleNext();
                if (file) {
                    if (formData.uniqueFileName) {
                        await deleteExistingFile(`uploads/${formData.uniqueFileName}`);
                    }
                    await uploadFileToFirebase();
                } else {
                    await saveToDb();
                }

        } catch (error) {
            console.log('Failed to upload file or save evaluation', 'error');
        }
    }


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFileName(selectedFile.name);
            setFile(selectedFile);
        }
    }

    const deleteExistingFile = async (filePath) => {
        const storage = getStorage();
        const fileRef = ref(storage, filePath);
        try {
            await deleteObject(fileRef);
            console.log(`File ${filePath} deleted successfully`);
        } catch (error) {
            console.log('Failed to delete evaluation', error);
        }
    }

    const uploadFileToFirebase = async () => {
        if (file) {
            const uniqueFileName = `${uuidv4()}-${file.name}`
            const storage = getStorage();
            const storageRef = ref(storage, `uploads/${uniqueFileName}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            setUploading('uploading');

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error('upload failed', error);
                    setUploading('error');
                    console.log('Upload failed', error);
                },
                async () => {
                    try {
                        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        setFormData((prevForm) => ({
                            ...prevForm,
                            downloadUrl,
                            uniqueFileName,
                        }));
                        setUploading('success');
                        console.log('Upload successfully', 'success');
                    } catch (error) {
                        setUploading('error');
                        console.log('Failed to get download URL', 'error');
                    }
                }
            );
        } else {
            throw new Error('No file selected');
        }
    };
    console.log(formData);

    const saveToDb = async () => {
        setFormData((prevData) => ({
            ...prevData,
            userId: userId || prevData.userId
        }))

        try {
            const response = await fetch('http://localhost:5000/api/evaluation/new/', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const _response = await response.json();
            if (!response.ok) {
                console.log(_response.message || 'Error saving form', 'error')
            } else {
                console.log(_response.message, 'success');
            }

        } catch (error) {
            console.log('Error saving form', 'error');
        }
    };



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
                        <TextField name='finalScore' label='Final Score' type='text' disabled value={formData.finalScore} readOnly />
                    </Stack>
                );
            case 3:
                return (
                   <Stack spacing={2}>
                       <TextField name='comments' label='Comments' multiline maxRows={4} value={formData.comments} onChange={handleFieldChange} />
                       <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                           Upload File
                           <VisuallyHiddenInput type="file" hidden onChange={handleFileChange} />
                       </Button>
                       <Typography>
                           {fileName}
                       </Typography>
                       {uploading === 'uploading' && (
                           <Box sx={{ width: '100%', marginTop: 2 }}>
                               <LinearProgress variant="determinate" value={uploadProgress} />
                           </Box>)}
                   </Stack>
                );
            default:
                return null;
        }
    }

    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
            <Paper elevation={8} width='100%' sx={{padding: 5, maxWidth: '1200px', width: '90%'}}>
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
        </Box>
    );


}