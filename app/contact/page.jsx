'use client';
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Info, Trophy, Heart, ChevronRight } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Général',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulaire envoyé :', formData);
    // Ici, logique d'envoi (API, EmailJS, etc.)
  };

  return (
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300 pb-20 overflow-hidden">
      
      {/* =========================================================
        SECTION 1 : HERO SOMBRE (Correction du chevauchement)
        ========================================================= */}
    <section className="relative w-full pt-32 pb-32 lg:pt-40 lg:pb-48 flex flex-col justify-center items-center text-center overflow-hidden bg-[#081031]">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-[#0065FF] rounded-full blur-[150px] opacity-20 pointer-events-none z-0"></div>

    <div className="relative z-20 px-6 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0065FF]/20 border border-[#0065FF]/50 text-[#0EE2E2] rounded-full font-[900] uppercase text-[10px] tracking-widest italic mb-6 shadow-lg backdrop-blur-md">
        <MessageCircle size={14} /> Une question ?
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-[900] uppercase italic tracking-tighter leading-[0.9] text-white drop-shadow-xl mb-8">
        CONTACTEZ <span className="text-[#0EE2E2]">NOUS !</span>
        </h1>
        {/* On s'assure que le texte a une marge en bas suffisante */}
        <p className="text-sm lg:text-lg font-bold text-slate-300 leading-relaxed max-w-2xl mx-auto mb-4">
        Que vous soyez futur adhérent, partenaire ou club adverse, notre équipe est là pour vous répondre dans les plus brefs délais.
        </p>
    </div>
    </section>

      {/* =========================================================
          SECTION 2 : CARTES DE CONTACT RAPIDE
          ========================================================= */}
      <section className="relative z-30 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-12 lg:-mt-20 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <ContactCard 
            icon={<Info className="text-[#0065FF]" />} 
            title="Inscriptions"
            desc="Questions sur les licences, tarifs et documents administratifs."
            contact="secretariat@uscbad.fr"
            color="border-[#0065FF]"
          />
          
          <ContactCard 
            icon={<Trophy className="text-[#F72585]" />} 
            title="Sportif & Compétition"
            desc="Interclubs, tournois et entraînements dirigés."
            contact="sportif@uscbad.fr"
            color="border-[#F72585]"
          />
          
          <ContactCard 
            icon={<Heart className="text-[#FFD500]" />} 
            title="Partenariats"
            desc="Devenir sponsor ou proposer une collaboration avec le club."
            contact="com@uscbad.fr"
            color="border-[#FFD500]"
          />

        </div>
      </section>

      {/* =========================================================
          SECTION 3 : FORMULAIRE ET ACCÈS
          ========================================================= */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* FORMULAIRE */}
        <div className="bg-slate-50 dark:bg-[#0f172a] rounded-[3rem] p-8 lg:p-12 border border-slate-200 dark:border-white/5">
          <h2 className="text-3xl font-[900] uppercase italic text-[#081031] dark:text-white mb-8">
            Envoyez un <span className="text-[#0065FF]">Message</span>
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Nom complet</label>
                <input 
                  type="text" 
                  placeholder="Jean Dupont"
                  className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#0065FF] transition-colors dark:text-white"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email</label>
                <input 
                  type="email" 
                  placeholder="jean@email.com"
                  className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#0065FF] transition-colors dark:text-white"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Sujet de la demande</label>
              <select 
                className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#0065FF] transition-colors appearance-none dark:text-white"
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              >
                <option>Général</option>
                <option>Inscription / Licence</option>
                <option>Compétition / Interclubs</option>
                <option>Presse / Partenariat</option>
                <option>Autre</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Message</label>
              <textarea 
                rows="5"
                placeholder="Votre message ici..."
                className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#0065FF] transition-colors dark:text-white resize-none"
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#0065FF] text-white py-5 rounded-2xl font-[900] uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-[#081031] dark:hover:bg-white dark:hover:text-[#081031] transition-all group"
            >
              Envoyer la demande <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* ACCÈS ET GYMNASES */}
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-[900] uppercase italic text-[#081031] dark:text-white mb-4">
            Où nous <span className="text-[#0EE2E2]">Trouver ?</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-10">
            Le club évolue principalement sur deux complexes sportifs à Créteil. Voici les adresses pour vos rencontres ou vos entraînements.
          </p>

          <div className="space-y-8">
            <LocationItem 
              name="Gymnase Casalis"
              address="2 Rue de la Côte d'Or, 94000 Créteil"
              desc="Gymnase principal pour les rencontres de Nationale 1 et les tournois."
            />
            <LocationItem 
              name="Gymnase Nelson Mandela"
              address="Rue d'Ouessant, 94000 Créteil"
              desc="Centre principal pour l'école de jeunes et les créneaux loisirs."
            />
          </div>

          <div className="mt-12 p-8 bg-[#0065FF]/5 dark:bg-[#0EE2E2]/5 rounded-3xl border border-[#0065FF]/20 flex items-start gap-4">
            <Info className="text-[#0065FF] shrink-0 mt-1" />
            <div>
              <h4 className="font-black uppercase text-xs tracking-widest mb-2">Note aux clubs adverses</h4>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                Pour toute demande relative aux feuilles de matchs ou décalages de rencontres d'interclubs, merci de contacter directement le pôle sportif.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// --- SOUS-COMPOSANTS ---

const ContactCard = ({ icon, title, desc, contact, color }) => (
  <div className={`bg-white dark:bg-[#0f172a] p-8 rounded-[2.5rem] border-b-4 ${color} shadow-xl hover:translate-y-[-5px] transition-all`}>
    <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white mb-3">{title}</h3>
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
      {desc}
    </p>
    <a href={`mailto:${contact}`} className="text-xs font-black uppercase tracking-widest text-[#0065FF] hover:underline flex items-center gap-2">
      <Mail size={14} /> {contact}
    </a>
  </div>
);

const LocationItem = ({ name, address, desc }) => (
  <div className="flex gap-6 group">
    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#0EE2E2] group-hover:text-[#081031] transition-colors">
      <MapPin size={24} />
    </div>
    <div>
      <h3 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white mb-1">{name}</h3>
      <p className="text-sm font-bold text-[#0065FF] mb-2">{address}</p>
      <p className="text-xs font-medium text-slate-500 leading-relaxed">{desc}</p>
      <a 
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} 
        target="_blank" 
        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mt-4 text-slate-400 hover:text-[#0EE2E2] transition-colors"
      >
        Ouvrir dans Maps <ChevronRight size={12} />
      </a>
    </div>
  </div>
);