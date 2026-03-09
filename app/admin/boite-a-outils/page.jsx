'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Pencil, Trash2, X, Save, Loader2, Wrench, Camera,
  ExternalLink, Eye, EyeOff, Copy, CheckCircle, Image as ImageIcon,
  KeySquare, User, Link as LinkIcon
} from 'lucide-react';

export default function AdminToolsPage() {
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedField, setCopiedField] = useState(null); // Pour l'animation de copie
  const fileInputRef = useRef(null);

  // État pour gérer la visibilité des mots de passe individuellement (par ID d'outil)
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
    password: '',
    url: '',
    logo: ''
  });

  const fetchTools = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tools');
      const data = await res.json();
      if (data.success) {
        setTools(data.data);
      }
    } catch (error) {
      console.error("Erreur chargement des outils:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("Le logo est trop lourd (Max 1Mo).");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, logo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const openModal = (tool = null) => {
    if (tool) {
      setEditingId(tool._id);
      setFormData(tool);
    } else {
      setEditingId(null);
      setFormData({ name: '', identifier: '', password: '', url: '', logo: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const url = editingId ? `/api/tools/${editingId}` : '/api/tools';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        fetchTools();
        closeModal();
      } else {
        alert("Erreur: " + data.error);
      }
    } catch (error) {
      alert("Impossible d'enregistrer.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTool = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet accès ?")) return;
    try {
      const res = await fetch(`/api/tools/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTools();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const copyToClipboard = (text, fieldId) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Montserrat'] pb-24 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 leading-tight pt-2">
            Boîte à <span className="text-[#0065FF] dark:text-[#0EE2E2]">Outils</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">
            Gestion sécurisée des accès aux plateformes du club
          </p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="bg-[#0065FF] hover:bg-[#0052cc] text-white px-6 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-[#0065FF]/20"
        >
          <Plus size={16} /> Ajouter un accès
        </button>
      </div>

      {/* LISTE DES OUTILS */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#0065FF]" size={48} />
        </div>
      ) : tools.length === 0 ? (
        <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-dashed border-slate-200 dark:border-white/10 p-16 text-center shadow-sm">
          <Wrench size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-black uppercase italic text-slate-400 mb-2">Le coffre est vide</h3>
          <p className="text-sm font-bold text-slate-500">Ajoutez les accès de vos outils (OVH, Canva, BadNet...) pour les retrouver facilement.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
            <div key={tool._id} className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col relative overflow-hidden">
              
              {/* Boutons d'édition cachés par défaut */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => openModal(tool)} className="p-2 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-[#0065FF] rounded-xl transition-colors shadow-sm"><Pencil size={14}/></button>
                <button onClick={() => deleteTool(tool._id)} className="p-2 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-red-500 rounded-xl transition-colors shadow-sm"><Trash2 size={14}/></button>
              </div>

              {/* En-tête de la carte */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#081031] border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner p-2">
                  {tool.logo ? (
                    <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain" />
                  ) : (
                    <Wrench size={24} className="text-slate-400" />
                  )}
                </div>
                <div className="min-w-0 pr-16">
                  <h3 className="text-lg font-[900] uppercase italic text-[#081031] dark:text-white truncate leading-tight mb-1">{tool.name}</h3>
                  {tool.url && (
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase text-[#0065FF] dark:text-[#0EE2E2] hover:underline flex items-center gap-1">
                      Ouvrir l'outil <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>

              {/* Identifiants & Mots de passe */}
              <div className="space-y-3 mt-auto bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                
                {/* Identifiant */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5"><User size={10}/> Identifiant</label>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#081031] dark:text-white truncate">{tool.identifier}</span>
                    <button 
                      onClick={() => copyToClipboard(tool.identifier, `id-${tool._id}`)}
                      className="p-1.5 text-slate-400 hover:text-[#0065FF] transition-colors shrink-0"
                      title="Copier l'identifiant"
                    >
                      {copiedField === `id-${tool._id}` ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-white/10 my-2"></div>

                {/* Mot de passe */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5"><KeySquare size={10}/> Mot de passe</label>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#081031] dark:text-white truncate font-mono tracking-wider">
                      {visiblePasswords[tool._id] ? tool.password : '••••••••••••'}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        onClick={() => togglePasswordVisibility(tool._id)}
                        className="p-1.5 text-slate-400 hover:text-[#081031] dark:hover:text-white transition-colors"
                        title="Voir / Cacher"
                      >
                        {visiblePasswords[tool._id] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button 
                        onClick={() => copyToClipboard(tool.password, `pass-${tool._id}`)}
                        className="p-1.5 text-slate-400 hover:text-[#0065FF] transition-colors"
                        title="Copier le mot de passe"
                      >
                        {copiedField === `pass-${tool._id}` ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* MODALE D'AJOUT / MODIFICATION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#081031] rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95">
            
            <div className="bg-slate-50 dark:bg-[#0f172a] p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white flex items-center gap-3">
                <Wrench className="text-[#0065FF]" size={20} />
                {editingId ? 'Modifier l\'accès' : 'Nouvel Outil'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-red-500 transition-colors bg-white dark:bg-white/5 p-2 rounded-full shadow-sm"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
              
              {/* Upload de Logo */}
              <div className="flex items-center gap-6 bg-slate-50 dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200 dark:border-white/5">
                <div className="relative group shrink-0">
                  <div className="w-20 h-20 rounded-xl border-2 border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-[#081031] flex items-center justify-center shadow-sm p-2">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo Preview" className="w-full h-full object-contain" />
                    ) : (
                      <ImageIcon size={24} className="text-slate-300" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Camera size={16} className="text-white" />
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/webp, image/svg+xml" onChange={handleImageUpload} />
                </div>
                <div>
                  <h4 className="font-black uppercase text-sm text-[#081031] dark:text-white mb-1">Logo de l'outil</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Optionnel - Format carré recommandé</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-1.5"><Wrench size={12}/> Nom de l'outil *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0065FF] transition-all" placeholder="Ex: Canva Pro, HelloAsso..." />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-1.5"><LinkIcon size={12}/> Lien de connexion (URL)</label>
                  <input type="url" name="url" value={formData.url} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0065FF] transition-all" placeholder="https://..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-1.5"><User size={12}/> Identifiant / Email *</label>
                    <input type="text" name="identifier" value={formData.identifier} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0065FF] transition-all" placeholder="contact@..." />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-1.5"><KeySquare size={12}/> Mot de passe *</label>
                    <input type="text" name="password" value={formData.password} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0065FF] transition-all" placeholder="Saisir le mot de passe" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 mt-4">
                <button type="button" onClick={closeModal} className="px-6 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">Annuler</button>
                <button type="submit" disabled={isSaving} className="bg-[#0065FF] hover:bg-[#0052cc] text-white px-8 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#0065FF]/20 disabled:opacity-50">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingId ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}