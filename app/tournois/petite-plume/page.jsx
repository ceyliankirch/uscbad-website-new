'use client';
import React, { useState } from 'react';
import { Calendar, MapPin, Users, Trophy, ExternalLink, Camera, Download, Coffee, Medal, Info, ChevronRight } from 'lucide-react';

// ==========================================
// DONNÉES DE DÉMONSTRATION
// ==========================================
const galleryImages = [
  "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?q=80&w=800&auto=format&fit=crop",
];

const palmares2025 = [
  { serie: "Série 1", sh: "Lucas M. (USC)", sd: "Emma T. (VGA)", dh: "Hugo / Maxime (USC)", dd: "Sarah / Julie (Noisiel)", dx: "Lucas / Sarah (USC/Noisiel)" },
  { serie: "Série 2", sh: "Thomas R. (SMASH)", sd: "Chloé D. (USC)", dh: "Antoine / Paul (VGA)", dd: "Marie / Léa (USC)", dx: "Thomas / Chloé (SMASH/USC)" },
];

export default function PetitePlumePage() {
  const [activeTab, setActiveTab] = useState('infos'); // 'infos', 'palmares', 'galerie'

  return (
    // FOND CLAIR CLASSIQUE AVEC SUPPORT MODE SOMBRE
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300 pb-20">
      
      {/* =========================================================
          SECTION 1 : HERO (RESTE SOMBRE POUR L'IMPACT)
          ========================================================= */}
      <section className="relative w-full h-[80svh] min-h-[600px] flex flex-col justify-center items-center text-center overflow-hidden bg-[#081031]">
        
        {/* Background Image avec overlay sombre */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#081031]/80 via-[#081031]/90 to-[#081031] z-0"></div>
        
        {/* Halos Lumineux Bleu Tournoi */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#0065FF] rounded-full blur-[150px] opacity-30 pointer-events-none z-0"></div>

        <div className="relative z-20 px-6 max-w-5xl mx-auto mt-20 flex flex-col items-center">
          
          {/* Logo du tournoi */}
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center p-4 mb-8 shadow-[0_0_30px_rgba(0,101,255,0.3)]">
            <img 
              src="/logo-uscbadminton.png" // REMPLACER PAR LE LOGO DU TOURNOI
              alt="Logo Petite Plume" 
              className="w-full h-full object-contain filter drop-shadow-lg"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#0065FF]/20 border border-[#0065FF]/50 text-white rounded-full font-[900] uppercase text-xs tracking-widest italic mb-6 shadow-lg backdrop-blur-md">
            Édition 2026
          </div>
          
          <div className="mb-6 flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-[900] uppercase italic tracking-tighter leading-[0.9] text-white drop-shadow-2xl mb-3">
              LA PETITE PLUME
            </h1>
            <span className="text-lg md:text-2xl font-extrabold italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#0041F5] to-[#00DCF5]">
              De Créteil
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm md:text-base font-bold text-slate-300 mb-10">
            <span className="flex items-center gap-2"><Calendar size={18} className="text-[#0065FF]" /> 19 & 20 Octobre</span>
            <span className="flex items-center gap-2"><MapPin size={18} className="text-[#0065FF]" /> Gymnase Nelson Paillou</span>
            <span className="flex items-center gap-2"><Users size={18} className="text-[#0065FF]" /> Séries R6 à NC</span>
          </div>

          {/* Bouton d'inscription géant */}
          <a 
            href="https://badnet.fr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#0065FF] text-white rounded-full font-[900] uppercase italic text-sm md:text-base tracking-widest overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(0,101,255,0.4)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="relative z-10 flex items-center gap-2">S'inscrire sur BadNet <ExternalLink size={18} /></span>
          </a>
        </div>
      </section>

      {/* =========================================================
          SECTION 2 : NAVIGATION INTERNE DU TOURNOI
          ========================================================= */}
      <div className="sticky top-[80px] z-40 bg-white/90 dark:bg-[#081031]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 transition-colors">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto hide-scrollbar">
            {[
              { id: 'infos', label: 'Informations', icon: <Info size={16} /> },
              { id: 'palmares', label: 'Résultats', icon: <Trophy size={16} /> },
              { id: 'galerie', label: 'Galerie', icon: <Camera size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-5 font-black uppercase text-xs md:text-sm tracking-widest whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id 
                  ? 'border-[#0065FF] text-[#0065FF]' 
                  : 'border-transparent text-slate-500 hover:text-[#081031] dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 min-h-[500px]">
        
        {/* =========================================================
            ONGLET 1 : INFORMATIONS
            ========================================================= */}
        {activeTab === 'infos' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 md:space-y-12">
            
            {/* CARTE DESCRIPTION GÉNÉRALE */}
            <div className="bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] p-8 md:p-12 border border-slate-200 dark:border-white/5 relative overflow-hidden group shadow-sm transition-colors">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] bg-[#0065FF] rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
              
              <div className="relative z-10 max-w-4xl">
                <h3 className="text-2xl md:text-3xl font-[900] uppercase italic text-[#081031] dark:text-white mb-6">
                  Le mot du <span className="text-[#0065FF]">Club</span>
                </h3>
                <div className="space-y-4 text-sm md:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    L'US Créteil Badminton est très fier de vous convier à la nouvelle édition de <strong>La Petite Plume de Créteil</strong> ! Devenu un rendez-vous incontournable du début de saison en Île-de-France, ce tournoi est pensé pour vous offrir la meilleure expérience de jeu possible.
                  </p>
                  <p>
                    Que vous veniez pour chercher des points précieux en vue des interclubs, ou simplement pour partager un super weekend de sport dans une ambiance conviviale, nos bénévoles ont tout préparé pour vous accueillir dans les meilleures conditions sur nos 7 terrains.
                  </p>
                </div>
              </div>
            </div>

            {/* Grille Disciplines & Séries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] p-8 md:p-10 border border-slate-200 dark:border-white/5 relative overflow-hidden group h-full shadow-sm transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0065FF] rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
                <h3 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white mb-6 flex items-center gap-3 relative z-10">
                  <Medal className="text-[#0065FF]" /> Les Tableaux
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-6 leading-relaxed relative z-10">
                  Le tournoi est ouvert aux joueurs classés de <strong className="text-[#081031] dark:text-white">R6 à Non Classé (NC)</strong>. Deux tableaux maximum par joueur.
                </p>
                <div className="flex flex-wrap gap-3 relative z-10">
                  {['Simple Hommes', 'Simple Dames', 'Double Hommes', 'Double Dames', 'Double Mixte'].map(disc => (
                    <span key={disc} className="bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 shadow-sm">
                      {disc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] p-8 md:p-10 border border-slate-200 dark:border-white/5 relative overflow-hidden group h-full shadow-sm transition-colors">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#0065FF] rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
                <h3 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white mb-6 flex items-center gap-3 relative z-10">
                  <Calendar className="text-[#0065FF]" /> Le Programme
                </h3>
                <ul className="space-y-4 relative z-10">
                  <li className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-[#0065FF]/10 text-[#0065FF] rounded-xl flex items-center justify-center font-black text-xl shrink-0">SA</div>
                    <div>
                      <h4 className="font-bold text-[#081031] dark:text-white uppercase tracking-wider">Samedi 19 Octobre</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Simples Hommes, Simples Dames & Doubles Mixtes (jusqu'aux finales).</p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent text-[#081031] dark:text-white shadow-sm rounded-xl flex items-center justify-center font-black text-xl shrink-0">DI</div>
                    <div>
                      <h4 className="font-bold text-[#081031] dark:text-white uppercase tracking-wider">Dimanche 20 Octobre</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Doubles Hommes & Doubles Dames (jusqu'aux finales).</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Buvette & Stand (La buvette garde son fond bleu profond) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-gradient-to-r from-[#0065FF] to-blue-800 rounded-[2rem] p-8 md:p-10 flex flex-col justify-center text-white relative overflow-hidden shadow-md">
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                  <Coffee size={200} className="translate-x-1/4 translate-y-1/4" />
                </div>
                <h3 className="text-3xl font-[900] uppercase italic mb-4 relative z-10">La Buvette Légendaire</h3>
                <p className="font-medium text-white/90 max-w-lg leading-relaxed relative z-10">
                  Croque-monsieurs maison, crêpes fraîches, salades pasta, fruits et boissons fraîches. Notre équipe de bénévoles vous accueille tout le weekend pour recharger les batteries entre deux matchs !
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] p-8 flex flex-col items-center justify-center text-center border border-slate-200 dark:border-white/5 shadow-sm transition-colors">
                <div className="w-16 h-16 bg-white dark:bg-black/50 shadow-sm border border-slate-100 dark:border-white/10 rounded-full flex items-center justify-center mb-4">
                  <span className="font-black text-2xl text-[#0065FF]">L+</span>
                </div>
                <h4 className="font-[900] uppercase italic text-[#081031] dark:text-white mb-2">Stand Lardesports</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cordage express, textile et matériel disponible sur place durant tout le tournoi.</p>
              </div>
            </div>

            {/* Accès Gymnase */}
            <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] p-4 pr-8 border border-slate-200 dark:border-white/5 shadow-sm transition-colors">
              <div className="w-full md:w-1/3 aspect-video bg-slate-200 dark:bg-black rounded-xl overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=800&auto=format&fit=crop" alt="Gymnase" className="w-full h-full object-cover opacity-70 dark:opacity-50" />
                <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-md" size={32} />
              </div>
              <div className="w-full md:w-2/3 py-4">
                <h3 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white mb-2">Gymnase Nelson Paillou</h3>
                <p className="text-[#0065FF] font-bold mb-4">Rue d'Ouessant, 94000 Créteil</p>
                <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1"><ChevronRight size={14} className="text-[#0065FF]"/> Parking gratuit sur place</span>
                  <span className="flex items-center gap-1"><ChevronRight size={14} className="text-[#0065FF]"/> Vestiaires & Douches</span>
                  <span className="flex items-center gap-1"><ChevronRight size={14} className="text-[#0065FF]"/> Tribunes accessibles</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================
            ONGLET 2 : PALMARÈS
            ========================================================= */}
        {activeTab === 'palmares' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-3xl font-[900] uppercase italic text-[#081031] dark:text-white">Résultats <span className="text-[#0065FF]">2025</span></h2>
              <button className="bg-slate-100 dark:bg-white/10 hover:bg-[#081031] hover:text-white dark:hover:bg-white dark:hover:text-[#081031] text-[#081031] dark:text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
                <Download size={16} /> Palmarès Complet (PDF)
              </button>
            </div>

            <div className="space-y-6">
              {palmares2025.map((serie, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-[#0f172a] rounded-[1.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm transition-colors">
                  <div className="bg-[#0065FF]/10 dark:bg-[#0065FF]/20 px-6 py-4 border-b border-slate-200 dark:border-white/5">
                    <h3 className="font-[900] uppercase text-[#0065FF] tracking-widest">{serie.serie}</h3>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <ResultItem discipline="SH" vainqueur={serie.sh} />
                    <ResultItem discipline="SD" vainqueur={serie.sd} />
                    <ResultItem discipline="DH" vainqueur={serie.dh} />
                    <ResultItem discipline="DD" vainqueur={serie.dd} />
                    <ResultItem discipline="DX" vainqueur={serie.dx} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center p-8 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/10 border-dashed transition-colors">
              <Trophy size={48} className="mx-auto text-slate-400 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-bold text-[#081031] dark:text-white uppercase italic mb-2">Les résultats 2026 arriveront ici</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Rendez-vous à la fin du tournoi pour découvrir les nouveaux vainqueurs !</p>
            </div>
          </div>
        )}

        {/* =========================================================
            ONGLET 3 : GALERIE "BEST OF" + LIEN GOOGLE PHOTOS
            ========================================================= */}
        {activeTab === 'galerie' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-[900] uppercase italic text-[#081031] dark:text-white mb-2">
                  Best Of <span className="text-[#0065FF]">2025</span>
                </h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Aperçu des meilleurs moments. L'album complet contient plus de 500 photos.
                </p>
              </div>
              <a 
                href="https://photos.app.goo.gl/TON_LIEN_ALBUM_ICI" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#0065FF] hover:bg-[#081031] dark:hover:bg-white text-white dark:hover:text-[#081031] px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Camera size={16} /> Voir tout l'album officiel
              </a>
            </div>

            {/* GRILLE MOSAÏQUE (MASONRY STYLE) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[200px]">
              
              {/* Grande photo mise en avant (Prend 2 colonnes et 2 lignes) */}
              <div className="col-span-2 row-span-2 relative rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-sm">
                <img src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop" alt="Action" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081031]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <span className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Trophy size={14}/> Les finales</span>
                </div>
              </div>

              {/* Photos standards */}
              <div className="relative rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-sm">
                <img src="https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?q=80&w=800&auto=format&fit=crop" alt="Joueur" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              
              {/* Photo verticale (Prend 2 lignes) */}
              <div className="row-span-2 relative rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-sm">
                <img src="https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=800&auto=format&fit=crop" alt="Ambiance" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>

              <div className="relative rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-sm">
                <img src="https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?q=80&w=800&auto=format&fit=crop" alt="Public" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>

              <div className="col-span-2 relative rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-sm">
                <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop" alt="Buvette" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081031]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <span className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Coffee size={14}/> La Buvette</span>
                </div>
              </div>

              <div className="relative rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-sm">
                <img src="https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=800&auto=format&fit=crop" alt="Gymnase" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>

            </div>

            {/* CTA Final en bas de la grille */}
            <div className="mt-12 bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] p-8 border border-slate-200 dark:border-white/5 text-center flex flex-col items-center">
              <div className="flex -space-x-4 mb-4">
                {/* Petites bulles Google Photos stylisées */}
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0f172a] bg-blue-500 z-30"></div>
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0f172a] bg-red-500 z-20"></div>
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0f172a] bg-yellow-400 z-10"></div>
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0f172a] bg-green-500 z-0"></div>
              </div>
              <h3 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white mb-2">
                Vous n'êtes pas sur ces photos ?
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 max-w-lg">
                Consultez l'album Google Photos complet pour retrouver tous vos matchs, les podiums complets et télécharger vos souvenirs en haute définition.
              </p>
              <a 
                href="https://photos.app.goo.gl/TON_LIEN_ALBUM_ICI" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 text-[#081031] dark:text-white hover:text-[#0065FF] px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                Ouvrir Google Photos <ExternalLink size={14} />
              </a>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

// Composant pour l'affichage d'un résultat dans le palmarès
const ResultItem = ({ discipline, vainqueur }) => (
  <div className="flex flex-col">
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{discipline}</span>
    <div className="flex items-center gap-2 text-sm font-bold text-[#081031] dark:text-white">
      <Medal size={14} className="text-[#FFD500] shrink-0" />
      <span className="truncate" title={vainqueur}>{vainqueur}</span>
    </div>
  </div>
);