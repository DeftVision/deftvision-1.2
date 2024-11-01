import {Box, Paper, Typography, List, ListItem, ListItemText, Button, Tab, Tabs, Modal, Stack} from '@mui/material'

export default function DocumentList({ documents, onDownload, onView }) {

    return (

            <List sx={{padding: '15px'}}>
                {documents.map((doc) => (
                    <ListItem key={doc.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <ListItemText primary={doc.title} secondary={`Uploaded: ${doc.uploadDate}`} />
                        <Button onClick={() => onView(doc)} variant="contained">View</Button>
                        <Button onClick={() => onDownload(doc.url)} variant="outlined">Download</Button>
                    </ListItem>
                ))}
            </List>

    );
}