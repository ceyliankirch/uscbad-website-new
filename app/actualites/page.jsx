'use client';
import React, { useState } from 'react';
import Link from 'next/link'; // NOUVEAU : Import de Link
import { Calendar, ArrowRight, ChevronRight, Search } from 'lucide-react';

// ==========================================
// DONNÉES DE DÉMONSTRATION (Les id sont maintenant des chaînes de caractères "1", "2"...)
// ==========================================
const categories = ["Tout voir", "Équipes & IC", "Tournois", "Vie du club", "Jeunes"];

const newsData = [
  {
    id: "1",
    title: "L'équipe première s'impose face à Chambly dans un match épique à domicile",
    excerpt: "Revivez la victoire incroyable de l'US Créteil face au leader du championnat. Une soirée riche en émotions où nos joueurs ont tout donné devant un public en feu.",
    date: "02 Mars 2026",
    category: "Équipes & IC",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2072&auto=format&fit=crop",
    featured: true,
    color: "#0065FF"
  },
  {
    id: "2",
    title: "Retour sur la soirée crêpes du club, un immense succès !",
    excerpt: "Plus de 100 membres se sont réunis ce mardi pour partager un moment convivial autour de notre traditionnelle soirée crêpes de la Chandeleur.",
    date: "24 Février 2026",
    category: "Vie du club",
    image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=2000&auto=format&fit=crop",
    color: "#0EE2E2"
  },
  {
    id: "3",
    title: "3 médailles d'or pour nos jeunes au tournoi régional d'Île-de-France",
    excerpt: "Nos minimes et cadets ont brillé ce week-end en ramenant plusieurs médailles. Focus sur les performances de notre école de badminton.",
    date: "18 Février 2026",
    category: "Jeunes",
    image: "https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?q=80&w=2000&auto=format&fit=crop",
    color: "#F72585"
  },
  {
    id: "4",
    title: "Inscriptions ouvertes pour le prochain tournoi interne de double",
    excerpt: "Trouvez votre partenaire et inscrivez-vous dès maintenant pour le tournoi interne qui aura lieu le mois prochain.",
    date: "05 Février 2026",
    category: "Tournois",
    image: "https://images.unsplash.com/photo-1572680511874-98402c5c991f?q=80&w=2070&auto=format&fit=crop",
    color: "#0065FF"
  },
  {
    id: "5",
    title: "L'US Créteil renouvelle son label École Française de Badminton 3 étoiles",
    excerpt: "Une immense fierté pour le club et nos encadrants qui voient leur travail récompensé par la fédération pour la 4ème année consécutive.",
    date: "28 Janvier 2026",
    category: "Vie du club",
    image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2070&auto=format&fit=crop",
    color: "#0EE2E2"
  },
  {
    id: "6",
    title: "Déplacement difficile pour l'Équipe 2 face à Sénart",
    excerpt: "Malgré des matchs très accrochés, l'équipe réserve s'incline de justesse 4-4. Le maintien en Régionale 1 reste l'objectif principal.",
    date: "15 Janvier 2026",
    category: "Équipes & IC",
    image: "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?q=80&w=2070&auto=format&fit=crop",
    color: "#0065FF"
  }
];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("Tout voir");

  const featuredArticle = newsData.find(article => article.featured);
  
  const filteredArticles = newsData
    .filter(article => !article.featured)
    .filter(article => activeCategory === "Tout voir" || article.category === activeCategory);

  return (
    <div className="bg-slate-50 dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300">
      
      {/* =========================================================
          SECTION 1 : HERO & ARTICLE À LA UNE
          ========================================================= */}
      <section className="relative w-full bg-[#081031] pt-32 pb-16 lg:pt-40 lg:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0065FF] rounded-full blur-[150px] opacity-30 pointer-events-none"></div>

        <div className="max-w-[1600px] mx-auto relative z-10">
          
          <div className="mb-12 lg:mb-16 text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-[900] uppercase italic tracking-tighter text-white drop-shadow-md">
              ACTUALITÉS <span className="text-[#0EE2E2] block sm:inline">DU CLUB</span>
            </h1>
            <p className="text-sm lg:text-base font-bold text-slate-400 mt-3 max-w-2xl">
              Résultats, événements, vie du club... Ne manquez rien de ce qui se passe à l'US Créteil Badminton.
            </p>
          </div>

          {/* Article "À la une" - TRANSFORMÉ EN <Link> */}
          {featuredArticle && (
            <Link 
              href={`/actualites/${featuredArticle.id}`}
              className="group relative w-full rounded-[2rem] overflow-hidden bg-[#040817] shadow-2xl cursor-pointer border border-white/10 block"
            >
              <div className="flex flex-col lg:flex-row h-auto lg:h-[500px]">
                
                <div className="w-full lg:w-[60%] h-[300px] lg:h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#081031]/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img 
                    src={featuredArticle.image} 
                    alt={featuredArticle.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 z-20 lg:hidden bg-[#0065FF] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    À la une • {featuredArticle.category}
                  </div>
                </div>

                <div className="w-full lg:w-[40%] p-8 lg:p-12 flex flex-col justify-center relative z-20 bg-gradient-to-t lg:bg-gradient-to-l from-[#040817] via-[#040817]/95 to-[#040817]/80 lg:to-transparent -mt-20 lg:mt-0">
                  <div className="hidden lg:inline-flex items-center gap-2 bg-[#0065FF] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-max mb-6 shadow-lg">
                    À la une • {featuredArticle.category}
                  </div>

                  <div className="flex items-center gap-2 text-[#0EE2E2] font-bold text-[10px] lg:text-xs mb-3 uppercase tracking-wider">
                    <Calendar size={14} /> {featuredArticle.date}
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-[900] italic leading-tight text-white mb-4 group-hover:text-[#0EE2E2] transition-colors">
                    {featuredArticle.title}
                  </h2>
                  
                  <p className="text-slate-400 text-sm lg:text-base font-medium leading-relaxed mb-8 line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="inline-flex items-center gap-2 text-white font-[900] uppercase text-xs tracking-widest mt-auto w-max group-hover:text-[#0EE2E2] transition-colors">
                    Lire l'article <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>

              </div>
            </Link>
          )}

        </div>
      </section>

      {/* =========================================================
          SECTION 2 : FILTRES & GRILLE D'ARTICLES
          ========================================================= */}
      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
        
        {/* Barre de recherche et Filtres */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          
          {/* Filtres (Correction du rognage de la version précédente) */}
          <div className="flex overflow-x-auto overflow-y-hidden hide-scrollbar w-full lg:w-auto gap-3 py-2 -mx-4 px-4 lg:mx-0 lg:px-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 whitespace-nowrap rounded-full font-bold text-[10px] sm:text-xs uppercase transition-all shadow-sm border shrink-0 ${
                  activeCategory === category 
                    ? 'bg-[#0065FF] text-white border-[#0065FF] shadow-md shadow-[#0065FF]/30' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-[#081031] hover:text-[#081031] dark:bg-[#0f172a] dark:text-slate-400 dark:border-white/10 dark:hover:text-white dark:hover:border-white/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <input 
              type="text" 
              placeholder="Rechercher un article..." 
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-full px-5 py-3 pl-12 text-xs sm:text-sm font-bold text-[#081031] dark:text-white focus:outline-none focus:border-[#0065FF] dark:focus:border-[#0EE2E2] transition-colors shadow-sm"
            />
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Grille des Articles */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredArticles.map((article) => (
              /* LES CARTES SONT MAINTENANT DES <Link> */
              <Link 
                href={`/actualites/${article.id}`} 
                key={article.id} 
                className="group bg-white dark:bg-[#0f172a] rounded-2xl lg:rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden hover:shadow-xl dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col block"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div 
                    className="absolute top-4 left-4 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md z-10"
                    style={{ backgroundColor: article.color }}
                  >
                    {article.category}
                  </div>
                </div>

                <div className="p-6 lg:p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                    <Calendar size={12} /> {article.date}
                  </div>
                  
                  <h3 className="text-lg lg:text-xl font-[900] italic leading-tight text-[#081031] dark:text-white mb-3 group-hover:text-[#0065FF] dark:group-hover:text-[#0EE2E2] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4">
                    <span className="text-[10px] font-[900] uppercase tracking-widest text-[#081031] dark:text-white group-hover:text-[#0065FF] dark:group-hover:text-[#0EE2E2] transition-colors">
                      Lire l'article
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-[#081031] dark:text-white group-hover:bg-[#0065FF] group-hover:text-white dark:group-hover:bg-[#0EE2E2] dark:group-hover:text-[#081031] transition-colors">
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/5">
            <h3 className="text-2xl font-[900] italic text-[#081031] dark:text-white mb-2">Aucun article trouvé</h3>
            <p className="text-slate-500 font-bold">Il n'y a pas encore d'actualités dans la catégorie "{activeCategory}".</p>
            <button 
              onClick={() => setActiveCategory("Tout voir")}
              className="mt-6 text-[#0065FF] dark:text-[#0EE2E2] font-[900] uppercase text-xs tracking-widest hover:underline"
            >
              Retourner à toutes les actualités
            </button>
          </div>
        )}

        {/* Bouton Charger Plus */}
        {filteredArticles.length > 0 && (
          <div className="mt-12 lg:mt-16 flex justify-center">
            <button className="bg-[#081031] dark:bg-white text-white dark:text-[#081031] px-8 py-4 rounded-full font-[900] uppercase text-xs tracking-widest hover:scale-105 hover:bg-[#0065FF] dark:hover:bg-[#0EE2E2] transition-all shadow-lg">
              Charger plus d'articles
            </button>
          </div>
        )}

      </section>

    </div>
  );
}