import React, { useState, useEffect } from 'react';
import './FileActivityChart.css';

const FileActivityChart = ({ isLoading }) => {
    const [activeView, setActiveView] = useState('week');
    const [chartData, setChartData] = useState([]);
    
    useEffect(() => {
        // Generate sample data for the chart
        generateChartData(activeView);
    }, [activeView]);
    
    const generateChartData = (view) => {
        // This is dummy data for demonstration
        let data = [];
        
        if (view === 'week') {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            data = days.map(day => ({
                label: day,
                uploads: Math.floor(Math.random() * 6),
                downloads: Math.floor(Math.random() * 8)
            }));
        } else if (view === 'month') {
            // Generate data for last 30 days (grouped by week)
            const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            data = weeks.map(week => ({
                label: week,
                uploads: Math.floor(Math.random() * 15) + 5,
                downloads: Math.floor(Math.random() * 20) + 10
            }));
        } else if (view === 'year') {
            // Generate data for last 12 months
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            data = months.map(month => ({
                label: month,
                uploads: Math.floor(Math.random() * 50) + 20,
                downloads: Math.floor(Math.random() * 70) + 30
            }));
        }
        
        setChartData(data);
    };
    
    // Find the max value to scale the chart properly
    const maxValue = chartData.reduce((max, item) => {
        const itemMax = Math.max(item.uploads, item.downloads);
        return itemMax > max ? itemMax : max;
    }, 0);
    
    if (isLoading) {
        return (
            <div className="loading-state">
                <div className="loading-spinner"></div>
                <span>Loading activity data...</span>
            </div>
        );
    }
    
    return (
        <div className="file-activity-chart">
            <div className="chart-controls">
                <div className="chart-tabs">
                    <button 
                        className={`chart-tab ${activeView === 'week' ? 'active' : ''}`}
                        onClick={() => setActiveView('week')}
                    >
                        Week
                    </button>
                    <button 
                        className={`chart-tab ${activeView === 'month' ? 'active' : ''}`}
                        onClick={() => setActiveView('month')}
                    >
                        Month
                    </button>
                    <button 
                        className={`chart-tab ${activeView === 'year' ? 'active' : ''}`}
                        onClick={() => setActiveView('year')}
                    >
                        Year
                    </button>
                </div>
            </div>
            
            <div className="chart-container">
                <div className="chart-legend">
                    <div className="legend-item">
                        <div className="legend-color upload-color"></div>
                        <span>Uploads</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color download-color"></div>
                        <span>Downloads</span>
                    </div>
                </div>
                
                <div className="chart-bars">
                    {chartData.map((item, index) => (
                        <div key={index} className="chart-bar-group">
                            <div className="chart-label">{item.label}</div>
                            <div className="chart-bars-container">
                                <div 
                                    className="chart-bar upload-bar"
                                    style={{ 
                                        height: `${maxValue ? (item.uploads / maxValue) * 100 : 0}%`,
                                        opacity: item.uploads === 0 ? 0.3 : 1
                                    }}
                                >
                                    <span className="bar-value">{item.uploads}</span>
                                </div>
                                <div 
                                    className="chart-bar download-bar"
                                    style={{ 
                                        height: `${maxValue ? (item.downloads / maxValue) * 100 : 0}%`,
                                        opacity: item.downloads === 0 ? 0.3 : 1
                                    }}
                                >
                                    <span className="bar-value">{item.downloads}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FileActivityChart; 