import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Users } from 'lucide-react';

const TimelineEvent = ({ date, event, parties, isLast }) => (
    <div className={`relative ${!isLast ? 'pb-10' : ''}`}>
        {!isLast && <div className="absolute top-5 left-[11px] w-0.5 h-full bg-slate-700"></div>}
        <div className="absolute w-6 h-6 bg-blue-500/20 rounded-full mt-2 -left-[1px] border-4 border-slate-800 flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
        <div className="ml-10">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2">
                <time className="text-sm font-semibold text-blue-300">{date}</time>
                <span className="text-xs bg-purple-900/50 text-purple-300 px-2.5 py-1 rounded-md flex items-center gap-1.5"><Users className="w-3 h-3"/>{parties}</span>
            </div>
            <p className="text-white">{event}</p>
        </div>
    </div>
);

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
                setTimeline(response.data.timeline || []);
                setFileName(response.data.fileName || 'Case Timeline');
            } catch (err) {
                setError("Failed to load timeline data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTimeline();
    }, [documentId, timeline]);

    if (isLoading) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center"><p>Loading timeline...</p></div>;
    if (error) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center"><p>{error}</p></div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold">{fileName}</h1>
                    <p className="text-slate-400 mt-2">A chronological overview of key events from your document.</p>
                </header>
                <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                    {timeline && timeline.length > 0 ? (
                        <div className="relative">
                            {timeline.map((event, index) => (
                                <TimelineEvent 
                                    key={index}
                                    date={event.date}
                                    event={event.event}
                                    parties={event.parties}
                                    isLast={index === timeline.length - 1}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-slate-400">
                            <Calendar className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                            <h3 className="text-xl font-semibold text-white">No Timeline Available</h3>
                            <p>The AI could not extract a chronological timeline from this document.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}