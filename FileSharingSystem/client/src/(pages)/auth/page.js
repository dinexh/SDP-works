import { useState } from 'react';
import { FiMail, FiLock, FiUser, FiCloud, FiUploadCloud, FiShare2, FiShield, FiFolder } from 'react-icons/fi';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './page.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Auth = () => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const toggleMode = () => {
        setIsSignIn(!isSignIn);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            if (isSignIn) {
                // Login
                const res = await fetch("http://localhost:8080/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    // Use the login function from AuthContext with the user data from the response
                    login({
                        email: data.email || email,
                        fullName: data.fullName || email.split('@')[0],
                        profileImageUrl: data.profileImageUrl
                    }, data.accessToken);
                    toast.success("Login successful!");
                } else {
                    const errorMessage = data.message || "Login failed";
                    setError(errorMessage);
                    toast.error(errorMessage);
                }
            } else {
                // Register
                const res = await fetch("http://localhost:8080/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fullName, email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    setIsSignIn(true);
                    toast.success("Registration successful! Please log in.");
                } else {
                    const errorMessage = data.message || "Registration failed";
                    setError(errorMessage);
                    toast.error(errorMessage);
                }
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            toast.error("Incorrect email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="auth-illustration">
                    <div className="floating-icons">
                        <div className="icon-group main">
                            <FiCloud className="icon main-icon" />
                            <FiUploadCloud className="icon upload-icon" />
                        </div>
                        <div className="icon-group secondary top">
                            <FiShare2 className="icon" />
                        </div>
                        <div className="icon-group secondary bottom-left">
                            <FiShield className="icon" />
                        </div>
                        <div className="icon-group secondary bottom-right">
                            <FiFolder className="icon" />
                        </div>
                    </div>
                    <h1 className="illustration-title">
                        Cloud Storage <br /> Made Simple
                    </h1>
                </div>
            </div>
            
            <div className="auth-right">
                <div className="auth-form-container">
                    <div className="auth-header">
                        <h1 className="auth-title">
                            {isSignIn ? "Welcome Back" : "Get Started"}
                        </h1>
                        <p className="auth-subtitle">
                            {isSignIn 
                                ? "Sign in to continue to CloudShare" 
                                : "Create your account"}
                        </p>
                    </div>

                    <div className="social-buttons">
                    </div>
                    <form className="auth-form" onSubmit={handleSubmit}>
                        {!isSignIn && (
                            <div className="form-group">
                                <div className="input-icon-wrapper">
                                    <FiUser className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="auth-input"
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <div className="input-icon-wrapper">
                                <FiMail className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="auth-input"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-icon-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="auth-input"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {isSignIn && (
                            <div className="form-extra" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                <a href="/reset-password" className="forgot-link">Forgot password?</a>
                            </div>
                        )}

                        {error && <div className="auth-error">{error}</div>}

                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? "Loading..." : isSignIn ? "Sign In" : "Create Account"}
                        </button>
                    </form>

                    <p className="toggle-text">
                        {isSignIn 
                            ? "Don't have an account? " 
                            : "Already have an account? "}
                        <button onClick={toggleMode} className="toggle-button">
                            {isSignIn ? "Sign Up" : "Sign In"}
                        </button>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Auth;