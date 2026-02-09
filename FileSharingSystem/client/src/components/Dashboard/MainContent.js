import React from 'react';
import './MainContent.css';

const MainContent = ({ children }) => {
    return (
        <main className="dashboard-main">
            {children}
        </main>
    );
};

export default MainContent; 