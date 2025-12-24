
import React, { useState } from 'react';
import { contactTools } from '../services/geminiService';

interface LandingPageProps {
  onStartAuth: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartAuth }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [aiAcknowledgment, setAiAcknowledgment] = useState('');

  const features = [
    {
      title: "Biometric Interview Prep",
      desc: "Unlike standard chatbots, Zera analyzes speech clarity, confidence, and facial expressions in real-time.",
      diff: "Traditional tools only check text. Zera checks the human element.",
      icon: "🎙️"
    },
    {
      title: "Unified Creative Ecosystem",
      desc: "Design assets and write content in one place. Your work is automatically curated into a professional portfolio.",
      diff: "No more switching between 5 different tools. Zera is your all-in-one workstation.",
      icon: "🎨"
    },
    {
      title: "Career-First Intelligence",
      desc: "Our AI doesn't just answer questions; it simulates industry-specific scenarios based on real hiring data.",
      diff: "Most AI tools are generalists. Zera is a career specialist.",
      icon: "🚀"
    }
  ];

  const faqs = [
    { q: "Is Zera AI free for students?", a: "We offer a comprehensive free tier designed specifically for students and freshers to kickstart their career journey." },
    { q: "How does the interview analysis work?", a: "Using advanced Gemini vision and audio capabilities, Zera evaluates your performance across 10+ professional metrics including pace, filler word count, and confidence levels." },
    { q: "Can I export my designs and articles?", a: "Absolutely! All creations in the Content and Design studios can be exported or added directly to your public-facing Showcase portfolio." },
    { q: "Which industries are supported for interviews?", a: "Currently, we offer specialized tracks for Engineering, Medical, and Arts, with more sectors being added every month." },
    { q: "Is my personal data secure?", a: "We prioritize your privacy. All biometric data is used only for real-time analysis and is never stored permanently unless you explicitly choose to save a session." },
    { q: "How do I showcase my AI-generated work?", a: "Zera comes with a built-in Project Showcase module where you can curate your best designs and articles into a professional link for recruiters." }
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);
    try {
      // Use the Gemini API to process the message, simulating a smart backend
      const response = await contactTools.processMessage(formData.name, formData.email, formData.message);
      setAiAcknowledgment(response.text || 'Message processed by Zera Core.');
      setIsSent(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Transmission error. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl z-[100] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white font-black text-2xl italic">Z</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">ZERA AI</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-10">
            {['About', 'Features', 'FAQs', 'Contact'].map(item => (
              <button 
                key={item} 
                onClick={() => scrollTo(item.toLowerCase())}
                className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onStartAuth}
              className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-all"
            >
              Sign In
            </button>
            <button 
              onClick={onStartAuth}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-40 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 animate-bounce">
            <span className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">New: Biometric Mock Interviews</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-slate-900 max-w-4xl">
            Design your future <br /> with <span className="text-indigo-600 italic">pure intelligence.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">
            The all-in-one AI platform helping students and creators build assets, practice high-stakes interviews, and land their dream careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              onClick={onStartAuth}
              className="bg-slate-900 text-white px-10 py-5 rounded-2xl text-lg font-black shadow-2xl hover:bg-black transition-all hover:-translate-y-1"
            >
              Start Creating Now
            </button>
            <button 
              onClick={() => scrollTo('about')}
              className="bg-white text-slate-900 border-2 border-slate-200 px-10 py-5 rounded-2xl text-lg font-black hover:border-indigo-600 transition-all"
            >
              Explore Features
            </button>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100/30 rounded-full blur-[120px] -z-10"></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          <div className="relative h-[500px] flex items-center justify-center">
            <div className="absolute w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
            
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 400">
              <defs>
                <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <path d="M200,200 L100,100 M200,200 L300,100 M200,200 L200,320" stroke="url(#neuralGrad)" strokeWidth="2" strokeDasharray="10 5" className="animate-[dash_10s_linear_infinite]" />
            </svg>

            <div className="relative z-20 w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.5)] border-2 border-indigo-400 group cursor-default">
              <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <span className="text-white text-4xl font-black italic">Z</span>
              <div className="absolute -inset-4 border-2 border-indigo-200/50 rounded-full border-t-indigo-600 animate-spin"></div>
            </div>

            <div className="absolute top-10 left-10 z-30 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white hover:scale-105 transition-transform animate-bounce [animation-duration:4s]">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mb-3">
                <span className="text-xl">🎨</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Visual Studio</p>
              <p className="text-sm font-bold text-slate-800">Asset Sync</p>
            </div>

            <div className="absolute top-10 right-10 z-30 bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-800 hover:scale-105 transition-transform animate-bounce [animation-duration:5s]">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">🎙️</span>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-12 bg-indigo-400/30 rounded-full"></div>
                  <div className="h-1.5 w-8 bg-indigo-400/20 rounded-full"></div>
                </div>
              </div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Biometric Live</p>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100 hover:scale-105 transition-transform animate-bounce [animation-duration:6s]">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl font-bold">✍️</div>
                <div>
                   <p className="text-xs font-black text-slate-900">Semantic Drafting</p>
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">SEO Optimized</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-10 bottom-1/4 bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl shadow-[0_20px_40px_rgba(99,102,241,0.3)] text-white animate-pulse">
               <p className="text-2xl font-black">99.8%</p>
               <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Accuracy Rate</p>
            </div>
          </div>
          
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em]">The Zera Kinetic Engine</h2>
              <h3 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[0.95]">
                Why Zera AI is built <br />
                <span className="text-indigo-600">differently.</span>
              </h3>
            </div>
            
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              Most AI platforms are fragmented tools. Zera is a <span className="text-slate-900 font-bold underline decoration-indigo-200 underline-offset-4">unified ecosystem</span>. We don't just generate text; we map your skills to industry requirements using live biometric feedback and professional-grade creative tools.
            </p>

            <div className="grid grid-cols-1 gap-6">
              {[
                { title: "Active Intelligence", desc: "Zera listens, watches, and learns your professional nuances.", icon: "👁️" },
                { title: "Seamless Translation", desc: "Instantly turn raw creative assets into high-converting portfolio pieces.", icon: "⚡" },
                { title: "Data-Driven Careers", desc: "Directly linked to global hiring trends to keep you relevant.", icon: "📊" }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div className="space-y-1 pt-1">
                    <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">{item.title}</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em]">Market Evolution</h2>
            <h3 className="text-5xl font-black text-slate-900 tracking-tight">How we outpace the market.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-indigo-100 hover:shadow-2xl transition-all group">
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
                <h4 className="text-2xl font-black text-slate-900 mb-4">{f.title}</h4>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">{f.desc}</p>
                <div className="pt-6 border-t border-slate-50">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">The Zera Advantage</p>
                  <p className="text-sm font-bold text-slate-700 italic">"{f.diff}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em]">Common Questions</h2>
            <h3 className="text-5xl font-black tracking-tight">Got questions? We've got <span className="text-indigo-400 italic">answers.</span></h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-slate-800 last:border-0 overflow-hidden">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full py-8 flex items-center justify-between text-left hover:text-indigo-400 transition-colors"
                >
                  <span className="text-xl font-bold">{faq.q}</span>
                  <svg className={`w-6 h-6 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className={`transition-all duration-300 ${activeFaq === i ? 'max-h-[300px] pb-8' : 'max-h-0'}`}>
                  <p className="text-slate-400 font-medium leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div className="space-y-8">
              <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em]">Get In Touch</h2>
              <h3 className="text-5xl font-black tracking-tight text-slate-900 leading-none">Connect with the <br /> <span className="text-indigo-600">future of talent.</span></h3>
              <p className="text-xl text-slate-500 font-medium">Whether you're a student looking to start your journey or a recruiter seeking high-fidelity talent, we're here to help.</p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-indigo-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Global HQ</p>
                    <p className="text-lg font-bold text-slate-900">Bhubaneswar, Odisha, India</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-indigo-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Us</p>
                    <p className="text-lg font-bold text-slate-900">hello@zeraai.com</p>
                  </div>
                </div>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-100 space-y-6 overflow-hidden min-h-[500px] flex items-center justify-center">
              {!isSent ? (
                <form onSubmit={handleContactSubmit} className="space-y-6 w-full animate-in fade-in duration-500">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 outline-none transition-all text-sm font-bold" 
                          placeholder="Alex Morgan" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 outline-none transition-all text-sm font-bold" 
                          placeholder="alex@gmail.com" 
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                     <textarea 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full h-32 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 outline-none transition-all text-sm font-bold" 
                      placeholder="How can we help?"
                     ></textarea>
                  </div>
                  <button 
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-indigo-100 transition-all uppercase tracking-widest text-xs flex items-center justify-center space-x-2"
                  >
                     {isSending ? (
                       <>
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Transmitting...</span>
                       </>
                     ) : (
                       "Send Message"
                     )}
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-8 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-lg shadow-emerald-100">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-2xl font-black text-slate-900">Message Received</h4>
                    <p className="text-slate-500 text-sm font-medium">Your request has been routed through Zera-Link.</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-left relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center space-x-2">
                       <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                       <span>AI Core Acknowledgment</span>
                    </p>
                    <p className="text-slate-700 text-sm font-bold italic leading-relaxed">
                      "{aiAcknowledgment}"
                    </p>
                  </div>
                  <button 
                    onClick={() => { setIsSent(false); setAiAcknowledgment(''); }}
                    className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em] hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              )}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xl italic">Z</span>
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">Zera AI</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Empowering the next generation of global talent from Odisha to the world.</p>
        </div>
        <div className="flex justify-center space-x-8 pb-4">
          {['LinkedIn', 'Twitter', 'Instagram'].map(social => (
            <a key={social} href="#" className="text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest transition-colors">{social}</a>
          ))}
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">© 2024 Zera AI. Bhubaneswar, Odisha. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
