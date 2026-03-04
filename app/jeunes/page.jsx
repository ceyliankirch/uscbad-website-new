'use client';

import React, { useState, useEffect } from 'react';
import { Star, Clock, MapPin, Trophy, Award } from 'lucide-react';

const EcoleJeunes = () => {
  // --- 1. ÉTATS POUR STOCKER LES DONNÉES DE LA BDD ---
  const [schedules, setSchedules] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- 2. RÉCUPÉRATION DES DONNÉES (FETCH) ---
  useEffect(() => {
    // On lance toutes les requêtes en même temps pour plus de rapidité
    Promise.all([
      fetch('/api/schedules?type=jeunes').then(res => res.json()).catch(() => ({ data: [] })),
      fetch('/api/coaches?team=jeunes').then(res => res.json()).catch(() => ({ data: [] })),
      fetch('/api/players?pole=performance').then(res => res.json()).catch(() => ({ data: [] })),
      fetch('/api/events?category=jeunes').then(res => res.json()).catch(() => ({ data: [] }))
    ])
    .then(([schedulesRes, coachesRes, playersRes, eventsRes]) => {
      // On met à jour les états si la requête a réussi
      if (schedulesRes.data) setSchedules(schedulesRes.data);
      if (coachesRes.data) setCoaches(coachesRes.data);
      if (playersRes.data) setPlayers(playersRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
      setIsLoading(false);
    })
    .catch(err => {
      console.error("Erreur globale lors du chargement des données:", err);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="bg-white dark:bg-[#040817] font-['Montserrat'] transition-colors duration-300 min-h-screen pb-20">
      
      {/* 1. HERO SECTION (Fixe) */}
      <section className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 lg:px-8 overflow-hidden bg-[#081031] text-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0065FF]/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-[1200px] mx-auto text-center flex flex-col items-center">
          <div className="flex flex-col items-center justify-center p-6 lg:p-8 bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl shadow-2xl mb-8 lg:mb-12 hover:bg-white/10 transition-colors">
            <div className="flex gap-2 text-[#0EE2E2] mb-4">
              <Star size={40} fill="currentColor" className="drop-shadow-[0_0_15px_rgba(14,226,226,0.5)]" />
              <Star size={48} fill="currentColor" className="drop-shadow-[0_0_15px_rgba(14,226,226,0.5)] -translate-y-2" />
              <Star size={40} fill="currentColor" className="drop-shadow-[0_0_15px_rgba(14,226,226,0.5)]" />
            </div>
            <div className="text-[#0EE2E2] font-[900] tracking-widest uppercase text-xs lg:text-sm mb-2">
              Fédération Française de Badminton
            </div>
            <h1 className="text-3xl md:text-5xl font-[900] italic uppercase tracking-tighter">
              École de Badminton <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EE2E2] to-[#0065FF]">Labellisée 3 Étoiles</span>
            </h1>
          </div>
          <p className="text-sm md:text-lg text-slate-300 font-bold max-w-2xl leading-relaxed">
            Un encadrement de qualité pour vos enfants, du minibad à la compétition. Notre équipe pédagogique diplômée accompagne chaque jeune vers son meilleur niveau.
          </p>
        </div>
      </section>

      {/* 2. CRÉNEAUX D'ENTRAÎNEMENTS (Dynamique) */}
      <section className="py-16 lg:py-24 max-w-[1600px] mx-auto px-6 lg:px-8">
        <div className="mb-10 lg:mb-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-[900] italic uppercase text-[#081031] dark:text-white">
            Créneaux <span className="text-[#0065FF]">Jeunes</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center"><div className="w-10 h-10 border-4 border-[#0065FF] border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {schedules.length > 0 ? schedules.map((schedule) => (
              <ScheduleCard 
                key={schedule._id} 
                day={schedule.day} 
                time={schedule.time} 
                level={schedule.level} 
                gym={schedule.gym} 
              />
            )) : (
              <p className="text-center col-span-full text-slate-500">Aucun créneau disponible pour le moment.</p>
            )}
          </div>
        )}
      </section>

      {/* 3. NOS ENTRAÎNEURS JEUNES (Dynamique) */}
      <section className="py-16 lg:py-24 bg-slate-50 dark:bg-[#0a0f25] border-y border-slate-100 dark:border-white/5 transition-colors">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="mb-10 lg:mb-16 text-center">
            <h2 className="text-4xl lg:text-5xl font-[900] italic uppercase text-[#081031] dark:text-white">
              Nos <span className="text-[#0EE2E2]">Entraîneurs</span>
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold">Une équipe encadrante diplômée et passionnée.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center"><div className="w-10 h-10 border-4 border-[#0EE2E2] border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coaches.length > 0 ? coaches.map((coach) => (
                <CoachCard 
                  key={coach._id} 
                  name={coach.name} 
                  role={coach.role} 
                  diploma={coach.diploma} 
                  img={coach.image} 
                />
              )) : (
                <p className="text-center col-span-full text-slate-500">Aucun entraîneur renseigné pour le moment.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 4. PÔLE PERFORMANCE (Dynamique) */}
      <section className="py-16 lg:py-24 max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="mb-10 lg:mb-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-[900] italic uppercase text-[#081031] dark:text-white">
            Pôle <span className="text-[#0065FF]">Performance</span>
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold">Nos pépites qui brillent au niveau régional et national.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center"><div className="w-10 h-10 border-4 border-[#F72585] border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {players.length > 0 ? players.map((player) => (
              <PlayerCard 
                key={player._id}
                name={player.name} 
                category={player.category} 
                rank={player.rank} 
                titles={player.titles} 
                img={player.image} 
                accent={player.accentColor || "#0065FF"} // Fallback color
                badge={player.isFutureChamp ? "Future Championne 🏆" : null}
              />
            )) : (
              <p className="text-center col-span-full text-slate-500">Aucun joueur dans le pôle performance actuellement.</p>
            )}
          </div>
        )}
      </section>

      {/* 5. ÉVÉNEMENTS JEUNES (Dynamique) */}
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

          {isLoading ? (
            <div className="flex justify-center"><div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.length > 0 ? events.map((evt) => (
                <EventRow 
                  key={evt._id}
                  date={evt.date} 
                  month={evt.month} 
                  title={evt.title} 
                  type={evt.type} 
                  location={evt.location} 
                />
              )) : (
                <p className="text-center col-span-full text-slate-400">Aucun événement à venir.</p>
              )}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

/* --- SOUS-COMPOSANTS (inchangés, ils reçoivent les props de la DB) --- */

const ScheduleCard = ({ day, time, level, gym }) => (
  <div className="bg-slate-50 dark:bg-[#0f172a] p-6 lg:p-8 rounded-[1.5rem] border border-slate-200 dark:border-white/5 hover:border-[#0065FF] dark:hover:border-[#0EE2E2] transition-colors group">
    <div className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white mb-4 group-hover:text-[#0065FF] dark:group-hover:text-[#0EE2E2] transition-colors">{day}</div>
    <div className="flex items-center gap-2 text-[#0065FF] dark:text-[#0EE2E2] font-bold text-sm mb-2">
      <Clock size={16} /> {time}
    </div>
    <div className="text-slate-600 dark:text-slate-300 font-[900] text-sm uppercase tracking-wide mb-4">{level}</div>
    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold pt-4 border-t border-slate-200 dark:border-white/10">
      <MapPin size={14} /> {gym}
    </div>
  </div>
);

const CoachCard = ({ name, role, diploma, img }) => (
  <div className="bg-white dark:bg-[#040817] rounded-[1.5rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group">
    <div className="aspect-square bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#081031]/10 group-hover:bg-transparent transition-colors z-10" />
      <img src={img || "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop"} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>
    <div className="p-6 text-center">
      <h3 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white mb-1">{name}</h3>
      <div className="text-[#0065FF] dark:text-[#0EE2E2] font-bold text-xs uppercase tracking-widest mb-3">{role}</div>
      <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-white/5 rounded-full text-slate-500 dark:text-slate-400 text-[10px] font-bold">
        <Award size={12} /> {diploma}
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
          <img src={img || "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400&auto=format&fit=crop"} alt={name} className="w-full h-full object-cover" />
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