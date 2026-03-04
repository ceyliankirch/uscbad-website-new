'use client';
import React, { useState, useEffect } from 'react';
import { Target, Zap, Crosshair, MapPin, Clock, CheckCircle, CalendarDays, User, Loader2, Send, Info, ChevronDown } from 'lucide-react';

export default function IndivsPage() {
  const [coaches, setCoaches] = useState([]);
  const [isLoadingCoaches, setIsLoadingCoaches] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' ou 'error'
  const [isLevelOpen, setIsLevelOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    level: 'Intermédiaire',
    coachId: '', // C'est ici que l'ID de l'utilisateur (coach) sera stocké
    date: '',
    objective: ''
  });

  const levelOptions = [
    { value: 'Débutant', label: 'Débutant (D7/D8/D9)' },
    { value: 'Intermédiaire', label: 'Intermédiaire (R4/R5/R6)' },
    { value: 'Compétiteur', label: 'Compétiteur (N/R)' }
  ];

  // 1. Récupération des vrais comptes utilisateurs (Rôle = Coach)
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        // Idéalement, faire appel à '/api/users' et filtrer côté serveur
        // Pour l'exemple, on simule la réponse de ton API utilisateurs
        const res = await fetch('/api/users'); 
        
        // Si l'API /api/users n'est pas encore prête, on simule ici :
        const simulatedUsers = [
          { _id: '2', name: 'Malo Coach', email: 'malo@uscreteil.com', role: 'coach', image: null },
          { _id: '3', name: 'Romain Coach', email: 'romain@uscreteil.com', role: 'coach', image: null },
          { _id: '1', name: 'Admin Principal', email: 'admin@uscreteil.com', role: 'admin' },
        ];

        // On ne garde que les comptes ayant le rôle 'coach'
        const coachUsers = simulatedUsers.filter(user => user.role === 'coach');
        setCoaches(coachUsers);
        
        if (coachUsers.length > 0) {
          setFormData(prev => ({ ...prev, coachId: coachUsers[0]._id }));
        }

      } catch (error) {
        console.error("Erreur lors de la récupération des coachs:", error);
      } finally {
        setIsLoadingCoaches(false);
      }
    };

    fetchCoaches();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLevelSelect = (value) => {
    setFormData({ ...formData, level: value });
    setIsLevelOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Appel API pour sauvegarder la demande dans la BDD avec le coachId sélectionné
      // const res = await fetch('/api/indiv-requests', { method: 'POST', body: JSON.stringify(formData) });
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', level: 'Intermédiaire', coachId: coaches[0]?._id || '', date: '', objective: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#040817] min-h-screen font-sans text-[#081031] dark:text-white transition-colors duration-300 pb-20">
      
      {/* SECTION HERO */}
      <section className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-28 flex flex-col justify-center items-center text-center overflow-hidden bg-[#081031]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#0065FF]/20 to-transparent z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-[#0EE2E2] rounded-full blur-[150px] opacity-20 pointer-events-none z-0"></div>
        
        <div className="relative z-20 px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0EE2E2]/10 border border-[#0EE2E2]/30 text-[#0EE2E2] rounded-full font-[900] uppercase text-[10px] tracking-widest italic mb-6 backdrop-blur-md">
            <Zap size={14} /> Coaching Sur-Mesure
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-[900] uppercase italic tracking-tighter leading-[0.9] text-white drop-shadow-xl mb-6">
            SESSIONS <span className="text-[#0EE2E2]">INDIVS</span>
          </h1>
          <p className="text-sm lg:text-lg font-bold text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Optimisez votre jeu avec un encadrement exclusif. 120 minutes de haute intensité pour franchir un palier technique et tactique.
          </p>
        </div>
      </section>

      {/* ... (La section POURQUOI LES INDIVS a été omise ici pour la clarté, garde celle que tu avais) ... */}

      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* COLONNE GAUCHE : Infos & Règles */}
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-4">
                L'Expérience <br/><span className="text-[#0065FF]">Pasteur</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed text-sm lg:text-base">
                Un cadre calme et propice à la concentration maximale. Le temps s'arrête pour laisser place au perfectionnement avec nos experts.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
                <div className="w-12 h-12 bg-white dark:bg-[#081031] rounded-xl flex items-center justify-center text-[#F72585] shrink-0 shadow-sm">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-black uppercase text-sm">Gymnase Pasteur</h4>
                  <p className="text-xs text-slate-500 font-bold">Terrain central réservé</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
                <div className="w-12 h-12 bg-white dark:bg-[#081031] rounded-xl flex items-center justify-center text-[#0EE2E2] shrink-0 shadow-sm">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-black uppercase text-sm">20h30 - 22h30</h4>
                  <p className="text-xs text-slate-500 font-bold">Arrivée conseillée à 20h15 pour l'échauffement</p>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : Le Formulaire de Réservation */}
          <div className="bg-white dark:bg-[#0f172a] p-8 lg:p-10 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 relative">
            
            <div className="mb-8">
              <h3 className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2">Réserver une <span className="text-[#F72585]">Session</span></h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Remplissez ce formulaire pour planifier votre indiv.</p>
            </div>

            {submitStatus === 'success' ? (
              <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 p-6 rounded-2xl text-center animate-in zoom-in">
                <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                <h4 className="text-lg font-black uppercase italic mb-2">Demande Envoyée !</h4>
                <p className="text-sm font-medium">Votre demande a été transmise directement à l'entraîneur sélectionné sur son espace personnel.</p>
                <button onClick={() => setSubmitStatus(null)} className="mt-6 text-xs font-bold uppercase tracking-widest underline">Faire une autre demande</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* SÉLECTION DU COMPTE COACH (Cartes interactives) */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1.5">
                    <Target size={12}/> Choix de l'entraîneur *
                  </label>
                  
                  {isLoadingCoaches ? (
                    <div className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-2xl p-6 text-sm font-bold flex flex-col items-center justify-center gap-3 text-slate-400 h-32">
                      <Loader2 size={24} className="animate-spin text-[#0065FF]" /> Chargement des experts...
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {coaches.length > 0 ? (
                        coaches.map(coach => {
                          const isSelected = formData.coachId === coach._id;
                          return (
                            <button
                              type="button"
                              key={coach._id}
                              onClick={() => setFormData({ ...formData, coachId: coach._id })}
                              className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                                isSelected 
                                  ? 'border-[#0065FF] dark:border-[#0EE2E2] bg-[#0065FF]/5 dark:bg-[#0EE2E2]/10 shadow-md transform scale-[1.02]' 
                                  : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#081031] hover:border-slate-300 dark:hover:border-white/20'
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute -top-2 -right-2 bg-[#0065FF] dark:bg-[#0EE2E2] text-white rounded-full p-1 shadow-md">
                                  <CheckCircle size={14} className="dark:text-[#081031]" />
                                </div>
                              )}
                              
                              <div className={`w-14 h-14 rounded-full overflow-hidden mb-3 border-2 transition-colors flex items-center justify-center text-xl font-black ${isSelected ? 'border-[#0065FF] dark:border-[#0EE2E2] bg-[#0065FF] text-white dark:bg-[#0EE2E2] dark:text-[#081031]' : 'border-white dark:border-[#0f172a] bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                                {coach.image ? (
                                  <img src={coach.image} alt={coach.name} className="w-full h-full object-cover" />
                                ) : (
                                  coach.name.charAt(0).toUpperCase()
                                )}
                              </div>
                              
                              <h4 className={`font-[900] italic uppercase text-sm mb-1 ${isSelected ? 'text-[#0065FF] dark:text-[#0EE2E2]' : ''}`}>
                                {coach.name}
                              </h4>
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider text-center line-clamp-2">
                                Entraîneur Certifié
                              </p>
                            </button>
                          );
                        })
                      ) : (
                        <div className="col-span-2 text-center text-sm font-bold text-slate-400 py-6">
                          Aucun entraîneur n'a de compte actif pour le moment.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* NOM & EMAIL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1.5"><User size={12}/> Nom Complet *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#0065FF] outline-none transition-all" placeholder="Jean Dupont" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Email *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#0065FF] outline-none transition-all" placeholder="jean@email.com" />
                  </div>
                </div>

                {/* NIVEAU & DATE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Votre Niveau</label>
                    <div className="relative">
                      <button type="button" onClick={() => setIsLevelOpen(!isLevelOpen)} className={`w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold flex justify-between items-center transition-all outline-none ${isLevelOpen ? 'ring-2 ring-[#0065FF]' : ''}`}>
                        <span className="text-[#081031] dark:text-white">
                          {levelOptions.find(opt => opt.value === formData.level)?.label}
                        </span>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isLevelOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isLevelOpen && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                          {levelOptions.map((opt) => (
                            <div key={opt.value} onClick={() => handleLevelSelect(opt.value)} className={`px-4 py-3.5 text-sm font-bold cursor-pointer transition-colors ${formData.level === opt.value ? 'bg-[#0065FF]/10 text-[#0065FF] dark:text-[#0EE2E2]' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300'}`}>
                              {opt.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1.5"><CalendarDays size={12}/> Date Souhaitée</label>
                    <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#0065FF] outline-none transition-all text-slate-600 dark:text-slate-300" />
                  </div>
                </div>

                {/* OBJECTIF */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Objectif de la séance (Optionnel)</label>
                  <textarea name="objective" rows="3" value={formData.objective} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#0065FF] outline-none transition-all resize-none" placeholder="Ex: Améliorer mon retard fond de court..."></textarea>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={isSubmitting || coaches.length === 0} className="w-full bg-[#0065FF] hover:bg-[#0052cc] text-white px-8 py-4 rounded-xl font-[900] uppercase italic tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#0065FF]/30 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Envoi en cours...</> : <>Envoyer la demande <Send size={18} /></>}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      </section>

    </div>
  );
}