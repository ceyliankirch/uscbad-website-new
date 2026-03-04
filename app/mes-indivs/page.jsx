'use client';
import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, CheckCircle, Target, ChevronRight, X, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function AdminIndivsPage() {
  const { data: session, status } = useSession();
  
  const [requests, setRequests] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [upcomingFridays, setUpcomingFridays] = useState([]);
  
  const [assignData, setAssignData] = useState({ date: '', slot: '20:30' });

  useEffect(() => {
    // 1. Génération automatique des 4 prochains vendredis
    const fridays = [];
    let d = new Date();
    d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7 || 7)); // Trouve le prochain vendredi
    for (let i = 0; i < 4; i++) {
      fridays.push(new Date(d).toISOString().split('T')[0]);
      d.setDate(d.getDate() + 7);
    }
    setUpcomingFridays(fridays);
    setAssignData({ ...assignData, date: fridays[0] });

    // 2. Récupération des demandes réelles
    const fetchData = async () => {
      if (session?.user) {
        try {
          // --- PRÉPARATION POUR LA VRAIE API ---
          // Décommente ces lignes quand ton API `/api/indiv-requests` sera prête
          // const res = await fetch('/api/indiv-requests');
          // const data = await res.json();
          // const allRequests = data.success ? data.data : [];
          
          // Initialisation vide en attendant les vraies données
          const allRequests = []; 

          // FILTRE DYNAMIQUE : 
          // Si l'utilisateur connecté est admin, il voit tout.
          // Si c'est un coach, il ne voit que les demandes qui lui sont adressées (où coachId === son ID).
          const myFilteredRequests = session.user.role === 'admin' 
            ? allRequests 
            : allRequests.filter(req => req.coachId === session.user.id);
          
          setRequests(myFilteredRequests);

          // Initialisation du planning vide
          // À lier avec une API `/api/indiv-schedule` plus tard
          setSchedule({});
        } catch (error) {
          console.error("Erreur lors de la récupération des indivs :", error);
        }
      }
    };

    fetchData();
  }, [session]);

  // Ouverture/Fermeture de la modale de planification
  const openAssignModal = (req) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  const closeAssignModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

  // Validation de la planification
  const handleAssign = (e) => {
    e.preventDefault();
    const { date, slot } = assignData;

    // Vérifier si le créneau est libre
    if (schedule[date] && schedule[date][slot]) {
      alert("Ce créneau est déjà réservé !");
      return;
    }

    // Mise à jour du planning local
    const newSchedule = { ...schedule };
    if (!newSchedule[date]) newSchedule[date] = { '20:30': null, '21:30': null };
    newSchedule[date][slot] = selectedRequest;
    setSchedule(newSchedule);

    // Retrait de la demande de la liste d'attente
    setRequests(requests.filter(r => r.id !== selectedRequest.id));
    closeAssignModal();
    
    // --- TODO: Ajouter ici l'appel API pour sauvegarder le planning ---
    // fetch('/api/indiv-schedule', { method: 'POST', body: JSON.stringify({ ... }) })
  };

  // Annulation d'un créneau
  const cancelIndiv = (date, slot) => {
    if(!window.confirm("Voulez-vous vraiment annuler cette séance et libérer le créneau ?")) return;
    const newSchedule = { ...schedule };
    newSchedule[date][slot] = null;
    setSchedule(newSchedule);
    
    // --- TODO: Ajouter ici l'appel API pour supprimer le créneau en BDD ---
  };

  // Formateur de date en français
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  // Écran de chargement le temps de vérifier la session
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-[#F72585] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 leading-tight pt-2">
            Gestion <span className="text-[#F72585]">Indivs</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">
            {session?.user?.role === 'admin' 
              ? "Vision globale de toutes les demandes du club." 
              : `Bienvenue ${session?.user?.name}, gérez les demandes qui vous ont été adressées.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : DEMANDES EN ATTENTE */}
        <div className="xl:col-span-1 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-[900] uppercase text-[#081031] dark:text-white flex items-center gap-2">
              <AlertCircle size={18} className="text-orange-500" /> En attente ({requests.length})
            </h2>
          </div>

          {requests.length === 0 ? (
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 text-center text-slate-500 font-bold text-sm shadow-sm">
              Vous n'avez aucune nouvelle demande.
            </div>
          ) : (
            requests.map(req => (
              <div key={req.id} className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm group hover:border-[#F72585] transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#081031] flex items-center justify-center text-slate-500 font-bold text-xs">
                      {req.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-sm uppercase text-[#081031] dark:text-white leading-none">{req.name}</h3>
                      <span className="text-[10px] font-bold text-[#F72585] uppercase tracking-widest">{req.level}</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4 bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-100 dark:border-white/5">
                  <Target size={12} className="inline mr-1 text-slate-400" /> {req.objective || 'Aucun objectif précisé'}
                </div>
                <button 
                  onClick={() => openAssignModal(req)}
                  className="w-full bg-[#081031] dark:bg-white text-white dark:text-[#081031] py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#F72585] dark:hover:bg-[#F72585] dark:hover:text-white transition-colors"
                >
                  Planifier <ChevronRight size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* COLONNE DROITE : PLANNING DES VENDREDIS */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-[900] uppercase text-[#081031] dark:text-white flex items-center gap-2">
              <CalendarDays size={18} className="text-[#0EE2E2]" /> Mon Planning
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingFridays.map(date => {
              const daySchedule = schedule[date] || { '20:30': null, '21:30': null };
              
              return (
                <div key={date} className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
                  
                  {/* Header Date */}
                  <div className="bg-slate-50 dark:bg-white/5 p-4 border-b border-slate-200 dark:border-white/10 text-center">
                    <h3 className="font-black uppercase italic text-[#081031] dark:text-white capitalize">
                      {formatDate(date)}
                    </h3>
                  </div>

                  {/* Les 2 Créneaux */}
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    
                    {/* CRÉNEAU 1 */}
                    <div className={`p-4 rounded-xl border-2 transition-all ${daySchedule['20:30'] ? 'border-[#0EE2E2] bg-[#0EE2E2]/5' : 'border-dashed border-slate-200 dark:border-white/10 bg-transparent'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                          <Clock size={12} /> 20h30 - 21h30
                        </span>
                        {daySchedule['20:30'] && (
                          <button onClick={() => cancelIndiv(date, '20:30')} className="text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                        )}
                      </div>
                      {daySchedule['20:30'] ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#0EE2E2] text-[#081031] flex items-center justify-center font-black text-xs shrink-0">{daySchedule['20:30'].name.charAt(0)}</div>
                          <div className="truncate">
                            <p className="font-bold text-sm text-[#081031] dark:text-white truncate">{daySchedule['20:30'].name}</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">{daySchedule['20:30'].level}</p>
                          </div>
                        </div>
                      ) : (<div className="text-center py-2 text-xs font-bold text-slate-400">Créneau Libre</div>)}
                    </div>

                    {/* CRÉNEAU 2 */}
                    <div className={`p-4 rounded-xl border-2 transition-all ${daySchedule['21:30'] ? 'border-[#0EE2E2] bg-[#0EE2E2]/5' : 'border-dashed border-slate-200 dark:border-white/10 bg-transparent'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                          <Clock size={12} /> 21h30 - 22h30
                        </span>
                        {daySchedule['21:30'] && (
                          <button onClick={() => cancelIndiv(date, '21:30')} className="text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                        )}
                      </div>
                      {daySchedule['21:30'] ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#0EE2E2] text-[#081031] flex items-center justify-center font-black text-xs shrink-0">{daySchedule['21:30'].name.charAt(0)}</div>
                          <div className="truncate">
                            <p className="font-bold text-sm text-[#081031] dark:text-white truncate">{daySchedule['21:30'].name}</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">{daySchedule['21:30'].level}</p>
                          </div>
                        </div>
                      ) : (<div className="text-center py-2 text-xs font-bold text-slate-400">Créneau Libre</div>)}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* MODAL DE PLANIFICATION */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#081031] rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-slate-50 dark:bg-white/5 p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white flex items-center gap-2">
                <CalendarDays className="text-[#F72585]" size={20} />
                Planifier la séance
              </h2>
              <button onClick={closeAssignModal} className="p-2 bg-white dark:bg-[#081031] rounded-full text-slate-500 hover:text-red-500 shadow-sm"><X size={16} /></button>
            </div>
            
            <form onSubmit={handleAssign} className="p-6 space-y-6">
              
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Joueur sélectionné</p>
                <p className="font-black text-lg uppercase text-[#081031] dark:text-white">{selectedRequest.name}</p>
                <p className="text-sm font-bold text-[#F72585]">{selectedRequest.level}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Date (Vendredi) *</label>
                <select required value={assignData.date} onChange={(e) => setAssignData({...assignData, date: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold appearance-none focus:ring-2 focus:ring-[#F72585] outline-none">
                  {upcomingFridays.map(date => <option key={date} value={date}>{formatDate(date)}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Créneau Horaire *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setAssignData({...assignData, slot: '20:30'})} className={`py-3 rounded-xl border-2 font-black text-sm transition-all ${assignData.slot === '20:30' ? 'border-[#F72585] bg-[#F72585]/10 text-[#F72585]' : 'border-slate-200 dark:border-white/10 text-slate-500'}`}>20h30 - 21h30</button>
                  <button type="button" onClick={() => setAssignData({...assignData, slot: '21:30'})} className={`py-3 rounded-xl border-2 font-black text-sm transition-all ${assignData.slot === '21:30' ? 'border-[#F72585] bg-[#F72585]/10 text-[#F72585]' : 'border-slate-200 dark:border-white/10 text-slate-500'}`}>21h30 - 22h30</button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end gap-3">
                <button type="button" onClick={closeAssignModal} className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">Annuler</button>
                <button type="submit" className="bg-[#F72585] text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-[#d91c70] transition-colors shadow-lg shadow-[#F72585]/30">
                  <CheckCircle size={16} /> Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}