import React from 'react';
import SharedFiles from '../../components/Shared/SharedFiles';
import { FiShare2 } from 'react-icons/fi';

const SharedPage = () => {
    return (
        <div className="dashboard-content-area">
            <div className="dashboard-page-header">
                <div className="page-header-icon">
                    <FiShare2 size={24} />
                </div>
                <h1 className="page-header-title">Shared Files</h1>
                <p className="page-header-description">
                    Files shared with you and by you
                </p>
            </div>
            <SharedFiles />
        </div>
    );
};

export default SharedPage; 