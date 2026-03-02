'use client';
import React, { useState } from 'react';
import { Clock, MapPin, Zap, GraduationCap, Users, User } from 'lucide-react';

const PlanningPage = () => {
  const [activeTab, setActiveTab] = useState('entraînement');

  // DONNÉES ENTRAÎNEMENTS
  const trainingData = [
    { day: 'Lundi', sessions: [
      { type: 'Jeunes', title: "Bad Pouss'", time: '17h00 - 18h30', gym: 'M.T.E.', coach: 'Julie' },
      { type: 'Jeunes', title: "Espoirs", time: '19h00 - 20h30', gym: 'Pasteur', coach: 'Thomas' },
      { type: 'Adultes', title: "Équipes 1/2/3", time: '20h30 - 22h30', gym: 'STAPS', coach: 'Sébastien' }
    ]},
    { day: 'Mardi', sessions: [
      { type: 'Adultes', title: "Équipes 4/5", time: '21h00 - 23h00', gym: 'STAPS', coach: 'Thomas' },
      { type: 'Adultes', title: "Équipes 6/7/8", time: '20h00 - 22h00', gym: 'Schweitzer', coach: 'Benoît' }
    ]},
    { day: 'Mercredi', sessions: [
      { type: 'Jeunes', title: "Bad Pouss'", time: '18h00 - 19h30', gym: 'Nelson Paillou', coach: 'Julie' },
      { type: 'Jeunes', title: "Non Compet", time: '18h00 - 19h30', gym: 'Pasteur', coach: 'Thomas' },
      { type: 'Jeunes', title: "Espoirs", time: '19h30 - 21h00', gym: 'Pasteur', coach: 'Thomas' },
      { type: 'Adultes', title: "Débouillés", time: '19h30 - 21h00', gym: 'Nelson Paillou', coach: 'Benoît' },
      { type: 'Adultes', title: "Confirmés", time: '21h00 - 22h30', gym: 'Nelson Paillou', coach: 'Benoît' }
    ]},
    { day: 'Jeudi', sessions: [
      { type: 'Jeunes', title: "Non Compet", time: '18h30 - 20h00', gym: 'Jeu de Paume', coach: 'Thomas' },
      { type: 'Jeunes', title: "Compet", time: '17h45 - 19h00', gym: 'Jeu de Paume', coach: 'Thomas' },
      { type: 'Jeunes', title: "Espoirs", time: '19h00 - 20h30', gym: 'Jeu de Paume', coach: 'Thomas' },
      { type: 'Adultes', title: "Équipes 1/2/3", time: '20h30 - 22h30', gym: 'STAPS', coach: 'Sébastien' }
    ]},
    { day: 'Vendredi', sessions: [
      { type: 'Adultes', title: "Indivs", time: '20h30 - 22h30', gym: 'Pasteur', coach: 'Libre' },
      { type: 'Adultes', title: "Débutants", time: '21h00 - 22h30', gym: 'Pasteur', coach: 'Julie' }
    ]}
  ];

  const freePlayData = [
    { day: 'Lundi', sessions: [{ type: 'Public', title: 'Jeu Libre / IC', time: '20h30 - 22h30', gym: 'Jeu de Paume' }] },
    { day: 'Mardi', sessions: [{ type: 'Public', title: 'Jeu Libre', time: '21h00 - 22h30', gym: 'Jeu de Paume' }] },
    { day: 'Jeudi', sessions: [{ type: 'Public', title: 'Jeu Libre', time: '20h30 - 22h30', gym: 'Jeu de Paume' }] },
    { day: 'Vendredi', sessions: [{ type: 'Public', title: 'Jeu Libre', time: '20h30 - 22h30', gym: 'Pasteur' }] },
    { day: 'Samedi', sessions: [
        { type: 'Public', title: 'Jeu Libre', time: '12h00 - 14h00', gym: 'Jeu de Paume' },
        { type: 'Public', title: 'Jeu Libre', time: '18h00 - 20h00', gym: 'Jeu de Paume' }
    ]}
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#040817] pt-32 pb-20 px-6 font-['Montserrat'] transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl lg:text-7xl font-[900] italic uppercase text-[#081031] dark:text-white leading-none mb-8 tracking-tighter">
            Planning <span className="text-[#0065FF] dark:text-[#0EE2E2]">US Créteil</span>
          </h1>
          
          <div className="inline-flex p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner">
            <button 
              onClick={() => setActiveTab('entraînement')}
              className={`px-8 py-3 rounded-xl font-[900] uppercase text-xs transition-all ${activeTab === 'entraînement' ? 'bg-[#0065FF] text-white shadow-lg' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
            >
              Entraînements
            </button>
            <button 
              onClick={() => setActiveTab('jeu-libre')}
              className={`px-8 py-3 rounded-xl font-[900] uppercase text-xs transition-all ${activeTab === 'jeu-libre' ? 'bg-[#0065FF] text-white shadow-lg' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
            >
              Jeu Libre
            </button>
          </div>
        </div>

        {/* LÉGENDE */}
        {activeTab === 'entraînement' && (
          <div className="flex justify-center gap-6 mb-10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#081031] dark:bg-[#0EE2E2]" />
              <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">Section Jeunes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-50 border border-blue-100" />
              <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">Section Adultes</span>
            </div>
          </div>
        )}

        {/* GRID PLANNING */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {(activeTab === 'entraînement' ? trainingData : freePlayData).map((day, idx) => (
            <div key={idx} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 bg-[#0EE2E2] rounded-full" />
                <h2 className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white">{day.day}</h2>
              </div>
              {day.sessions.map((session, sIdx) => (
                <SessionCard key={sIdx} session={session} />
              ))}
            </div>
          ))}
        </div>

        {/* GYMNASES SECTION */}
        <div className="mt-20">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-3xl font-[900] italic uppercase text-[#081031] dark:text-white">
              Nos <span className="text-[#0065FF]">Gymnases</span>
            </h3>
            <div className="flex-grow h-px bg-slate-200 dark:bg-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GymCard name="Jeu de Paume" address="Rue du Jeu de Paume, 94000 Créteil" />
            <GymCard name="STAPS" address="27 Avenue Magellan, 94000 Créteil" />
            <GymCard name="Nelson Paillou" address="14 Rue des Sarrazins, 94000 Créteil" />
            <GymCard name="Albert Schweitzer" address="Rue Georges Sand, 94000 Créteil" />
            <GymCard name="Louis Pasteur" address="10 Rue Henri Matisse, 94000 Créteil" />
            <GymCard name="Marie Thérèse Eyquem" address="6 Rue Thomas Edison, 94000 Créteil" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SOUS-COMPOSANTS --- */

const SessionCard = ({ session }) => {
  const isJeunes = session.type === 'Jeunes';
  
  return (
    <div className={`p-5 rounded-[2rem] transition-all hover:-translate-y-1 border ${
      isJeunes 
        ? 'bg-[#081031] border-[#0EE2E2]/30 text-white shadow-xl shadow-[#081031]/10' 
        : 'bg-blue-50/50 dark:bg-[#0f172a] border-blue-100/50 dark:border-white/10 text-[#081031] dark:text-white'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
          isJeunes ? 'bg-[#0EE2E2] text-[#081031]' : 'bg-[#0065FF] text-white'
        }`}>
          {session.title}
        </span>
        {isJeunes ? <GraduationCap size={16} className="text-[#0EE2E2]" /> : <Users size={16} className="text-[#0065FF]" />}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <Clock size={15} className={isJeunes ? 'text-[#0EE2E2]' : 'text-[#0065FF]'} />
          <span className="font-[900] italic text-lg leading-none tracking-tight">{session.time}</span>
        </div>
        <div className="flex items-center gap-2.5 opacity-60">
          <MapPin size={13} />
          <span className="font-bold text-[10px] uppercase tracking-wider truncate">{session.gym}</span>
        </div>
        
        {session.coach && (
          <div className={`mt-3 pt-3 border-t flex items-center gap-2 ${isJeunes ? 'border-white/10' : 'border-[#081031]/5 dark:border-white/5'}`}>
            <User size={12} className={isJeunes ? 'text-[#0EE2E2]' : 'text-[#0065FF]'} />
            <span className={`text-[10px] font-black uppercase tracking-tighter ${isJeunes ? 'text-slate-400' : 'text-slate-500'}`}>
              Coach: {session.coach}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const GymCard = ({ name, address }) => (
  <div className="bg-slate-50 dark:bg-[#081031] p-6 rounded-3xl border border-slate-200 dark:border-white/5 flex items-start gap-4 group hover:border-[#0EE2E2] transition-all duration-300">
    <div className="bg-[#0065FF] p-3 rounded-2xl text-white group-hover:bg-[#0EE2E2] group-hover:text-[#081031] transition-colors shadow-lg shadow-[#0065FF]/10">
      <MapPin size={20} />
    </div>
    <div>
      <h4 className="font-[900] uppercase italic text-sm text-[#081031] dark:text-white mb-1">{name}</h4>
      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-tight">{address}</p>
    </div>
  </div>
);

export default PlanningPage;