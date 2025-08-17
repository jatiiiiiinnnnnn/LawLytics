import React from 'react';
import { Link } from 'react-router-dom';

// Icon Components (replace with your preferred icon library like react-icons)
const UploadIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
);
const MapIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 10l-6-3m6 3V7" /></svg>
);
const ChatIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
);

const FeatureCard = ({ icon, title, children }) => (
  <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 group transition-all duration-300 hover:border-teal-400/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-400/10">
    <div className="bg-teal-400/10 text-teal-300 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-400/20 transition-colors duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-purple-200/80 leading-relaxed">{children}</p>
  </div>
);

// Hero Illustration Component
const HeroIllustration = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Document Stack */}
    <div className="relative">
      {/* Background documents */}
      <div className="absolute -rotate-6 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl w-72 h-80 border border-white/20"></div>
      <div className="absolute rotate-3 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-2xl w-72 h-80 border border-white/20 transform translate-x-2 translate-y-2"></div>
      
      {/* Main document */}
      <div className="relative bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md rounded-2xl w-72 h-80 border border-white/30 p-6 shadow-2xl">
        {/* Document header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
        
        {/* Document content lines */}
        <div className="space-y-3">
          <div className="h-2 bg-white/40 rounded w-full"></div>
          <div className="h-2 bg-white/30 rounded w-4/5"></div>
          <div className="h-2 bg-red-400/60 rounded w-full animate-pulse"></div>
          <div className="h-2 bg-white/30 rounded w-3/4"></div>
          <div className="h-2 bg-yellow-400/60 rounded w-full animate-pulse"></div>
          <div className="h-2 bg-white/30 rounded w-5/6"></div>
          <div className="h-2 bg-white/30 rounded w-2/3"></div>
          <div className="h-2 bg-teal-400/60 rounded w-full animate-pulse"></div>
        </div>
        
        {/* AI Analysis Badge */}
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-teal-500 to-purple-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg">
          AI Analyzed
        </div>
      </div>
      
      {/* Floating analysis bubbles */}
      <div className="absolute -right-8 top-10 bg-red-500/80 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full animate-bounce">
        Risk Found
      </div>
      <div className="absolute -left-8 bottom-20 bg-teal-500/80 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full animate-bounce animation-delay-1000">
        Safe Clause
      </div>
    </div>
  </div>
);

// Feature illustration components
const UploadIllustration = () => (
  <div className="w-32 h-32 mx-auto mb-6 relative">
    <div className="w-full h-full bg-gradient-to-br from-teal-400/20 to-purple-400/20 rounded-3xl border-2 border-dashed border-teal-400/40 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-teal-400/30 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <UploadIcon />
        </div>
        <div className="text-xs text-teal-300 font-medium">Drop Files</div>
      </div>
    </div>
    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
      </svg>
    </div>
  </div>
);

const RiskMapIllustration = () => (
  <div className="w-32 h-32 mx-auto mb-6 relative">
    <div className="w-full h-full bg-gradient-to-br from-red-400/10 to-yellow-400/10 rounded-3xl border border-red-400/20 p-4">
      <div className="grid grid-cols-3 gap-2 h-full">
        <div className="bg-green-400/30 rounded"></div>
        <div className="bg-red-500/50 rounded animate-pulse"></div>
        <div className="bg-green-400/30 rounded"></div>
        <div className="bg-yellow-400/40 rounded animate-pulse animation-delay-500"></div>
        <div className="bg-green-400/30 rounded"></div>
        <div className="bg-green-400/30 rounded"></div>
        <div className="bg-green-400/30 rounded"></div>
        <div className="bg-red-500/50 rounded animate-pulse animation-delay-1000"></div>
        <div className="bg-green-400/30 rounded"></div>
      </div>
    </div>
  </div>
);

const ChatIllustration = () => (
  <div className="w-32 h-32 mx-auto mb-6 relative">
    <div className="w-full h-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-3xl border border-blue-400/20 p-4 flex flex-col justify-end">
      <div className="space-y-2">
        <div className="bg-blue-500/30 rounded-2xl px-3 py-2 text-xs text-blue-200 self-start">
          What does clause 5 mean?
        </div>
        <div className="bg-teal-500/30 rounded-2xl px-3 py-2 text-xs text-teal-200 self-end">
          It limits liability to $1000 maximum
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>
  </div>
);

const EnhancedFeatureCard = ({ illustration, icon, title, children }) => (
  <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 group transition-all duration-300 hover:border-teal-400/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-400/10 text-center">
    {illustration}
    <div className="bg-teal-400/10 text-teal-300 w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:bg-teal-400/20 transition-colors duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-purple-200/80 leading-relaxed">{children}</p>
  </div>
);

export default function LandingPage() {
  return (
    <div className="bg-[#0D0B1A] text-white w-full font-sans relative overflow-hidden min-h-screen">
      {/* Background Gradient & Shape Effects */}
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-[#0D0B1A] via-[#1A113C] to-[#0D0B1A] -z-10"></div>
      <div className="fixed top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-3xl animate-pulse -z-10"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[40rem] h-[40rem] bg-teal-500/10 rounded-full blur-3xl animate-pulse -z-10"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-full">
        {/* Header */}
        <header className="container mx-auto px-6 py-6 flex justify-between items-center max-w-7xl">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <svg className="w-8 h-8 text-teal-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/>
            </svg>
            <span className="bg-gradient-to-r from-white to-purple-300 text-transparent bg-clip-text">
              LawLytics
            </span>
          </h1>
          <nav>
            <Link 
              to="/auth" 
              className="bg-white/5 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-teal-400/30"
            >
              Get Started
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-12 py-20 lg:py-32">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Turn Complex Contracts into
                <br />
                <span className="bg-gradient-to-r from-teal-400 to-purple-400 text-transparent bg-clip-text">
                  Simple Clarity.
                </span>
              </h2>
              <p className="text-lg text-purple-200/80 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                LawLytics is your AI-powered legal co-pilot, designed to decode legal jargon, highlight critical risks, and provide instant, understandable answers about any document.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/dashboard" 
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:text-white font-bold text-lg px-8 py-4 rounded-full hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/30"
                >
                  Analyze a Document
                </Link>

                <button className="border-2 border-white/20 text-white font-semibold text-lg px-8 py-4 rounded-full hover:border-teal-400/50 hover:bg-white/5 transition-all duration-300">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="relative h-96 lg:h-[32rem] order-1 lg:order-2">
              <HeroIllustration />
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white/2">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                Understand, Don't Just Read
              </h3>
              <p className="text-purple-200/80 text-lg leading-relaxed">
                Our core features are designed to empower you with clarity and confidence when facing any legal document.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                How It Works
              </h3>
              <p className="text-purple-200/80 text-lg max-w-2xl mx-auto">
                Get from confusion to clarity in three simple steps
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-teal-500/20 to-purple-500/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-teal-300">1</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Upload Your Document</h4>
                <p className="text-purple-200/80">Simply drag and drop or browse to upload any legal document</p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-purple-300">2</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">AI Analysis</h4>
                <p className="text-purple-200/80">Our AI scans and analyzes every clause, identifying risks and opportunities</p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-pink-500/20 to-teal-500/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-pink-300">3</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Get Instant Insights</h4>
                <p className="text-purple-200/80">Receive a clear summary with actionable recommendations and Q&A</p>
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
            <p className="text-purple-200/80 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who trust LawLytics to make sense of complex legal documents.
            </p>
            <Link 
              to="/dashboard" 
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:text-white font-bold text-xl px-12 py-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-teal-500/30 inline-block"
            >
              Start Analyzing Now - Free
            </Link>
          </div>
        </section>


        {/* Footer */}
        <footer className="bg-black/20 text-purple-200/70 text-center py-12 border-t border-white/10">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <svg className="w-6 h-6 text-teal-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/>
              </svg>
              <span className="text-lg font-semibold text-white">LawLytics</span>
            </div>
            <p className="text-sm">&copy; 2025 LawLytics. All Rights Reserved. Empowering Clarity in a Complex World.</p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        * {
            box-sizing: border-box;
          }
  
        body {
            overflow-x: hidden;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        
        .animate-pulse-slow {
          animation: pulse 6s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
}