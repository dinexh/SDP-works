import React, { useRef, useState } from 'react';
import './UploadBox.css';

const UploadBox = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const [buttonLoading, setButtonLoading] = useState(false);
    const fileInputRef = useRef();

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setUploadSuccess(false);
            setError('');
            setProgress(0);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setUploadSuccess(false);
            setError('');
            setProgress(0);
        }
    };

    const handleBoxClick = () => {
        if (!uploading && !uploadSuccess) {
            fileInputRef.current.click();
        }
    };

    const getFileIcon = (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
        
        const iconMap = {
            pdf: '📄',
            doc: '📝',
            docx: '📝',
            xls: '📊',
            xlsx: '📊',
            ppt: '📑',
            pptx: '📑',
            txt: '📃',
            csv: '📉',
            jpg: '🖼️',
            jpeg: '🖼️',
            png: '🖼️',
            gif: '🖼️',
            svg: '🖼️',
            mp3: '🎵',
            mp4: '🎬',
            zip: '🗜️',
            rar: '🗜️',
            exe: '⚙️',
            json: '📋',
            html: '🌐',
            css: '🎨',
            js: '📜'
        };
        
        return iconMap[extension] || '📦';
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const simulateProgress = () => {
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + Math.random() * 10;
                if (newProgress >= 95) {
                    clearInterval(interval);
                    return 95;
                }
                return newProgress;
            });
        }, 150);
        return interval;
    };

    const handleUpload = async (e) => {
        if (!file) return;
        
        // Prevent event propagation to avoid triggering file input click
        if (e) {
            e.stopPropagation();
        }
        
        setButtonLoading(true);
        setError('');
        
        // Small delay to show button loading state
        setTimeout(() => {
            setUploading(true);
            setButtonLoading(false);
            
            // Start progress simulation
            const progressInterval = simulateProgress();
            
            const formData = new FormData();
            formData.append('file', file);
            
            console.log('Uploading file:', file.name);
            
            fetch('http://localhost:8080/api/files/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                console.log('Upload response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`Upload failed with status: ${response.status}`);
                }
                
                return response.json();
            })
            .then(data => {
                console.log('Upload successful:', data);
                
                // Set progress to 100% on success
                setProgress(100);
                setTimeout(() => {
                    setUploadSuccess(true);
                    setUploading(false);
                }, 500);
            })
            .catch(err => {
                console.error('Upload error:', err);
                setError('Failed to upload file. Please try again.');
                setUploading(false);
            })
            .finally(() => {
                clearInterval(progressInterval);
            });
        }, 800); // Slightly longer delay to make the button loading state visible
    };
    
    const resetUpload = (e) => {
        if (e) {
            e.stopPropagation();
        }
        setFile(null);
        setUploadSuccess(false);
        setError('');
        setProgress(0);
    };

    return (
        <div className="upload-box-wrapper">
            <div 
                className={`upload-box ${uploading ? 'uploading' : ''} ${uploadSuccess ? 'success' : ''}`}
                onDrop={!uploading && !uploadSuccess ? handleDrop : undefined}
                onDragOver={!uploading && !uploadSuccess ? handleDragOver : undefined}
                onClick={!uploading && !uploadSuccess ? handleBoxClick : undefined}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    accept="*/*"
                />
                <div className="upload-box-content">
                    {/* Initial state - no file selected */}
                    {!file && !uploading && !uploadSuccess && (
                        <>
                            <p className="upload-title">Drag a file here</p>
                            <p className="upload-or">Or, if you prefer...</p>
                            <button
                                type="button"
                                className="upload-select-btn"
                                onClick={e => { e.stopPropagation(); handleBoxClick(); }}
                            >
                                Select a file from your computer
                            </button>
                        </>
                    )}
                    
                    {/* File selected but not yet uploading */}
                    {file && !uploading && !uploadSuccess && (
                        <>
                            <div className="upload-preview">
                                <div className="file-icon">{getFileIcon(file.name)}</div>
                                <div className="file-info">
                                    <div className="file-name">{file.name}</div>
                                    <div className="file-size">{formatFileSize(file.size)}</div>
                                </div>
                            </div>
                            
                            <button 
                                type="button"
                                className={`upload-button ${buttonLoading ? 'loading' : ''}`}
                                onClick={(e) => handleUpload(e)}
                                disabled={buttonLoading}
                            >
                                {buttonLoading ? (
                                    <span>
                                        Preparing
                                        <span className="loading-dot"></span>
                                        <span className="loading-dot"></span>
                                        <span className="loading-dot"></span>
                                    </span>
                                ) : 'Upload File'}
                            </button>
                        </>
                    )}
                    
                    {/* File is uploading */}
                    {uploading && (
                        <div className="upload-progress-container">
                            <div className="upload-preview">
                                <div className="file-icon">{getFileIcon(file.name)}</div>
                                <div className="file-info">
                                    <div className="file-name">{file.name}</div>
                                    <div className="file-size">{formatFileSize(file.size)}</div>
                                </div>
                            </div>
                            
                            <div className="upload-progress-bar">
                                <div
                                    className="upload-progress-fill"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <div className="upload-loading">
                                Uploading
                                <span className="loading-dot"></span>
                                <span className="loading-dot"></span>
                                <span className="loading-dot"></span>
                            </div>
                        </div>
                    )}
                    
                    {/* Upload success state */}
                    {uploadSuccess && !uploading && (
                        <div className="upload-success">
                            <div className="upload-success-icon">✓</div>
                            <div className="upload-success-message">File uploaded successfully!</div>
                            <button 
                                type="button"
                                className="upload-another-btn"
                                onClick={resetUpload}
                            >
                                Upload Another File
                            </button>
                        </div>
                    )}
                    
                    {/* Error message - can appear in multiple states */}
                    {error && !uploading && !uploadSuccess && (
                        <div className="upload-error-message">{error}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadBox; 