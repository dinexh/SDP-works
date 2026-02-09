import './page.css';
import Navigation from '../../components/Navigation/Navigation';
import Footer from '../../components/Footer/Footer';
import { FiUploadCloud, FiLock, FiFolder, FiUsers, FiBarChart2, FiRefreshCw, FiArrowRight, FiKey, FiShield } from 'react-icons/fi';

export default function Home() {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const GoToAuth = () => {    
        window.location.href = "/auth";
    }

    return (
        <div className="home">
            <Navigation onScrollTo={scrollToSection} />
            
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge animate-up">
                        <FiUploadCloud className="badge-icon" />
                        <span>Trusted by 1M+ users worldwide</span>
                    </div>
                    <h1 className="hero-title animate-up">
                        Share Files with 
                        <span className="gradient-text"> Lightning Speed</span>
                    </h1>
                    <p className="hero-description animate-up delay-1">
                        Experience the future of file sharing. Drag, drop, and share in seconds.
                        Military-grade encryption meets user-friendly design.
                    </p>
                    <div className="hero-buttons animate-up delay-2">
                        <button className="hero-button primary">
                            <FiUploadCloud className="button-icon"  onClick={GoToAuth}/>
                            Start Uploading
                        </button>
                        <button className="hero-button secondary">
                            See How It Works
                            <FiArrowRight className="button-icon" />
                        </button>
                    </div>
                </div>
                <div className="hero-stats animate-up delay-3">
                    <div className="stat-card">
                        <div className="stat-icon">🚀</div>
                        <span className="stat-number">10M+</span>
                        <span className="stat-label">Files Shared</span>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🔒</div>
                        <span className="stat-number">99.9%</span>
                        <span className="stat-label">Secure</span>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⚡</div>
                        <span className="stat-number">5TB</span>
                        <span className="stat-label">Storage</span>
                    </div>
                </div>
            </section>

            <section id="features" className="features-section">
                <div className="section-header">
                    <h2 className="section-title">Everything You Need</h2>
                    <p className="section-subtitle">Powerful features to make file sharing a breeze</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <FiLock className="feature-icon" />
                        </div>
                        <h3 className="feature-title">Bank-Level Security</h3>
                        <p className="feature-description">
                            End-to-end encryption and customizable access controls keep your files safe
                        </p>
                        <a href="#learn-more" className="feature-link">
                            Learn more <FiArrowRight />
                        </a>
                    </div>
                    <div className="feature-card highlight">
                        <div className="feature-icon-wrapper">
                            <FiFolder className="feature-icon" />
                        </div>
                        <div className="feature-badge">Most Popular</div>
                        <h3 className="feature-title">Smart Organization</h3>
                        <p className="feature-description">
                            AI-powered file organization with smart tags and search
                        </p>
                        <a href="#learn-more" className="feature-link">
                            Learn more <FiArrowRight />
                        </a>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <FiUsers className="feature-icon" />
                        </div>
                        <h3 className="feature-title">Team Collaboration</h3>
                        <p className="feature-description">
                            Real-time collaboration with comments and version control
                        </p>
                        <a href="#learn-more" className="feature-link">
                            Learn more <FiArrowRight />
                        </a>
                    </div>
                </div>
            </section>

            <section id="security" className="security-section">
                <div className="section-header">
                    <h2 className="section-title">Enterprise-Grade Security</h2>
                    <p className="section-subtitle">Your data's safety is our top priority</p>
                </div>
                <div className="security-grid">
                    <div className="security-content">
                        <div className="security-feature">
                            <div className="security-icon-wrapper">
                                <FiLock className="security-icon" />
                            </div>
                            <div className="security-text">
                                <h3>End-to-End Encryption</h3>
                                <p>Your files are encrypted in transit and at rest using AES-256 encryption</p>
                            </div>
                        </div>
                        <div className="security-feature">
                            <div className="security-icon-wrapper">
                                <FiKey className="security-icon" />
                            </div>
                            <div className="security-text">
                                <h3>Access Control</h3>
                                <p>Set granular permissions and expiring links for shared files</p>
                            </div>
                        </div>
                        <div className="security-feature">
                            <div className="security-icon-wrapper">
                                <FiShield className="security-icon" />
                            </div>
                            <div className="security-text">
                                <h3>Compliance</h3>
                                <p>GDPR, HIPAA, and SOC 2 Type II compliant infrastructure</p>
                            </div>
                        </div>
                    </div>
                    <div className="security-visual">
                        <div className="security-card">
                            <div className="security-card-header">
                                <FiShield className="card-icon" />
                                <span>Security Status</span>
                            </div>
                            <div className="security-card-content">
                                <div className="security-status">
                                    <span className="status-dot active"></span>
                                    <span>All Systems Operational</span>
                                </div>
                                <div className="security-metrics">
                                    <div className="metric">
                                        <span className="metric-label">Uptime</span>
                                        <span className="metric-value">99.99%</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-label">Threats Blocked</span>
                                        <span className="metric-value">1M+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="cta-content">
                    <h2 className="cta-title">Ready to Get Started?</h2>
                    <p className="cta-description">
                        Join millions of users who trust CloudShare for their file sharing needs
                    </p>
                    <button className="cta-button">
                        Start Free Trial
                        <FiArrowRight className="button-icon" />
                    </button>
                </div>
                <div className="cta-stats">
                    <div className="trust-badge">
                        <span className="trust-score">4.9</span>
                        <div className="trust-stars">⭐⭐⭐⭐⭐</div>
                        <span className="trust-reviews">from 10,000+ reviews</span>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}