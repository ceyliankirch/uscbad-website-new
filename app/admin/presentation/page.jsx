'use client';
import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';

const TABS = [
  { id: 'hero', label: 'Hero' },
  { id: 'stats', label: 'Chiffres clés' },
  { id: 'histoire', label: 'Histoire' },
  { id: 'profils', label: 'Profils' },
  { id: 'entraineurs', label: 'Entraîneurs' },
];

const ICON_OPTIONS = ['Users', 'Trophy', 'MapPin', 'Target', 'Shield', 'Heart'];

const inputClass = "w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-[#081031] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0065FF] transition-all";
const labelClass = "block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5";

export default function AdminPresentationPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState(null);

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/presentation-config');
      const data = await res.json();
      if (data.success) setFormData(data.data);
      else throw new Error(data.error);
    } catch (err) {
      setMessage({ type: 'error', text: `Erreur de chargement : ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (path, value) => {
    setFormData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = isNaN(keys[i]) ? keys[i] : parseInt(keys[i]);
        cur = cur[k];
      }
      const lastKey = isNaN(keys[keys.length - 1]) ? keys[keys.length - 1] : parseInt(keys[keys.length - 1]);
      cur[lastKey] = value;
      return next;
    });
  };

  const handleImageUpload = (path, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return alert('Image trop lourde (Max 2Mo)');
    const reader = new FileReader();
    reader.onloadend = () => updateField(path, reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/admin/presentation-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (result.success) {
        setMessage({ type: 'success', text: 'Page Présentation mise à jour.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else throw new Error(result.error);
    } catch (err) {
      setMessage({ type: 'error', text: `Erreur : ${err.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-[#0065FF]" size={40} />
    </div>
  );

  if (!formData) return (
    <div className="text-center py-20 text-red-500 font-bold">{message.text || 'Erreur de chargement'}</div>
  );

  return (
    <div className="font-['Montserrat'] pb-32 max-w-[1200px] mx-auto">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="text-2xl lg:text-3xl font-[900] italic uppercase text-[#081031] dark:text-white">
            Page <span className="text-[#0065FF]">Présentation</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Modifier le contenu de la page club</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#0065FF] hover:bg-[#0052cc] text-white px-6 py-3 rounded-xl font-[900] uppercase text-xs tracking-widest transition-all disabled:opacity-50 shadow-lg"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Enregistrer
        </button>
      </div>

      {/* MESSAGE */}
      {message.text && (
        <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 font-bold text-sm ${message.type === 'success' ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20'}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* TABS */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? 'bg-[#081031] dark:bg-[#0EE2E2] text-white dark:text-[#081031]'
                : 'bg-white dark:bg-[#0f172a] text-slate-500 border border-slate-200 dark:border-white/10 hover:border-[#0065FF] hover:text-[#0065FF]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===================== TAB: HERO ===================== */}
      {activeTab === 'hero' && (
        <div className="space-y-6 bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 lg:p-8 border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-[900] uppercase italic text-[#081031] dark:text-white">Section Hero</h2>

          <div>
            <label className={labelClass}>Image de couverture</label>
            <div className="flex gap-3 items-center">
              {formData.hero?.coverImage && (
                <img src={formData.hero.coverImage} alt="Cover" className="w-24 h-16 object-cover rounded-xl border border-slate-200 dark:border-white/10 shrink-0" />
              )}
              <div className="flex-1 space-y-2">
                <input type="text" value={formData.hero?.coverImage || ''} onChange={e => updateField('hero.coverImage', e.target.value)} placeholder="URL de l'image" className={inputClass} />
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0065FF] hover:underline">
                  <ImageIcon size={14} /> Uploader une image (max 2Mo)
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload('hero.coverImage', e)} />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Badge texte</label>
              <input type="text" value={formData.hero?.badgeText || ''} onChange={e => updateField('hero.badgeText', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Titre 1</label>
              <input type="text" value={formData.hero?.title1 || ''} onChange={e => updateField('hero.title1', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Titre 2 (surligné en bleu)</label>
              <input type="text" value={formData.hero?.title2 || ''} onChange={e => updateField('hero.title2', e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea rows={4} value={formData.hero?.description || ''} onChange={e => updateField('hero.description', e.target.value)} className={inputClass + ' resize-none'} />
          </div>
        </div>
      )}

      {/* ===================== TAB: STATS ===================== */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          {(formData.stats || []).map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-[#0f172a] rounded-[1.5rem] p-5 border border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Chiffre clé {idx + 1}</span>
                <button onClick={() => {
                  const next = [...formData.stats];
                  next.splice(idx, 1);
                  updateField('stats', next);
                }} className="p-1.5 text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className={labelClass}>Valeur</label>
                  <input type="number" value={stat.value || ''} onChange={e => updateField(`stats.${idx}.value`, parseInt(e.target.value))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Suffixe</label>
                  <input type="text" value={stat.suffix || ''} onChange={e => updateField(`stats.${idx}.suffix`, e.target.value)} className={inputClass} placeholder="ex: + ou ★" />
                </div>
                <div>
                  <label className={labelClass}>Label</label>
                  <input type="text" value={stat.label || ''} onChange={e => updateField(`stats.${idx}.label`, e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Couleur</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={stat.color || '#0065FF'} onChange={e => updateField(`stats.${idx}.color`, e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 dark:border-white/10 cursor-pointer" />
                    <input type="text" value={stat.color || ''} onChange={e => updateField(`stats.${idx}.color`, e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Icône</label>
                  <select value={stat.icon || 'Users'} onChange={e => updateField(`stats.${idx}.icon`, e.target.value)} className={inputClass}>
                    {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => updateField('stats', [...(formData.stats || []), { value: 0, suffix: '', label: '', color: '#0065FF', icon: 'Users' }])}
            className="flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-[1.5rem] text-xs font-black uppercase tracking-widest text-slate-400 hover:border-[#0065FF] hover:text-[#0065FF] transition-colors"
          >
            <Plus size={14} /> Ajouter un chiffre
          </button>
        </div>
      )}

      {/* ===================== TAB: HISTOIRE ===================== */}
      {activeTab === 'histoire' && (
        <div className="space-y-6 bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 lg:p-8 border border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-[900] uppercase italic text-[#081031] dark:text-white">Section Histoire</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Titre 1</label>
              <input type="text" value={formData.history?.title1 || ''} onChange={e => updateField('history.title1', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Titre 2 (surligné)</label>
              <input type="text" value={formData.history?.title2 || ''} onChange={e => updateField('history.title2', e.target.value)} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Sous-titre</label>
              <input type="text" value={formData.history?.subtitle || ''} onChange={e => updateField('history.subtitle', e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Paragraphe 1</label>
            <textarea rows={4} value={formData.history?.p1 || ''} onChange={e => updateField('history.p1', e.target.value)} className={inputClass + ' resize-none'} />
          </div>
          <div>
            <label className={labelClass}>Paragraphe 2</label>
            <textarea rows={4} value={formData.history?.p2 || ''} onChange={e => updateField('history.p2', e.target.value)} className={inputClass + ' resize-none'} />
          </div>
          <div>
            <label className={labelClass}>Citation</label>
            <textarea rows={2} value={formData.history?.quote || ''} onChange={e => updateField('history.quote', e.target.value)} className={inputClass + ' resize-none'} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-white/5">
            {[{ prefix: 'img1', label: 'Image gauche' }, { prefix: 'img2', label: 'Image droite' }].map(({ prefix, label }) => (
              <div key={prefix} className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">{label}</h3>
                {formData.history?.[prefix] && (
                  <img src={formData.history[prefix]} alt={label} className="w-full h-32 object-cover rounded-xl border border-slate-200 dark:border-white/10" />
                )}
                <input type="text" value={formData.history?.[prefix] || ''} onChange={e => updateField(`history.${prefix}`, e.target.value)} placeholder="URL de l'image" className={inputClass} />
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0065FF] hover:underline">
                  <ImageIcon size={14} /> Uploader (max 2Mo)
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(`history.${prefix}`, e)} />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClass}>Nombre / Année</label>
                    <input type="text" value={formData.history?.[`${prefix}Num`] || ''} onChange={e => updateField(`history.${prefix}Num`, e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Texte</label>
                    <input type="text" value={formData.history?.[`${prefix}Text`] || ''} onChange={e => updateField(`history.${prefix}Text`, e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB: PROFILS ===================== */}
      {activeTab === 'profils' && (
        <div className="space-y-4">
          {(formData.profiles || []).map((profile, idx) => (
            <div key={idx} className="bg-white dark:bg-[#0f172a] rounded-[1.5rem] p-5 border border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Profil {idx + 1}</span>
                <button onClick={() => {
                  const next = [...formData.profiles];
                  next.splice(idx, 1);
                  updateField('profiles', next);
                }} className="p-1.5 text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Titre</label>
                  <input type="text" value={profile.title || ''} onChange={e => updateField(`profiles.${idx}.title`, e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Sous-titre</label>
                  <input type="text" value={profile.subtitle || ''} onChange={e => updateField(`profiles.${idx}.subtitle`, e.target.value)} className={inputClass} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Description</label>
                  <textarea rows={2} value={profile.desc || ''} onChange={e => updateField(`profiles.${idx}.desc`, e.target.value)} className={inputClass + ' resize-none'} />
                </div>
                <div>
                  <label className={labelClass}>Image URL</label>
                  <input type="text" value={profile.img || ''} onChange={e => updateField(`profiles.${idx}.img`, e.target.value)} className={inputClass} placeholder="URL" />
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0065FF] hover:underline mt-1">
                    <ImageIcon size={12} /> Uploader
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(`profiles.${idx}.img`, e)} />
                  </label>
                </div>
                <div>
                  <label className={labelClass}>Couleur</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={profile.color || '#0065FF'} onChange={e => updateField(`profiles.${idx}.color`, e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 dark:border-white/10 cursor-pointer" />
                    <input type="text" value={profile.color || ''} onChange={e => updateField(`profiles.${idx}.color`, e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => updateField('profiles', [...(formData.profiles || []), { title: '', subtitle: '', desc: '', img: '', color: '#0065FF' }])}
            className="flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-[1.5rem] text-xs font-black uppercase tracking-widest text-slate-400 hover:border-[#0065FF] hover:text-[#0065FF] transition-colors"
          >
            <Plus size={14} /> Ajouter un profil
          </button>
        </div>
      )}

      {/* ===================== TAB: ENTRAÎNEURS ===================== */}
      {activeTab === 'entraineurs' && (
        <div className="space-y-4">
          {(formData.coaches || []).map((coach, idx) => (
            <div key={idx} className="bg-white dark:bg-[#0f172a] rounded-[1.5rem] p-5 border border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Entraîneur {idx + 1}</span>
                <button onClick={() => {
                  const next = [...formData.coaches];
                  next.splice(idx, 1);
                  updateField('coaches', next);
                }} className="p-1.5 text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Nom</label>
                  <input type="text" value={coach.name || ''} onChange={e => updateField(`coaches.${idx}.name`, e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Rôle</label>
                  <input type="text" value={coach.role || ''} onChange={e => updateField(`coaches.${idx}.role`, e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" value={coach.email || ''} onChange={e => updateField(`coaches.${idx}.email`, e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Téléphone</label>
                  <input type="text" value={coach.phone || ''} onChange={e => updateField(`coaches.${idx}.phone`, e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Photo URL</label>
                  <input type="text" value={coach.img || ''} onChange={e => updateField(`coaches.${idx}.img`, e.target.value)} className={inputClass} placeholder="URL" />
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0065FF] hover:underline mt-1">
                    <ImageIcon size={12} /> Uploader
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(`coaches.${idx}.img`, e)} />
                  </label>
                </div>
                <div>
                  <label className={labelClass}>Couleur badge</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={coach.color || '#F72585'} onChange={e => updateField(`coaches.${idx}.color`, e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 dark:border-white/10 cursor-pointer" />
                    <input type="text" value={coach.color || ''} onChange={e => updateField(`coaches.${idx}.color`, e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => updateField('coaches', [...(formData.coaches || []), { name: '', role: '', email: '', phone: '', img: '', color: '#F72585' }])}
            className="flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-[1.5rem] text-xs font-black uppercase tracking-widest text-slate-400 hover:border-[#0065FF] hover:text-[#0065FF] transition-colors"
          >
            <Plus size={14} /> Ajouter un entraîneur
          </button>
        </div>
      )}

      {/* SAVE BOTTOM */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#0065FF] hover:bg-[#0052cc] text-white px-8 py-4 rounded-xl font-[900] uppercase text-sm tracking-widest transition-all disabled:opacity-50 shadow-lg"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
