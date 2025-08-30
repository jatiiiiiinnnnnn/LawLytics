import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
    Calendar, Users, FileText, Gavel, MessageSquare, Clock, List, ArrowRight,
    Search, Filter, Download, Share2, Eye, Play, Pause,
    ChevronLeft, ChevronRight, Bookmark, Tag,
    AlertCircle, CheckCircle, XCircle, Star, Activity
} from 'lucide-react';

// --- Helper Components ---

// Enhanced helper function for event categorization
const getEventIcon = (eventText) => {
    const text = eventText.toLowerCase();
    if (text.includes('filed') || text.includes('submitted') || text.includes('document')) {
        return { Icon: FileText, color: 'text-blue-400', category: 'filing' };
    }
    if (text.includes('hearing') || text.includes('court') || text.includes('judge') || text.includes('trial')) {
        return { Icon: Gavel, color: 'text-amber-400', category: 'legal' };
    }
    if (text.includes('communication') || text.includes('email') || text.includes('call') || text.includes('meeting')) {
        return { Icon: MessageSquare, color: 'text-teal-400', category: 'communication' };
    }
    if (text.includes('deadline') || text.includes('due') || text.includes('expires')) {
        return { Icon: AlertCircle, color: 'text-red-400', category: 'deadline' };
    }
    if (text.includes('approved') || text.includes('granted') || text.includes('success')) {
        return { Icon: CheckCircle, color: 'text-green-400', category: 'success' };
    }
    if (text.includes('denied') || text.includes('rejected') || text.includes('dismissed')) {
        return { Icon: XCircle, color: 'text-red-400', category: 'rejection' };
    }
    return { Icon: Calendar, color: 'text-slate-400', category: 'general' };
};

// Enhanced Timeline Card with animations and interactions
const TimelineCard = ({ date, event, parties, isFirst, isLast, index, onClick, isSelected, isBookmarked, onBookmark }) => {
    const { Icon, color } = getEventIcon(event);
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
        <div 
            className={`relative flex-shrink-0 w-80 p-6 border rounded-2xl group transition-all duration-500 cursor-pointer transform
                ${isSelected ? 'bg-blue-900/30 border-blue-400 scale-105 shadow-2xl shadow-blue-500/20' : 'bg-slate-800/50 border-slate-700'}
                hover:border-blue-500/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10
            `}
            onClick={() => onClick(index)}
            style={{ 
                animation: `slideIn 0.6s ease-out ${index * 0.1}s both`,
            }}
        >
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <time className="text-sm font-semibold text-blue-300 bg-blue-900/30 px-2 py-1 rounded-md">
                        {new Date(date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                        })}
                    </time>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onBookmark(index); }}
                            className={`p-1 rounded transition-colors ${isBookmarked ? 'text-yellow-400' : 'text-slate-400 hover:text-yellow-400'}`}
                        >
                            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                        <div className={`w-10 h-10 flex items-center justify-center bg-slate-700 rounded-full border-2 border-slate-600 group-hover:bg-blue-500/20 transition-all duration-300 group-hover:rotate-12`}>
                            <Icon className={`w-5 h-5 ${color} transition-transform group-hover:scale-110`} />
                        </div>
                    </div>
                </div>
                
                <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-20'} overflow-hidden`}>
                    <p className="text-white font-semibold mb-2 line-clamp-3">{event}</p>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                    <span className="text-xs bg-purple-900/50 text-purple-300 px-2.5 py-1 rounded-md flex items-center gap-1.5 w-fit">
                        <Users className="w-3 h-3"/>{parties}
                    </span>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Enhanced Stats Card
const StatCard = ({ title, value, icon: Icon, color = 'teal' }) => (
    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center gap-4 transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-700/50 cursor-pointer">
        <div className={`w-12 h-12 flex-shrink-0 bg-slate-700 text-${color}-300 rounded-xl flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

// Filter and Control Panel
const ControlPanel = ({ filters, onFilterChange, isPlaying, onPlayPause, speed, onSpeedChange }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                    type="text"
                    placeholder="Search events..."
                    className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    value={filters.search}
                    onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                />
            </div>
            
            <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select 
                    className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    value={filters.category}
                    onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
                >
                    <option value="all">All Categories</option>
                    <option value="legal">Legal</option>
                    <option value="filing">Filing</option>
                    <option value="communication">Communication</option>
                    <option value="deadline">Deadlines</option>
                </select>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
                <button 
                    onClick={onPlayPause}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pause' : 'Auto Play'}
                </button>
                
                <select 
                    value={speed}
                    onChange={(e) => onSpeedChange(Number(e.target.value))}
                    className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={2}>2x</option>
                    <option value={5}>5x</option>
                </select>
            </div>
        </div>
    </div>
);

// --- Main Component ---
export default function TimelineView() {
    const { id: documentId } = useParams();
    const location = useLocation();
    
    // State to hold dynamic data
    const [timeline, setTimeline] = useState(location.state?.timeline || null);
    const [fileName, setFileName] = useState(location.state?.fileName || 'Case Timeline');
    const [isLoading, setIsLoading] = useState(!timeline);
    const [error, setError] = useState('');

    // State for interactive features
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [bookmarkedEvents, setBookmarkedEvents] = useState(new Set());
    const [filters, setFilters] = useState({ search: '', category: 'all' });
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
    const playInterval = useRef(null);

    // Fetch data from backend if not passed via state
    useEffect(() => {
        if (timeline) return;

        const fetchTimeline = async () => {
            try {
                const response = await axios.get(`/api/document/${documentId}`);
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

    // Filter timeline based on search and category
    const filteredTimeline = timeline ? timeline.filter(event => {
        const matchesSearch = event.event.toLowerCase().includes(filters.search.toLowerCase()) ||
                              event.parties.toLowerCase().includes(filters.search.toLowerCase());
        const matchesCategory = filters.category === 'all' || getEventIcon(event.event).category === filters.category;
        return matchesSearch && matchesCategory;
    }) : [];

    // Auto-play functionality
    useEffect(() => {
        if (isPlaying && filteredTimeline.length > 0) {
            playInterval.current = setInterval(() => {
                setCurrentPlayIndex(prev => {
                    const next = (prev + 1) % filteredTimeline.length;
                    setSelectedEvent(next);
                    return next;
                });
            }, 3000 / speed);
        } else {
            clearInterval(playInterval.current);
        }
        
        return () => clearInterval(playInterval.current);
    }, [isPlaying, speed, filteredTimeline]);


    const handleBookmark = (index) => {
        setBookmarkedEvents(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) newSet.delete(index);
            else newSet.add(index);
            return newSet;
        });
    };

    const calculateDuration = () => {
        if (!filteredTimeline || filteredTimeline.length < 2) return "N/A";
        const firstDate = new Date(filteredTimeline[0].date);
        const lastDate = new Date(filteredTimeline[filteredTimeline.length - 1].date);
        const diffTime = Math.abs(lastDate - firstDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} days`;
    };

    if (isLoading) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center"><p>Loading timeline...</p></div>;
    if (error) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center"><p>{error}</p></div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
            <div className="max-w-7xl mx-auto p-8">
                <header className="mb-8 text-center">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{fileName}</h1>
                    <p className="text-slate-400 text-lg mt-2">An intelligent, interactive timeline visualization.</p>
                </header>

                <ControlPanel 
                    filters={filters}
                    onFilterChange={setFilters}
                    isPlaying={isPlaying}
                    onPlayPause={() => setIsPlaying(!isPlaying)}
                    speed={speed}
                    onSpeedChange={setSpeed}
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <StatCard title="Total Events" value={filteredTimeline.length} icon={List} color="blue" />
                    <StatCard title="Case Duration" value={calculateDuration()} icon={Clock} color="amber" />
                    <StatCard title="Bookmarked" value={bookmarkedEvents.size} icon={Bookmark} color="yellow" />
                    <StatCard title="Categories" value={Object.keys(filteredTimeline.reduce((acc, event) => ({...acc, [getEventIcon(event.event).category]: true}), {})).length} icon={Tag} color="purple" />
                </div>
                
                <div className="relative">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <ArrowRight className="text-blue-400"/> Interactive Timeline
                    </h2>
                    
                    {filteredTimeline.length > 0 ? (
                        <div className="relative">
                            <div className="flex overflow-x-auto space-x-8 pb-8 custom-scrollbar scroll-smooth">
                                {filteredTimeline.map((event, index) => (
                                    <TimelineCard 
                                        key={`${event.date}-${index}`}
                                        date={event.date}
                                        event={event.event}
                                        parties={event.parties}
                                        isFirst={index === 0}
                                        isLast={index === filteredTimeline.length - 1}
                                        index={index}
                                        onClick={setSelectedEvent}
                                        isSelected={selectedEvent === index}
                                        isBookmarked={bookmarkedEvents.has(index)}
                                        onBookmark={handleBookmark}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700">
                            <Activity className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                            <h3 className="text-xl font-semibold text-white">No Events Found</h3>
                            <p className="text-slate-400">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                </div>
            </div>
            
            <style jsx>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(50px) scale(0.8); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .custom-scrollbar::-webkit-scrollbar { height: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #1e293b; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(90deg, #3b82f6, #8b5cf6); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(90deg, #2563eb, #7c3aed); }
            `}</style>
        </div>
    );
}

