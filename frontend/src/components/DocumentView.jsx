import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

// Enhanced color map with better contrast and modern styling
const riskColorMap = {
  Red: 'bg-red-50 border-l-4 border-red-500 text-red-900',
  Orange: 'bg-amber-50 border-l-4 border-amber-500 text-amber-900',
  Green: 'bg-emerald-50 border-l-4 border-emerald-500 text-emerald-900',
  Gray: 'bg-slate-50 border-l-4 border-slate-400 text-slate-700',
};

const darkRiskColorMap = {
  Red: 'bg-red-950/50 border-l-4 border-red-400 text-red-100',
  Orange: 'bg-amber-950/50 border-l-4 border-amber-400 text-amber-100',
  Green: 'bg-emerald-950/50 border-l-4 border-emerald-400 text-emerald-100',
  Gray: 'bg-slate-800/50 border-l-4 border-slate-400 text-slate-200',
};

export default function DocumentView() {
  const location = useLocation();
  const { id: documentId } = useParams();
  const { analysis } = location.state || { analysis: [] };

  const [activeTab, setActiveTab] = useState('summary');
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/chat', {
        document_id: documentId,
        question: userInput,
      });
      
      setMessages([...newMessages, { sender: 'ai', text: response.data.answer }]);
    } catch (error) {
      console.error('Chat API error:', error);
      setMessages([...newMessages, { 
        sender: 'ai', 
        text: "I apologize, but I encountered an error while processing your request. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const priorityMap = {
    Red: 1,
    Orange: 2,
    Gray: 3,
    Green: 4,
  };

  // 2. Filter and then SORT the clauses based on the priority map
  const riskyClauses = analysis
    .filter(c => ['Red', 'Orange', 'Gray'].includes(c.risk_level) && c.plain_english)
    .sort((a, b) => priorityMap[a.risk_level] - priorityMap[b.risk_level]);
  const colorMap = isDarkMode ? darkRiskColorMap : riskColorMap;

  const generateReport = () => {
    const riskCounts = {
      Red: analysis.filter(c => c.risk_level === 'Red').length,
      Orange: analysis.filter(c => c.risk_level === 'Orange').length,
      Green: analysis.filter(c => c.risk_level === 'Green').length,
      Gray: analysis.filter(c => c.risk_level === 'Gray').length
    };

    const totalClauses = analysis.length;
    const highRiskClauses = analysis.filter(c => c.risk_level === 'Red');
    const moderateRiskClauses = analysis.filter(c => c.risk_level === 'Orange');
    
    const overallRiskScore = totalClauses > 0 ? 
      Math.round(((riskCounts.Red * 3 + riskCounts.Orange * 2 + riskCounts.Gray * 1) / (totalClauses * 3)) * 100) : 0;

    let riskLevel = 'Low';
    if (overallRiskScore >= 70) riskLevel = 'High';
    else if (overallRiskScore >= 40) riskLevel = 'Moderate';

    const recommendations = [
      ...(highRiskClauses.length > 0 ? ['Review high-risk clauses with legal counsel before signing'] : []),
      ...(moderateRiskClauses.length > 0 ? ['Consider negotiating moderate-risk terms'] : []),
      ...(riskCounts.Gray > 0 ? ['Clarify ambiguous clauses that need further review'] : []),
      ...(overallRiskScore > 50 ? ['Consider adding protective clauses for your organization'] : []),
      'Keep a copy of the final agreement for your records'
    ];

    return {
      riskCounts,
      totalClauses,
      overallRiskScore,
      riskLevel,
      recommendations,
      highRiskClauses,
      moderateRiskClauses
    };
  };

  const downloadReport = () => {
    const report = generateReport();
  
  // Create new PDF document
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Set up fonts and styling
  doc.setFont("helvetica");
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // Blue color
  doc.text("Contract Analysis Report", 20, 30);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139); // Gray color
  doc.text("AI-Powered Risk Assessment & Recommendations", 20, 40);
  
  // Meta info
  doc.setTextColor(0, 0, 0); // Black
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 55);
  doc.text(`Document ID: ${documentId}`, 20, 65);
  
  // Executive Summary
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text("Executive Summary", 20, 85);
  
  doc.setFontSize(12);
  doc.text(`Overall Risk Level: ${report.riskLevel.toUpperCase()}`, 20, 100);
  doc.text(`Risk Score: ${report.overallRiskScore}/100`, 20, 110);
  doc.text(`Total Clauses Analyzed: ${report.totalClauses}`, 20, 120);
  
  // Risk breakdown
  let yPos = 135;
  doc.text("Risk Breakdown:", 20, yPos);
  yPos += 15;
  doc.setFontSize(10);
  doc.setTextColor(220, 38, 38); // Red
  doc.text(`High Risk: ${report.riskCounts.Red} clauses`, 25, yPos);
  yPos += 10;
  doc.setTextColor(217, 119, 6); // Orange  
  doc.text(`Moderate Risk: ${report.riskCounts.Orange} clauses`, 25, yPos);
  yPos += 10;
  doc.setTextColor(5, 150, 105); // Green
  doc.text(`Low Risk: ${report.riskCounts.Green} clauses`, 25, yPos);
  yPos += 10;
  doc.setTextColor(107, 114, 128); // Gray
  doc.text(`Needs Review: ${report.riskCounts.Gray} clauses`, 25, yPos);
  
  // Recommendations
  yPos += 25;
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text("Key Recommendations", 20, yPos);
  yPos += 15;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  report.recommendations.forEach((rec, i) => {
    if (yPos > 250) { // Check if we need a new page
      doc.addPage();
      yPos = 30;
    }
    const lines = doc.splitTextToSize(`${i + 1}. ${rec}`, 170);
    doc.text(lines, 20, yPos);
    yPos += lines.length * 5 + 5;
  });
  
  // High Risk Clauses
  if (report.highRiskClauses.length > 0) {
    yPos += 15;
    if (yPos > 250) {
      doc.addPage();
      yPos = 30;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text("High Risk Clauses", 20, yPos);
    yPos += 15;
    
    report.highRiskClauses.forEach((clause, i) => {
      if (yPos > 220) {
        doc.addPage();
        yPos = 30;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(220, 38, 38);
      doc.text(`High Risk Clause #${i + 1}`, 20, yPos);
      yPos += 15;
      
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      const originalLines = doc.splitTextToSize(`Original: "${clause.original_text}"`, 170);
      doc.text(originalLines, 20, yPos);
      yPos += originalLines.length * 4 + 10;
      
      doc.setTextColor(0, 0, 0);
      const explanationLines = doc.splitTextToSize(`Plain English: ${clause.plain_english}`, 170);
      doc.text(explanationLines, 20, yPos);
      yPos += explanationLines.length * 4 + 15;
  });
  }
  doc.save(`contract-analysis-report-${documentId}.pdf`);
};



  return (
    <div className={`flex h-screen font-inter ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header Bar */}
      <div className={`absolute top-0 left-0 right-0 h-16 ${isDarkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} z-10 flex items-center justify-between px-6`}>
        <div className="flex items-center space-x-4">
          <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center`}>
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm8-2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Document Analysis
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Contract Review & AI Assistant
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowReportModal(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
            </svg>
            <span>Download Report</span>
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full pt-16">
        {/* Left Panel: Document Inspector */}
        <div className={`w-3/5 ${isDarkMode ? 'bg-slate-900' : 'bg-white'} border-r ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="p-8 h-full overflow-y-auto">
            <div className="mb-6">
              <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Document Inspector
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Review clauses with AI-powered risk assessment
              </p>
            </div>
            
            {/* Risk Legend */}
            <div className={`flex flex-wrap gap-4 mb-8 p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>High Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Moderate Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Low Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Needs Review</span>
              </div>
            </div>

            {/* Document Content */}
            <div className="space-y-4">
              {analysis.length > 0 ? (
                analysis.map((clause, index) => (
                  <div 
                    key={index} 
                    className={`p-5 rounded-xl transition-all duration-200 hover:shadow-lg ${
                      colorMap[clause.risk_level] || (isDarkMode ? 'bg-slate-800/30' : 'bg-gray-50')
                    }`}
                  >
                    <p className="text-base leading-relaxed font-medium">
                      {clause.original_text}
                    </p>
                    {clause.plain_english && (
                      <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white/70'}`}>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                          💡 <strong>Plain English:</strong> {clause.plain_english}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className={`text-center py-16 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  <div className="text-4xl mb-4">📄</div>
                  <p className="text-lg font-medium">No document analysis available</p>
                  <p className="text-sm">Upload a document to begin analysis</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: AI Co-Pilot */}
        <div className={`w-2/5 flex flex-col ${isDarkMode ? 'bg-slate-800/30' : 'bg-gray-50/50'}`}>
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center`}>
                <span className="text-white text-lg">🤖</span>
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI Assistant
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Get insights and ask questions
                </p>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className={`flex rounded-lg p-1 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
              <button 
                onClick={() => setActiveTab('summary')} 
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  activeTab === 'summary' 
                    ? (isDarkMode ? 'bg-slate-600 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                    : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-600 hover:text-gray-800')
                }`}
              >
                Summary
              </button>
              <button 
                onClick={() => setActiveTab('chat')} 
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  activeTab === 'chat' 
                    ? (isDarkMode ? 'bg-slate-600 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                    : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-600 hover:text-gray-800')
                }`}
              >
                Chat
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'summary' && (
              <div className="p-6 h-full overflow-y-auto">
                <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Key Risk Analysis
                </h3>
                
                {riskyClauses.length > 0 ? (
                  <div className="space-y-4">
                    {riskyClauses.map((clause, index) => (
                      <div 
                        key={index} 
                        className={`rounded-xl p-5 border ${
                          clause.risk_level === 'Red' 
                            ? (isDarkMode ? 'bg-red-950/20 border-red-500/30' : 'bg-red-50 border-red-200')
                            : clause.risk_level === 'Orange' 
                            ? (isDarkMode ? 'bg-amber-950/20 border-amber-500/30' : 'bg-amber-50 border-amber-200')
                            : (isDarkMode ? 'bg-slate-800/50 border-slate-600/30' : 'bg-slate-50 border-slate-200')
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            clause.risk_level === 'Red' 
                              ? 'bg-red-100 text-red-800' 
                              : clause.risk_level === 'Orange' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {clause.risk_level} Risk
                          </span>
                          <span className="text-2xl">{clause.emoji_summary}</span>
                        </div>
                        
                        <div className={`text-xs font-mono p-2 rounded-md mb-3 ${isDarkMode ? 'bg-slate-700/50 text-slate-400' : 'bg-gray-100 text-gray-600'}`}>
                          "{clause.original_text.substring(0, 80)}..."
                        </div>
                        
                        <p className={`font-medium leading-relaxed ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                          {clause.plain_english}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-12 rounded-xl ${isDarkMode ? 'bg-emerald-950/20' : 'bg-emerald-50'}`}>
                    <div className="text-4xl mb-4">✅</div>
                    <p className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                      Great News!
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      No high-risk clauses detected in this document
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 && (
                    <div className={`text-center py-12 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      <div className="text-4xl mb-4">💬</div>
                      <p className="font-medium mb-2">Start a conversation</p>
                      <p className="text-sm">Ask questions about your document</p>
                    </div>
                  )}
                  
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md p-4 rounded-2xl shadow-sm ${
                        msg.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : (isDarkMode ? 'bg-slate-700 text-slate-100' : 'bg-white text-gray-900 border border-gray-200')
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-700' : 'bg-white border border-gray-200'}`}>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-slate-400' : 'bg-gray-400'}`}></div>
                          <div className={`w-2 h-2 rounded-full animate-pulse delay-150 ${isDarkMode ? 'bg-slate-400' : 'bg-gray-400'}`}></div>
                          <div className={`w-2 h-2 rounded-full animate-pulse delay-300 ${isDarkMode ? 'bg-slate-400' : 'bg-gray-400'}`}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                
                {/* Chat Input */}
                <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-white/80'}`}>
                  <form onSubmit={handleSendMessage} className="flex space-x-3">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Ask about contract terms, risks, or requirements..."
                      className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                    <button 
                      type="submit" 
                      disabled={isLoading || !userInput.trim()} 
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Report Download Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-2xl w-full rounded-2xl shadow-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm8-2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Analysis Report Ready
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Comprehensive contract analysis with actionable insights
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                >
                  <svg className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                  </svg>
                </button>
              </div>

              {(() => {
                const report = generateReport();
                return (
                  <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                      <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Risk Assessment Summary
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${report.riskLevel === 'High' ? 'text-red-500' : report.riskLevel === 'Moderate' ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {report.overallRiskScore}
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Risk Score</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                            {report.riskCounts.Red}
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>High Risk</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                            {report.riskCounts.Orange}
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Moderate Risk</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {report.totalClauses}
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Total Clauses</div>
                        </div>
                      </div>
                    </div>

                    {/* Key Recommendations Preview */}
                    <div>
                      <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Key Recommendations
                      </h4>
                      <div className="space-y-2">
                        {report.recommendations.slice(0, 3).map((rec, i) => (
                          <div key={i} className={`flex items-start space-x-3 p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/30' : 'bg-gray-50'}`}>
                            <div className={`w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold mt-0.5`}>
                              {i + 1}
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>{rec}</p>
                          </div>
                        ))}
                        {report.recommendations.length > 3 && (
                          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} pl-9`}>
                            +{report.recommendations.length - 3} more recommendations in full report...
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Report Contents Preview */}
                    <div className={`p-4 rounded-lg border-2 border-dashed ${isDarkMode ? 'border-slate-600 bg-slate-700/20' : 'border-gray-300 bg-gray-50'}`}>
                      <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        📄 Your report will include:
                      </h4>
                      <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                        <li className="flex items-center space-x-2">
                          <span className="text-green-500">✓</span>
                          <span>Executive summary with overall risk assessment</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="text-green-500">✓</span>
                          <span>Detailed analysis of high and moderate risk clauses</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="text-green-500">✓</span>
                          <span>Plain English explanations for complex legal terms</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="text-green-500">✓</span>
                          <span>Actionable recommendations for next steps</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="text-green-500">✓</span>
                          <span>Professional formatting for sharing with your team</span>
                        </li>
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={() => {
                          downloadReport();
                          setShowReportModal(false);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                        </svg>
                        <span>Download Full Report</span>
                      </button>
                      <button
                        onClick={() => setShowReportModal(false)}
                        className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                          isDarkMode 
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}