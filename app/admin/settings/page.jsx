'use client';
import React, { useState, useEffect } from 'react';
import { Save, Loader2, Image as ImageIcon, Camera, Plus, Trash2, Settings, Users, Building, History, Shield, Trophy, MapPin, Target, Heart } from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState(null);

  // Icônes disponibles pour les stats
  const availableIcons = ['Users', 'Trophy', 'MapPin', 'Target', 'Shield', 'Heart'];

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/presentation-config');
      const data = await res.json();
      if (data.success && data.data) {
        setFormData(data.data);
      }
    } catch (error) {
      console.error("Erreur de chargement", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour n'importe quel champ de manière dynamique (ex: 'hero.title1' ou 'stats.0.value')
  const updateField = (path, value) => {
    setFormData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev)); // Deep copy simple
      const keys = path.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleImageUpload = (path, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("Image trop lourde (Max 2Mo)");
      const reader = new FileReader();
      reader.onloadend = () => updateField(path, reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Ajout/Suppression dans les tableaux
  const addArrayItem = (path, template) => {
    setFormData((prev) => {
      const newData = { ...prev };
      newData[path] = [...newData[path], template];
      return newData;
    });
  };

  const removeArrayItem = (path, index) => {
    setFormData((prev) => {
      const newData = { ...prev };
      newData[path] = newData[path].filter((_, i) => i !== index);
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/presentation-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Paramètres du club enregistrés.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !formData) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0065FF]" size={48} /></div>;

  const tabs = [
    { id: 'hero', label: 'En-tête & Stats', icon: <Settings size={16} /> },
    { id: 'history', label: 'Histoire & Valeurs', icon: <History size={16} /> },
    { id: 'profiles', label: 'Profils de jeu', icon: <Target size={16} /> },
    { id: 'gyms', label: 'Gymnases', icon: <Building size={16} /> },
    { id: 'staff', label: 'Équipe & Staff', icon: <Users size={16} /> },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 font-['Montserrat']">
      
      <div className="mb-8 border-b border-slate-200 dark:border-white/10 pb-6 flex flex-col lg:flex-row justify-between lg:items-end gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 pt-2">
            Présentation <span className="text-[#0065FF] dark:text-[#0EE2E2]">Club</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Éditez la page vitrine "Le Club"</p>
        </div>
        <button onClick={handleSubmit} disabled={isSaving} className="bg-[#0065FF] text-white px-8 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-[#0052cc] transition-all shadow-lg shadow-[#0065FF]/20">
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Enregistrer tout
        </button>
      </div>

      {message.text && (
        <div className={`mb-8 p-4 rounded-2xl font-bold text-sm text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* TABS NAVIGATION */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#081031] dark:bg-white text-white dark:text-[#081031]' : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 p-6 lg:p-10 shadow-sm">
        <form onSubmit={handleSubmit}>

          {/* TAB: HERO & STATS */}
          {activeTab === 'hero' && (
            <div className="space-y-12 animate-in fade-in">
              <div>
                <h3 className="text-xl font-[900] uppercase italic mb-6 text-[#081031] dark:text-white">Bannière Principale</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Badge</label>
                      <input type="text" value={formData.hero.badgeText} onChange={e => updateField('hero.badgeText', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Titre Blanc</label>
                        <input type="text" value={formData.hero.title1} onChange={e => updateField('hero.title1', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[#0EE2E2] tracking-widest">Titre Couleur</label>
                        <input type="text" value={formData.hero.title2} onChange={e => updateField('hero.title2', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Description</label>
                      <textarea rows="3" value={formData.hero.description} onChange={e => updateField('hero.description', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 resize-none"></textarea>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Image de Fond (Cover)</label>
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-100 group border border-slate-200 dark:border-white/10">
                      {formData.hero.coverImage ? <img src={formData.hero.coverImage} className="w-full h-full object-cover" alt="Hero" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={40} className="text-slate-300" /></div>}
                      <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                        <span className="bg-white text-black px-4 py-2 rounded-full text-xs font-black uppercase">Changer l'image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('hero.coverImage', e)} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-200 dark:border-white/10">
                <h3 className="text-xl font-[900] uppercase italic mb-6 text-[#081031] dark:text-white">Chiffres Clés (Stats)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {formData.stats.map((stat, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-[#081031] p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
                      <div className="flex gap-2">
                        <input type="number" value={stat.value} onChange={e => updateField(`stats.${idx}.value`, Number(e.target.value))} className="w-20 bg-white dark:bg-white/5 rounded-lg px-2 py-2 text-sm font-black text-center" placeholder="Valeur" />
                        <input type="text" value={stat.suffix} onChange={e => updateField(`stats.${idx}.suffix`, e.target.value)} className="w-16 bg-white dark:bg-white/5 rounded-lg px-2 py-2 text-sm font-bold text-center" placeholder="Suffix" />
                      </div>
                      <input type="text" value={stat.label} onChange={e => updateField(`stats.${idx}.label`, e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-lg px-3 py-2 text-xs font-bold" placeholder="Libellé (ex: Licenciés)" />
                      <div className="flex gap-2">
                        <select value={stat.icon} onChange={e => updateField(`stats.${idx}.icon`, e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-lg px-2 py-2 text-xs font-bold appearance-none">
                          {availableIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                        </select>
                        <input type="color" value={stat.color} onChange={e => updateField(`stats.${idx}.color`, e.target.value)} className="w-10 h-8 rounded-lg cursor-pointer p-0 border-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-10 animate-in fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="text-lg font-[900] uppercase italic text-[#081031] dark:text-white">Textes & Histoire</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" value={formData.history.title1} onChange={e => updateField('history.title1', e.target.value)} className="bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10" placeholder="Titre 1" />
                    <input type="text" value={formData.history.title2} onChange={e => updateField('history.title2', e.target.value)} className="bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 text-[#0065FF]" placeholder="Titre Couleur" />
                  </div>
                  <input type="text" value={formData.history.subtitle} onChange={e => updateField('history.subtitle', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10" placeholder="Sous-titre" />
                  <textarea rows="3" value={formData.history.p1} onChange={e => updateField('history.p1', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 resize-none" placeholder="Paragraphe 1"></textarea>
                  <textarea rows="3" value={formData.history.p2} onChange={e => updateField('history.p2', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 resize-none" placeholder="Paragraphe 2"></textarea>
                  <textarea rows="2" value={formData.history.quote} onChange={e => updateField('history.quote', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-black italic border-l-4 border-l-[#0EE2E2] resize-none" placeholder="Citation..."></textarea>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-[900] uppercase italic text-[#081031] dark:text-white">Images d'illustration</h3>
                  
                  {/* Img 1 */}
                  <div className="flex gap-4 items-center bg-slate-50 dark:bg-[#081031] p-4 rounded-2xl border border-slate-200 dark:border-white/10">
                    <label className="relative w-24 h-24 rounded-xl overflow-hidden group cursor-pointer shrink-0 border border-slate-200 dark:border-white/10">
                      {formData.history.img1 ? <img src={formData.history.img1} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200 flex items-center justify-center"><Camera size={20}/></div>}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera size={20} className="text-white"/></div>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('history.img1', e)} />
                    </label>
                    <div className="space-y-2 flex-1">
                      <input type="text" value={formData.history.img1Num} onChange={e => updateField('history.img1Num', e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-lg px-3 py-2 text-sm font-black" placeholder="Texte fort (ex: 1982)" />
                      <input type="text" value={formData.history.img1Text} onChange={e => updateField('history.img1Text', e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-lg px-3 py-2 text-xs font-bold" placeholder="Sous-texte" />
                    </div>
                  </div>

                  {/* Img 2 */}
                  <div className="flex gap-4 items-center bg-slate-50 dark:bg-[#081031] p-4 rounded-2xl border border-slate-200 dark:border-white/10">
                    <label className="relative w-24 h-24 rounded-xl overflow-hidden group cursor-pointer shrink-0 border border-slate-200 dark:border-white/10">
                      {formData.history.img2 ? <img src={formData.history.img2} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200 flex items-center justify-center"><Camera size={20}/></div>}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera size={20} className="text-white"/></div>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('history.img2', e)} />
                    </label>
                    <div className="space-y-2 flex-1">
                      <input type="text" value={formData.history.img2Num} onChange={e => updateField('history.img2Num', e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-lg px-3 py-2 text-sm font-black" placeholder="Texte fort (ex: 100%)" />
                      <input type="text" value={formData.history.img2Text} onChange={e => updateField('history.img2Text', e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-lg px-3 py-2 text-xs font-bold" placeholder="Sous-texte" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROFILES */}
          {activeTab === 'profiles' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white">Cartes Profils (x4)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.profiles.map((profile, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-[#081031] p-5 rounded-2xl border border-slate-200 dark:border-white/10 flex gap-5">
                    <label className="relative w-28 h-40 rounded-xl overflow-hidden group cursor-pointer shrink-0 shadow-sm border border-slate-200 dark:border-white/5">
                      {profile.img ? <img src={profile.img} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200 flex items-center justify-center"><Camera size={24}/></div>}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera size={20} className="text-white"/></div>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(`profiles.${idx}.img`, e)} />
                    </label>
                    <div className="flex-1 space-y-2">
                      <input type="text" value={profile.title} onChange={e => updateField(`profiles.${idx}.title`, e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-lg px-3 py-2 text-sm font-black uppercase italic" placeholder="Titre" />
                      <input type="text" value={profile.subtitle} onChange={e => updateField(`profiles.${idx}.subtitle`, e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-500" placeholder="Sous-titre" />
                      <textarea rows="3" value={profile.desc} onChange={e => updateField(`profiles.${idx}.desc`, e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-lg px-3 py-2 text-xs font-medium resize-none" placeholder="Description..."></textarea>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-slate-500">Couleur :</span>
                        <input type="color" value={profile.color} onChange={e => updateField(`profiles.${idx}.color`, e.target.value)} className="w-8 h-8 rounded-md cursor-pointer p-0 border-0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: GYMS */}
          {activeTab === 'gyms' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white">Infrastructures</h3>
                <button type="button" onClick={() => addArrayItem('gyms', { title: 'Nouveau', badge: 'Badge', address: '', tags: [], mapLink: '', img: '' })} className="bg-slate-100 dark:bg-white/10 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Plus size={14}/> Ajouter
                </button>
              </div>
              <div className="space-y-6">
                {formData.gyms.map((gym, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-[#081031] p-6 rounded-[2rem] border border-slate-200 dark:border-white/10 flex flex-col lg:flex-row gap-6">
                    <label className="relative w-full lg:w-64 h-40 rounded-xl overflow-hidden group cursor-pointer shrink-0 border border-slate-200 dark:border-white/5">
                      {gym.img ? <img src={gym.img} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200 flex items-center justify-center"><Camera size={24}/></div>}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera size={20} className="text-white"/></div>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(`gyms.${idx}.img`, e)} />
                    </label>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <input type="text" value={gym.title} onChange={e => updateField(`gyms.${idx}.title`, e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-xl px-4 py-3 text-sm font-black" placeholder="Nom du Gymnase" />
                        <input type="text" value={gym.badge} onChange={e => updateField(`gyms.${idx}.badge`, e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-xl px-4 py-3 text-xs font-bold" placeholder="Badge (ex: Gymnase Principal)" />
                        <input type="text" value={gym.address} onChange={e => updateField(`gyms.${idx}.address`, e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-xl px-4 py-3 text-xs font-bold" placeholder="Adresse" />
                      </div>
                      <div className="space-y-2">
                        <input type="url" value={gym.mapLink} onChange={e => updateField(`gyms.${idx}.mapLink`, e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-xl px-4 py-3 text-xs font-bold" placeholder="Lien Google Maps" />
                        <input type="text" value={gym.tags.join(', ')} onChange={e => updateField(`gyms.${idx}.tags`, e.target.value.split(',').map(t => t.trim()))} className="w-full bg-white dark:bg-white/5 rounded-xl px-4 py-3 text-xs font-bold" placeholder="Mots-clés (séparés par virgule)" />
                        <button type="button" onClick={() => removeArrayItem('gyms', idx)} className="w-full py-3 text-red-500 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors mt-2">
                          <Trash2 size={14}/> Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: STAFF */}
          {activeTab === 'staff' && (
            <div className="space-y-12 animate-in fade-in">
              
              {/* LE BUREAU */}
              <div>
                <div className="flex justify-between items-center mb-6 border-l-4 border-[#0EE2E2] pl-4">
                  <h3 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white">Le Bureau</h3>
                  <button type="button" onClick={() => addArrayItem('bureau', { name: 'Nouveau', role: 'Rôle', email: '', phone: '', img: '', color: '#0EE2E2' })} className="bg-slate-100 dark:bg-white/10 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <Plus size={14}/> Ajouter
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.bureau.map((member, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-[#081031] p-4 rounded-[1.5rem] border border-slate-200 dark:border-white/10 flex gap-4">
                      <label className="relative w-16 h-16 rounded-full overflow-hidden group cursor-pointer shrink-0 border-2" style={{ borderColor: member.color }}>
                        {member.img ? <img src={member.img} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200 flex items-center justify-center"><Camera size={14}/></div>}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera size={14} className="text-white"/></div>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(`bureau.${idx}.img`, e)} />
                      </label>
                      <div className="flex-1 space-y-2 min-w-0">
                        <input type="text" value={member.name} onChange={e => updateField(`bureau.${idx}.name`, e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-lg px-3 py-1.5 text-sm font-black" placeholder="Nom" />
                        <div className="flex gap-2">
                          <input type="text" value={member.role} onChange={e => updateField(`bureau.${idx}.role`, e.target.value)} className="flex-1 bg-white dark:bg-white/5 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest" placeholder="Rôle" />
                          <input type="color" value={member.color} onChange={e => updateField(`bureau.${idx}.color`, e.target.value)} className="w-8 h-7 rounded cursor-pointer p-0 border-0" />
                        </div>
                        <input type="email" value={member.email} onChange={e => updateField(`bureau.${idx}.email`, e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-lg px-3 py-1.5 text-xs font-medium" placeholder="Email" />
                        <div className="flex gap-2 items-center">
                          <input type="text" value={member.phone} onChange={e => updateField(`bureau.${idx}.phone`, e.target.value)} className="flex-1 bg-white dark:bg-white/5 rounded-lg px-3 py-1.5 text-xs font-medium" placeholder="Téléphone" />
                          <button type="button" onClick={() => removeArrayItem('bureau', idx)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LES COACHS */}
              <div className="pt-8 border-t border-slate-200 dark:border-white/10">
                <div className="flex justify-between items-center mb-6 border-l-4 border-[#F72585] pl-4">
                  <h3 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white">Les Entraîneurs</h3>
                  <button type="button" onClick={() => addArrayItem('coaches', { name: 'Nouveau', role: 'Rôle', email: '', phone: '', img: '', color: '#F72585' })} className="bg-slate-100 dark:bg-white/10 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <Plus size={14}/> Ajouter
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.coaches.map((coach, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-[#081031] p-4 rounded-[1.5rem] border border-slate-200 dark:border-white/10 flex gap-4">
                      <label className="relative w-16 h-16 rounded-full overflow-hidden group cursor-pointer shrink-0 border-2" style={{ borderColor: coach.color }}>
                        {coach.img ? <img src={coach.img} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200 flex items-center justify-center"><Camera size={14}/></div>}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera size={14} className="text-white"/></div>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(`coaches.${idx}.img`, e)} />
                      </label>
                      <div className="flex-1 space-y-2 min-w-0">
                        <input type="text" value={coach.name} onChange={e => updateField(`coaches.${idx}.name`, e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-lg px-3 py-1.5 text-sm font-black" placeholder="Nom" />
                        <div className="flex gap-2">
                          <input type="text" value={coach.role} onChange={e => updateField(`coaches.${idx}.role`, e.target.value)} className="flex-1 bg-white dark:bg-white/5 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest" placeholder="Rôle" />
                          <input type="color" value={coach.color} onChange={e => updateField(`coaches.${idx}.color`, e.target.value)} className="w-8 h-7 rounded cursor-pointer p-0 border-0" />
                        </div>
                        <input type="email" value={coach.email} onChange={e => updateField(`coaches.${idx}.email`, e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-lg px-3 py-1.5 text-xs font-medium" placeholder="Email" />
                        <div className="flex gap-2 items-center">
                          <input type="text" value={coach.phone} onChange={e => updateField(`coaches.${idx}.phone`, e.target.value)} className="flex-1 bg-white dark:bg-white/5 rounded-lg px-3 py-1.5 text-xs font-medium" placeholder="Téléphone" />
                          <button type="button" onClick={() => removeArrayItem('coaches', idx)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </form>
      </div>
    </div>
  );
}