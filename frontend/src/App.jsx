import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import DocumentView from './components/DocumentView';
import Header from './components/Header';
import ProfileSetup from './components/ProfileSetup';
import TimelineView from './components/TimelineView';

// Layout for pages that need header (only landing page and dashboard)
function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <Header />
      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages WITH header */}
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        
        {/* Pages WITHOUT header */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/setup-profile" element={<ProfileSetup />} />
        <Route path="/document/:id" element={<DocumentView />} />
        <Route path="/timeline/:id" element={<TimelineView />} />
      </Routes>
    </Router>
  );
}

export default App;