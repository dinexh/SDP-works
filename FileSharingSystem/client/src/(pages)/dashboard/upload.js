import React, { useState, useCallback } from 'react';
import { FiUpload, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import UploadArea from '../../components/Upload/UploadArea';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploadPage = () => {
    const [recentUploads, setRecentUploads] = useState([]);
    
    // Callback to be passed to UploadArea to track successful uploads
    const onUploadSuccess = useCallback((fileInfo) => {
        setRecentUploads(prev => [fileInfo, ...prev].slice(0, 5)); // Keep only the 5 most recent
        toast.success(`File "${fileInfo.name}" uploaded successfully!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }, []);
    
    // Callback for when an upload fails
    const onUploadError = useCallback((error, fileName) => {
        toast.error(`Failed to upload "${fileName}": ${error}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }, []);

    return (
        <div className="dashboard-content-area">
            <div className="dashboard-page-header">
                <div className="page-header-icon">
                    <FiUpload size={24} />
                </div>
                <h1 className="page-header-title">Upload Files</h1>
                <p className="page-header-description">
                    Upload and share files with others
                </p>
            </div>
            
            <div className="upload-page-content">
                <UploadArea 
                    onUploadSuccess={onUploadSuccess}
                    onUploadError={onUploadError}
                />
                
                {recentUploads.length > 0 && (
                    <div className="recent-uploads-section">
                        <h2 className="section-title">Recently Uploaded</h2>
                        <div className="recent-uploads-list">
                            {recentUploads.map((file, index) => (
                                <div key={index} className="recent-upload-item">
                                    <div className="upload-status-icon">
                                        <FiCheckCircle size={18} color="#10b981" />
                                    </div>
                                    <div className="recent-upload-info">
                                        <div className="recent-upload-name">{file.name}</div>
                                        <div className="recent-upload-time">
                                            {new Date(file.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="upload-tips">
                    <h3 className="tips-title">
                        <FiAlertCircle size={18} className="tips-icon" />
                        Upload Tips
                    </h3>
                    <ul className="tips-list">
                        <li>Maximum file size is 25MB</li>
                        <li>Supported file types include PDF, images, documents, and more</li>
                        <li>Files are encrypted during transfer for security</li>
                        <li>You can share your files after uploading from the Files page</li>
                    </ul>
                </div>
            </div>
            
            <ToastContainer />
        </div>
    );
};

export default UploadPage; 