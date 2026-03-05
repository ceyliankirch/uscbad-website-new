'use client';
import React, { useState, useEffect } from 'react';
import { Save, Loader2, Image as ImageIcon, Camera, Settings, Star, Heart, Zap, Trophy, Shield, Users, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminPoleFemininPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState(null);

  // Icônes disponibles pour les valeurs
  const availableIcons = ['Heart', 'Zap', 'Trophy', 'Star', 'Shield', 'Users'];

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/pole-feminin-config');
      
      if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success && data.data) {
          setFormData(data.data);
        } else {
          throw new Error("Format de données invalide");
        }
      } else {
        throw new Error("L'API n'a pas répondu avec du JSON. Vérifiez que la route API existe.");
      }
    } catch (error) {
      console.error("Erreur de chargement", error);
      setMessage({ type: 'error', text: `Erreur de chargement : ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (path, value) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const newData = JSON.parse(JSON.stringify(prev));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const res = await fetch('/api/admin/pole-feminin-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await res.json();
        if (result.success) {
          setMessage({ type: 'success', text: 'Paramètres du Pôle Féminin enregistrés.' });
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } else {
          throw new Error(result.error || "Erreur serveur");
        }
      } else {
        throw new Error("L'API n'a pas répondu avec du JSON.");
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: `Erreur lors de la sauvegarde : ${error.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !formData) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#F72585]" size={48} /></div>;

  const tabs = [
    { id: 'hero', label: 'En-tête (Hero)' },
    { id: 'valeurs', label: 'Les Valeurs' },
    { id: 'programme', label: 'Programme & Photo' },
    { id: 'temoignage', label: 'Témoignage & CTA' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 font-['Montserrat']">
      
      <div className="mb-8 border-b border-slate-200 dark:border-white/10 pb-6 flex flex-col lg:flex-row justify-between lg:items-end gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 pt-2">
            Pôle <span className="text-[#F72585]">Féminin</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Éditez le contenu de la page Pôle Féminin</p>
        </div>
        <button onClick={handleSubmit} disabled={isSaving || !formData} className="bg-[#F72585] text-white px-8 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-[#d91c70] transition-all shadow-lg shadow-[#F72585]/20 disabled:opacity-50">
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Enregistrer
        </button>
      </div>

      {message.text && (
        <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      {/* Si pas de formData (erreur API), on affiche juste le message d'erreur et on cache le formulaire */}
      {!formData ? (
        <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 p-10 text-center shadow-sm">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-xl font-black uppercase italic text-slate-400 mb-2">Impossible de charger les données</h3>
          <p className="text-sm font-bold text-slate-500">Veuillez vérifier que l'API est correctement configurée et réessayez.</p>
          <button onClick={fetchConfig} className="mt-6 text-[#F72585] font-bold uppercase tracking-widest text-xs underline">Réessayer</button>
        </div>
      ) : (
        <>
          {/* TABS NAVIGATION */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-full font-black uppercase text-[10px] tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#081031] dark:bg-white text-white dark:text-[#081031]' : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 p-6 lg:p-10 shadow-sm">
            <form onSubmit={handleSubmit}>

              {/* TAB: HERO */}
              {activeTab === 'hero' && (
                <div className="space-y-6 animate-in fade-in">
                  <h3 className="text-xl font-[900] uppercase italic mb-6 text-[#081031] dark:text-white">Section En-tête (Hero)</h3>
                  <div className="space-y-4 max-w-3xl">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Texte du Badge</label>
                      <input type="text" value={formData.hero.badgeText} onChange={e => updateField('hero.badgeText', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 focus:border-[#F72585] outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Titre Blanc</label>
                        <input type="text" value={formData.hero.title1} onChange={e => updateField('hero.title1', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 focus:border-[#F72585] outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[#F72585] tracking-widest">Titre Couleur (Rose)</label>
                        <input type="text" value={formData.hero.title2} onChange={e => updateField('hero.title2', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 focus:border-[#F72585] outline-none text-[#F72585]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Description</label>
                      <textarea rows="3" value={formData.hero.description} onChange={e => updateField('hero.description', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 focus:border-[#F72585] outline-none resize-none"></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: VALEURS */}
              {activeTab === 'valeurs' && (
                <div className="space-y-6 animate-in fade-in">
                  <h3 className="text-xl font-[900] uppercase italic mb-6 text-[#081031] dark:text-white">Les 3 Valeurs (Cartes)</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {formData.values.map((valeur, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-[#081031] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Titre de la valeur</label>
                          <input type="text" value={valeur.title} onChange={e => updateField(`values.${idx}.title`, e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 focus:border-[#F72585] outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Description</label>
                          <textarea rows="3" value={valeur.description} onChange={e => updateField(`values.${idx}.description`, e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-xl px-4 py-3 text-xs font-bold border border-slate-200 dark:border-white/10 focus:border-[#F72585] outline-none resize-none"></textarea>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Icône</label>
                            <select value={valeur.icon} onChange={e => updateField(`values.${idx}.icon`, e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-xl px-4 py-3 text-xs font-bold border border-slate-200 dark:border-white/10 appearance-none">
                              {availableIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Couleur</label>
                            <input type="color" value={valeur.color} onChange={e => updateField(`values.${idx}.color`, e.target.value)} className="w-full h-11 rounded-xl cursor-pointer border-0 p-0" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: PROGRAMME */}
              {activeTab === 'programme' && (
                <div className="space-y-10 animate-in fade-in">
                  <div>
                    <h3 className="text-xl font-[900] uppercase italic mb-6 text-[#081031] dark:text-white">Image d'illustration</h3>
                    <div className="flex gap-6 items-start">
                      <label className="relative w-48 lg:w-64 aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer border-4 border-slate-100 dark:border-white/10 shadow-lg bg-slate-100 dark:bg-[#081031] flex flex-col items-center justify-center shrink-0">
                        {formData.program.image ? <img src={formData.program.image} className="w-full h-full object-cover" /> : <div className="text-slate-400 text-center p-4"><Camera size={32} className="mx-auto mb-2" /><span className="text-[10px] font-black uppercase">Format 4:5</span></div>}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera size={24} className="text-white"/></div>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('program.image', e)} />
                      </label>
                      <div className="space-y-4 flex-1 max-w-sm">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Badge sur l'image (Ligne 1)</label>
                          <input type="text" value={formData.program.badgeTitle} onChange={e => updateField('program.badgeTitle', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 focus:border-[#F72585] outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Badge sur l'image (Ligne 2)</label>
                          <input type="text" value={formData.program.badgeSubtitle} onChange={e => updateField('program.badgeSubtitle', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 focus:border-[#F72585] outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-200 dark:border-white/10">
                    <h3 className="text-xl font-[900] uppercase italic mb-6 text-[#081031] dark:text-white">Texte Principal & Points forts</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Titre Blanc</label>
                            <input type="text" value={formData.program.title1} onChange={e => updateField('program.title1', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 focus:border-[#F72585] outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-[#F72585] tracking-widest">Titre Rose</label>
                            <input type="text" value={formData.program.title2} onChange={e => updateField('program.title2', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 focus:border-[#F72585] outline-none text-[#F72585]" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Paragraphe Intro</label>
                          <textarea rows="4" value={formData.program.description} onChange={e => updateField('program.description', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 focus:border-[#F72585] outline-none resize-none"></textarea>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-slate-50 dark:bg-[#081031] p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
                          <label className="text-[10px] font-black uppercase text-[#F72585] tracking-widest">Point Fort 1 (Rose)</label>
                          <input type="text" value={formData.program.feature1Title} onChange={e => updateField('program.feature1Title', e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-xl px-4 py-2 text-sm font-bold border border-slate-200 dark:border-white/5 focus:border-[#F72585] outline-none" />
                          <textarea rows="2" value={formData.program.feature1Desc} onChange={e => updateField('program.feature1Desc', e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-xl px-4 py-2 text-xs font-bold border border-slate-200 dark:border-white/5 focus:border-[#F72585] outline-none resize-none"></textarea>
                        </div>
                        <div className="bg-slate-50 dark:bg-[#081031] p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
                          <label className="text-[10px] font-black uppercase text-[#0065FF] tracking-widest">Point Fort 2 (Bleu)</label>
                          <input type="text" value={formData.program.feature2Title} onChange={e => updateField('program.feature2Title', e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-xl px-4 py-2 text-sm font-bold border border-slate-200 dark:border-white/5 focus:border-[#0065FF] outline-none" />
                          <textarea rows="2" value={formData.program.feature2Desc} onChange={e => updateField('program.feature2Desc', e.target.value)} className="w-full bg-white dark:bg-white/5 rounded-xl px-4 py-2 text-xs font-bold border border-slate-200 dark:border-white/5 focus:border-[#0065FF] outline-none resize-none"></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: TEMOIGNAGE & CTA */}
              {activeTab === 'temoignage' && (
                <div className="space-y-10 animate-in fade-in">
                  <div>
                    <h3 className="text-xl font-[900] uppercase italic mb-6 text-[#081031] dark:text-white">Témoignage (Bandeau Rose)</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Citation</label>
                        <textarea rows="4" value={formData.testimonial.quote} onChange={e => updateField('testimonial.quote', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 focus:border-[#F72585] outline-none resize-none"></textarea>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Rôle (ex: Capitaine Équipe 2)</label>
                          <input type="text" value={formData.testimonial.authorRole} onChange={e => updateField('testimonial.authorRole', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 focus:border-[#F72585] outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Sous-titre (ex: Joueuse depuis 5 ans)</label>
                          <input type="text" value={formData.testimonial.authorSub} onChange={e => updateField('testimonial.authorSub', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 focus:border-[#F72585] outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-200 dark:border-white/10">
                    <h3 className="text-xl font-[900] uppercase italic mb-6 text-[#081031] dark:text-white">Call to Action (Bas de page)</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Titre Blanc</label>
                          <input type="text" value={formData.cta.title1} onChange={e => updateField('cta.title1', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 focus:border-[#F72585] outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-[#F72585] tracking-widest">Titre Rose</label>
                          <input type="text" value={formData.cta.title2} onChange={e => updateField('cta.title2', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 focus:border-[#F72585] outline-none text-[#F72585]" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Description</label>
                          <textarea rows="2" value={formData.cta.description} onChange={e => updateField('cta.description', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 focus:border-[#F72585] outline-none resize-none"></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Texte du bouton (Lien Inscription)</label>
                          <input type="text" value={formData.cta.buttonText} onChange={e => updateField('cta.buttonText', e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-white/10 focus:border-[#F72585] outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </form>
          </div>
        </>
      )}
    </div>
  );
}