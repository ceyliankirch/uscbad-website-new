'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Clock, MapPin, User, X, Save, Loader2, Building2, ChevronDown, Trophy } from 'lucide-react';

export default function AdminPlanning() {
  const [activeTab, setActiveTab] = useState('entraînement'); 
  const [activeDay, setActiveDay] = useState('Lundi'); 
  const [isCreneauModalOpen, setIsCreneauModalOpen] = useState(false);
  const [isGymnaseModalOpen, setIsGymnaseModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [editingGymnase, setEditingGymnase] = useState(null);
  
  const [sessions, setSessions] = useState([]);
  const [gymnases, setGymnases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resCreneaux, resGymnases] = await Promise.all([
        fetch('/api/creneaux'), fetch('/api/gymnases')
      ]);
      const dataCreneaux = await resCreneaux.json();
      const dataGymnases = await resGymnases.json();
      if (dataCreneaux.success) setSessions(dataCreneaux.data);
      if (dataGymnases.success) setGymnases(dataGymnases.data);
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreneauModal = (session = null) => { setEditingSession(session); setIsCreneauModalOpen(true); };
  const openGymnaseModal = (gymnase = null) => { setEditingGymnase(gymnase); setIsGymnaseModalOpen(true); };

  const handleDeleteCreneau = async (id) => {
    if (!window.confirm("Supprimer ce créneau ?")) return;
    const res = await fetch(`/api/creneaux/${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  return (
    <div className="min-h-screen font-['Montserrat'] space-y-10 pt-32 lg:pt-48 px-6 max-w-[1600px] mx-auto pb-20">
      
      {/* HEADER & TABS PRINCIPAUX */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl lg:text-5xl font-[900] italic uppercase text-[#081031] dark:text-white leading-none mb-6">
            Gestion du <span className="text-[#0065FF]">Planning</span>
          </h2>
          <div className="inline-flex p-1.5 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex-wrap">
            <button onClick={() => setActiveTab('entraînement')} className={`px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${activeTab === 'entraînement' ? 'bg-[#0065FF] text-white shadow-lg' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>Entraînements</button>
            <button onClick={() => setActiveTab('jeu-libre')} className={`px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${activeTab === 'jeu-libre' ? 'bg-[#0065FF] text-white shadow-lg' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>Jeu Libre</button>
            <button onClick={() => setActiveTab('gymnases')} className={`px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${activeTab === 'gymnases' ? 'bg-[#0EE2E2] text-[#081031] shadow-lg' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>Gymnases</button>
          </div>
        </div>

        <button onClick={() => activeTab === 'gymnases' ? openGymnaseModal() : openCreneauModal()} className="bg-[#081031] dark:bg-[#0EE2E2] text-white dark:text-[#081031] px-8 py-4 rounded-2xl font-[900] uppercase text-sm tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl">
          <Plus size={20} /> {activeTab === 'gymnases' ? 'Nouveau Gymnase' : 'Nouveau Créneau'}
        </button>
      </div>

      {/* SOUS-ONGLETS JOURS (ENTRAINEMENT UNIQUEMENT) */}
      {activeTab === 'entraînement' && (
        <div className="flex overflow-x-auto gap-3 pb-4 hide-scrollbar">
          {days.map(day => (
            <button 
              key={day} 
              onClick={() => setActiveDay(day)}
              className={`px-8 py-4 rounded-2xl transition-all border-2 uppercase text-xs tracking-tighter shrink-0
                ${activeDay === day 
                  ? 'bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/20 text-[#081031] dark:text-[#0EE2E2] font-[900]' 
                  : 'bg-white dark:bg-transparent border-slate-100 dark:border-white/5 text-slate-400 font-bold hover:border-[#0EE2E2]'
                }`}
            >
              {day}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0EE2E2]" size={48} /></div>
      ) : (
        <div className="w-full">
          {/* VUE ENTRAÎNEMENT */}
          {activeTab === 'entraînement' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
              {sessions
                .filter(s => s.day === activeDay && s.type !== 'Jeu Libre')
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map(session => (
                  <AdminSessionCard key={session._id} session={session} onEdit={() => openCreneauModal(session)} onDelete={() => handleDeleteCreneau(session._id)} />
                ))
              }
            </div>
          )}

          {/* VUE JEU LIBRE : Colonnes */}
          {activeTab === 'jeu-libre' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-start">
              {days.map(day => (
                <div key={day} className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200 dark:border-white/10">
                    <div className="h-4 w-1 bg-[#0065FF] rounded-full" />
                    <h4 className="font-black uppercase text-sm italic dark:text-white">{day}</h4>
                  </div>
                  {sessions
                    .filter(s => s.day === day && s.type === 'Jeu Libre')
                    .map(session => (
                      <AdminSessionCard key={session._id} session={session} compact onEdit={() => openCreneauModal(session)} onDelete={() => handleDeleteCreneau(session._id)} />
                    ))
                  }
                </div>
              ))}
            </div>
          )}

          {/* VUE GYMNASES */}
          {activeTab === 'gymnases' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {gymnases.map(gym => (
                   <div key={gym._id} className="bg-white dark:bg-[#0f172a] p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 relative group transition-all hover:shadow-xl">
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => openGymnaseModal(gym)} className="p-2 bg-[#0065FF] text-white rounded-full"><Pencil size={14}/></button>
                         <button onClick={() => {if(window.confirm("Supprimer?")) fetch(`/api/gymnases/${gym._id}`, {method:'DELETE'}).then(()=>fetchData())}} className="p-2 bg-red-500 text-white rounded-full"><Trash2 size={14}/></button>
                      </div>
                      <div className="bg-[#0EE2E2] p-4 w-max rounded-2xl text-[#081031] mb-5"><Building2 size={28} /></div>
                      <h4 className="font-black uppercase italic text-2xl dark:text-white">{gym.name}</h4>
                      <p className="text-sm font-bold text-slate-400 mt-2">{gym.address}</p>
                   </div>
                ))}
             </div>
          )}
        </div>
      )}

      {/* MODALS */}
      {isCreneauModalOpen && <PlanningFormModal session={editingSession} category={activeTab} daysList={days} gymnasesList={gymnases} onClose={() => setIsCreneauModalOpen(false)} refreshData={fetchData} />}
      {isGymnaseModalOpen && <GymnaseFormModal gymnase={editingGymnase} onClose={() => setIsGymnaseModalOpen(false)} refreshData={fetchData} />}
    </div>
  );
}

/* --- CARTE SESSION ADMIN --- */
const AdminSessionCard = ({ session, onEdit, onDelete, compact = false }) => {
  let iconColor = 'text-[#0065FF]';
  if (session.type === 'Jeunes') iconColor = 'text-[#FFD500]';
  else if (session.type === 'Pôle Féminin') iconColor = 'text-[#F72585]';
  else if (session.type === 'Indivs') iconColor = 'text-[#0cc9c9]';

  return (
    <div className={`bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-6 rounded-[2rem] shadow-sm relative group transition-all hover:shadow-xl ${compact ? 'min-w-0' : 'w-full'}`}>
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-2 bg-slate-50 dark:bg-white/5 rounded-full hover:bg-[#0065FF] hover:text-white transition-colors"><Pencil size={14} /></button>
        <button onClick={onDelete} className="p-2 bg-slate-50 dark:bg-white/5 rounded-full hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={14} /></button>
      </div>

      <div className="mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-white/5 px-3 py-1 rounded-lg dark:text-slate-400">
          {session.title || session.type}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Clock size={compact ? 16 : 20} className={session.isInterclub ? 'text-[#FFD500]' : iconColor} />
          <span className={`font-black italic ${compact ? 'text-sm' : 'text-xl'} dark:text-white`}>{session.startTime} - {session.endTime}</span>
        </div>
        <div className="flex items-center gap-3 opacity-50">
          <MapPin size={compact ? 14 : 16} className="dark:text-white" />
          <span className="font-bold text-[10px] uppercase truncate dark:text-white">{session.gymnasium}</span>
        </div>

        {/* AFFICHAGE INTERCLUB SUR LA CARTE */}
        {session.isInterclub && (
          <div className="mt-4 flex items-center justify-center gap-2 bg-[#FFD500] py-2 rounded-xl text-[#081031] font-[900] text-[10px] uppercase tracking-tighter">
            <Trophy size={14} /> Interclubs
          </div>
        )}

        {!compact && session.coach && !session.isInterclub && (
          <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
            <User size={14} className={iconColor} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Coach: {session.coach}</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- SELECT CUSTOM --- */
const CustomSelect = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => { if (selectRef.current && !selectRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="space-y-1 relative" ref={selectRef}>
      <label className="text-[10px] font-black uppercase tracking-widest ml-2 opacity-50 dark:text-white">{label}</label>
      <div onClick={() => setIsOpen(!isOpen)} className={`w-full bg-slate-50 dark:bg-[#040817] border ${isOpen ? 'border-[#0065FF]' : 'border-slate-200 dark:border-white/10'} p-4 rounded-2xl font-bold text-sm cursor-pointer flex justify-between items-center transition-colors dark:text-white`}>
        <span>{value || "Sélectionner..."}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180 text-[#0065FF]' : ''}`} />
      </div>
      {isOpen && (
        <ul className="absolute z-50 top-[105%] left-0 w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden font-bold text-sm max-h-56 overflow-y-auto">
          {options.map((opt) => (
            <li key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`p-4 cursor-pointer hover:bg-[#0065FF]/10 hover:text-[#0065FF] dark:text-white ${value === opt ? 'bg-[#0065FF]/10 text-[#0065FF]' : ''}`}>{opt}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* --- MODAL CRÉNEAU CORRIGÉE --- */
function PlanningFormModal({ session, category, daysList, gymnasesList, onClose, refreshData }) {
  const [isSaving, setIsSaving] = useState(false);
  
  // État initial
  const [formData, setFormData] = useState({
    title: '',
    type: category === 'jeu-libre' ? 'Jeu Libre' : 'Adultes - Loisirs',
    day: 'Lundi',
    startTime: '18:00',
    endTime: '20:00',
    gymnasium: gymnasesList[0]?.name || '',
    coach: '',
    isInterclub: false
  });

  // EFFET CRUCIAL : Met à jour le formulaire quand la session change ou s'ouvre
  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title || '',
        type: session.type || '',
        day: session.day || 'Lundi',
        startTime: session.startTime || '18:00',
        endTime: session.endTime || '20:00',
        gymnasium: session.gymnasium || '',
        coach: session.coach || '',
        isInterclub: !!session.isInterclub // Force le format booléen
      });
    } else {
      // Réinitialisation pour un nouveau créneau
      setFormData({
        title: '',
        type: category === 'jeu-libre' ? 'Jeu Libre' : 'Adultes - Loisirs',
        day: 'Lundi',
        startTime: '18:00',
        endTime: '20:00',
        gymnasium: gymnasesList[0]?.name || '',
        coach: '',
        isInterclub: false
      });
    }
  }, [session, category, gymnasesList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const dataToSubmit = {
      ...formData,
      title: formData.type === 'Jeu Libre' ? 'Jeu Libre' : formData.title,
      isInterclub: !!formData.isInterclub // S'assure d'envoyer un booléen
    };

    try {
      const url = session ? `/api/creneaux/${session._id}` : '/api/creneaux';
      const method = session ? 'PUT' : 'POST';
      
      const res = await fetch(url, { 
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(dataToSubmit) 
      });

      if (res.ok) {
        refreshData();
        onClose();
      } else {
        const errorData = await res.json();
        alert("Erreur : " + (errorData.error || "Problème de validation"));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#081031]/95 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-[#081031] w-full max-w-xl rounded-[3rem] shadow-2xl p-8 lg:p-12 border border-white/10 overflow-visible">
        <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-[900] italic uppercase text-[#081031] dark:text-white">
              {session ? 'Modifier' : 'Nouveau'} <span className="text-[#0065FF]">créneau</span>
            </h3>
            <button onClick={onClose} className="p-2 text-slate-400 hover:rotate-90 transition-all"><X size={24} /></button>
        </div>
        <form className="grid grid-cols-2 gap-5" onSubmit={handleSubmit}>
          <div className="col-span-1">
            <CustomSelect label="Jour" options={daysList} value={formData.day} onChange={v => setFormData({...formData, day: v})} />
          </div>
          <div className="col-span-1">
            <CustomSelect label="Public" options={['Adultes - Loisirs', 'Adultes - Compétiteurs', 'Jeunes', 'Jeu Libre', 'Pôle Féminin', 'Indivs']} value={formData.type} onChange={v => setFormData({...formData, type: v})} />
          </div>

          {formData.type !== 'Jeu Libre' && (
            <div className="col-span-2 space-y-1 animate-in fade-in slide-in-from-top-2">
              <label className="text-[10px] font-black uppercase tracking-widest ml-2 opacity-50 dark:text-white">Titre du créneau</label>
              <input 
                required 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                type="text" 
                className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none focus:border-[#0065FF] dark:text-white" 
              />
            </div>
          )}

          <div className="col-span-1 space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest ml-2 opacity-50 dark:text-white">Début</label>
            <input required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} type="time" className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none dark:text-white" />
          </div>
          <div className="col-span-1 space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest ml-2 opacity-50 dark:text-white">Fin</label>
            <input required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} type="time" className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none dark:text-white" />
          </div>
          <div className="col-span-1">
            <CustomSelect label="Gymnase" options={gymnasesList.map(g => g.name)} value={formData.gymnasium} onChange={v => setFormData({...formData, gymnasium: v})} />
          </div>
          <div className="col-span-1 space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest ml-2 opacity-50 dark:text-white">Coach</label>
            <input value={formData.coach} onChange={e => setFormData({...formData, coach: e.target.value})} type="text" className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none dark:text-white" />
          </div>

          <div 
          className="col-span-2 flex items-center gap-3 bg-slate-50 dark:bg-[#040817] p-4 rounded-2xl border border-slate-200 dark:border-white/10 cursor-pointer"
          onClick={() => setFormData({ ...formData, isInterclub: !formData.isInterclub })}
        >
          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.isInterclub ? 'bg-[#FFD500] border-[#FFD500]' : 'border-slate-300'}`}>
            {formData.isInterclub && <Trophy size={14} className="text-[#081031]" strokeWidth={3} />}
          </div>
          <input 
            type="checkbox" 
            className="hidden" // On cache l'input réel pour utiliser notre div stylisée
            checked={formData.isInterclub} 
            readOnly 
          />
          <label className="text-xs font-black uppercase tracking-widest text-[#081031] dark:text-white cursor-pointer select-none">
            Créneau réservé aux Interclubs
          </label>
        </div>

          <button type="submit" disabled={isSaving} className="col-span-2 bg-[#0065FF] text-white p-5 rounded-[2rem] font-[900] uppercase text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-[#081031] transition-all shadow-xl">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Sauvegarder
          </button>
        </form>
      </div>
    </div>
  );
}

/* --- MODAL GYMNASE --- */
function GymnaseFormModal({ gymnase, onClose, refreshData }) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: gymnase?.name || '', address: gymnase?.address || '' });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = gymnase ? `/api/gymnases/${gymnase._id}` : '/api/gymnases';
      const method = gymnase ? 'PUT' : 'POST';
      await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      refreshData(); onClose();
    } catch (error) { console.error(error); } finally { setIsSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#081031]/95 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-[#081031] w-full max-w-lg rounded-[3rem] shadow-2xl p-8 lg:p-12 border border-white/10">
        <h3 className="text-3xl font-[900] italic uppercase text-[#081031] dark:text-white flex items-center gap-3 mb-8"><Building2 className="text-[#0EE2E2]" /> {gymnase ? 'Modifier' : 'Nouveau'} Gymnase</h3>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest ml-2 opacity-50 dark:text-white">Nom</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest ml-2 opacity-50 dark:text-white">Adresse</label>
            <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm min-h-[100px] dark:text-white" />
          </div>
          <button type="submit" disabled={isSaving} className="w-full bg-[#0EE2E2] text-[#081031] p-5 rounded-[2rem] font-[900] uppercase text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-[#0065FF] hover:text-white transition-all shadow-xl">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Sauvegarder
          </button>
        </form>
      </div>
    </div>
  );
}