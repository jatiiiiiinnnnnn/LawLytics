import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State to hold our error message
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrorMessage(''); // Clear previous errors when a new file is selected
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    setErrorMessage(''); // Clear previous errors on new upload
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/document/${response.data.document_id}`, { state: { analysis: response.data.analysis } });
    } catch (error) {
      console.error('Upload failed:', error);
      // --- NEW ERROR HANDLING LOGIC ---
      if (error.response && error.response.status === 503) {
        // This is our specific "AI failed" error
        setErrorMessage('Analysis Failed: The AI couldn\'t process this document. It might be too complex or poorly formatted. Please try another file.');
      } else {
        // This is for all other errors (network issues, server crashes, etc.)
        setErrorMessage('Upload Failed: An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-slate-900 text-white">
      <h1 className="text-4xl font-bold text-gray-100 mb-2">LexiLens Dashboard</h1>
      <p className="text-gray-400 mb-8">Upload a document (.txt or .pdf) to get started.</p>
      
      <div className="w-full max-w-lg bg-slate-800 p-8 border border-slate-700 rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700">
          <input type="file" className="hidden" id="file-upload" onChange={handleFileChange} accept=".txt,.pdf" />
          <label htmlFor="file-upload" className="text-center p-4">
            {file ? (
              <p className="text-green-400 font-semibold">{file.name}</p>
            ) : (
              <div>
                <svg className="mx-auto h-12 w-12 text-slate-500" /* ... SVG icon ... */ ></svg>
                <p className="text-slate-400">Drag & drop or click to upload</p>
              </div>
            )}
          </label>
        </div>

        {/* Display the error message right above the button if it exists */}
        {errorMessage && (
            <div className="mt-4 p-3 text-center bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
                <p>{errorMessage}</p>
            </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-600 transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Document'}
        </button>
      </div>
    </div>
  );
}