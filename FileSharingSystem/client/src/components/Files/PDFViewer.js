import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
// Import required CSS for react-pdf v9.x
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { FiDownload, FiFileText, FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import './FilesList.css';
import { getFileUrl, downloadFile, getFileBlob } from '../../utils/fileUtils';

// Configure PDF.js worker with correct extension for v9.x
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const PDFViewer = ({ file }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scale, setScale] = useState(1.0);
    const [pdfBlob, setPdfBlob] = useState(null);
    
    // Fetch the PDF blob when component mounts
    useEffect(() => {
        const fetchPdf = async () => {
            try {
                setLoading(true);
                const blob = await getFileBlob(file);
                setPdfBlob(blob);
            } catch (err) {
                console.error("Failed to fetch PDF:", err);
                setError(err);
                setLoading(false);
            }
        };
        
        fetchPdf();
    }, [file]);
    
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setLoading(false);
    };

    const onDocumentLoadError = (error) => {
        console.error("Error loading PDF document:", error);
        setError(error);
        setLoading(false);
    };
    
    const handleNextPage = () => {
        setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));
    };
    
    const handlePrevPage = () => {
        setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
    };
    
    const handleZoomIn = () => {
        setScale(prevScale => Math.min(prevScale + 0.2, 2.5));
    };
    
    const handleZoomOut = () => {
        setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
    };
    
    const handleDownload = (e) => {
        e.preventDefault();
        downloadFile(file);
    };
    
    if (error) {
        return (
            <div className="pdf-error">
                <FiFileText size={48} color="#3b82f6" />
                <p>Error loading PDF: {error.message || "Unknown error"}</p>
                <div className="pdf-error-actions">
                    <button 
                        onClick={handleDownload}
                        className="file-download-button"
                    >
                        <FiDownload /> Download PDF
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="pdf-viewer-container">
            <div className="pdf-controls">
                <div className="pdf-navigation">
                    <button 
                        onClick={handlePrevPage}
                        disabled={pageNumber <= 1}
                        className="pdf-control-btn"
                    >
                        <FiChevronLeft />
                    </button>
                    <span className="pdf-page-info">
                        {loading ? 'Loading...' : `Page ${pageNumber} of ${numPages}`}
                    </span>
                    <button 
                        onClick={handleNextPage}
                        disabled={pageNumber >= numPages || !numPages}
                        className="pdf-control-btn"
                    >
                        <FiChevronRight />
                    </button>
                </div>
                <div className="pdf-zoom-controls">
                    <button 
                        onClick={handleZoomOut}
                        className="pdf-control-btn"
                    >
                        <FiZoomOut />
                    </button>
                    <span className="pdf-zoom-level">{Math.round(scale * 100)}%</span>
                    <button 
                        onClick={handleZoomIn}
                        className="pdf-control-btn"
                    >
                        <FiZoomIn />
                    </button>
                </div>
                <button 
                    onClick={handleDownload}
                    className="file-download-button"
                >
                    <FiDownload /> Download
                </button>
            </div>
            
            <div className="pdf-document-container">
                {loading && (
                    <div className="pdf-loading">
                        <div className="pdf-loader"></div>
                        <p>Loading PDF...</p>
                    </div>
                )}
                {pdfBlob && (
                    <Document
                        file={pdfBlob}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={<div className="pdf-loading"><div className="pdf-loader"></div></div>}
                        className="pdf-document"
                    >
                        <Page 
                            pageNumber={pageNumber} 
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="pdf-page"
                        />
                    </Document>
                )}
            </div>
        </div>
    );
};

export default PDFViewer; 