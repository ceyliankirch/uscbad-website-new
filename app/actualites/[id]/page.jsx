'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, User, Share2, Tag, ChevronRight, Loader2 } from 'lucide-react';

export default function ArticlePage({ params }) {
  const resolvedParams = use(params);
  
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/articles');
        const data = await res.json();
        
        if (data.success) {
          const foundArticle = data.data.find(a => a._id === resolvedParams.id);
          if (foundArticle) {
            setArticle(foundArticle);
            // On récupère 3 autres articles au hasard ou les plus récents pour la sidebar
            setRelatedArticles(data.data.filter(a => a._id !== resolvedParams.id).slice(0, 3));
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Erreur API:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [resolvedParams.id]);

  // Fonction pour les couleurs des badges
  const getCategoryColor = (category) => {
    switch(category) {
      case 'VIE DU CLUB': return '#0EE2E2';
      case 'ÉVÉNEMENT': return '#0065FF';
      case 'JEUNES': return '#F72585';
      default: return '#081031';
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#081031]"><Loader2 className="animate-spin text-[#0EE2E2]" size={48} /></div>;
  }

  if (error || !article) {
    return notFound();
  }

  return (
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300 pb-24">
      
      {/* =========================================================
          HERO : GRANDE IMAGE D'EN-TÊTE
          ========================================================= */}
      <section className="relative w-full h-[60svh] lg:h-[75svh] min-h-[500px] flex flex-col justify-end bg-[#081031]">
        {/* Image de fond */}
        <div className="absolute inset-0 w-full h-full">
          {article.imageUrl ? (
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-[#0065FF]/20"></div> // Fallback si pas d'image
          )}
          {/* Overlay dégradé sombre pour la lisibilité du texte et la navbar */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#081031]/80 via-[#081031]/40 to-[#081031]"></div>
        </div>

        {/* Contenu du Hero */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-12 pb-12 lg:pb-20">
          
          <Link 
            href="/actualites" 
            className="inline-flex items-center gap-2 text-[#0EE2E2] hover:text-white mb-8 lg:mb-12 font-bold text-xs uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={16} /> Retour aux actualités
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span 
              className="px-4 py-1.5 rounded-full text-white font-black uppercase text-[10px] tracking-widest shadow-lg"
              style={{ backgroundColor: getCategoryColor(article.category) }}
            >
              {article.category}
            </span>
            <span className="flex items-center gap-1.5 text-[#0EE2E2] font-bold text-[10px] uppercase tracking-wider bg-[#081031]/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <Calendar size={14} /> {new Date(article.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-[900] uppercase italic tracking-tighter leading-[1.05] text-white drop-shadow-xl max-w-5xl">
            {article.title}
          </h1>
        </div>
      </section>

      {/* =========================================================
          CORPS DE L'ARTICLE
          ========================================================= */}
      <section className="relative z-20 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 -mt-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* COLONNE GAUCHE : CONTENU PRINCIPAL */}
          <div className="w-full lg:w-[70%] bg-white dark:bg-[#0f172a] rounded-[2rem] p-8 lg:p-14 shadow-2xl border border-slate-100 dark:border-white/5">
            
            {/* Meta Infos auteur */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0065FF]/10 text-[#0065FF] flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rédigé par</div>
                  <div className="text-sm font-bold text-[#081031] dark:text-white">{article.author || "Le Bureau"}</div>
                </div>
              </div>

              {/* Bouton Partager (Décoratif pour l'instant) */}
              <button onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert("Lien copié !"))} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 hover:bg-[#0EE2E2] hover:text-[#081031] flex items-center justify-center text-slate-500 transition-colors" title="Copier le lien">
                <Share2 size={18} />
              </button>
            </div>

            {/* LE RÉSUMÉ (Accroche) */}
            <p className="text-xl lg:text-2xl font-bold italic text-slate-700 dark:text-slate-300 leading-snug mb-10 border-l-4 border-[#0EE2E2] pl-6">
              {article.excerpt}
            </p>

            {/* LE CORPS DE L'ARTICLE (HTML TipTap) */}
            <article 
              className="prose prose-slate dark:prose-invert prose-lg max-w-none
                prose-headings:uppercase prose-headings:italic prose-headings:font-[900] prose-headings:text-[#081031] dark:prose-headings:text-white
                prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:font-medium
                prose-strong:text-[#0065FF] dark:prose-strong:text-[#0EE2E2]
                prose-blockquote:bg-[#0065FF]/5 dark:prose-blockquote:bg-[#0EE2E2]/5 prose-blockquote:border-l-4 prose-blockquote:border-[#0065FF] dark:prose-blockquote:border-[#0EE2E2] prose-blockquote:p-6 prose-blockquote:rounded-2xl prose-blockquote:not-italic prose-blockquote:font-bold prose-blockquote:text-lg
                prose-a:text-[#0EE2E2] hover:prose-a:text-[#0065FF]"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags de fin d'article */}
            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/10 flex items-center gap-3">
              <Tag size={16} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                {article.category}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                US Créteil
              </span>
            </div>
          </div>

          {/* COLONNE DROITE : SIDEBAR (Lire aussi) */}
          <div className="w-full lg:w-[30%] space-y-8">
            
            {relatedArticles.length > 0 && (
              <div className="bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] p-8 border border-slate-100 dark:border-white/5 sticky top-24">
                <h3 className="text-xl font-[900] italic uppercase text-[#081031] dark:text-white mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
                  À lire <span className="text-[#0065FF]">également</span>
                </h3>
                
                <div className="space-y-6">
                  {relatedArticles.map(related => (
                    <Link href={`/actualites/${related._id}`} key={related._id} className="group block">
                      <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-slate-200 dark:bg-slate-800">
                        {related.imageUrl && (
                          <img 
                            src={related.imageUrl} 
                            alt={related.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: getCategoryColor(related.category) }}>
                        {related.category}
                      </div>
                      <h4 className="text-sm font-[900] italic leading-tight text-[#081031] dark:text-white group-hover:text-[#0065FF] dark:group-hover:text-[#0EE2E2] transition-colors line-clamp-2">
                        {related.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Petit encart Promo/Boutique */}
            <div className="bg-gradient-to-br from-[#0065FF] to-[#081031] rounded-[2rem] p-8 text-white text-center relative overflow-hidden group shadow-lg">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <h4 className="text-2xl font-[900] italic uppercase mb-2 relative z-10">Rejoignez le club</h4>
              <p className="text-xs font-bold text-white/80 mb-6 relative z-10">Les inscriptions pour la nouvelle saison sont ouvertes.</p>
              <button className="bg-[#0EE2E2] text-[#081031] px-6 py-3 rounded-full font-[900] uppercase text-[10px] tracking-widest hover:bg-white transition-colors relative z-10 shadow-lg">
                S'inscrire
              </button>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}