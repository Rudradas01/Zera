
import React, { useState } from 'react';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [authStep, setAuthStep] = useState<'method' | 'mobile' | 'otp'>('method');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSocialLogin = () => {
    setIsLoading(true);
    // Simulate Google Auth
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    setIsLoading(true);
    // Simulate Auth
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthStep('otp');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      {/* Visual Left Side */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-slate-900 items-center justify-center p-20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-slate-900 to-violet-600/30"></div>
        <div className="relative z-10 space-y-12">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-indigo-600 font-black text-3xl italic">Z</span>
            </div>
            <h1 className="text-7xl font-black text-white tracking-tighter leading-none">
              Zera AI <br />
              <span className="text-indigo-400">Empowering Ambition.</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium max-w-lg leading-relaxed">
              Join a global community of innovators and creators. The all-in-one platform to design your future, write your story, and master your career.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'AI Content Studio', icon: '✍️' },
              { label: 'Design Asset Gen', icon: '🎨' },
              { label: 'Biometric Interviews', icon: '🎙️' },
              { label: 'Smart Showcase', icon: '📁' },
            ].map(item => (
              <div key={item.label} className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-[2rem] flex items-center space-x-4">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-white font-bold text-sm tracking-wide">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      {/* Auth Right Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 relative">
        <div className="lg:hidden absolute top-8 left-8 flex items-center space-x-2">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl italic">Z</span>
          </div>
          <span className="font-black text-slate-900 tracking-tighter">ZERA AI</span>
        </div>

        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              {authStep === 'method' ? (isLogin ? 'Welcome Back' : 'Create Account') : authStep === 'mobile' ? 'Mobile Verification' : 'Enter OTP'}
            </h2>
            <p className="text-slate-500 font-medium mt-2">
              {authStep === 'method' ? (isLogin ? 'Enter your details to continue your journey.' : 'Complete the fields below to join Zera AI.') : 'We take your security seriously.'}
            </p>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 space-y-6">
            {authStep === 'method' && (
              <>
                <div className="space-y-4">
                  <button 
                    type="button"
                    onClick={handleSocialLogin}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-3 bg-white border border-slate-200 hover:bg-slate-50 py-4 rounded-2xl transition-all shadow-sm group"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="font-bold text-slate-700">Continue with Google</span>
                  </button>
                  {isLogin && (
                    <button 
                      type="button"
                      onClick={() => setAuthStep('mobile')}
                      className="w-full flex items-center justify-center space-x-3 bg-slate-900 hover:bg-black py-4 rounded-2xl transition-all shadow-xl group"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="font-bold text-white tracking-wide">Login with Mobile</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-4 py-2">
                  <div className="flex-1 h-px bg-slate-100"></div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">or direct entry</span>
                  <div className="flex-1 h-px bg-slate-100"></div>
                </div>

                <form className="space-y-4" onSubmit={handleAuthSubmit}>
                  {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-2 rounded-xl text-xs font-bold text-center">
                      {error}
                    </div>
                  )}
                  
                  {!isLogin && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium"
                    />
                  </div>

                  {!isLogin && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Re-enter Password</label>
                      <input 
                        type="password" 
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-200 uppercase tracking-widest text-xs"
                  >
                    {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                  </button>
                </form>
              </>
            )}

            {authStep === 'mobile' && (
              <form onSubmit={handleMobileSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="flex space-x-2">
                    <div className="w-16 px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-500 text-center">+1</div>
                    <input 
                      type="tel" 
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="000 000 0000"
                      className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl transition-all shadow-xl uppercase tracking-widest text-xs"
                >
                  Send Verification Code
                </button>
                <button 
                  type="button"
                  onClick={() => setAuthStep('method')}
                  className="w-full text-slate-400 text-xs font-bold hover:text-slate-600"
                >
                  Back to options
                </button>
              </form>
            )}

            {authStep === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                 <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Verification Code</label>
                  <div className="flex justify-between gap-3">
                    {[1, 2, 3, 4].map(i => (
                      <input 
                        key={i}
                        type="text" 
                        maxLength={1}
                        required
                        className="w-full h-16 text-center text-2xl font-black rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none transition-all"
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-center text-slate-400 font-medium mt-4">Code sent to {phoneNumber}</p>
                </div>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl uppercase tracking-widest text-xs"
                >
                   {isLoading ? 'Verifying...' : 'Verify & Continue'}
                </button>
                <button 
                  type="button"
                  onClick={() => setAuthStep('mobile')}
                  className="w-full text-slate-400 text-xs font-bold hover:text-slate-600"
                >
                  Resend code
                </button>
              </form>
            )}
          </div>

          <div className="text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setAuthStep('method'); setError(''); }}
              className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
          </div>

          <p className="text-[10px] text-slate-400 text-center font-medium max-w-[280px] mx-auto leading-relaxed">
            By continuing, you agree to Zera AI's <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-[2px] z-[100] flex items-center justify-center">
           <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
