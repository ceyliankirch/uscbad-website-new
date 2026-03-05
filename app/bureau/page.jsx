'use client';
import React, { useState, useEffect } from 'react';
import { Mail, User, FileText, Download, ChevronRight, Loader2, Eye, Sparkles, X, Calendar } from 'lucide-react';

export default function LeClubPublic() {
  const [activeTab, setActiveTab] = useState('membres'); // 'membres' ou 'cr'
  const [members, setMembers] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // État pour la lecture des CR texte (IA)
  const [viewingReport, setViewingReport] = useState(null);

  // RÉCUPÉRATION DES DONNÉES DEPUIS LES API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [memRes, repRes] = await Promise.all([
          fetch('/api/board-members'),
          fetch('/api/reports')
        ]);
        
        const memData = await memRes.json();
        const repData = await repRes.json();

        if (memData.success) setMembers(memData.data);
        if (repData.success) setReports(repData.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données du club", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#040817] font-['Montserrat'] transition-colors duration-300">
      
      {/* HERO SECTION */}
      <section className="bg-[#081031] pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0065FF] opacity-10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0EE2E2] opacity-10 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-[900] italic uppercase text-white mb-6 tracking-tighter">
            L'organisation <span className="text-[#0EE2E2]">du Club</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto font-bold uppercase tracking-widest text-sm leading-relaxed">
            Découvrez l'équipe bénévole qui fait vivre l'US Créteil Badminton au quotidien.
          </p>
        </div>
      </section>

      {/* TABS SWITCHER */}
      <div className="flex justify-center -mt-8 relative z-20 px-4">
        <div className="bg-white dark:bg-[#081031] p-2 rounded-[2rem] shadow-2xl flex gap-2 border border-slate-100 dark:border-white/10">
          <button 
            onClick={() => setActiveTab('membres')}
            className={`px-8 py-4 rounded-[1.5rem] font-black uppercase text-[10px] sm:text-xs tracking-widest transition-all ${activeTab === 'membres' ? 'bg-[#0065FF] text-white shadow-lg' : 'text-slate-400 hover:text-[#081031] dark:hover:text-white'}`}
          >
            Le Bureau
          </button>
          <button 
            onClick={() => setActiveTab('cr')}
            className={`px-8 py-4 rounded-[1.5rem] font-black uppercase text-[10px] sm:text-xs tracking-widest transition-all ${activeTab === 'cr' ? 'bg-[#0065FF] text-white shadow-lg' : 'text-slate-400 hover:text-[#081031] dark:hover:text-white'}`}
          >
            Comptes-rendus
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-20 min-h-[400px]">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-[#0065FF]" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chargement des données...</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            
            {/* --- VUE MEMBRES --- */}
            {activeTab === 'membres' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                {members.length === 0 ? (
                  <div className="col-span-full text-center py-20 text-slate-400 font-bold italic uppercase tracking-widest">L'organigramme est en cours de mise à jour.</div>
                ) : (
                  members.map((m) => (
                    <div key={m._id} className="text-center group">
                      <div className="w-48 h-48 mx-auto mb-6 bg-slate-100 dark:bg-[#081031] rounded-[3rem] rotate-3 group-hover:rotate-6 transition-transform flex items-center justify-center border-4 border-[#0EE2E2]/20 relative overflow-hidden shadow-lg">
                        {m.photo ? (
                          <img src={m.photo} alt={`${m.prenom} ${m.nom}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        ) : (
                          <User size={80} className="text-slate-300 dark:text-slate-700" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0065FF]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <h3 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white leading-none mb-2">
                        {m.prenom} <br/><span className="text-[#0065FF]">{m.nom}</span>
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0EE2E2] mb-4">{m.role}</p>
                      {m.mail && (
                        <a href={`mailto:${m.mail}`} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0065FF] dark:hover:text-[#0EE2E2] transition-colors">
                          <Mail size={14} /> {m.mail}
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* --- VUE COMPTES-RENDUS --- */}
            {activeTab === 'cr' && (
              <div className="space-y-4 max-w-4xl mx-auto">
                <div className="bg-blue-50 dark:bg-blue-500/10 p-6 rounded-3xl mb-12 flex items-center gap-6 border border-blue-100 dark:border-blue-500/20">
                  <div className="bg-[#0065FF] p-4 rounded-2xl text-white shadow-lg shadow-[#0065FF]/20"><FileText size={28} /></div>
                  <div>
                    <h4 className="font-black uppercase text-sm text-[#081031] dark:text-white mb-1">Espace Documents</h4>
                    <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">Retrouvez les procès-verbaux officiels des Assemblées Générales et des réunions de bureau.</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {reports.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 font-bold italic uppercase tracking-widest">Aucun document n'a été publié pour le moment.</div>
                  ) : (
                    reports.map((report, i) => (
                      <div key={report._id} className="flex items-center justify-between p-6 bg-white dark:bg-[#0f172a] border-2 border-slate-50 dark:border-white/5 rounded-[2rem] hover:border-[#0EE2E2]/40 hover:shadow-xl transition-all group">
                        <div className="flex items-center gap-5">
                          <span className="text-slate-200 dark:text-slate-800 font-black italic text-3xl transition-colors group-hover:text-[#0EE2E2]/20">{(i + 1).toString().padStart(2, '0')}</span>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {report.type === 'texte' ? (
                                <Sparkles size={14} className="text-purple-500" />
                              ) : (
                                <FileText size={14} className="text-red-500" />
                              )}
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Réunion du {report.date}</span>
                            </div>
                            <span className="font-[900] uppercase italic text-[#081031] dark:text-white tracking-tight text-base sm:text-lg group-hover:text-[#0065FF] dark:group-hover:text-[#0EE2E2] transition-colors">{report.titre}</span>
                          </div>
                        </div>
                        
                        {report.type === 'texte' ? (
                          <button 
                            onClick={() => setViewingReport(report)}
                            className="bg-[#081031] dark:bg-white/10 text-white p-4 rounded-2xl hover:bg-[#F72585] dark:hover:bg-white/20 transition-all flex items-center gap-2 font-black uppercase text-[10px] tracking-widest shadow-lg"
                          >
                            <Eye size={20} /> <span className="hidden sm:inline">Lire le CR</span>
                          </button>
                        ) : (
                          <a 
                            href={report.fichier} 
                            download={`${report.titre}.pdf`}
                            className="bg-[#081031] dark:bg-white/10 text-white p-4 rounded-2xl hover:bg-[#0065FF] dark:hover:bg-white/20 transition-all shadow-lg"
                            title="Télécharger le PDF"
                          >
                            <Download size={20} />
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      {/* --- MODALE DE LECTURE CR IA --- */}
      {viewingReport && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#081031]/90 backdrop-blur-md animate-in fade-in" onClick={() => setViewingReport(null)}></div>
          
          <div className="relative bg-white dark:bg-[#081031] w-full max-w-4xl max-h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/10 animate-in zoom-in-95 duration-300">
            
            {/* Header Modale */}
            <div className="p-8 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-[#040817]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 text-purple-500 rounded-2xl flex items-center justify-center">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase italic text-[#081031] dark:text-white leading-none mb-1">{viewingReport.titre}</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Synthèse IA de la réunion du {viewingReport.date}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingReport(null)}
                className="p-3 bg-white dark:bg-white/10 rounded-full text-slate-400 hover:text-red-500 transition-all shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenu Texte */}
            <div className="p-8 lg:p-12 overflow-y-auto hide-scrollbar bg-white dark:bg-[#081031]">
              <div className="prose dark:prose-invert max-w-none text-sm sm:text-base font-medium leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                {viewingReport.contenu}
              </div>
            </div>

            {/* Footer Modale */}
            <div className="p-6 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-[#040817] flex justify-end">
              <button 
                onClick={() => setViewingReport(null)}
                className="px-8 py-3 bg-[#081031] dark:bg-white text-white dark:text-[#081031] rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all"
              >
                Fermer la lecture
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}