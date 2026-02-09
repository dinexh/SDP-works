import React from 'react';
import DashboardHome from '../../components/Dashboard/Home/DashboardHome';
import { FiHome } from 'react-icons/fi';

const HomePage = () => {
    return (
        <div className="dashboard-content-area">
            <div className="dashboard-page-header">
                <div className="page-header-icon">
                    <FiHome size={24} />
                </div>
                <h1 className="page-header-title">Dashboard</h1>
                <p className="page-header-description">
                    Overview of your storage, files and recent activity
                </p>
            </div>
            
            <DashboardHome />
        </div>
    );
};

export default HomePage; 