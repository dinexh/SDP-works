import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import defaultAvatar from '../../assets/default-avatar.svg';
import './Header.css';
import { FiLogOut, FiUser, FiChevronDown, FiSearch, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import FileSearchResults from '../Search/FileSearchResults';

const Header = ({ userName, userProfileImage }) => {
    const { logout } = useAuth();
    const { theme } = useTheme();
    const [showMenu, setShowMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [allFiles, setAllFiles] = useState([]);
    const searchContainerRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    useEffect(() => {
        // Fetch all files when component mounts
        const fetchAllFiles = async () => {
            try {
                // Fetch user's files
                const filesResponse = await fetch('http://localhost:8080/api/files/with-details', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                // Fetch shared files
                const sharedResponse = await fetch('http://localhost:8080/api/files/shared-with-me', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                let combinedFiles = [];
                
                if (filesResponse.ok) {
                    const filesData = await filesResponse.json();
                    // Mark files as owned
                    const ownedFiles = filesData.map(file => ({
                        ...file,
                        isOwned: true
                    }));
                    combinedFiles = [...ownedFiles];
                }
                
                if (sharedResponse.ok) {
                    const sharedData = await sharedResponse.json();
                    // Mark files as shared
                    const sharedFiles = sharedData.map(file => ({
                        ...file,
                        isShared: true
                    }));
                    combinedFiles = [...combinedFiles, ...sharedFiles];
                }
                
                setAllFiles(combinedFiles);
            } catch (error) {
                console.error('Error fetching files for search:', error);
            }
        };
        
        fetchAllFiles();
        
        // Add click event listener to close search results when clicked outside
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        
        // Clean up
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const handleProfileClick = () => {
        setShowMenu(!showMenu);
    };

    const handleLogout = () => {
        logout();
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        // Don't search if query is empty
        if (!query.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }
        
        // Debounce search to avoid too many searches while typing
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        setIsSearching(true);
        setShowResults(true);
        
        searchTimeoutRef.current = setTimeout(() => {
            searchFiles(query);
        }, 300);
    };

    const searchFiles = (query) => {
        // Convert query to lowercase for case-insensitive search
        const lowercaseQuery = query.toLowerCase();
        
        // Filter files based on query
        const results = allFiles.filter(file => {
            const filenameMatch = (file.fileName && file.fileName.toLowerCase().includes(lowercaseQuery)) || 
                                  (file.originalName && file.originalName.toLowerCase().includes(lowercaseQuery));
            const typeMatch = file.fileType && file.fileType.toLowerCase().includes(lowercaseQuery);
            const ownerMatch = file.user && file.user.fullName && 
                              file.user.fullName.toLowerCase().includes(lowercaseQuery);
            const ownerNameMatch = file.ownerName && file.ownerName.toLowerCase().includes(lowercaseQuery);
            
            return filenameMatch || typeMatch || ownerMatch || ownerNameMatch;
        });
        
        setSearchResults(results);
        setIsSearching(false);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowResults(false);
    };

    const handleSearchFocus = () => {
        if (searchQuery.trim()) {
            setShowResults(true);
        }
    };

    // Function to get server URL for profile images
    const getProfileImageUrl = (url) => {
        if (!url) return defaultAvatar;
        
        // If it's a full URL (http://) use it directly
        if (url.startsWith('http')) {
            return url;
        }
        
        // If it's an API path, use the backend URL
        if (url.startsWith('/api/')) {
            return `http://localhost:8080${url}`;
        }
        
        // Fallback to default avatar
        return defaultAvatar;
    };

    return (
        <header className="dashboard-header">
            <div className="header-content">
                <div className="header-left">
                    <div className="search-container" ref={searchContainerRef}>
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search files..."
                            className="search-input"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={handleSearchFocus}
                        />
                        {searchQuery && (
                            <button className="search-clear-button" onClick={clearSearch}>
                                <FiX size={16} />
                            </button>
                        )}
                        
                        {showResults && (
                            <FileSearchResults
                                results={searchResults}
                                isLoading={isSearching}
                                onClose={() => setShowResults(false)}
                            />
                        )}
                    </div>
                </div>
                
                <div className="header-right">
                    <div className="user-profile-container">
                        <div className="user-profile" onClick={handleProfileClick}>
                            <span className="user-name">{userName}</span>
                            <div className="profile-image-container">
                                <img 
                                    src={getProfileImageUrl(userProfileImage)} 
                                    alt="Profile" 
                                    className="profile-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = defaultAvatar;
                                    }}
                                />
                            </div>
                            <FiChevronDown className="profile-caret" />
                        </div>
                        
                        {showMenu && (
                            <div className={`profile-dropdown ${showMenu ? 'show' : ''}`}>
                                <Link to="/dashboard/profile" className="dropdown-item">
                                    <FiUser />
                                    <span>Profile</span>
                                </Link>
                                <div className="dropdown-divider"></div>
                                <div className="dropdown-item danger" onClick={handleLogout}>
                                    <FiLogOut />
                                    <span>Logout</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 