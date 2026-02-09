import React from 'react';
import { Link } from 'react-router-dom';
import { FiUpload, FiFolder, FiShare2, FiSearch } from 'react-icons/fi';
import './QuickActions.css';

const QuickActions = () => {
    const actions = [
        {
            icon: <FiUpload />,
            label: 'Upload File',
            color: '#3b82f6',
            path: '/dashboard/upload'
        },
        {
            icon: <FiFolder />,
            label: 'View All Files',
            color: '#10b981',
            path: '/dashboard/files'
        },
        {
            icon: <FiShare2 />,
            label: 'Share Files',
            color: '#f59e0b',
            path: '/dashboard/shared'
        },
        {
            icon: <FiSearch />,
            label: 'Search Files',
            color: '#8b5cf6',
            path: '/dashboard/files'
        }
    ];

    return (
        <div className="quick-actions">
            {actions.map((action, index) => (
                <Link 
                    key={index} 
                    to={action.path}
                    className="quick-action-item"
                >
                    <div 
                        className="quick-action-icon" 
                        style={{ 
                            backgroundColor: `${action.color}15`,
                            color: action.color 
                        }}
                    >
                        {action.icon}
                    </div>
                    <span className="quick-action-label">{action.label}</span>
                </Link>
            ))}
        </div>
    );
};

export default QuickActions; 