import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Calendar, UploadCloud, BarChart3 } from 'lucide-react';

const DocumentCard = ({ doc }) => {
    // This component correctly links to the timeline or document view based on analysisType
    const linkPath = doc.analysisType === 'timeline' ? `/timeline/${doc.id}` : `/document/${doc.id}`;

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Just now';
        // Handles both Firestore Timestamps (which have a _seconds property) and ISO strings
        const date = timestamp._seconds ? new Date(timestamp._seconds * 1000) : new Date(timestamp);
        return date.toLocaleDateString();
    };

    return (
        <Link to={linkPath} className="block bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-white group-hover:text-blue-400 pr-4 line-clamp-1">{doc.fileName}</h3>
                {doc.analysisType === 'timeline' ? (
                    <span className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-purple-300 bg-purple-950/50 px-2 py-1 rounded-md">
                        <Calendar className="w-3 h-3" /> Timeline
                    </span>
                ) : (
                    <div className="flex-shrink-0 flex space-x-2 text-sm">
                        <span className="flex items-center gap-1 font-semibold text-red-400"><div className="w-2 h-2 rounded-full bg-red-500"></div>{doc.riskCounts?.red || 0}</span>
                        <span className="flex items-center gap-1 font-semibold text-amber-400"><div className="w-2 h-2 rounded-full bg-amber-500"></div>{doc.riskCounts?.orange || 0}</span>
                    </div>
                )}
            </div>
            <p className="text-slate-400 text-sm mt-2 line-clamp-2 h-10">{doc.summary}</p>
            <p className="text-slate-500 text-xs mt-4">
                {formatDate(doc.createdAt)}
            </p>
        </Link>
    );
};

export default function Dashboard() {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisType, setAnalysisType] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [documents, setDocuments] = useState([]);
    const [isLoadingDocs, setIsLoadingDocs] = useState(true);
    
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) return;
        const fetchDocuments = async () => {
            setIsLoadingDocs(true);
            try {
                const response = await axios.get(`/api/documents?userId=${currentUser.uid}`);
                setDocuments(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Failed to fetch documents:", error);
                setErrorMessage("Could not load your document history.");
                setDocuments([]);
            } finally {
                setIsLoadingDocs(false);
            }
        };
        fetchDocuments();
    }, [currentUser]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setErrorMessage('');
    };

    const handleUpload = async (type) => {
        if (!file || !currentUser) return;
        
        setIsLoading(true);
        setAnalysisType(type);
        setErrorMessage('');
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`/api/upload?userId=${currentUser.uid}&analysisType=${type}`, formData);
            
            // --- THIS IS THE FIX ---
            // This robustly handles the response structure from the backend.
            const responseData = response.data;
            const document_id = responseData.document_id;
            // The actual analysis/timeline data is in a nested 'data' object.
            const data = responseData.data; 
            
            if (!document_id || !data) {
                throw new Error("Invalid response structure from server.");
            }
            // --- END OF FIX ---
            
            setDocuments(prevDocs => [{ id: document_id, ...data }, ...prevDocs]);

            if (type === 'timeline') {
                navigate(`/timeline/${document_id}`, { state: { timeline: data.timeline, fileName: data.fileName } });
            } else {
                navigate(`/document/${document_id}`, { state: { analysis: data.fullAnalysis, fileName: data.fileName } });
            }
        } catch (error) {
            console.error("Upload failed:", error.response || error);
            setErrorMessage(error.response?.data?.detail || 'An unexpected error occurred during upload.');
        } finally {
            setIsLoading(false);
            setAnalysisType('');
            setFile(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400 mt-2">Upload a new document or review your past analyses.</p>
                </header>

                <section className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 mb-12">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <label htmlFor="file-upload" className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                            <UploadCloud className="w-10 h-10 text-slate-500 mb-2" />
                            <span className="font-semibold text-slate-300">{file ? "File Selected" : "Choose a file"}</span>
                            <span className="text-xs text-slate-400 mt-1 truncate w-full text-center px-2">{file ? file.name : "PDF or TXT"}</span>
                            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.txt" />
                        </label>
                        
                        <div className="w-full md:w-2/3">
                            <h2 className="text-xl font-bold mb-4">Choose an Action</h2>
                            <p className="text-slate-400 text-sm mb-4">Once you've selected a file, choose whether to perform a risk analysis or generate a case timeline.</p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={() => handleUpload('risk')} disabled={!file || isLoading} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {isLoading && analysisType === 'risk' ? 'Analyzing...' : <><BarChart3 className="w-5 h-5" /> Analyze Risks</>}
                                </button>
                                <button onClick={() => handleUpload('timeline')} disabled={!file || isLoading} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {isLoading && analysisType === 'timeline' ? 'Generating...' : <><Calendar className="w-5 h-5" /> Generate Timeline</>}
                                </button>
                            </div>
                            {errorMessage && <p className="text-red-400 text-sm mt-4">{errorMessage}</p>}
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-6">Document History</h2>
                    {isLoadingDocs ? (
                        <p>Loading documents...</p>
                    ) : documents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {documents.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-slate-800/50 rounded-2xl border border-slate-700">
                            <p className="text-slate-400">You haven't analyzed any documents yet.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
