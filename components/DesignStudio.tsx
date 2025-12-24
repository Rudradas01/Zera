
import React, { useState } from 'react';
import { designTools } from '../services/geminiService';
import { Project } from '../types';

const DesignStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const url = await designTools.generateImage(prompt, aspectRatio);
      setGeneratedImage(url);
    } catch (error) {
      console.error(error);
      alert('Failed to generate image.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!prompt.trim() || !baseImage) return;
    setLoading(true);
    try {
      const url = await designTools.editImage(baseImage, prompt);
      setGeneratedImage(url);
    } catch (error) {
      console.error(error);
      alert('Failed to edit image.');
    } finally {
      setLoading(false);
    }
  };

  const saveToShowcase = () => {
    if (!generatedImage) return;
    setIsSaving(true);
    const existing = JSON.parse(localStorage.getItem('zera_projects') || '[]');
    const newProject: Project = {
      id: Date.now().toString(),
      title: prompt.slice(0, 50) + '...',
      description: mode === 'generate' ? 'AI Generated Visual' : 'AI Edited Image',
      type: 'design',
      data: generatedImage,
      tags: [mode, 'ai-art'],
      createdAt: Date.now()
    };
    localStorage.setItem('zera_projects', JSON.stringify([newProject, ...existing]));
    setTimeout(() => {
      setIsSaving(false);
      alert('Visual saved to your showcase!');
    }, 500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBaseImage(reader.result as string);
        setMode('edit');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Design Studio</h1>
        <p className="text-slate-600 font-medium text-lg mt-2">Create stunning visuals or edit existing photos with text-based commands.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-800 space-y-8">
            <div className="flex bg-slate-800 p-1.5 rounded-2xl">
              <button
                onClick={() => setMode('generate')}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  mode === 'generate' ? 'bg-indigo-600 shadow-lg text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                New Asset
              </button>
              <button
                onClick={() => setMode('edit')}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  mode === 'edit' ? 'bg-indigo-600 shadow-lg text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Modify Photo
              </button>
            </div>

            {mode === 'edit' && (
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-white uppercase tracking-widest ml-1">Source Image</label>
                <div className="relative group cursor-pointer border-2 border-dashed border-slate-700 bg-slate-800/50 rounded-[2rem] hover:border-indigo-500 transition-all overflow-hidden h-40 flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {baseImage ? (
                    <img src={baseImage} alt="Base" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400">
                      <svg className="w-10 h-10 mx-auto mb-2 opacity-50 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Click to upload image</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-white uppercase tracking-widest ml-1 mb-3">Creative Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === 'generate' ? 'Describe your vision...' : 'What should we change?'}
                className="w-full h-32 px-5 py-4 rounded-[1.5rem] bg-slate-800 border-2 border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-900/20 transition-all outline-none text-white placeholder:text-slate-500 text-sm font-medium leading-relaxed resize-none"
              />
            </div>

            {mode === 'generate' && (
              <div>
                <label className="block text-[10px] font-black text-white uppercase tracking-widest ml-1 mb-3">Frame Configuration</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['1:1', '16:9', '9:16'] as const).map((ar) => (
                    <button
                      key={ar}
                      onClick={() => setAspectRatio(ar)}
                      className={`py-3 text-[10px] font-black rounded-xl border-2 transition-all ${
                        aspectRatio === ar ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {ar}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={mode === 'generate' ? handleGenerate : handleEdit}
              disabled={loading || !prompt.trim() || (mode === 'edit' && !baseImage)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-xl shadow-indigo-500/10 uppercase tracking-[0.2em] text-xs flex items-center justify-center space-x-2"
            >
              {loading ? (
                 <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <span>{mode === 'generate' ? 'GENERATE ASSET' : 'APPLY MODIFICATIONS'}</span>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-slate-950 rounded-[3rem] h-full min-h-[600px] flex items-center justify-center overflow-hidden relative border border-slate-800 shadow-2xl">
            {generatedImage ? (
              <>
                <img src={generatedImage} alt="AI Result" className="max-w-full max-h-full object-contain selection:bg-none" />
                <div className="absolute bottom-6 right-6 flex space-x-3">
                  <button
                    onClick={saveToShowcase}
                    disabled={isSaving}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    <span>{isSaving ? 'Saving...' : 'Save to Showcase'}</span>
                  </button>
                  <a
                    href={generatedImage}
                    download="zera-ai-design.png"
                    className="bg-white text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-50 transition-all flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span>Download</span>
                  </a>
                </div>
              </>
            ) : (
              <div className="text-slate-300 text-center px-10 space-y-6">
                <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto animate-pulse">
                   <svg className="w-10 h-10 opacity-40 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-black text-white tracking-tight">Studio Idle</p>
                  <p className="text-sm font-medium opacity-60 max-w-xs mx-auto text-slate-400">Your high-fidelity neural visual will manifest here upon generation.</p>
                </div>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-[6px] border-indigo-900/30 border-t-indigo-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">ZERA AI</div>
                </div>
                <div className="text-center space-y-3">
                  <p className="text-2xl font-black text-white tracking-tighter italic">Synthesizing Visual Core...</p>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] animate-pulse">Mapping Latent Space</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignStudio;
