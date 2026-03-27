'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, ChevronRight, Search, Loader2 } from 'lucide-react';

// ON UTILISE EXACTEMENT LES MÊMES NOMS QUE DANS LE DASHBOARD ADMIN
const categories = ["Tout voir", "Événements", "Compétitions", "Vie du Club", "Interclubs", "Jeunes"];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("Tout voir");
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // APPEL API
  useEffect(() => {
  document.title = "L'actu du club | US Créteil Badminton";    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/articles');
        const data = await res.json();
        if (data.success) {
          setArticles(data.data);
        }
      } catch (error) {
        console.error("Erreur de récupération des articles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // --- LOGIQUE DE FILTRAGE INTELLIGENTE ---
  // On détecte si l'utilisateur est en train de chercher ou de filtrer
  const isFiltering = activeCategory !== "Tout voir" || searchTerm.trim() !== "";

  // Si on ne filtre pas, le 1er article va "À la une". Sinon, pas de "À la une".
  const featuredArticle = !isFiltering && articles.length > 0 ? articles[0] : null;

  // On prépare la grille : on enlève l'article à la une s'il est affiché en haut
  const articlesForGrid = featuredArticle 
    ? articles.filter(article => article._id !== featuredArticle._id)
    : articles;

  // On applique les filtres sur la grille
  const filteredArticles = articlesForGrid
    .filter(article => activeCategory === "Tout voir" || article.category === activeCategory)
    .filter(article => article.title.toLowerCase().includes(searchTerm.toLowerCase()));


  // Fonction pour les couleurs dynamiques (adaptée aux nouveaux noms)
  const getCategoryColor = (category) => {
    switch(category) {
      case 'Vie du Club': return '#0EE2E2';
      case 'Événements': return '#0065FF';
      case 'Jeunes': return '#F72585';
      case 'Interclubs': return '#7B2CBF';
      default: return '#081031'; // Compétitions
    }
  };

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
            <h1 className="text-3xl md:text-7xl lg:text-8xl font-[900] uppercase italic tracking-tighter text-white drop-shadow-md">
              ACTUS <span className="text-[#0EE2E2]">DU CLUB</span>
            </h1>
            <p className="text-sm lg:text-base font-bold text-slate-400 mt-3 max-w-2xl">
              Résultats, événements, vie du club... Ne manquez rien de ce qui se passe à l'US Créteil Badminton.
            </p>
          </div>

          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#0EE2E2]" size={48} />
            </div>
          )}

          {/* L'Article "À la une" s'affiche UNIQUEMENT si on ne fait pas de recherche */}
          {featuredArticle && (
            <Link 
              href={`/actualites/${featuredArticle._id}`}
              className="group relative w-full rounded-[2rem] overflow-hidden bg-[#040817] shadow-2xl cursor-pointer border border-white/10 block animate-in fade-in zoom-in duration-500"
            >
              <div className="flex flex-col lg:flex-row h-auto lg:h-[500px]">
                
                <div className="w-full lg:w-[60%] h-[300px] lg:h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#081031]/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  {featuredArticle.imageUrl ? (
                    <img src={featuredArticle.imageUrl} alt={featuredArticle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">US Créteil Badminton</div>
                  )}
                </div>

                <div className="w-full lg:w-[40%] p-8 lg:p-12 flex flex-col justify-center relative z-20 bg-gradient-to-t lg:bg-gradient-to-l from-[#040817] via-[#040817]/95 to-[#040817]/80 lg:to-transparent -mt-20 lg:mt-0">
                  <div className="inline-flex items-center gap-2 bg-white text-[#081031] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest w-max mb-6 shadow-xl">
                    À la une • {featuredArticle.category}
                  </div>

                  <div className="flex items-center gap-2 text-[#0EE2E2] font-bold text-[10px] lg:text-xs mb-3 uppercase tracking-wider">
                    <Calendar size={14} /> {new Date(featuredArticle.createdAt).toLocaleDateString('fr-FR')}
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-[900] italic leading-tight text-white mb-4 group-hover:text-[#0EE2E2] transition-colors line-clamp-3">
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
              placeholder="Rechercher par titre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-full px-5 py-3 pl-12 text-xs sm:text-sm font-bold text-[#081031] dark:text-white focus:outline-none focus:border-[#0065FF] dark:focus:border-[#0EE2E2] transition-colors shadow-sm"
            />
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Titre dynamique si on filtre */}
        {isFiltering && (
          <h2 className="text-xl font-black uppercase tracking-widest text-[#081031] dark:text-white mb-6">
            Résultats pour : {activeCategory !== "Tout voir" ? activeCategory : "Votre recherche"}
          </h2>
        )}

        {/* Grille des Articles */}
        {!isLoading && filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredArticles.map((article) => (
              <Link 
                href={`/actualites/${article._id}`} 
                key={article._id} 
                className="group bg-white dark:bg-[#0f172a] rounded-2xl lg:rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden hover:shadow-xl dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col block animate-in fade-in slide-in-from-bottom-4"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-white/5">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0065FF] z-20"></div>
                  {article.imageUrl ? (
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs">US Créteil</div>
                  )}
                  <div className="absolute top-4 right-4 bg-white px-4 py-1.5 rounded-xl text-[10px] font-[900] uppercase tracking-widest shadow-lg z-10 text-[#081031]">
                    {article.category}
                  </div>
                </div>

                <div className="p-6 lg:p-7 flex flex-col flex-grow">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[9px] font-black uppercase tracking-wider mb-2">
                    <Calendar size={12} /> {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                  
                  <h3 className="text-lg font-[900] italic leading-tight text-[#081031] dark:text-white mb-2 group-hover:text-[#0065FF] dark:group-hover:text-[#0EE2E2] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-relaxed line-clamp-2 mb-4 flex-grow">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4">
                    <span className="text-[9px] font-[900] uppercase tracking-widest text-slate-400 group-hover:text-[#081031] dark:group-hover:text-white transition-colors">
                      Lire l'article
                    </span>
                    <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-[#081031] dark:text-white group-hover:bg-[#0065FF] group-hover:text-white dark:group-hover:bg-[#0EE2E2] dark:group-hover:text-[#081031] transition-colors">
                      <ChevronRight size={12} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : !isLoading && (
          <div className="text-center py-20 bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/5 animate-in fade-in">
            <h3 className="text-2xl font-[900] italic text-[#081031] dark:text-white mb-2">Aucun article trouvé</h3>
            <p className="text-slate-500 font-bold">Il n'y a pas encore d'actualités pour la recherche "{searchTerm}" ou la catégorie sélectionnée.</p>
            <button 
              onClick={() => { setActiveCategory("Tout voir"); setSearchTerm(""); }}
              className="mt-6 text-[#0065FF] dark:text-[#0EE2E2] font-[900] uppercase text-xs tracking-widest hover:underline"
            >
              Réinitialiser la recherche
            </button>
          </div>
        )}
      </section>
    </div>
  );
}