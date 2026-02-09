import React, { useState } from 'react';
import { FiX, FiMail, FiCheck, FiLink, FiCopy } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './ShareModal.css';

const ShareModal = ({ file, onClose, onShareSuccess }) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sharedWithEmails, setSharedWithEmails] = useState([]);
    const [isLoadingShares, setIsLoadingShares] = useState(true);
    
    // Load existing shares when component mounts
    React.useEffect(() => {
        if (file) {
            loadExistingShares();
        }
    }, [file]);
    
    const loadExistingShares = async () => {
        try {
            setIsLoadingShares(true);
            const response = await fetch('http://localhost:8080/api/files/shared-by-me', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                // Filter shares for this specific file
                const sharesForThisFile = data.filter(share => share.fileId === file.id);
                setSharedWithEmails(sharesForThisFile);
            }
        } catch (error) {
            console.error('Error loading shares:', error);
        } finally {
            setIsLoadingShares(false);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const response = await fetch('http://localhost:8080/api/files/share', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    fileId: file.id,
                    email: email.trim()
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                toast.success(data.message || 'File shared successfully');
                setEmail('');
                onShareSuccess && onShareSuccess();
                await loadExistingShares(); // Reload the shares
            } else {
                toast.error(data.error || 'Failed to share file');
            }
        } catch (error) {
            console.error('Error sharing file:', error);
            toast.error('An error occurred while sharing the file');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleRevokeAccess = async (recipientEmail) => {
        try {
            const response = await fetch('http://localhost:8080/api/files/share', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    fileId: file.id,
                    email: recipientEmail
                })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                toast.success('Access revoked successfully');
                await loadExistingShares(); // Reload the shares
            } else {
                toast.error(data.error || 'Failed to revoke access');
            }
        } catch (error) {
            console.error('Error revoking access:', error);
            toast.error('An error occurred while revoking access');
        }
    };
    
    const copyFileLink = () => {
        // Create a shareable link - in a real app, this would be a proper public link
        const shareableLink = `http://localhost:3000/shared/access/${file.id}`;
        navigator.clipboard.writeText(shareableLink)
            .then(() => toast.success('Link copied to clipboard'))
            .catch(() => toast.error('Failed to copy link'));
    };
    
    return (
        <div className="share-modal-overlay">
            <div className="share-modal">
                <div className="share-modal-header">
                    <h3>Share "{file?.originalName || file?.fileName}"</h3>
                    <button className="close-button" onClick={onClose}>
                        <FiX size={20} />
                    </button>
                </div>
                
                <div className="share-link-section">
                    <div className="share-link-container">
                        <FiLink size={16} />
                        <span className="share-link-text">
                            {`http://localhost:3000/shared/access/${file?.id || 'link'}`}
                        </span>
                        <button className="copy-link-button" onClick={copyFileLink}>
                            <FiCopy size={16} />
                        </button>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="share-form">
                    <div className="share-input-container">
                        <FiMail size={18} />
                        <input
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                        />
                        <button 
                            type="submit" 
                            className="share-button"
                            disabled={isSubmitting || !email}
                        >
                            {isSubmitting ? 'Sharing...' : 'Share'}
                        </button>
                    </div>
                </form>
                
                <div className="shared-with-section">
                    <h4>Shared with</h4>
                    {isLoadingShares ? (
                        <div className="loading-shares">Loading shared users...</div>
                    ) : sharedWithEmails.length > 0 ? (
                        <ul className="shared-users-list">
                            {sharedWithEmails.map((share, index) => (
                                <li key={index} className="shared-user-item">
                                    <div className="shared-user-info">
                                        <FiMail size={16} />
                                        <span>{share.sharedWithEmail}</span>
                                        {share.recipientName && (
                                            <span className="user-name">({share.recipientName})</span>
                                        )}
                                    </div>
                                    <button 
                                        className="revoke-access-button"
                                        onClick={() => handleRevokeAccess(share.sharedWithEmail)}
                                    >
                                        Revoke
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="no-shares">This file hasn't been shared with anyone yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareModal; 