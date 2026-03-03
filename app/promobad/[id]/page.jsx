'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // <-- Le radar magique de Next.js
import { Calendar, MapPin, Users, Trophy, ExternalLink, Camera, Coffee, Medal, Info, ChevronRight, Loader2, Award } from 'lucide-react';

export default function ModeleTournoiUniversel() {
  const params = useParams();
  const tournoiId = params.id; // On récupère l'ID dans l'URL

  const [activeTab, setActiveTab] = useState('infos');
  const [dbData, setDbData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // APPEL API : On cherche le tournoi par son ID
  useEffect(() => {
    const fetchTournamentInfo = async () => {
      try {
        const res = await fetch('/api/tournaments');
        const json = await res.json();
        
        if (json.success) {
          // On fouille dans la base de données pour trouver celui qui a le bon ID
          const foundTournament = json.data.find(t => t._id === tournoiId);
          if (foundTournament) {
            setDbData(foundTournament);
          }
        }
      } catch (error) {
        console.error("Erreur de connexion DB:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (tournoiId) fetchTournamentInfo();
  }, [tournoiId]);

  // Si on n'a rien trouvé (mauvais lien)
  if (!isLoading && !dbData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#081031] text-white">
        <Trophy size={64} className="text-slate-600 mb-6" />
        <h1 className="text-4xl font-black uppercase italic mb-4">Tournoi introuvable</h1>
        <p className="text-slate-400">Cet événement n'existe pas ou a été supprimé.</p>
        <a href="/tournois" className="mt-8 px-6 py-3 bg-[#F72585] rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform">Retour aux tournois</a>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300 pb-20">
      
      {/* SECTION 1 : HERO */}
      <section className="relative w-full h-[80svh] min-h-[600px] flex flex-col justify-center items-center text-center overflow-hidden bg-[#081031]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity" 
          style={{ backgroundImage: `url('${dbData?.heroImage || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop"}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#081031]/80 via-[#081031]/90 to-[#081031] z-0"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full blur-[150px] opacity-25 pointer-events-none z-0 transition-colors duration-700" style={{ backgroundColor: dbData?.color || '#0065FF' }}></div>

        <div className="relative z-20 px-6 max-w-5xl mx-auto mt-20 flex flex-col items-center">
          
          <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center p-4 mb-8 shadow-lg overflow-hidden">
            {dbData?.tournamentLogo ? (
              <img src={dbData.tournamentLogo} alt="Logo" className="w-full h-full object-contain filter drop-shadow-lg" />
            ) : (
              <Award size={48} className="drop-shadow-lg" style={{ color: dbData?.color || '#0065FF' }} />
            )}
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2 border text-white rounded-full font-[900] uppercase text-xs tracking-widest italic mb-6 shadow-lg backdrop-blur-md transition-colors" style={{ backgroundColor: dbData?.color ? `${dbData.color}33` : '#0065FF33', borderColor: dbData?.color ? `${dbData.color}80` : '#0065FF80' }}>
            {dbData?.subtitle || "Édition Inédite"}
          </div>
          
          <div className="mb-6 flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-[900] uppercase italic tracking-tighter leading-tight text-white drop-shadow-2xl mb-3 py-2">
              {dbData?.title || 'CHARGEMENT...'}
            </h1>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm md:text-base font-bold text-slate-300 mb-10">
            {isLoading ? (
              <span className="flex items-center gap-2"><Loader2 size={18} className="animate-spin" style={{ color: dbData?.color || '#0065FF' }} /> Chargement...</span>
            ) : (
              <>
                <span className="flex items-center gap-2"><Calendar size={18} style={{ color: dbData?.color || '#0065FF' }} /> {dbData?.dateStr || "Dates à venir"}</span>
                <span className="flex items-center gap-2"><MapPin size={18} style={{ color: dbData?.color || '#0065FF' }} /> {dbData?.location || "Lieu à venir"}</span>
                <span className="flex items-center gap-2"><Users size={18} style={{ color: dbData?.color || '#0065FF' }} /> {dbData?.levels || "Séries à venir"}</span>
              </>
            )}
          </div>

          {!dbData || dbData.status === 'a_venir' ? (
            <div className="inline-flex items-center justify-center px-10 py-5 bg-white/5 border border-white/10 text-slate-400 rounded-full font-[900] uppercase italic text-sm md:text-base tracking-widest cursor-not-allowed select-none">Inscriptions à venir</div>
          ) : dbData.status === 'ouvert' ? (
            <a href={dbData.registrationLink || "#"} target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-white rounded-full font-[900] uppercase italic text-sm md:text-base tracking-widest overflow-hidden transition-all hover:scale-105" style={{ backgroundColor: dbData?.color || '#0065FF', boxShadow: `0 0 40px ${dbData?.color ? dbData.color + '66' : 'rgba(0,101,255,0.4)'}` }}>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative z-10 flex items-center gap-2">S'inscrire <ExternalLink size={18} /></span>
            </a>
          ) : dbData.status === 'complet' ? (
            <div className="inline-flex items-center justify-center px-10 py-5 bg-red-500 text-white rounded-full font-[900] uppercase italic text-sm md:text-base tracking-widest shadow-[0_0_30px_rgba(239,68,68,0.4)]">Complet</div>
          ) : (
            <div className="inline-flex items-center justify-center px-10 py-5 bg-slate-800 text-slate-300 rounded-full font-[900] uppercase italic text-sm md:text-base tracking-widest">Terminé</div>
          )}
        </div>
      </section>

      {/* SECTION 2 : ONGLETS */}
      <div className="sticky top-[80px] z-40 bg-white/90 dark:bg-[#081031]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto hide-scrollbar">
            {[
              { id: 'infos', label: 'Informations', icon: <Info size={16} /> },
              { id: 'palmares', label: 'Résultats', icon: <Trophy size={16} /> },
              { id: 'galerie', label: 'Galerie', icon: <Camera size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-5 font-black uppercase text-xs md:text-sm tracking-widest whitespace-nowrap border-b-2 ${activeTab === tab.id ? 'border-[#0065FF] text-[#0065FF]' : 'border-transparent text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
                style={activeTab === tab.id && dbData?.color ? { borderColor: dbData.color, color: dbData.color } : {}}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENU DES ONGLETS */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 min-h-[500px]">
        
        {/* ONGLET 1 : INFORMATIONS & VISUEL */}
        {activeTab === 'infos' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 md:space-y-12">
            
            {/* LIGNE 1 : DESCRIPTION & AFFICHE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
              <div className={`space-y-8 ${dbData?.mainVisual ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                {/* Le mot du club */}
                <div className="bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] p-8 md:p-12 border border-slate-200 dark:border-white/5 relative overflow-hidden group shadow-sm transition-colors">
                  <h3 className="text-2xl md:text-3xl font-[900] uppercase italic text-[#081031] dark:text-white mb-6 pt-2">
                    Le mot du Club
                  </h3>
                  <p className="font-medium text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {dbData?.description || "Ajoutez une description depuis votre espace Admin."}
                  </p>
                </div>
              </div>

              {/* L'AFFICHE OFFICIELLE */}
              {dbData?.mainVisual && (
                <div className="lg:col-span-1">
                  <div className="sticky top-40">
                    <h4 className="font-[900] uppercase italic text-slate-400 mb-4 text-[10px] tracking-[0.2em] text-center lg:text-left">Affiche Officielle</h4>
                    <div className="relative group cursor-zoom-in">
                      <div className="relative aspect-[1080/1350] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-white/10 bg-slate-200">
                        <img src={dbData.mainVisual} alt="Affiche du tournoi" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-[#040817] z-10" style={{ backgroundColor: dbData?.color || '#0065FF' }}>
                        <Trophy size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* LIGNE 2 : TABLEAUX & PROGRAMME */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] p-8 md:p-10 border border-slate-200 dark:border-white/5 relative overflow-hidden group h-full shadow-sm transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" style={{ backgroundColor: dbData?.color || '#0065FF' }}></div>
                <h3 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white mb-6 flex items-center gap-3 relative z-10">
                  <Medal style={{ color: dbData?.color || '#0065FF' }} /> Les Tableaux
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-6 leading-relaxed relative z-10">
                  Compétition ouverte aux classements : <strong className="text-[#081031] dark:text-white">{dbData?.levels || "Non spécifié"}</strong>.
                </p>
                <div className="flex flex-wrap gap-3 relative z-10">
                  {(dbData?.disciplines ? dbData.disciplines.split(',') : ['Simples', 'Doubles', 'Mixtes']).map((disc, idx) => (
                    <span key={idx} className="bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 shadow-sm">
                      {disc.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] p-8 md:p-10 border border-slate-200 dark:border-white/5 relative overflow-hidden group h-full shadow-sm transition-colors">
                <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" style={{ backgroundColor: dbData?.color || '#0065FF' }}></div>
                <h3 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white mb-6 flex items-center gap-3 relative z-10">
                  <Calendar style={{ color: dbData?.color || '#0065FF' }} /> Le Programme
                </h3>
                <ul className="space-y-4 relative z-10">
                  <li className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent text-[#081031] dark:text-white shadow-sm rounded-xl flex items-center justify-center font-black text-xl shrink-0">1</div>
                    <div>
                      <h4 className="font-bold text-[#081031] dark:text-white uppercase tracking-wider">Dates officielles</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{dbData?.dateStr || "À définir"}</p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent text-[#081031] dark:text-white shadow-sm rounded-xl flex items-center justify-center font-black text-xl shrink-0">2</div>
                    <div>
                      <h4 className="font-bold text-[#081031] dark:text-white uppercase tracking-wider">Convocations</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Disponibles sur BadNet quelques jours avant le début de la compétition.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* LIGNE 3 : BUVETTE & SPONSOR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${dbData?.sponsor?.name ? 'md:col-span-2' : 'md:col-span-3'} rounded-[2rem] p-8 md:p-10 flex flex-col justify-center text-white relative overflow-hidden shadow-md transition-colors`} style={{ backgroundColor: dbData?.color || '#0065FF' }}>
                <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
                  <Coffee size={200} className="translate-x-1/4 translate-y-1/4" />
                </div>
                <h3 className="text-3xl font-[900] uppercase italic mb-4 relative z-10">Buvette sur place</h3>
                <p className="font-bold max-w-lg leading-relaxed relative z-10 opacity-90">
                  {dbData?.buvetteDescription || "Les joueurs et supporters pourront profiter de notre espace buvette tout au long de l'événement. Croque-monsieurs, crêpes, boissons et snacks pour recharger les batteries !"}
                </p>
              </div>
              
              {dbData?.sponsor?.name && (
                <div className="bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] p-8 flex flex-col items-center justify-center text-center border border-slate-200 dark:border-white/5 shadow-sm transition-colors">
                  {dbData.sponsor.logoUrl ? (
                    <img src={dbData.sponsor.logoUrl} alt={dbData.sponsor.name} className="h-16 md:h-20 object-contain mb-4" />
                  ) : (
                    <div className="w-16 h-16 bg-white dark:bg-black/50 shadow-sm border border-slate-100 dark:border-white/10 rounded-full flex items-center justify-center mb-4">
                      <span className="font-black text-2xl" style={{ color: dbData?.color || '#0065FF' }}>{dbData.sponsor.name.charAt(0)}</span>
                    </div>
                  )}
                  <h4 className="font-[900] uppercase italic text-[#081031] dark:text-white mb-2">Stand {dbData.sponsor.name}</h4>
                  {dbData.sponsor.website ? (
                     <a href={dbData.sponsor.website} target="_blank" rel="noreferrer" className="text-xs font-bold hover:underline flex items-center gap-1" style={{ color: dbData?.color || '#0065FF' }}>Visiter le site <ExternalLink size={12} /></a>
                  ) : (
                     <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Partenaire de l'événement.</p>
                  )}
                </div>
              )}
            </div>

            {/* LIGNE 4 : ACCÈS & GYMNASE */}
            <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] p-4 pr-8 border border-slate-200 dark:border-white/5 shadow-sm transition-colors">
              <div className="w-full md:w-1/3 aspect-video bg-slate-200 dark:bg-black rounded-xl overflow-hidden relative">
                <img src={dbData?.gymImage || "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=800&auto=format&fit=crop"} alt="Gymnase" className="w-full h-full object-cover opacity-70 dark:opacity-50" />
                <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-md" size={32} />
              </div>
              <div className="w-full md:w-2/3 py-4 flex flex-col items-start">
                <h3 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white mb-2">Accès & Gymnase</h3>
                <p className="font-bold mb-4" style={{ color: dbData?.color || '#0065FF' }}>{dbData?.location || "Lieu à définir"}</p>
                
                <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-600 dark:text-slate-400 mb-6">
                  {(dbData?.amenities ? dbData.amenities.split(',') : ['Parking gratuit sur place', 'Vestiaires & Douches', 'Tribunes']).map((amenity, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      <ChevronRight size={14} style={{ color: dbData?.color || '#0065FF' }}/> 
                      {amenity.trim()}
                    </span>
                  ))}
                </div>

                {dbData?.googleMapsLink && (
                  <a 
                    href={dbData.googleMapsLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-black uppercase text-xs tracking-widest shadow-md hover:shadow-lg transition-transform hover:scale-105"
                    style={{ backgroundColor: dbData?.color || '#0065FF' }}
                  >
                    <MapPin size={16} /> Y aller
                  </a>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ONGLET 2 : PALMARÈS */}
        {activeTab === 'palmares' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-[900] uppercase italic text-[#081031] dark:text-white mb-8">Résultats</h2>
            {!dbData?.palmares || dbData.palmares.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/10 border-dashed">
                <Trophy size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="font-bold text-slate-500 uppercase tracking-widest text-sm">Palmarès à venir.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {dbData.palmares.map((serie, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-[#0f172a] rounded-[1.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-white/5" style={{ backgroundColor: dbData?.color ? `${dbData.color}1A` : '#0065FF1A' }}>
                      <h3 className="font-[900] uppercase tracking-widest" style={{ color: dbData?.color || '#0065FF' }}>{serie.serie}</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                      {serie.sh && <ResultItem discipline="SH" vainqueur={serie.sh} />}
                      {serie.sd && <ResultItem discipline="SD" vainqueur={serie.sd} />}
                      {serie.dh && <ResultItem discipline="DH" vainqueur={serie.dh} />}
                      {serie.dd && <ResultItem discipline="DD" vainqueur={serie.dd} />}
                      {serie.dx && <ResultItem discipline="DX" vainqueur={serie.dx} />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ONGLET 3 : GALERIE (CARTE SIMPLE) */}
        {activeTab === 'galerie' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto py-8">
            {!dbData?.googlePhotosLink ? (
              <div className="text-center py-20 bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
                <Camera size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-xl font-bold text-[#081031] dark:text-white uppercase italic mb-2">Galerie à venir</h3>
                <p className="font-bold text-slate-500 uppercase tracking-widest text-sm">Les photos seront disponibles après l'événement.</p>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] p-10 md:p-16 border border-slate-200 dark:border-white/5 shadow-sm text-center flex flex-col items-center relative overflow-hidden group transition-colors">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" style={{ backgroundColor: dbData?.color || '#0065FF' }}></div>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg relative z-10" style={{ backgroundColor: dbData?.color ? `${dbData.color}1A` : '#0065FF1A', color: dbData?.color || '#0065FF' }}>
                  <Camera size={40} />
                </div>
                <h3 className="text-3xl md:text-4xl font-[900] uppercase italic text-[#081031] dark:text-white mb-4 relative z-10">Revivez l'événement</h3>
                <p className="font-medium text-slate-600 dark:text-slate-400 mb-8 max-w-lg relative z-10">Découvrez l'intégralité des photos du tournoi ! Podiums, actions sur les terrains et moments de partage vous attendent dans notre album complet.</p>
                <a href={dbData.googlePhotosLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-black uppercase text-sm md:text-base tracking-widest shadow-lg hover:shadow-xl transition-transform hover:scale-105 relative z-10" style={{ backgroundColor: dbData?.color || '#0065FF' }}>
                  <Camera size={20} /> Ouvrir l'album photo
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const ResultItem = ({ discipline, vainqueur }) => (
  <div className="flex flex-col">
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{discipline}</span>
    <div className="flex items-center gap-2 text-sm font-bold text-[#081031] dark:text-white">
      <Medal size={14} className="text-[#FFD500] shrink-0" />
      <span className="truncate" title={vainqueur}>{vainqueur}</span>
    </div>
  </div>
);