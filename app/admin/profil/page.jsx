'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Camera, Save, Loader2, CheckCircle, Shield, AlertCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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
      });
      setImagePreview(session.user.image || null);
    }
  }, [session]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Limite à 2Mo
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg("L'image est trop volumineuse (Max 2Mo).");
        setTimeout(() => setErrorMsg(''), 4000);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Stocke l'image en Base64
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
          image: imagePreview
        }) 
      });
      
      const result = await res.json();

      if (result.success) {
        // Mise à jour de la session NextAuth localement
        await update({
          ...session,
          user: {
            ...session?.user,
            name: formData.name,
            email: formData.email,
            image: imagePreview
          }
        });

        setSuccessMsg('Vos informations ont été mises à jour avec succès.');
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

  // Déterminer le lien de retour en fonction du rôle
  const backLink = session?.user?.role === 'admin' ? '/admin' : '/mes-indivs';
  const themeColor = session?.user?.role === 'admin' ? 'text-[#0065FF]' : 'text-[#F72585]';
  const bgThemeColor = session?.user?.role === 'admin' ? 'bg-[#0065FF]' : 'bg-[#F72585]';
  const focusThemeColor = session?.user?.role === 'admin' ? 'focus:ring-[#0065FF]' : 'focus:ring-[#F72585]';

  return (
    <div className="bg-slate-50 dark:bg-[#040817] min-h-screen pt-32 pb-20 font-sans text-[#081031] dark:text-white transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <Link href={backLink} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#081031] dark:hover:text-white mb-8 transition-colors">
          <ChevronLeft size={16} /> Retour à mon espace
        </Link>

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase mb-2 leading-tight">
              Mon <span className={themeColor}>Profil</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold">Gérez vos informations personnelles et votre sécurité.</p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">
            <Shield size={14} className={themeColor} /> Rôle : {session?.user?.role || 'Membre'}
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
            <div className="bg-white dark:bg-[#081031] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-white/5">
                <h2 className="text-lg font-[900] uppercase italic">Informations Personnelles</h2>
              </div>
              
              <form onSubmit={handleInfoSubmit} className="p-6 lg:p-8">
                
                {/* UPLOAD PHOTO */}
                <div className="flex items-center gap-6 lg:gap-8 mb-8">
                  <div className="relative group shrink-0">
                    <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-4 border-slate-100 dark:border-white/5 overflow-hidden bg-slate-200 dark:bg-[#0f172a] flex items-center justify-center text-3xl font-black text-slate-400 shadow-inner">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                      ) : (
                        session?.user?.name?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className={`absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform ${bgThemeColor}`}
                    >
                      <Camera size={14} />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/png, image/jpeg, image/webp" 
                      onChange={handleFileChange} 
                    />
                  </div>
                  <div>
                    <h3 className="font-black uppercase text-sm mb-1">Photo de profil</h3>
                    <p className="text-xs font-medium text-slate-500">Formats acceptés : JPG, PNG, WEBP. Poids maximum : 2Mo.</p>
                  </div>
                </div>

                {/* CHAMPS DE SAISIE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                <div className="mt-8 flex justify-end">
                  <button type="submit" disabled={isLoading} className={`${bgThemeColor} text-white px-8 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg disabled:opacity-50`}>
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* COLONNE DROITE : SÉCURITÉ */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#081031] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden h-full flex flex-col">
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
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Modifier le mot de passe'}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}