import React, { useState, useEffect } from 'react';
import { 
    Upload, FileText, MessageSquare, Calendar, Shield, Search, 
    ArrowRight, Play, CheckCircle, Star, Zap, Users, Award,
    ChevronRight, Download, Share2, BarChart, Eye, Clock
} from 'lucide-react';

// Enhanced Feature Card Component
const EnhancedFeatureCard = ({ illustration, icon, title, children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay * 100);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div className={`group relative bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-700 hover:border-teal-400/50 hover:bg-slate-700/20 hover:transform hover:scale-105 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative z-10">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {icon}
                </div>
                
                {/* Title */}
                <h4 className="text-xl font-bold text-white mb-4 group-hover:text-teal-300 transition-colors duration-300">
                    {title}
                </h4>
                
                {/* Description */}
                <p className="text-purple-200/80 leading-relaxed group-hover:text-purple-200 transition-colors duration-300">
                    {children}
                </p>
            </div>
            
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
    );
};

// Floating icons for hero background
const FloatingIcon = ({ icon: Icon, delay, size = "w-8 h-8" }) => (
    <div 
        className={`absolute text-teal-300/20 ${size} animate-float`}
        style={{ 
            animationDelay: `${delay}s`,
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`
        }}
    >
        <Icon />
    </div>
);

// Hero Illustration Component
const HeroIllustration = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        {/* Background floating icons */}
        <FloatingIcon icon={FileText} delay={0} />
        <FloatingIcon icon={Shield} delay={1} />
        <FloatingIcon icon={Calendar} delay={2} />
        <FloatingIcon icon={BarChart} delay={3} />
        <FloatingIcon icon={Search} delay={4} />
        
        {/* Central illustration */}
        <div className="relative w-80 h-80 bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-3xl border border-white/20 backdrop-blur-sm">
            <div className="absolute inset-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10">
                <div className="p-6 h-full flex flex-col justify-center">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <div className="h-2 bg-slate-600 rounded flex-1"></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                            <div className="h-2 bg-slate-600 rounded flex-1"></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                            <div className="h-2 bg-slate-600 rounded flex-1"></div>
                        </div>
                        <div className="mt-6 p-4 bg-teal-500/20 rounded-lg border border-teal-400/30">
                            <Calendar className="w-8 h-8 text-teal-300 mx-auto animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Stats Counter Component
const StatsCounter = ({ end, label, icon: Icon }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setCount(prev => {
                if (prev < end) {
                    return Math.min(prev + Math.ceil(end / 50), end);
                }
                clearInterval(timer);
                return end;
            });
        }, 50);
        
        return () => clearInterval(timer);
    }, [end]);
    
    return (
        <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-8 h-8 text-teal-300" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{count.toLocaleString()}+</div>
            <div className="text-purple-200/80">{label}</div>
        </div>
    );
};

// Main Landing Page Component
export default function LandingPage() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    
    const testimonials = [
        {
            text: "LawLytics saved me hours of document review. The timeline feature is incredible!",
            author: "Sarah Chen",
            role: "Corporate Lawyer",
            rating: 5
        },
        {
            text: "Finally, a tool that makes legal documents accessible to everyone on our team.",
            author: "Michael Rodriguez",
            role: "Startup Founder",
            rating: 5
        },
        {
            text: "The AI risk analysis caught issues our team missed. Absolutely essential.",
            author: "Jennifer Park",
            role: "Contract Manager",
            rating: 5
        }
    ];
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#0D0B1A] text-white min-h-screen font-sans overflow-x-hidden">
            {/* Enhanced Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-[#0D0B1A] via-[#1A113C] to-[#0D0B1A] pointer-events-none"></div>
            <div className="fixed top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
            <div className="fixed bottom-[-20%] right-[-10%] w-[40rem] h-[40rem] bg-teal-500/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-gradient-to-r from-purple-600/5 to-teal-500/5 rounded-full blur-3xl animate-spin-slow pointer-events-none"></div>

            {/* Content Container */}
            <div className="relative z-10">
                {/* Navigation Bar */}
                <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">LawLytics</span>
                            </div>
                            <div className="hidden md:flex items-center gap-8">
                                <a href="#features" className="text-purple-200/80 hover:text-white transition-colors">Features</a>
                                <a href="#how-it-works" className="text-purple-200/80 hover:text-white transition-colors">How It Works</a>
                                <a href="#testimonials" className="text-purple-200/80 hover:text-white transition-colors">Testimonials</a>
                                <button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold px-6 py-2 rounded-full hover:from-teal-600 hover:to-teal-700 transition-all duration-300">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Enhanced Hero Section */}
                <main className="container mx-auto px-6 py-20 md:py-32 max-w-7xl">
                    <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-12">
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500/20 to-purple-500/20 px-4 py-2 rounded-full border border-teal-400/30 mb-6">
                                <Zap className="w-4 h-4 text-teal-400" />
                                <span className="text-sm font-semibold text-teal-300">AI-Powered Legal Analysis</span>
                            </div>
                            
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                                Turn Complex Contracts into
                                <br />
                                <span className="bg-gradient-to-r from-teal-400 to-purple-400 text-transparent bg-clip-text">
                                    Simple Clarity.
                                </span>
                            </h1>
                            
                            <p className="text-lg text-purple-200/80 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                                LawLytics is your AI-powered legal co-pilot, designed to decode jargon, highlight critical risks, 
                                and generate interactive case timelines from any legal document.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                                <button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:text-white font-bold text-lg px-8 py-4 rounded-full hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/30 flex items-center justify-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Analyze a Document
                                </button>
                                <button className="border-2 border-white/20 text-white font-semibold text-lg px-8 py-4 rounded-full hover:border-teal-400/50 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2">
                                    <Play className="w-5 h-5" />
                                    Watch Demo
                                </button>
                            </div>
                            
                            {/* Trust indicators */}
                            <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-purple-200/60">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span>100% Secure</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span>GDPR Compliant</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span>Free Trial</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative h-96 lg:h-[32rem]">
                            <HeroIllustration />
                        </div>
                    </div>
                </main>

                {/* Stats Section */}
                <section className="py-16 border-y border-white/10 bg-white/5">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <StatsCounter end={10000} label="Documents Analyzed" icon={FileText} />
                            <StatsCounter end={5000} label="Happy Users" icon={Users} />
                            <StatsCounter end={95} label="Accuracy Rate" icon={Award} />
                            <StatsCounter end={24} label="Hour Support" icon={Clock} />
                        </div>
                    </div>
                </section>

                {/* Enhanced Features Section */}
                <section id="features" className="py-24">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                A Complete Legal Intelligence Toolkit
                            </h2>
                            <p className="text-purple-200/80 text-lg leading-relaxed">
                                From critical risk assessment to chronological case summaries, gain a complete understanding of your legal documents.
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-screen-xl mx-auto">
                            <EnhancedFeatureCard 
                                icon={<Upload className="w-8 h-8 text-teal-400" />} 
                                title="Instant Upload & Scan" 
                                delay={0}
                            >
                                Securely upload any PDF, image, or text file. Our AI gets to work in seconds, analyzing every clause and condition.
                            </EnhancedFeatureCard>
                            
                            <EnhancedFeatureCard 
                                icon={<Shield className="w-8 h-8 text-red-400" />} 
                                title="Visual Risk Mapping" 
                                delay={1}
                            >
                                Instantly see risky clauses highlighted in red. No more surprises hiding in the fine print—everything is crystal clear.
                            </EnhancedFeatureCard>
                            
                            <EnhancedFeatureCard 
                                icon={<Calendar className="w-8 h-8 text-amber-400" />} 
                                title="AI Timeline Generation" 
                                delay={2}
                            >
                                Automatically extract key events to generate an interactive, visual timeline of your case with animated storytelling.
                            </EnhancedFeatureCard>
                            
                            <EnhancedFeatureCard 
                                icon={<MessageSquare className="w-8 h-8 text-purple-400" />} 
                                title="Conversational Q&A" 
                                delay={3}
                            >
                                Ask "what if" questions and get simple answers in plain English, like having a lawyer on call 24/7.
                            </EnhancedFeatureCard>
                        </div>
                    </div>
                </section>
                
                {/* How It Works Section */}
                <section id="how-it-works" className="py-24 bg-white/5">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                How It Works
                            </h2>
                            <p className="text-purple-200/80 text-lg max-w-2xl mx-auto">
                                Get from confusion to clarity in three simple steps
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <div className="text-center group relative">
                                <div className="bg-gradient-to-br from-teal-500/20 to-purple-500/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl font-bold text-teal-300">1</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Upload Your Document</h3>
                                <p className="text-purple-200/80">Simply drag and drop or browse to upload any legal document in seconds.</p>
                                
                                {/* Connecting arrow */}
                                <div className="hidden md:block absolute top-10 -right-4 w-8 h-8">
                                    <ChevronRight className="w-8 h-8 text-purple-400/50" />
                                </div>
                            </div>
                            
                            <div className="text-center group relative">
                                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl font-bold text-purple-300">2</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Choose Analysis Type</h3>
                                <p className="text-purple-200/80">Select between detailed Risk Analysis or interactive Case Timeline generation.</p>
                                
                                {/* Connecting arrow */}
                                <div className="hidden md:block absolute top-10 -right-4 w-8 h-8">
                                    <ChevronRight className="w-8 h-8 text-purple-400/50" />
                                </div>
                            </div>
                            
                            <div className="text-center group">
                                <div className="bg-gradient-to-br from-pink-500/20 to-teal-500/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl font-bold text-pink-300">3</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Get Instant Insights</h3>
                                <p className="text-purple-200/80">Receive clear summaries, risk reports, or visual timelines with actionable recommendations.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-24">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Trusted by Legal Professionals
                            </h2>
                            <p className="text-purple-200/80 text-lg max-w-2xl mx-auto">
                                See what our users are saying about their experience with LawLytics
                            </p>
                        </div>
                        
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                                <div className="flex justify-center mb-4">
                                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <blockquote className="text-xl text-white mb-6 italic">
                                    "{testimonials[currentTestimonial].text}"
                                </blockquote>
                                <div>
                                    <div className="font-semibold text-white">{testimonials[currentTestimonial].author}</div>
                                    <div className="text-purple-200/80">{testimonials[currentTestimonial].role}</div>
                                </div>
                            </div>
                            
                            {/* Testimonial dots */}
                            <div className="flex justify-center mt-8 gap-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentTestimonial(index)}
                                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                                            index === currentTestimonial ? 'bg-teal-400' : 'bg-white/30'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Enhanced CTA Section */}
                <section className="py-24 bg-gradient-to-r from-teal-500/10 to-purple-500/10">
                    <div className="container mx-auto px-6 text-center max-w-4xl">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready to Decode Your Next Contract?
                        </h2>
                        <p className="text-purple-200/80 text-lg mb-10 max-w-2xl mx-auto">
                            Join thousands of professionals who trust LawLytics to make sense of complex legal documents.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:text-white font-bold text-xl px-12 py-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-teal-500/30 inline-flex items-center justify-center gap-3">
                                <FileText className="w-6 h-6" />
                                Start Analyzing Now - Free
                            </button>
                            <button className="border-2 border-white/20 text-white font-semibold text-xl px-12 py-5 rounded-full hover:border-teal-400/50 hover:bg-white/5 transition-all duration-300 inline-flex items-center justify-center gap-3">
                                <Download className="w-6 h-6" />
                                Download Brochure
                            </button>
                        </div>
                    </div>
                </section>

                {/* Enhanced Footer */}
                <footer className="bg-black/20 text-purple-200/70 py-12 border-t border-white/10">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="grid md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-lg font-semibold text-white">LawLytics</span>
                                </div>
                                <p className="text-sm">Empowering clarity in a complex legal world through AI-powered analysis.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-4">Product</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-4">Company</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-4">Support</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="text-center pt-8 border-t border-white/10">
                            <p className="text-sm">&copy; 2025 LawLytics. All Rights Reserved. Empowering Clarity in a Complex World.</p>
                        </div>
                    </div>
                </footer>
            </div>
            
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                
                @keyframes spin-slow {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
            `}</style>
        </div>
    );
}