import { Box, Button, LinearProgress, Paper, Stack, styled, TextField, Typography } from '@mui/material';
import { storage } from '../utilities/firebase'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const form_fields = {
    title: '',
    category: '',
    downloadUrl: '',
    uniqueFileName: '',
};

export default function DocumentForm({ onDocumentCreated }) {
    const [formData, setFormData] = useState(form_fields);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);  // Changed to `false`
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);

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

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFileName(selectedFile.name);
            setFile(selectedFile);
        }
    };

    const uploadFileToFirebase = async () => {
        if (!file) return; // Exit if no file is selected

        setUploading(true);  // Start upload process
        const uniqueFileName = `${uuidv4()}-${file.name}`;
        const storage = getStorage();
        const storageRef = ref(storage, `uploads/${uniqueFileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error('Upload failed', error);
                setUploading(false);
            },
            async () => {
                try {
                    const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                    setFormData((prevForm) => ({
                        ...prevForm,
                        downloadUrl,
                        uniqueFileName,
                    }));
                    setUploading(false); // Upload complete
                } catch (error) {
                    console.error('Failed to get download URL', error);
                    setUploading(false);
                }
            }
        );
    };

    const saveToDb = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/document/new/', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const _response = await response.json();
            if (response.ok) {
                onDocumentCreated();
            } else {
                console.log('Error saving document');
            }
        } catch (error) {
            console.log('Error saving form');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.title && formData.category && file) {
            await uploadFileToFirebase();
        } else {
            console.error('All fields required!');
        }
    };

    useEffect(() => {
        if (uploading === false && formData.downloadUrl) {
            saveToDb();
        }
    }, [uploading, formData.downloadUrl]);

    return (
        <Box sx={{ p: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 5 }}>
            <Paper elevation={8} width="100%" sx={{ padding: 5, maxWidth: '1200px', width: '90%' }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack direction="column" spacing={3}>
                        <TextField
                            label="Title"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <TextField
                            label="Category"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                            <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                                UPLOAD
                                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                            </Button>
                            <Typography sx={{ marginLeft: 2 }}>{fileName}</Typography>
                        </Box>
                        {uploading && (
                            <Box sx={{ width: '100%', marginBottom: 3 }}>
                                <LinearProgress variant="determinate" value={uploadProgress} />
                            </Box>
                        )}
                        <Button id="submit-button" variant="outlined" type="submit">
                            SAVE
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}
