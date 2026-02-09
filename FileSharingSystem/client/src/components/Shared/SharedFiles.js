import React, { useState, useEffect } from 'react';
import { FiFileText, FiUsers, FiUserCheck, FiDownload, FiEye, FiShare2, FiLink, FiCopy } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { downloadFile, viewFileInNewTab } from '../../utils/fileUtils';
import './SharedFiles.css';

const SharedFiles = () => {
    const [activeTab, setActiveTab] = useState('with-me');
    const [sharedWithMe, setSharedWithMe] = useState([]);
    const [sharedByMe, setSharedByMe] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadSharedFiles();
    }, [activeTab]);

    const loadSharedFiles = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            let endpoint = activeTab === 'with-me' ? 'shared-with-me' : 'shared-by-me';
            const response = await fetch(`http://localhost:8080/api/files/${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error fetching shared files: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (activeTab === 'with-me') {
                setSharedWithMe(data);
            } else {
                setSharedByMe(data);
            }
        } catch (err) {
            console.error('Error loading shared files:', err);
            setError('Failed to load shared files. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileType) => {
        const iconMap = {
            'application/pdf': '📄',
            'application/msword': '📝',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
            'application/vnd.ms-excel': '📊',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
            'application/vnd.ms-powerpoint': '📑',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📑',
            'text/plain': '📃',
            'text/csv': '📉',
            'image/jpeg': '🖼️',
            'image/png': '🖼️',
            'image/gif': '🖼️',
            'image/svg+xml': '🖼️',
            'audio/mpeg': '🎵',
            'video/mp4': '🎬',
            'application/zip': '🗜️',
            'application/x-rar-compressed': '🗜️',
            'application/x-msdownload': '⚙️',
            'application/json': '📋',
            'text/html': '🌐',
            'text/css': '🎨',
            'application/javascript': '📜'
        };
        
        return iconMap[fileType] || '📦';
    };

    const handleDownload = (file) => {
        downloadFile(file);
    };

    const handleView = (file) => {
        if (file.fileType === 'application/pdf') {
            const pdfViewUrl = `http://localhost:8080/api/files/pdf/${file.id}`;
            const token = localStorage.getItem('token');
            const url = `${pdfViewUrl}?token=${encodeURIComponent(token)}`;
            window.open(url, '_blank');
        } else {
            viewFileInNewTab(file);
        }
    };

    const handleUnshare = async (file) => {
        if (!window.confirm(`Are you sure you want to stop sharing this file with ${file.sharedWithEmail}?`)) {
            return;
        }
        
        try {
            const response = await fetch('http://localhost:8080/api/files/share', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    fileId: file.fileId,
                    email: file.sharedWithEmail
                })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                toast.success('Sharing revoked successfully');
                loadSharedFiles(); // Reload the files
            } else {
                toast.error(data.error || 'Failed to revoke access');
            }
        } catch (error) {
            console.error('Error revoking access:', error);
            toast.error('An error occurred while revoking access');
        }
    };

    const copyShareLink = (fileId) => {
        const shareableLink = `http://localhost:3000/shared/access/${fileId}`;
        navigator.clipboard.writeText(shareableLink)
            .then(() => toast.success('Link copied to clipboard'))
            .catch(() => toast.error('Failed to copy link'));
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="shared-loading">
                    <div className="shared-loader"></div>
                    <p>Loading shared files...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="shared-error">
                    <p>{error}</p>
                    <button onClick={loadSharedFiles} className="retry-button">
                        Try Again
                    </button>
                </div>
            );
        }

        if (activeTab === 'with-me') {
            if (sharedWithMe.length === 0) {
                return (
                    <div className="empty-state">
                        <FiFileText className="empty-icon" size={48} />
                        <h3>No files shared with you</h3>
                        <p>Files shared with you will appear here</p>
                    </div>
                );
            }

            return (
                <div className="shared-files-table-container">
                    <table className="shared-files-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>File Name</th>
                                <th>Size</th>
                                <th>Shared By</th>
                                <th>Shared On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sharedWithMe.map((file) => (
                                <tr key={file.id}>
                                    <td className="file-type-cell">
                                        <span className="file-icon">{getFileIcon(file.fileType)}</span>
                                    </td>
                                    <td className="file-name-cell">
                                        <span className="file-name">{file.originalName}</span>
                                    </td>
                                    <td>{formatFileSize(file.fileSize)}</td>
                                    <td>{file.ownerName}</td>
                                    <td>{formatDate(file.sharedDate)}</td>
                                    <td className="actions-cell">
                                        <button 
                                            className="file-action-btn view" 
                                            title="View file"
                                            onClick={() => handleView(file)}
                                        >
                                            <FiEye />
                                        </button>
                                        <button 
                                            className="file-action-btn download" 
                                            title="Download"
                                            onClick={() => handleDownload(file)}
                                        >
                                            <FiDownload />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        } else {
            if (sharedByMe.length === 0) {
                return (
                    <div className="empty-state">
                        <FiFileText className="empty-icon" size={48} />
                        <h3>No files shared by you</h3>
                        <p>Files you share with others will appear here</p>
                    </div>
                );
            }

            return (
                <div className="shared-files-table-container">
                    <table className="shared-files-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>File Name</th>
                                <th>Size</th>
                                <th>Shared With</th>
                                <th>Shared On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sharedByMe.map((share, index) => (
                                <tr key={index}>
                                    <td className="file-type-cell">
                                        <span className="file-icon">{getFileIcon(share.fileType)}</span>
                                    </td>
                                    <td className="file-name-cell">
                                        <span className="file-name">{share.originalName}</span>
                                    </td>
                                    <td>{formatFileSize(share.fileSize)}</td>
                                    <td>{share.sharedWithEmail}</td>
                                    <td>{formatDate(share.sharedDate)}</td>
                                    <td className="actions-cell">
                                        <button 
                                            className="file-action-btn copy-link" 
                                            title="Copy share link"
                                            onClick={() => copyShareLink(share.fileId)}
                                        >
                                            <FiLink />
                                        </button>
                                        <button 
                                            className="file-action-btn unshare" 
                                            title="Stop sharing"
                                            onClick={() => handleUnshare(share)}
                                        >
                                            <FiShare2 style={{ transform: 'rotate(180deg)' }} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
    };

    return (
        <div className="shared-files-container">
            <div className="shared-tabs">
                <button 
                    className={`shared-tab ${activeTab === 'with-me' ? 'active' : ''}`}
                    onClick={() => setActiveTab('with-me')}
                >
                    <FiUsers className="tab-icon" />
                    <span>Shared with me</span>
                </button>
                <button 
                    className={`shared-tab ${activeTab === 'by-me' ? 'active' : ''}`}
                    onClick={() => setActiveTab('by-me')}
                >
                    <FiUserCheck className="tab-icon" />
                    <span>Shared by me</span>
                </button>
            </div>

            <div className="shared-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default SharedFiles; 