'use client';
import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, Plus, Users, Save, Trash2, Clock, ChevronLeft, ChevronRight, 
  Target, Dumbbell, Activity, CheckCircle, Edit, Copy, UserPlus, FileText, LayoutList, X, Flame, Swords, Info, ChevronDown, Filter, Upload, Loader2
} from 'lucide-react';

export default function CoachDashboard() {
  const [activeTab, setActiveTab] = useState('planning'); // 'planning', 'create', 'players'
  const [selectedSessionView, setSelectedSessionView] = useState(null); 
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // --- ÉTATS : JOUEURS ---
  const [players, setPlayers] = useState([]);
  const [playerFilter, setPlayerFilter] = useState('Tous');
  
  // États pour l'ajout manuel de joueur
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isSavingPlayer, setIsSavingPlayer] = useState(false);
  const [newPlayerForm, setNewPlayerForm] = useState({ name: '', group: '' });

  // --- ÉTATS : PLANNING (SÉANCES SAUVEGARDÉES) ---
  const [sessions, setSessions] = useState([]);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); 

  // --- CHARGEMENT GLOBAL DEPUIS LA BDD ---
  const fetchDashboardData = async () => {
    setIsLoadingData(true);
    try {
      const [sessionsRes, playersRes] = await Promise.all([
        fetch('/api/training-sessions'),
        fetch('/api/training-players') // <-- Utilisation de la nouvelle API
      ]);
      
      const sData = await sessionsRes.json();
      const pData = await playersRes.json();

      if (sData.success) setSessions(sData.data);
      if (pData.success) setPlayers(pData.data);
    } catch (error) {
      console.error("Erreur de chargement", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Générer la liste unique des groupes d'entraînement à partir des joueurs (et des options par défaut)
  const uniquePlayerGroups = ['Tous', ...Array.from(new Set(players.map(p => p.group)))];
  
  // Filtrer les joueurs selon le groupe sélectionné
  const filteredPlayers = playerFilter === 'Tous' 
    ? players 
    : players.filter(p => p.group === playerFilter);

  // --- CONFIGURATION DES GROUPES & COULEURS ---
  const groupOptions = [
    // Compétiteurs (Bleu)
    { value: 'Compétiteurs équipes 1 à 3', label: 'Compétiteurs équipes 1 à 3', color: '#0065FF', bgClass: 'bg-[#0065FF]/10', textClass: 'text-[#0065FF]' },
    { value: 'Compétiteurs équipes 4 & 5', label: 'Compétiteurs équipes 4 & 5', color: '#0065FF', bgClass: 'bg-[#0065FF]/10', textClass: 'text-[#0065FF]' },
    { value: 'Compétiteurs équipes 6 à 9', label: 'Compétiteurs équipes 6 à 9', color: '#0065FF', bgClass: 'bg-[#0065FF]/10', textClass: 'text-[#0065FF]' },
    // Loisirs (Vert)
    { value: 'Débutants', label: 'Débutants (Loisirs)', color: '#10B981', bgClass: 'bg-[#10B981]/10', textClass: 'text-[#10B981]' },
    { value: 'Débrouillés loisirs', label: 'Débrouillés loisirs', color: '#10B981', bgClass: 'bg-[#10B981]/10', textClass: 'text-[#10B981]' },
    { value: 'Confirmés loisirs', label: 'Confirmés loisirs', color: '#10B981', bgClass: 'bg-[#10B981]/10', textClass: 'text-[#10B981]' },
    // Féminins (Rose)
    { value: 'Pôle Féminin', label: 'Pôle Féminin', color: '#F72585', bgClass: 'bg-[#F72585]/10', textClass: 'text-[#F72585]' },
    // Indivs (Violet)
    { value: 'Indivs', label: 'Séance Individuelle', color: '#9333EA', bgClass: 'bg-[#9333EA]/10', textClass: 'text-[#9333EA]' },
    // Jeunes (Orange)
    { value: 'Jeunes : Bad pouss\'', label: 'Jeunes : Bad pouss\'', color: '#F97316', bgClass: 'bg-[#F97316]/10', textClass: 'text-[#F97316]' },
    { value: 'Jeunes : non compét.', label: 'Jeunes : non compét.', color: '#F97316', bgClass: 'bg-[#F97316]/10', textClass: 'text-[#F97316]' },
    { value: 'Jeunes : compét. espoirs', label: 'Jeunes : compét. espoirs', color: '#F97316', bgClass: 'bg-[#F97316]/10', textClass: 'text-[#F97316]' },
    { value: 'Jeunes : débutants', label: 'Jeunes : débutants', color: '#F97316', bgClass: 'bg-[#F97316]/10', textClass: 'text-[#F97316]' },
  ];

  const getGroupStyle = (groupName) => {
    const found = groupOptions.find(g => g.value === groupName);
    return found || { color: '#64748b', bgClass: 'bg-slate-100 dark:bg-white/5', textClass: 'text-slate-500 dark:text-slate-400' };
  };

  // --- ÉTATS : CRÉATION DE SÉANCE ---
  const getEmptySession = () => ({
    title: '',
    date: new Date().toISOString().split('T')[0],
    group: '',
    theme: '',
    playersCount: '',
    warmups: [],
    routines: [],
    matches: [],
    freeplayMinutes: 15,
    notes: ''
  });

  const [sessionForm, setSessionForm] = useState(getEmptySession());
  const [isSaving, setIsSaving] = useState(false);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);

  // --- GESTION FORMULAIRE SÉANCE ---
  const handleFormChange = (e) => {
    setSessionForm({ ...sessionForm, [e.target.name]: e.target.value });
  };

  const addExerciseItem = (section) => {
    setSessionForm(prev => ({
      ...prev,
      [section]: [...prev[section], { id: Date.now().toString(), name: '', duration: '', description: '', variants: '' }]
    }));
  };

  const updateExerciseField = (section, id, field, value) => {
    setSessionForm(prev => ({
      ...prev,
      [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeExerciseItem = (section, id) => {
    setSessionForm(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  const saveSession = async (e) => {
    e.preventDefault();
    if (!sessionForm.title || !sessionForm.date || !sessionForm.group) return alert("Le nom, la date et le groupe sont obligatoires.");
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/training-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionForm)
      });
      if (res.ok) {
        fetchDashboardData();
        setSessionForm(getEmptySession());
        setActiveTab('planning');
      }
    } catch (error) {
      alert("Erreur lors de la sauvegarde de la séance.");
    } finally {
      setIsSaving(false);
    }
  };

  const duplicateSession = (sessionToDup) => {
    setSessionForm({
      ...sessionToDup,
      _id: undefined,
      id: undefined,
      date: new Date().toISOString().split('T')[0],
    });
    setSelectedSessionView(null);
    setActiveTab('create');
  };

  // --- GESTION JOUEURS (AJOUT MANUEL & IMPORT CSV) ---
  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!newPlayerForm.name || !newPlayerForm.group) return;
    
    setIsSavingPlayer(true);
    try {
      const res = await fetch('/api/training-players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlayerForm)
      });
      if (res.ok) {
        fetchDashboardData();
        setIsPlayerModalOpen(false);
        setNewPlayerForm({ name: '', group: '' });
      }
    } catch (error) {
      alert("Erreur lors de l'ajout.");
    } finally {
      setIsSavingPlayer(false);
    }
  };

  const handleImportCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const rows = text.split('\n');
      
      setIsLoadingData(true);
      for (let i = 1; i < rows.length; i++) { // Skip header (assumed "Nom,Groupe")
        const row = rows[i].split(',');
        if (row.length >= 2) {
          const name = row[0].trim();
          const group = row[1].trim();
          if (name && group) {
            await fetch('/api/training-players', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, group })
            });
          }
        }
      }
      fetchDashboardData();
      alert("Importation CSV terminée !");
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const deletePlayer = async (id) => {
    if (!window.confirm("Supprimer ce joueur de l'effectif ?")) return;
    
    try {
      // NOTE: Assurez-vous d'avoir créé le fichier `app/api/training-players/[id]/route.js`
      const res = await fetch(`/api/training-players/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPlayers(players.filter(p => p._id !== id && p.id !== id));
      } else {
        alert("Erreur lors de la suppression (Vérifiez la route de suppression).");
      }
    } catch (error) {
      console.error(error);
    }
  };


  // --- CALCULS TEMPS TOTAL ---
  const calculateTotalTime = (sessionObj) => {
    let total = parseInt(sessionObj.freeplayMinutes || 0);
    ['warmups', 'routines', 'matches'].forEach(section => {
      sessionObj[section].forEach(exo => {
        total += parseInt(exo.duration || 0);
      });
    });
    return total;
  };

  // --- CALCULS POUR LE PLANNING ---
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const weekStart = getStartOfWeek(new Date());
  weekStart.setDate(weekStart.getDate() + (currentWeekOffset * 7));

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const borderAccentClasses = 'border-[#0065FF]';
  const bgAccentClasses = 'bg-[#0065FF] text-white';

  if (isLoadingData) return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-[#0065FF]" size={48} /></div>;

  // =========================================================================
  // VUE RÉCAPITULATIVE (DÉTAIL D'UNE SÉANCE)
  // =========================================================================
  if (selectedSessionView) {
    const totalTime = calculateTotalTime(selectedSessionView);
    const sessionGroupStyle = getGroupStyle(selectedSessionView.group);

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Montserrat'] pb-24 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 sticky top-24 z-50 bg-slate-50/90 dark:bg-[#040817]/90 backdrop-blur-md py-4 border-b border-slate-200 dark:border-white/10">
          <button 
            onClick={() => setSelectedSessionView(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-[#081031] dark:hover:text-white font-bold text-sm transition-colors uppercase tracking-widest"
          >
            <ChevronLeft size={18} /> Retour au planning
          </button>
          <div className="flex gap-3">
            <button 
              onClick={() => duplicateSession(selectedSessionView)}
              className="bg-slate-200 dark:bg-white/10 text-[#081031] dark:text-white px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-slate-300 dark:hover:bg-white/20 transition-all"
            >
              <Copy size={14} /> Dupliquer
            </button>
            <button 
              onClick={() => setSelectedSessionView(null)}
              className="bg-[#081031] dark:bg-white text-white dark:text-[#081031] px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg"
            >
              <X size={14} /> Fermer
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden">
          {/* HEADER RECAP */}
          <div className="p-8 lg:p-12 text-white relative overflow-hidden" style={{ backgroundColor: sessionGroupStyle.color }}>
            <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-white/10 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <span className="inline-flex items-center bg-white/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">
                  {selectedSessionView.group}
                </span>
                <h1 className="text-4xl lg:text-6xl font-[900] uppercase italic tracking-tighter leading-none mb-2 drop-shadow-md">
                  {selectedSessionView.title}
                </h1>
                <p className="text-white/80 font-bold text-lg flex items-center gap-2">
                  <Target size={18} /> {selectedSessionView.theme || "Thème libre"}
                </p>
              </div>
              <div className="flex gap-4 text-center">
                <div className="bg-[#081031]/30 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                  <Clock size={24} className="mx-auto mb-1 opacity-80" />
                  <span className="block text-2xl font-black">{totalTime}'</span>
                  <span className="text-[9px] uppercase tracking-widest opacity-80">Durée Totale</span>
                </div>
                <div className="bg-[#081031]/30 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                  <Users size={24} className="mx-auto mb-1 opacity-80" />
                  <span className="block text-2xl font-black">{selectedSessionView.playersCount || "-"}</span>
                  <span className="text-[9px] uppercase tracking-widest opacity-80">Joueurs</span>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENU RECAP */}
          <div className="p-8 lg:p-12 space-y-12">
            {[
              { id: 'warmups', title: 'Échauffement', icon: <Flame size={24} className="text-orange-500" /> },
              { id: 'routines', title: 'Routines & Gammes', icon: <Dumbbell size={24} className="text-[#0065FF]" /> },
              { id: 'matches', title: 'Situations de Match', icon: <Swords size={24} className="text-[#F72585]" /> }
            ].map(section => {
              if (!selectedSessionView[section.id] || selectedSessionView[section.id].length === 0) return null;
              return (
                <div key={section.id}>
                  <h3 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white flex items-center gap-3 mb-6 border-b-2 border-slate-100 dark:border-white/5 pb-4">
                    {section.icon} {section.title}
                  </h3>
                  <div className="space-y-6">
                    {selectedSessionView[section.id].map((exo, index) => (
                      <div key={exo.id || index} className="flex gap-6 items-start relative group">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-[#081031] rounded-2xl flex items-center justify-center font-black text-slate-400 shrink-0 text-xl border border-slate-200 dark:border-white/10">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="text-lg font-bold text-[#081031] dark:text-white leading-tight">{exo.name}</h4>
                            <span className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest shrink-0 shadow-sm border border-slate-200 dark:border-white/5">{exo.duration}'</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 font-medium whitespace-pre-wrap leading-relaxed text-sm bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                            {exo.description}
                          </p>
                          {exo.variants && (
                            <div className="bg-[#0065FF]/5 border-2 border-dashed border-[#0065FF]/40 p-4 rounded-xl relative overflow-hidden">
                              <div className="text-[10px] font-black uppercase text-[#0065FF] tracking-widest mb-1 flex items-center gap-1.5"><Info size={12}/> Variantes / Évolutions</div>
                              <p className="text-sm font-bold text-[#081031] dark:text-white whitespace-pre-wrap leading-relaxed">{exo.variants}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {selectedSessionView.freeplayMinutes > 0 && (
              <div>
                <h3 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white flex items-center gap-3 mb-6 border-b-2 border-slate-100 dark:border-white/5 pb-4">
                  <Activity size={24} className="text-[#0EE2E2]" /> Jeu Libre
                </h3>
                <div className="bg-[#0EE2E2]/10 border border-[#0EE2E2]/30 p-6 rounded-2xl flex items-center gap-4">
                  <Clock size={24} className="text-[#0EE2E2]" />
                  <span className="text-lg font-bold text-[#081031] dark:text-white">Matchs libres pendant {selectedSessionView.freeplayMinutes} minutes.</span>
                </div>
              </div>
            )}

            {selectedSessionView.notes && (
              <div className="bg-[#F72585]/10 border-l-4 border-[#F72585] p-6 rounded-r-2xl mt-8">
                <h4 className="text-[10px] font-black uppercase text-[#F72585] tracking-widest mb-2 flex items-center gap-1.5"><FileText size={14}/> Notes & Bilan du Coach</h4>
                <p className="text-[#081031] dark:text-white font-medium italic whitespace-pre-wrap leading-relaxed">
                  {selectedSessionView.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Montserrat'] pb-24">
      
      {/* HEADER DE LA PAGE */}
      <div className="mb-8 border-b border-slate-200 dark:border-white/10 pb-6 flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 pt-2">
            Espace <span className="text-[#0065FF]">Entraîneurs</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">
            Planification des séances et suivi des joueurs
          </p>
        </div>
        
        {/* TABS NAVIGATION */}
        <div className="flex bg-slate-100 dark:bg-[#0f172a] p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm w-fit">
          <button 
            onClick={() => setActiveTab('planning')}
            className={`px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all ${activeTab === 'planning' ? 'bg-white dark:bg-[#1A1D24] text-[#081031] dark:text-white shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
          >
            <CalendarDays size={14} /> Planning
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all ${activeTab === 'create' ? `${bgAccentClasses} shadow-[0_0_15px_rgba(0,101,255,0.3)]` : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
          >
            <Plus size={16} /> Créer Séance
          </button>
          <button 
            onClick={() => setActiveTab('players')}
            className={`px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all ${activeTab === 'players' ? 'bg-white dark:bg-[#1A1D24] text-[#081031] dark:text-white shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
          >
            <Users size={14} /> Mes Joueurs
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VUE 1 : PLANNING PAR SEMAINE                                              */}
      {/* ========================================================================= */}
      {activeTab === 'planning' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="flex items-center justify-between bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            <button onClick={() => setCurrentWeekOffset(prev => prev - 1)} className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-[#0065FF] hover:text-white transition-all">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-[900] uppercase italic text-[#081031] dark:text-white">
              Semaine du {weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </h2>
            <button onClick={() => setCurrentWeekOffset(prev => prev + 1)} className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-[#0065FF] hover:text-white transition-all">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4">
            {weekDays.map((day, index) => {
              const dayString = day.toISOString().split('T')[0];
              const daySessions = sessions.filter(s => s.date === dayString);
              const isToday = new Date().toISOString().split('T')[0] === dayString;

              return (
                <div key={dayString} className={`flex flex-col rounded-2xl overflow-hidden border ${isToday ? `${borderAccentClasses} shadow-[0_0_15px_rgba(0,101,255,0.15)]` : 'border-slate-200 dark:border-white/10'}`}>
                  
                  <div className={`p-3 text-center ${isToday ? bgAccentClasses : 'bg-slate-100 dark:bg-[#1A1D24] text-[#081031] dark:text-white'}`}>
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-80">{dayNames[index]}</span>
                    <span className="block text-xl font-[900] italic">{day.getDate()}</span>
                  </div>
                  
                  <div className="p-3 bg-white dark:bg-[#0f172a] flex-1 min-h-[150px] space-y-3">
                    {daySessions.length === 0 ? (
                      <p className="text-center text-xs font-bold text-slate-400 italic pt-4">Aucune séance</p>
                    ) : (
                      daySessions.map(session => {
                        const styleInfo = getGroupStyle(session.group);
                        return (
                          <div 
                            key={session._id} 
                            onClick={() => setSelectedSessionView(session)}
                            className="bg-slate-50 dark:bg-[#1A1D24] border border-slate-200 dark:border-white/5 p-3 rounded-xl group relative overflow-hidden cursor-pointer transition-all hover:shadow-md"
                            style={{ '--hover-border': styleInfo.color }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = styleInfo.color}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
                          >
                            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: styleInfo.color }}></div>
                            <div className="flex justify-between items-start mb-2 pl-2">
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${styleInfo.bgClass} ${styleInfo.textClass}`}>{session.group}</span>
                            </div>
                            <h4 className="text-sm font-[900] uppercase italic text-[#081031] dark:text-white leading-tight pl-2 mb-1 group-hover:text-current transition-colors" style={{ color: styleInfo.color }}>{session.title}</h4>
                            <p className="text-[10px] font-bold text-slate-500 pl-2 truncate">{session.theme || "Thème libre"}</p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 2 : CRÉATEUR DE SÉANCE AVANCÉ                                         */}
      {/* ========================================================================= */}
      {activeTab === 'create' && (
        <form onSubmit={saveSession} className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95">
          
          <div className="flex justify-between items-center bg-slate-100 dark:bg-[#081031] p-4 rounded-2xl border border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0065FF] text-white rounded-xl flex items-center justify-center font-black">{calculateTotalTime(sessionForm)}'</div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#0065FF]">Durée Totale</p>
                <p className="text-[10px] font-bold text-slate-500">Calculée automatiquement</p>
              </div>
            </div>
          </div>

          {/* INFOS GÉNÉRALES */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 lg:p-8 border border-slate-200 dark:border-white/10 shadow-sm">
            <h3 className="text-xl font-[900] mb-6 text-[#0065FF] uppercase italic">Infos Générales</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                name="title" 
                value={sessionForm.title} 
                onChange={handleFormChange} 
                placeholder="Nom de la séance (ex: Perf D9/P10)" 
                className="w-full bg-slate-50 dark:bg-[#081031] text-[#081031] dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0065FF] transition-all placeholder:text-slate-400"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="date" 
                  name="date" 
                  value={sessionForm.date} 
                  onChange={handleFormChange} 
                  className="w-full bg-slate-50 dark:bg-[#081031] text-[#081031] dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0065FF] transition-all text-slate-500 dark:text-slate-400"
                  required
                />
                
                {/* SELECT CUSTOM POUR LE GROUPE */}
                <div className="relative">
                  <button 
                    type="button" 
                    onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)} 
                    className={`w-full h-full bg-slate-50 dark:bg-[#081031] border ${isGroupDropdownOpen ? 'border-[#0065FF] ring-2 ring-[#0065FF]/20' : 'border-slate-200 dark:border-white/10'} rounded-xl px-4 py-3 text-sm font-bold flex justify-between items-center transition-all outline-none`}
                  >
                    <span className={sessionForm.group ? getGroupStyle(sessionForm.group).textClass : 'text-slate-400'}>
                      {sessionForm.group || "Sélectionnez le groupe ciblé *"}
                    </span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isGroupDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isGroupDropdownOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="max-h-60 overflow-y-auto hide-scrollbar py-2">
                        {groupOptions.map((opt) => (
                          <div 
                            key={opt.value} 
                            onClick={() => {
                              setSessionForm({ ...sessionForm, group: opt.value });
                              setIsGroupDropdownOpen(false);
                            }} 
                            className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-white/5 border-l-2 border-transparent hover:border-current ${opt.textClass}`}
                          >
                            <span className={`w-3 h-3 rounded-full ${opt.bgClass} flex items-center justify-center`}><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: opt.color }}></span></span>
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  type="text" 
                  name="theme" 
                  value={sessionForm.theme} 
                  onChange={handleFormChange} 
                  placeholder="Thème (ex: Fixation)" 
                  className="w-full md:col-span-2 bg-slate-50 dark:bg-[#081031] text-[#081031] dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0065FF] transition-all placeholder:text-slate-400"
                />
                <input 
                  type="text" 
                  name="playersCount" 
                  value={sessionForm.playersCount} 
                  onChange={handleFormChange} 
                  placeholder="Nombre de joueurs" 
                  className="w-full bg-slate-50 dark:bg-[#081031] text-[#081031] dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0065FF] transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* COMPOSANT RÉUTILISABLE POUR LES LISTES D'EXERCICES AVANCÉES */}
          {[
            { id: 'warmups', title: 'Échauffement' },
            { id: 'routines', title: 'Routines & Gammes' },
            { id: 'matches', title: 'Situations de Match' }
          ].map(section => (
            <div key={section.id} className="bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 lg:p-8 border border-slate-200 dark:border-white/10 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-[900] text-[#0065FF] uppercase italic">{section.title}</h3>
                <button type="button" onClick={() => addExerciseItem(section.id)} className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-[#0065FF] text-slate-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm">
                  <Plus size={16} /> Ajouter
                </button>
              </div>
              
              {sessionForm[section.id].length === 0 ? (
                <p className="text-center text-slate-400 font-bold italic text-sm py-6">Aucun exercice {section.title.toLowerCase().includes('échauffement') ? "d'échauffement" : "ajouté"}</p>
              ) : (
                <div className="space-y-4">
                  {sessionForm[section.id].map((item, index) => (
                    <div key={item.id} className="bg-slate-50 dark:bg-[#081031] p-4 lg:p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3 relative group/exo animate-in slide-in-from-left-4">
                      
                      {/* LIGNE 1 : NOM & DURÉE */}
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-[#0f172a] flex items-center justify-center text-xs font-black text-[#0065FF] shrink-0 border border-slate-200 dark:border-white/10 shadow-sm">{index + 1}</div>
                        <input 
                          type="text" 
                          value={item.name} 
                          onChange={(e) => updateExerciseField(section.id, item.id, 'name', e.target.value)} 
                          placeholder="Nom de l'exercice" 
                          className="flex-1 w-full bg-white dark:bg-[#0f172a] text-[#081031] dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0065FF] transition-colors placeholder:text-slate-400 shadow-sm"
                        />
                        <div className="flex gap-2 w-full sm:w-auto">
                          <div className="relative w-full sm:w-24 shrink-0">
                            <input 
                              type="number" 
                              value={item.duration} 
                              onChange={(e) => updateExerciseField(section.id, item.id, 'duration', e.target.value)} 
                              placeholder="Durée" 
                              className="w-full bg-white dark:bg-[#0f172a] text-[#081031] dark:text-white border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0065FF] transition-colors shadow-sm"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">min</span>
                          </div>
                          <button type="button" onClick={() => removeExerciseItem(section.id, item.id)} className="w-12 sm:w-auto p-3 flex items-center justify-center bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-500/10 dark:hover:border-red-500/30 text-slate-400 hover:text-red-500 rounded-xl transition-all shadow-sm">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* LIGNE 2 : CONSIGNES */}
                      <textarea 
                        value={item.description} 
                        onChange={(e) => updateExerciseField(section.id, item.id, 'description', e.target.value)} 
                        placeholder="Déroulement / Consignes..." 
                        rows="2"
                        className="w-full bg-white dark:bg-[#0f172a] text-[#081031] dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0065FF] transition-colors placeholder:text-slate-400 shadow-sm resize-none"
                      />

                      {/* LIGNE 3 : VARIANTES (Style DA Bleu) */}
                      <textarea 
                        value={item.variants} 
                        onChange={(e) => updateExerciseField(section.id, item.id, 'variants', e.target.value)} 
                        placeholder="Variantes (ex: Si niveau +, imposer le revers)" 
                        rows="1"
                        className="w-full bg-[#0065FF]/5 text-[#081031] dark:text-white border-2 border-dashed border-[#0065FF]/40 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#0065FF] transition-colors placeholder:text-[#0065FF]/60 resize-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* JEU LIBRE */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 lg:p-8 border border-slate-200 dark:border-white/10 shadow-sm">
            <h3 className="text-xl font-[900] mb-4 text-[#0065FF] uppercase italic">Jeu Libre</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-32 shrink-0">
                <input 
                  type="number" 
                  name="freeplayMinutes" 
                  value={sessionForm.freeplayMinutes} 
                  onChange={handleFormChange} 
                  className="w-full bg-slate-50 dark:bg-[#081031] text-[#081031] dark:text-white border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0065FF] text-center transition-colors shadow-inner"
                />
                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">min</span>
              </div>
              <span className="text-[#081031] dark:text-white font-bold text-sm">allouées pour les matchs libres en fin de séance.</span>
            </div>
          </div>

          {/* BILAN COACH */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 lg:p-8 border border-slate-200 dark:border-white/10 shadow-sm">
            <h3 className="text-xl font-[900] mb-4 text-[#0065FF] uppercase italic flex items-center gap-2"><FileText size={20}/> Bilan Coach (Notes)</h3>
            <textarea 
              name="notes" 
              rows="3" 
              value={sessionForm.notes} 
              onChange={handleFormChange} 
              placeholder="Que faudra-t-il améliorer la prochaine fois ?" 
              className="w-full bg-slate-50 dark:bg-[#081031] text-[#081031] dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0065FF] transition-colors placeholder:text-slate-400 resize-none shadow-inner"
            ></textarea>
          </div>

          {/* BOUTON ENREGISTRER */}
          <button type="submit" disabled={isSaving} className="w-full bg-[#0065FF] hover:bg-[#0052cc] text-white py-5 rounded-2xl font-[900] uppercase tracking-widest text-lg flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(0,101,255,0.3)] hover:shadow-[0_0_40px_rgba(0,101,255,0.5)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_0_30px_rgba(0,101,255,0.3)]">
            {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
            ENREGISTRER LA SÉANCE
          </button>

        </form>
      )}

      {/* ========================================================================= */}
      {/* VUE 3 : MES JOUEURS (SUIVI & PRÉSENCES)                                   */}
      {/* ========================================================================= */}
      {activeTab === 'players' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#0f172a] p-6 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm">
            <div>
              <h2 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white">Effectif <span className="text-[#0065FF]">Assigné</span></h2>
              <p className="text-sm font-bold text-slate-500">{filteredPlayers.length} joueur(s) affiché(s)</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="cursor-pointer bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-[#0065FF] px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all shadow-sm">
                <Upload size={16} /> Importer (.csv)
                <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
              </label>
              <button onClick={() => setIsPlayerModalOpen(true)} className={`${bgAccentClasses} px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-[#0065FF]/20`}>
                <UserPlus size={16} /> Nouveau Joueur
              </button>
            </div>
          </div>

          {/* BARRE DE FILTRES DES GROUPES */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
            {uniquePlayerGroups.map(group => {
              const isActive = playerFilter === group;
              
              return (
                <button
                  key={group}
                  onClick={() => setPlayerFilter(group)}
                  className={`px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest whitespace-nowrap transition-all border ${
                    isActive 
                      ? 'bg-[#0065FF] text-white border-[#0065FF] shadow-md' 
                      : 'bg-white dark:bg-[#0f172a] text-slate-500 border-slate-200 dark:border-white/10 hover:border-[#0065FF] hover:text-[#0065FF]'
                  }`}
                >
                  {group}
                </button>
              )
            })}
          </div>

          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Joueur</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Groupe d'entraînement</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredPlayers.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-10 text-center text-slate-500 font-bold text-sm italic">
                        Aucun joueur dans ce groupe.
                      </td>
                    </tr>
                  )}
                  {filteredPlayers.map(player => {
                    const groupStyle = getGroupStyle(player.group);
                    return (
                      <tr key={player._id || player.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-[#1A1D24] flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold border-2 border-transparent transition-colors" style={{ borderColor: groupStyle.color }}>
                              {player.name.charAt(0)}
                            </div>
                            <span className="font-[900] uppercase text-sm text-[#081031] dark:text-white">{player.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest ${groupStyle.bgClass} ${groupStyle.textClass}`}>
                            {player.group}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => deletePlayer(player._id || player.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Supprimer"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODALE NOUVEAU JOUEUR */}
      {isPlayerModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#081031] rounded-[2.5rem] w-full max-w-md shadow-2xl border border-slate-200 dark:border-white/10">
            <div className="p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-[#0f172a] rounded-t-[2.5rem]">
              <h3 className="text-xl font-[900] italic uppercase flex items-center gap-2 text-[#081031] dark:text-white">
                <UserPlus size={20} className="text-[#0065FF]" /> Ajouter Joueur
              </h3>
              <button onClick={() => setIsPlayerModalOpen(false)} className="text-slate-400 hover:text-red-500"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddPlayer} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Nom Complet</label>
                <input 
                  type="text" 
                  required 
                  value={newPlayerForm.name} 
                  onChange={e => setNewPlayerForm({...newPlayerForm, name: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0065FF]" 
                  placeholder="Jean Dupont" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Groupe Assigné</label>
                <select 
                  required 
                  value={newPlayerForm.group} 
                  onChange={e => setNewPlayerForm({...newPlayerForm, group: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0065FF] appearance-none"
                >
                  <option value="" disabled>Sélectionner un groupe</option>
                  {groupOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsPlayerModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-white/5 rounded-xl font-bold text-xs uppercase text-slate-500">Annuler</button>
                <button type="submit" disabled={isSavingPlayer} className="flex-1 py-3 bg-[#0065FF] text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                  {isSavingPlayer ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}