import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    Stack,
    styled,
    Switch,
    TextField,
    Typography
} from '@mui/material'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {v4 as uuidv4} from "uuid";

import locations from '../utilities/locationSelect'
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const form_fields = {
    date: new Date().toISOString().split('T')[0],
    location: 'Corporate Office',
    comments: '',
    cashier: '',
    waitTime: '',
    upsell: false,
    greeting: false,
    repeatOrder: false,
    idManager: false,
    foodScore: '',
    serviceScore: '',
    cleanScore: '',
    finalScore: '',
    downloadUrl: '',
    uniqueFileName: ''
}

export default function Evaluations() {
    const [formData, setFormData] = useState(form_fields);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState('default')
    const [fileName, setFileName] = useState('')
    const [file, setFile] = useState(null);
    const {id} = useParams();


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


    const handleFieldChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFileName(selectedFile.name);
            setFile(selectedFile);
        }
    }

    const uploadFileToFirebase = async () => {
        if (file) {
            const uniqueFileName = `${uuidv4()}-${file.name}`
            const storage = getStorage()
            const storageRef = ref(storage, `uploads/${uniqueFileName}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            setUploading('uploading')

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                    console.log('upload successful')
                },
                (error) => {
                    console.error('upload failed', error);
                    setUploading('error')
                },
            );

            try {
                await uploadTask;
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                setFormData((prevForm) => ({
                    ...prevForm,
                    downloadUrl,
                    // Set the value of file stored in firebase to find and update/delete
                    uniqueFileName,
                }));
                setUploading('success');
            } catch (error) {
                console.error('Failed to get download URL:', error);
                setUploading('error');

            }
        } else {
            throw new Error('No file selected');
        }
    }

    const saveToDb = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/document/new/', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const _response = await response.json();
            if (!response.ok) {
                console.log(_response.error)
            } else {
                console.log(_response.message)
            }

        } catch (error) {
            console.log('Error saving form')
        }

    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            formData.foodScore &&
            formData.cleanScore &&
            formData.serviceScore &&
            formData.finalScore &&
            formData.date &&
            formData.location &&
            formData.cashier &&
            formData.waitTime &&
            formData.comments
        ) {
            try {
                if(file) {
                    await uploadFileToFirebase();
                }
                if(formData.downloadUrl) {
                    await saveToDb();
                }
            } catch (error) {
                console.error('failed to upload file or save document', error);
            }
        } else {
            console.error('All fields required');
        }
    };

    useEffect(() => {
        if (uploading === 'success') {
            saveToDb();
        }
    }, []);

    console.log(formData);

    return (
        <Box sx={{p: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 5}}>
            <Box component='form' onSubmit={handleSubmit}>
                <Stack direction='column' spacing={3}>
                    <TextField
                        type='date'
                        value={formData.date}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                date: e.target.value
                            })
                        }}
                    />
                    <FormControl>
                        <InputLabel>Location</InputLabel>
                        <Select
                            name='location'
                            variant='outlined'
                            label='location'
                            value={formData.location || ''}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    location: e.target.value
                                })
                            }}
                        >
                            {locations.map((location) => (
                                <MenuItem key={location} value={location}>
                                    {location}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        type='text'
                        name='cashier'
                        label='cashier'
                        value={formData.cashier}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                cashier: e.target.value
                            })
                        }}
                    />

                    <TextField
                        type='text'
                        name='comments'
                        label='comments'
                        value={formData.comments}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                comments: e.target.value
                            })
                        }}
                        multiline
                        maxRows={5}
                    />

                    <TextField
                        type='Number'
                        name='waitTime'
                        label='wait time'
                        value={formData.waitTime}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                waitTime: e.target.value
                            })
                        }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                name='greeting'
                                checked={formData.greeting}
                                onChange={handleFieldChange} />
                        }
                        label='greeting'
                    >
                    </FormControlLabel>
                    <FormControlLabel
                        control={
                            <Switch
                                name='upsell'
                                checked={formData.upsell}
                                onChange={handleFieldChange} />
                        }
                        label='upsell'
                    >
                    </FormControlLabel>
                    <FormControlLabel
                        control={
                            <Switch
                                name='repeatOrder'
                                checked={formData.repeatOrder}
                                onChange={handleFieldChange} />
                        }
                        label='repeat order'
                    >
                    </FormControlLabel>
                    <FormControlLabel
                        control={
                            <Switch
                                name='idManager'
                                checked={formData.idManager}
                                onChange={handleFieldChange} />
                        }
                        label='Identify Manager'
                    >
                    </FormControlLabel>

                    <TextField
                        type='Number'
                        name='foodScore'
                        label='food score'
                        value={formData.foodScore}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                foodScore: e.target.value
                            })
                        }}
                    />

                    <TextField
                        type='Number'
                        name='cleanScore'
                        label='clean score'
                        value={formData.cleanScore}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                cleanScore: e.target.value
                            })
                        }}
                    />

                    <TextField
                        type='Number'
                        name='serviceScore'
                        label='service score'
                        value={formData.serviceScore}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                serviceScore: e.target.value
                            })
                        }}
                    />

                    <TextField
                        type='Number'
                        name='finalScore'
                        label='final score'
                        value={formData.finalScore}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                finalScore: e.target.value
                            })
                        }}
                    />
                    <Box sx={{display: 'flex', marginBottom: 3, justifyContent: 'center'}}>
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUploadIcon/>}
                        >
                            UPLOAD
                            <VisuallyHiddenInput
                                type="file"
                                onChange={handleFileChange}
                            />
                        </Button>
                        <Typography sx={{marginLeft: 2}}>
                            {fileName}
                        </Typography>
                    </Box>
                    {uploading === "uploading" && (
                        <Box sx={{width: '100%', marginBottom: 3}}>
                            <LinearProgress variant='determinate' value={uploadProgress}/>
                        </Box>
                    )}
                    <Box>
                        <Button
                            id="submit-button"
                            variant="outlined"
                            type="submit"
                        >
                            SAVE
                        </Button>

                    </Box>


                </Stack>
            </Box>

        </Box>

    );
}