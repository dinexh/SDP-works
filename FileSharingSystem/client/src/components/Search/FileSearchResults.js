import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FiFileText, FiImage, FiFile, FiDownload, FiEye, FiStar, FiTrash2, FiFilter } from 'react-icons/fi';
import './FileSearchResults.css';
import { downloadFile } from '../../utils/fileUtils';

const FileSearchResults = ({ results, isLoading, onClose }) => {
    const [activeFilter, setActiveFilter] = useState('all');
    
    // Get unique file types from results
    const getUniqueTypes = () => {
        const types = results.map(file => {
            if (!file.fileType) return 'other';
            
            if (file.fileType.includes('pdf')) return 'pdf';
            if (file.fileType.includes('image')) return 'image';
            if (file.fileType.includes('word')) return 'document';
            if (file.fileType.includes('sheet') || file.fileType.includes('excel')) return 'spreadsheet';
            return 'other';
        });
        
        return ['all', ...new Set(types)];
    };
    
    // Filter results by type
    const getFilteredResults = () => {
        if (activeFilter === 'all') return results;
        
        return results.filter(file => {
            if (!file.fileType) return activeFilter === 'other';
            
            switch (activeFilter) {
                case 'pdf':
                    return file.fileType.includes('pdf');
                case 'image':
                    return file.fileType.includes('image');
                case 'document':
                    return file.fileType.includes('word') || file.fileType.includes('document');
                case 'spreadsheet':
                    return file.fileType.includes('sheet') || file.fileType.includes('excel');
                case 'other':
                    return !file.fileType.includes('pdf') && 
                           !file.fileType.includes('image') && 
                           !file.fileType.includes('word') && 
                           !file.fileType.includes('document') && 
                           !file.fileType.includes('sheet') && 
                           !file.fileType.includes('excel');
                default:
                    return true;
            }
        });
    };
    
    // Get display name for file type
    const getTypeDisplayName = (type) => {
        switch (type) {
            case 'all': return 'All';
            case 'pdf': return 'PDF';
            case 'image': return 'Images';
            case 'document': return 'Documents';
            case 'spreadsheet': return 'Spreadsheets';
            case 'other': return 'Other';
            default: return type.charAt(0).toUpperCase() + type.slice(1);
        }
    };

    if (isLoading) {
        return (
            <div className="search-results-container">
                <div className="search-results-loading">
                    <div className="search-spinner"></div>
                    <span>Searching files...</span>
                </div>
            </div>
        );
    }

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

    const handleFileClick = (file) => {
        // Close the search results when a file is clicked
        onClose();
        
        // Navigate to the file (you could also implement preview here)
        window.location.href = `/dashboard/files?selected=${file.id}`;
    };

    const handleDownload = (e, file) => {
        e.stopPropagation(); // Prevent the file click event
        downloadFile(file);
    };

    const handleView = (e, file) => {
        e.stopPropagation(); // Prevent the file click event
        window.open(`http://localhost:8080/api/files/pdf/${file.id}`, '_blank');
    };

    if (results.length === 0) {
        return (
            <div className="search-results-container">
                <div className="search-results-empty">
                    <FiFile size={40} className="search-empty-icon" />
                    <p>No matching files found</p>
                    <p className="search-subtext">Try different keywords or check your files</p>
                </div>
            </div>
        );
    }
    
    const uniqueTypes = getUniqueTypes();
    const filteredResults = getFilteredResults();

    return (
        <div className="search-results-container">
            <div className="search-results-header">
                <div className="search-results-title">Search Results</div>
                <div className="search-results-count">{results.length} files found</div>
            </div>
            
            {uniqueTypes.length > 1 && (
                <div className="search-filter-bar">
                    <div className="filter-label">
                        <FiFilter size={14} /> Filter by type:
                    </div>
                    <div className="filter-options">
                        {uniqueTypes.map(type => (
                            <button
                                key={type}
                                className={`filter-option ${activeFilter === type ? 'active' : ''}`}
                                onClick={() => setActiveFilter(type)}
                            >
                                {getTypeDisplayName(type)}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="search-results-list">
                {filteredResults.map((file) => (
                    <div 
                        key={file.id} 
                        className="search-result-item"
                        onClick={() => handleFileClick(file)}
                    >
                        <div className="search-result-icon">
                            {getFileIcon(file.fileType)}
                        </div>
                        <div className="search-result-details">
                            <div className="search-result-name">{file.fileName || file.originalName}</div>
                            <div className="search-result-meta">
                                <span className="search-result-size">{formatFileSize(file.fileSize)}</span>
                                <span className="search-result-separator">•</span>
                                <span className="search-result-modified">{formatDate(file.uploadDate || file.sharedDate)}</span>
                                {file.isStarred && (
                                    <>
                                        <span className="search-result-separator">•</span>
                                        <span className="search-result-starred">
                                            <FiStar size={12} /> Starred
                                        </span>
                                    </>
                                )}
                                {file.isShared && (
                                    <>
                                        <span className="search-result-separator">•</span>
                                        <span className="search-result-shared">
                                            Shared by {file.ownerName || 'Owner'}
                                        </span>
                                    </>
                                )}
                                {file.isOwned && !file.isShared && (
                                    <>
                                        <span className="search-result-separator">•</span>
                                        <span className="search-result-owned">
                                            Owned by you
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="search-result-actions">
                            <button 
                                className="search-action-button view"
                                onClick={(e) => handleView(e, file)}
                                title="View"
                            >
                                <FiEye size={16} />
                            </button>
                            <button 
                                className="search-action-button download"
                                onClick={(e) => handleDownload(e, file)}
                                title="Download"
                            >
                                <FiDownload size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileSearchResults; 