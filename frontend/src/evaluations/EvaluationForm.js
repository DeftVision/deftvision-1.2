// TODO: update the URL when the data table is built
// TODO: find which field isn't being populated preventing form submission
// TODO: align image name with upload button
// TODO: fix form submission / upload to firebase


import { Alert, Box, Button, FormControl, FormControlLabel, LinearProgress, InputLabel, MenuItem, Select, Stack, styled, Switch, TextField, Typography, } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import {v4 as uuidv4} from 'uuid';

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


export default function EvaluationForm() {
    const [evaluationData, setEvaluationData] = useState({
        foodScore: '',
        cleanScore: '',
        serviceScore: '',
        finalScore: '',
        location: '',
        comments: '',
        cashier: '',
        upsell: false,
        greeting: false,
        repeatOrder: false,
        idManager: false,
        date: '',
        waitTime: '',
        imageUrl: null
    })
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState('default');
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const {id} = useParams()
    const navigate = useNavigate();

    const handleFieldChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEvaluationData((prevData) => ({
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
            const storageRef = ref(storage, `evaluation/${uniqueFileName}`);
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

                },
                async () => {
                    try {
                        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        evaluationData((prevForm) => ({
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

    const saveToDb = async () => {

        let url = 'http://localhost:5000/api/evaluation/new/';
        let method = 'POST';

        /*if (!newEvaluation) {
            url = `http://localhost:9000/api/evaluation/update/${id}`;
            method = 'PATCH';
        }
*/
        try {
            const response = await fetch(url, {
                method: method,
                body: JSON.stringify(evaluationData),
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')


        const { foodScore, cleanScore, serviceScore, finalScore, location, comments, cashier, waitTime, date, downloadUrl, uniqueFileName  } = evaluationData;
        // validation to ensure fields aren't empty
        if (!foodScore || !cleanScore || !serviceScore || !finalScore || !location || !comments || !cashier || !waitTime || !date || !downloadUrl || !uniqueFileName) {
            setError('Please fill out all required fields.');
            return;
        }

        try {

            const formData = new FormData();
            Object.keys(evaluationData).forEach(key => {
                formData.append(key, evaluationData[key])
            })

            const token = localStorage.getItem('token');
            if(!token) {
                setError('User not authenticated, please log in.')
                return;
            }

            const userId = localStorage.getItem('userId');
            if(!userId) {
                setError('User ID not found')
                return;
            }

            const response = await fetch('http://localhost:5000/api/evaluation/new', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    formData,
                }),
            });

            const data = await response.json();

            if(response.ok) {
                setSuccess('evaluation submitted successfully');
                navigate('/dashboard')
            } else {
                setError(data.error || 'Submission failed. Try again.');
            }
        } catch (error) {
            setError('An error occurred. Try again.');
        }
    };

    useEffect(() => {
        if (uploading === 'success') {
            saveToDb();
        }
    }, [uploading])


    return (
        <Box component='form' onSubmit={handleSubmit} sx={{padding: 3, marginTop: 5}}>
            <Stack direction='column' spacing={2}>
                <Typography variant='overline' sx={{fontSize: '2rem', marginBottom: 2}}>
                    submit evaluation
                </Typography>
                {/* Error and Success Alerts */}
                {error && (
                    <Alert severity="error" sx={{marginBottom: 2}}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{marginBottom: 2}}>
                        {success}
                    </Alert>
                )}

                <TextField
                    type='date'
                    name='date'
                    value={evaluationData.date}
                    onChange={handleFieldChange}
                    fullWidth={true}
                    margin='none'
                    inputlabelprops={{shrink: true}}
                    required
                />
                <FormControl required>
                    <InputLabel>Location</InputLabel>
                    <Select
                        name="location"
                        label="location"
                        variant="outlined"
                        fullWidth={true}
                        margin="none"
                        value={evaluationData.location}
                        onChange={handleFieldChange}
                    >
                        <MenuItem value="Sandy">Sandy</MenuItem>
                        <MenuItem value="Draper">Draper</MenuItem>
                        <MenuItem value="Bountiful">Bountiful</MenuItem>
                        <MenuItem value="Logan">Logan</MenuItem>
                        <MenuItem value="Riverdale">Riverdale</MenuItem>
                        <MenuItem value="Jordan Landing">Jordan Landing</MenuItem>
                        <MenuItem value="Murray">Murray</MenuItem>
                        <MenuItem value="Layton">Layton</MenuItem>
                        <MenuItem value="Orem">Orem</MenuItem>
                        <MenuItem value="Lehi">Lehi</MenuItem>
                        <MenuItem value="Provo">Provo</MenuItem>
                        <MenuItem value="Spanish Fork">Spanish Fork</MenuItem>
                        <MenuItem value="East Mesa">East Mesa</MenuItem>
                        <MenuItem value="Mesa">Mesa</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    type='text'
                    name='cashier'
                    label='cashier'
                    value={evaluationData.cashier}
                    onChange={handleFieldChange}
                    fullWidth={true}
                    margin='none'
                    required
                />
                <TextField
                    type='text'
                    name='comments'
                    label='comments'
                    value={evaluationData.comments}
                    onChange={handleFieldChange}
                    multiline
                    maxRows={5}
                    fullWidth={true}
                    margin='none'
                    required
                />
                <TextField
                    type='Number'
                    name='waitTime'
                    label='wait time'
                    value={evaluationData.waitTime}
                    onChange={handleFieldChange}
                    fullWidth={true}
                    margin='none'
                    required
                />
                <FormControlLabel
                    control={<Switch
                        name='greeting'
                        checked={evaluationData.greeting} onChange={handleFieldChange}/>}
                    label='greeting'
                >
                </FormControlLabel>
                <FormControlLabel
                    control={<Switch
                        name='upsell'
                        checked={evaluationData.upsell} onChange={handleFieldChange}/>}
                    label='upsell'
                >
                </FormControlLabel>
                <FormControlLabel
                    control={<Switch
                        name='repeatOrder'
                        checked={evaluationData.repeatOrder} onChange={handleFieldChange}/>}
                    label='repeat order'
                >
                </FormControlLabel>
                <FormControlLabel
                    control={<Switch
                        name='idManager'
                        checked={evaluationData.idManager} onChange={handleFieldChange}/>}
                    label='ID Manager'
                >
                </FormControlLabel>
                <TextField
                    type='Number'
                    name='foodScore'
                    label='food score'
                    value={evaluationData.foodScore}
                    onChange={handleFieldChange}
                    fullWidth={true}
                    margin='none'
                    required
                />
                <TextField
                    type='Number'
                    name='serviceScore'
                    label='service score'
                    value={evaluationData.serviceScore}
                    onChange={handleFieldChange}
                    fullWidth={true}
                    margin='none'
                    required
                />
                <TextField
                    type='Number'
                    name='cleanScore'
                    label='clean score'
                    value={evaluationData.cleanScore}
                    onChange={handleFieldChange}
                    fullWidth={true}
                    margin='none'
                    required
                />
                <TextField
                    type='Number'
                    name='finalScore'
                    label='final Score'
                    value={evaluationData.finalScore}
                    onChange={handleFieldChange}
                    fullWidth={true}
                    margin='none'
                    required
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


                <Button variant='contained' onClick={handleSubmit}>
                    save
                </Button>
                <Button variant='contained' component={Link} to='/home'>
                    cancel
                </Button>
            </Stack>
        </Box>
    );
}