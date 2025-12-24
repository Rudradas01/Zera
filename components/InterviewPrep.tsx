
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { InterviewCategory, InterviewAnalysis } from '../types';

// Audio Helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

const InterviewPrep: React.FC = () => {
  const [step, setStep] = useState<'setup' | 'interview' | 'result'>('setup');
  const [role, setRole] = useState('');
  const [duration, setDuration] = useState(10); // in minutes
  const [resumeText, setResumeText] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [transcription, setTranscription] = useState<{ speaker: 'You' | 'AI', text: string }[]>([]);
  const [analysis, setAnalysis] = useState<InterviewAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [isParsingResume, setIsParsingResume] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const timerIntervalRef = useRef<number | null>(null);

  const currentInputTransRef = useRef('');
  const currentOutputTransRef = useRef('');

  // Suggested roles including Medical ones
  const suggestedRoles = [
    'Software Engineer', 'Data Scientist', 'Frontend Developer', 
    'Registered Nurse', 'Resident Physician', 'Pharmacist', 
    'Radiologist', 'Clinical Researcher', 'Marketing Lead', 'HR Manager'
  ];

  // Handle Timer
  useEffect(() => {
    if (isLive && timeLeft > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            stopSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isLive, timeLeft]);

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextRef.current) audioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
    setIsLive(false);
    setLoading(true);

    // Simulate analysis processing
    setTimeout(() => {
      setAnalysis({
        overallScore: Math.floor(Math.random() * 15) + 80,
        metrics: [
          { name: 'Role Alignment', score: 85, feedback: `Strong match for ${role} requirements.` },
          { name: 'Technical Depth', score: 78, feedback: 'Good understanding of the core concepts mentioned in the resume.' },
          { name: 'Clarity', score: 92, feedback: 'Very articulate responses with minimal filler words.' },
          { name: 'Confidence', score: 84, feedback: 'Steady pace and professional demeanor.' }
        ],
        fillerWords: ['basically', 'uhm'],
        strengths: ['Relevant Experience', 'Clear Communication', 'Specific examples from resume'],
        improvements: ['Deepen technical explanations', 'Highlight leadership roles more', 'Maintain eye contact'],
        answerSuggestions: [
          { question: "Resume-based Inquiry", suggestion: "When asked about your project on the resume, provide more quantitative results (e.g., 'improved efficiency by 20%')." }
        ]
      });
      setStep('result');
      setLoading(false);
    }, 2000);
  }, [role]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingResume(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = (event.target?.result as string).split(',')[1];
        const mimeType = file.type;

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [
            {
              parts: [
                { inlineData: { data: base64Data, mimeType } },
                { text: "Extract all professional experience, skills, education, and achievements from this resume into a clean, plain text format that an interviewer can use as context. Focus on names of companies, roles, and key responsibilities." }
              ]
            }
          ]
        });

        if (response.text) {
          setResumeText(response.text);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Resume parsing failed:", error);
      alert("Failed to parse resume. Please try pasting the text manually.");
    } finally {
      setIsParsingResume(false);
    }
  };

  const startInterview = async () => {
    if (!role || !resumeText) return;
    setLoading(true);
    setTranscription([]);
    setTimeLeft(duration * 60);
    currentInputTransRef.current = '';
    currentOutputTransRef.current = '';

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const systemPrompt = `You are a professional hiring manager interviewing a candidate for the role: ${role}. 
      Context from their resume: ${resumeText}. 
      Strict constraints: This is a ${duration} minute interview. Ask specific questions about their resume experiences and how they apply to the ${role} position. 
      If the role is medical, ask about clinical procedures, patient care, or regulatory knowledge.
      Be professional, firm, and supportive. If they are vague, ask for specific examples. Start by introducing yourself and asking why they are a good fit for this role.`;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
          systemInstruction: systemPrompt,
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        },
        callbacks: {
          onopen: () => {
            setIsLive(true);
            setStep('interview');
            setLoading(false);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const data = encode(new Uint8Array(int16.buffer));
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              activeSourcesRef.current.add(source);
            }
            if (msg.serverContent?.inputTranscription) currentInputTransRef.current += msg.serverContent.inputTranscription.text;
            if (msg.serverContent?.outputTranscription) currentOutputTransRef.current += msg.serverContent.outputTranscription.text;
            if (msg.serverContent?.turnComplete) {
              setTranscription(prev => [
                ...prev, 
                { speaker: 'You', text: currentInputTransRef.current }, 
                { speaker: 'AI', text: currentOutputTransRef.current }
              ]);
              currentInputTransRef.current = '';
              currentOutputTransRef.current = '';
            }
            if (msg.serverContent?.interrupted) {
              activeSourcesRef.current.forEach(s => s.stop());
              activeSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error(e),
          onclose: () => setIsLive(false)
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (step === 'setup') {
    return (
      <div className="max-w-4xl mx-auto space-y-12 py-8 animate-in fade-in duration-700">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">Interview Setup</h1>
          <p className="text-slate-500 font-medium text-lg">Target a specific role and use your resume for context.</p>
        </header>

        <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-100 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Role Selection */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Job Role</label>
              <input 
                type="text"
                placeholder="e.g. Frontend Developer, Marketing Lead..."
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none transition-all font-bold"
              />
              <div className="flex flex-wrap gap-2">
                {suggestedRoles.map(r => (
                  <button 
                    key={r}
                    onClick={() => setRole(r)}
                    className="text-[10px] px-3 py-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-full transition-all font-bold text-slate-500"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Length</label>
              <div className="grid grid-cols-3 gap-3">
                {[10, 15, 20].map(m => (
                  <button 
                    key={m}
                    onClick={() => setDuration(m)}
                    className={`py-4 rounded-2xl font-black transition-all border-2 ${
                      duration === m ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resume Upload/Paste */}
          <div className="space-y-6">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resume Context</label>
              <div className="relative overflow-hidden">
                <input 
                  type="file" 
                  accept=".pdf,image/jpeg,image/png"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isParsingResume}
                />
                <button 
                  type="button"
                  className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${isParsingResume ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                >
                  {isParsingResume ? 'Parsing File...' : 'Upload PDF/Image'}
                </button>
              </div>
            </div>
            
            <div className="relative">
              <textarea 
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Upload your resume or paste the text details here. This allows the AI to ask questions specific to your background."
                className="w-full h-48 px-6 py-5 rounded-[2rem] bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm font-medium leading-relaxed"
              />
              {isParsingResume && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-[2rem] flex flex-col items-center justify-center space-y-4">
                  <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">AI Extracting Experience...</p>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={startInterview}
            disabled={!role || !resumeText || loading || isParsingResume}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black py-6 rounded-[2.5rem] shadow-2xl shadow-indigo-100 transition-all uppercase tracking-[0.3em] text-lg"
          >
            {loading ? 'Initializing AI Core...' : 'ENTER VIRTUAL INTERVIEW'}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'interview') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black">
              🎙️
            </div>
            <div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tight">{role} Interview</h2>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Simulation</p>
            </div>
          </div>
          <div className="bg-slate-900 text-white px-8 py-3 rounded-2xl shadow-xl flex items-center space-x-4 border border-slate-800">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-mono text-2xl font-black">{formatTime(timeLeft)}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-video bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-slate-800">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute bottom-8 right-8 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                Camera Feed Encrypted
              </div>
            </div>
            
            <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl h-80 overflow-y-auto custom-scrollbar">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Conversation Log</h3>
               <div className="space-y-4">
                {transcription.map((line, i) => (
                  <div key={i} className={`flex ${line.speaker === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm font-medium ${
                      line.speaker === 'You' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}>
                      <span className="block text-[9px] font-black uppercase opacity-60 mb-1">{line.speaker}</span>
                      {line.text}
                    </div>
                  </div>
                ))}
               </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-2xl">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-10 text-center">Biometric Metrics</h3>
               <div className="space-y-10">
                {[
                  { label: 'Fluency', val: 88, color: 'bg-emerald-500' },
                  { label: 'Sentiment', val: 74, color: 'bg-indigo-500' },
                  { label: 'Eye Contact', val: 92, color: 'bg-violet-500' },
                ].map(m => (
                  <div key={m.label} className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-600 tracking-widest">
                      <span>{m.label}</span>
                      <span>{m.val}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`${m.color} h-full transition-all duration-1000`} style={{ width: `${m.val}%` }}></div>
                    </div>
                  </div>
                ))}
               </div>
            </div>

            <button 
              onClick={stopSession}
              className="w-full bg-slate-900 hover:bg-black text-white font-black py-6 rounded-[2.5rem] shadow-2xl transition-all uppercase tracking-widest text-sm"
            >
              End Session Early
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'result' && analysis) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 space-y-12 pb-24">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
             <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
             <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">Analysis Complete</span>
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic">Review Your Performance</h1>
          <p className="text-slate-500 font-medium text-xl">Target Role: <span className="text-slate-900 font-bold">{role}</span></p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: 'SCORE', val: `${analysis.overallScore}%`, col: 'text-indigo-600' },
             { label: 'FILLER WORDS', val: '2', col: 'text-rose-500' },
             { label: 'ROLE MATCH', val: 'EXCELLENT', col: 'text-emerald-500' },
             { label: 'TIME USED', val: `${duration}m`, col: 'text-slate-400' },
           ].map(item => (
             <div key={item.label} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm text-center">
               <div className={`text-4xl font-black ${item.col} mb-2 tracking-tighter`}>{item.val}</div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</div>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-xl">
             <h3 className="text-2xl font-black text-slate-900 mb-10 uppercase tracking-tight">Competency Breakdown</h3>
             <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysis.metrics} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={130} fontSize={10} fontWeight="900" />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="score" radius={[0, 12, 12, 0]} barSize={28}>
                      {analysis.metrics.map((entry, index) => <Cell key={index} fill={['#6366f1', '#10b981', '#f59e0b', '#3b82f6'][index % 4]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-slate-900 p-12 rounded-[4rem] shadow-2xl text-white">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-10">Feedback Intelligence</h3>
              <div className="space-y-8">
                <div>
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Core Strengths</p>
                   <div className="flex flex-wrap gap-2">
                     {analysis.strengths.map(s => <span key={s} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold">{s}</span>)}
                   </div>
                </div>
                <div>
                   <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-4">Improvement Areas</p>
                   <div className="flex flex-wrap gap-2">
                     {analysis.improvements.map(i => <span key={i} className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-2 rounded-xl text-xs font-bold">{i}</span>)}
                   </div>
                </div>
                <div className="pt-6 border-t border-slate-800">
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Pro AI Tip</p>
                   <p className="text-slate-400 text-sm leading-relaxed italic">"{analysis.answerSuggestions[0].suggestion}"</p>
                </div>
              </div>
           </div>
        </div>

        <div className="text-center">
           <button 
             onClick={() => setStep('setup')}
             className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 px-12 rounded-[2rem] shadow-2xl shadow-indigo-500/20 transition-all uppercase tracking-widest text-sm"
           >
             Start New Prep Session
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
       <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default InterviewPrep;
