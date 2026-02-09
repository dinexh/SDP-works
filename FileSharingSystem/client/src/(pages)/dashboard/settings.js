import React from 'react';
import SettingsPage from '../../components/Settings';
import { FiSettings } from 'react-icons/fi';

const Settings = () => {
  return (
    <div className="dashboard-content-area">
      <div className="dashboard-page-header">
        <div className="page-header-icon">
          <FiSettings size={24} />
        </div>
        <h1 className="page-header-title">Settings</h1>
        <p className="page-header-description">
          Customize your application preferences and appearance
        </p>
      </div>
      <SettingsPage />
    </div>
  );
};

export default Settings; 