
import React, { useState, useCallback } from 'react';
import { contentTools } from '../services/geminiService';
import { Project } from '../types';

const ContentStudio: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'writer' | 'titles' | 'resume'>('writer');
  const [input, setInput] = useState('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      let result;
      if (activeTool === 'writer') {
        result = await contentTools.articleWriter(input, length);
      } else if (activeTool === 'titles') {
        result = await contentTools.blogTitleGenerator(input);
      } else {
        result = await contentTools.resumeReview(input);
      }
      setOutput(result.text || 'No response from AI.');
    } catch (error) {
      console.error(error);
      setOutput('Error generating content.');
    } finally {
      setLoading(false);
    }
  };

  const saveToShowcase = () => {
    setIsSaving(true);
    const existing = JSON.parse(localStorage.getItem('zera_projects') || '[]');
    const newProject: Project = {
      id: Date.now().toString(),
      title: activeTool === 'writer' ? input.slice(0, 50) + '...' : `Content Generation - ${new Date().toLocaleDateString()}`,
      description: `Generated using AI Content Studio (${activeTool})`,
      type: 'content',
      data: output,
      tags: [activeTool, 'ai-generated'],
      createdAt: Date.now()
    };
    localStorage.setItem('zera_projects', JSON.stringify([newProject, ...existing]));
    setTimeout(() => {
      setIsSaving(false);
      alert('Project saved to your showcase!');
    }, 500);
  };

  const handleFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        setInput(text);
      }
    };
    reader.readAsText(file);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Content Studio</h1>
        <p className="text-slate-600 font-medium text-lg mt-2">Professional AI drafting for writers, creators, and job seekers.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 p-3 rounded-3xl shadow-xl border border-slate-800 flex flex-col space-y-2">
            {[
              { id: 'writer', label: 'Article Writer', icon: '✍️' },
              { id: 'titles', label: 'Blog Title Gen', icon: '💡' },
              { id: 'resume', label: 'Resume Review', icon: '📄' },
            ].map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool.id as any);
                  setOutput('');
                  setInput('');
                }}
                className={`flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  activeTool === tool.id ? 'bg-indigo-600 text-white shadow-xl translate-x-1' : 'hover:bg-slate-800 text-slate-400 font-semibold'
                }`}
              >
                <span className="text-2xl">{tool.icon}</span>
                <span className="font-bold">{tool.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">
                {activeTool === 'writer' ? 'Topic / Brief' : activeTool === 'titles' ? 'Keywords' : 'Resume Details'}
              </label>
              
              {activeTool === 'resume' && (
                <div 
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`mb-4 relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                    isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
                  }`}
                >
                  <input 
                    type="file" 
                    onChange={onFileSelect} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".txt,.md,.pdf,.doc,.docx"
                  />
                  <div className="flex flex-col items-center pointer-events-none">
                    <svg className={`w-8 h-8 mb-2 transition-colors ${isDragging ? 'text-indigo-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-xs font-bold text-slate-300">DRAG & DROP RESUME</p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase">Supports TXT, PDF, DOCX</p>
                  </div>
                </div>
              )}

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={activeTool === 'writer' ? 'Describe the topic in detail...' : activeTool === 'titles' ? 'Enter keywords...' : 'Or paste your resume text here...'}
                className="w-full h-40 px-5 py-4 rounded-2xl bg-slate-800 border-2 border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-900/20 transition-all outline-none text-white font-medium leading-relaxed"
              />
            </div>

            {activeTool === 'writer' && (
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Length</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['short', 'medium', 'long'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLength(l)}
                      className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                        length === l ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/10 flex items-center justify-center space-x-3 text-lg"
            >
              {loading ? (
                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <span>{activeTool === 'resume' ? 'ANALYZE RESUME' : 'GENERATE CONTENT'}</span>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-slate-950 rounded-[2.5rem] shadow-2xl border border-slate-800 h-full min-h-[600px] overflow-hidden flex flex-col">
            <div className="px-8 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="ml-4 font-bold text-slate-400 text-sm tracking-widest uppercase">AI Engine Output</span>
              </div>
              <div className="flex items-center space-x-4">
                {output && (
                  <button 
                    onClick={saveToShowcase}
                    disabled={isSaving}
                    className="text-sm text-emerald-400 font-bold hover:text-emerald-300 transition-colors flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    <span>{isSaving ? 'SAVING...' : 'SAVE'}</span>
                  </button>
                )}
                {output && (
                  <button 
                    onClick={() => navigator.clipboard.writeText(output)}
                    className="text-sm text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                  >
                    COPY
                  </button>
                )}
              </div>
            </div>
            <div className="p-10 flex-1 overflow-y-auto">
              {output ? (
                <div className="text-white text-lg font-medium leading-[1.8] tracking-wide whitespace-pre-wrap selection:bg-indigo-500">
                  {output}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center animate-pulse">
                     <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <p className="text-xl font-bold">Waiting for AI synthesis...</p>
                  <p className="text-sm max-w-xs text-center opacity-40">Your generated content will appear here in high-clarity white text.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentStudio;
