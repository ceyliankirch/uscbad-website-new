'use client';
import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, CheckCircle, AlertCircle, GripVertical, Megaphone, Eye, EyeOff } from 'lucide-react';

const inputClass = "w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-[#081031] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0065FF] transition-all";
const labelClass = "block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5";

const EMPTY_TARIF = { title: '', desc: '', price: '', badgeColor: '#0065FF', textDark: false };

export default function AdminTarifsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('tarifs');
  const [formData, setFormData] = useState(null);

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/inscriptions-config');
      const data = await res.json();
      if (data.success) setFormData(data.data);
      else throw new Error(data.error);
    } catch (err) {
      setMessage({ type: 'error', text: `Erreur de chargement : ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/admin/inscriptions-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (result.success) {
        setMessage({ type: 'success', text: 'Tarifs & inscriptions mis à jour.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else throw new Error(result.error);
    } catch (err) {
      setMessage({ type: 'error', text: `Erreur : ${err.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  const updateTarif = (idx, field, value) => {
    const next = [...formData.tarifs];
    next[idx] = { ...next[idx], [field]: value };
    setFormData({ ...formData, tarifs: next });
  };

  const removeTarif = (idx) => {
    const next = [...formData.tarifs];
    next.splice(idx, 1);
    setFormData({ ...formData, tarifs: next });
  };

  const addTarif = () => {
    setFormData({ ...formData, tarifs: [...(formData.tarifs || []), { ...EMPTY_TARIF }] });
  };

  const updateNote = (idx, value) => {
    const next = [...formData.notes];
    next[idx] = value;
    setFormData({ ...formData, notes: next });
  };

  const removeNote = (idx) => {
    const next = [...formData.notes];
    next.splice(idx, 1);
    setFormData({ ...formData, notes: next });
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
            Tarifs & <span className="text-[#0065FF]">Inscriptions</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Modifier la grille tarifaire et les infos d'inscription</p>
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
      <div className="flex gap-2 mb-8">
        {[{ id: 'tarifs', label: 'Grille tarifaire' }, { id: 'infos', label: 'Infos & Notes' }].map(tab => (
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

      {/* ===================== TAB: TARIFS ===================== */}
      {activeTab === 'tarifs' && (
        <div className="space-y-4">
          {(formData.tarifs || []).map((tarif, idx) => (
            <div key={idx} className="bg-white dark:bg-[#0f172a] rounded-[1.5rem] p-5 border border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GripVertical size={16} className="text-slate-300 dark:text-slate-600" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">Tarif {idx + 1}</span>
                  <div
                    className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: tarif.badgeColor }}
                  />
                </div>
                <button onClick={() => removeTarif(idx)} className="p-1.5 text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className={labelClass}>Titre / Catégorie</label>
                  <input type="text" value={tarif.title || ''} onChange={e => updateTarif(idx, 'title', e.target.value)} className={inputClass} placeholder="ex: Adultes compétiteurs" />
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <input type="text" value={tarif.desc || ''} onChange={e => updateTarif(idx, 'desc', e.target.value)} className={inputClass} placeholder="ex: 2 entraînements" />
                </div>
                <div>
                  <label className={labelClass}>Prix</label>
                  <input type="text" value={tarif.price || ''} onChange={e => updateTarif(idx, 'price', e.target.value)} className={inputClass} placeholder="ex: 260€" />
                </div>
                <div>
                  <label className={labelClass}>Couleur du badge</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={tarif.badgeColor || '#0065FF'} onChange={e => updateTarif(idx, 'badgeColor', e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 dark:border-white/10 cursor-pointer shrink-0" />
                    <input type="text" value={tarif.badgeColor || ''} onChange={e => updateTarif(idx, 'badgeColor', e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id={`textDark-${idx}`}
                    checked={tarif.textDark || false}
                    onChange={e => updateTarif(idx, 'textDark', e.target.checked)}
                    className="w-4 h-4 rounded accent-[#0065FF] cursor-pointer"
                  />
                  <label htmlFor={`textDark-${idx}`} className="text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">
                    Texte sombre sur le badge (pour fonds clairs)
                  </label>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addTarif}
            className="flex items-center gap-2 w-full justify-center py-4 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-[1.5rem] text-xs font-black uppercase tracking-widest text-slate-400 hover:border-[#0065FF] hover:text-[#0065FF] transition-colors"
          >
            <Plus size={14} /> Ajouter un tarif
          </button>
        </div>
      )}

      {/* ===================== TAB: INFOS ===================== */}
      {activeTab === 'infos' && (
        <div className="space-y-6">

          {/* BANDEAU D'ANNONCE */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Megaphone size={18} className="text-[#0065FF]" />
                <h2 className="text-sm font-[900] uppercase italic text-[#081031] dark:text-white">Bandeau d'annonce</h2>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, banner: { ...formData.banner, visible: !formData.banner?.visible } })}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-full border-2 font-black text-xs uppercase tracking-widest transition-all ${
                  formData.banner?.visible
                    ? 'border-green-400 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                    : 'border-slate-300 dark:border-white/10 text-slate-400'
                }`}
              >
                {formData.banner?.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                {formData.banner?.visible ? 'Visible' : 'Masqué'}
                <div className={`relative w-9 h-5 rounded-full transition-colors ${formData.banner?.visible ? 'bg-green-400' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.banner?.visible ? 'left-4' : 'left-0.5'}`} />
                </div>
              </button>
            </div>

            {/* APERÇU */}
            <div className={`mb-5 bg-[#0065FF] rounded-xl px-4 py-3 flex items-center justify-center gap-3 transition-opacity ${formData.banner?.visible ? 'opacity-100' : 'opacity-30'}`}>
              <Megaphone size={14} className="text-[#0EE2E2] shrink-0" />
              <div className="text-center">
                <p className="text-white font-[900] text-xs uppercase tracking-widest italic">{formData.banner?.title || '…'}</p>
                {formData.banner?.subtitle && <p className="text-[#0EE2E2] font-bold text-[10px] mt-0.5 opacity-90">{formData.banner.subtitle}</p>}
              </div>
              <span className="shrink-0 bg-[#0EE2E2] text-[#081031] px-2 py-0.5 rounded-full font-black text-[10px] uppercase">S'inscrire →</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className={labelClass}>Titre</label>
                <input
                  type="text"
                  value={formData.banner?.title || ''}
                  onChange={e => setFormData({ ...formData, banner: { ...formData.banner, title: e.target.value } })}
                  className={inputClass}
                  placeholder="ex: Inscriptions ouvertes !"
                />
              </div>
              <div>
                <label className={labelClass}>Sous-titre</label>
                <input
                  type="text"
                  value={formData.banner?.subtitle || ''}
                  onChange={e => setFormData({ ...formData, banner: { ...formData.banner, subtitle: e.target.value } })}
                  className={inputClass}
                  placeholder="ex: Les inscriptions pour la nouvelle saison sont désormais ouvertes."
                />
              </div>
            </div>
          </div>

          {/* Saison & lien */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
            <h2 className="text-sm font-[900] uppercase italic text-[#081031] dark:text-white mb-4">Informations générales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Saison</label>
                <input type="text" value={formData.saison || ''} onChange={e => setFormData({ ...formData, saison: e.target.value })} className={inputClass} placeholder="ex: Saison 2024 - 2025" />
              </div>
              <div>
                <label className={labelClass}>Lien d'inscription (MyFFBaD)</label>
                <input type="url" value={formData.inscriptionLink || ''} onChange={e => setFormData({ ...formData, inscriptionLink: e.target.value })} className={inputClass} placeholder="https://myffbad.fr" />
              </div>
            </div>
          </div>

          {/* Notes "Bon à savoir" */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
            <h2 className="text-sm font-[900] uppercase italic text-[#081031] dark:text-white mb-4">Notes "Bon à savoir"</h2>
            <div className="space-y-3">
              {(formData.notes || []).map((note, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <textarea
                    rows={2}
                    value={note}
                    onChange={e => updateNote(idx, e.target.value)}
                    className={inputClass + ' resize-none flex-1'}
                    placeholder="Texte de la note..."
                  />
                  <button onClick={() => removeNote(idx)} className="p-2 text-red-400 hover:text-red-600 transition-colors shrink-0 mt-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setFormData({ ...formData, notes: [...(formData.notes || []), ''] })}
                className="flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:border-[#0065FF] hover:text-[#0065FF] transition-colors"
              >
                <Plus size={14} /> Ajouter une note
              </button>
            </div>
          </div>
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
