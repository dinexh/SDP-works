import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FiFileText, FiImage, FiFile, FiDownload, FiEye, FiUsers } from 'react-icons/fi';
import './RecentFiles.css'; // Reuse the same styles

const SharedFilesWidget = () => {
    const [sharedFiles, setSharedFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch files shared with the user
        const fetchSharedFiles = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:8080/api/files/shared-with-me', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    // Take only the 5 most recent shared files
                    const recentSharedFiles = data.sort((a, b) => 
                        new Date(b.sharedDate) - new Date(a.sharedDate)
                    ).slice(0, 5);
                    
                    setSharedFiles(recentSharedFiles);
                } else {
                    console.error('Error fetching shared files:', response.status);
                    setSharedFiles([]);
                }
            } catch (error) {
                console.error('Error fetching shared files:', error);
                setSharedFiles([]);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchSharedFiles();
    }, []);

    // Function to get file icon based on file type
    const getFileIcon = (fileType) => {
        if (!fileType) return <FiFile size={18} />;
        
        if (fileType.includes('image')) {
            return <FiImage size={18} style={{ color: '#8b5cf6' }} />;
        } else if (fileType.includes('pdf')) {
            return <FiFileText size={18} style={{ color: '#ef4444' }} />;
        } else if (fileType.includes('word') || fileType.includes('document')) {
            return <FiFileText size={18} style={{ color: '#3b82f6' }} />;
        } else if (fileType.includes('sheet') || fileType.includes('excel')) {
            return <FiFileText size={18} style={{ color: '#10b981' }} />;
        } else {
            return <FiFile size={18} style={{ color: '#64748b' }} />;
        }
    };
    
    // Function to format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };
    
    // Function to format date as time ago
    const formatDate = (dateString) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch (error) {
            return 'Invalid date';
        }
    };

    if (isLoading) {
        return (
            <div className="loading-state">
                <div className="loading-spinner"></div>
                <span>Loading shared files...</span>
            </div>
        );
    }
    
    if (sharedFiles.length === 0) {
        return (
            <div className="empty-state">
                <FiUsers className="empty-icon" size={40} />
                <p>No shared files yet</p>
                <p className="empty-subtext">Files shared with you will appear here</p>
            </div>
        );
    }
    
    return (
        <div className="recent-files">
            <table className="files-table">
                <thead>
                    <tr>
                        <th className="file-name-header">Name</th>
                        <th className="file-size-header">Size</th>
                        <th className="file-date-header">Shared</th>
                        <th className="file-actions-header"></th>
                    </tr>
                </thead>
                <tbody>
                    {sharedFiles.map((file, index) => (
                        <tr key={file.id || index} className="file-row">
                            <td className="file-name-cell">
                                <div className="file-icon">
                                    {getFileIcon(file.fileType)}
                                </div>
                                <div className="file-name">
                                    <span className="file-name-text">{file.originalName}</span>
                                    <span className="file-owner">from {file.ownerName}</span>
                                </div>
                            </td>
                            <td className="file-size-cell">
                                {formatFileSize(file.fileSize)}
                            </td>
                            <td className="file-date-cell">
                                {formatDate(file.sharedDate)}
                            </td>
                            <td className="file-actions-cell">
                                <div className="file-actions">
                                    <Link 
                                        to={`/dashboard/shared`} 
                                        className="file-action-button view"
                                        title="View in Shared Files"
                                    >
                                        <FiEye size={16} />
                                    </Link>
                                    <button 
                                        className="file-action-button download"
                                        title="Download"
                                        onClick={() => {
                                            // This would typically call a downloadFile function
                                            window.open(`http://localhost:8080/api/files/download/${file.id}`, '_blank');
                                        }}
                                    >
                                        <FiDownload size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SharedFilesWidget; 