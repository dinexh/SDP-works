import React, { useState, useEffect } from 'react';
import { 
    FiMoon, 
    FiSun, 
    FiGlobe, 
    FiBell, 
    FiTrash2, 
    FiUser, 
    FiEye
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import './SettingsPage.css';

const SettingsPage = () => {
    const { theme, toggleTheme } = useTheme();
    const [language, setLanguage] = useState('english');
    const [notifications, setNotifications] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'english';
        setLanguage(savedLanguage);
        
        // Fetch notification preferences from the server
        fetchNotificationPreferences();
    }, []);
    
    const fetchNotificationPreferences = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/users/notifications', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.enabled);
                localStorage.setItem('notifications', data.enabled);
            } else {
                // If we can't fetch from server, use local storage as fallback
                const notifSetting = localStorage.getItem('notifications');
                setNotifications(notifSetting === null ? true : notifSetting === 'true');
            }
        } catch (error) {
            console.error('Error fetching notification preferences:', error);
            // Use local storage as fallback
            const notifSetting = localStorage.getItem('notifications');
            setNotifications(notifSetting === null ? true : notifSetting === 'true');
        }
    };

    const handleThemeChange = (newTheme) => {
        toggleTheme(newTheme);
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        localStorage.setItem('language', e.target.value);
    };

    const handleNotificationToggle = async () => {
        const newNotificationState = !notifications;
        
        // Update local state and localStorage immediately for better UX
        setNotifications(newNotificationState);
        localStorage.setItem('notifications', newNotificationState);
        
        // Then update server
        try {
            const response = await fetch('http://localhost:8080/api/users/notifications', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ enabled: newNotificationState })
            });
            
            if (response.ok) {
                toast.success(`Email notifications ${newNotificationState ? 'enabled' : 'disabled'}`);
            } else {
                // If server update fails, revert to original state
                const data = await response.json();
                toast.error(data.error || 'Failed to update notification preferences');
                setNotifications(!newNotificationState);
                localStorage.setItem('notifications', !newNotificationState);
            }
        } catch (error) {
            console.error('Error updating notification preferences:', error);
            toast.error('Failed to update notification preferences');
            // Revert to original state
            setNotifications(!newNotificationState);
            localStorage.setItem('notifications', !newNotificationState);
        }
    };

    const handleDeleteAccountClick = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setConfirmText('');
    };

    const confirmDeleteAccount = async () => {
        if (confirmText !== 'DELETE') {
            return;
        }
        
        setIsLoading(true);
        
        try {
            const response = await fetch('http://localhost:8080/api/users/account', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            // Parse response regardless of status
            let data;
            try {
                data = await response.json();
            } catch (e) {
                // If response is not JSON
                data = { error: 'Unknown server error' };
            }
            
            if (response.ok) {
                toast.success('Account deleted successfully');
                // Clear local storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Redirect to login page
                setTimeout(() => {
                    window.location.href = '/auth';
                }, 1500);
            } else {
                let errorMessage = 'Failed to delete account';
                
                // Check for specific errors
                if (data.error && data.error.includes("foreign key constraint fails")) {
                    errorMessage = "Cannot delete account: You have files or shared content that need to be removed first. Please contact an administrator.";
                } else if (data.error) {
                    errorMessage = data.error;
                }
                
                toast.error(errorMessage);
                setIsLoading(false);
                setIsDeleteModalOpen(false);
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('An error occurred while deleting your account. Please try again later.');
            setIsLoading(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className="settings-container">
            {/* Theme Settings */}
            <div className="settings-section">
                <h2><FiEye /> Appearance</h2>
                <div className="settings-content">
                    <div className="theme-selector">
                        <button 
                            className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('light')}
                        >
                            <FiSun />
                            <span>Light Mode</span>
                        </button>
                        <button 
                            className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('dark')}
                        >
                            <FiMoon />
                            <span>Dark Mode</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Language and Notification Settings Grid */}
            <div className="settings-grid">
                {/* Notification Settings */}
                <div className="settings-section">
                    <h2><FiBell /> Notifications</h2>
                    <div className="settings-content">
                        <div className="notification-setting">
                            <div className="notification-details">
                                <div className="notification-icon">
                                    <FiBell />
                                </div>
                                <div>
                                    <h3>Email Notifications</h3>
                                    <p>Receive emails for file shares, comments, and system updates</p>
                                </div>
                            </div>
                            <label className="toggle-switch">
                                <input 
                                    type="checkbox" 
                                    checked={notifications} 
                                    onChange={handleNotificationToggle}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Settings */}
            <div className="settings-section">
                <h2><FiUser /> Account</h2>
                <div className="settings-content">
                    <div className="danger-zone">
                        <h3>Danger Zone</h3>
                        <button 
                            className="delete-account-btn" 
                            onClick={handleDeleteAccountClick}
                        >
                            <FiTrash2 />
                            <span>Delete Account</span>
                        </button>
                        <p className="warning-text">
                            This action cannot be undone. All your files and data will be permanently deleted.
                        </p>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h2>Delete Account</h2>
                        </div>
                        <div className="modal-content">
                            <div className="warning-icon">
                                <FiTrash2 />
                            </div>
                            <p className="modal-text">
                                Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your files and data.
                            </p>
                            <div className="confirmation-input">
                                <label>Type "DELETE" to confirm:</label>
                                <input 
                                    type="text" 
                                    placeholder="DELETE" 
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    autoFocus
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={closeDeleteModal}>
                                Cancel
                            </button>
                            <button 
                                className={`confirm-delete-btn ${isLoading ? 'loading' : ''}`} 
                                onClick={confirmDeleteAccount}
                                disabled={isLoading || confirmText !== 'DELETE'}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loader"></span>
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    "Delete Account"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage; 