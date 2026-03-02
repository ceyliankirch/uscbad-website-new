'use client';
import React, { useState, useEffect } from 'react';
import { Save, Trophy, Clock, Shield, Type } from 'lucide-react';

export default function ScoreAdmin() {
  const [division, setDivision] = useState('NATIONALE 1 | J05');
  const [date, setDate] = useState('14 MARS - 20:00');
  
  const [homeTeam, setHomeTeam] = useState('US CRÉTEIL');
  const [homeScore, setHomeScore] = useState('5');
  const [homeLogo, setHomeLogo] = useState(''); 
  const [homeColor, setHomeColor] = useState('#0EE2E2'); 
  const [homeTextColor, setHomeTextColor] = useState('#081031'); // Par défaut noir/bleu
  
  const [awayTeam, setAwayTeam] = useState('RACING CLUB');
  const [awayScore, setAwayScore] = useState('3');
  const [awayLogo, setAwayLogo] = useState('');
  const [awayColor, setAwayColor] = useState('#081031');
  const [awayTextColor, setAwayTextColor] = useState('#FFFFFF'); // Par défaut blanc

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
          setHomeTextColor(result.data.homeTextColor || '#081031');
          setAwayTeam(result.data.awayTeam || '');
          setAwayScore(result.data.awayScore || '0');
          setAwayLogo(result.data.awayLogo || '');
          setAwayColor(result.data.awayColor || '#081031');
          setAwayTextColor(result.data.awayTextColor || '#FFFFFF');
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
          division, date, 
          homeTeam, homeScore, homeLogo, homeColor, homeTextColor,
          awayTeam, awayScore, awayLogo, awayColor, awayTextColor
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

      <form onSubmit={handleSave} className="bg-white dark:bg-[#081031] p-6 lg:p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="font-[900] uppercase text-xs flex items-center gap-2 text-slate-400 italic">
              <Clock size={16} /> Configuration du match
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1">Division</label>
                <input type="text" value={division} onChange={(e) => setDivision(e.target.value)} className="w-full bg-slate-50 dark:bg-[#040817] p-4 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-[#0065FF] outline-none text-black dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1">Date</label>
                <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-50 dark:bg-[#040817] p-4 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-[#0065FF] outline-none text-black dark:text-white" />
              </div>
            </div>
          </div>

          <div className="flex items-end">
            <button type="submit" disabled={isSaving} className="w-full bg-[#0065FF] text-white p-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-[#081031] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#0065FF]/20">
              <Save size={20}/> {isSaving ? 'Publication...' : 'Mettre à jour le live'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100 dark:border-white/5">
          {/* DOMICILE */}
          <div className="space-y-4">
            <h3 className="font-[900] text-[#0EE2E2] flex items-center gap-2 italic uppercase text-xs tracking-widest"><Shield size={16}/> Équipe Domicile</h3>
            <div className="grid grid-cols-1 gap-4">
              <input type="text" value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} className="w-full font-bold text-sm p-4 rounded-2xl bg-slate-50 dark:bg-[#040817] border-none outline-none focus:ring-2 focus:ring-[#0EE2E2] text-black dark:text-white" placeholder="Nom du club"/>
              
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-[#040817] p-4 rounded-2xl">
                <div className="flex-1 space-y-1">
                   <label className="text-[9px] font-black uppercase opacity-50 ml-1 dark:text-white">Logo</label>
                   <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, setHomeLogo)} className="text-[10px] w-full cursor-pointer dark:text-white"/>
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase opacity-50 ml-1 dark:text-white">Couleur</label>
                   <input type="color" value={homeColor} onChange={(e) => setHomeColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer block bg-transparent border-none"/>
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase opacity-50 ml-1 dark:text-white text-center block">Typo</label>
                   <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                      <button type="button" onClick={() => setHomeTextColor('#FFFFFF')} className={`p-2 rounded ${homeTextColor === '#FFFFFF' ? 'bg-[#0065FF] text-white' : 'text-slate-400'}`}><Type size={14}/></button>
                      <button type="button" onClick={() => setHomeTextColor('#081031')} className={`p-2 rounded ${homeTextColor === '#081031' ? 'bg-[#0065FF] text-white' : 'text-slate-400'}`}><Type size={14} className="fill-current"/></button>
                   </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase opacity-50 ml-1 dark:text-white">Score</label>
                <input type="number" value={homeScore} onChange={(e) => setHomeScore(e.target.value)} className="w-full text-4xl font-black text-center p-4 rounded-2xl bg-slate-50 dark:bg-[#040817] border-none text-black dark:text-white" />
              </div>
            </div>
          </div>

          {/* EXTÉRIEUR */}
          <div className="space-y-4">
            <h3 className="font-[900] text-slate-400 flex items-center gap-2 italic uppercase text-xs tracking-widest"><Shield size={16}/> Équipe Extérieur</h3>
            <div className="grid grid-cols-1 gap-4">
              <input type="text" value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} className="w-full font-bold text-sm p-4 rounded-2xl bg-slate-50 dark:bg-[#040817] border-none outline-none focus:ring-2 focus:ring-slate-400 text-black dark:text-white" placeholder="Nom du club"/>
              
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-[#040817] p-4 rounded-2xl">
                <div className="flex-1 space-y-1">
                   <label className="text-[9px] font-black uppercase opacity-50 ml-1 dark:text-white">Logo</label>
                   <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, setAwayLogo)} className="text-[10px] w-full cursor-pointer dark:text-white"/>
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase opacity-50 ml-1 dark:text-white">Couleur</label>
                   <input type="color" value={awayColor} onChange={(e) => setAwayColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer block bg-transparent border-none"/>
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase opacity-50 ml-1 dark:text-white text-center block">Typo</label>
                   <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                      <button type="button" onClick={() => setAwayTextColor('#FFFFFF')} className={`p-2 rounded ${awayTextColor === '#FFFFFF' ? 'bg-[#0065FF] text-white' : 'text-slate-400'}`}><Type size={14}/></button>
                      <button type="button" onClick={() => setAwayTextColor('#081031')} className={`p-2 rounded ${awayTextColor === '#081031' ? 'bg-[#0065FF] text-white' : 'text-slate-400'}`}><Type size={14} className="fill-current"/></button>
                   </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase opacity-50 ml-1 dark:text-white">Score</label>
                <input type="number" value={awayScore} onChange={(e) => setAwayScore(e.target.value)} className="w-full text-4xl font-black text-center p-4 rounded-2xl bg-slate-50 dark:bg-[#040817] border-none text-black dark:text-white" />
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* RENDU FINAL APERÇU */}
      <div className="space-y-6 pt-10 pb-20">
        <h3 className="font-[900] uppercase text-[14px] flex items-center gap-2 italic text-black dark:text-white">
          <Trophy size={20} className="text-yellow-500"/> Rendu Final (Aperçu)
        </h3>
        
        <div className="bg-slate-200 dark:bg-[#040817] p-16 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-white/10 overflow-x-auto min-h-[300px]">
          <div className="relative font-['Montserrat'] w-full max-w-[1100px] flex flex-col md:flex-row h-[130px] shrink-0 overflow-visible">
            
            <div className="hidden md:flex absolute top-[-32px] left-1/2 -translate-x-1/2 items-center z-30 shadow-xl">
              <div className="bg-[#0EE2E2] text-[#081031] px-6 py-2 font-[900] uppercase text-[11px] tracking-tighter italic">
                {division}
              </div>
              <div className="bg-[#0065FF] text-white px-6 py-2 font-[900] uppercase text-[11px] tracking-tighter italic whitespace-nowrap">
                {date}
              </div>
            </div>

            <div className="flex flex-row w-full h-full bg-white shadow-2xl overflow-hidden">
              {/* DOMICILE */}
              <div className="flex-[4] flex items-center relative min-w-0 h-full">
                <div className="w-[110px] lg:w-[130px] h-full bg-white flex items-center justify-center shrink-0">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 border border-slate-100 flex items-center justify-center overflow-hidden bg-slate-50 shadow-inner rounded-full">
                    {homeLogo ? (
                      <img src={homeLogo} alt="Logo Dom" className="h-[75%] object-contain p-1" />
                    ) : (
                      <span className="text-[10px] font-black text-slate-300 italic uppercase">Logo</span>
                    )}
                  </div>
                </div>
                {/* Typo dynamique ici : color: homeTextColor */}
                <div style={{ backgroundColor: homeColor }} className="flex-1 h-full flex flex-col justify-center items-end pr-6 transition-colors duration-500 min-w-0">
                  <h3 style={{ color: homeTextColor }} className="text-2xl lg:text-4xl font-[900] uppercase leading-none tracking-tighter italic truncate w-full text-right">
                    {homeTeam}
                  </h3>
                  <div className="bg-[#081031] text-white px-2 py-0.5 font-[900] uppercase text-[8px] lg:text-[10px] tracking-[0.2em] mt-1 italic">
                    DOMICILE
                  </div>
                </div>
              </div>

              {/* CENTRE */}
              <div className="w-[140px] lg:w-[180px] h-full bg-[#0065FF] flex items-center justify-center relative z-20 shadow-[-10px_0_20px_rgba(0,0,0,0.15)]">
                <div className="flex items-center gap-4 lg:gap-5 text-white font-[900]">
                  <span className="text-5xl lg:text-7xl tracking-tighter italic drop-shadow-md">{homeScore}</span>
                  <div className="w-0.5 lg:w-1 h-10 lg:h-16 bg-white/30 rounded-full"></div>
                  <span className="text-5xl lg:text-7xl tracking-tighter italic drop-shadow-md">{awayScore}</span>
                </div>
              </div>

              {/* EXTÉRIEUR */}
              <div className="flex-[4] flex flex-row-reverse items-center relative min-w-0 h-full">
                <div className="w-[110px] lg:w-[130px] h-full bg-white flex items-center justify-center shrink-0">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 border border-slate-100 flex items-center justify-center overflow-hidden bg-slate-50 shadow-inner rounded-full">
                    {awayLogo ? (
                      <img src={awayLogo} alt="Logo Ext" className="h-[75%] object-contain p-1" />
                    ) : (
                      <span className="text-[10px] font-black text-slate-300 italic uppercase">Logo</span>
                    )}
                  </div>
                </div>
                {/* Typo dynamique ici : color: awayTextColor */}
                <div style={{ backgroundColor: awayColor }} className="flex-1 h-full flex flex-col justify-center items-start pl-6 transition-colors duration-500 min-w-0">
                  <h3 style={{ color: awayTextColor }} className="text-2xl lg:text-4xl font-[900] uppercase leading-none tracking-tighter italic truncate w-full text-left">
                    {awayTeam}
                  </h3>
                  <div className="bg-white text-[#081031] px-2 py-0.5 font-[900] uppercase text-[8px] lg:text-[10px] tracking-[0.2em] mt-1 italic">
                    EXTÉRIEUR
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}