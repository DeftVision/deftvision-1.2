import { Box, Typography } from '@mui/material'
import { DocumentCategoryTabs, DocumentList, DocumentViewer  } from '../documents/index';
import { useState, useEffect } from 'react';

export default function DocumentUserViewer() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/document/documents');
                const data = await response.json();
                setCategories(data);
                if (data.length > 0) setSelectedCategory(data[0].name); // Default to the first category
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleViewDocument = (doc) => {
        setSelectedDocument(doc);
        setViewerOpen(true);
    };

    const handleDownloadDocument = (url) => {
        window.open(url, '_blank');
    };


    return (
        <Box>
            <Typography variant="overline" color="textSecondary">Document User View</Typography>
        </Box>
    );
}