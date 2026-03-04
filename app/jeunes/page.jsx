'use client';

import React, { useState, useEffect } from 'react';
import { Star, Clock, MapPin, Trophy, Award, User, ChevronRight, Calendar } from 'lucide-react';

// --- DONNÉES STATIQUES (Pour éviter les 404 sur ce qui n'a pas encore de BDD) ---
const ELITE_PLAYERS = [
  { _id: '1', name: "Lucas M.", category: "Cadet", rank: "N2 / U17", titles: "Vainqueur CDJ #3", image: null, accentColor: "#FFD500", isFutureChamp: true },
  { _id: '2', name: "Chloé L.", category: "Minime", rank: "N3 / U15", titles: "Top 8 France", image: null, accentColor: "#0EE2E2", isFutureChamp: false },
  { _id: '3', name: "Enzo R.", category: "Benjamin", rank: "R4 / U13", titles: "Champion Inter-régional", image: null, accentColor: "#0065FF", isFutureChamp: false }
];

const EVENTS_DATA = [
  { _id: '1', date: '24', month: 'OCT', title: 'Stage de la Toussaint', type: 'Stage', location: 'Gymnase Nelson Paillou' },
  { _id: '2', date: '15', month: 'DÉC', title: 'Fête de Noël Jeunes', type: 'Événement Club', location: 'Gymnase Pasteur' },
  { _id: '3', date: '12', month: 'FÉV', title: 'Nuit du Badminton', type: 'Jeu Libre', location: 'Gymnase Casalis' }
];

const EcoleJeunes = () => {
  // --- ÉTATS ---
  const [schedules, setSchedules] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- RÉCUPÉRATION DES DONNÉES ---
  useEffect(() => {
    setIsLoading(true);
    // On n'appelle QUE les routes qui existent vraiment !
    Promise.all([
      fetch('/api/creneaux').then(res => res.json()).catch(() => ({ data: [] })),
      fetch('/api/team').then(res => res.json()).catch(() => ({ data: [] })),
      fetch('/api/players?team=performance-jeunes').then(res => res.json()).catch(() => ({ data: [] }))
    ])
    .then(([creneauxRes, teamRes, playersRes]) => {
      
      // Filtrage des créneaux "Jeunes"
      if (creneauxRes.success) {
        setSchedules(creneauxRes.data.filter(s => s.type === 'Jeunes'));
      }

      // Filtrage de l'équipe : Toute personne encadrant les "Jeunes"
      if (teamRes.success) {
        const jeunesCoaches = teamRes.data.filter(member => 
          member.trainerRoles && 
          member.trainerRoles.includes('Jeunes')
        );
        
        // Tri par ordre si défini
        jeunesCoaches.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCoaches(jeunesCoaches);
      }

      if (playersRes.success) {
        setPlayers(playersRes.data);
      }
      
      setIsLoading(false);
    })
    .catch(err => {
      console.error("Erreur lors du chargement des données:", err);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="bg-white dark:bg-[#040817] font-['Montserrat'] transition-colors duration-300 min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 lg:px-8 overflow-hidden bg-[#081031] text-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0065FF]/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-[1200px] mx-auto text-center flex flex-col items-center">
          <div className="flex flex-col items-center justify-center p-6 lg:p-8 mb-8 lg:mb-12 transition-colors">
            <div className="flex gap-2 text-[#0EE2E2] mb-4">
              <Star size={40} fill="currentColor" className="drop-shadow-[0_0_15px_rgba(14,226,226,0.5)]" />
              <Star size={48} fill="currentColor" className="drop-shadow-[0_0_15px_rgba(14,226,226,0.5)] -translate-y-2" />
              <Star size={40} fill="currentColor" className="drop-shadow-[0_0_15px_rgba(14,226,226,0.5)]" />
            </div>
            <h1 className="text-5xl md:text-8xl font-[900] italic uppercase tracking-tighter">
              CLUB
            </h1>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EE2E2] to-[#0065FF]">Labellisé 3 Étoiles</p>
          </div>
          <p className="text-sm md:text-lg text-slate-300 font-bold max-w-2xl leading-relaxed">
            Un encadrement de qualité pour vos enfants, du minibad à la compétition. Notre équipe pédagogique diplômée accompagne chaque jeune vers son meilleur niveau.
          </p>
        </div>
      </section>

      {/* 2. CRÉNEAUX D'ENTRAÎNEMENTS EN COLONNES */}
      <section className="py-16 lg:py-24 max-w-[1600px] mx-auto px-6 lg:px-8">
        <div className="mb-10 lg:mb-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-[900] italic uppercase text-[#081031] dark:text-white">
            Créneaux <span className="text-[#0065FF]">Jeunes</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center"><div className="w-10 h-10 border-4 border-[#0065FF] border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {['Lundi', 'Mercredi', 'Jeudi'].map((day) => {
              // On filtre les créneaux pour ne garder que ceux du jour en cours, triés par heure
              const daySessions = schedules
                .filter(s => s.day === day)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));

              return (
                <div key={day} className="flex flex-col gap-5">
                  {/* En-tête du jour (comme sur la page planning) */}
                  <div className="flex items-center gap-3 mb-2 pb-3 border-b-2 border-slate-200 dark:border-white/10">
                    <div className="h-6 w-1.5 bg-[#FFD500] rounded-full" />
                    <h3 className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white tracking-tight">{day}</h3>
                  </div>

                  {/* Liste des cartes du jour */}
                  <div className="flex flex-col gap-4">
                    {daySessions.map((session) => (
                      <ScheduleCard key={session._id} session={session} />
                    ))}
                    
                    {/* Message si aucun créneau ce jour-là */}
                    {daySessions.length === 0 && (
                      <div className="text-slate-400 font-bold uppercase text-[10px] italic py-8 text-center border border-dashed border-slate-200 dark:border-white/5 rounded-[2rem]">
                        Aucun créneau
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. NOS ENTRAÎNEURS JEUNES */}
      <section className="py-16 lg:py-24 bg-slate-50 dark:bg-[#0a0f25] border-y border-slate-100 dark:border-white/5 transition-colors">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="mb-10 lg:mb-16 text-center">
            <h2 className="text-4xl lg:text-5xl font-[900] italic uppercase text-[#081031] dark:text-white">
              Nos <span className="text-[#0EE2E2]">Entraîneurs</span>
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold">L'équipe encadrante de l'école de badminton.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center"><div className="w-10 h-10 border-4 border-[#0EE2E2] border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {coaches.length > 0 ? coaches.map((coach) => (
                // On donne une largeur calculée exacte pour simuler les 3 colonnes de la grille
                <div key={coach._id} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)]">
                  <CoachCard 
                    name={coach.name} 
                    role={coach.role} 
                    diploma={coach.tags && coach.tags.length > 0 ? coach.tags[0] : "Encadrant diplômé"} 
                    img={coach.image}
                    color={coach.color}
                  />
                </div>
              )) : (
                <div className="w-full bg-white dark:bg-[#081031] p-10 rounded-3xl border border-slate-200 dark:border-white/5 text-center shadow-sm">
                   <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">Aucun entraîneur affecté aux jeunes pour le moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 4. PÔLE PERFORMANCE CONNECTÉ À LA BDD */}
      <section className="py-16 lg:py-24 max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="mb-10 lg:mb-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-[900] italic uppercase text-[#081031] dark:text-white">
            Pôle <span className="text-[#0065FF]">Performance</span>
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold">Nos pépites qui brillent au niveau régional et national.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center"><div className="w-10 h-10 border-4 border-[#0065FF] border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {players.length > 0 ? (
              players.map((player) => (
                <div key={player._id} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)]">
                  <PlayerCard 
                    name={player.name} 
                    category={player.category} 
                    rank={player.rank} 
                    titles={player.titles} 
                    img={player.image} 
                    accent={player.accentColor}
                    badge={player.badge} // Maintenant, il affiche ce que tu as tapé dans l'admin !
                  />
                </div>
              ))
            ) : (
              <div className="w-full bg-white dark:bg-[#081031] p-10 rounded-3xl border border-slate-200 dark:border-white/5 text-center shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">
                  Aucun joueur renseigné dans le Pôle Performance pour le moment.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 5. ÉVÉNEMENTS JEUNES */}
      <section className="py-16 lg:py-24 bg-[#081031] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0EE2E2]/10 blur-[100px] rounded-full" />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 relative z-10">
          
          <div className="mb-10 lg:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <h2 className="text-4xl lg:text-5xl font-[900] italic uppercase text-white">
              L'Agenda <span className="text-[#0EE2E2]">Jeunes</span>
            </h2>
            <button className="border-2 border-[#0EE2E2] text-[#0EE2E2] px-6 py-2 rounded-full font-bold uppercase text-xs hover:bg-[#0EE2E2] hover:text-[#081031] transition-all">
              Calendrier complet
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EVENTS_DATA.map((evt) => (
              <EventRow 
                key={evt._id}
                date={evt.date} 
                month={evt.month} 
                title={evt.title} 
                type={evt.type} 
                location={evt.location} 
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

/* --- SOUS-COMPOSANTS --- */

const ScheduleCard = ({ session }) => {
  const iconColor = 'text-[#FFD500]'; 
  const badgeBg = 'bg-[#FFD500]/20'; 
  const badgeText = 'text-[#D4AF37] dark:text-[#FFD500]';

  return (
    <div className="bg-white dark:bg-[#0f172a] border-slate-200 dark:border-white/10 text-[#081031] dark:text-white shadow-sm group relative p-6 rounded-[2rem] transition-all border hover:-translate-y-1 hover:shadow-xl">
      
      {/* BADGE HAUT GAUCHE (Titre seul) */}
      <div className="flex justify-between items-start mb-5">
        <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${badgeBg} ${badgeText}`}>
          {session.title || 'Jeunes'}
        </span>
      </div>
      
      <div className="space-y-3">
        {/* HEURE */}
        <div className="flex items-center gap-3">
          <Clock size={18} className={iconColor} />
          <span className="font-[900] italic text-2xl leading-none tracking-tight">{session.startTime} - {session.endTime}</span>
        </div>
        
        {/* GYMNASE */}
        <div className="flex items-center gap-3 opacity-70">
          <MapPin size={18} />
          <span className="font-bold text-sm uppercase tracking-wider truncate">{session.gymnasium}</span>
        </div>

        {/* COACH */}
        {session.coach && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
            <User size={16} className={iconColor} />
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Coach: {session.coach}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const CoachCard = ({ name, role, diploma, img, color }) => (
  <div className="bg-white dark:bg-[#0f172a] rounded-[1.5rem] p-4 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all group flex items-center gap-4">
    
    {/* Petite image circulaire */}
    <div 
      className="w-16 h-16 shrink-0 rounded-full overflow-hidden border-2 relative" 
      style={{ borderColor: color || '#0EE2E2' }}
    >
      <div className="absolute inset-0 bg-[#081031]/5 group-hover:bg-transparent transition-colors z-10" />
      {img ? (
        <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      ) : (
        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
           <User size={24} />
        </div>
      )}
    </div>
    
    {/* Informations (Alignées à droite de l'image) */}
    <div className="flex-1 min-w-0">
      <h3 className="text-lg font-[900] uppercase italic text-[#081031] dark:text-white truncate mb-0.5">{name}</h3>
      <div className="font-black text-[9px] uppercase tracking-widest mb-1.5" style={{ color: color || '#0065FF' }}>{role}</div>
      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider truncate">
        <Award size={12} style={{ color: color || '#0065FF' }} /> {diploma}
      </div>
    </div>

  </div>
);

const PlayerCard = ({ name, category, rank, titles, img, accent, badge }) => (
  <div className="relative bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 border border-slate-100 dark:border-white/5 shadow-sm hover:-translate-y-2 transition-transform duration-300">
    {badge && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F72585] to-[#ff4d9a] text-white px-4 py-1.5 rounded-full font-[900] uppercase text-[10px] tracking-widest shadow-lg shadow-[#F72585]/30 z-20 whitespace-nowrap animate-bounce">
        {badge}
      </div>
    )}
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full p-1 mb-4" style={{ background: `linear-gradient(135deg, ${accent}, transparent)` }}>
        <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-[#0f172a]">
          {img ? (
            <img src={img} alt={name} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700"><User size={32}/></div>
          )}
        </div>
      </div>
      <h3 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white mb-1">{name}</h3>
      <div className="text-sm font-bold text-slate-400 mb-4">{category}</div>
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Classement</span>
          <span className="font-[900] text-sm" style={{ color: accent }}>{rank}</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1"><Trophy size={12} /> Palmarès</span>
          <span className="font-bold text-xs text-[#081031] dark:text-white text-right max-w-[120px] truncate">{titles}</span>
        </div>
      </div>
    </div>
  </div>
);

const EventRow = ({ date, month, title, type, location }) => (
  <div className="group flex items-center gap-4 p-4 rounded-[1.2rem] bg-white/5 border border-white/10 hover:bg-[#0065FF]/20 hover:border-[#0065FF]/50 transition-all cursor-pointer">
    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#0A266D] flex flex-col justify-center items-center group-hover:bg-[#0EE2E2] transition-colors">
      <span className="text-xl font-[900] text-white group-hover:text-[#081031] leading-none mb-0.5">{date}</span>
      <span className="text-[9px] font-bold text-[#0EE2E2] group-hover:text-[#081031] uppercase">{month}</span>
    </div>
    <div className="flex-grow min-w-0">
      <div className="text-[#0EE2E2] font-bold text-[9px] uppercase mb-1 truncate">{type}</div>
      <h4 className="text-sm font-[900] italic text-white mb-1 truncate">{title}</h4>
      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold truncate">
        <MapPin size={10} className="shrink-0" /> <span className="truncate">{location}</span>
      </div>
    </div>
  </div>
);

export default EcoleJeunes;