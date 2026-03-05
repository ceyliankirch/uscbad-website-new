'use client';
import React, { useState, useEffect } from 'react';
import { Save, Loader2, Link as LinkIcon, Activity, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminInterclubsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    team1Url: '',
    clubUrl: '',
    team1Id: '',
    team2Id: '',
    team3Id: '',
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/admin/icbad-config');
        const json = await res.json();
        if (json.success && json.data) {
          setFormData({
            team1Url: json.data.team1Url || '',
            clubUrl: json.data.clubUrl || '',
            team1Id: json.data.team1Id || '',
            team2Id: json.data.team2Id || '',
            team3Id: json.data.team3Id || '',
          });
        }
      } catch (error) {
        console.error("Erreur de chargement", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/admin/icbad-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const json = await res.json();
      if (json.success) {
        setMessage({ type: 'success', text: 'Configuration mise à jour avec succès !' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Impossible de joindre le serveur.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0065FF]" size={48} /></div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 leading-tight pt-2">
            Paramètres <span className="text-[#0065FF] dark:text-[#0EE2E2]">Interclubs</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Mettez à jour les liens FFBaD / ICBAD pour la nouvelle saison.</p>
        </div>
      </div>

      {message.text && (
        <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm animate-in zoom-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION LIENS URL */}
        <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
            <h2 className="text-lg font-[900] uppercase italic text-[#081031] dark:text-white flex items-center gap-2">
              <LinkIcon size={18} className="text-[#0065FF] dark:text-[#0EE2E2]" /> Liens des Pages ICBAD
            </h2>
          </div>
          <div className="p-6 lg:p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">URL Équipe 1 (Pour récupérer les prochaines rencontres)</label>
              <input type="url" name="team1Url" value={formData.team1Url} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#0065FF] transition-all" />
              <p className="text-xs text-slate-400 font-medium">Ex: https://icbad.ffbad.org/equipe/58349</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">URL Globale du Club (Pour récupérer tous les classements)</label>
              <input type="url" name="clubUrl" value={formData.clubUrl} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#0065FF] transition-all" />
              <p className="text-xs text-slate-400 font-medium">Ex: https://icbad.ffbad.org/instance/USC94</p>
            </div>
          </div>
        </div>

        {/* SECTION IDENTIFIANTS */}
        <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
            <h2 className="text-lg font-[900] uppercase italic text-[#081031] dark:text-white flex items-center gap-2">
              <Activity size={18} className="text-[#0065FF] dark:text-[#0EE2E2]" /> Identifiants des Équipes
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Ces codes permettent au robot de trouver le bon classement sur la page du club.</p>
          </div>
          <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Équipe 1 (Nationale 1)</label>
              <input type="text" name="team1Id" value={formData.team1Id} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#0065FF] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Équipe 2 (Régionale)</label>
              <input type="text" name="team2Id" value={formData.team2Id} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#0065FF] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Équipe 3 (Régionale)</label>
              <input type="text" name="team3Id" value={formData.team3Id} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#0065FF] transition-all" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isSaving} className="bg-[#0065FF] dark:bg-[#0EE2E2] text-white dark:text-[#081031] px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-[#0065FF]/20 disabled:opacity-50">
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Sauvegarder la configuration
          </button>
        </div>

      </form>
    </div>
  );
}