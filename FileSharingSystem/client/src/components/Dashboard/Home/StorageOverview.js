import React from 'react';
import { FiHardDrive } from 'react-icons/fi';
import './StorageOverview.css';

const StorageOverview = ({ storage, isLoading }) => {
    // Convert bytes to readable format
    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    };
    
    // Calculate percentage
    const calculatePercentage = () => {
        if (storage.total === 0) return 0;
        return Math.min(100, Math.round((storage.used / storage.total) * 100));
    };
    
    const percentage = calculatePercentage();
    
    if (isLoading) {
        return (
            <div className="loading-state">
                <div className="loading-spinner"></div>
                <span>Loading storage data...</span>
            </div>
        );
    }
    
    return (
        <div className="storage-overview">
            <div className="storage-usage">
                <div className="storage-circle-container">
                    <div className="storage-circle">
                        <div 
                            className="storage-circle-fill"
                            style={{ 
                                background: `conic-gradient(#3b82f6 ${percentage * 3.6}deg, #e2e8f0 0deg)` 
                            }}
                        >
                            <div className="storage-circle-center">
                                <FiHardDrive size={24} />
                                <span className="storage-percentage">{percentage}%</span>
                                <span className="storage-percentage-used">used</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="storage-details">
                    <div className="storage-detail-item">
                        <span className="storage-detail-label">Used</span>
                        <span className="storage-detail-value">{formatBytes(storage.used)}</span>
                    </div>
                    <div className="storage-detail-item">
                        <span className="storage-detail-label">Free</span>
                        <span className="storage-detail-value">{formatBytes(storage.total - storage.used)}</span>
                    </div>
                    <div className="storage-detail-item">
                        <span className="storage-detail-label">Total</span>
                        <span className="storage-detail-value">{formatBytes(storage.total)}</span>
                    </div>
                </div>
            </div>
            
            {storage.fileTypes && storage.fileTypes.length > 0 && (
                <div className="storage-by-type">
                    <h3 className="storage-section-title">Storage by file type</h3>
                    
                    {storage.fileTypes.map((fileType, index) => (
                        <div key={index} className="file-type-item">
                            <div className="file-type-info">
                                <span className="file-type-name">{fileType.type}</span>
                                <span className="file-type-count">{fileType.count} files</span>
                            </div>
                            <div className="file-type-size">
                                {formatBytes(fileType.size)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StorageOverview; 