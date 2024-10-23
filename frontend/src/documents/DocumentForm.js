import {Box, Button, LinearProgress, Stack, styled, TextField, Typography} from '@mui/material';
import {deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import { app } from '../utilities/firebase'

const form_fields = {
    title: '',
    category: '',
    downloadUrl: '',
    uniqueFileName: '',
}

export default function DocumentForm() {
    const [formData, setFormData] = useState(form_fields);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState('default');
    const [fileName, setFileName] = useState('');
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

   /* useEffect(() => {
        async function getDocument() {
            const response = await fetch(`http://localhost:9000/api/document/document/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const _response = await response.json();
            if (response.ok) {
                const {title, category, downloadUrl, uniqueFileName} = _response.document;
                setFormData({title, category, downloadUrl, uniqueFileName});
            } else {
                console.error('Error occurred while fetching document');
            }
        }
    }, [id]);*/

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            setFileName(selectedFile.name);
            setFile(selectedFile);
        }
    };

    /*const deleteExistingFile = async (filePath) => {
        const storage = getStorage();
        const fileRef = ref(storage, filePath);
        try {
            await deleteObject(fileRef);
            console.log(`File ${filePath} deleted successfully`);
        } catch (error) {
            console.log('Failed to delete document', error);
        }
    }*/

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

                }
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
                console.error('Failed to get download URL: ', error);
                setUploading('error');

            }
        } else {
            throw new Error('No file selected');
        }

    };

    const saveToDb = async () => {

        let url = 'http://localhost:5000/api/document/new/';
        let method = 'POST';

        /*if (!newDocument) {
            url = `http://localhost:5000/api/document/update/${id}`;
            method = 'PATCH';
        }*/

        try {
            const response = await fetch(url, {
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

        if (formData.title && formData.category) {
            try {
                await uploadFileToFirebase();
                if (formData.downloadUrl) {
                    await saveToDb();
                }

            } catch (error) {
                console.error('failed to upload file or save document', error);
            }
        } else {
            console.error('All fields required!!!');
        }
    };

    useEffect(() => {
        if (uploading === 'success') {
            saveToDb();
        }
    }, [uploading]);

    console.log(formData);
    return (
        <Box sx={{p: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 5}}>
            <form onSubmit={handleSubmit}>
                <Box>
                    <Stack direction='column' spacing={3} sx={{justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                    <TextField
                        label='Title'
                        id='title'
                        name='title'
                        value={formData.title}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                title: e.target.value,
                            })
                        }}
                    />

                    <TextField
                        label='Category'
                        id='category'
                        name='category'
                        vale={formData.category}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                category: e.target.value
                            })
                        }}
                    />

                    <Box sx={{display: 'flex', alignItems: 'center', marginBottom: 3}}>
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
                        <LinearProgress />
                    </Stack>
                </Box>
            </form>
        </Box>
    );
}