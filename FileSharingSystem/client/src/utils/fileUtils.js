/**
 * Utility functions for handling files in the application
 */

/**
 * Get the direct URL for a file
 * @param {Object} file - The file object
 * @param {boolean} forDownload - Whether the URL is for downloading or viewing
 * @returns {string} The URL for the file
 */
export const getFileUrl = (file, forDownload = false) => {
    if (!file || !file.id) return '';
    
    const baseUrl = 'http://localhost:8080/api/files';
    const endpoint = 'download'; // Using download for all cases as it's most reliable
    
    return `${baseUrl}/${endpoint}/${file.id}`;
};

/**
 * Get file as blob - useful for PDF.js and other viewers
 * @param {Object} file - The file object
 * @returns {Promise<Blob>} A promise that resolves to the file blob
 */
export const getFileBlob = async (file) => {
    try {
        const url = getFileUrl(file);
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error(`Error fetching file: ${response.statusText}`);
        return await response.blob();
    } catch (error) {
        console.error('Error getting file blob:', error);
        throw error;
    }
};

/**
 * Open a file in a new tab
 * @param {Object} file - The file object
 */
export const viewFileInNewTab = (file) => {
    if (!file) return;
    // Generate a URL for viewing the file
    const url = getFileUrl(file);
    
    // For PDFs and images, we can use a more direct approach
    if (file.fileType === 'application/pdf') {
        // For PDFs, use the specialized PDF viewing endpoint
        const pdfViewUrl = `http://localhost:8080/api/files/pdf/${file.id}`;
        
        // Open in a new tab
        window.open(pdfViewUrl, '_blank');
        return;
    }
    
    // For other file types, open the raw file for download
    const token = localStorage.getItem('token');
    
    // Create a temporary hidden iframe to handle the authenticated request
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.blob())
    .then(blob => {
        // Create an object URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Open in a new tab
        window.open(blobUrl, '_blank');
    })
    .catch(error => console.error('Error viewing file:', error));
};

/**
 * Download a file
 * @param {Object} file - The file object
 */
export const downloadFile = (file) => {
    if (!file) return;
    
    const url = getFileUrl(file, true);
    const token = localStorage.getItem('token');
    
    // Use fetch with authorization header and then create a downloadable blob
    fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.blob())
    .then(blob => {
        // Create an object URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', file.originalName || file.fileName || 'download');
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        }, 100);
    })
    .catch(error => console.error('Error downloading file:', error));
};

/**
 * Check if a file can be previewed in the browser
 * @param {Object} file - The file object
 * @returns {boolean} Whether the file can be previewed
 */
export const canPreviewFile = (file) => {
    if (!file || !file.fileType) return false;
    
    const previewableTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml',
        'image/webp',
        'text/plain',
        'text/html',
        'text/csv'
    ];
    
    return previewableTypes.includes(file.fileType);
}; 