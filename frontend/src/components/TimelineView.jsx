import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
    Calendar, Users, FileText, Gavel, MessageSquare, Clock, List, ArrowRight
} from 'lucide-react';

// --- Helper Components for the new UI ---

// AI-powered function to categorize events and assign an icon
const getEventIcon = (eventText) => {
    const text = eventText.toLowerCase();
    if (text.includes('filed') || text.includes('submitted')) {
        return { Icon: FileText, color: 'text-blue-400' };
    }
    if (text.includes('hearing') || text.includes('court') || text.includes('judge')) {
        return { Icon: Gavel, color: 'text-amber-400' };
    }
    if (text.includes('communication') || text.includes('email') || text.includes('call')) {
        return { Icon: MessageSquare, color: 'text-teal-400' };
    }
    return { Icon: Calendar, color: 'text-slate-400' };
};

const TimelineCard = ({ date, event, parties, isFirst, isLast }) => {
    const { Icon, color } = getEventIcon(event);
    return (
        <div className={`relative flex-shrink-0 w-80 p-6 bg-slate-800/50 border border-slate-700 rounded-2xl group transition-all duration-300 hover:border-blue-500/50 hover:-translate-y-2`}>
            {/* Connecting Line */}
            <div className={`absolute top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-slate-700 to-slate-700 
                ${isFirst ? 'left-1/2 w-1/2' : 'left-0 w-full'} 
                ${isLast ? 'right-1/2 w-1/2' : ''}
            `}></div>
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <time className="text-sm font-semibold text-blue-300">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                    <div className={`w-10 h-10 flex items-center justify-center bg-slate-700 rounded-full border-2 border-slate-600 group-hover:bg-blue-500/20 transition-colors`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                </div>
                <p className="text-white font-semibold mb-2 h-20 line-clamp-3">{event}</p>
                <span className="text-xs bg-purple-900/50 text-purple-300 px-2.5 py-1 rounded-md flex items-center gap-1.5 w-fit">
                    <Users className="w-3 h-3"/>{parties}
                </span>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
        <div className="w-10 h-10 flex-shrink-0 bg-slate-700 text-teal-300 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-lg font-bold text-white">{value}</p>
        </div>
    </div>
);

// --- Main Component ---

export default function TimelineView() {
    const { id: documentId } = useParams();
    const location = useLocation();
    
    const [timeline, setTimeline] = useState(location.state?.timeline || null);
    const [fileName, setFileName] = useState(location.state?.fileName || 'Case Timeline');
    const [isLoading, setIsLoading] = useState(!timeline);
    const [error, setError] = useState('');

    useEffect(() => {
        if (timeline) return;

        const fetchTimeline = async () => {
            try {
                const response = await axios.get(`/api/document/${documentId}`);
                // Ensure timeline is sorted by date
                const sortedTimeline = (response.data.timeline || []).sort((a, b) => new Date(a.date) - new Date(b.date));
                setTimeline(sortedTimeline);
                setFileName(response.data.fileName || 'Case Timeline');
            } catch (err) {
                setError("Failed to load timeline data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTimeline();
    }, [documentId, timeline]);

    const calculateDuration = () => {
        if (!timeline || timeline.length < 2) return "N/A";
        const firstDate = new Date(timeline[0].date);
        const lastDate = new Date(timeline[timeline.length - 1].date);
        const diffTime = Math.abs(lastDate - firstDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} days`;
    };

    if (isLoading) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center"><p>Loading timeline...</p></div>;
    if (error) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center"><p>{error}</p></div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <div className="max-w-7xl mx-auto p-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-white">{fileName}</h1>
                    <p className="text-slate-400 mt-2">A chronological overview of key events from your document.</p>
                </header>

                {/* Summary Stats */}
                {timeline && timeline.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <StatCard title="Total Events" value={timeline.length} icon={List} />
                        <StatCard title="Case Duration" value={calculateDuration()} icon={Clock} />
                        <StatCard title="Key Parties" value={[...new Set(timeline.flatMap(e => e.parties.split(', ')))].length} icon={Users} />
                    </div>
                )}
                
                {/* Horizontal Timeline */}
                <div className="relative">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <ArrowRight className="text-blue-400"/>
                        Event Timeline
                    </h2>
                    {timeline && timeline.length > 0 ? (
                        <div className="flex overflow-x-auto space-x-8 pb-8 custom-scrollbar">
                            {timeline.map((event, index) => (
                                <TimelineCard 
                                    key={index}
                                    date={event.date}
                                    event={event.event}
                                    parties={event.parties}
                                    isFirst={index === 0}
                                    isLast={index === timeline.length - 1}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700">
                            <Calendar className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                            <h3 className="text-xl font-semibold text-white">No Timeline Available</h3>
                            <p className="text-slate-400">The AI could not extract a chronological timeline from this document.</p>
                        </div>
                    )}
                </div>
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1e293b;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #475569;
                }
            `}</style>
        </div>
    );
}
