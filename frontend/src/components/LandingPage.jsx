import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icon Components (Themed)
const UploadIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
);
const MapIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 10l-6-3m6 3V7" /></svg>
);
const ChatIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
);
const TimelineIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
);
// Themed Illustrations
const HeroIllustration = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative">
            <div className="absolute -rotate-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl w-72 h-80 border border-white/10"></div>
            <div className="absolute rotate-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl w-72 h-80 border border-white/10 transform translate-x-2 translate-y-2"></div>
            <div className="relative bg-gradient-to-br from-[#1a2c32]/50 to-[#1a2c32]/30 backdrop-blur-md rounded-2xl w-72 h-80 border border-white/20 p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="space-y-3">
                    <div className="h-2 bg-gray-400/40 rounded w-full"></div>
                    <div className="h-2 bg-gray-400/30 rounded w-4/5"></div>
                    <div className="h-2 bg-red-400/60 rounded w-full animate-pulse"></div>
                    <div className="h-2 bg-gray-400/30 rounded w-3/4"></div>
                    <div className="h-2 bg-amber-400/60 rounded w-full animate-pulse"></div>
                    <div className="h-2 bg-gray-400/30 rounded w-5/6"></div>
                </div>
                <div className="absolute -top-3 -right-3 bg-[#c5a35a] text-[#0d1a1e] text-xs font-bold px-3 py-2 rounded-full shadow-lg">AI Analyzed</div>
            </div>
            <div className="absolute -right-8 top-10 bg-red-500/80 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full animate-bounce">Risk Found</div>
            <div className="absolute -left-8 bottom-20 bg-green-500/80 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full animate-bounce animation-delay-1000">Safe Clause</div>
        </div>
    </div>
);
const UploadIllustration = () => (
    <div className="w-32 h-32 mx-auto mb-6 relative">
        <div className="w-full h-full bg-gradient-to-br from-[#c5a35a]/10 to-[#c5a35a]/5 rounded-3xl border-2 border-dashed border-[#c5a35a]/30 flex items-center justify-center">
            <div className="text-center"><div className="w-12 h-12 bg-[#c5a35a]/20 rounded-2xl flex items-center justify-center mx-auto mb-2"><UploadIcon /></div><div className="text-xs text-[#c5a35a] font-medium">Drop Files</div></div>
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"><svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg></div>
    </div>
);
const RiskMapIllustration = () => (
    <div className="w-32 h-32 mx-auto mb-6 relative"><div className="w-full h-full bg-gradient-to-br from-red-400/10 to-amber-400/10 rounded-3xl border border-red-400/20 p-4"><div className="grid grid-cols-3 gap-2 h-full"><div className="bg-green-400/30 rounded"></div><div className="bg-red-500/50 rounded animate-pulse"></div><div className="bg-green-400/30 rounded"></div><div className="bg-amber-400/40 rounded animate-pulse animation-delay-500"></div><div className="bg-green-400/30 rounded"></div><div className="bg-green-400/30 rounded"></div><div className="bg-green-400/30 rounded"></div><div className="bg-red-500/50 rounded animate-pulse animation-delay-1000"></div><div className="bg-green-400/30 rounded"></div></div></div></div>
);
const ChatIllustration = () => (
    <div className="w-32 h-32 mx-auto mb-6 relative"><div className="w-full h-full bg-gradient-to-br from-[#c5a35a]/10 to-[#c5a35a]/5 rounded-3xl border border-[#c5a35a]/20 p-4 flex flex-col justify-end"><div className="space-y-2"><div className="bg-[#c5a35a]/20 rounded-2xl px-3 py-2 text-xs text-[#c5a35a] self-start">What does clause 5 mean?</div><div className="bg-gray-500/20 rounded-2xl px-3 py-2 text-xs text-gray-300 self-end">It limits liability...</div><div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#c5a35a] rounded-full animate-bounce"></div><div className="w-2 h-2 bg-[#c5a35a] rounded-full animate-bounce animation-delay-200"></div><div className="w-2 h-2 bg-[#c5a35a] rounded-full animate-bounce animation-delay-400"></div></div></div></div></div>
);
const TimelineIllustration = () => (
    <div className="w-32 h-32 mx-auto mb-6 relative">
        <div className="w-full h-full bg-gradient-to-br from-[#c5a35a]/10 to-[#c5a35a]/5 rounded-3xl border border-[#c5a35a]/20 p-4 flex items-center justify-center">
            <div className="relative w-full h-full">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-[#c5a35a]/50"></div>
                <div className="absolute top-2 left-1/2 w-4 h-4 rounded-full bg-[#c5a35a] border-2 border-[#1a2c32] -translate-x-1/2"></div>
                <div className="absolute top-10 left-1/2 w-4 h-4 rounded-full bg-[#c5a35a] border-2 border-[#1a2c32] -translate-x-1/2 animate-pulse"></div>
                <div className="absolute bottom-2 left-1/2 w-4 h-4 rounded-full bg-[#c5a35a] border-2 border-[#1a2c32] -translate-x-1/2"></div>
            </div>
        </div>
    </div>
);

const EnhancedFeatureCard = ({ illustration, icon, title, children }) => (
    <div className="bg-[#1a2c32] backdrop-blur-md p-8 rounded-2xl border border-[#2a4a53] group transition-all duration-300 hover:border-[#c5a35a]/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#c5a35a]/10 text-center">
        {illustration}
        <div className="bg-[#c5a35a]/10 text-[#c5a35a] w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:bg-[#c5a35a]/20 transition-colors duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{children}</p>
    </div>
);

export default function LandingPage() {
  const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleAnalyzeDocument = () => {
        if (currentUser) {
            navigate('/dashboard');
        } else {
            navigate('/auth');
        }
    };
  return (
    <div className="bg-[#0d1a1e] text-white min-h-screen font-sans overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-[#0d1a1e] via-[#1a2c32] to-[#0d1a1e] pointer-events-none"></div>
      <div className="fixed top-0 left-0 w-96 h-96 bg-[#c5a35a]/5 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#c5a35a]/5 rounded-full blur-3xl animate-pulse pointer-events-none"></div>

      {/* Content Container */}
      <div className="relative z-10">
        {/* Hero Section */}
        <main className="container mx-auto px-6 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-12">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Turn Complex Contracts into
                <br />
                <span className="text-[#c5a35a]">
                  Simple Clarity.
                </span>
              </h2>
              <p className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                LawLytics is your AI-powered legal co-pilot, designed to decode legal jargon, highlight critical risks, and provide instant, understandable answers about any document.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={handleAnalyzeDocument}
                  className="bg-[#c5a35a] text-[#0d1a1e] hover:bg-[#b5944a] font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#c5a35a]/20 no-underline inline-block text-center"
                >
                  Analyze a Document
                </button>

                <button className="border-2 border-[#2a4a53] text-white font-semibold text-lg px-8 py-4 rounded-full hover:border-[#c5a35a]/50 hover:bg-[#c5a35a]/10 transition-all duration-300">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="relative h-96 lg:h-[32rem]">
              <HeroIllustration />
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section id="features" className="py-24 bg-black/10">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                Understand, Don't Just Read
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Our core features are designed to empower you with clarity and confidence when facing any legal document.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              <EnhancedFeatureCard 
                illustration={<UploadIllustration />}
                icon={<UploadIcon />} 
                title="Instant Upload & Scan"
              >
                Securely upload any PDF, image, or text file. Our AI gets to work in seconds, analyzing every clause and condition.
              </EnhancedFeatureCard>
              <EnhancedFeatureCard 
                illustration={<RiskMapIllustration />}
                icon={<MapIcon />} 
                title="Visual Risk Mapping"
              >
                Instantly see risky clauses highlighted in red. No more surprises hiding in the fine print—everything is crystal clear.
              </EnhancedFeatureCard>
              <EnhancedFeatureCard 
                illustration={<ChatIllustration />}
                icon={<ChatIcon />} 
                title="Conversational Q&A"
              >
                Ask "what if" questions and get simple answers in plain English, like having a lawyer on call 24/7.
              </EnhancedFeatureCard>
              <EnhancedFeatureCard 
                illustration={<TimelineIllustration />}
                icon={<TimelineIcon />} 
                title="Timeline Generation"
              >
                Automatically extract and visualize key dates, deadlines, and events from your documents into an interactive timeline.
              </EnhancedFeatureCard>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-24">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                How It Works
              </h3>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Get from confusion to clarity in three simple steps
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center group">
                <div className="bg-[#c5a35a]/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-[#c5a35a]">1</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Upload Your Document</h4>
                <p className="text-gray-400">Simply drag and drop or browse to upload any legal document</p>
              </div>
              <div className="text-center group">
                <div className="bg-[#c5a35a]/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-[#c5a35a]">2</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">AI Analysis</h4>
                <p className="text-gray-400">Our AI scans and analyzes every clause, identifies risks and opportunities, and generates an interactive timeline of key events and deadlines</p>
              </div>
              <div className="text-center group">
                <div className="bg-[#c5a35a]/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-[#c5a35a]">3</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Get Instant Insights</h4>
                <p className="text-gray-400">Receive a clear summary with actionable recommendations and Q&A</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-6 text-center max-w-4xl">
            <h3 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Decode Your Next Contract?
            </h3>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who trust LawLytics to make sense of complex legal documents.
            </p>
            <Link 
              to="/dashboard" 
              className="bg-[#c5a35a] text-[#0d1a1e] hover:bg-[#b5944a] font-bold text-xl px-12 py-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-[#c5a35a]/20 inline-block no-underline"
            >
              Start Analyzing Now - Free
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/20 text-gray-400/70 text-center py-8 border-t border-[#2a4a53]">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <svg className="w-6 h-6 text-[#c5a35a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.375a6.375 6.375 0 0 0 6.375-6.375a6.375 6.375 0 0 0-6.375-6.375a6.375 6.375 0 0 0-6.375 6.375a6.375 6.375 0 0 0 6.375 6.375Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5l-4.5-4.5" />
              </svg>
              <span className="text-lg font-semibold text-white">LawLytics</span>
            </div>
            <p className="text-sm">&copy; 2025 LawLytics. All Rights Reserved. Empowering Clarity in a Complex World.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

