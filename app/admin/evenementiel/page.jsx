'use client';
import React, { useState, useEffect } from 'react';
import { 
  Plus, Pencil, Trash2, Calendar, Download, Upload, Loader2, X, Save, 
  Clock, MapPin, CalendarDays, Trophy, PartyPopper, Dumbbell, ChevronDown, 
  CheckCircle, ListTodo, Activity, Rocket, Target, ArrowRight, CheckSquare, Square,
  LayoutTemplate, Medal, Image as ImageIcon, Palette
} from 'lucide-react';

export default function AdminEventsPage() {
  const [activeTab, setActiveTab] = useState('calendrier'); // 'calendrier', 'tournois', 'projets'
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- ÉTATS DONNÉES ---
  const [events, setEvents] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [projects, setProjects] = useState([]);

  // --- MODALES ---
  const [modalType, setModalType] = useState(null); // 'event', 'tournament', 'project'
  const [modalTab, setModalTab] = useState('general'); // Pour les onglets internes du Tournoi
  const [editingId, setEditingId] = useState(null);

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Formulaires
  const [eventForm, setEventForm] = useState({ title: '', category: 'Vie du Club', isoDate: '', dateDisplay: '', time: '', location: '', description: '', color: '#0065FF' });
  
  const defaultTournamentForm = {
    heroImage: '', mainVisual: '', canvaLink: '', tournamentLogo: '', title: '', subtitle: '', type: 'tournoi', dateStr: '', location: 'Gymnase Casalis',
    levels: '', registrationLink: '', status: 'a_venir', spotsLeft: '', color: '#0065FF',
    description: '', gymImage: '', 
    disciplines: 'Simples, Doubles, Mixtes',
    buvetteDescription: "Les joueurs et supporters pourront profiter de notre espace buvette tout au long de l'événement. Croque-monsieurs, crêpes, boissons et snacks pour recharger les batteries !",
    amenities: 'Parking gratuit sur place, Vestiaires & Douches, Tribunes',  
    googleMapsLink: '',  
    sponsor: { name: '', logoUrl: '', website: '' },
    googlePhotosLink: '', galleryImages: ['', '', '', ''], 
    palmares: []
  };
  const [tournamentForm, setTournamentForm] = useState(defaultTournamentForm);
  
  const [projectForm, setProjectForm] = useState({ title: '', status: 'Idée', targetDate: '', manager: '', budget: '', tasks: [] });

  const categoryOptions = [
    { value: 'Compétition', label: 'Compétition', icon: <Trophy size={16}/>, defaultColor: '#0065FF' },
    { value: 'Vie du Club', label: 'Vie du Club', icon: <PartyPopper size={16}/>, defaultColor: '#FFD500' },
    { value: 'Stages', label: 'Stages', icon: <Dumbbell size={16}/>, defaultColor: '#0EE2E2' },
  ];

  // --- CHARGEMENT DES DONNÉES EXISTANTES ---
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [eventsRes, tourRes, projRes] = await Promise.all([
        fetch('/api/events'), 
        fetch('/api/tournaments'), 
        fetch('/api/projects')
      ]);
      const [eventsData, tourData, projData] = await Promise.all([
        eventsRes.json(), tourRes.json(), projRes.json()
      ]);
      
      if (eventsData.success) setEvents(eventsData.data);
      if (tourData.success) setTournaments(tourData.data);
      if (projData.success) setProjects(projData.data);
    } catch (error) {
      console.error("Erreur de chargement", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  // --- HANDLERS D'OUVERTURE DE MODALE ---
  const openModal = (type, item = null) => {
    setModalType(type);
    setIsCategoryDropdownOpen(false);
    if (item) {
      setEditingId(item._id);
      if (type === 'event') setEventForm(item);
      if (type === 'tournament') {
        setModalTab('general');
        setTournamentForm({
          ...defaultTournamentForm, ...item,
          sponsor: item.sponsor || defaultTournamentForm.sponsor,
          galleryImages: item.galleryImages?.length > 0 ? item.galleryImages : ['', '', '', ''],
          palmares: item.palmares || []
        });
      }
      if (type === 'project') setProjectForm(item);
    } else {
      setEditingId(null);
      if (type === 'event') setEventForm({ title: '', category: 'Vie du Club', isoDate: '', dateDisplay: '', time: '', location: '', description: '', color: '#0065FF' });
      if (type === 'tournament') { setModalTab('general'); setTournamentForm(defaultTournamentForm); }
      if (type === 'project') setProjectForm({ title: '', status: 'Idée', targetDate: '', manager: '', budget: '', tasks: [] });
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditingId(null);
  };

  // --- HANDLERS SPÉCIFIQUES TOURNOI ---
  const handleTournamentChange = (e) => {
    const { name, value } = e.target;
    setTournamentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSponsorChange = (e) => {
    const { name, value } = e.target;
    setTournamentForm(prev => ({ ...prev, sponsor: { ...prev.sponsor, [name]: value } }));
  };

  const handleGalleryChange = (index, value) => {
    const newGallery = [...tournamentForm.galleryImages];
    newGallery[index] = value;
    setTournamentForm(prev => ({ ...prev, galleryImages: newGallery }));
  };

  const addPalmaresRow = () => {
    setTournamentForm(prev => ({
      ...prev, palmares: [...prev.palmares, { serie: '', sh: '', sd: '', dh: '', dd: '', dx: '' }]
    }));
  };

  const updatePalmaresRow = (index, field, value) => {
    const newPalmares = [...tournamentForm.palmares];
    newPalmares[index][field] = value;
    setTournamentForm(prev => ({ ...prev, palmares: newPalmares }));
  };

  const removePalmaresRow = (index) => {
    setTournamentForm(prev => ({
      ...prev, palmares: prev.palmares.filter((_, i) => i !== index)
    }));
  };

  const handleTournamentImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const limit = field === 'mainVisual' ? 2 * 1024 * 1024 : 1024 * 1024;
    if (file.size > limit) {
      alert(`L'image est trop lourde. Max ${field === 'mainVisual' ? '2 Mo' : '1 Mo'}.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setTournamentForm(prev => ({ ...prev, [field]: reader.result }));
    };
    reader.readAsDataURL(file);
  };


  // --- SAUVEGARDES ---
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    let url = '';
    let payload = {};
    if (modalType === 'event') { url = '/api/events'; payload = eventForm; }
    if (modalType === 'project') { url = '/api/projects'; payload = { ...projectForm, budget: parseFloat(projectForm.budget) || 0 }; }
    if (modalType === 'tournament') { 
      url = '/api/tournaments'; 
      payload = {
        ...tournamentForm,
        spotsLeft: tournamentForm.spotsLeft ? parseInt(tournamentForm.spotsLeft) : null,
        galleryImages: tournamentForm.galleryImages.filter(img => img.trim() !== '')
      }; 
    }

    if (editingId) url += `/${editingId}`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (res.ok) { fetchAllData(); closeModal(); }
    } catch (error) {
      alert("Erreur d'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;
    let endpoint = '';
    if (type === 'event') endpoint = 'events';
    if (type === 'tournament') endpoint = 'tournaments';
    if (type === 'project') endpoint = 'projects';

    try {
      await fetch(`/api/${endpoint}/${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (error) {
      alert("Erreur de suppression.");
    }
  };

  const updateProjectStatus = async (id, newStatus) => {
    try {
      await fetch(`/api/projects/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus })
      });
      fetchAllData();
    } catch(err) {}
  };

  // --- GESTION DES TÂCHES PROJET ---
  const addTask = () => {
    setProjectForm({
      ...projectForm,
      tasks: [...projectForm.tasks, { id: Date.now().toString(), desc: '', done: false }]
    });
  };

  const updateTask = (id, field, value) => {
    setProjectForm({
      ...projectForm,
      tasks: projectForm.tasks.map(t => t.id === id ? { ...t, [field]: value } : t)
    });
  };

  const removeTask = (id) => {
    setProjectForm({
      ...projectForm,
      tasks: projectForm.tasks.filter(t => t.id !== id)
    });
  };

  // --- HELPERS CALENDRIER (ICS) ---
  const exportToICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//US Creteil Badminton//NONSGML v1.0//EN\n";
    events.forEach(event => {
      if(!event.isoDate) return;
      const dateClean = event.isoDate.replace(/-/g, '');
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `SUMMARY:${event.title}\n`;
      icsContent += `DTSTART;VALUE=DATE:${dateClean}\n`;
      icsContent += `DESCRIPTION:${event.description || ''}\n`;
      icsContent += `LOCATION:${event.location || ''}\n`;
      icsContent += "END:VEVENT\n";
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'calendrier-club.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportICS = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const vevents = text.split("BEGIN:VEVENT").slice(1);
      
      for (const vevent of vevents) {
        const title = vevent.match(/SUMMARY:(.*)/)?.[1]?.trim();
        const dateRaw = vevent.match(/DTSTART;VALUE=DATE:(\d{8})/)?.[1];
        const description = vevent.match(/DESCRIPTION:(.*)/)?.[1]?.trim() || '';
        const location = vevent.match(/LOCATION:(.*)/)?.[1]?.trim() || '';

        if (title && dateRaw) {
          const isoDate = `${dateRaw.slice(0, 4)}-${dateRaw.slice(4, 6)}-${dateRaw.slice(6, 8)}`;
          await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, isoDate, category: 'Compétition', description, location, dateDisplay: isoDate, color: '#0065FF' })
          });
        }
      }
      fetchAllData();
      alert("Importation terminée !");
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const getCategoryIcon = (category) => {
    const cat = categoryOptions.find(c => c.value === category);
    return cat ? cat.icon : <Calendar size={14} />;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Montserrat'] pb-24">
      
      {/* HEADER & ONGLETS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 pt-2">
            Pôle <span className="text-[#0EE2E2]">Événementiel</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">
            Calendrier, Tournois officiels et Projets du club
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-[#0f172a] p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm w-fit overflow-x-auto max-w-full hide-scrollbar">
          <button 
            onClick={() => setActiveTab('calendrier')}
            className={`px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shrink-0 ${activeTab === 'calendrier' ? 'bg-[#081031] dark:bg-white text-white dark:text-[#081031] shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
          >
            <CalendarDays size={14} /> Calendrier
          </button>
          <button 
            onClick={() => setActiveTab('tournois')}
            className={`px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shrink-0 ${activeTab === 'tournois' ? 'bg-[#0065FF] text-white shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
          >
            <Trophy size={14} /> Tournois & Promobad
          </button>
          <button 
            onClick={() => setActiveTab('projets')}
            className={`px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shrink-0 ${activeTab === 'projets' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
          >
            <Rocket size={14} /> Gestion Projets
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-32"><Loader2 className="animate-spin text-[#0EE2E2]" size={48} /></div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* ONGLET 1 : CALENDRIER (Classique)                                         */}
          {/* ========================================================================= */}
          {activeTab === 'calendrier' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-wrap justify-between items-center gap-4 bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-[#0065FF] dark:hover:text-[#0EE2E2] px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shadow-sm">
                    <Upload size={14} /> Importer .ics
                    <input type="file" accept=".ics" className="hidden" onChange={handleImportICS} />
                  </label>
                  <button onClick={exportToICS} className="bg-slate-800 text-white px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-sm">
                    <Download size={14} /> Exporter .ics
                  </button>
                </div>
                <button onClick={() => openModal('event')} className="bg-[#0EE2E2] hover:bg-[#0bd1d1] text-[#081031] px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shadow-md w-full sm:w-auto justify-center">
                  <Plus size={16} /> Nouvel Événement
                </button>
              </div>

              {events.length === 0 ? (
                <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm p-16 text-center">
                  <CalendarDays size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                  <h3 className="text-lg font-black text-[#081031] dark:text-white uppercase italic mb-2">Aucun événement</h3>
                  <p className="text-slate-500 font-bold text-sm">Le calendrier du club est vide.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {events.map(event => (
                    <div key={event._id} className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm group hover:shadow-md transition-shadow relative flex flex-col">
                      <div className="h-2 w-full absolute top-0 left-0" style={{ backgroundColor: event.color }}></div>
                      <div className="p-6 pt-8 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest text-white shadow-sm" style={{ backgroundColor: event.color }}>
                            {getCategoryIcon(event.category)} {event.category}
                          </span>
                          <div className="flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openModal('event', event)} className="p-2 bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-[#0065FF] dark:hover:text-[#0EE2E2] rounded-lg transition-colors"><Pencil size={14}/></button>
                            <button onClick={() => handleDelete('event', event._id)} className="p-2 bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={14}/></button>
                          </div>
                        </div>
                        <h3 className="font-[900] italic uppercase text-lg text-[#081031] dark:text-white leading-tight mb-4">{event.title}</h3>
                        <div className="space-y-2 mt-auto">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <Calendar size={14} className="text-slate-400" /> {event.dateDisplay || (event.isoDate ? new Date(event.isoDate).toLocaleDateString('fr-FR') : '')}
                          </div>
                          {(event.time || event.location) && (
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                              <Clock size={14} className="text-slate-400" /> {event.time || '?'} <span className="mx-1">•</span> <MapPin size={14} className="text-slate-400" /> <span className="truncate">{event.location || '?'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* ONGLET 2 : TOURNOIS & PROMOBAD                                            */}
          {/* ========================================================================= */}
          {activeTab === 'tournois' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="text-sm font-bold text-slate-500 ml-2">Gérez vos événements de A à Z (Infos, Galerie, Palmarès).</div>
                <button onClick={() => openModal('tournament')} className="bg-[#0065FF] hover:bg-[#0052cc] text-white px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shadow-md">
                  <Plus size={16} /> Ajouter Tournoi
                </button>
              </div>

              {tournaments.length === 0 ? (
                <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm p-16 text-center">
                  <Trophy size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                  <h3 className="text-lg font-black text-[#081031] dark:text-white uppercase italic mb-2">Aucun Tournoi</h3>
                  <p className="text-slate-500 font-bold text-sm">Ajoutez un tournoi ou un promobad pour qu'il apparaisse dans le menu.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tournaments.map(t => (
                    <div key={t._id} className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm flex flex-col group relative">
                      
                      {/* BOUTONS D'ÉDITION CARD */}
                      <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        {t.canvaLink && (
                          <a href={t.canvaLink} target="_blank" rel="noopener noreferrer" className="bg-[#0EE2E2] text-[#081031] px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg hover:bg-white transition-colors">
                            <Palette size={12} /> Modifier l'affiche
                          </a>
                        )}
                      </div>

                      <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal('tournament', t)} className="p-2 bg-white/90 dark:bg-[#081031]/90 backdrop-blur-sm text-slate-500 hover:text-[#0065FF] rounded-lg shadow-sm"><Pencil size={14}/></button>
                        <button onClick={() => handleDelete('tournament', t._id)} className="p-2 bg-white/90 dark:bg-[#081031]/90 backdrop-blur-sm text-slate-500 hover:text-red-500 rounded-lg shadow-sm"><Trash2 size={14}/></button>
                      </div>

                      <div className="h-32 bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden">
                        {t.mainVisual || t.heroImage ? (
                          <img src={t.mainVisual || t.heroImage} className="w-full h-full object-cover" />
                        ) : t.image ? (
                          <img src={t.image} className="w-full h-full object-cover" />
                        ) : (
                          <Trophy size={32} className="text-slate-300 dark:text-slate-600" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#081031]/80 to-transparent"></div>
                        <span className="absolute bottom-4 left-4 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest text-white shadow-sm" style={{ backgroundColor: t.color || '#0065FF' }}>
                          {t.type}
                        </span>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-[900] italic uppercase text-lg text-[#081031] dark:text-white leading-tight mb-2">{t.title}</h3>
                        <p className="text-xs font-bold text-slate-500 mb-4">{t.dateStr || t.date || 'Date à définir'} • {t.location || 'Lieu à définir'}</p>
                        <p className="text-xs text-slate-400 font-medium line-clamp-2 mb-4">{t.description}</p>
                        {(t.registrationLink || t.link) && (
                          <a href={t.registrationLink || t.link} target="_blank" rel="noopener noreferrer" className="mt-auto text-[10px] font-black uppercase tracking-widest text-[#0065FF] hover:underline flex items-center gap-1">
                            Lien Inscription <ArrowRight size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* ONGLET 3 : GESTION DE PROJETS (KANBAN)                                    */}
          {/* ========================================================================= */}
          {activeTab === 'projets' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="text-sm font-bold text-slate-500 ml-2">Suivez l'organisation de vos futurs événements club.</div>
                <button onClick={() => openModal('project')} className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shadow-md">
                  <Plus size={16} /> Nouveau Projet
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                
                <KanbanColumn title="💡 Boîte à Idées" count={projects.filter(p => p.status === 'Idée').length} color="border-slate-300 dark:border-slate-700" headerBg="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                  {projects.filter(p => p.status === 'Idée').map(proj => (
                    <ProjectCard key={proj._id} project={proj} onEdit={() => openModal('project', proj)} onDelete={() => handleDelete('project', proj._id)} onNext={() => updateProjectStatus(proj._id, 'Préparation')} />
                  ))}
                </KanbanColumn>

                <KanbanColumn title="⏳ En Préparation" count={projects.filter(p => p.status === 'Préparation').length} color="border-orange-500" headerBg="bg-orange-500/10 text-orange-600 dark:text-orange-400">
                  {projects.filter(p => p.status === 'Préparation').map(proj => (
                    <ProjectCard key={proj._id} project={proj} onEdit={() => openModal('project', proj)} onDelete={() => handleDelete('project', proj._id)} onPrev={() => updateProjectStatus(proj._id, 'Idée')} onNext={() => updateProjectStatus(proj._id, 'Prêt')} />
                  ))}
                </KanbanColumn>

                <KanbanColumn title="✅ Prêt / Validé" count={projects.filter(p => p.status === 'Prêt').length} color="border-green-500" headerBg="bg-green-500/10 text-green-600 dark:text-green-400">
                  {projects.filter(p => p.status === 'Prêt').map(proj => (
                    <ProjectCard key={proj._id} project={proj} onEdit={() => openModal('project', proj)} onDelete={() => handleDelete('project', proj._id)} onPrev={() => updateProjectStatus(proj._id, 'Préparation')} onNext={() => updateProjectStatus(proj._id, 'Terminé')} />
                  ))}
                </KanbanColumn>

                <KanbanColumn title="🏁 Terminé" count={projects.filter(p => p.status === 'Terminé').length} color="border-blue-500" headerBg="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {projects.filter(p => p.status === 'Terminé').map(proj => (
                    <ProjectCard key={proj._id} project={proj} onEdit={() => openModal('project', proj)} onDelete={() => handleDelete('project', proj._id)} onPrev={() => updateProjectStatus(proj._id, 'Prêt')} />
                  ))}
                </KanbanColumn>

              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* MODALES COMMUNES                                                          */}
      {/* ========================================================================= */}
      {modalType && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#081031] rounded-[2rem] w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-white/10 animate-in zoom-in-95">
            
            {/* Header Modale */}
            <div className="bg-slate-50 dark:bg-white/5 p-6 lg:p-8 border-b border-slate-200 dark:border-white/10 flex justify-between items-center shrink-0">
              <h2 className="text-xl lg:text-2xl font-[900] uppercase italic text-[#081031] dark:text-white flex items-center gap-3">
                {modalType === 'event' && <><CalendarDays className="text-[#0EE2E2]" size={24} /> {editingId ? 'Modifier Événement' : 'Nouvel Événement'}</>}
                {modalType === 'tournament' && <><Trophy className="text-[#0065FF]" size={24} /> {editingId ? 'Modifier Tournoi' : 'Nouveau Tournoi'}</>}
                {modalType === 'project' && <><Rocket className="text-purple-500" size={24} /> {editingId ? 'Modifier Projet' : 'Nouveau Projet'}</>}
              </h2>
              <button onClick={closeModal} className="p-2 bg-white dark:bg-[#081031] rounded-full text-slate-500 hover:text-red-500 shadow-sm"><X size={20} /></button>
            </div>

            {/* CONTENU DE LA MODALE */}
            {modalType === 'tournament' ? (
              <>
                <div className="flex border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 shrink-0 px-4 overflow-x-auto hide-scrollbar">
                  <button type="button" onClick={() => setModalTab('general')} className={`px-6 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${modalTab === 'general' ? 'border-[#0065FF] text-[#0065FF]' : 'border-transparent text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>
                    <Calendar size={16}/> Infos Générales
                  </button>
                  <button type="button" onClick={() => setModalTab('content')} className={`px-6 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${modalTab === 'content' ? 'border-[#0065FF] text-[#0065FF]' : 'border-transparent text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>
                    <LayoutTemplate size={16}/> Contenu & Sponsor
                  </button>
                  <button type="button" onClick={() => setModalTab('media')} className={`px-6 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${modalTab === 'media' ? 'border-[#0065FF] text-[#0065FF]' : 'border-transparent text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>
                    <Medal size={16}/> Galerie & Palmarès
                  </button>
                </div>
                
                <div className="overflow-y-auto hide-scrollbar p-6 lg:p-8 flex-1">
                  <form id="unified-form" onSubmit={handleSave} className="space-y-6">
                    
                    {/* === ONGLET 1 : GÉNÉRAL === */}
                    {modalTab === 'general' && (
                      <div className="space-y-6 animate-in fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                          {/* Image de fond Héro */}
                          <div className="space-y-4 md:col-span-2 pt-2 pb-4 border-b border-slate-200 dark:border-white/10">
                            <h3 className="font-[900] uppercase italic text-slate-800 dark:text-white flex items-center gap-2">
                              <ImageIcon size={18}/> Image de couverture (Fond Hero)
                            </h3>
                            <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 shadow-sm">
                              {tournamentForm.heroImage ? (
                                <div className="relative w-32 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-white/10">
                                  <img src={tournamentForm.heroImage} alt="Cover Preview" className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="w-32 h-16 rounded-lg bg-slate-200 dark:bg-black/50 flex items-center justify-center shrink-0 text-slate-400">
                                  <ImageIcon size={20} />
                                </div>
                              )}
                              <div className="flex-1 flex flex-col gap-2">
                                <input 
                                  type="file" accept="image/*" 
                                  onChange={(e) => handleTournamentImageUpload(e, 'heroImage')} 
                                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-[#0065FF] file:text-white hover:file:bg-[#0052cc] cursor-pointer transition-colors"
                                />
                                {tournamentForm.heroImage && (
                                  <button 
                                    type="button" 
                                    onClick={() => setTournamentForm(prev => ({ ...prev, heroImage: '' }))} 
                                    className="text-red-500 text-[10px] font-black uppercase tracking-widest text-left hover:underline"
                                  >
                                    Supprimer l'image
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Titre *</label>
                            <input type="text" name="title" value={tournamentForm.title} onChange={handleTournamentChange} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Sous-titre / Édition</label>
                            <input type="text" name="subtitle" value={tournamentForm.subtitle} onChange={handleTournamentChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Type d'événement</label>
                            <select name="type" value={tournamentForm.type} onChange={handleTournamentChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all">
                              <option value="tournoi">Tournoi Officiel</option>
                              <option value="promobad">Promobad / Interne</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Statut Inscriptions</label>
                            <select name="status" value={tournamentForm.status} onChange={handleTournamentChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all">
                              <option value="a_venir">À venir</option>
                              <option value="ouvert">Ouvertes</option>
                              <option value="complet">Complet</option>
                              <option value="termine">Terminé (Afficher Palmarès)</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Dates *</label>
                            <input type="text" name="dateStr" value={tournamentForm.dateStr} onChange={handleTournamentChange} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Lieu *</label>
                            <input type="text" name="location" value={tournamentForm.location} onChange={handleTournamentChange} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all" />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Lien Google Maps (Itinéraire)</label>
                            <input type="url" name="googleMapsLink" value={tournamentForm.googleMapsLink} onChange={handleTournamentChange} placeholder="https://maps.app.goo.gl/..." className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all" />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Niveaux / Séries *</label>
                            <input type="text" name="levels" value={tournamentForm.levels} onChange={handleTournamentChange} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all" />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Couleur du thème</label>
                            <div className="flex gap-3">
                              <input type="color" name="color" value={tournamentForm.color} onChange={handleTournamentChange} className="h-12 w-12 rounded-xl cursor-pointer border-0 bg-transparent p-0" />
                              <input type="text" name="color" value={tournamentForm.color} onChange={handleTournamentChange} className="flex-1 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all" />
                            </div>
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Logo du Tournoi (Upload fichier)</label>
                            <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3">
                              {tournamentForm.tournamentLogo ? (
                                <div className="relative w-16 h-16 rounded-lg bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0">
                                  <img src={tournamentForm.tournamentLogo} alt="Logo" className="max-w-full max-h-full object-contain p-1" />
                                </div>
                              ) : (
                                <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-black/50 flex items-center justify-center shrink-0 text-slate-400">
                                  <ImageIcon size={24} />
                                </div>
                              )}
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleTournamentImageUpload(e, 'tournamentLogo')} 
                                className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-[#0065FF] file:text-white hover:file:bg-[#0052cc] cursor-pointer transition-colors"
                              />
                            </div>
                          </div>

                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Lien BadNet</label>
                          <input type="url" name="registrationLink" value={tournamentForm.registrationLink} onChange={handleTournamentChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all" />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
                          <h3 className="font-[900] uppercase italic text-slate-800 dark:text-white flex items-center gap-2">
                            <ImageIcon size={18}/> Visuel Officiel (Affiche)
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-white/20 shadow-sm">
                            <div className="space-y-3">
                              <p className="text-xs font-bold text-slate-500">Format recommandé : 1080 x 1350 px (Portrait 4:5)</p>
                              <input 
                                type="file" accept="image/*" 
                                onChange={(e) => handleTournamentImageUpload(e, 'mainVisual')} 
                                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-[#0065FF] file:text-white hover:file:bg-[#0052cc] cursor-pointer transition-colors"
                              />
                              {tournamentForm.mainVisual && (
                                <button 
                                  type="button" 
                                  onClick={() => setTournamentForm(prev => ({ ...prev, mainVisual: '' }))}
                                  className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:underline"
                                >
                                  Supprimer l'image
                                </button>
                              )}

                              <div className="space-y-2 mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0065FF] ml-1">Lien d'édition Canva (Affiche)</label>
                                <input type="url" name="canvaLink" value={tournamentForm.canvaLink} onChange={handleTournamentChange} placeholder="https://www.canva.com/design/..." className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all shadow-sm" />
                              </div>
                            </div>
                            
                            <div className="flex justify-center">
                              {tournamentForm.mainVisual ? (
                                <div className="relative w-32 aspect-[1080/1350] rounded-lg shadow-xl overflow-hidden border-2 border-white dark:border-[#0f172a]">
                                  <img src={tournamentForm.mainVisual} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="w-32 aspect-[1080/1350] bg-slate-200 dark:bg-white/10 rounded-lg flex flex-col items-center justify-center text-slate-400 gap-2 border border-slate-300 dark:border-white/20">
                                  <ImageIcon size={24} />
                                  <span className="text-[8px] font-black uppercase text-center px-2">Aucun visuel</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* === ONGLET 2 : CONTENU & SPONSOR === */}
                    {modalTab === 'content' && (
                      <div className="space-y-8 animate-in fade-in">
                        <div className="space-y-4">
                          <h3 className="font-[900] uppercase italic text-slate-800 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">Textes & Infos Pratiques</h3>
                          
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Le Mot du Club (Description générale)</label>
                            <textarea name="description" value={tournamentForm.description} onChange={handleTournamentChange} rows="3" className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white resize-none transition-all"></textarea>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Tableaux joués (Séparés par des virgules)</label>
                              <input type="text" name="disciplines" value={tournamentForm.disciplines} onChange={handleTournamentChange} placeholder="Ex: Simples, Doubles, Mixtes" className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Équipements (Séparés par des virgules)</label>
                              <input type="text" name="amenities" value={tournamentForm.amenities} onChange={handleTournamentChange} placeholder="Ex: Parking, Douches, Tribunes" className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Texte de la Buvette</label>
                            <textarea name="buvetteDescription" value={tournamentForm.buvetteDescription} onChange={handleTournamentChange} rows="2" className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white resize-none transition-all"></textarea>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">URL Image du Gymnase</label>
                            <input type="url" name="gymImage" value={tournamentForm.gymImage} onChange={handleTournamentChange} placeholder="https://images.unsplash..." className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-[900] uppercase italic text-slate-800 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">Sponsor de l'Événement</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Nom du Sponsor</label>
                              <input type="text" name="name" value={tournamentForm.sponsor.name} onChange={handleSponsorChange} placeholder="Ex: Lardesports" className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Lien Site Web Sponsor</label>
                              <input type="url" name="website" value={tournamentForm.sponsor.website} onChange={handleSponsorChange} placeholder="https://..." className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">URL Logo du Sponsor</label>
                              <input type="url" name="logoUrl" value={tournamentForm.sponsor.logoUrl} onChange={handleSponsorChange} placeholder="https://..." className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all" />
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* === ONGLET 3 : MÉDIAS & PALMARÈS === */}
                    {modalTab === 'media' && (
                      <div className="space-y-8 animate-in fade-in">
                        
                        <div className="space-y-4">
                          <h3 className="font-[900] uppercase italic text-slate-800 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2 flex items-center gap-2"><ImageIcon size={18}/> Galerie Photos</h3>
                          <div className="space-y-2 mb-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Lien Album Google Photos Complet</label>
                            <input type="url" name="googlePhotosLink" value={tournamentForm.googlePhotosLink} onChange={handleTournamentChange} placeholder="https://photos.app.goo.gl/..." className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all" />
                          </div>
                          
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 block">Les 4 images Best-Of (Affichées sur le site)</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tournamentForm.galleryImages.map((imgUrl, idx) => (
                              <input key={`img-${idx}`} type="url" value={imgUrl} onChange={(e) => handleGalleryChange(idx, e.target.value)} placeholder={`URL Image ${idx + 1}`} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#0065FF] focus:ring-2 focus:ring-[#0065FF]/20 outline-none dark:text-white transition-all" />
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-2">
                            <h3 className="font-[900] uppercase italic text-slate-800 dark:text-white flex items-center gap-2"><Medal size={18}/> Palmarès (Vainqueurs)</h3>
                            <button type="button" onClick={addPalmaresRow} className="text-[#0065FF] text-xs font-bold uppercase hover:underline flex items-center gap-1"><Plus size={14}/> Ajouter une série</button>
                          </div>
                          
                          {tournamentForm.palmares.length === 0 ? (
                            <p className="text-sm text-slate-500 italic">Aucun résultat pour l'instant. Ajoutez une série pour commencer.</p>
                          ) : (
                            <div className="space-y-6">
                              {tournamentForm.palmares.map((row, idx) => (
                                <div key={`palmares-${idx}`} className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200 dark:border-white/10 relative">
                                  <button type="button" onClick={() => removePalmaresRow(idx)} className="absolute top-2 right-2 text-red-500 hover:bg-red-100 p-1 rounded-md transition-colors"><Trash2 size={14}/></button>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    <div className="space-y-1 sm:col-span-2 md:col-span-3 mb-2">
                                      <label className="text-[10px] font-black uppercase tracking-widest text-[#0065FF] ml-2">Nom de la Série (Ex: Série 1, R4-R5...)</label>
                                      <input type="text" value={row.serie} onChange={(e) => updatePalmaresRow(idx, 'serie', e.target.value)} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-bold focus:border-[#0065FF] outline-none dark:text-white transition-all" />
                                    </div>
                                    <input type="text" placeholder="SH Vainqueur" value={row.sh} onChange={(e) => updatePalmaresRow(idx, 'sh', e.target.value)} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none dark:text-white transition-all" />
                                    <input type="text" placeholder="SD Vainqueur" value={row.sd} onChange={(e) => updatePalmaresRow(idx, 'sd', e.target.value)} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none dark:text-white transition-all" />
                                    <input type="text" placeholder="DH Vainqueur" value={row.dh} onChange={(e) => updatePalmaresRow(idx, 'dh', e.target.value)} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none dark:text-white transition-all" />
                                    <input type="text" placeholder="DD Vainqueur" value={row.dd} onChange={(e) => updatePalmaresRow(idx, 'dd', e.target.value)} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none dark:text-white transition-all" />
                                    <input type="text" placeholder="Mixte Vainqueur" value={row.dx} onChange={(e) => updatePalmaresRow(idx, 'dx', e.target.value)} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none dark:text-white transition-all" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                  </form>
                </div>
              </>
            ) : (
              <div className="overflow-y-auto hide-scrollbar p-6 lg:p-8 flex-1">
                <form id="unified-form" onSubmit={handleSave} className="space-y-6">
                  
                  {/* FORMULAIRE ÉVÉNEMENT */}
                  {modalType === 'event' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Titre *</label>
                        <input type="text" required value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0EE2E2] outline-none transition-all dark:text-white" />
                      </div>
                      <div className="space-y-2 relative">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Catégorie *</label>
                        <div className="relative">
                          <button type="button" onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)} className={`w-full bg-slate-50 dark:bg-[#0f172a] border ${isCategoryDropdownOpen ? 'border-[#0EE2E2] ring-2 ring-[#0EE2E2]/20' : 'border-slate-200 dark:border-white/10'} rounded-xl px-4 py-3.5 text-sm font-bold flex justify-between items-center transition-all outline-none`}>
                            <span className="flex items-center gap-2 text-[#081031] dark:text-white">
                              <span style={{ color: categoryOptions.find(opt => opt.value === eventForm.category)?.defaultColor }}>{categoryOptions.find(opt => opt.value === eventForm.category)?.icon}</span>
                              {categoryOptions.find(opt => opt.value === eventForm.category)?.label}
                            </span>
                            <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isCategoryDropdownOpen && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 py-1">
                              {categoryOptions.map((opt) => (
                                <div key={opt.value} onClick={() => { setEventForm({ ...eventForm, category: opt.value, color: opt.defaultColor }); setIsCategoryDropdownOpen(false); }} className={`px-4 py-3 text-sm font-bold cursor-pointer flex items-center gap-3 ${eventForm.category === opt.value ? 'bg-[#0EE2E2]/10 text-[#0EE2E2] border-l-2 border-[#0EE2E2]' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 border-l-2 border-transparent'}`}>
                                  <span style={{ color: opt.defaultColor }}>{opt.icon}</span> {opt.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Couleur Badge</label>
                        <div className="flex items-center gap-4"><input type="color" value={eventForm.color} onChange={e => setEventForm({...eventForm, color: e.target.value})} className="w-14 h-12 rounded-xl cursor-pointer border-0 bg-transparent p-0" /><span className="text-xs font-bold text-slate-400 uppercase">{eventForm.color}</span></div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Date (Tri) *</label>
                        <input type="date" required value={eventForm.isoDate} onChange={e => setEventForm({...eventForm, isoDate: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0EE2E2] outline-none text-slate-600 dark:text-slate-300 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Date Affichée (Optionnel)</label>
                        <input type="text" value={eventForm.dateDisplay} onChange={e => setEventForm({...eventForm, dateDisplay: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0EE2E2] outline-none transition-all dark:text-white" placeholder="Ex: 06 & 07 Juin 2026" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Horaires</label>
                        <input type="text" value={eventForm.time} onChange={e => setEventForm({...eventForm, time: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0EE2E2] outline-none transition-all dark:text-white" placeholder="Ex: 09h00 - 18h00" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Lieu</label>
                        <input type="text" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0EE2E2] outline-none transition-all dark:text-white" placeholder="Ex: Gymnase Casalis" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Description</label>
                        <textarea rows="3" value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0EE2E2] outline-none resize-none transition-all dark:text-white"></textarea>
                      </div>
                    </div>
                  )}

                  {/* FORMULAIRE PROJET */}
                  {modalType === 'project' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Nom du Projet *</label>
                        <input type="text" required value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white" placeholder="Ex: Tournoi de Noël" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Période cible</label>
                        <input type="text" value={projectForm.targetDate} onChange={e => setProjectForm({...projectForm, targetDate: e.target.value})} placeholder="Ex: Décembre 2026" className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Responsable</label>
                        <input type="text" value={projectForm.manager} onChange={e => setProjectForm({...projectForm, manager: e.target.value})} placeholder="Ex: Julien" className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Budget Estimé (€)</label>
                        <input type="number" value={projectForm.budget} onChange={e => setProjectForm({...projectForm, budget: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Statut</label>
                        <select value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 outline-none appearance-none transition-all dark:text-white">
                          <option value="Idée">Idée</option>
                          <option value="Préparation">Préparation</option>
                          <option value="Prêt">Prêt</option>
                          <option value="Terminé">Terminé</option>
                        </select>
                      </div>

                      <div className="md:col-span-2 pt-4 border-t border-slate-100 dark:border-white/10">
                        <div className="flex justify-between items-center mb-4">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Checklist des tâches</label>
                          <button type="button" onClick={addTask} className="text-[10px] font-black uppercase text-purple-500 bg-purple-50 dark:bg-purple-500/10 px-3 py-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors">+ Ajouter Tâche</button>
                        </div>
                        <div className="space-y-2">
                          {projectForm.tasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-3">
                              <button type="button" onClick={() => updateTask(task.id, 'done', !task.done)} className={`w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0 ${task.done ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 dark:border-white/20'}`}>
                                {task.done && <CheckSquare size={12} />}
                              </button>
                              <input type="text" value={task.desc} onChange={(e) => updateTask(task.id, 'desc', e.target.value)} placeholder="Intitulé de la tâche..." className={`flex-1 bg-transparent border-b border-slate-200 dark:border-white/10 py-1.5 text-sm outline-none focus:border-purple-500 ${task.done ? 'text-slate-400 line-through' : 'text-[#081031] dark:text-white font-medium'}`} />
                              <button type="button" onClick={() => removeTask(task.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><X size={14}/></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Footer Modale */}
            <div className="p-6 lg:p-8 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0f172a] flex justify-end gap-3 shrink-0">
              <button type="button" onClick={closeModal} className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-200 dark:hover:bg-white/5 transition-colors">Annuler</button>
              <button type="submit" form="unified-form" disabled={isSaving} className={`text-white px-8 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 hover:scale-105 ${modalType === 'event' ? 'bg-[#0EE2E2] text-[#081031] shadow-[#0EE2E2]/20' : modalType === 'tournament' ? 'bg-[#0065FF] shadow-[#0065FF]/20' : 'bg-purple-500 shadow-purple-500/20'}`}>
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                {editingId ? 'Mettre à jour' : 'Enregistrer'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

/* --- COMPOSANT KANBAN PROJECT --- */
const KanbanColumn = ({ title, count, color, headerBg, children }) => (
  <div className="flex flex-col h-full">
    <div className={`flex justify-between items-center px-4 py-3 rounded-2xl mb-4 border ${color} ${headerBg} font-black uppercase tracking-widest text-xs shadow-sm`}>
      <span>{title}</span>
      <span className="bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-lg">{count}</span>
    </div>
    <div className="flex-1 space-y-4 min-h-[200px] bg-slate-50 dark:bg-[#081031] p-3 rounded-[1.5rem] border border-slate-100 dark:border-white/5">
      {children}
      {count === 0 && (
        <div className="h-full flex items-center justify-center text-slate-400 text-xs font-bold italic uppercase tracking-widest text-center opacity-50 py-10">
          Vide
        </div>
      )}
    </div>
  </div>
);

const ProjectCard = ({ project, onEdit, onDelete, onNext, onPrev }) => {
  const doneTasks = project.tasks.filter(t => t.done).length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm p-4 relative group flex flex-col hover:border-purple-500/50 transition-colors">
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1.5 text-slate-400 hover:text-purple-500 bg-slate-50 dark:bg-white/5 rounded-lg transition-colors"><Pencil size={12}/></button>
        <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-white/5 rounded-lg transition-colors"><Trash2 size={12}/></button>
      </div>

      <h4 className="font-[900] uppercase italic text-sm text-[#081031] dark:text-white leading-tight pr-12 mb-2">{project.title}</h4>
      
      <div className="flex flex-col gap-1.5 mb-4">
        {project.targetDate && <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={10}/> {project.targetDate}</span>}
        {project.manager && <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><User size={10}/> {project.manager}</span>}
        {project.budget > 0 && <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest flex items-center gap-1.5 mt-1">Budget: {project.budget}€</span>}
      </div>

      <div className="mt-auto space-y-2">
        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
          <span>Tâches</span>
          <span className={progress === 100 ? 'text-green-500' : ''}>{doneTasks}/{totalTasks}</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
          <div className={`h-full transition-all ${progress === 100 ? 'bg-green-500' : 'bg-purple-500'}`} style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
        {onPrev ? <button onClick={onPrev} className="p-1.5 bg-slate-100 dark:bg-white/10 rounded-lg text-slate-500 hover:text-[#081031] dark:hover:text-white transition-colors"><ArrowRight size={14} className="rotate-180" /></button> : <div></div>}
        {onNext ? <button onClick={onNext} className="p-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"><ArrowRight size={14} /></button> : <div></div>}
      </div>
    </div>
  );
};