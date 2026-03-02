'use client';
import React, { use } from 'react'; // NOUVEAU : Import du hook 'use'
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, User, Share2, Tag, ChevronRight } from 'lucide-react';

// ==========================================
// DONNÉES DE DÉMONSTRATION (Avec contenu complet)
// ==========================================
const newsData = [
  {
    id: "1",
    title: "L'équipe première s'impose face à Chambly dans un match épique à domicile",
    date: "02 Mars 2026",
    category: "Équipes & IC",
    author: "Service Communication",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2072&auto=format&fit=crop",
    color: "#0065FF",
    content: [
      { type: "intro", text: "Revivez la victoire incroyable de l'US Créteil face au leader du championnat. Une soirée riche en émotions où nos joueurs ont tout donné devant un public en feu au Gymnase Casalis." },
      { type: "p", text: "La rencontre s'annonçait tendue, et elle a tenu toutes ses promesses. Ce samedi, l'US Créteil Badminton accueillait l'ogre du BC Chambly Oise pour le compte de la 8ème journée de Nationale 1. Portés par plus de 300 supporters, nos Cristoliens ont réalisé un exploit majuscule en s'imposant 5 à 3." },
      { type: "h2", text: "Un début de rencontre électrique" },
      { type: "p", text: "Dès les premiers échanges du double mixte 1, le ton était donné. La paire Vincent Espen / Manon Espen a imposé un rythme d'enfer, s'adjugeant le premier point après un match haletant en trois sets (21-18, 19-21, 21-16). Un élan immédiatement suivi par Romain Credou en simple homme, expéditif face à son adversaire direct." },
      { type: "quote", text: "Nous savions qu'il fallait frapper fort dès le début. Le public nous a poussés à nous surpasser sur chaque volant." },
      { type: "p", text: "Malgré un retour en force de Chambly sur les simples dames, l'équipe a su faire bloc. Les doubles hommes et doubles dames ont été décisifs en fin de soirée, scellant une victoire historique pour le club." },
      { type: "h2", text: "Objectif Play-offs" },
      { type: "p", text: "Avec ces précieux points engrangés, l'US Créteil conforte sa deuxième place au classement général de la Poule 2 et se rapproche un peu plus des play-offs d'accession. Prochain rendez-vous : un déplacement périlleux en terre bretonne face au Flume Ille Badminton." }
    ]
  },
  {
    id: "2",
    title: "Retour sur la soirée crêpes du club, un immense succès !",
    date: "24 Février 2026",
    category: "Vie du club",
    author: "Bureau US Créteil",
    image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=2000&auto=format&fit=crop",
    color: "#0EE2E2",
    content: [
      { type: "intro", text: "Plus de 100 membres se sont réunis ce mardi pour partager un moment convivial autour de notre traditionnelle soirée crêpes de la Chandeleur." },
      { type: "p", text: "C'est l'un des événements les plus attendus de l'année par nos licenciés loisirs et compétiteurs. Une belle occasion de se retrouver en dehors des terrains pour échanger dans la bonne humeur." }
    ]
  }
];

export default function ArticlePage({ params }) {
  // CORRECTION : Déballage de la promesse `params` requise dans Next.js 15+
  const resolvedParams = use(params);

  // On récupère l'article correspondant à l'ID dans l'URL
  const article = newsData.find(a => a.id === resolvedParams.id);

  // Si l'article n'existe pas, on redirige vers une page 404
  if (!article) return notFound();

  return (
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300 pb-24">
      
      {/* =========================================================
          HERO : GRANDE IMAGE D'EN-TÊTE
          ========================================================= */}
      <section className="relative w-full h-[60svh] lg:h-[75svh] min-h-[500px] flex flex-col justify-end">
        {/* Image de fond */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay dégradé sombre pour la lisibilité du texte et la navbar */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#081031]/80 via-transparent to-[#081031]"></div>
        </div>

        {/* Contenu du Hero */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-12 pb-12 lg:pb-20">
          
          <Link 
            href="/actualites" 
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 lg:mb-12 font-bold text-xs uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={16} /> Retour aux actualités
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span 
              className="px-4 py-1.5 rounded-full text-white font-black uppercase text-[10px] tracking-widest shadow-lg"
              style={{ backgroundColor: article.color }}
            >
              {article.category}
            </span>
            <span className="flex items-center gap-1.5 text-[#0EE2E2] font-bold text-[10px] uppercase tracking-wider bg-[#081031]/50 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Calendar size={14} /> {article.date}
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
                  <div className="text-sm font-bold text-[#081031] dark:text-white">{article.author}</div>
                </div>
              </div>

              {/* Bouton Partager */}
              <button className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 hover:bg-[#0EE2E2] hover:text-[#081031] flex items-center justify-center text-slate-500 transition-colors">
                <Share2 size={18} />
              </button>
            </div>

            {/* Rendu du Contenu dynamiquement */}
            <article className="space-y-6 lg:space-y-8 text-slate-600 dark:text-slate-300 text-sm lg:text-base leading-relaxed font-medium">
              {article.content.map((block, index) => {
                switch (block.type) {
                  case 'intro':
                    return (
                      <p key={index} className="text-lg lg:text-xl font-bold text-[#081031] dark:text-white leading-snug">
                        {block.text}
                      </p>
                    );
                  case 'h2':
                    return (
                      <h2 key={index} className="text-2xl lg:text-3xl font-[900] italic uppercase text-[#081031] dark:text-white pt-6">
                        {block.text}
                      </h2>
                    );
                  case 'quote':
                    return (
                      <blockquote key={index} className="relative p-6 lg:p-8 bg-[#0065FF]/5 dark:bg-[#0EE2E2]/5 rounded-2xl border-l-4 border-[#0065FF] dark:border-[#0EE2E2] my-8">
                        <span className="absolute top-4 left-4 text-4xl text-[#0065FF]/20 dark:text-[#0EE2E2]/20 font-serif">"</span>
                        <p className="relative z-10 text-lg lg:text-xl font-bold italic text-[#081031] dark:text-white">
                          {block.text}
                        </p>
                      </blockquote>
                    );
                  case 'p':
                  default:
                    return (
                      <p key={index} className="text-justify">
                        {block.text}
                      </p>
                    );
                }
              })}
            </article>

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
            
            <div className="bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] p-8 border border-slate-100 dark:border-white/5">
              <h3 className="text-xl font-[900] italic uppercase text-[#081031] dark:text-white mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
                À lire <span className="text-[#0065FF]">également</span>
              </h3>
              
              <div className="space-y-6">
                {newsData.filter(a => a.id !== article.id).slice(0, 3).map(related => (
                  <Link href={`/actualites/${related.id}`} key={related.id} className="group block">
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                      <img 
                        src={related.image} 
                        alt={related.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="text-[9px] font-black uppercase text-[#0065FF] dark:text-[#0EE2E2] tracking-widest mb-1">
                      {related.category}
                    </div>
                    <h4 className="text-sm font-[900] italic leading-tight text-[#081031] dark:text-white group-hover:text-[#0065FF] dark:group-hover:text-[#0EE2E2] transition-colors line-clamp-2">
                      {related.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>

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