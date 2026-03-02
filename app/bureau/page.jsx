'use client';
import React, { useState } from 'react';
import { Mail, User, FileText, Download, ChevronRight } from 'lucide-react';

export default function LeClubPublic() {
  const [activeTab, setActiveTab] = useState('membres');

  // Ces données viendront de fetch('/api/board') plus tard
  const members = [
    { _id: '1', nom: 'LEFEBVRE', prenom: 'Thomas', role: 'Président', mail: 'president@uscreteil-bad.com' },
    { _id: '2', nom: 'DUBOIS', prenom: 'Julie', role: 'Secrétaire', mail: 'secretariat@uscreteil-bad.com' },
  ];

  return (
    <div className="min-h-screen bg-white font-['Montserrat']">
      {/* HERO SECTION */}
      <section className="bg-[#081031] pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0065FF] opacity-10 blur-[100px] rounded-full"></div>
        <h1 className="text-5xl md:text-7xl font-[900] italic uppercase text-white mb-6">
          L'organisation <span className="text-[#0EE2E2]">du Club</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto font-bold uppercase tracking-widest text-sm">
          Découvrez l'équipe bénévole qui fait vivre l'US Créteil Badminton.
        </p>
      </section>

      {/* TABS SWITCHER */}
      <div className="flex justify-center -mt-8 relative z-10 px-4">
        <div className="bg-white p-2 rounded-[2rem] shadow-2xl flex gap-2 border border-slate-100">
          <button 
            onClick={() => setActiveTab('membres')}
            className={`px-8 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest transition-all ${activeTab === 'membres' ? 'bg-[#0065FF] text-white' : 'text-slate-400 hover:text-[#081031]'}`}
          >
            Le Bureau
          </button>
          <button 
            onClick={() => setActiveTab('cr')}
            className={`px-8 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest transition-all ${activeTab === 'cr' ? 'bg-[#0065FF] text-white' : 'text-slate-400 hover:text-[#081031]'}`}
          >
            Comptes-rendus
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-20">
        {activeTab === 'membres' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {members.map((m) => (
              <div key={m._id} className="text-center group">
                <div className="w-48 h-48 mx-auto mb-6 bg-slate-100 rounded-[3rem] rotate-3 group-hover:rotate-6 transition-transform flex items-center justify-center border-4 border-[#0EE2E2]/20 relative overflow-hidden">
                   <User size={80} className="text-slate-300" />
                   {/* Overlay Déco */}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0065FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-2xl font-[900] uppercase italic text-[#081031] leading-none mb-2">{m.prenom} <br/><span className="text-[#0065FF]">{m.nom}</span></h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0EE2E2] mb-4">{m.role}</p>
                <a href={`mailto:${m.mail}`} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0065FF] transition-colors">
                  <Mail size={14} /> {m.mail}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="bg-blue-50 p-6 rounded-3xl mb-10 flex items-center gap-4">
              <div className="bg-[#0065FF] p-3 rounded-2xl text-white"><FileText size={24} /></div>
              <p className="text-sm font-bold text-[#081031]">Retrouvez ici tous les procès-verbaux des Assemblées Générales et des réunions de bureau.</p>
            </div>
            
            {/* Liste des documents */}
            {['AG Ordinaire 2025', 'Réunion Bureau n°4'].map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-white border-2 border-slate-50 rounded-[2rem] hover:border-[#0EE2E2]/30 transition-all">
                <div className="flex items-center gap-4">
                  <span className="text-slate-300 font-black italic text-2xl">0{i+1}</span>
                  <span className="font-[900] uppercase italic text-[#081031] tracking-tight">{doc}</span>
                </div>
                <button className="bg-[#081031] text-white p-4 rounded-2xl hover:bg-[#0065FF] transition-all">
                  <Download size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}