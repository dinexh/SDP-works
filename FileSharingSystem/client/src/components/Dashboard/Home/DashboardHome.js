import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiExternalLink, FiPlus, FiClock, FiStar, FiDownload, FiEye, FiFile } from 'react-icons/fi';
import StorageOverview from './StorageOverview';
import RecentFiles from './RecentFiles';
import QuickActions from './QuickActions';
import SharedFilesWidget from './SharedFilesWidget';
import './DashboardHome.css';
import { downloadFile } from '../../../utils/fileUtils';

const DashboardHome = () => {
    const [recentFiles, setRecentFiles] = useState([]);
    const [starredFiles, setStarredFiles] = useState([]);
    const [allFiles, setAllFiles] = useState([]);
    const [storage, setStorage] = useState({
        used: 0,
        total: 1000,
        fileTypes: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [viewingFile, setViewingFile] = useState(null);

    useEffect(() => {
        // Fetch recent files and storage data
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Fetch recent files
                const filesResponse = await fetch('http://localhost:8080/api/files/with-details', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (filesResponse.ok) {
                    const filesData = await filesResponse.json();
                    setAllFiles(filesData);
                    
                    // Sort files by upload date (newest first)
                    const sortedFiles = filesData.sort((a, b) => 
                        new Date(b.uploadDate) - new Date(a.uploadDate)
                    );
                    
                    // Take the 5 most recent files
                    setRecentFiles(sortedFiles.slice(0, 5));
                    
                    // Get starred files from backend
                    const starredResponse = await fetch('http://localhost:8080/api/files/starred', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    
                    if (starredResponse.ok) {
                        const starredData = await starredResponse.json();
                        setStarredFiles(starredData);
                    } else {
                        console.error('Error fetching starred files:', starredResponse.status);
                        setStarredFiles([]);
                    }
                    
                    // Calculate storage metrics
                    const usedStorage = filesData.reduce((total, file) => total + file.fileSize, 0);
                    
                    // Group files by type
                    const fileTypeMap = {};
                    filesData.forEach(file => {
                        const type = file.fileType ? file.fileType.split('/')[1] || file.fileType : 'other';
                        if (!fileTypeMap[type]) {
                            fileTypeMap[type] = {
                                type,
                                count: 0,
                                size: 0
                            };
                        }
                        fileTypeMap[type].count += 1;
                        fileTypeMap[type].size += file.fileSize;
                    });
                    
                    setStorage({
                        used: usedStorage,
                        total: 1000 * 1024 * 1024, // 1GB in bytes
                        fileTypes: Object.values(fileTypeMap)
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                // Set some sample data for demo
                const sampleFiles = [
                    { id: 1, fileName: 'project-proposal.pdf', fileType: 'application/pdf', fileSize: 2500000, uploadDate: '2023-10-15T08:30:00Z', user: { fullName: 'You' } },
                    { id: 2, fileName: 'financial-report-2023.xlsx', fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileSize: 1800000, uploadDate: '2023-10-10T14:45:00Z', user: { fullName: 'You' } },
                    { id: 3, fileName: 'team-photo.jpg', fileType: 'image/jpeg', fileSize: 3500000, uploadDate: '2023-10-05T11:20:00Z', user: { fullName: 'You' } }
                ];
                
                setRecentFiles(sampleFiles);
                setAllFiles(sampleFiles);
                setStarredFiles([]);
                
                setStorage({
                    used: 14.5 * 1024 * 1024,
                    total: 1000 * 1024 * 1024,
                    fileTypes: [
                        { type: 'pdf', count: 8, size: 4.2 * 1024 * 1024 },
                        { type: 'image', count: 15, size: 6.8 * 1024 * 1024 },
                        { type: 'document', count: 5, size: 2.1 * 1024 * 1024 },
                        { type: 'other', count: 3, size: 1.4 * 1024 * 1024 }
                    ]
                });
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchDashboardData();
    }, []);

    // Function to handle file download
    const handleDownload = (file) => {
        const fileDownloadUrl = `http://localhost:8080/api/files/download/${file.id}`;
        
        // Create an anchor element and trigger download
        const link = document.createElement('a');
        link.href = fileDownloadUrl;
        link.download = file.originalName || file.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Function to handle file viewing
    const handleViewFile = (file) => {
        // For this demo, we'll just open the file in a new tab
        const fileViewUrl = `http://localhost:8080/api/files/download/${file.id}`;
        window.open(fileViewUrl, '_blank');
    };

    // Function to get file icon based on file type
    const getFileIcon = (fileType) => {
        if (!fileType) return <FiFile size={18} />;
        
        if (fileType.includes('image')) {
            return <FiFileText size={18} style={{ color: '#8b5cf6' }} />;
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

    return (
        <div className="dashboard-home">
            <div className="dashboard-grid">
                <div className="dashboard-col dashboard-col-main">
                    <div className="dashboard-widget">
                        <div className="widget-header">
                            <h2 className="widget-title">Quick Actions</h2>
                        </div>
                        <QuickActions />
                    </div>
                    
                    <div className="dashboard-widget">
                        <div className="widget-header">
                            <h2 className="widget-title">Recent Files</h2>
                            <Link to="/dashboard/files" className="widget-link">
                                View All <FiExternalLink size={14} />
                            </Link>
                        </div>
                        
                        <RecentFiles 
                            files={recentFiles} 
                            isLoading={isLoading} 
                        />
                    </div>
                    
                    <div className="dashboard-widget">
                        <div className="widget-header">
                            <h2 className="widget-title">Shared With Me</h2>
                            <Link to="/dashboard/shared" className="widget-link">
                                View All <FiExternalLink size={14} />
                            </Link>
                        </div>
                        
                        <SharedFilesWidget />
                    </div>
                </div>
                
                <div className="dashboard-col dashboard-col-side">
                    <div className="dashboard-widget">
                        <div className="widget-header">
                            <h2 className="widget-title">Storage Overview</h2>
                        </div>
                        <StorageOverview 
                            storage={storage} 
                            isLoading={isLoading} 
                        />
                    </div>
                    
                    <div className="dashboard-widget">
                        <div className="widget-header">
                            <h2 className="widget-title">Starred Files</h2>
                            {starredFiles.length > 0 && (
                                <Link to="/dashboard/files" className="widget-link">
                                    View All <FiExternalLink size={14} />
                                </Link>
                            )}
                        </div>
                        <div className="starred-files-container">
                            {isLoading ? (
                                <div className="loading-state">
                                    <div className="loading-spinner"></div>
                                    <span>Loading starred files...</span>
                                </div>
                            ) : starredFiles.length > 0 ? (
                                <div className="starred-files-list">
                                    {starredFiles.slice(0, 3).map(file => (
                                        <div key={file.id} className="starred-file-item">
                                            <div className="starred-file-icon">
                                                {getFileIcon(file.fileType)}
                                            </div>
                                            <div className="starred-file-info">
                                                <div className="starred-file-name">{file.originalName || file.fileName}</div>
                                                <div className="starred-file-meta">
                                                    <span>{formatFileSize(file.fileSize)}</span>
                                                </div>
                                            </div>
                                            <div className="starred-file-actions">
                                                <button 
                                                    className="starred-file-action-btn" 
                                                    title="View"
                                                    onClick={() => handleViewFile(file)}
                                                >
                                                    <FiEye size={16} />
                                                </button>
                                                <button 
                                                    className="starred-file-action-btn" 
                                                    title="Download"
                                                    onClick={() => handleDownload(file)}
                                                >
                                                    <FiDownload size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <FiStar className="empty-icon" size={40} />
                                    <p>No starred files yet</p>
                                    <p className="empty-subtext">Files you star will appear here for quick access</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome; 