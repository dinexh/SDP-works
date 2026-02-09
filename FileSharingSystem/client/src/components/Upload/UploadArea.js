import React, { useState, useRef, useEffect } from 'react';
import { FiUploadCloud, FiX, FiCheckCircle } from 'react-icons/fi';
import './UploadArea.css';

const UploadArea = ({ onUploadSuccess, onUploadError }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef(null);
    
    // Clean up any file display after successful upload
    useEffect(() => {
        let timer;
        if (selectedFile && selectedFile.status === 'completed') {
            timer = setTimeout(() => {
                setSelectedFile(null);
            }, 3000); // Clear the completed file after 3 seconds
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [selectedFile]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (files) => {
        // Reset any previous file state
        setUploadError('');
        
        // For simplicity, just handle the first file
        setSelectedFile({
            file: files[0],
            name: files[0].name,
            size: files[0].size,
            type: files[0].type,
            progress: 0,
            status: 'pending'
        });
        
        // Start the real upload immediately
        uploadFile(files[0]);
    };

    const uploadFile = async (file) => {
        setIsUploading(true);
        
        // Create a FormData instance
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            // Use XMLHttpRequest to track upload progress
            const xhr = new XMLHttpRequest();
            
            // Set up progress event
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    setSelectedFile(prev => ({
                        ...prev,
                        progress: percentComplete,
                        status: percentComplete === 100 ? 'processing' : 'uploading'
                    }));
                }
            });
            
            // Set up load event (when upload is complete)
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        setSelectedFile(prev => ({
                            ...prev,
                            progress: 100,
                            status: 'completed',
                            id: response.id || null
                        }));
                        
                        // Call the success callback if provided
                        if (onUploadSuccess) {
                            onUploadSuccess({
                                id: response.id,
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                timestamp: new Date().toISOString()
                            });
                        }
                    } catch (error) {
                        console.error('Error parsing response:', error);
                        setSelectedFile(prev => ({
                            ...prev,
                            progress: 100,
                            status: 'completed'
                        }));
                        
                        // Still call success callback with available data
                        if (onUploadSuccess) {
                            onUploadSuccess({
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                timestamp: new Date().toISOString()
                            });
                        }
                    }
                } else {
                    const errorMsg = `Upload failed: ${xhr.statusText}`;
                    setUploadError(errorMsg);
                    setSelectedFile(prev => ({
                        ...prev,
                        status: 'error'
                    }));
                    
                    // Call the error callback if provided
                    if (onUploadError) {
                        onUploadError(xhr.statusText, file.name);
                    }
                }
                setIsUploading(false);
            });
            
            // Set up error event
            xhr.addEventListener('error', () => {
                const errorMsg = 'Upload failed: Network error';
                setUploadError(errorMsg);
                setSelectedFile(prev => ({
                    ...prev,
                    status: 'error'
                }));
                
                // Call the error callback if provided
                if (onUploadError) {
                    onUploadError('Network error', file.name);
                }
                
                setIsUploading(false);
            });
            
            // Open and send the request
            xhr.open('POST', 'http://localhost:8080/api/files/upload');
            xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
            xhr.send(formData);
        } catch (error) {
            console.error('Upload error:', error);
            const errorMsg = 'Upload failed: ' + (error.message || 'Unknown error');
            setUploadError(errorMsg);
            setSelectedFile(prev => ({
                ...prev,
                status: 'error'
            }));
            
            // Call the error callback if provided
            if (onUploadError) {
                onUploadError(error.message || 'Unknown error', file.name);
            }
            
            setIsUploading(false);
        }
    };

    const handleUploadClick = () => {
        if (!isUploading) {
            fileInputRef.current?.click();
        }
    };

    const cancelUpload = (e) => {
        e.stopPropagation(); // Prevent triggering handleUploadClick
        setSelectedFile(null);
        setUploadError('');
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <div className="upload-container">
            {/* Drag and drop area */}
            <div 
                className={`upload-area ${isDragging ? 'drag-active' : ''} ${isUploading ? 'uploading' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={isUploading ? undefined : handleUploadClick}
            >
                {!selectedFile && (
                    <>
                        <FiUploadCloud className="upload-icon" />
                        <h2 className="upload-text">Drag a file here</h2>
                        <p className="upload-subtext">Or, if you prefer...</p>
                        <button 
                            className="upload-button" 
                            disabled={isUploading}
                        >
                            Select a file from your computer
                        </button>
                    </>
                )}
                
                {selectedFile && !uploadError && (
                    <div className="upload-progress-container">
                        <div className="upload-progress-item">
                            <div className="upload-progress-info">
                                <div className="upload-progress-filename">
                                    {selectedFile.name}
                                    {selectedFile.status === 'completed' && (
                                        <span className="upload-success-icon">
                                            <FiCheckCircle size={16} />
                                        </span>
                                    )}
                                </div>
                                <div className="upload-progress-bar-container">
                                    <div 
                                        className={`upload-progress-bar ${selectedFile.status === 'error' ? 'error' : ''} ${selectedFile.status === 'completed' ? 'completed' : ''}`}
                                        style={{ width: `${selectedFile.progress}%` }}
                                    ></div>
                                </div>
                                <div className="upload-progress-status">
                                    <span className="upload-progress-percentage">
                                        {selectedFile.status === 'processing' ? 'Processing...' : 
                                         selectedFile.status === 'completed' ? 'Complete' :
                                         selectedFile.status === 'error' ? 'Failed' :
                                         `${selectedFile.progress}%`}
                                    </span>
                                    <span className="upload-progress-filesize">{formatBytes(selectedFile.size)}</span>
                                </div>
                            </div>
                            {selectedFile.status !== 'completed' && (
                                <div className="upload-progress-actions">
                                    <button 
                                        className="upload-cancel-btn"
                                        onClick={cancelUpload}
                                    >
                                        <FiX size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                <input 
                    ref={fileInputRef}
                    type="file" 
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    disabled={isUploading}
                />
            </div>

            {/* Error message */}
            {uploadError && (
                <div className="upload-error-message">
                    {uploadError}
                </div>
            )}
        </div>
    );
};

export default UploadArea; 