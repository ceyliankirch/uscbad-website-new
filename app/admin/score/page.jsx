'use client';
import React, { useState, useEffect } from 'react';
import { Save, Trophy, Clock, Shield, Image as ImageIcon, Palette } from 'lucide-react';

export default function ScoreAdmin() {
  const [division, setDivision] = useState('NATIONALE 1 | J05');
  const [date, setDate] = useState('14 MARS - 20:00');
  
  const [homeTeam, setHomeTeam] = useState('US CRÉTEIL');
  const [homeScore, setHomeScore] = useState('5');
  const [homeLogo, setHomeLogo] = useState(''); 
  const [homeColor, setHomeColor] = useState('#0EE2E2'); 
  
  const [awayTeam, setAwayTeam] = useState('RACING CLUB');
  const [awayScore, setAwayScore] = useState('3');
  const [awayLogo, setAwayLogo] = useState('');
  const [awayColor, setAwayColor] = useState('#081031');

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/score')
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          setDivision(result.data.division || '');
          setDate(result.data.date || '');
          setHomeTeam(result.data.homeTeam || '');
          setHomeScore(result.data.homeScore || '0');
          setHomeLogo(result.data.homeLogo || '');
          setHomeColor(result.data.homeColor || '#0EE2E2');
          setAwayTeam(result.data.awayTeam || '');
          setAwayScore(result.data.awayScore || '0');
          setAwayLogo(result.data.awayLogo || '');
          setAwayColor(result.data.awayColor || '#081031');
        }
      })
      .catch(err => console.error("Erreur de chargement:", err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          division, date, homeTeam, homeScore, homeLogo, homeColor, awayTeam, awayScore, awayLogo, awayColor
        })
      });
      if (response.ok) alert('✅ Configuration sauvegardée !');
    } catch (error) {
      alert('❌ Erreur de connexion.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-12 p-4 lg:p-8 font-['Montserrat'] max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-[900] italic uppercase text-[#081031] dark:text-white">
          Scoreboard <span className="text-[#0065FF]">Studio</span>
        </h1>
        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Édition du Live Score</p>
      </div>

      {/* FORMULAIRE - OCCUPE TOUTE LA LARGEUR */}
      <form onSubmit={handleSave} className="bg-white dark:bg-[#081031] p-6 lg:p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* INFOS GENERALES */}
          <div className="space-y-6">
            <h3 className="font-[900] uppercase text-xs flex items-center gap-2 text-slate-400 italic">
              <Clock size={16} /> Configuration du match
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1">Division</label>
                <input type="text" value={division} onChange={(e) => setDivision(e.target.value)} className="w-full bg-slate-50 dark:bg-[#040817] p-4 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-[#0065FF] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1">Date</label>
                <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-50 dark:bg-[#040817] p-4 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-[#0065FF] outline-none" />
              </div>
            </div>
          </div>

          {/* ACTION SUBMIT */}
          <div className="flex items-end">
            <button type="submit" disabled={isSaving} className="w-full bg-[#0065FF] text-white p-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-[#081031] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#0065FF]/20">
              <Save size={20}/> {isSaving ? 'Publication...' : 'Mettre à jour le live'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100 dark:border-white/5">
          {/* Domicile */}
          <div className="space-y-4">
            <h3 className="font-[900] text-[#0EE2E2] flex items-center gap-2 italic uppercase text-xs tracking-widest"><Shield size={16}/> Équipe Domicile</h3>
            <div className="grid grid-cols-1 gap-4">
              <input type="text" value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} className="w-full font-bold text-sm p-4 rounded-2xl bg-slate-50 dark:bg-[#040817] border-none outline-none focus:ring-2 focus:ring-[#0EE2E2]" placeholder="Nom du club"/>
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-1">
                   <label className="text-[9px] font-black uppercase opacity-50 ml-1">Logo Club</label>
                   <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, setHomeLogo)} className="text-[10px] w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-[#0EE2E2] file:text-[#081031] cursor-pointer"/>
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase opacity-50 ml-1">Couleur</label>
                   <input type="color" value={homeColor} onChange={(e) => setHomeColor(e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer overflow-hidden border-none bg-transparent block"/>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase opacity-50 ml-1">Score Actuel</label>
                <input type="number" value={homeScore} onChange={(e) => setHomeScore(e.target.value)} className="w-full text-4xl font-black text-center p-4 rounded-2xl bg-slate-50 dark:bg-[#040817] border-none" />
              </div>
            </div>
          </div>

          {/* Extérieur */}
          <div className="space-y-4">
            <h3 className="font-[900] text-slate-400 flex items-center gap-2 italic uppercase text-xs tracking-widest"><Shield size={16}/> Équipe Extérieur</h3>
            <div className="grid grid-cols-1 gap-4">
              <input type="text" value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} className="w-full font-bold text-sm p-4 rounded-2xl bg-slate-50 dark:bg-[#040817] border-none outline-none focus:ring-2 focus:ring-slate-400" placeholder="Nom du club"/>
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-1">
                   <label className="text-[9px] font-black uppercase opacity-50 ml-1">Logo Club</label>
                   <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, setAwayLogo)} className="text-[10px] w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-slate-200 file:text-[#081031] cursor-pointer"/>
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase opacity-50 ml-1">Couleur</label>
                   <input type="color" value={awayColor} onChange={(e) => setAwayColor(e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer overflow-hidden border-none bg-transparent block"/>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase opacity-50 ml-1">Score Actuel</label>
                <input type="number" value={awayScore} onChange={(e) => setAwayScore(e.target.value)} className="w-full text-4xl font-black text-center p-4 rounded-2xl bg-slate-50 dark:bg-[#040817] border-none" />
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* APERÇU DYNAMIQUE - EN DESSOUS ET LARGE */}
      <div className="space-y-6 pt-10">
        <h3 className="font-[900] uppercase text-[14px] flex items-center gap-2 italic">
          <Trophy size={20} className="text-yellow-500"/> Rendu Final (Page d'accueil)
        </h3>
        <div className="bg-slate-100 dark:bg-[#040817] p-12 rounded-[3rem] flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-white/10 overflow-x-auto">
          
          {/* LE SCOREBOARD DYNAMIQUE */}
          <div className="relative font-['Montserrat'] flex shadow-2xl min-w-[900px] w-full h-[130px] bg-white items-center overflow-hidden rounded-2xl">
            
            {/* Badges (Division & Date) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center z-30 shadow-md">
              <div className="bg-[#0EE2E2] text-[#081031] px-6 py-1.5 font-[900] uppercase text-[11px] tracking-tighter italic">
                {division}
              </div>
              <div className="bg-[#0065FF] text-white px-6 py-1.5 font-[900] uppercase text-[11px] tracking-tighter italic whitespace-nowrap">
                {date}
              </div>
            </div>

            {/* PARTIE GAUCHE - DOMICILE */}
            <div className="flex-[3] h-full flex items-center relative min-w-0">
              <div className="w-[140px] h-full bg-white flex items-center justify-center shrink-0 border-l-[8px]" style={{ borderColor: homeColor }}>
                <div className="w-20 h-20 rounded-full border border-slate-100 flex items-center justify-center overflow-hidden bg-slate-50 shadow-inner">
                  {homeLogo ? (
                    <img src={homeLogo} alt="Logo Dom" className="w-full h-full object-contain p-3" />
                  ) : (
                    <span className="text-[10px] font-black text-slate-300 italic">LOGO</span>
                  )}
                </div>
              </div>
              <div style={{ backgroundColor: homeColor }} className="flex-1 h-full flex flex-col justify-center items-end pr-10 transition-colors duration-500 min-w-0">
                <h3 className="text-4xl font-[900] uppercase text-[#081031] leading-none tracking-tighter italic truncate w-full text-right">{homeTeam}</h3>
                <span className="bg-[#081031] text-white px-3 py-1 font-[900] uppercase text-[9px] tracking-[0.2em] mt-2 italic shadow-lg">DOMICILE</span>
              </div>
            </div>

            {/* CENTRE - LE SCORE */}
            <div className="w-[160px] h-full bg-[#0065FF] flex items-center justify-center relative z-20 shadow-[0_0_40px_rgba(0,101,255,0.4)]">
              <div className="flex items-center gap-5 text-white font-[900]">
                <span className="text-7xl tracking-tighter italic drop-shadow-md">{homeScore}</span>
                <div className="w-1 h-16 bg-white/20 rounded-full"></div>
                <span className="text-7xl tracking-tighter italic drop-shadow-md">{awayScore}</span>
              </div>
            </div>

            {/* PARTIE DROITE - EXTÉRIEUR */}
            <div className="flex-[3] h-full flex items-center relative min-w-0">
              <div style={{ backgroundColor: awayColor }} className="flex-1 h-full flex flex-col justify-center items-start pl-10 transition-colors duration-500 min-w-0">
                <h3 className="text-4xl font-[900] uppercase text-white leading-none tracking-tighter italic truncate w-full text-left">{awayTeam}</h3>
                <span className="bg-white text-[#081031] px-3 py-1 font-[900] uppercase text-[9px] tracking-[0.2em] mt-2 italic shadow-lg">EXTÉRIEUR</span>
              </div>
              <div className="w-[140px] h-full bg-white flex items-center justify-center shrink-0 border-r-[8px]" style={{ borderColor: awayColor }}>
                <div className="w-20 h-20 rounded-full border border-slate-100 flex items-center justify-center overflow-hidden bg-slate-50 shadow-inner">
                  {awayLogo ? (
                    <img src={awayLogo} alt="Logo Ext" className="w-full h-full object-contain p-3" />
                  ) : (
                    <span className="text-[10px] font-black text-slate-300 italic">LOGO</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}