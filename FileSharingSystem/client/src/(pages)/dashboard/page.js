import React from 'react';
import Header from '../../components/Dashboard/Header';
import Sidebar from '../../components/Dashboard/Sidebar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard">
            <ToastContainer position="top-right" autoClose={3000} />
            <Header 
                userName={user?.fullName || 'User'} 
                userProfileImage={user?.profileImageUrl}
            />
            <div className="dashboard-content">
                <Sidebar />
                <div style={{ flex: 1 }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;