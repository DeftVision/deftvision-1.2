import React from 'react';
import { Modal, Box } from '@mui/material';

function DocumentViewer({ open, document, onClose }) {
    if (!document) return null; // Add this check to prevent rendering when document is null

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', width: '80%', maxHeight: '80vh', overflowY: 'auto' }}>
                {document.type === 'pdf' ? (
                    <embed src={document.url} width="100%" height="600px" type="application/pdf" />
                ) : (
                    <img src={document.url} alt={document.title} style={{ width: '100%' }} />
                )}
            </Box>
        </Modal>
    );
}

export default DocumentViewer;

