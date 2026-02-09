import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiCheckCircle } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './reset-password.css';

const PasswordResetPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resetRequested, setResetRequested] = useState(false);
    const [resetComplete, setResetComplete] = useState(false);
    
    // Determine if we're in request mode or reset mode based on token
    const isResetMode = !!token;
    
    useEffect(() => {
        // If user is already logged in, redirect to dashboard
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);
    
    const handleRequestReset = async (e) => {
        e.preventDefault();
        
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }
        
        setIsLoading(true);
        
        try {
            const response = await fetch('http://localhost:8080/api/password/request-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setResetRequested(true);
                toast.success('Password reset link sent to your email');
            } else {
                toast.error(data.message || 'Failed to request password reset');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            console.error('Error requesting password reset:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (!newPassword) {
            toast.error('Please enter a new password');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        
        setIsLoading(true);
        
        try {
            const response = await fetch('http://localhost:8080/api/password/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setResetComplete(true);
                toast.success('Password reset successful');
            } else {
                toast.error(data.message || 'Failed to reset password');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            console.error('Error resetting password:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Render confirmation messages
    if (resetRequested) {
        return (
            <div className="auth-container">
                <div className="auth-form-container">
                    <div className="auth-header">
                        <h1>Check Your Email</h1>
                    </div>
                    <div className="success-message">
                        <FiCheckCircle className="success-icon" size={48} color="#3b82f6" />
                        <p>If your email exists in our system, you will receive a password reset link shortly. Please check your inbox and spam folder.</p>
                        <button 
                            className="auth-button" 
                            onClick={() => navigate('/auth')}
                        >
                            Return to Login
                        </button>
                    </div>
                </div>
                <ToastContainer />
            </div>
        );
    }
    
    if (resetComplete) {
        return (
            <div className="auth-container">
                <div className="auth-form-container">
                    <div className="auth-header">
                        <h1>Password Reset Complete</h1>
                    </div>
                    <div className="success-message">
                        <FiCheckCircle className="success-icon" size={48} color="#3b82f6" />
                        <p>Your password has been reset successfully. You can now log in with your new password.</p>
                        <button 
                            className="auth-button" 
                            onClick={() => navigate('/auth')}
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
                <ToastContainer />
            </div>
        );
    }
    
    return (
        <div className="auth-container">
            <div className="auth-form-container">
                <div className="auth-header">
                    <h1>{isResetMode ? 'Reset Your Password' : 'Forgot Password'}</h1>
                    <p>{isResetMode 
                        ? 'Enter a new password for your account' 
                        : 'Enter your email address and we\'ll send you a link to reset your password'}</p>
                </div>
                
                {isResetMode ? (
                    <form className="auth-form" onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <div className="input-icon-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    id="newPassword"
                                    type="password"
                                    placeholder="Enter new password"
                                    className="auth-input"
                                    required
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="input-icon-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                    className="auth-input"
                                    required
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <button 
                            className="auth-button" 
                            type="submit" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                ) : (
                    <form className="auth-form" onSubmit={handleRequestReset}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-icon-wrapper">
                                <FiMail className="input-icon" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="auth-input"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <button 
                            className="auth-button" 
                            type="submit" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}
                
                <div className="auth-footer">
                    <p>Remember your password? <a href="/auth">Log In</a></p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default PasswordResetPage; 