import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const DocumentCard = ({ doc }) => (
    <Link 
        to={`/document/${doc.id}`} 
        className="block bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 group"
    >
        <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors truncate mr-4">
                {doc.fileName}
            </h3>
            <div className="flex space-x-2 text-sm flex-shrink-0">
                <span className="flex items-center gap-1.5 font-semibold text-red-400 bg-red-950/50 px-2 py-1 rounded-md">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    {doc.riskCounts?.red || 0}
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-amber-400 bg-amber-950/50 px-2 py-1 rounded-md">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    {doc.riskCounts?.orange || 0}
                </span>
            </div>
        </div>
        <p className="text-slate-400 text-sm mt-2 line-clamp-2">
            {doc.summary || "Document analysis available"}
        </p>
        <p className="text-slate-500 text-xs mt-4">
            {doc.createdAt?._seconds 
                ? new Date(doc.createdAt._seconds * 1000).toLocaleDateString()
                : new Date(doc.createdAt).toLocaleDateString()
            }
        </p>
    </Link>
);

export default function Dashboard() {
    const { currentUser } = useAuth(); // Get the logged-in user
    const navigate = useNavigate();
    
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [documents, setDocuments] = useState([]);
    const [isLoadingDocs, setIsLoadingDocs] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            // Redirect to auth page if user is not logged in
            navigate('/auth');
            return;
        }
        
        const fetchDocuments = async () => {
            try {
                setIsLoadingDocs(true);
                // Use the REAL user ID from the auth context
                const response = await axios.get(`http://localhost:8000/api/documents?userId=${currentUser.uid}`);
                // Handle both response formats
                const docs = response.data.documents || response.data || [];
                setDocuments(docs);
            } catch (error) {
                console.error("Failed to fetch documents:", error);
                // Don't show error for document history - just log it
            } finally {
                setIsLoadingDocs(false);
            }
        };
        
        fetchDocuments();
    }, [currentUser, navigate]); // Re-run when the user logs in

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setErrorMessage(''); // Clear previous errors when a new file is selected
    };

    const handleUpload = async () => {
        if (!file || !currentUser) return; // Check for user
        setIsLoading(true);
        setErrorMessage('');
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Pass the REAL user ID to the upload endpoint
            const response = await axios.post(
                `http://localhost:8000/api/upload?userId=${currentUser.uid}`, 
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            
            // Navigate with state for instant view, history will update on next load
            navigate(`/document/${response.data.document_id}`, { 
                state: { analysis: response.data.analysis } 
            });
        } catch (error) {
            console.error('Upload failed:', error);
            
            // Enhanced error handling
            if (error.response) {
                switch (error.response.status) {
                    case 503:
                        setErrorMessage('Analysis Failed: The AI couldn\'t process this document. It might be too complex or poorly formatted. Please try another file.');
                        break;
                    case 415:
                        setErrorMessage('Unsupported File Type: Please upload a PDF or text file.');
                        break;
                    case 400:
                        setErrorMessage('Invalid Document: The file appears to be empty or corrupted. Please try another file.');
                        break;
                    case 413:
                        setErrorMessage('File Too Large: Please upload a smaller document.');
                        break;
                    default:
                        setErrorMessage('Upload Failed: An unexpected error occurred. Please try again.');
                }
            } else if (error.request) {
                setErrorMessage('Connection Failed: Please check your internet connection and try again.');
            } else {
                setErrorMessage('Upload Failed: An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const refreshDocuments = async () => {
        if (!currentUser) return;
        
        try {
            const response = await axios.get(`http://localhost:8000/api/documents?userId=${currentUser.uid}`);
            const docs = response.data.documents || response.data || [];
            setDocuments(docs);
        } catch (error) {
            console.error("Failed to refresh documents:", error);
        }
    };

    // Show loading state while checking authentication
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-slate-400">Checking authentication...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">LexiLens Dashboard</h1>
                    <p className="text-slate-400">Upload a new document or review your past analyses.</p>
                    <p className="text-slate-500 text-sm mt-2">Welcome back, {currentUser.email}!</p>
                </header>

                {/* Upload Section */}
                <section className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 mb-12 max-w-2xl mx-auto">
                    <h2 className="text-xl font-semibold mb-6 text-center">Upload New Document</h2>
                    
                    <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                        <input 
                            type="file" 
                            className="hidden" 
                            id="file-upload" 
                            onChange={handleFileChange} 
                            accept=".txt,.pdf" 
                        />
                        <label htmlFor="file-upload" className="text-center p-4 w-full h-full flex flex-col items-center justify-center">
                            {file ? (
                                <div className="text-center">
                                    <svg className="mx-auto h-12 w-12 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-green-400 font-semibold">{file.name}</p>
                                    <p className="text-slate-500 text-sm mt-1">Click to change file</p>
                                </div>
                            ) : (
                                <div>
                                    <svg className="mx-auto h-12 w-12 text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="text-slate-400 mb-1">Drag & drop or click to upload</p>
                                    <p className="text-slate-500 text-sm">PDF or TXT files only</p>
                                </div>
                            )}
                        </label>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="mt-4 p-3 text-center bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    {/* Upload Button */}
                    <button
                        onClick={handleUpload}
                        disabled={!file || isLoading}
                        className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing...
                            </div>
                        ) : 'Analyze Document'}
                    </button>
                </section>

                {/* Document History Section */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Document History</h2>
                        <button 
                            onClick={refreshDocuments}
                            className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                        >
                            Refresh
                        </button>
                    </div>
                    
                    {isLoadingDocs ? (
                        <div className="text-center py-12 bg-slate-800/50 rounded-2xl">
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin h-8 w-8 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="ml-2 text-slate-400">Loading documents...</span>
                            </div>
                        </div>
                    ) : documents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {documents.map(doc => (
                                <DocumentCard key={doc.id} doc={doc} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-slate-700">
                            <svg className="mx-auto h-16 w-16 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-slate-400 text-lg mb-2">No documents yet</p>
                            <p className="text-slate-500">Upload your first document to get started with legal analysis.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}