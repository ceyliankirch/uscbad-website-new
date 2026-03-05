'use client';
import React from 'react';
import Link from 'next/link';
import { Euro, Info, FileText, CheckCircle, AlertCircle, ArrowRight, Download, Users } from 'lucide-react';

export default function InscriptionsPage() {
  
  // Données avec le beau design de cartes (Version 1)
  const tarifs = [
    { title: 'Adultes compétiteurs et jeunes > 12 ans', desc: '2 entraînements', price: '260€', color: 'border-[#0065FF]', badgeBg: 'bg-[#0065FF]' },
    { title: 'Adultes compétiteurs et jeunes > 12 ans', desc: '1 entraînement', price: '225€', color: 'border-[#0EE2E2]', badgeBg: 'bg-[#0EE2E2]', textDark: true },
    { title: 'Jeunes < 12 ans', desc: '2 entraînements', price: '225€', color: 'border-[#F72585]', badgeBg: 'bg-[#F72585]' },
    { title: 'Jeunes < 12 ans', desc: '1 entraînement', price: '205€', color: 'border-[#F72585]', badgeBg: 'bg-[#F72585]' },
    { title: 'Adultes loisirs', desc: '1 entraînement', price: '215€', color: 'border-[#9333EA]', badgeBg: 'bg-[#9333EA]' },
    { title: 'Jeu libre', desc: 'Accès aux créneaux libres sans entraînement encadré', price: '153€', color: 'border-slate-400', badgeBg: 'bg-slate-400' },
    { title: 'Dirigeant joueur', desc: 'Membres du bureau pratiquants', price: '106€', color: 'border-slate-800', badgeBg: 'bg-slate-800' },
    { title: 'Dirigeant non joueur', desc: 'Membres du bureau non pratiquants', price: '58€', color: 'border-slate-800', badgeBg: 'bg-slate-800' },
  ];

  return (
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300 pb-20">
      
      {/* =========================================================
          SECTION HERO SOMBRE
          ========================================================= */}
      <section className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-28 flex flex-col justify-center items-center text-center overflow-hidden bg-[#081031]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#0065FF]/20 to-transparent z-0"></div>
        
        {/* Cercles de lumière */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-[#0065FF] rounded-full blur-[150px] opacity-20 pointer-events-none z-0"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-[#0EE2E2] rounded-full blur-[150px] opacity-10 pointer-events-none z-0"></div>
        
        <div className="relative z-20 px-6 max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-[900] uppercase italic tracking-tighter leading-[0.9] text-white drop-shadow-xl mb-6">
            TARIFS & <span className="text-[#0065FF]">INSCRIPTIONS</span>
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0065FF]/10 border border-[#0065FF]/30 text-[#0EE2E2] rounded-full font-[900] uppercase text-[10px] tracking-widest italic mb-6 backdrop-blur-md">
            <Euro size={14} /> Saison 2024 - 2025
          </div>          
          <p className="text-sm lg:text-lg font-bold text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Rejoignez l'US Créteil Badminton ! Retrouvez ci-dessous toutes les informations concernant les cotisations, les réductions et la procédure d'inscription en ligne.
          </p>
        </div>
      </section>

      {/* =========================================================
          CONTENU PRINCIPAL
          ========================================================= */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-12 lg:py-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* --- COLONNE GAUCHE : LES TARIFS --- */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-[900] uppercase italic text-[#081031] dark:text-white leading-tight">
                Grille <span className="text-[#0065FF]">Tarifaire</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold mt-2">
                Les tarifs incluent la licence FFBaD, l'assurance, et l'accès aux créneaux de jeu.
              </p>
            </div>

            {/* Liste des tarifs sous forme de belles cartes empilées */}
            <div className="flex flex-col gap-4">
              {tarifs.map((tarif, idx) => (
                <div key={idx} className={`bg-white dark:bg-[#0f172a] p-5 lg:p-6 rounded-[1.5rem] border-2 border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:-translate-y-1 hover:${tarif.color} group`}>
                  <div>
                    <h3 className="text-lg font-black uppercase text-[#081031] dark:text-white leading-tight mb-1 group-hover:text-[#0065FF] dark:group-hover:text-[#0EE2E2] transition-colors">
                      {tarif.title}
                    </h3>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                      {tarif.desc}
                    </p>
                  </div>
                  <div className={`${tarif.badgeBg} ${tarif.textDark ? 'text-[#081031]' : 'text-white'} px-6 py-3 rounded-xl font-black text-2xl italic tracking-tighter shrink-0 shadow-lg shadow-black/10`}>
                    {tarif.price}
                  </div>
                </div>
              ))}
            </div>

            {/* Boîte d'informations "Notes" */}
            <div className="bg-orange-50 dark:bg-orange-500/10 border-2 border-orange-200 dark:border-orange-500/20 rounded-[2rem] p-6 lg:p-8 mt-10">
              <h4 className="text-lg font-[900] uppercase italic text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
                <AlertCircle size={20} /> Bon à savoir
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></div>
                  <p className="text-sm font-bold text-orange-800 dark:text-orange-200 leading-relaxed">
                    <span className="font-black">Part non remboursable : 78€.</span>
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></div>
                  <p className="text-sm font-bold text-orange-800 dark:text-orange-200 leading-relaxed">
                    Aucun remboursement ne sera effectué, passées les vacances d'automne.
                  </p>
                </li>
                <li className="flex items-start gap-3 bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-orange-200/50 dark:border-orange-500/10">
                  <Users className="text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" size={18} />
                  <p className="text-sm font-bold text-orange-800 dark:text-orange-200 leading-relaxed">
                    <span className="font-black">Réduction Famille :</span> Remise de 10% pour toute inscription de 3 personnes ou plus d'un même foyer.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* --- COLONNE DROITE : COMMENT S'INSCRIRE --- */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32 space-y-6">
            
            <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] p-8 lg:p-10 border border-slate-200 dark:border-white/5 shadow-xl">
              <h3 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white mb-8 flex items-center gap-3">
                <FileText className="text-[#0EE2E2]" size={28} /> S'inscrire
              </h3>
              
              {/* LIGNE VERTICALE PARFAITEMENT ALIGNÉE */}
              <div className="space-y-8 relative">
                {/* La ligne fine en arrière-plan (Alignement corrigé à 15px pour centrer avec w-8) */}
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-[#0065FF] dark:bg-[#0065FF]/50 z-0"></div>
                
                {/* Étape 1 */}
                <div className="relative z-10 flex items-start gap-6">
                  <div className="w-8 h-8 rounded-full bg-[#0065FF] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-[0_0_15px_rgba(0,101,255,0.4)]">1</div>
                  <div className="pt-1">
                    <h4 className="font-black uppercase text-sm text-[#081031] dark:text-white mb-1">Documents requis</h4>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                      Préparez un certificat médical (si vous êtes nouveau ou si le vôtre a plus de 3 ans) ou répondez au questionnaire de santé.
                    </p>
                  </div>
                </div>

                {/* Étape 2 */}
                <div className="relative z-10 flex items-start gap-6">
                  <div className="w-8 h-8 rounded-full bg-[#0EE2E2] text-[#081031] flex items-center justify-center font-black text-sm shrink-0 shadow-[0_0_15px_rgba(14,226,226,0.4)]">2</div>
                  <div className="pt-1">
                    <h4 className="font-black uppercase text-sm text-[#081031] dark:text-white mb-1">Formulaire en Ligne</h4>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                      L'inscription se fait numériquement via la plateforme MyFFBaD. Créez ou connectez-vous à votre espace licencié.
                    </p>
                  </div>
                </div>

                {/* Étape 3 */}
                <div className="relative z-10 flex items-start gap-6">
                  <div className="w-8 h-8 rounded-full bg-[#F72585] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-[0_0_15px_rgba(247,37,133,0.4)]">3</div>
                  <div className="pt-1">
                    <h4 className="font-black uppercase text-sm text-[#081031] dark:text-white mb-1">Paiement</h4>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                      Paiement sécurisé en ligne. Possibilité de régler en plusieurs fois si besoin.
                    </p>
                  </div>
                </div>

              </div>

              <div className="mt-10">
                <a href="https://myffbad.fr" target="_blank" rel="noopener noreferrer" className="w-full bg-[#0065FF] hover:bg-[#0052cc] text-white py-4 px-6 rounded-xl font-[900] uppercase text-sm tracking-widest flex items-center justify-center gap-3 transition-all shadow-[0_0_15px_rgba(0,101,255,0.4)] group">
                  Lien d'inscription <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Documents utiles */}
            <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 shadow-sm">
              <h4 className="font-black uppercase text-sm text-[#081031] dark:text-white mb-4">Documents Utiles</h4>
              <div className="space-y-3">
                <a href="#" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors group">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Certificat Médical FFBaD</span>
                  <Download size={14} className="text-slate-400 group-hover:text-[#0065FF] transition-colors" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors group">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Questionnaire de Santé (Majeurs)</span>
                  <Download size={14} className="text-slate-400 group-hover:text-[#0065FF] transition-colors" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors group">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Questionnaire de Santé (Mineurs)</span>
                  <Download size={14} className="text-slate-400 group-hover:text-[#0065FF] transition-colors" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}