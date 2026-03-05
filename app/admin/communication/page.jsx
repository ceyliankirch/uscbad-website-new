'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Save, Loader2, Plus, Pencil, Trash2, Camera, X, CheckCircle, AlertCircle, Palette, Tag, Calendar, Image as ImageIcon, Instagram, Facebook, Mail, MessageCircle, Settings, ChevronDown, Sparkles, ListOrdered } from 'lucide-react';

export default function AdminCommunicationPage() {
  const [activeTab, setActiveTab] = useState('musee'); // 'musee' ou 'config'

  // États pour le Musée
  const [items, setItems] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '', category: 'Tournois', date: '', description: '', img: '', order: 0, isBanger: false
  });

  // États pour la Configuration de la page
  const [configData, setConfigData] = useState({
    instagramText: '', facebookText: '', emailText: '', emailAddress: '', whatsappLink: ''
  });
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchConfig();
  }, []);

  // --- LOGIQUE DU MUSÉE ---
  const fetchItems = async () => {
    setIsLoadingItems(true);
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (error) {
      console.error("Erreur de chargement du musée", error);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("Image trop lourde (Max 2Mo)");
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, img: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const openModal = (item = null) => {
    setIsCategoryDropdownOpen(false);
    if (item) {
      setEditingId(item._id);
      setFormData(item);
    } else {
      setEditingId(null);
      setFormData({ title: '', category: 'Tournois', date: '', description: '', img: '', order: items.length + 1, isBanger: false });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.img) return alert("Veuillez ajouter une image.");
    
    setIsSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/gallery/${editingId}` : '/api/gallery';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchItems();
        closeModal();
        setMessage({ type: 'success', text: 'Œuvre enregistrée.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette œuvre ?")) return;
    try {
      await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      alert("Erreur de suppression.");
    }
  };

  // --- LOGIQUE DE LA CONFIGURATION (Réseaux Sociaux & WhatsApp) ---
  const fetchConfig = async () => {
    setIsLoadingConfig(true);
    try {
      const res = await fetch('/api/admin/com-config');
      const data = await res.json();
      if (data.success && data.data) {
        setConfigData({
          instagramText: data.data.instagramText || '',
          facebookText: data.data.facebookText || '',
          emailText: data.data.emailText || '',
          emailAddress: data.data.emailAddress || '',
          whatsappLink: data.data.whatsappLink || ''
        });
      }
    } catch (error) {
      console.error("Erreur config:", error);
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const handleConfigChange = (e) => setConfigData({ ...configData, [e.target.name]: e.target.value });

  const saveConfig = async (e) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      const res = await fetch('/api/admin/com-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData)
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Paramètres mis à jour.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur sauvegarde.' });
    } finally {
      setIsSavingConfig(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-24 font-['Montserrat']">
      
      {/* HEADER & ONGLETS */}
      <div className="mb-10 border-b border-slate-200 dark:border-white/10 pb-8">
        <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 pt-2">
          Pôle <span className="text-[#0065FF] dark:text-[#0EE2E2]">Communication</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest mb-8">Gérez la vitrine numérique du club</p>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('musee')}
            className={`px-6 py-3 rounded-full font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'musee' ? 'bg-[#081031] text-white dark:bg-white dark:text-[#081031]' : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}
          >
            Le Musée
          </button>
          <button 
            onClick={() => setActiveTab('config')}
            className={`px-6 py-3 rounded-full font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'config' ? 'bg-[#081031] text-white dark:bg-white dark:text-[#081031]' : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}
          >
            Réseaux & Textes
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm animate-in zoom-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      {/* CONTENU ONGLETS */}
      {activeTab === 'musee' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={() => openModal()} className="bg-[#0065FF] hover:bg-[#0052cc] text-white px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all shadow-lg">
              <Plus size={18} /> Nouvelle Œuvre
            </button>
          </div>

          {isLoadingItems ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0065FF]" size={48} /></div>
          ) : items.length === 0 ? (
            <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-dashed border-slate-200 dark:border-white/10 p-16 text-center shadow-sm">
              <Palette size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-black uppercase italic text-slate-400 mb-2">Musée vide</h3>
              <p className="text-sm font-bold text-slate-500">Ajoutez vos visuels pour alimenter le carrousel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map(item => (
                <div key={item._id} className={`bg-white dark:bg-[#0f172a] rounded-[2rem] border ${item.isBanger ? 'border-[#F72585] shadow-[0_0_20px_rgba(247,37,133,0.15)]' : 'border-slate-200 dark:border-white/10'} shadow-sm overflow-hidden group flex flex-col relative transition-all`}>
                  
                  {item.isBanger && (
                    <div className="absolute top-4 right-4 z-20 bg-[#F72585] text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(247,37,133,0.6)] flex items-center gap-1.5">
                      <Sparkles size={12} /> Banger
                    </div>
                  )}

                  <div className="relative aspect-[4/5] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-[#081031]/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 z-10">
                      {item.category}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081031] via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-[900] uppercase italic text-lg leading-tight truncate">{item.title}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#0EE2E2]">{item.date}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/5 flex justify-between items-center border-t border-slate-200 dark:border-white/10">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <ListOrdered size={14} /> Ordre: {item.order}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => openModal(item)} className="p-2 text-slate-400 hover:text-[#0065FF] transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'config' && (
        <form onSubmit={saveConfig} className="bg-white dark:bg-[#0f172a] rounded-[3rem] border border-slate-200 dark:border-white/10 p-8 lg:p-12 shadow-sm space-y-10 animate-in fade-in zoom-in-95">
          <div>
            <h2 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white flex items-center gap-3 mb-2">
              <Settings className="text-[#0065FF]" size={24} /> Paramètres de la page
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Modifiez les textes descriptifs et les liens de contact.</p>
          </div>

          {isLoadingConfig ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#0065FF]" size={32} /></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* INSTAGRAM */}
              <div className="space-y-3 bg-gradient-to-br from-purple-500/5 to-orange-500/5 p-6 rounded-3xl border border-purple-200 dark:border-purple-500/20">
                <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Instagram size={16} /> Texte Instagram
                </label>
                <textarea rows="2" name="instagramText" value={configData.instagramText} onChange={handleConfigChange} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-purple-500 resize-none" placeholder="Description affichée sur la carte Instagram..."></textarea>
              </div>

              {/* FACEBOOK */}
              <div className="space-y-3 bg-[#1877F2]/5 p-6 rounded-3xl border border-[#1877F2]/20">
                <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-[#1877F2]">
                  <Facebook size={16} /> Texte Facebook
                </label>
                <textarea rows="2" name="facebookText" value={configData.facebookText} onChange={handleConfigChange} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#1877F2] resize-none" placeholder="Description affichée sur la carte Facebook..."></textarea>
              </div>

              {/* EMAIL */}
              <div className="space-y-3 bg-slate-100 dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10">
                <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Mail size={16} /> Contact Presse & Sponsoring
                </label>
                <div className="space-y-4">
                  <input type="email" name="emailAddress" value={configData.emailAddress} onChange={handleConfigChange} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-400" placeholder="com@uscbad.fr" />
                  <textarea rows="2" name="emailText" value={configData.emailText} onChange={handleConfigChange} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-400 resize-none" placeholder="Description affichée sur la carte Email..."></textarea>
                </div>
              </div>

              {/* WHATSAPP */}
              <div className="space-y-3 bg-[#25D366]/5 p-6 rounded-3xl border border-[#25D366]/20">
                <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-[#25D366]">
                  <MessageCircle size={16} /> Lien d'invitation WhatsApp
                </label>
                <input type="url" name="whatsappLink" value={configData.whatsappLink} onChange={handleConfigChange} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#25D366]" placeholder="https://chat.whatsapp.com/..." />
                <p className="text-[10px] font-bold text-slate-500 uppercase mt-2">Ce lien sera utilisé pour le bouton "Intégrer la communauté".</p>
              </div>

            </div>
          )}

          <div className="flex justify-end pt-8 border-t border-slate-200 dark:border-white/10">
            <button type="submit" disabled={isSavingConfig || isLoadingConfig} className="bg-[#0065FF] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-[#0065FF]/20">
              {isSavingConfig ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Mettre à jour la page
            </button>
          </div>
        </form>
      )}

      {/* MODALE D'ÉDITION MUSÉE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#081031] rounded-[3rem] w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-white/10">
            
            <div className="p-6 lg:p-8 border-b border-slate-200 dark:border-white/10 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white flex items-center gap-3">
                <Palette className="text-[#0065FF]" size={24} /> {editingId ? 'Modifier l\'œuvre' : 'Ajouter au Musée'}
              </h2>
              <button onClick={closeModal} className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"><X size={20}/></button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto hide-scrollbar p-6 lg:p-10 flex flex-col lg:flex-row gap-10">
              
              {/* UPLOAD IMAGE */}
              <div className="w-full lg:w-1/3 flex flex-col items-center gap-4 shrink-0">
                <div className={`relative group w-full aspect-[4/5] rounded-[2rem] border-4 overflow-hidden bg-slate-100 dark:bg-[#0f172a] flex items-center justify-center shadow-inner transition-colors ${formData.isBanger ? 'border-[#F72585]' : 'border-slate-100 dark:border-white/5'}`}>
                  {formData.img ? (
                    <img src={formData.img} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <ImageIcon size={48} className="mb-2 opacity-50" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Format 4:5 idéal</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-[#081031] px-6 py-3 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                      <Camera size={14} /> {formData.img ? 'Changer' : 'Parcourir'}
                    </button>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                </div>

                {/* BOUTON BANGER */}
                <div className="w-full space-y-2 flex items-center justify-between bg-[#F72585]/10 border border-[#F72585]/30 p-4 rounded-2xl mt-2">
                  <div>
                    <label className="text-[10px] font-black uppercase text-[#F72585] tracking-widest flex items-center gap-1.5"><Sparkles size={14}/> Visuel "Banger"</label>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isBanger" checked={formData.isBanger} onChange={(e) => setFormData({...formData, isBanger: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-[#081031]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F72585] shadow-[0_0_10px_rgba(247,37,133,0.4)]"></div>
                  </label>
                </div>
              </div>

              {/* CHAMPS DE SAISIE */}
              <div className="flex-1 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Titre de l'œuvre *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0065FF]/10 focus:border-[#0065FF] transition-all" placeholder="Ex: N1 vs Chambly" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1.5 ml-1"><ListOrdered size={12}/> Priorité d'affichage</label>
                    <input type="number" name="order" value={formData.order} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0065FF]/10 focus:border-[#0065FF] transition-all" placeholder="Ordre (1 = en premier)" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* SELECT CUSTOM CATÉGORIE */}
                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1.5 ml-1"><Tag size={12}/> Catégorie *</label>
                    <div className="relative">
                      <button 
                        type="button" 
                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)} 
                        className={`w-full bg-slate-50 dark:bg-[#0f172a] border ${isCategoryDropdownOpen ? 'border-[#0065FF] ring-2 ring-[#0065FF]/20' : 'border-slate-200 dark:border-white/10'} rounded-2xl px-5 py-4 text-sm font-bold flex justify-between items-center transition-all outline-none text-left`}
                      >
                        <span className="text-[#081031] dark:text-white">
                          {formData.category || "Sélectionnez une catégorie"}
                        </span>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isCategoryDropdownOpen && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                          <div className="py-1">
                            {['Tournois', 'Interclubs', 'Résultats', 'Divers'].map((opt) => (
                              <div 
                                key={opt} 
                                onClick={() => {
                                  setFormData({ ...formData, category: opt });
                                  setIsCategoryDropdownOpen(false);
                                }} 
                                className={`px-5 py-3 text-sm font-bold cursor-pointer transition-colors ${
                                  formData.category === opt 
                                    ? 'bg-[#0065FF]/10 text-[#0065FF]' 
                                    : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1.5 ml-1"><Calendar size={12}/> Date affichée *</label>
                    <input type="text" name="date" value={formData.date} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0065FF]/10 focus:border-[#0065FF] transition-all" placeholder="Ex: Mars 2026" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Concept créatif (Description)</label>
                  <textarea rows="4" name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0065FF]/10 focus:border-[#0065FF] transition-all resize-none" placeholder="Expliquez la direction artistique de ce visuel..."></textarea>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end gap-3 mt-auto">
                  <button type="button" onClick={closeModal} className="px-8 py-4 text-xs font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">Annuler</button>
                  <button type="submit" disabled={isSaving} className="bg-[#0065FF] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-[#0065FF]/20">
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {editingId ? 'Mettre à jour' : 'Exposer'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}