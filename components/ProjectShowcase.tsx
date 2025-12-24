
import React, { useState, useEffect } from 'react';
import { Project } from '../types';

const ProjectShowcase: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | 'content' | 'design'>('all');
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAddingManual, setIsAddingManual] = useState(false);

  // Manual Add Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'content' | 'design'>('content');
  const [newData, setNewData] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('zera_projects') || '[]');
    setProjects(saved);
  }, []);

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('zera_projects', JSON.stringify(updated));
    setSelectedProject(null);
  };

  const addManualProject = (e: React.FormEvent) => {
    e.preventDefault();
    const project: Project = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      type: newType,
      data: newData,
      tags: newTags.split(',').map(t => t.trim()).filter(t => t),
      link: newLink,
      createdAt: Date.now()
    };
    const updated = [project, ...projects];
    setProjects(updated);
    localStorage.setItem('zera_projects', JSON.stringify(updated));
    setIsAddingManual(false);
    // Reset form
    setNewTitle(''); setNewDesc(''); setNewData(''); setNewTags(''); setNewLink('');
  };

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === 'all' || p.type === filter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Project Showcase</h1>
          <p className="text-slate-500">Exhibit your best creations and AI-assisted works.</p>
        </div>
        <button 
          onClick={() => setIsAddingManual(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Work</span>
        </button>
      </header>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          {(['all', 'content', 'design'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 md:w-24 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === f ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative flex-1 w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search projects or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
          />
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer group flex flex-col"
            >
              <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center overflow-hidden relative">
                {project.type === 'design' ? (
                  <img src={project.data} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="p-6 text-slate-400 overflow-hidden line-clamp-6 text-xs leading-relaxed italic">
                    {project.data}
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                    project.type === 'design' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {project.type}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1">
                <h3 className="font-bold text-slate-800 mb-1 line-clamp-1">{project.title}</h3>
                <p className="text-xs text-slate-500 mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white py-20 rounded-3xl border border-dashed border-slate-300 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">No projects found</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">Start creating in the Studios or add a manual project to see them here.</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2 bg-slate-50 overflow-y-auto">
              {selectedProject.type === 'design' ? (
                <img src={selectedProject.data} alt={selectedProject.title} className="w-full h-full object-contain" />
              ) : (
                <div className="p-8 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                  {selectedProject.data}
                </div>
              )}
            </div>
            <div className="md:w-1/2 p-8 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedProject.title}</h2>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                    selectedProject.type === 'design' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedProject.type}
                  </span>
                </div>
                <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Description</label>
                  <p className="text-slate-600 text-sm leading-relaxed">{selectedProject.description}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map(tag => (
                      <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedProject.link && (
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Live Link</label>
                    <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm hover:underline flex items-center space-x-2">
                      <span>View Live Project</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
                <p className="text-[10px] text-slate-400">Created: {new Date(selectedProject.createdAt).toLocaleDateString()}</p>
                <button 
                  onClick={() => deleteProject(selectedProject.id)}
                  className="text-red-500 text-xs font-bold hover:underline"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Manual Project Modal */}
      {isAddingManual && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <form onSubmit={addManualProject} className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-slate-900">Add Project to Showcase</h2>
              <button type="button" onClick={() => setIsAddingManual(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Type</label>
                  <select 
                    value={newType} 
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  >
                    <option value="content">Content</option>
                    <option value="design">Design (URL)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Title</label>
                  <input 
                    required 
                    value={newTitle} 
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="E.g. Branding Strategy"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Description</label>
                <textarea 
                  required 
                  value={newDesc} 
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Short summary of the project..."
                  className="w-full h-20 px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{newType === 'content' ? 'Content Text' : 'Image URL / Base64'}</label>
                <textarea 
                  required 
                  value={newData} 
                  onChange={e => setNewData(e.target.value)}
                  placeholder={newType === 'content' ? 'Paste your text here...' : 'Paste image data URL...'}
                  className="w-full h-24 px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tags (comma separated)</label>
                  <input 
                    value={newTags} 
                    onChange={e => setNewTags(e.target.value)}
                    placeholder="marketing, ai, etc"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">External Link</label>
                  <input 
                    value={newLink} 
                    onChange={e => setNewLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg mt-6">
              Add to Showcase
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProjectShowcase;
