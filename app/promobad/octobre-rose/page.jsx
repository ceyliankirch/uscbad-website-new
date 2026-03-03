'use client';
import React, { useState } from 'react';
import { Calendar, MapPin, Users, Trophy, ExternalLink, Camera, Download, Coffee, Medal, Info, ChevronRight, Heart, Sparkles, Ticket, Gamepad2, Gift } from 'lucide-react';

// ==========================================
// DONNÉES DE DÉMONSTRATION - PLUME ROSE
// ==========================================
const galleryImages = [
  "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?q=80&w=800&auto=format&fit=crop",
];

// Palmarès vide pour la démo
const palmares2024 = [
  { serie: "Série 1", sd: "Gagnante 1 (Club)", dd: "Paire 1 (Club)" },
  { serie: "Série 2", sd: "Gagnante 2 (Club)", dd: "Paire 2 (Club)" },
];

export default function OctobreRosePage() {
  const [activeTab, setActiveTab] = useState('infos'); // 'infos', 'activites', 'palmares', 'galerie'

  return (
    // FOND CLAIR CLASSIQUE AVEC SUPPORT MODE SOMBRE
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300 pb-20">
      
      {/* =========================================================
          SECTION 1 : HERO (SOMBRE POUR L'IMPACT VISUEL)
          ========================================================= */}
      <section className="relative w-full h-[80svh] min-h-[600px] flex flex-col justify-center items-center text-center overflow-hidden bg-[#081031]">
        
        {/* Background Image avec overlay sombre */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#081031]/80 via-[#081031]/90 to-[#081031] z-0"></div>
        
        {/* Halos Lumineux Rose Tournoi */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#EC4899] rounded-full blur-[150px] opacity-30 pointer-events-none z-0"></div>

        <div className="relative z-20 px-6 max-w-5xl mx-auto mt-20 flex flex-col items-center">
          
          {/* Logo / Icône du tournoi */}
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center p-4 mb-8 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
            <Heart size={48} className="text-[#EC4899] drop-shadow-lg" fill="#EC4899" />
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#EC4899]/20 border border-[#EC4899]/50 text-white rounded-full font-[900] uppercase text-xs tracking-widest italic mb-6 shadow-lg backdrop-blur-md">
            Octobre Rose
          </div>
          
          <div className="mb-6 flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-[900] uppercase italic tracking-tighter leading-[0.9] text-white drop-shadow-2xl mb-3">
              LA PLUME ROSE
            </h1>
            <span className="text-lg md:text-2xl font-bold italic uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#F9A8D4]">
              2ème Promobad USC
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm md:text-base font-bold text-slate-300 mb-10">
            <span className="flex items-center gap-2"><Calendar size={18} className="text-[#EC4899]" /> Ven. 17 Octobre 2025</span>
            <span className="flex items-center gap-2"><MapPin size={18} className="text-[#EC4899]" /> STAPS Créteil</span>
            <span className="flex items-center gap-2"><Users size={18} className="text-[#EC4899]" /> 100% Féminin (NC-D9)</span>
          </div>

          {/* Bouton d'inscription géant */}
          <a 
            href="https://badnet.fr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#EC4899] text-white rounded-full font-[900] uppercase italic text-sm md:text-base tracking-widest overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(236,72,153,0.4)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="relative z-10 flex items-center gap-2">S'inscrire (Tarif : 8€) <ExternalLink size={18} /></span>
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
              { id: 'activites', label: 'Activités & Jeux', icon: <Sparkles size={16} /> }, // NOUVEL ONGLET
              { id: 'palmares', label: 'Résultats', icon: <Trophy size={16} /> },
              { id: 'galerie', label: 'Galerie', icon: <Camera size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-5 font-black uppercase text-xs md:text-sm tracking-widest whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id 
                  ? 'border-[#EC4899] text-[#EC4899]' 
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
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] bg-[#EC4899] rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
              
              <div className="relative z-10 max-w-4xl">
                <h3 className="text-2xl md:text-3xl font-[900] uppercase italic text-[#081031] dark:text-white mb-6">
                  Célébrons <span className="text-[#EC4899]">l'amour du jeu</span>
                </h3>
                <div className="space-y-4 text-sm md:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    Mesdames, préparez vos raquettes et vos plus belles tenues aux couleurs d’Octobre Rose ! L’US Créteil Badminton vous invite à un tournoi <strong>100% féminin, festif et convivial</strong>.
                  </p>
                  <p>
                    Que vous veniez pour la compétition ou simplement pour partager un moment chaleureux entre passionnées de badminton, cet événement est fait pour vous. De nombreuses surprises et activités vous attendent tout au long de la soirée !
                  </p>
                </div>
              </div>
            </div>

            {/* Grille Disciplines & Séries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] p-8 md:p-10 border border-slate-200 dark:border-white/5 relative overflow-hidden group h-full shadow-sm transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#EC4899] rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
                <h3 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white mb-6 flex items-center gap-3 relative z-10">
                  <Medal className="text-[#EC4899]" /> Les Tableaux
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-6 leading-relaxed relative z-10">
                  La compétition (Promobad) est ouverte exclusivement aux joueuses classées de <strong className="text-[#081031] dark:text-white">NC à D9</strong>. Frais de participation : <strong>8 €</strong>.
                </p>
                <div className="flex flex-wrap gap-3 relative z-10">
                  {['Simple Dames', 'Double Dames'].map(disc => (
                    <span key={disc} className="bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 shadow-sm">
                      {disc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] p-8 md:p-10 border border-slate-200 dark:border-white/5 relative overflow-hidden group h-full shadow-sm transition-colors">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#EC4899] rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
                <h3 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white mb-6 flex items-center gap-3 relative z-10">
                  <Calendar className="text-[#EC4899]" /> Le Programme
                </h3>
                <ul className="space-y-4 relative z-10">
                  <li className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-[#EC4899]/10 text-[#EC4899] rounded-xl flex items-center justify-center font-black text-xl shrink-0">VE</div>
                    <div>
                      <h4 className="font-bold text-[#081031] dark:text-white uppercase tracking-wider">Vendredi 17 Octobre 2025</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Le tournoi se déroulera en soirée, de <strong>18h30 à 23h00</strong>. L'inscription sur Ebad ouvre à partir de 20h !</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Accès Gymnase */}
            <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] p-4 pr-8 border border-slate-200 dark:border-white/5 shadow-sm transition-colors">
              <div className="w-full md:w-1/3 aspect-video bg-slate-200 dark:bg-black rounded-xl overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=800&auto=format&fit=crop" alt="Gymnase" className="w-full h-full object-cover opacity-70 dark:opacity-50" />
                <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-md" size={32} />
              </div>
              <div className="w-full md:w-2/3 py-4">
                <h3 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white mb-2">STAPS de Créteil</h3>
                <p className="text-[#EC4899] font-bold mb-4">Avenue Magellan, 94000 Créteil</p>
                <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1"><ChevronRight size={14} className="text-[#EC4899]"/> Accès en soirée</span>
                  <span className="flex items-center gap-1"><ChevronRight size={14} className="text-[#EC4899]"/> Vestiaires & Douches</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================
            ONGLET NOUVEAU : ACTIVITÉS & JEUX
            ========================================================= */}
        {activeTab === 'activites' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            
            {/* Bannière Dress Code */}
            <div className="bg-gradient-to-r from-[#EC4899] to-[#F9A8D4] rounded-[2rem] p-8 text-center text-white shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <h3 className="text-2xl md:text-4xl font-[900] uppercase italic mb-2 relative z-10">Dress Code : Tous en Rose !</h3>
              <p className="font-bold max-w-2xl mx-auto relative z-10">
                Portez fièrement le rose pour soutenir la cause d'Octobre Rose tout au long de la soirée.
              </p>
            </div>

            {/* Grille des activités */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Stand Association (Mise en avant) */}
              <div className="lg:col-span-3 bg-[#081031] rounded-[2rem] p-8 md:p-10 border border-[#EC4899]/30 flex flex-col md:flex-row items-center gap-8 shadow-xl">
                <div className="w-20 h-20 bg-[#EC4899]/20 rounded-full flex items-center justify-center shrink-0">
                  <Heart size={40} className="text-[#EC4899]" fill="#EC4899" />
                </div>
                <div>
                  <h3 className="text-2xl font-[900] uppercase italic text-white mb-2">Association de Lutte contre le Cancer du Sein</h3>
                  <p className="text-slate-300 font-medium leading-relaxed">
                    Un stand dédié sera présent toute la soirée avec l'association du Val-de-Marne pour échanger, s'informer, et soutenir la recherche. Des petits goodies solidaires seront en vente au profit de l'association.
                  </p>
                </div>
              </div>

              {/* Les autres stands */}
              <ActivityCard 
                icon={<Gamepad2 size={24} />} 
                title="Stands de jeu" 
                desc="Des mini-jeux pour s’amuser et se challenger entre vos matchs. Défiez vos copines !"
              />
              <ActivityCard 
                icon={<Camera size={24} />} 
                title="Coin Photo" 
                desc="Un espace décoré pour immortaliser vos moments avec vos tenues roses et vos partenaires."
              />
              <ActivityCard 
                icon={<Ticket size={24} />} 
                title="Grande Tombola" 
                desc="Achetez vos tickets sur place ! 3 magnifiques lots sont à gagner lors du tirage au sort."
              />
              <ActivityCard 
                icon={<Coffee size={24} />} 
                title="Buvette Exceptionnelle" 
                desc="Notre équipe vous prépare un buffet gourmand pour ravir vos papilles tout au long de la soirée."
              />
              <ActivityCard 
                icon={<Gift size={24} />} 
                title="Lots & Récompenses" 
                desc="Des lots d’accueil pour toutes les participantes et de belles récompenses pour les gagnantes !"
              />

            </div>
          </div>
        )}

        {/* =========================================================
            ONGLET 3 : PALMARÈS
            ========================================================= */}
        {activeTab === 'palmares' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-3xl font-[900] uppercase italic text-[#081031] dark:text-white">Résultats <span className="text-[#EC4899]">2024</span></h2>
              <button className="bg-slate-100 dark:bg-white/10 hover:bg-[#081031] hover:text-white dark:hover:bg-white dark:hover:text-[#081031] text-[#081031] dark:text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
                <Download size={16} /> Palmarès Complet (PDF)
              </button>
            </div>

            <div className="space-y-6">
              {palmares2024.map((serie, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-[#0f172a] rounded-[1.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm transition-colors">
                  <div className="bg-[#EC4899]/10 dark:bg-[#EC4899]/20 px-6 py-4 border-b border-slate-200 dark:border-white/5">
                    <h3 className="font-[900] uppercase text-[#EC4899] tracking-widest">{serie.serie}</h3>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResultItem discipline="SD" vainqueur={serie.sd} />
                    <ResultItem discipline="DD" vainqueur={serie.dd} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center p-8 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/10 border-dashed transition-colors">
              <Trophy size={48} className="mx-auto text-slate-400 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-bold text-[#081031] dark:text-white uppercase italic mb-2">Les résultats 2025 arriveront ici</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Rendez-vous à la fin du Promobad pour découvrir les gagnantes !</p>
            </div>
          </div>
        )}

        {/* =========================================================
            ONGLET 4 : GALERIE "BEST OF" + LIEN GOOGLE PHOTOS
            ========================================================= */}
        {activeTab === 'galerie' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-[900] uppercase italic text-[#081031] dark:text-white mb-2">
                  Best Of <span className="text-[#EC4899]">2024</span>
                </h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Aperçu des meilleurs moments. L'album complet contient toutes les photos.
                </p>
              </div>
              <a 
                href="https://photos.app.goo.gl/TON_LIEN_ALBUM_ICI" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#EC4899] hover:bg-[#081031] dark:hover:bg-white text-white dark:hover:text-[#081031] px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Camera size={16} /> Voir tout l'album officiel
              </a>
            </div>

            {/* GRILLE MOSAÏQUE (MASONRY STYLE) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[200px]">
              
              <div className="col-span-2 row-span-2 relative rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-sm">
                <img src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop" alt="Action" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081031]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <span className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Trophy size={14}/> Les finales</span>
                </div>
              </div>

              <div className="relative rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-sm">
                <img src="https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?q=80&w=800&auto=format&fit=crop" alt="Joueuse" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              
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

          </div>
        )}

      </div>

    </div>
  );
}

// --- SOUS-COMPOSANTS ---

// Composant pour l'affichage d'un résultat dans le palmarès
const ResultItem = ({ discipline, vainqueur }) => (
  <div className="flex flex-col">
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{discipline}</span>
    <div className="flex items-center gap-2 text-sm font-bold text-[#081031] dark:text-white">
      <Medal size={14} className="text-[#EC4899] shrink-0" />
      <span className="truncate" title={vainqueur}>{vainqueur}</span>
    </div>
  </div>
);

// Carte d'Activité
const ActivityCard = ({ icon, title, desc }) => (
  <div className="bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] p-8 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md hover:border-[#EC4899]/30 transition-all group">
    <div className="w-14 h-14 bg-white dark:bg-black/50 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#EC4899] group-hover:text-white text-[#EC4899] transition-colors">
      {icon}
    </div>
    <h4 className="text-lg font-[900] uppercase italic text-[#081031] dark:text-white mb-2">{title}</h4>
    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
      {desc}
    </p>
  </div>
);