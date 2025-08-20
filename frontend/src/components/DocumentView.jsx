import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
    Shield, 
    AlertTriangle, 
    CheckCircle, 
    Eye, 
    MessageSquare, 
    Download, 
    Filter, 
    Sun, 
    Moon,
    Maximize2,
    Minimize2,
    Send,
    Bot,
    User,
    FileText,
    TrendingUp,
    Activity,
    Settings,
    Star,
    ChevronRight,
    Clock,
    Target,
    AlertCircle,
    Info,
    Lightbulb,
    BarChart3,
    PieChart,
    Zap
} from 'lucide-react';

// --- Clean Helper Components ---

const StatCard = ({ label, value, color, icon: IconComponent, isDark, trend }) => (
    <div className={`${isDark ? 'bg-gray-800/90 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600' : 'bg-white border-gray-200 hover:bg-gray-50'} border backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group`}>
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl ${color.replace('text-', 'bg-').replace('-500', isDark ? '-900/50' : '-100')} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className={`w-6 h-6 ${color}`} />
            </div>
            {trend && (
                <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-xs font-medium">{Math.abs(trend)}%</span>
                </div>
            )}
        </div>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium mb-1`}>{label}</p>
        <p className={`text-3xl font-bold ${color} tracking-tight`}>{value}</p>
    </div>
);

const RiskProgressBar = ({ score, color, isDark }) => {
    const strokeColor = score >= 70 ? '#ef4444' : score >= 40 ? '#f59e0b' : '#10b981';
    const circumference = 2 * Math.PI * 15.9155;
    const strokeDasharray = `${(score / 100) * circumference}, ${circumference}`;
    
    return (
        <div className="relative w-28 h-28">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                    className={isDark ? 'text-gray-700' : 'text-gray-200'}
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="3"
                    strokeDasharray={strokeDasharray}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{score}</span>
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium tracking-wide`}>SCORE</span>
            </div>
        </div>
    );
};

// --- Main Component ---

export default function DocumentView() {
    const location = useLocation();
    const { id: documentId } = useParams();
    const [analysis, setAnalysis] = useState(location.state?.analysis || null);

    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(!analysis);
    const [selectedRiskFilter, setSelectedRiskFilter] = useState('all');
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
    const [isChatExpanded, setIsChatExpanded] = useState(false);
    const [error, setError] = useState('');

    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // If analysis data is already present, no need to fetch.
        if (analysis) {
            setIsLoadingData(false);
            return;
        }

        const fetchDocumentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/document/${documentId}`);
                // The full analysis is stored in the 'fullAnalysis' field
                setAnalysis(response.data.fullAnalysis); 
            } catch (err) {
                console.error("Failed to fetch document details:", err);
                setError("Could not load document analysis. Please go back to the dashboard and try again.");
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchDocumentDetails();
    }, [documentId, analysis]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

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
            setMessages([...newMessages, { sender: 'ai', text: "I apologize, but I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingData) {
        return <div className="min-h-screen bg-[#0D0B1A] text-white flex items-center justify-center">Loading document analysis...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-[#0D0B1A] text-white flex items-center justify-center">{error}</div>;
    }

    const riskStats = {
        high: analysis.filter(c => c.risk_level === 'Red').length,
        moderate: analysis.filter(c => c.risk_level === 'Orange').length,
        low: analysis.filter(c => c.risk_level === 'Green').length,
        review: analysis.filter(c => c.risk_level === 'Gray').length,
        total: analysis.length
    };

    const overallRiskScore = riskStats.total > 0 ?
        Math.round(((riskStats.high * 3 + riskStats.moderate * 2 + riskStats.review * 1) / (riskStats.total * 3)) * 100) : 0;

    const getRiskLevel = (score) => {
        if (score >= 70) return { level: 'High Risk', color: 'text-red-500', bgColor: 'bg-red-500' };
        if (score >= 40) return { level: 'Moderate Risk', color: 'text-amber-500', bgColor: 'bg-amber-500' };
        return { level: 'Low Risk', color: 'text-green-500', bgColor: 'bg-green-500' };
    };

    const currentRisk = getRiskLevel(overallRiskScore);

    const filteredClauses = analysis.filter(clause => {
        if (selectedRiskFilter === 'all') return true;
        const riskMap = { high: 'Red', moderate: 'Orange', low: 'Green', review: 'Gray' };
        return clause.risk_level === riskMap[selectedRiskFilter];
    });

    const getRiskBadge = (riskLevel, isDark) => {
        const badges = {
            Red: { 
                text: 'High Risk', 
                bg: isDark ? 'bg-red-900/30' : 'bg-red-50', 
                color: isDark ? 'text-red-400' : 'text-red-700', 
                border: isDark ? 'border-red-800/50' : 'border-red-200', 
                icon: AlertTriangle 
            },
            Orange: { 
                text: 'Moderate', 
                bg: isDark ? 'bg-amber-900/30' : 'bg-amber-50', 
                color: isDark ? 'text-amber-400' : 'text-amber-700', 
                border: isDark ? 'border-amber-800/50' : 'border-amber-200', 
                icon: AlertCircle 
            },
            Green: { 
                text: 'Low Risk', 
                bg: isDark ? 'bg-green-900/30' : 'bg-green-50', 
                color: isDark ? 'text-green-400' : 'text-green-700', 
                border: isDark ? 'border-green-800/50' : 'border-green-200', 
                icon: CheckCircle 
            },
            Gray: { 
                text: 'Review', 
                bg: isDark ? 'bg-gray-700/30' : 'bg-gray-50', 
                color: isDark ? 'text-gray-400' : 'text-gray-700', 
                border: isDark ? 'border-gray-600/50' : 'border-gray-200', 
                icon: Eye 
            }
        };
        const badge = badges[riskLevel] || badges.Gray;
        const IconComponent = badge.icon;
        
        return (
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.color} border ${badge.border} backdrop-blur-sm`}>
                <IconComponent className="w-3 h-3" />
                {badge.text}
            </span>
        );
    };

    // Enhanced report generation with comprehensive contract analysis (UNCHANGED)
    const generateComprehensiveReport = () => {
        const highRiskClauses = analysis.filter(c => c.risk_level === 'Red');
        const moderateRiskClauses = analysis.filter(c => c.risk_level === 'Orange');
        const lowRiskClauses = analysis.filter(c => c.risk_level === 'Green');
        const reviewClauses = analysis.filter(c => c.risk_level === 'Gray');

        // Analyze contract patterns and themes
        const contractAnalysis = {
            riskDistribution: {
                critical: Math.round((highRiskClauses.length / riskStats.total) * 100),
                moderate: Math.round((moderateRiskClauses.length / riskStats.total) * 100),
                acceptable: Math.round((lowRiskClauses.length / riskStats.total) * 100),
                unclear: Math.round((reviewClauses.length / riskStats.total) * 100)
            },
            keyRiskAreas: [
                ...(highRiskClauses.length > 0 ? ['Liability and indemnification clauses require immediate attention'] : []),
                ...(moderateRiskClauses.some(c => c.original_text.toLowerCase().includes('termination')) ? ['Contract termination conditions need clarification'] : []),
                ...(analysis.some(c => c.original_text.toLowerCase().includes('payment')) ? ['Payment terms and conditions present'] : []),
                ...(analysis.some(c => c.original_text.toLowerCase().includes('intellectual property')) ? ['Intellectual property rights addressed'] : []),
                ...(analysis.some(c => c.original_text.toLowerCase().includes('confidential')) ? ['Confidentiality obligations established'] : [])
            ],
            businessImpact: {
                financial: highRiskClauses.filter(c => 
                    c.original_text.toLowerCase().includes('payment') || 
                    c.original_text.toLowerCase().includes('fee') ||
                    c.original_text.toLowerCase().includes('cost')
                ).length,
                legal: highRiskClauses.filter(c => 
                    c.original_text.toLowerCase().includes('liable') || 
                    c.original_text.toLowerCase().includes('indemnif') ||
                    c.original_text.toLowerCase().includes('lawsuit')
                ).length,
                operational: moderateRiskClauses.filter(c => 
                    c.original_text.toLowerCase().includes('perform') || 
                    c.original_text.toLowerCase().includes('deliver') ||
                    c.original_text.toLowerCase().includes('service')
                ).length
            }
        };

        // Generate detailed recommendations
        const detailedRecommendations = [];
        
        if (highRiskClauses.length > 0) {
            detailedRecommendations.push({
                priority: 'CRITICAL',
                category: 'Legal Risk Mitigation',
                title: 'Immediate Legal Review Required',
                description: `${highRiskClauses.length} high-risk clause${highRiskClauses.length > 1 ? 's' : ''} identified that could expose your organization to significant legal and financial liability.`,
                businessImpact: 'High financial and legal exposure',
                timeframe: 'Before contract execution',
                actions: [
                    'Schedule immediate review with qualified legal counsel',
                    'Prepare alternative language for negotiation',
                    'Document all identified risks and proposed mitigations',
                    'Consider liability insurance implications'
                ],
                estimatedCost: 'Legal review: $2,000-$5,000',
                riskIfIgnored: 'Potential unlimited liability, legal disputes, financial losses'
            });
        }

        if (contractAnalysis.businessImpact.financial > 0) {
            detailedRecommendations.push({
                priority: 'HIGH',
                category: 'Financial Protection',
                title: 'Financial Terms Optimization',
                description: `${contractAnalysis.businessImpact.financial} clause${contractAnalysis.businessImpact.financial > 1 ? 's' : ''} with financial implications require careful review.`,
                businessImpact: 'Direct impact on cash flow and profitability',
                timeframe: 'During negotiation phase',
                actions: [
                    'Review payment terms and schedule',
                    'Negotiate penalty caps and limitations',
                    'Establish clear invoicing procedures',
                    'Include inflation adjustment clauses for long-term contracts'
                ],
                estimatedCost: 'Financial review: $500-$1,500',
                riskIfIgnored: 'Unexpected costs, cash flow issues, profit margin erosion'
            });
        }

        if (moderateRiskClauses.length > 2) {
            detailedRecommendations.push({
                priority: 'MEDIUM',
                category: 'Operational Efficiency',
                title: 'Operational Terms Clarification',
                description: `${moderateRiskClauses.length} moderate-risk clauses present opportunities for operational improvements.`,
                businessImpact: 'Affects day-to-day operations and performance metrics',
                timeframe: 'Before contract finalization',
                actions: [
                    'Define clear performance standards and metrics',
                    'Establish communication protocols',
                    'Create dispute resolution procedures',
                    'Set realistic deadlines and milestones'
                ],
                estimatedCost: 'Process documentation: $1,000-$3,000',
                riskIfIgnored: 'Operational inefficiencies, performance disputes, relationship strain'
            });
        }

        return {
            documentId,
            analysisDate: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            contractOverview: {
                totalClauses: riskStats.total,
                riskScore: overallRiskScore,
                riskLevel: currentRisk.level,
                riskDistribution: contractAnalysis.riskDistribution,
                keyRiskAreas: contractAnalysis.keyRiskAreas,
                businessImpact: contractAnalysis.businessImpact
            },
            executiveSummary: {
                recommendation: overallRiskScore >= 70 ? 'DO NOT SIGN without major revisions' : 
                               overallRiskScore >= 40 ? 'PROCEED WITH CAUTION after addressing key issues' : 
                               'ACCEPTABLE with minor clarifications',
                keyFindings: [
                    `Contract contains ${riskStats.high} critical risk${riskStats.high !== 1 ? 's' : ''} requiring immediate attention`,
                    `${contractAnalysis.riskDistribution.critical}% of clauses pose high risk to your organization`,
                    `Primary concern areas: ${contractAnalysis.keyRiskAreas.slice(0, 3).join(', ')}`,
                    `Estimated review cost: $${2000 + (highRiskClauses.length * 500)}-$${5000 + (highRiskClauses.length * 1000)}`
                ],
                nextSteps: [
                    highRiskClauses.length > 0 ? 'Engage legal counsel immediately' : 'Proceed with standard review',
                    'Prepare negotiation strategy for identified risks',
                    'Set timeline for contract revisions',
                    'Plan for ongoing contract management'
                ]
            },
            detailedRecommendations,
            riskAnalysis: {
                highRisk: highRiskClauses,
                moderateRisk: moderateRiskClauses,
                lowRisk: lowRiskClauses,
                needsReview: reviewClauses
            },
            contractMetrics: {
                readabilityScore: Math.max(20, 90 - (riskStats.total * 2)),
                complexityLevel: riskStats.total > 20 ? 'High' : riskStats.total > 10 ? 'Medium' : 'Low',
                negotiationPriority: highRiskClauses.length > 3 ? 'Critical' : highRiskClauses.length > 0 ? 'High' : 'Standard'
            }
        };
    };

    const downloadReport = async () => {
        setIsGeneratingReport(true);
        
        try {
            const report = generateComprehensiveReport();
            
            const reportContainer = document.createElement('div');
            reportContainer.style.position = 'absolute';
            reportContainer.style.left = '-9999px';
            reportContainer.style.width = '210mm';
            reportContainer.style.fontFamily = 'Arial, sans-serif';
            reportContainer.style.backgroundColor = 'white';
            reportContainer.style.color = '#1a1a1a';
            reportContainer.style.lineHeight = '1.5';
            document.body.appendChild(reportContainer);

            const htmlContent = `
                <div style="padding: 30px;">
                    <!-- Professional Header -->
                    <div style="text-align: center; margin-bottom: 40px; padding: 25px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 8px;">
                        <h1 style="color: #1e293b; font-size: 32px; margin: 0; font-weight: bold; letter-spacing: -0.5px;">LawLytics Contract Analysis Report</h1>
                        <p style="color: #475569; font-size: 18px; margin: 8px 0 16px 0;">Professional Legal Document Intelligence & Risk Assessment</p>
                        <div style="display: flex; justify-content: center; gap: 30px; font-size: 14px; color: #64748b;">
                            <span><strong>Document ID:</strong> ${report.documentId}</span>
                            <span><strong>Analysis Date:</strong> ${report.analysisDate}</span>
                            <span><strong>Risk Level:</strong> <span style="color: ${report.contractOverview.riskScore >= 70 ? '#dc2626' : report.contractOverview.riskScore >= 40 ? '#d97706' : '#059669'}; font-weight: bold;">${report.contractOverview.riskLevel}</span></span>
                        </div>
                    </div>

                    <!-- Executive Summary -->
                    <div style="margin-bottom: 35px; border: 2px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                        <div style="background: #1e293b; color: white; padding: 20px;">
                            <h2 style="margin: 0; font-size: 24px; font-weight: bold;">📋 Executive Summary</h2>
                        </div>
                        <div style="padding: 25px;">
                            <div style="background: ${report.contractOverview.riskScore >= 70 ? '#fef2f2' : report.contractOverview.riskScore >= 40 ? '#fffbeb' : '#f0fdf4'}; border-left: 4px solid ${report.contractOverview.riskScore >= 70 ? '#dc2626' : report.contractOverview.riskScore >= 40 ? '#d97706' : '#059669'}; padding: 20px; margin-bottom: 20px; border-radius: 6px;">
                                <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 20px;">Recommendation: ${report.executiveSummary.recommendation}</h3>
                                <p style="margin: 0; color: #475569; font-size: 16px;">Overall Risk Score: <strong>${report.contractOverview.riskScore}/100</strong> | Complexity: <strong>${report.contractMetrics.complexityLevel}</strong> | Priority: <strong>${report.contractMetrics.negotiationPriority}</strong></p>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
                                <div>
                                    <h4 style="color: #1e293b; font-size: 16px; margin-bottom: 12px; font-weight: bold;">Key Findings</h4>
                                    <ul style="margin: 0; padding-left: 20px; color: #475569;">
                                        ${report.executiveSummary.keyFindings.map(finding => `<li style="margin: 8px 0;">${finding}</li>`).join('')}
                                    </ul>
                                </div>
                                <div>
                                    <h4 style="color: #1e293b; font-size: 16px; margin-bottom: 12px; font-weight: bold;">Immediate Next Steps</h4>
                                    <ol style="margin: 0; padding-left: 20px; color: #475569;">
                                        ${report.executiveSummary.nextSteps.map(step => `<li style="margin: 8px 0;">${step}</li>`).join('')}
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contract Overview & Metrics -->
                    <div style="margin-bottom: 35px;">
                        <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 20px; font-weight: bold;">📊 Contract Analysis Overview</h2>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; text-align: center;">
                                <h4 style="margin: 0 0 5px 0; color: #dc2626; font-size: 24px; font-weight: bold;">${report.contractOverview.riskDistribution.critical}%</h4>
                                <p style="margin: 0; color: #475569; font-size: 14px;">Critical Risk</p>
                            </div>
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; text-align: center;">
                                <h4 style="margin: 0 0 5px 0; color: #d97706; font-size: 24px; font-weight: bold;">${report.contractOverview.riskDistribution.moderate}%</h4>
                                <p style="margin: 0; color: #475569; font-size: 14px;">Moderate Risk</p>
                            </div>
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; text-align: center;">
                                <h4 style="margin: 0 0 5px 0; color: #059669; font-size: 24px; font-weight: bold;">${report.contractOverview.riskDistribution.acceptable}%</h4>
                                <p style="margin: 0; color: #475569; font-size: 14px;">Acceptable</p>
                            </div>
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; text-align: center;">
                                <h4 style="margin: 0 0 5px 0; color: #6b7280; font-size: 24px; font-weight: bold;">${report.contractOverview.riskDistribution.unclear}%</h4>
                                <p style="margin: 0; color: #475569; font-size: 14px;">Needs Review</p>
                            </div>
                        </div>
                        
                        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px;">
                            <h4 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px;">Key Risk Areas Identified</h4>
                            <ul style="margin: 0; padding-left: 20px; color: #475569; columns: 2; column-gap: 30px;">
                                ${report.contractOverview.keyRiskAreas.map(area => `<li style="margin: 8px 0; break-inside: avoid;">${area}</li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <!-- Detailed Recommendations -->
                    <div style="margin-bottom: 35px;">
                        <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 20px; font-weight: bold;">💡 Strategic Recommendations</h2>
                        ${report.detailedRecommendations.map(rec => `
                            <div style="margin-bottom: 25px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                                <div style="background: ${rec.priority === 'CRITICAL' ? '#fef2f2' : rec.priority === 'HIGH' ? '#fffbeb' : '#eff6ff'}; padding: 15px; border-bottom: 1px solid #e2e8f0;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                        <h3 style="margin: 0; color: #1e293b; font-size: 18px;">${rec.title}</h3>
                                        <div style="display: flex; gap: 10px;">
                                            <span style="background: ${rec.priority === 'CRITICAL' ? '#dc2626' : rec.priority === 'HIGH' ? '#d97706' : '#2563eb'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">${rec.priority}</span>
                                            <span style="background: #64748b; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">${rec.category}</span>
                                        </div>
                                    </div>
                                    <p style="margin: 0; color: #475569; font-size: 15px;">${rec.description}</p>
                                </div>
                                <div style="padding: 20px;">
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px;">
                                        <div>
                                            <p style="margin: 0 0 5px 0; color: #1e293b; font-weight: bold; font-size: 14px;">Business Impact:</p>
                                            <p style="margin: 0; color: #475569; font-size: 14px;">${rec.businessImpact}</p>
                                        </div>
                                        <div>
                                            <p style="margin: 0 0 5px 0; color: #1e293b; font-weight: bold; font-size: 14px;">Timeframe:</p>
                                            <p style="margin: 0; color: #475569; font-size: 14px;">${rec.timeframe}</p>
                                        </div>
                                    </div>
                                    <h4 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px;">Action Items:</h4>
                                    <ul style="margin: 0 0 15px 0; padding-left: 20px; color: #475569;">
                                        ${rec.actions.map(action => `<li style="margin: 5px 0;">${action}</li>`).join('')}
                                    </ul>
                                    <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border-left: 3px solid #64748b;">
                                        <div style="display: flex; justify-content: space-between;">
                                            <span style="color: #1e293b; font-weight: bold; font-size: 14px;">Estimated Cost: ${rec.estimatedCost}</span>
                                            <span style="color: #dc2626; font-weight: bold; font-size: 14px;">Risk if Ignored: ${rec.riskIfIgnored}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Critical Risk Clauses -->
                    ${report.riskAnalysis.highRisk.length > 0 ? `
                        <div style="margin-bottom: 35px;">
                            <h2 style="color: #dc2626; font-size: 24px; margin-bottom: 20px; font-weight: bold;">🚨 Critical Risk Clauses (${report.riskAnalysis.highRisk.length})</h2>
                            <div style="background: #fef2f2; border: 2px solid #fecaca; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                                <p style="margin: 0; color: #7f1d1d; font-weight: bold; font-size: 16px;">⚠️ WARNING: These clauses pose significant legal and financial risks. Immediate legal review is required before contract execution.</p>
                            </div>
                            ${report.riskAnalysis.highRisk.map((clause, index) => `
                                <div style="margin-bottom: 20px; border: 2px solid #dc2626; border-radius: 8px; overflow: hidden;">
                                    <div style="background: #fee2e2; padding: 15px; border-bottom: 1px solid #fecaca;">
                                        <h4 style="margin: 0; color: #7f1d1d; font-size: 16px;">Critical Risk Clause #${index + 1}</h4>
                                    </div>
                                    <div style="padding: 20px;">
                                        <h5 style="margin: 0 0 10px 0; color: #1e293b;">Original Contract Text:</h5>
                                        <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid #dc2626;">
                                            <p style="margin: 0; font-family: monospace; font-size: 13px; line-height: 1.6; color: #374151;">${clause.original_text}</p>
                                        </div>
                                        <h5 style="margin: 0 0 10px 0; color: #1e293b;">Risk Analysis & AI Explanation:</h5>
                                        <p style="margin: 0; color: #475569; line-height: 1.6;">${clause.plain_english}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    <!-- Moderate Risk Clauses -->
                    ${report.riskAnalysis.moderateRisk.length > 0 ? `
                        <div style="margin-bottom: 35px;">
                            <h2 style="color: #d97706; font-size: 24px; margin-bottom: 20px; font-weight: bold;">⚠️ Moderate Risk Clauses (${report.riskAnalysis.moderateRisk.length})</h2>
                            <div style="background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                                <p style="margin: 0; color: #92400e; font-weight: bold;">These clauses present manageable risks that should be addressed through negotiation or clarification.</p>
                            </div>
                            ${report.riskAnalysis.moderateRisk.slice(0, 8).map((clause, index) => `
                                <div style="margin-bottom: 15px; border: 1px solid #d97706; border-radius: 6px; overflow: hidden;">
                                    <div style="background: #fffbeb; padding: 12px;">
                                        <h4 style="margin: 0; color: #92400e; font-size: 14px;">Moderate Risk Clause #${index + 1}</h4>
                                    </div>
                                    <div style="padding: 15px;">
                                        <div style="background: #f9fafb; padding: 12px; border-radius: 4px; margin-bottom: 10px; border-left: 3px solid #d97706;">
                                            <p style="margin: 0; font-family: monospace; font-size: 12px; color: #374151;">${clause.original_text}</p>
                                        </div>
                                        <p style="margin: 0; color: #475569; font-size: 14px;"><strong>Analysis:</strong> ${clause.plain_english}</p>
                                    </div>
                                </div>
                            `).join('')}
                            ${report.riskAnalysis.moderateRisk.length > 8 ? `
                                <div style="background: #f1f5f9; padding: 15px; border-radius: 6px; text-align: center;">
                                    <p style="margin: 0; color: #64748b; font-style: italic;">... and ${report.riskAnalysis.moderateRisk.length - 8} additional moderate risk clauses requiring review</p>
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}

                    <!-- Contract Health Score -->
                    <div style="margin-bottom: 35px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px;">
                        <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 20px; font-weight: bold;">📈 Contract Health Metrics</h2>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                            <div style="text-align: center; padding: 20px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                                <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 32px; font-weight: bold;">${report.contractMetrics.readabilityScore}/100</h3>
                                <p style="margin: 0; color: #64748b; font-size: 14px;">Readability Score</p>
                                <p style="margin: 5px 0 0 0; color: #475569; font-size: 12px;">${report.contractMetrics.readabilityScore >= 80 ? 'Highly Readable' : report.contractMetrics.readabilityScore >= 60 ? 'Moderately Complex' : 'Complex Language'}</p>
                            </div>
                            <div style="text-align: center; padding: 20px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                                <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 32px; font-weight: bold;">${report.contractOverview.totalClauses}</h3>
                                <p style="margin: 0; color: #64748b; font-size: 14px;">Total Clauses</p>
                                <p style="margin: 5px 0 0 0; color: #475569; font-size: 12px;">Complexity: ${report.contractMetrics.complexityLevel}</p>
                            </div>
                            <div style="text-align: center; padding: 20px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                                <h3 style="margin: 0 0 10px 0; color: ${report.contractOverview.riskScore >= 70 ? '#dc2626' : report.contractOverview.riskScore >= 40 ? '#d97706' : '#059669'}; font-size: 32px; font-weight: bold;">${report.contractOverview.riskScore}/100</h3>
                                <p style="margin: 0; color: #64748b; font-size: 14px;">Risk Score</p>
                                <p style="margin: 5px 0 0 0; color: #475569; font-size: 12px;">Priority: ${report.contractMetrics.negotiationPriority}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Action Plan Summary -->
                    <div style="margin-bottom: 35px; background: #1e293b; color: white; border-radius: 12px; padding: 25px;">
                        <h2 style="color: white; font-size: 24px; margin-bottom: 20px; font-weight: bold;">🎯 Recommended Action Plan</h2>
                        <div style="display: grid; grid-template-columns: repeat(${report.contractOverview.riskScore >= 70 ? '4' : '3'}, 1fr); gap: 20px;">
                            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
                                <h4 style="margin: 0 0 10px 0; color: #fbbf24; font-size: 16px;">PHASE 1</h4>
                                <p style="margin: 0; font-size: 14px;">Legal Review</p>
                                <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">Timeline: ${report.contractOverview.riskScore >= 70 ? 'Immediate' : '1-2 weeks'}</p>
                            </div>
                            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
                                <h4 style="margin: 0 0 10px 0; color: #fbbf24; font-size: 16px;">PHASE 2</h4>
                                <p style="margin: 0; font-size: 14px;">Risk Mitigation</p>
                                <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">Timeline: 2-3 weeks</p>
                            </div>
                            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
                                <h4 style="margin: 0 0 10px 0; color: #fbbf24; font-size: 16px;">PHASE 3</h4>
                                <p style="margin: 0; font-size: 14px;">Negotiation</p>
                                <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">Timeline: 1-4 weeks</p>
                            </div>
                            ${report.contractOverview.riskScore >= 70 ? `
                                <div style="background: rgba(220,38,38,0.3); padding: 20px; border-radius: 8px; border: 1px solid rgba(220,38,38,0.5);">
                                    <h4 style="margin: 0 0 10px 0; color: #fca5a5; font-size: 16px;">CRITICAL</h4>
                                    <p style="margin: 0; font-size: 14px;">Emergency Review</p>
                                    <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">Timeline: 24-48 hours</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Legal Disclaimer & Contact -->
                    <div style="margin-top: 40px; padding-top: 25px; border-top: 2px solid #e2e8f0;">
                        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px;">⚖️ Important Legal Disclaimer</h3>
                            <p style="margin: 0 0 10px 0; color: #475569; font-size: 14px; line-height: 1.6;">This analysis is provided for informational purposes only and does not constitute legal advice. The AI-generated insights should be reviewed by qualified legal counsel before making any contractual decisions. LawLytics assumes no liability for decisions made based on this report.</p>
                            <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;"><strong>Recommendation:</strong> Always consult with a licensed attorney familiar with your jurisdiction and industry before executing any contract, especially those with high-risk clauses identified in this analysis.</p>
                        </div>
                        
                        <div style="text-align: center; color: #64748b;">
                            <p style="margin: 5px 0; font-size: 14px; font-weight: bold;">LawLytics Professional Contract Analysis Platform</p>
                            <p style="margin: 5px 0; font-size: 12px;">Powered by Advanced AI Legal Intelligence</p>
                            <p style="margin: 15px 0 0 0; font-size: 12px;">© 2025 LawLytics Technologies. All rights reserved.</p>
                            <p style="margin: 5px 0 0 0; font-size: 11px;">Report generated on ${report.analysisDate} | Version 2.1.0</p>
                        </div>
                    </div>
                </div>
            `;

            reportContainer.innerHTML = htmlContent;

            const canvas = await html2canvas(reportContainer, { 
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                height: reportContainer.scrollHeight,
                windowHeight: reportContainer.scrollHeight
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = 210;
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            let heightLeft = pdfHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= 297;

            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= 297;
            }
            
            pdf.save(`LawLytics_Comprehensive_Report_${documentId}_${new Date().toISOString().split('T')[0]}.pdf`);
            
            document.body.removeChild(reportContainer);
        } catch (error) {
            console.error('Error generating report:', error);
            alert('There was an error generating the report. Please try again.');
        } finally {
            setIsGeneratingReport(false);
        }
    };

    const quickSuggestions = [
        { text: 'Explain high-risk clauses', icon: AlertTriangle },
        { text: 'Negotiation strategies', icon: Target },
        { text: 'Legal implications', icon: Shield },
        { text: 'Contract summary', icon: FileText }
    ];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-all duration-300`}>
            {/* Enhanced Header with Gradient Background */}
            <header className={`${isDarkMode ? 'bg-gray-800/95 border-gray-700/50' : 'bg-white/95 border-gray-200'} border-b backdrop-blur-sm sticky top-0 z-50 transition-all duration-300`}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                            </div>
                            <div>
                                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                                    Contract Analysis
                                </h1>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300 flex items-center space-x-2`}>
                                    <Activity className="w-3 h-3" />
                                    <span>AI-Powered Legal Intelligence</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className={`p-3 rounded-xl transition-all duration-300 ${
                                    isDarkMode 
                                        ? 'bg-gray-700/80 text-yellow-400 hover:bg-gray-600 hover:scale-105' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                                } backdrop-blur-sm`}
                                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {isDarkMode ? (
                                    <Sun className="w-5 h-5" />
                                ) : (
                                    <Moon className="w-5 h-5" />
                                )}
                            </button>
                            
                            <button 
                                onClick={downloadReport} 
                                disabled={isGeneratingReport}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                {isGeneratingReport ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span>Export Report</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Enhanced Risk Summary with Animated Elements */}
                <div className={`${isDarkMode ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white border-gray-200'} rounded-2xl shadow-xl border backdrop-blur-sm p-8 mb-8 transition-all duration-300 relative overflow-hidden`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300 flex items-center space-x-3`}>
                                    <BarChart3 className="w-8 h-8 text-blue-500" />
                                    <span>Risk Assessment Overview</span>
                                </h2>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2 flex items-center space-x-2`}>
                                    <Clock className="w-4 h-4" />
                                    <span>Generated {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</span>
                                </p>
                            </div>
                            <div className={`px-4 py-2 rounded-full ${currentRisk.bgColor} bg-opacity-20 border ${currentRisk.color.replace('text-', 'border-')}`}>
                                <span className={`${currentRisk.color} font-semibold text-sm`}>{currentRisk.level}</span>
                            </div>
                        </div>
                        
                        <div className="grid lg:grid-cols-6 gap-8 items-center">
                            <div className="lg:col-span-2 flex items-center space-x-8">
                                <div className="relative">
                                    <RiskProgressBar score={overallRiskScore} color={currentRisk.color} isDark={isDarkMode} />
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur animate-pulse"></div>
                                </div>
                                <div>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2 flex items-center space-x-2`}>
                                        <PieChart className="w-4 h-4" />
                                        <span>Overall Risk Level</span>
                                    </p>
                                    <p className={`text-3xl font-bold ${currentRisk.color} transition-colors duration-300`}>{currentRisk.level}</p>
                                    <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} text-sm mt-2 flex items-center space-x-1`}>
                                        <FileText className="w-3 h-3" />
                                        <span>{riskStats.total} clauses analyzed</span>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard 
                                    label="High Risk" 
                                    value={riskStats.high} 
                                    color="text-red-500" 
                                    icon={AlertTriangle}
                                    isDark={isDarkMode}
                                    trend={riskStats.high > 0 ? -12 : null}
                                />
                                <StatCard 
                                    label="Moderate" 
                                    value={riskStats.moderate} 
                                    color="text-amber-500" 
                                    icon={AlertCircle}
                                    isDark={isDarkMode}
                                    trend={riskStats.moderate > 0 ? 5 : null}
                                />
                                <StatCard 
                                    label="Low Risk" 
                                    value={riskStats.low} 
                                    color="text-green-500" 
                                    icon={CheckCircle}
                                    isDark={isDarkMode}
                                    trend={riskStats.low > 0 ? 8 : null}
                                />
                                <StatCard 
                                    label="Review" 
                                    value={riskStats.review} 
                                    color="text-gray-500" 
                                    icon={Eye}
                                    isDark={isDarkMode}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Main Content with Responsive Chat */}
                <div className={`grid gap-8 ${isChatExpanded ? 'lg:grid-cols-2' : 'lg:grid-cols-4'} transition-all duration-500`}>
                    {/* Enhanced Clause List */}
                    <div className={`${isChatExpanded ? 'lg:col-span-1' : 'lg:col-span-3'} ${isDarkMode ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white border-gray-200'} rounded-2xl shadow-xl border backdrop-blur-sm p-6 transition-all duration-300`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300 flex items-center space-x-3`}>
                                <FileText className="w-6 h-6 text-blue-500" />
                                <span>Document Clauses</span>
                            </h2>
                            <div className="flex items-center space-x-3">
                                <Filter className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <select 
                                    value={selectedRiskFilter} 
                                    onChange={(e) => setSelectedRiskFilter(e.target.value)} 
                                    className={`${isDarkMode ? 'bg-gray-700/80 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
                                >
                                    <option value="all">All Clauses ({riskStats.total})</option>
                                    <option value="high">🚨 High Risk ({riskStats.high})</option>
                                    <option value="moderate">⚠️ Moderate ({riskStats.moderate})</option>
                                    <option value="low">✅ Low Risk ({riskStats.low})</option>
                                    <option value="review">👁️ Review ({riskStats.review})</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            {filteredClauses.map((clause, index) => (
                                <div key={index} className={`${isDarkMode ? 'border-gray-600/50 hover:bg-gray-700/30 hover:border-gray-500' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'} border rounded-xl p-6 transition-all duration-300 group hover:shadow-lg`}>
                                    <div className="flex items-center justify-between mb-4">
                                        {getRiskBadge(clause.risk_level, isDarkMode)}
                                        <div className="flex items-center space-x-2">
                                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium tracking-wide`}>CLAUSE</span>
                                            <div className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                                                <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{index + 1}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={`${isDarkMode ? 'bg-gray-700/50 border-gray-600/50' : 'bg-gray-50 border-gray-200'} rounded-xl p-4 mb-4 border transition-all duration-300 group-hover:border-blue-300`}>
                                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} leading-relaxed text-sm font-mono`}>{clause.original_text}</p>
                                    </div>
                                    
                                    {clause.plain_english && (
                                        <div className={`${isDarkMode ? 'bg-blue-900/30 border-blue-700/50' : 'bg-blue-50 border-blue-200'} rounded-xl p-4 border transition-all duration-300`}>
                                            <div className="flex items-start space-x-3">
                                                <div className={`w-8 h-8 ${isDarkMode ? 'bg-blue-800/50' : 'bg-blue-100'} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300`}>
                                                    <Lightbulb className={`w-4 h-4 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className={`${isDarkMode ? 'text-blue-300' : 'text-blue-900'} font-semibold text-sm mb-2 flex items-center space-x-2`}>
                                                        <span>AI Analysis</span>
                                                        <Zap className="w-3 h-3" />
                                                    </h4>
                                                    <p className={`${isDarkMode ? 'text-blue-200' : 'text-blue-800'} text-sm leading-relaxed`}>{clause.plain_english}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {filteredClauses.length === 0 && (
                                <div className="text-center py-16">
                                    <div className={`w-20 h-20 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300`}>
                                        <Filter className={`w-8 h-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} transition-colors duration-300`} />
                                    </div>
                                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>No clauses found</h3>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>No clauses match the selected filter</p>
                                    <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} text-sm mt-1 transition-colors duration-300`}>Try selecting a different risk level</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Enhanced AI Chat Panel */}
                    <div className={`${isChatExpanded ? 'lg:col-span-1' : 'lg:col-span-1'} ${isDarkMode ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white border-gray-200'} rounded-2xl shadow-xl border backdrop-blur-sm flex flex-col transition-all duration-500 ${isChatExpanded ? 'h-[85vh]' : 'h-[80vh]'}`}>
                        <div className={`p-6 ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200'} border-b transition-colors duration-300`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <div className={`w-10 h-10 ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'} rounded-xl flex items-center justify-center transition-colors duration-300`}>
                                            <Bot className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'} transition-colors duration-300`} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300 flex items-center space-x-2`}>
                                            <span>LawLytics AI</span>
                                            <Star className="w-4 h-4 text-yellow-500" />
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Online & Ready</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsChatExpanded(!isChatExpanded)}
                                    className={`p-2.5 rounded-xl transition-all duration-300 ${
                                        isDarkMode 
                                            ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                                            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                    } hover:scale-110`}
                                    title={isChatExpanded ? 'Minimize chat' : 'Expand chat'}
                                >
                                    {isChatExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
                            {messages.length === 0 && (
                                <div className="text-center py-12">
                                    <div className={`w-16 h-16 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300`}>
                                        <MessageSquare className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <h4 className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Ask me anything</h4>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1 transition-colors duration-300`}>I can explain clauses, assess risks, and provide legal insights</p>
                                    <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} text-xs transition-colors duration-300 flex items-center justify-center space-x-1`}>
                                        <Zap className="w-3 h-3" />
                                        <span>Powered by AI</span>
                                    </p>
                                </div>
                            )}
                            
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                                    <div className={`max-w-xs relative group ${
                                        msg.sender === 'user' 
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                                            : isDarkMode 
                                                ? 'bg-gray-700/80 text-gray-200 border border-gray-600/50' 
                                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                                    } p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105`}>
                                        <div className="flex items-start space-x-2">
                                            {msg.sender === 'ai' && (
                                                <Bot className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                            )}
                                            {msg.sender === 'user' && (
                                                <User className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                                            )}
                                            <div className="flex-1">
                                                <p className="leading-relaxed text-sm">{msg.text}</p>
                                                <p className={`text-xs mt-2 ${
                                                    msg.sender === 'user' 
                                                        ? 'text-blue-100' 
                                                        : isDarkMode 
                                                            ? 'text-gray-400' 
                                                            : 'text-gray-500'
                                                } transition-colors duration-300 flex items-center space-x-1`}>
                                                    <Clock className="w-3 h-3" />
                                                    <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className={`p-4 rounded-2xl transition-colors duration-300 ${
                                        isDarkMode 
                                            ? 'bg-gray-700/80 border border-gray-600/50' 
                                            : 'bg-gray-100 border border-gray-200'
                                    } backdrop-blur-sm`}>
                                        <div className="flex items-center space-x-3">
                                            <Bot className="w-4 h-4 text-blue-500" />
                                            <div className="flex space-x-1">
                                                <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-400'} rounded-full animate-bounce`}></div>
                                                <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-400'} rounded-full animate-bounce`} style={{animationDelay: '0.1s'}}></div>
                                                <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-400'} rounded-full animate-bounce`} style={{animationDelay: '0.2s'}}></div>
                                            </div>
                                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Analyzing...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        
                        <div className={`p-6 ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200'} border-t transition-colors duration-300`}>
                            <form onSubmit={handleSendMessage} className="space-y-4">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={userInput} 
                                        onChange={(e) => setUserInput(e.target.value)} 
                                        placeholder="Ask about specific clauses or risks..." 
                                        className={`w-full px-4 py-3 pr-12 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                                            isDarkMode 
                                                ? 'bg-gray-700/80 border-gray-600/50 text-white placeholder-gray-400' 
                                                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                                        } backdrop-blur-sm`} 
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={isLoading || !userInput.trim()} 
                                        className="absolute right-2 top-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-110"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {quickSuggestions.map((suggestion, index) => {
                                        const IconComponent = suggestion.icon;
                                        return (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => setUserInput(suggestion.text)}
                                                className={`text-xs rounded-full px-3 py-2 transition-all duration-300 flex items-center space-x-1 hover:scale-105 ${
                                                    isDarkMode 
                                                        ? 'bg-gray-700/80 hover:bg-gray-600 border border-gray-600/50 text-gray-300 hover:text-white' 
                                                        : 'bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-600 hover:text-gray-800'
                                                } backdrop-blur-sm`}
                                            >
                                                <IconComponent className="w-3 h-3" />
                                                <span>{suggestion.text}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Custom Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: ${isDarkMode ? '#1f2937' : '#f3f4f6'};
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${isDarkMode ? '#4b5563' : '#d1d5db'};
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${isDarkMode ? '#6b7280' : '#9ca3af'};
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}