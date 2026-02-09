import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FiFileText, FiImage, FiFile, FiDownload, FiMoreVertical } from 'react-icons/fi';
import './RecentFiles.css';

const RecentFiles = ({ files, isLoading }) => {
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
                <span>Loading recent files...</span>
            </div>
        );
    }
    
    if (!files || files.length === 0) {
        return (
            <div className="empty-state">
                <FiFileText className="empty-icon" size={40} />
                <p>No files yet</p>
                <p className="empty-subtext">Upload files to see them here</p>
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
                        <th className="file-date-header">Modified</th>
                        <th className="file-actions-header"></th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file, index) => (
                        <tr key={file.id || index} className="file-row">
                            <td className="file-name-cell">
                                <div className="file-icon">
                                    {getFileIcon(file.fileType)}
                                </div>
                                <div className="file-name">
                                    <span className="file-name-text">{file.fileName}</span>
                                    <span className="file-owner">{file.user?.fullName || 'You'}</span>
                                </div>
                            </td>
                            <td className="file-size-cell">
                                {formatFileSize(file.fileSize)}
                            </td>
                            <td className="file-date-cell">
                                {formatDate(file.uploadDate)}
                            </td>
                            <td className="file-actions-cell">
                                <div className="file-actions">
                                    <button className="file-action-button download">
                                        <FiDownload size={16} />
                                    </button>
                                    <button className="file-action-button more">
                                        <FiMoreVertical size={16} />
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

export default RecentFiles; 