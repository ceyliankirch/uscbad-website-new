'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Users, Trophy, MapPin, Target, Shield, Heart, ArrowRight, ExternalLink, Mail, Phone } from 'lucide-react';

// ==========================================
// DONNÉES DE DÉMONSTRATION : LE STAFF (Avec Contacts)
// ==========================================
const bureauMembers = [
  { id: 1, name: "Julien Moreau", role: "Président", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop", color: "#0065FF", email: "president@uscbad.fr", phone: "06 12 34 56 78" },
  { id: 2, name: "Sarah Lenoir", role: "Trésorière", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop", color: "#F72585", email: "tresorerie@uscbad.fr", phone: "06 23 45 67 89" },
  { id: 3, name: "Thomas Dubois", role: "Secrétaire", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop", color: "#0EE2E2", email: "contact@uscbad.fr", phone: "06 34 56 78 90" },
  { id: 4, name: "Emma Petit", role: "Resp. Événements", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop", color: "#0065FF", email: "event@uscbad.fr", phone: "06 45 67 89 01" },
];

const coaches = [
  { id: 1, name: "Alexandre Roux", role: "Head Coach N1", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop", color: "#F72585", email: "alex.coach@uscbad.fr", phone: "06 56 78 90 12" },
  { id: 2, name: "Camille Leroy", role: "Coach Jeunes", img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1000&auto=format&fit=crop", color: "#0EE2E2", email: "camille.coach@uscbad.fr", phone: "06 67 89 01 23" },
  { id: 3, name: "Lucas Martin", role: "Coach Loisirs", img: "https://images.unsplash.com/photo-1574170685233-a3d8ce3f6406?q=80&w=1000&auto=format&fit=crop", color: "#0065FF", email: "lucas.coach@uscbad.fr", phone: "06 78 90 12 34" },
];

export default function PresentationPage() {
  return (
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300">
      
      {/* =========================================================
          SECTION 1 : HERO (FOND SOMBRE AVEC LOGO ET COVER PHOTO)
          ========================================================= */}
      <section className="relative w-full h-[60svh] lg:h-[75svh] min-h-[500px] flex flex-col justify-center items-center text-center overflow-hidden bg-[#081031]">
        
        {/* Décors et Image de fond (Style Cover Photo - Opacité plus élevée) */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0"></div>
        <img 
          src="https://images.unsplash.com/photo-1572680511874-98402c5c991f?q=80&w=2070&auto=format&fit=crop" 
          alt="Photo de couverture Club US Créteil" 
          // Opacité augmentée pour un effet "Cover Photo", mais avec des dégradés sombres dessus pour la lisibilité
          className="absolute inset-0 w-full h-full object-cover opacity-40 object-center z-0"
        />
        
        {/* Dégradé sombre pourNavbar et lisibilité text */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#081031]/80 via-transparent to-[#081031] z-10"></div>
        
        {/* Effet de lueur glowing bleu au centre */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-[#0065FF] rounded-full blur-[150px] opacity-30 pointer-events-none z-0"></div>

        {/* Contenu */}
        <div className="relative z-20 px-6 max-w-4xl mx-auto mt-16 flex flex-col items-center">
          
          {/* NOUVEAU : LOGO AU-DESSUS DU BADGE */}
          <img 
            src="/logo-uscbadminton.png" 
            alt="Logo USC Badminton" 
            className="h-20 md:h-24 w-auto mb-6 drop-shadow-lg"
          />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0065FF] text-white rounded-full font-[900] uppercase text-[10px] tracking-widest italic mb-6 shadow-lg">
            Depuis 1982
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-[900] uppercase italic tracking-tighter leading-[0.9] text-white drop-shadow-xl mb-6">
            L'ÂME DU <span className="text-[#0EE2E2]">CLUB</span>
          </h1>
          <p className="text-sm lg:text-lg font-bold text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Plus qu'un simple club de sport, l'US Créteil Badminton est une véritable famille qui rassemble passionnés, compétiteurs et loisirs autour du même terrain.
          </p>
        </div>
      </section>

      {/* =========================================================
          SECTION 2 : CHIFFRES CLÉS
          ========================================================= */}
      <section className="relative z-30 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 lg:-mt-24 mb-20">
        <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 lg:p-10 shadow-2xl border border-slate-100 dark:border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          <StatBlock icon={<Users />} value={300} suffix="+" label="Licenciés" color="#0065FF" />
          <StatBlock icon={<MapPin />} value={3} suffix="" label="Gymnases" color="#0EE2E2" />
          <StatBlock icon={<Trophy />} value={1} suffix="ère" label="Équipe en N1" color="#F72585" />
          <StatBlock icon={<Shield />} value={3} suffix="★" label="Label École" color="#FFD500" />
        </div>
      </section>

      {/* =========================================================
          SECTION 3 : NOTRE HISTOIRE & VALEURS
          ========================================================= */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-[900] italic uppercase tracking-tighter text-[#081031] dark:text-white leading-none mb-4">
                Une ascension <span className="text-[#0065FF]">fulgurante</span>
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] lg:text-xs">De l'association locale à la Nationale 1</p>
            </div>

            <div className="space-y-6 text-sm lg:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              <p>
                Fondée au début des années 80, la section Badminton de l'Union Sportive de Créteil s'est imposée comme une référence incontournable en Île-de-France. Ce qui a commencé comme un petit rassemblement de passionnés s'est transformé en un club structuré et ambitieux.
              </p>
              <p>
                Grâce au dévouement de nos bénévoles, entraîneurs et joueurs, le club a gravi les échelons un à un. Aujourd'hui, notre équipe fanion porte fièrement les couleurs de la ville au plus haut niveau amateur français : la Nationale 1.
              </p>
              <blockquote className="border-l-4 border-[#0EE2E2] pl-5 italic text-[#081031] dark:text-white font-[900] text-lg lg:text-xl">
                "Notre force, c'est d'avoir su garder un esprit familial tout en visant l'excellence sportive."
              </blockquote>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <ValueCard icon={<Heart />} title="Convivialité" desc="Un club ouvert à tous, du loisir à la compétition." color="#F72585" />
              <ValueCard icon={<Target />} title="Excellence" desc="Une formation reconnue par la FFBAD (3 étoiles)." color="#0065FF" />
            </div>
          </div>

          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4 lg:gap-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#0EE2E2] rounded-full blur-[80px] opacity-20"></div>
            
            <div className="space-y-4 lg:space-y-6 mt-12 lg:mt-24">
              <img src="https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?q=80&w=1000&auto=format&fit=crop" alt="Jeunes USC" className="w-full rounded-[2rem] shadow-xl hover:scale-105 transition-transform duration-500" />
              <div className="bg-[#0065FF] rounded-[2rem] p-6 lg:p-8 text-white shadow-xl flex flex-col justify-center">
                <span className="text-4xl lg:text-5xl font-[900] italic">1982</span>
                <span className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">Année de création</span>
              </div>
            </div>
            
            <div className="space-y-4 lg:space-y-6">
              <div className="bg-[#081031] dark:bg-[#0EE2E2]/10 border border-transparent dark:border-[#0EE2E2]/20 rounded-[2rem] p-6 lg:p-8 text-white dark:text-[#0EE2E2] shadow-xl flex flex-col justify-center">
                <span className="text-4xl lg:text-5xl font-[900] italic">100%</span>
                <span className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">Passion & Dévouement</span>
              </div>
              <img src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop" alt="Match USC" className="w-full rounded-[2rem] shadow-xl hover:scale-105 transition-transform duration-500" />
            </div>
          </div>

        </div>
      </section>

    {/* =========================================================
          SECTION : UN CLUB POUR TOUS (LES DIFFÉRENTS PROFILS)
          ========================================================= */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#040817] transition-colors">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-12 lg:mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-[900] uppercase italic tracking-tighter text-[#081031] dark:text-white leading-none">
                UN CLUB, <span className="text-[#0065FF]">TOUS LES PROFILS</span>
              </h2>
              <p className="text-sm lg:text-base font-bold text-slate-500 mt-4">
                À l'US Créteil, la diversité est notre force. Que vous teniez une raquette pour la première fois ou que vous visiez les sommets nationaux, vous êtes chez vous.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* PROFIL : JEUNES */}
            <ProfileCard 
              title="Jeunes" 
              subtitle="Apprendre & Grandir"
              desc="Dès 5 ans, notre école labellisée accueille les champions de demain pour une progression ludique et encadrée."
              img="https://images.unsplash.com/photo-1526232759533-35d64843063f?q=80&w=1000&auto=format&fit=crop"
              color="#FFD500" // Jaune pour l'énergie
            />

            {/* PROFIL : LOISIRS */}
            <ProfileCard 
              title="Loisirs" 
              subtitle="Plaisir & Détente"
              desc="Envie de décompresser ? Profitez de nos nombreux créneaux de jeu libre pour pratiquer sans pression."
              img="https://images.unsplash.com/photo-1599474924187-334a4ae593c0?q=80&w=1000&auto=format&fit=crop"
              color="#0EE2E2" // Cyan pour la fraîcheur
            />

            {/* PROFIL : COMPÉTITEURS */}
            <ProfileCard 
              title="Compétition" 
              subtitle="Challenge & Progrès"
              desc="Entraînements dirigés et matchs par équipe : rejoignez l'une de nos 10 équipes interclubs départementales ou régionales."
              img="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop"
              color="#0065FF" // Bleu pour le sérieux
            />

            {/* PROFIL : ELITE */}
            <ProfileCard 
              title="Haut Niveau" 
              subtitle="Performance & Élite"
              desc="Le fer de lance du club. Une structure dédiée pour évoluer au sommet du badminton français en Nationale 1."
              img="https://images.unsplash.com/photo-1574170685233-a3d8ce3f6406?q=80&w=1000&auto=format&fit=crop"
              color="#F72585" // Magenta pour l'impact
            />
          </div>
        </div>
      </section>


      {/* =========================================================
          SECTION 4 : NOS GYMNASES
          ========================================================= */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#0a0f25] border-y border-slate-200 dark:border-white/5 transition-colors">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-[900] uppercase italic tracking-tighter text-[#081031] dark:text-white">
              NOS <span className="text-[#0EE2E2]">INFRASTRUCTURES</span>
            </h2>
            <p className="text-sm lg:text-base font-bold text-slate-500 mt-4 max-w-2xl mx-auto">
              Le club évolue principalement sur deux grands gymnases de la ville de Créteil, offrant des conditions de jeu optimales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Gymnase Casalis */}
            <div className="group bg-white dark:bg-[#0f172a] rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="h-48 lg:h-64 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1541534401786-2077e733015c?q=80&w=2000&auto=format&fit=crop" 
                  alt="Gymnase Casalis" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 bg-[#0065FF] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md z-10">
                  Gymnase Principal
                </div>
              </div>
              <div className="p-8 lg:p-10">
                <h3 className="text-2xl lg:text-3xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2">Gymnase Casalis</h3>
                <p className="flex items-center gap-2 text-xs lg:text-sm font-bold text-slate-500 mb-6">
                  <MapPin size={16} className="text-[#0EE2E2]" /> 40 Rue Casalis, 94000 Créteil
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">7 Terrains</span>
                  <span className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">Gradins</span>
                  <span className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">Nationale 1</span>
                </div>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full bg-[#081031] dark:bg-white text-white dark:text-[#081031] py-4 rounded-xl font-[900] uppercase text-xs tracking-widest hover:bg-[#0065FF] dark:hover:bg-[#0EE2E2] transition-colors shadow-md">
                  Voir sur la carte <ExternalLink size={16} className="ml-2" />
                </a>
              </div>
            </div>

            {/* Gymnase Nelson Mandela */}
            <div className="group bg-white dark:bg-[#0f172a] rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="h-48 lg:h-64 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1518659727402-901d830c242c?q=80&w=2000&auto=format&fit=crop" 
                  alt="Gymnase Nelson Mandela" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 bg-[#0EE2E2] text-[#081031] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md z-10">
                  Entraînements & Jeunes
                </div>
              </div>
              <div className="p-8 lg:p-10">
                <h3 className="text-2xl lg:text-3xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2">Nelson Mandela</h3>
                <p className="flex items-center gap-2 text-xs lg:text-sm font-bold text-slate-500 mb-6">
                  <MapPin size={16} className="text-[#0EE2E2]" /> Rue Nelson Mandela, 94000 Créteil
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">5 Terrains</span>
                  <span className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">École de Bad</span>
                  <span className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">Loisirs</span>
                </div>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full bg-slate-100 dark:bg-white/10 text-[#081031] dark:text-white py-4 rounded-xl font-[900] uppercase text-xs tracking-widest hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
                  Voir sur la carte <ExternalLink size={16} className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 5 : LE BUREAU & LES ENTRAÎNEURS (Format "Cartes de visite")
          ========================================================= */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="text-center mb-12 lg:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-[900] uppercase italic tracking-tighter text-[#081031] dark:text-white">
            L'ÉQUIPE <span className="text-[#0065FF]">DIRIGEANTE</span>
          </h2>
          <p className="text-sm lg:text-base font-bold text-slate-500 mt-4 max-w-2xl mx-auto">
            Des bénévoles passionnés et des entraîneurs diplômés qui s'investissent au quotidien pour faire vivre le club.
          </p>
        </div>

        {/* Le Bureau */}
        <div className="mb-16">
          <h3 className="text-xl lg:text-2xl font-[900] italic uppercase text-[#081031] dark:text-white mb-6 border-l-4 border-[#0EE2E2] pl-4">
            Le Bureau
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {bureauMembers.map((member) => (
              <TeamContactCard key={member.id} {...member} />
            ))}
          </div>
        </div>

        {/* Les Entraîneurs */}
        <div>
          <h3 className="text-xl lg:text-2xl font-[900] italic uppercase text-[#081031] dark:text-white mb-6 border-l-4 border-[#F72585] pl-4">
            Les Entraîneurs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {coaches.map((coach) => (
              <TeamContactCard key={coach.id} {...coach} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 6 : CALL TO ACTION FINAL
          ========================================================= */}
      <section className="py-20 lg:py-32 relative overflow-hidden bg-[#081031]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] bg-[#0065FF] rounded-full blur-[150px] opacity-40 pointer-events-none z-0"></div>
        
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-[900] uppercase italic tracking-tighter text-white mb-6">
            PRÊT À <span className="text-[#0EE2E2]">JOUER ?</span>
          </h2>
          <p className="text-sm lg:text-base font-bold text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
            Rejoignez l'US Créteil Badminton pour la nouvelle saison. Que vous cherchiez à vous amuser ou à repousser vos limites, il y a une place pour vous.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-[#0065FF] text-white px-8 py-4 rounded-full font-[900] uppercase italic text-xs tracking-widest shadow-xl shadow-[#0065FF]/30 hover:scale-105 hover:bg-[#0EE2E2] hover:text-[#081031] transition-all flex items-center justify-center gap-2">
              M'inscrire <ArrowRight size={16} />
            </button>
            <button className="w-full sm:w-auto bg-white/10 text-white px-8 py-4 rounded-full font-[900] uppercase italic text-xs tracking-widest hover:bg-white hover:text-[#081031] transition-all flex items-center justify-center border border-white/20">
              Voir les créneaux
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

/* =========================================================
   SOUS-COMPOSANTS
   ========================================================= */

// NOUVEAU COMPOSANT : Carte de contact horizontale (Rectangle)
const TeamContactCard = ({ name, role, img, color, email, phone }) => (
  <div className="group bg-white dark:bg-[#0f172a] rounded-[1.5rem] p-4 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-lg dark:hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-row items-center block">
    
    {/* Photo Cercle Gauche */}
    <div 
      className="w-16 h-16 lg:w-20 lg:h-20 shrink-0 rounded-full overflow-hidden border-[3px] shadow-sm"
      style={{ borderColor: color }}
    >
      <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
    </div>

    {/* Infos Droite */}
    <div className="ml-4 flex flex-col min-w-0 flex-grow">
      <h4 className="text-base lg:text-lg font-[900] italic uppercase text-[#081031] dark:text-white leading-tight truncate">
        {name}
      </h4>
      <span 
        className="text-[10px] lg:text-xs font-black uppercase tracking-widest mt-0.5 mb-2 truncate"
        style={{ color: color === '#081031' ? '#0065FF' : color }} // Empêche un texte bleu très sombre sur fond noir
      >
        {role}
      </span>
      
      {/* Coordonnées */}
      <div className="flex flex-col gap-1.5 text-[10px] lg:text-[11px] font-bold text-slate-500">
        {email && (
          <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-[#0065FF] dark:hover:text-[#0EE2E2] transition-colors truncate">
            <Mail size={12} className="shrink-0" /> <span className="truncate">{email}</span>
          </a>
        )}
        {phone && (
          <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-[#0065FF] dark:hover:text-[#0EE2E2] transition-colors truncate">
            <Phone size={12} className="shrink-0" /> <span className="truncate">{phone}</span>
          </a>
        )}
      </div>
    </div>

  </div>
);

// Ce bloc doit être en bas du fichier, en dehors de PresentationPage
const ProfileCard = ({ title, subtitle, desc, img, color }) => (
  <div className="group relative h-[450px] lg:h-[500px] rounded-[2rem] overflow-hidden flex flex-col justify-end p-8 cursor-default">
    {/* Image de fond avec filtre sombre */}
    <div className="absolute inset-0 z-0">
      <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#081031] via-[#081031]/60 to-transparent"></div>
    </div>

    {/* Lueur colorée au survol */}
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
      style={{ backgroundColor: color }}
    ></div>

    {/* Contenu */}
    <div className="relative z-10">
      <div 
        className="w-12 h-1 mb-4 rounded-full transition-all duration-500 group-hover:w-20"
        style={{ backgroundColor: color }}
      ></div>
      <div 
        className="text-[10px] font-black uppercase tracking-[0.2em] mb-1"
        style={{ color: color }}
      >
        {subtitle}
      </div>
      <h3 className="text-3xl lg:text-4xl font-[900] uppercase italic text-white leading-none mb-4">
        {title}
      </h3>
      <p className="text-sm font-medium text-slate-300 leading-relaxed opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
        {desc}
      </p>
    </div>
  </div>
);

const StatBlock = ({ icon, value, suffix, label, color }) => (
  <div className="flex flex-col items-center text-center group">
    <div 
      className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 shadow-md"
      style={{ backgroundColor: `${color}15`, color: color }}
    >
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div className="text-4xl lg:text-5xl font-[900] italic text-[#081031] dark:text-white leading-none mb-1 flex items-baseline">
      <AnimatedNumber value={value} />
      <span style={{ color: color }} className="text-2xl lg:text-3xl ml-1">{suffix}</span>
    </div>
    <div className="text-[10px] lg:text-xs font-black uppercase text-slate-400 tracking-widest">
      {label}
    </div>
  </div>
);

const ValueCard = ({ icon, title, desc, color }) => (
  <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-[1.5rem] border border-slate-100 dark:border-white/5 hover:border-transparent transition-colors group">
    <div 
      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors"
      style={{ backgroundColor: `${color}20`, color: color }}
    >
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <h4 className="text-base font-[900] uppercase italic text-[#081031] dark:text-white mb-1">{title}</h4>
    <p className="text-xs font-bold text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const AnimatedNumber = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasAnimated, value, duration]);

  return <span ref={ref}>{count}</span>;
};