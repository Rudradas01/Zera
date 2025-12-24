
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';
import ContentStudio from './components/ContentStudio';
import DesignStudio from './components/DesignStudio';
import InterviewPrep from './components/InterviewPrep';
import ProjectShowcase from './components/ProjectShowcase';
import { AppTab } from './types';

const Dashboard: React.FC<{ onNavigate: (tab: AppTab) => void }> = ({ onNavigate }) => {
  return (
    <div className="space-y-12">
      <header className="relative py-12 px-8 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Zera AI: Unleash Your Full Potential.
          </h1>
          <p className="text-indigo-100 text-lg mb-8 opacity-90">
            Design your future, write your story, and master your career. The all-in-one space where your ambitions meet intelligent automation.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate(AppTab.INTERVIEW)}
              className="bg-white text-indigo-600 font-bold py-3 px-6 rounded-xl hover:bg-slate-50 transition-all flex items-center space-x-2"
            >
              <span>Try Mock Interview</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button 
              onClick={() => onNavigate(AppTab.SHOWCASE)}
              className="bg-indigo-500/30 text-white font-bold py-3 px-6 rounded-xl border border-white/20 hover:bg-white/10 transition-all"
            >
              View Project Showcase
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M47.2,-64.2C59.9,-54.9,68.2,-39.8,71.1,-24.1C74,-8.4,71.5,7.9,64.7,21.8C57.9,35.7,46.8,47.2,33.5,56.1C20.2,65,4.7,71.3,-11.4,69.5C-27.5,67.7,-44.2,57.7,-55.1,43.5C-66,29.3,-71.1,10.9,-68.9,-6.2C-66.7,-23.3,-57.2,-39,-44.1,-48.4C-31,-57.8,-14.3,-60.8,1.6,-63C17.5,-65.2,34.5,-73.5,47.2,-64.2Z" transform="translate(100 100)" />
          </svg>
        </div>
      </header>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Core Feature Buckets</h2>
          <span className="text-slate-400 text-sm font-medium">Built for the Next Generation of Talent</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div 
            onClick={() => onNavigate(AppTab.CONTENT)}
            className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
          >
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Content Studio</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">Craft professional articles, brainstorm ideas, and refine your resume with Zera.</p>
          </div>

          <div 
            onClick={() => onNavigate(AppTab.DESIGN)}
            className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
          >
            <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-violet-600 group-hover:text-white transition-all">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Design Studio</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">Turn your vision into reality with high-quality AI visual generation.</p>
          </div>

          <div 
            onClick={() => onNavigate(AppTab.INTERVIEW)}
            className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
          >
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Interview Prep</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">Practice with industry experts and receive personalized growth feedback.</p>
          </div>

          <div 
            onClick={() => onNavigate(AppTab.SHOWCASE)}
            className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
          >
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Showcase</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">Build and curate your professional portfolio with your best AI works.</p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-3xl font-bold mb-4">Your future starts here.</h2>
          <p className="text-slate-400 max-w-md">Join a community of ambitious creators and professionals who are redefining success with Zera AI.</p>
        </div>
        <button 
           onClick={() => onNavigate(AppTab.INTERVIEW)}
           className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 uppercase tracking-widest text-xs"
        >
          Begin Your Track
        </button>
      </section>
    </div>
  );
};

const App: React.FC = () => {
  const [authState, setAuthState] = useState<'landing' | 'auth' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);

  // Persistence check
  useEffect(() => {
    const auth = localStorage.getItem('zera_authenticated');
    if (auth === 'true') setAuthState('app');
  }, []);

  const handleLogin = () => {
    localStorage.setItem('zera_authenticated', 'true');
    setAuthState('app');
  };

  const handleLogout = () => {
    localStorage.removeItem('zera_authenticated');
    setAuthState('landing');
    setActiveTab(AppTab.DASHBOARD); // Reset navigation
  };

  if (authState === 'landing') {
    return <LandingPage onStartAuth={() => setAuthState('auth')} />;
  }

  if (authState === 'auth') {
    return <AuthPage onLoginSuccess={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return <Dashboard onNavigate={setActiveTab} />;
      case AppTab.CONTENT:
        return <ContentStudio />;
      case AppTab.DESIGN:
        return <DesignStudio />;
      case AppTab.INTERVIEW:
        return <InterviewPrep />;
      case AppTab.SHOWCASE:
        return <ProjectShowcase />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

export default App;
