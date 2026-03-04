'use client';
import React, { useState, useEffect } from 'react';
import { 
  Clock, MapPin, User, Trophy, Calendar, Star, 
  ArrowRight, Award, Zap, Loader2, ChevronRight, Info 
} from 'lucide-react';

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function JeunesPage() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCreneaux = async () => {
      try {
        const res = await fetch('/api/creneaux');
        const data = await res.json();
        if (data.success) {
          // On ne garde que les créneaux typés "Jeunes"
          setSessions(data.data.filter(s => s.type === 'Jeunes'));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCreneaux();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#040817] pt-32 lg:pt-48 pb-24 font-['Montserrat']">
      
      {/* --- HERO SECTION --- */}
      <section className="max-w-[1600px] mx-auto px-6 mb-20 text-center lg:text-left lg:flex items-center gap-12">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2 bg-[#FFD500]/10 text-[#D4AF37] dark:text-[#FFD500] px-4 py-2 rounded-full mb-6">
            <Zap size={16} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-widest">Génération US Créteil</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-[900] italic uppercase text-[#081031] dark:text-white leading-[0.9] mb-8 tracking-tighter">
            L'école de <br /><span className="text-[#0065FF]">Badminton</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm lg:text-base max-w-xl leading-relaxed uppercase tracking-wide">
            De l'initiation à l'excellence. Nous formons les champions de demain dans une ambiance conviviale et dynamique au cœur du Val-de-Marne.
          </p>
        </div>
        <div className="hidden lg:grid lg:w-1/2 grid-cols-2 gap-4">
            <div className="bg-[#0065FF] h-64 rounded-[3rem] shadow-2xl flex items-end p-8 text-white relative overflow-hidden group">
                <Trophy className="absolute -top-10 -right-10 w-40 h-40 opacity-10 group-hover:rotate-12 transition-transform" />
                <h3 className="text-3xl font-[900] italic uppercase leading-none">Compétition<br/>Elite</h3>
            </div>
            <div className="bg-[#FFD500] h-64 rounded-[3rem] shadow-2xl mt-12 flex items-end p-8 text-[#081031]">
                <Star className="absolute top-10 right-10 w-12 h-12" fill="#081031" />
                <h3 className="text-3xl font-[900] italic uppercase leading-none">Pédagogie<br/>Expert</h3>
            </div>
        </div>
      </section>

      {/* --- PLANNING JEUNES --- */}
      <section className="max-w-[1600px] mx-auto px-6 mb-32">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-10 w-2 bg-[#FFD500] rounded-full" />
          <h2 className="text-4xl font-[900] italic uppercase text-[#081031] dark:text-white">Créneaux <span className="text-[#FFD500]">Entraînements</span></h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#FFD500]" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {days.map(day => {
              const daySessions = sessions.filter(s => s.day === day).sort((a,b) => a.startTime.localeCompare(b.startTime));
              return (
                <div key={day} className="space-y-4">
                  <div className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 text-center">
                    <h4 className="font-black uppercase text-xs tracking-tighter dark:text-white">{day}</h4>
                  </div>
                  {daySessions.map(s => (
                    <div key={s._id} className="bg-white dark:bg-[#0f172a] p-5 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock size={14} className="text-[#FFD500]" />
                        <span className="font-black italic text-sm dark:text-white">{s.startTime} - {s.endTime}</span>
                      </div>
                      <h5 className="font-black uppercase text-[10px] dark:text-[#FFD500] mb-2">{s.title || "Jeunes"}</h5>
                      <div className="flex items-center gap-2 opacity-50 text-[9px] font-bold uppercase tracking-widest truncate dark:text-white">
                        <MapPin size={10} /> {s.gymnasium}
                      </div>
                    </div>
                  ))}
                  {daySessions.length === 0 && <div className="h-20 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[2rem]" />}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* --- CALENDRIER TOURNOIS & ÉVÉNEMENTS --- */}
      <section className="max-w-[1600px] mx-auto px-6 mb-32 grid lg:grid-cols-2 gap-16">
        
        {/* TOURNOIS CDJ / TLJ */}
        <div className="bg-[#081031] rounded-[4rem] p-10 lg:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10"><Trophy size={200} /></div>
          <h2 className="text-4xl font-[900] italic uppercase mb-10 relative">Calendrier <br /><span className="text-[#FFD500]">Compétition</span></h2>
          
          <div className="space-y-6 relative">
            {[
              { label: 'CDJ', full: 'Critérium Départemental Jeunes', color: '#FFD500' },
              { label: 'TLJ', full: 'Trophée Local Jeunes', color: '#0EE2E2' },
              { label: 'France', full: 'Championnats de France Jeunes', color: '#0065FF' }
            ].map((tournoi, i) => (
              <div key={i} className="flex items-center gap-6 group cursor-pointer border-b border-white/10 pb-6 last:border-0">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black italic text-xl shrink-0" style={{ backgroundColor: tournoi.color, color: tournoi.color === '#FFD500' ? '#081031' : 'white' }}>
                  {tournoi.label}
                </div>
                <div className="flex-1">
                  <h4 className="font-black uppercase text-sm tracking-widest">{tournoi.full}</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Saison 2024 - 2025</p>
                </div>
                <ChevronRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* ÉVÉNEMENTS CLUB */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-2 bg-[#0EE2E2] rounded-full" />
            <h2 className="text-4xl font-[900] italic uppercase text-[#081031] dark:text-white">Vie du <span className="text-[#0EE2E2]">Club</span></h2>
          </div>
          
          {[
            { title: 'Stage de la Toussaint', date: 'Octobre 2024', desc: 'Perfectionnement intensif sur 5 jours avec nos coachs experts.' },
            { title: 'Fête de Noël Jeunes', date: 'Décembre 2024', desc: 'Tournois ludiques, goûter et surprises pour tous nos jeunes adhérents.' },
            { title: 'Nuit du Badminton', date: 'Février 2025', desc: 'Une soirée exceptionnelle de jeu libre en musique et déguisé.' }
          ].map((event, i) => (
            <div key={i} className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 group hover:bg-[#0065FF] transition-all">
              <div className="flex justify-between items-start mb-4">
                <Calendar className="text-[#0EE2E2] group-hover:text-white" />
                <span className="text-[10px] font-black uppercase text-[#0EE2E2] group-hover:text-white/80">{event.date}</span>
              </div>
              <h4 className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white group-hover:text-white mb-2">{event.title}</h4>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 group-hover:text-white/70 leading-relaxed uppercase tracking-wide">{event.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- POLE PERFORMANCE --- */}
      <section className="bg-gradient-to-br from-[#0065FF] to-[#081031] py-24 px-6 overflow-hidden">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-[900] italic uppercase text-white leading-none tracking-tighter">
              Pôle <span className="text-[#FFD500]">Performance</span>
            </h2>
            <p className="text-[#FFD500] font-black uppercase text-xs tracking-[0.3em] mt-4">L'élite de l'US Créteil Jeunes</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[3rem] p-8 text-white relative group hover:-translate-y-4 transition-all">
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#FFD500] rounded-full flex items-center justify-center text-[#081031] font-black italic shadow-xl">
                  #{i}
                </div>
                <div className="w-32 h-32 bg-white/20 rounded-full mb-6 mx-auto overflow-hidden border-4 border-[#FFD500]">
                  {/* Photo Joueur placeholder */}
                  <div className="w-full h-full flex items-center justify-center opacity-30"><User size={48} /></div>
                </div>
                <h4 className="text-center font-black uppercase italic text-xl mb-1">Elite Player {i}</h4>
                <p className="text-center text-[#FFD500] font-black uppercase text-[10px] mb-6">Série N2 / U17</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase opacity-60">
                    <span>Palmarès :</span>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-tighter bg-white/5 p-3 rounded-xl border border-white/5">
                    Vainqueur CDJ #3 <br /> Top 16 France Jeunes
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <button className="bg-white text-[#081031] px-12 py-5 rounded-2xl font-[900] uppercase text-sm tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-2xl">
              Rejoindre l'élite <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* --- INFOS PRATIQUES --- */}
      <section className="max-w-4xl mx-auto px-6 mt-32">
        <div className="bg-white dark:bg-[#0f172a] rounded-[3rem] p-10 lg:p-16 border border-slate-200 dark:border-white/5 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <Info size={32} className="text-[#0065FF]" />
            <h2 className="text-3xl font-[900] italic uppercase text-[#081031] dark:text-white">Infos <span className="text-[#0065FF]">Pratiques</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h5 className="font-black uppercase text-xs mb-4 text-[#0065FF]">Inscriptions</h5>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase leading-relaxed leading-relaxed">
                Les dossiers d'inscription sont à retirer au club ou à télécharger sur le site. Une séance d'essai est offerte pour tous les nouveaux jeunes (en Septembre).
              </p>
            </div>
            <div>
              <h5 className="font-black uppercase text-xs mb-4 text-[#0065FF]">Matériel</h5>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase leading-relaxed">
                Le club prête des raquettes pour les débutants. Chaussures de salle propres (semelles non marquantes) obligatoires.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}