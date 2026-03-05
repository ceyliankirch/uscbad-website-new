'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Users, Trophy, MapPin, Target, Shield, Heart, ArrowRight, ExternalLink, Mail, Phone, Loader2, Link } from 'lucide-react';

// Composant Helper pour rendre les icônes dynamiquement
const IconRenderer = ({ name, size = 28 }) => {
  const icons = { Users, Trophy, MapPin, Target, Shield, Heart };
  const IconComponent = icons[name] || MapPin;
  return <IconComponent size={size} />;
};

export default function PresentationPage() {
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/admin/presentation-config');
        const json = await res.json();
        if (json.success) {
          setConfig(json.data);
        }
      } catch (error) {
        console.error("Erreur de chargement de la présentation", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  if (isLoading || !config) {
    return <div className="min-h-screen flex items-center justify-center bg-[#040817]"><Loader2 className="animate-spin text-[#0065FF]" size={48} /></div>;
  }

  return (
    <div className="bg-white dark:bg-[#040817] min-h-screen font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300 pb-20">
      
      {/* =========================================================
          SECTION 1 : HERO 
          ========================================================= */}
      <section className="relative w-full h-[60svh] lg:h-[75svh] min-h-[500px] flex flex-col justify-center items-center text-center overflow-hidden bg-[#081031]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0"></div>
        <img 
          src={config.hero.coverImage} 
          alt="Couverture" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 object-center z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#081031]/80 via-transparent to-[#081031] z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-[#0065FF] rounded-full blur-[150px] opacity-30 pointer-events-none z-0"></div>

        <div className="relative z-20 px-6 max-w-4xl mx-auto mt-16 flex flex-col items-center">
          <img src="/logo-uscbadminton.png" alt="Logo USC Badminton" className="h-20 md:h-24 w-auto mb-6 drop-shadow-lg" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0065FF] text-white rounded-full font-[900] uppercase text-[10px] tracking-widest italic mb-6 shadow-lg">
            {config.hero.badgeText}
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-[900] uppercase italic tracking-tighter leading-[0.9] text-white drop-shadow-xl mb-6">
            {config.hero.title1} <span className="text-[#0EE2E2]">{config.hero.title2}</span>
          </h1>
          <p className="text-sm lg:text-lg font-bold text-slate-300 leading-relaxed max-w-2xl mx-auto whitespace-pre-wrap">
            {config.hero.description}
          </p>
        </div>
      </section>

      {/* =========================================================
          SECTION 2 : CHIFFRES CLÉS
          ========================================================= */}
      <section className="relative z-30 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 lg:-mt-24 mb-20">
        <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 lg:p-10 shadow-2xl border border-slate-100 dark:border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {config.stats.map((stat, idx) => (
            <StatBlock 
              key={idx} 
              icon={<IconRenderer name={stat.icon} />} 
              value={stat.value} 
              suffix={stat.suffix} 
              label={stat.label} 
              color={stat.color} 
            />
          ))}
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
                {config.history.title1} <span className="text-[#0065FF]">{config.history.title2}</span>
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] lg:text-xs">{config.history.subtitle}</p>
            </div>

            <div className="space-y-6 text-sm lg:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
              <p>{config.history.p1}</p>
              <p>{config.history.p2}</p>
              <blockquote className="border-l-4 border-[#0EE2E2] pl-5 italic text-[#081031] dark:text-white font-[900] text-lg lg:text-xl">
                "{config.history.quote}"
              </blockquote>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <ValueCard icon={<Heart />} title="Convivialité" desc="Un club ouvert à tous, du loisir à la compétition." color="#F72585" />
              <ValueCard icon={<Target />} title="Excellence" desc="Une formation reconnue par la FFBAD (3 étoiles)." color="#0065FF" />
            </div>
          </div>

          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4 lg:gap-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#0EE2E2] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
            
            <div className="space-y-4 lg:space-y-6 mt-12 lg:mt-24">
              <img src={config.history.img1} alt="Histoire 1" className="w-full rounded-[2rem] shadow-xl hover:scale-105 transition-transform duration-500 aspect-square object-cover" />
              <div className="bg-[#0065FF] rounded-[2rem] p-6 lg:p-8 text-white shadow-xl flex flex-col justify-center">
                <span className="text-4xl lg:text-5xl font-[900] italic">{config.history.img1Num}</span>
                <span className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">{config.history.img1Text}</span>
              </div>
            </div>
            
            <div className="space-y-4 lg:space-y-6">
              <div className="bg-[#081031] dark:bg-[#0EE2E2]/10 border border-transparent dark:border-[#0EE2E2]/20 rounded-[2rem] p-6 lg:p-8 text-white dark:text-[#0EE2E2] shadow-xl flex flex-col justify-center">
                <span className="text-4xl lg:text-5xl font-[900] italic">{config.history.img2Num}</span>
                <span className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">{config.history.img2Text}</span>
              </div>
              <img src={config.history.img2} alt="Histoire 2" className="w-full rounded-[2rem] shadow-xl hover:scale-105 transition-transform duration-500 aspect-[4/5] object-cover" />
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          SECTION 4 : PROFILS DE JEU
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
            {config.profiles.map((profile, idx) => (
              <ProfileCard 
                key={idx}
                title={profile.title} 
                subtitle={profile.subtitle}
                desc={profile.desc}
                img={profile.img}
                color={profile.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 5 : GYMNASES
          ========================================================= */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#0a0f25] border-y border-slate-200 dark:border-white/5 transition-colors">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-[900] uppercase italic tracking-tighter text-[#081031] dark:text-white">
              NOS <span className="text-[#0EE2E2]">INFRASTRUCTURES</span>
            </h2>
            <p className="text-sm lg:text-base font-bold text-slate-500 mt-4 max-w-2xl mx-auto">
              Le club évolue principalement sur des grands gymnases de la ville de Créteil, offrant des conditions de jeu optimales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {config.gyms.map((gym, idx) => (
              <div key={idx} className="group bg-white dark:bg-[#0f172a] rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="h-48 lg:h-64 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                  <img src={gym.img} alt={gym.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  {gym.badge && (
                    <div className="absolute top-4 left-4 bg-[#0065FF] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md z-10">
                      {gym.badge}
                    </div>
                  )}
                </div>
                <div className="p-8 lg:p-10">
                  <h3 className="text-2xl lg:text-3xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2">{gym.title}</h3>
                  <p className="flex items-center gap-2 text-xs lg:text-sm font-bold text-slate-500 mb-6">
                    <MapPin size={16} className="text-[#0EE2E2] shrink-0" /> {gym.address}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {gym.tags.map((tag, i) => (
                      <span key={i} className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">{tag}</span>
                    ))}
                  </div>
                  <a href={gym.mapLink || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full bg-[#081031] dark:bg-white text-white dark:text-[#081031] py-4 rounded-xl font-[900] uppercase text-xs tracking-widest hover:bg-[#0065FF] dark:hover:bg-[#0EE2E2] transition-colors shadow-md">
                    Voir sur la carte <ExternalLink size={16} className="ml-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 6 : LE STAFF
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

        {config.bureau.length > 0 && (
          <div className="mb-16">
            <h3 className="text-xl lg:text-2xl font-[900] italic uppercase text-[#081031] dark:text-white mb-6 border-l-4 border-[#0EE2E2] pl-4">
              Le Bureau
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {config.bureau.map((member, idx) => (
                <TeamContactCard key={idx} {...member} />
              ))}
            </div>
          </div>
        )}

        {config.coaches.length > 0 && (
          <div>
            <h3 className="text-xl lg:text-2xl font-[900] italic uppercase text-[#081031] dark:text-white mb-6 border-l-4 border-[#F72585] pl-4">
              Les Entraîneurs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {config.coaches.map((coach, idx) => (
                <TeamContactCard key={idx} {...coach} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* CALL TO ACTION */}
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
            <Link href="/inscriptions" className="w-full sm:w-auto bg-[#0065FF] text-white px-8 py-4 rounded-full font-[900] uppercase italic text-xs tracking-widest shadow-xl shadow-[#0065FF]/30 hover:scale-105 hover:bg-[#0EE2E2] hover:text-[#081031] transition-all flex items-center justify-center gap-2">
              M'inscrire <ArrowRight size={16} />
            </Link>
            <Link href="/creneaux" className="w-full sm:w-auto bg-white/10 text-white px-8 py-4 rounded-full font-[900] uppercase italic text-xs tracking-widest hover:bg-white hover:text-[#081031] transition-all flex items-center justify-center border border-white/20">
              Voir les créneaux
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

/* =========================================================
   SOUS-COMPOSANTS
   ========================================================= */

const TeamContactCard = ({ name, role, img, color, email, phone }) => (
  <div className="group bg-white dark:bg-[#0f172a] rounded-[1.5rem] p-4 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-lg dark:hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-row items-center">
    <div className="w-16 h-16 lg:w-20 lg:h-20 shrink-0 rounded-full overflow-hidden border-[3px] shadow-sm" style={{ borderColor: color }}>
      {img ? <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full bg-slate-200"></div>}
    </div>
    <div className="ml-4 flex flex-col min-w-0 flex-grow">
      <h4 className="text-base lg:text-lg font-[900] italic uppercase text-[#081031] dark:text-white leading-tight truncate">{name}</h4>
      <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest mt-0.5 mb-2 truncate" style={{ color: color === '#081031' ? '#0065FF' : color }}>{role}</span>
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

const ProfileCard = ({ title, subtitle, desc, img, color }) => (
  <div className="group relative h-[450px] lg:h-[500px] rounded-[2rem] overflow-hidden flex flex-col justify-end p-8 cursor-default border border-transparent dark:border-white/5">
    <div className="absolute inset-0 z-0">
      <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#081031] via-[#081031]/60 to-transparent"></div>
    </div>
    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" style={{ backgroundColor: color }}></div>
    <div className="relative z-10">
      <div className="w-12 h-1 mb-4 rounded-full transition-all duration-500 group-hover:w-20" style={{ backgroundColor: color }}></div>
      <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color }}>{subtitle}</div>
      <h3 className="text-3xl lg:text-4xl font-[900] uppercase italic text-white leading-none mb-4">{title}</h3>
      <p className="text-sm font-medium text-slate-300 leading-relaxed opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">{desc}</p>
    </div>
  </div>
);

const StatBlock = ({ icon, value, suffix, label, color }) => (
  <div className="flex flex-col items-center text-center group">
    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 shadow-md" style={{ backgroundColor: `${color}15`, color }}>
      {icon}
    </div>
    <div className="text-4xl lg:text-5xl font-[900] italic text-[#081031] dark:text-white leading-none mb-1 flex items-baseline">
      <AnimatedNumber value={value} />
      <span style={{ color }} className="text-2xl lg:text-3xl ml-1">{suffix}</span>
    </div>
    <div className="text-[10px] lg:text-xs font-black uppercase text-slate-400 tracking-widest">{label}</div>
  </div>
);

const ValueCard = ({ icon, title, desc, color }) => (
  <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-[1.5rem] border border-slate-100 dark:border-white/5 hover:border-transparent transition-colors group">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: `${color}20`, color }}>
      {icon}
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
        if (entry.isIntersecting && !hasAnimated) setHasAnimated(true);
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
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [hasAnimated, value, duration]);

  return <span ref={ref}>{count}</span>;
};