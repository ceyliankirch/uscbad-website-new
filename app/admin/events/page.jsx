'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Calendar, Download, Upload, Loader2, X, Save, Clock, MapPin, CalendarDays, Trophy, PartyPopper, Dumbbell, ChevronDown, CheckCircle, Baby } from 'lucide-react';

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // État pour le menu déroulant custom des catégories
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '', 
    category: 'Vie du Club', 
    isoDate: '', 
    dateDisplay: '', 
    time: '', 
    location: '', 
    description: '', 
    color: '#0065FF'
  });

  const categoryOptions = [
    { value: 'Compétition', label: 'Compétition', icon: <Trophy size={16}/>, defaultColor: '#0065FF' },
    { value: 'Vie du Club', label: 'Vie du Club', icon: <PartyPopper size={16}/>, defaultColor: '#FFD500' },
    { value: 'Jeunes', label: 'Jeunes', icon: <Baby size={16}/>, defaultColor: '#0EE2E2' },
  ];

  useEffect(() => { 
    fetchEvents(); 
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.success) setEvents(data.data);
    } catch (error) {
      console.error("Erreur de chargement des événements :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (event = null) => {
    setIsCategoryDropdownOpen(false);
    if (event) {
      setEditingId(event._id);
      setFormData(event);
    } else {
      setEditingId(null);
      setFormData({ title: '', category: 'Vie du Club', isoDate: '', dateDisplay: '', time: '', location: '', description: '', color: '#0065FF' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsCategoryDropdownOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/events/${editingId}` : '/api/events';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) { 
        fetchEvents(); 
        closeModal(); 
      }
    } catch (error) {
      console.error("Erreur d'enregistrement :", error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) return;
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      fetchEvents();
    } catch (error) {
      console.error("Erreur de suppression :", error);
    }
  };

  // --- LOGIQUE EXPORT ICS ---
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

  // --- LOGIQUE IMPORT ICS ---
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
            body: JSON.stringify({ 
                title, 
                isoDate, 
                category: 'Compétition', // Par défaut
                description, 
                location, 
                dateDisplay: isoDate,
                color: '#0065FF' 
            })
          });
        }
      }
      fetchEvents();
      alert("Importation terminée !");
    };
    reader.readAsText(file);
    e.target.value = null; // Reset de l'input
  };

  // Obtenir l'icône selon la catégorie pour l'affichage de la carte
  const getCategoryIcon = (category) => {
    const cat = categoryOptions.find(c => c.value === category);
    return cat ? cat.icon : <Calendar size={14} />;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 leading-tight pt-2">
            Gestion <span className="text-[#0EE2E2]">Calendrier</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Planifiez la vie du club et synchronisez les agendas.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <label className="cursor-pointer bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-[#0065FF] dark:hover:text-[#0EE2E2] px-5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shadow-sm">
            <Upload size={14} /> Importer .ics
            <input type="file" accept=".ics" className="hidden" onChange={handleImportICS} />
          </label>
          
          <button onClick={exportToICS} className="bg-slate-800 text-white px-5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-sm">
            <Download size={14} /> Exporter .ics
          </button>
          
          <button onClick={() => openModal()} className="bg-[#0EE2E2] hover:bg-[#0bd1d1] text-[#081031] px-6 py-3 rounded-xl font-black uppercase text-[10px] lg:text-xs tracking-widest flex items-center gap-2 transition-all shadow-md">
            <Plus size={16} /> Nouvel Événement
          </button>
        </div>
      </div>

      {/* LISTE DES ÉVÉNEMENTS */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0EE2E2]" size={48} /></div>
      ) : events.length === 0 ? (
        <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm p-12 text-center">
          <CalendarDays size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-black text-[#081031] dark:text-white uppercase italic mb-2">Aucun événement</h3>
          <p className="text-slate-500 font-bold text-sm">Votre calendrier est vide. Ajoutez votre premier événement pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event._id} className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm group hover:shadow-md transition-shadow relative flex flex-col">
              
              <div 
                className="h-2 w-full absolute top-0 left-0"
                style={{ backgroundColor: event.color }}
              ></div>

              <div className="p-6 pt-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest text-white shadow-sm"
                    style={{ backgroundColor: event.color }}
                  >
                    {getCategoryIcon(event.category)} {event.category}
                  </span>
                  <div className="flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(event)} className="p-2 bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-[#0065FF] dark:hover:text-[#0EE2E2] rounded-lg transition-colors">
                      <Pencil size={14}/>
                    </button>
                    <button onClick={() => deleteEvent(event._id)} className="p-2 bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-500 rounded-lg transition-colors">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>

                <h3 className="font-[900] italic uppercase text-lg text-[#081031] dark:text-white leading-tight mb-4">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Calendar size={14} className="text-slate-400" /> 
                    {event.dateDisplay || new Date(event.isoDate).toLocaleDateString('fr-FR')}
                  </div>
                  {(event.time || event.location) && (
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Clock size={14} className="text-slate-400" /> {event.time || '?'} 
                      <span className="mx-1">•</span> 
                      <MapPin size={14} className="text-slate-400" /> <span className="truncate">{event.location || '?'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORMULAIRE (Avec z-[999]) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#081031] rounded-[2rem] w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col">
            
            <div className="bg-slate-50 dark:bg-white/5 p-6 lg:p-8 border-b border-slate-200 dark:border-white/10 flex justify-between items-center rounded-t-[2rem] shrink-0">
              <h2 className="text-xl lg:text-2xl font-[900] uppercase italic text-[#081031] dark:text-white flex items-center gap-3">
                <CalendarDays className="text-[#0EE2E2]" size={24} />
                {editingId ? 'Modifier' : 'Ajouter'} un événement
              </h2>
              <button onClick={closeModal} className="p-2 bg-white dark:bg-[#081031] rounded-full text-slate-500 hover:text-red-500 shadow-sm"><X size={20} /></button>
            </div>

            <div className="overflow-y-auto hide-scrollbar p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Titre */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Titre de l'événement *</label>
                    <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0EE2E2] outline-none" placeholder="Ex: Tournoi Régional..." />
                  </div>

                  {/* Catégorie (Custom Select) */}
                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Catégorie *</label>
                    <div className="relative">
                      <button 
                        type="button" 
                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)} 
                        className={`w-full bg-slate-50 dark:bg-[#0f172a] border ${isCategoryDropdownOpen ? 'border-[#0EE2E2] ring-2 ring-[#0EE2E2]/20' : 'border-slate-200 dark:border-white/10'} rounded-xl px-4 py-3.5 text-sm font-bold flex justify-between items-center transition-all outline-none`}
                      >
                        <span className="flex items-center gap-2 text-[#081031] dark:text-white">
                          <span style={{ color: categoryOptions.find(opt => opt.value === formData.category)?.defaultColor }}>
                            {categoryOptions.find(opt => opt.value === formData.category)?.icon}
                          </span>
                          {categoryOptions.find(opt => opt.value === formData.category)?.label}
                        </span>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isCategoryDropdownOpen && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                          <div className="max-h-60 py-1">
                            {categoryOptions.map((opt) => (
                              <div 
                                key={opt.value} 
                                onClick={() => {
                                  // Quand on change la catégorie, on pré-remplit une couleur correspondante
                                  setFormData({ ...formData, category: opt.value, color: opt.defaultColor });
                                  setIsCategoryDropdownOpen(false);
                                }} 
                                className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors flex items-center gap-3 ${
                                  formData.category === opt.value 
                                    ? 'bg-[#0EE2E2]/10 text-[#0EE2E2] border-l-2 border-[#0EE2E2]' 
                                    : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 border-l-2 border-transparent'
                                }`}
                              >
                                <span style={{ color: opt.defaultColor }}>{opt.icon}</span>
                                {opt.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Couleur */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Couleur Badge</label>
                    <div className="flex items-center gap-4">
                      <input type="color" name="color" value={formData.color} onChange={handleChange} className="w-14 h-12 rounded-xl cursor-pointer border-0 bg-transparent p-0" />
                      <span className="text-xs font-bold text-slate-400 uppercase">{formData.color}</span>
                    </div>
                  </div>

                  {/* Date ISO */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Date Officielle (Tri) *</label>
                    <input type="date" name="isoDate" required value={formData.isoDate} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0EE2E2] outline-none text-slate-600 dark:text-slate-300" />
                  </div>

                  {/* Affichage Date Libre */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Texte affiché (Optionnel)</label>
                    <input type="text" name="dateDisplay" value={formData.dateDisplay} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0EE2E2] outline-none" placeholder="Ex: 06 & 07 Juin 2026" />
                  </div>

                  {/* Horaires */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Horaires</label>
                    <input type="text" name="time" value={formData.time} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0EE2E2] outline-none" placeholder="Ex: 09h00 - 18h00" />
                  </div>

                  {/* Lieu */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Lieu</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0EE2E2] outline-none" placeholder="Ex: Gymnase Casalis" />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Description</label>
                    <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0EE2E2] outline-none resize-none" placeholder="Détails de l'événement..."></textarea>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-white/10 flex justify-end gap-3">
                  <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">Annuler</button>
                  <button type="submit" disabled={isSaving} className="bg-[#0EE2E2] text-[#081031] px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-[#0bd1d1] transition-colors shadow-lg shadow-[#0EE2E2]/20 disabled:opacity-50">
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                    {editingId ? 'Mettre à jour' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}