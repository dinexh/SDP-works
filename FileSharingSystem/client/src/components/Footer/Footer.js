import './Footer.css';
import { FiUploadCloud } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <FiUploadCloud className="footer-logo-icon" />
                        <span>DocuTrust</span>
                    </div>
                    <p className="footer-description">
                        Secure file sharing platform for teams and individuals.
                    </p>
                </div>

                <div className="footer-links">
                    <div className="footer-section">
                        <h4 className="footer-heading">Product</h4>
                        <ul>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#security">Security</a></li>
                            <li><a href="#enterprise">Enterprise</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-heading">Support</h4>
                        <ul>
                            <li><a href="#help">Help Center</a></li>
                            <li><a href="mailto:support@cloudshare.com">Email Support</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p className="copyright">
                    © {new Date().getFullYear()} CloudShare. All rights reserved.
                </p>
                <div className="legal-links">
                    <a href="#privacy">Privacy</a>
                    <a href="#terms">Terms</a>
                </div>
            </div>
        </footer>
    );
} 