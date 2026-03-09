'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Shield, ShieldAlert, User, Loader2, Save, Mail, Coffee, MapPin, FileText, Target, Scissors, Dumbbell } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roles: ['user'], // Tableau pour gérer plusieurs rôles
    password: '' 
  });

  // Liste des options de rôles avec leurs icônes dédiées
  const roleOptions = [
    { value: 'admin', label: 'Administrateur', icon: <ShieldAlert size={14}/>, color: 'text-red-500', bgHover: 'hover:bg-red-50 dark:hover:bg-red-500/10', borderActive: 'border-red-500 bg-red-500/10 text-red-500' },
    { value: 'coach', label: 'Entraîneur', icon: <Dumbbell size={14}/>, color: 'text-[#00E676]', bgHover: 'hover:bg-[#00E676]/10', borderActive: 'border-[#00E676] bg-[#00E676]/10 text-[#00E676]' },
    { value: 'indiv', label: 'Coach Indivs', icon: <Target size={14}/>, color: 'text-[#F72585]', bgHover: 'hover:bg-[#F72585]/10', borderActive: 'border-[#F72585] bg-[#F72585]/10 text-[#F72585]' },
    { value: 'cordeur', label: 'Cordeur', icon: <Scissors size={14}/>, color: 'text-[#10B981]', bgHover: 'hover:bg-[#10B981]/10', borderActive: 'border-[#10B981] bg-[#10B981]/10 text-[#10B981]' },
    { value: 'buvette', label: 'Buvette', icon: <Coffee size={14}/>, color: 'text-[#FFD500]', bgHover: 'hover:bg-[#FFD500]/10', borderActive: 'border-[#FFD500] bg-[#FFD500]/10 text-[#FFD500]' },
    { value: 'geo', label: 'GEO Tournois', icon: <MapPin size={14}/>, color: 'text-[#9333EA]', bgHover: 'hover:bg-[#9333EA]/10', borderActive: 'border-[#9333EA] bg-[#9333EA]/10 text-[#9333EA]' },
    { value: 'bureau', label: 'Bureau', icon: <FileText size={14}/>, color: 'text-[#0065FF]', bgHover: 'hover:bg-[#0065FF]/10', borderActive: 'border-[#0065FF] bg-[#0065FF]/10 text-[#0065FF]' },
    { value: 'user', label: 'Membre (Joueur)', icon: <User size={14}/>, color: 'text-slate-500', bgHover: 'hover:bg-slate-100 dark:hover:bg-white/10', borderActive: 'border-[#0EE2E2] bg-[#0EE2E2]/10 text-[#0EE2E2]' },
  ];

  // 1. Récupération des utilisateurs depuis l'API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle d'un rôle dans le tableau
  const handleRoleToggle = (roleValue) => {
    setFormData(prev => {
      const currentRoles = prev.roles || [];
      if (currentRoles.includes(roleValue)) {
        // Empêche de tout décocher (garde au moins 'user')
        if (currentRoles.length === 1) return prev;
        return { ...prev, roles: currentRoles.filter(r => r !== roleValue) };
      } else {
        return { ...prev, roles: [...currentRoles, roleValue] };
      }
    });
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingId(user._id);
      // Rétrocompatibilité : on charge roles ou role
      const userRoles = user.roles && user.roles.length > 0 ? user.roles : (user.role ? [user.role] : ['user']);
      setFormData({ name: user.name, email: user.email, roles: userRoles, password: '' });
    } else {
      setEditingId(null);
      setFormData({ name: '', email: '', roles: ['user'], password: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 2. Sauvegarde ou Mise à jour d'un utilisateur + ENVOI EMAILJS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingId ? `/api/users/${editingId}` : '/api/users';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        // --- NOUVEAU : ENVOI D'EMAIL VIA EMAILJS UNIQUEMENT À LA CRÉATION ---
        if (!editingId) {
          try {
            // Création d'une liste lisible des rôles pour l'email
            const roleLabels = formData.roles.map(r => {
              const found = roleOptions.find(opt => opt.value === r);
              return found ? found.label : r;
            }).join(', ');

            // URL de connexion dynamique
            const loginUrl = `${window.location.origin}/login`;

            // Paramètres attendus par l'API REST d'EmailJS
            const emailjsPayload = {
              service_id: 'VOTRE_SERVICE_ID', // 🔴 À REMPLACER PAR VOTRE SERVICE ID EMAILJS
              template_id: 'VOTRE_TEMPLATE_ID', // 🔴 À REMPLACER PAR VOTRE TEMPLATE ID EMAILJS
              user_id: 'VOTRE_CLE_PUBLIQUE', // 🔴 À REMPLACER PAR VOTRE CLÉ PUBLIQUE EMAILJS (Public Key)
              template_params: {
                to_name: formData.name,
                to_email: formData.email,
                temp_password: formData.password,
                roles_list: roleLabels,
                login_url: loginUrl
              }
            };

            await fetch('https://api.emailjs.com/api/v1.0/email/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(emailjsPayload)
            });
            console.log("Email de bienvenue envoyé via EmailJS !");
          } catch (emailErr) {
            console.error("Erreur lors de l'envoi de l'email :", emailErr);
          }
        }

        fetchUsers();
        closeModal();
      } else {
        alert("Erreur: " + data.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement", error);
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Suppression
  const deleteUser = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    }
  };

  const getRoleBadge = (role) => {
    // On met en minuscules pour éviter les bugs si le rôle a été sauvegardé en majuscule ('BUREAU')
    switch (role.toLowerCase()) {
      case 'admin': return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/20 flex items-center gap-1 w-fit"><ShieldAlert size={12}/> Admin</span>;
      case 'coach': return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20 flex items-center gap-1 w-fit"><Dumbbell size={12}/> Entraîneur</span>;
      case 'indiv': return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#F72585]/10 text-[#F72585] border border-[#F72585]/20 flex items-center gap-1 w-fit"><Target size={12}/> Indivs</span>;
      case 'cordeur': return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 flex items-center gap-1 w-fit"><Scissors size={12}/> Cordeur</span>;
      case 'buvette': return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#FFD500]/10 text-[#FFD500] border border-[#FFD500]/20 flex items-center gap-1 w-fit"><Coffee size={12}/> Buvette</span>;
      case 'geo': return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#9333EA]/10 text-[#9333EA] border border-[#9333EA]/20 flex items-center gap-1 w-fit"><MapPin size={12}/> GEO</span>;
      case 'bureau': return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#0065FF]/10 text-[#0065FF] border border-[#0065FF]/20 flex items-center gap-1 w-fit"><FileText size={12}/> Bureau</span>;
      case 'secretaire': return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#0065FF]/10 text-[#0065FF] border border-[#0065FF]/20 flex items-center gap-1 w-fit"><FileText size={12}/> Secrétaire</span>;
      default: return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400 border border-slate-200 dark:border-white/10 flex items-center gap-1 w-fit"><User size={12}/> Membre</span>;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Montserrat']">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 leading-tight pt-2">
            Gestion <span className="text-[#0065FF]">Utilisateurs</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Gérez les accès et les permissions des membres du club.</p>
        </div>
        <button onClick={() => openModal()} className="bg-[#0065FF] text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-[#0052cc] transition-all shadow-md">
          <Plus size={16} /> Nouvel Utilisateur
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#0065FF]" size={48} />
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Utilisateur</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Accès / Rôles</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest hidden md:table-cell">Date de création</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {users.map(user => {
                  // Rétrocompatibilité d'affichage
                  const userRoles = user.roles && user.roles.length > 0 ? user.roles : (user.role ? [user.role] : ['user']);
                  
                  return (
                    <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-[#081031] flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-[900] uppercase text-sm text-[#081031] dark:text-white">{user.name}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-1"><Mail size={10} /> {user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {userRoles.map(r => <React.Fragment key={r}>{getRoleBadge(r)}</React.Fragment>)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500 hidden md:table-cell">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openModal(user)} className="p-2 text-slate-400 hover:text-[#0065FF] transition-colors"><Pencil size={16} /></button>
                          <button onClick={() => deleteUser(user._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL AJOUT/MODIFICATION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#081031] rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-50 dark:bg-[#0f172a] p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white flex items-center gap-3">
                <Shield className="text-[#0065FF]" size={20} />
                {editingId ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Nom Complet *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0EE2E2] outline-none" placeholder="Jean Dupont" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Adresse Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0EE2E2] outline-none" placeholder="jean@uscreteil.com" />
                </div>
              </div>
                
              {/* === SÉLECTION MULTIPLE DES RÔLES === */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">Accès & Rôles assignés</label>
                <div className="flex flex-wrap gap-2">
                  {roleOptions.map(opt => {
                    const isSelected = formData.roles.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleRoleToggle(opt.value)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border-2 
                          ${isSelected 
                            ? opt.borderActive 
                            : `border-transparent bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 ${opt.bgHover}`
                          }`}
                      >
                        <span className={isSelected ? 'text-current' : opt.color}>{opt.icon}</span> 
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  Mot de passe {editingId ? '(Laisser vide pour ne pas modifier)' : '*'}
                </label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required={!editingId} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0EE2E2] outline-none" placeholder="••••••••" />
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex justify-end gap-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 font-bold text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">Annuler</button>
                <button type="submit" disabled={isSaving} className="bg-[#0065FF] hover:bg-[#0052cc] text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#0065FF]/20 disabled:opacity-50">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingId ? 'Mettre à jour' : 'Créer l\'utilisateur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}