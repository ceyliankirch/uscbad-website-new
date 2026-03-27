'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Camera, Save, Loader2, CheckCircle, Shield, AlertCircle, ChevronLeft, Trophy, Target, Activity, ArrowRight, CreditCard, Edit, X, Calendar, Clock, MessageSquareText } from 'lucide-react';
import Link from 'next/link';

export default function ProfilPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.title = "Mon Profil | US Créteil Badminton";
  }, []);

  // ÉTATS DE LA PAGE
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  
  // Bascule entre la vue Présentation et la vue Édition
  const [isEditing, setIsEditing] = useState(false);

  // Options de classements
  const rankingOptions = ['N1', 'N2', 'N3', 'R4', 'R5', 'R6', 'D7', 'D8', 'D9', 'P10', 'P11', 'P12', 'NC'];

  // Formulaires
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    licence: '', 
    rankings: { simple: 'NC', double: 'NC', mixte: 'NC' }
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // --- DONNÉES SIMULÉES : SÉANCES INDIVS ---
  const [selectedSession, setSelectedSession] = useState(null);

  const upcomingSessions = [
    { id: 101, date: 'Vendredi 20 Mars 2026', time: '20h30 - 22h30', coach: 'Malo', theme: 'Attaque et fixation', status: 'Confirmée' }
  ];

  const pastSessions = [
    { id: 102, date: 'Vendredi 13 Mars 2026', time: '20h30 - 22h30', coach: 'Romain', theme: 'Défense de double', status: 'Terminée', comment: 'Excellente séance. Pense à bien fléchir sur tes appuis en défense et à préparer ta raquette plus tôt. Relâchement du grip à travailler.' },
    { id: 103, date: 'Vendredi 27 Février 2026', time: '20h30 - 22h30', coach: 'Malo', theme: 'Déplacements fond de court', status: 'Terminée', comment: 'Bonne progression sur le pas chassé. Attention au relâchement du poignet en fin de geste pour le dégagement.' }
  ];

  // Redirection si non connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Chargement des données de la session
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        licence: session.user.licence || '',
        rankings: session.user.rankings || { simple: 'NC', double: 'NC', mixte: 'NC' }
      });
      setImagePreview(session.user.image || null);
    }
  }, [session]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg("L'image est trop volumineuse (Max 2Mo).");
        setTimeout(() => setErrorMsg(''), 4000);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/users/${session.user.id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          licence: formData.licence,
          image: imagePreview,
          rankings: formData.rankings
        }) 
      });
      
      const result = await res.json();

      if (result.success) {
        // Mise à jour de la session locale NextAuth
        await update({
          ...session,
          user: {
            ...session?.user,
            name: formData.name,
            email: formData.email,
            licence: formData.licence,
            image: imagePreview,
            rankings: formData.rankings
          }
        });

        setSuccessMsg('Vos informations ont été mises à jour avec succès.');
        setIsEditing(false); // On repasse en mode lecture
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(result.error || "Une erreur est survenue.");
      }
    } catch (error) {
      setErrorMsg("Impossible de joindre le serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrorMsg("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${session.user.id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        }) 
      });

      const result = await res.json();

      if (result.success) {
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSuccessMsg('Votre mot de passe a été modifié avec succès.');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(result.error || "Erreur lors de la modification du mot de passe.");
      }
    } catch (error) {
      setErrorMsg("Impossible de joindre le serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#0065FF]" size={48} /></div>;
  }

  // Déterminer le lien de retour et la couleur du thème
  const isAdmin = session?.user?.roles?.includes('admin') || session?.user?.role === 'admin';
  const backLink = isAdmin ? '/admin' : '/mes-indivs';
  const themeColor = isAdmin ? 'text-[#0065FF]' : 'text-[#F72585]';
  const bgThemeColor = isAdmin ? 'bg-[#0065FF]' : 'bg-[#F72585]';
  const focusThemeColor = isAdmin ? 'focus:ring-[#0065FF]' : 'focus:ring-[#F72585]';

  return (
    <div className="bg-slate-50 dark:bg-[#040817] min-h-screen pt-32 pb-24 font-['Montserrat'] text-[#081031] dark:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <Link href={backLink} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#081031] dark:hover:text-white mb-8 transition-colors">
          <ChevronLeft size={16} /> Retour à mon espace
        </Link>

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase mb-2 leading-tight">
              Mon <span className={themeColor}>Profil</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold">Gérez vos informations personnelles, vos classements et votre sécurité.</p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">
            <Shield size={14} className={themeColor} /> Rôles : {session?.user?.roles?.join(', ') || session?.user?.role || 'Membre'}
          </div>
        </div>

        {successMsg && (
          <div className="mb-8 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 rounded-2xl flex items-center gap-3 font-bold text-sm animate-in zoom-in">
            <CheckCircle size={20} /> {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-2xl flex items-center gap-3 font-bold text-sm animate-in shake">
            <AlertCircle size={20} /> {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLONNE GAUCHE : INFOS & PHOTO */}
          <div className="lg:col-span-2 space-y-8">
            
            {!isEditing ? (
              // --- VUE PRÉSENTATION (LECTURE SEULE) ---
              <div className="bg-white dark:bg-[#081031] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden p-6 lg:p-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                  
                  {/* Photo Profil */}
                  <div className="relative shrink-0 w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-slate-100 dark:border-white/5 bg-slate-200 dark:bg-[#0f172a] flex items-center justify-center text-5xl font-black text-slate-400 shadow-inner">
                    {session?.user?.image ? (
                      <img src={session.user.image} alt="Profil" className="w-full h-full object-cover" />
                    ) : (
                      session?.user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  
                  {/* Infos */}
                  <div className="flex-1 w-full text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 border-b border-slate-100 dark:border-white/5 pb-6">
                      <h2 className="text-3xl lg:text-4xl font-[900] uppercase italic tracking-tight text-[#081031] dark:text-white">
                        {session?.user?.name}
                      </h2>
                      <button 
                        onClick={() => setIsEditing(true)} 
                        className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:${themeColor} border border-slate-200 dark:border-white/5`}
                      >
                        <Edit size={14} /> Modifier
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-center sm:justify-start gap-3">
                        <div className={`p-2 rounded-lg bg-slate-50 dark:bg-white/5 ${themeColor}`}><Mail size={16}/></div>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{session?.user?.email}</p>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-3">
                        <div className={`p-2 rounded-lg bg-slate-50 dark:bg-white/5 ${themeColor}`}><CreditCard size={16}/></div>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                          Licence FFBaD : <span className="font-black uppercase">{session?.user?.licence || 'Non renseignée'}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Classements affichés en lecture seule */}
                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/5">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <Trophy size={14} className={themeColor} /> Mes Classements
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-slate-50 dark:bg-[#0f172a] py-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Simple</span>
                      <span className="text-2xl font-black italic text-[#081031] dark:text-white">{formData.rankings.simple}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#0f172a] py-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Double</span>
                      <span className="text-2xl font-black italic text-[#081031] dark:text-white">{formData.rankings.double}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#0f172a] py-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mixte</span>
                      <span className="text-2xl font-black italic text-[#081031] dark:text-white">{formData.rankings.mixte}</span>
                    </div>
                  </div>
                </div>
              </div>

            ) : (
              // --- VUE ÉDITION (FORMULAIRE) ---
              <div className="bg-white dark:bg-[#081031] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                  <h2 className="text-lg font-[900] uppercase italic">Modifier mes informations</h2>
                  <button onClick={() => setIsEditing(false)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-white/5 rounded-full transition-colors">
                    <X size={16} />
                  </button>
                </div>
                
                <form onSubmit={handleInfoSubmit} className="p-6 lg:p-8">
                  
                  {/* UPLOAD PHOTO */}
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
                    <div className="relative group shrink-0">
                      <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full border-4 border-slate-100 dark:border-white/5 overflow-hidden bg-slate-200 dark:bg-[#0f172a] flex items-center justify-center text-4xl font-black text-slate-400 shadow-inner">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                        ) : (
                          session?.user?.name?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className={`absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform ${bgThemeColor}`}
                      >
                        <Camera size={16} />
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/png, image/jpeg, image/webp" 
                        onChange={handleFileChange} 
                      />
                    </div>
                    <div className="pt-2 text-center md:text-left">
                       <h3 className="text-sm font-black uppercase text-[#081031] dark:text-white mb-1">Photo de Profil</h3>
                       <p className="text-xs font-medium text-slate-500">Un beau portrait sur le terrain ? Format PNG/JPG. Max 2Mo.</p>
                    </div>
                  </div>

                  {/* CHAMPS DE SAISIE */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                        <User size={12} /> Nom Complet
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={`w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none transition-all ${focusThemeColor}`} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                        <Mail size={12} /> Adresse Email
                      </label>
                      <input 
                        type="email" 
                        required 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none transition-all ${focusThemeColor}`} 
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                        <CreditCard size={12} /> Numéro de Licence FFBaD
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={formData.licence} 
                          onChange={(e) => setFormData({...formData, licence: e.target.value.toUpperCase()})}
                          placeholder="Ex: 06543210"
                          className={`w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none transition-all ${focusThemeColor}`} 
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 pointer-events-none uppercase">
                          MyFFBaD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SÉLECTION MANUELLE DES CLASSEMENTS */}
                  <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                      <Trophy size={14} className={themeColor}/> Mettre à jour mes classements
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase text-center block">Simple</label>
                        <select 
                          value={formData.rankings.simple} 
                          onChange={e => setFormData({...formData, rankings: {...formData.rankings, simple: e.target.value}})} 
                          className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl p-3 text-center font-black text-lg outline-none cursor-pointer appearance-none"
                        >
                          {rankingOptions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase text-center block">Double</label>
                        <select 
                          value={formData.rankings.double} 
                          onChange={e => setFormData({...formData, rankings: {...formData.rankings, double: e.target.value}})} 
                          className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl p-3 text-center font-black text-lg outline-none cursor-pointer appearance-none"
                        >
                          {rankingOptions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase text-center block">Mixte</label>
                        <select 
                          value={formData.rankings.mixte} 
                          onChange={e => setFormData({...formData, rankings: {...formData.rankings, mixte: e.target.value}})} 
                          className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl p-3 text-center font-black text-lg outline-none cursor-pointer appearance-none"
                        >
                          {rankingOptions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                      Annuler
                    </button>
                    <button type="submit" disabled={isLoading} className={`${bgThemeColor} text-white px-8 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg disabled:opacity-50`}>
                      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      Enregistrer
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* COLONNE DROITE : SÉCURITÉ & INDIVS */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* RÉSERVER UN INDIV */}
            <div className="bg-gradient-to-br from-[#081031] to-[#0f172a] rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#F72585] rounded-full blur-[60px] opacity-40 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 bg-[#F72585] text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#F72585]/30">
                  <Target size={24} />
                </div>
                <h3 className="text-2xl font-[900] uppercase italic text-white leading-tight mb-2">
                  Coaching <br/><span className="text-[#F72585]">Privé</span>
                </h3>
                <p className="text-slate-400 font-medium text-sm mb-8 leading-relaxed">
                  Envie de franchir un cap ? Demandez une séance individuelle avec nos entraîneurs diplômés.
                </p>
                <Link 
                  href="/indivs"
                  className="mt-auto bg-white text-[#081031] w-full py-3.5 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-[#F72585] hover:text-white transition-colors shadow-md"
                >
                  Faire une demande <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* SÉCURITÉ */}
            <div className="bg-white dark:bg-[#081031] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 dark:border-white/5">
                <h2 className="text-lg font-[900] uppercase italic flex items-center gap-2">
                  <Lock size={18} className={themeColor} /> Sécurité
                </h2>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5 flex-1 flex flex-col">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Mot de passe actuel</label>
                  <input 
                    type="password" 
                    required 
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                    className={`w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none transition-all ${focusThemeColor}`} 
                    placeholder="••••••••" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Nouveau mot de passe</label>
                  <input 
                    type="password" 
                    required 
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                    className={`w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none transition-all ${focusThemeColor}`} 
                    placeholder="••••••••" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Confirmer le nouveau</label>
                  <input 
                    type="password" 
                    required 
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                    className={`w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none transition-all ${focusThemeColor}`} 
                    placeholder="••••••••" 
                  />
                </div>

                <div className="mt-auto pt-6">
                  <button type="submit" disabled={isLoading} className={`w-full bg-transparent border-2 border-slate-200 dark:border-white/10 px-8 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:border-[#081031] dark:hover:border-white transition-all disabled:opacity-50`}>
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Modifier'}
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* NOUVELLE LIGNE : GESTION DES SÉANCES INDIVS */}
          <div className="lg:col-span-3 mt-8">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-[900] italic uppercase text-[#081031] dark:text-white leading-tight">
                    Mes Séances <span className="text-[#F72585]">Indivs</span>
                  </h2>
                  <p className="text-sm font-bold text-slate-500 mt-1">Suivez votre progression et vos prochaines réservations de coaching privé.</p>
                </div>
                <Link href="/indivs" className="bg-[#F72585] text-white px-8 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-[#d91c70] transition-all shadow-lg hover:scale-105 shrink-0">
                  <Target size={16} /> Réserver une séance
                </Link>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                
                {/* Séances à venir */}
                <div className="space-y-6">
                   <h3 className="text-lg font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                     <Calendar size={18} className="text-[#0EE2E2]" /> À Venir
                   </h3>
                   <div className="space-y-4">
                      {upcomingSessions.length === 0 ? (
                        <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 text-center text-slate-500 font-bold text-sm">
                          Aucune séance planifiée.
                        </div>
                      ) : (
                        upcomingSessions.map(session => (
                          <div 
                            key={session.id} 
                            onClick={() => setSelectedSession(session)}
                            className="bg-white dark:bg-[#081031] p-5 rounded-2xl border-2 border-[#0EE2E2]/30 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden group"
                          >
                             <div className="absolute top-0 right-0 w-24 h-24 bg-[#0EE2E2] rounded-full blur-[40px] opacity-10 group-hover:opacity-20 pointer-events-none transition-opacity"></div>
                             <div className="relative z-10 flex justify-between items-start mb-3">
                                <div>
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 rounded-md text-[9px] font-black uppercase tracking-widest mb-2">
                                    <CheckCircle size={10} /> {session.status}
                                  </span>
                                  <h4 className="font-black text-sm uppercase text-[#081031] dark:text-white leading-tight">{session.date}</h4>
                                </div>
                             </div>
                             <div className="relative z-10 space-y-2">
                                <p className="text-xs font-bold text-slate-500 flex items-center gap-2"><Clock size={14} className="text-[#0EE2E2]"/> {session.time}</p>
                                <p className="text-xs font-bold text-slate-500 flex items-center gap-2"><User size={14} className="text-[#0EE2E2]"/> Coach : {session.coach}</p>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                </div>

                {/* Historique des séances */}
                <div className="space-y-6">
                   <h3 className="text-lg font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                     <Activity size={18} className="text-slate-500" /> Historique
                   </h3>
                   <div className="space-y-4">
                      {pastSessions.length === 0 ? (
                        <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 text-center text-slate-500 font-bold text-sm">
                          Aucun historique disponible.
                        </div>
                      ) : (
                        pastSessions.map(session => (
                          <div 
                            key={session.id} 
                            onClick={() => setSelectedSession(session)}
                            className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all cursor-pointer group"
                          >
                             <div className="flex justify-between items-center mb-3 border-b border-slate-200 dark:border-white/5 pb-3">
                                <h4 className="font-black text-xs uppercase text-slate-600 dark:text-slate-300">{session.date}</h4>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avec {session.coach}</span>
                             </div>
                             <p className="text-sm font-bold text-[#081031] dark:text-white italic leading-tight group-hover:text-[#F72585] transition-colors line-clamp-1">
                               {session.theme}
                             </p>
                             <div className="mt-3 text-xs text-[#0065FF] dark:text-[#0EE2E2] font-black uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                               Voir les commentaires <ArrowRight size={12}/>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                </div>

             </div>
          </div>

        </div>
      </div>

      {/* MODALE DÉTAILS DE LA SÉANCE INDIV */}
      {selectedSession && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#081031] rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95 flex flex-col">
             
             <div className={`p-6 lg:p-8 border-b border-slate-100 dark:border-white/10 flex justify-between items-start bg-slate-50 dark:bg-[#0f172a]`}>
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mb-3 ${selectedSession.status === 'Terminée' ? 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300' : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'}`}>
                    {selectedSession.status === 'Terminée' ? <CheckCircle size={12}/> : <Clock size={12}/>} {selectedSession.status}
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-[900] italic uppercase text-[#081031] dark:text-white leading-tight">
                    {selectedSession.date}
                  </h3>
                </div>
                <button onClick={() => setSelectedSession(null)} className="p-2 bg-slate-200 dark:bg-white/5 text-slate-500 hover:text-red-500 rounded-full transition-colors">
                  <X size={20} />
                </button>
             </div>

             <div className="p-6 lg:p-8 space-y-8 bg-white dark:bg-[#081031]">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5"><User size={12}/> Entraîneur</p>
                      <p className="text-sm font-bold text-[#081031] dark:text-white">{selectedSession.coach}</p>
                   </div>
                   <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5"><Clock size={12}/> Horaire</p>
                      <p className="text-sm font-bold text-[#081031] dark:text-white">{selectedSession.time}</p>
                   </div>
                   <div className="col-span-2 bg-[#0065FF]/5 dark:bg-[#0EE2E2]/5 p-4 rounded-xl border border-[#0065FF]/20 dark:border-[#0EE2E2]/20">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#0065FF] dark:text-[#0EE2E2] mb-1 flex items-center gap-1.5"><Target size={12}/> Thème de la séance</p>
                      <p className="text-base font-[900] uppercase italic text-[#081031] dark:text-white">{selectedSession.theme}</p>
                   </div>
                </div>

                {selectedSession.comment && (
                  <div>
                     <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                       <MessageSquareText size={16} className="text-[#F72585]"/> Notes & Bilan du Coach
                     </h4>
                     <div className="bg-slate-50 dark:bg-[#0f172a] p-5 rounded-2xl border-l-4 border-[#F72585] text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 italic">
                        "{selectedSession.comment}"
                     </div>
                  </div>
                )}
             </div>

             <div className="p-6 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-[#0f172a] flex justify-end">
                <button onClick={() => setSelectedSession(null)} className="px-6 py-3 bg-[#081031] dark:bg-white text-white dark:text-[#081031] rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform shadow-md">
                  Fermer
                </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}