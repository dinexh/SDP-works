import './Navigation.css';
import { FiShield, FiZap } from 'react-icons/fi';
export default function Navigation({ onScrollTo }) {
     const GoToAuth = () =>
     {  
        window.location.href = "/auth";
     }
     return (
        <nav className="navbar">
            <div className="navbar-logo">
                {/* <FiUploadCloud className="logo-icon pulse-animation" /> */}
                DocuTrust   
            </div>
            <div className="navbar-links">
                <a href="#features" className="navbar-link" onClick={(e) => {
                    e.preventDefault();
                    onScrollTo('features');
                }}>
                    <FiZap className="nav-icon" />
                    <span>Features</span>
                </a>
                <a href="#security" className="navbar-link" onClick={(e) => {
                    e.preventDefault();
                    onScrollTo('security');
                }}>
                    <FiShield className="nav-icon" />
                    <span>Security</span>
                </a>
                {/* <a href="#start" className="navbar-link special">
                    <FiGift className="nav-icon" />
                    <span>Get 5GB Free</span>
                </a> */}
                <button onClick={GoToAuth} className="navbar-button">Get Started</button>
            </div>
        </nav>
    );
} 