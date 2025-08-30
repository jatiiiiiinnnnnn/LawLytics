import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
    Calendar, Users, FileText, Gavel, MessageSquare, Clock, List, ArrowRight,
    Search, Filter, Download, Share2, Eye, Play, Pause,
    ChevronLeft, ChevronRight, Bookmark, Tag,
    AlertCircle, CheckCircle, XCircle, Star, Activity,
    ArrowDown, Navigation
} from 'lucide-react';

// --- Helper Components (No changes needed here) ---

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

const AnimatedPointer = ({ isVisible, isMoving }) => (
    <div className={`absolute left-8 w-6 h-6 transition-all duration-500 z-20 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
        <div className={`relative w-full h-full ${isMoving ? 'animate-bounce' : ''}`}>
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <Navigation className="w-3 h-3 text-white transform rotate-180" />
            </div>
            <div className="absolute -inset-2 bg-blue-500/30 rounded-full blur-sm animate-pulse"></div>
        </div>
    </div>
);

const VerticalTimelineCard = ({ date, event, parties, index, onClick, isSelected, isBookmarked, onBookmark, isCurrentAutoPlay, cardRef }) => {
    const { Icon, color } = getEventIcon(event);
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
        <div 
            ref={cardRef}
            className={`relative flex gap-8 p-6 transition-all duration-500 cursor-pointer group ${isCurrentAutoPlay ? 'transform scale-105' : ''}`}
            onClick={() => onClick(index)}
            style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
        >
            <div className="relative flex flex-col items-center">
                {index > 0 && (
                    <div className={`w-1 h-8 transition-colors duration-500 ${isCurrentAutoPlay ? 'bg-gradient-to-b from-blue-500 to-purple-600' : 'bg-slate-600'}`}></div>
                )}
                <div className={`relative w-12 h-12 flex items-center justify-center rounded-full border-4 transition-all duration-500 z-10
                    ${isCurrentAutoPlay 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-white shadow-2xl shadow-blue-500/50 scale-125' 
                        : isSelected 
                            ? 'bg-slate-700 border-blue-400 shadow-xl shadow-blue-500/20' 
                            : 'bg-slate-800 border-slate-600 group-hover:border-blue-400'
                    }
                `}>
                    <Icon className={`w-5 h-5 transition-all duration-300 ${isCurrentAutoPlay ? 'text-white scale-110' : isSelected ? 'text-blue-400' : color} group-hover:scale-110`} />
                </div>
                <div className={`w-1 flex-1 min-h-8 transition-colors duration-500 ${isCurrentAutoPlay ? 'bg-gradient-to-b from-purple-600 to-slate-600' : 'bg-slate-600'}`}></div>
            </div>
            
            <div className={`flex-1 bg-slate-800/50 border rounded-2xl p-6 transition-all duration-500 group-hover:border-blue-500/50 group-hover:bg-slate-700/50
                ${isCurrentAutoPlay ? 'bg-blue-900/30 border-blue-400 shadow-2xl shadow-blue-500/20' : 'border-slate-700'}
                ${isSelected ? 'bg-blue-900/20 border-blue-500' : ''}
            `}>
                <div className="flex items-start justify-between mb-4">
                    <time className={`text-sm font-semibold px-3 py-1 rounded-lg transition-colors duration-300 ${isCurrentAutoPlay ? 'bg-blue-500 text-white' : 'bg-blue-900/30 text-blue-300'}`}>
                        {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
                    </time>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onBookmark(index); }}
                            className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'text-yellow-400 bg-yellow-900/30' : 'text-slate-400 hover:text-yellow-400 hover:bg-yellow-900/20'}`}
                        >
                            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                            className="p-2 text-slate-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-900/20"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                
                <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-24'} overflow-hidden`}>
                    <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${isCurrentAutoPlay ? 'text-blue-200' : 'text-white'}`}>
                        {event}
                    </h3>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                    <span className="text-sm px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors duration-300 bg-purple-900/50 text-purple-300">
                        <Users className="w-4 h-4"/>
                        {parties}
                    </span>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color = 'teal' }) => (
    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
        <div className={`w-12 h-12 flex-shrink-0 bg-slate-700 text-${color}-300 rounded-xl flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const ControlPanel = ({ filters, onFilterChange, isPlaying, onPlayPause, speed, onSpeedChange }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8 sticky top-4 z-30 backdrop-blur-sm">
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        isPlaying 
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                    }`}
                >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pause Story' : 'Play Story'}
                </button>
                
                <select 
                    value={speed}
                    onChange={(e) => onSpeedChange(Number(e.target.value))}
                    className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    disabled={!isPlaying}
                >
                    <option value={0.5}>0.5x Slow</option>
                    <option value={1}>1x Normal</option>
                    <option value={1.5}>1.5x Fast</option>
                    <option value={2}>2x Faster</option>
                </select>
            </div>
        </div>
    </div>
);

// --- Main Component ---
export default function TimelineView() {
    const { id: documentId } = useParams();
    const location = useLocation();
    
    // State to hold dynamic data fetched from the backend
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
    const cardRefs = useRef([]);

    // Fetch data from backend if it wasn't passed via navigation state
    useEffect(() => {
        if (timeline) {
            setIsLoading(false);
            return;
        }

        const fetchTimelineData = async () => {
            try {
                const response = await axios.get(`/api/document/${documentId}`);
                const sortedTimeline = (response.data.timeline || []).sort((a, b) => new Date(a.date) - new Date(b.date));
                setTimeline(sortedTimeline);
                setFileName(response.data.fileName || 'Case Timeline');
            } catch (err) {
                setError("Failed to load timeline data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTimelineData();
    }, [documentId, timeline]);

    // Filter timeline based on current search and category filters
    const filteredTimeline = timeline ? timeline.filter(event => {
        const matchesSearch = event.event.toLowerCase().includes(filters.search.toLowerCase()) ||
                              event.parties.toLowerCase().includes(filters.search.toLowerCase());
        const matchesCategory = filters.category === 'all' || getEventIcon(event.event).category === filters.category;
        return matchesSearch && matchesCategory;
    }) : [];
    
    // Auto-play functionality with smooth scrolling
    useEffect(() => {
        if (isPlaying && filteredTimeline.length > 0) {
            playInterval.current = setInterval(() => {
                setCurrentPlayIndex(prev => {
                    const next = (prev + 1) % filteredTimeline.length;
                    
                    if (cardRefs.current[next]) {
                        cardRefs.current[next].scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                        });
                    }
                    
                    setSelectedEvent(next);
                    return next;
                });
            }, 4000 / speed);
        } else {
            clearInterval(playInterval.current);
        }
        
        return () => clearInterval(playInterval.current);
    }, [isPlaying, speed, filteredTimeline.length]);

    useEffect(() => {
        cardRefs.current = cardRefs.current.slice(0, filteredTimeline.length);
    }, [filteredTimeline]);

    const handleBookmark = (index) => {
        setBookmarkedEvents(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) newSet.delete(index);
            else newSet.add(index);
            return newSet;
        });
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
        if (!isPlaying && filteredTimeline.length > 0) {
            if (currentPlayIndex >= filteredTimeline.length - 1) {
                setCurrentPlayIndex(0);
            }
        }
    };
    
    const calculateDuration = () => {
        if (!filteredTimeline || filteredTimeline.length < 2) return "N/A";
        const firstDate = new Date(filteredTimeline[0].date);
        const lastDate = new Date(filteredTimeline[filteredTimeline.length - 1].date);
        const diffTime = Math.abs(lastDate - firstDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} days`;
    };

    // Render Guards for loading and error states
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p>Loading timeline...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <div className="text-center p-8 bg-slate-800 rounded-lg">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p className="text-slate-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
            <div className="max-w-4xl mx-auto p-8">
                <header className="mb-8 text-center">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {fileName}
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto mt-2">
                        Follow the story as it unfolds. Press play to experience an animated journey through key events.
                    </p>
                </header>

                <ControlPanel 
                    filters={filters}
                    onFilterChange={setFilters}
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                    speed={speed}
                    onSpeedChange={setSpeed}
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <StatCard title="Total Events" value={filteredTimeline.length} icon={List} color="blue" />
                    <StatCard title="Case Duration" value={calculateDuration()} icon={Clock} color="amber" />
                    <StatCard title="Bookmarked" value={bookmarkedEvents.size} icon={Bookmark} color="yellow" />
                    <StatCard title="Current Event" value={isPlaying ? `${currentPlayIndex + 1}/${filteredTimeline.length}` : '-'} icon={Navigation} color="purple" />
                </div>
                
                {isPlaying && (
                    <div className="mb-8 bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-slate-400">Story Progress</span>
                            <span className="text-sm text-blue-400 font-semibold">
                                {filteredTimeline[currentPlayIndex]?.date} - Event {currentPlayIndex + 1} of {filteredTimeline.length}
                            </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out relative"
                                style={{ width: `${((currentPlayIndex + 1) / filteredTimeline.length) * 100}%` }}
                            >
                                <div className="absolute right-0 top-0 h-full w-4 bg-white/30 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="relative">
                    {filteredTimeline.length > 0 ? (
                        <div className="relative">
                            <div className="space-y-0">
                                {filteredTimeline.map((event, index) => (
                                    <VerticalTimelineCard 
                                        key={`${event.date}-${index}`}
                                        date={event.date}
                                        event={event.event}
                                        parties={event.parties}
                                        index={index}
                                        onClick={setSelectedEvent}
                                        isSelected={!isPlaying && selectedEvent === index}
                                        isBookmarked={bookmarkedEvents.has(index)}
                                        onBookmark={handleBookmark}
                                        isCurrentAutoPlay={isPlaying && currentPlayIndex === index}
                                        cardRef={el => cardRefs.current[index] = el}
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
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

