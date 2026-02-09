import React from 'react';
import FilesList from '../../components/Files/FilesList';
import { FiFile } from 'react-icons/fi';

const FilesPage = () => {
    return (
        <div className="dashboard-content-area">
            <div className="dashboard-page-header">
                <div className="page-header-icon">
                    <FiFile size={24} />
                </div>
                <h1 className="page-header-title">My Files</h1>
                <p className="page-header-description">
                    View and manage all your uploaded files
                </p>
            </div>
            <FilesList />
        </div>
    );
};

export default FilesPage; 