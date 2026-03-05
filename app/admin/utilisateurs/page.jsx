'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Shield, ShieldAlert, User, Loader2, Save, Mail, Coffee, MapPin, FileText, ChevronDown } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Nouvel état pour gérer l'ouverture du menu déroulant personnalisé
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user', 
    password: '' 
  });

  // Liste des options de rôles pour le custom select
  const roleOptions = [
    { value: 'user', label: 'Membre (Accès site basique)', icon: <User size={16}/> },
    { value: 'coach', label: 'Entraîneur (Accès Indivs)', icon: <Shield size={16}/> },
    { value: 'buvette', label: 'Buvette (Accès gestion buvette)', icon: <Coffee size={16}/> },
    { value: 'geo', label: 'GEO Tournois (Accès gestion tournois)', icon: <MapPin size={16}/> },
    { value: 'secretaire', label: 'Secrétaire (Accès gestion secrétariat)', icon: <FileText size={16}/> },
    { value: 'admin', label: 'Administrateur (Accès Total)', icon: <ShieldAlert size={16}/> },
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
      console.error("Erreur de récupération des utilisateurs", error);
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

  const openModal = (user = null) => {
    setIsRoleDropdownOpen(false); // On s'assure que le menu est fermé en ouvrant la modale
    if (user) {
      setEditingId(user._id);
      setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
    } else {
      setEditingId(null);
      setFormData({ name: '', email: '', role: 'user', password: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsRoleDropdownOpen(false);
  };

  // 2. Sauvegarde ou Mise à jour d'un utilisateur
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const url = editingId ? `/api/users/${editingId}` : '/api/users';
      const method = editingId ? 'PUT' : 'POST';

      // Si on édite et qu'on a pas rempli le mot de passe, on l'enlève de la requête
      const dataToSend = { ...formData };
      if (editingId && !dataToSend.password) {
        delete dataToSend.password;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      const result = await res.json();
      
      if (result.success) {
        fetchUsers();
        closeModal();
      } else {
        alert("Erreur: " + result.error);
      }

    } catch (error) {
      console.error("Erreur lors de l'enregistrement", error);
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Suppression d'un utilisateur
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ? Cette action est irréversible.")) return;
    
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
    switch (role) {
      case 'admin':
        return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/20 flex items-center gap-1 w-fit"><ShieldAlert size={12}/> Administrateur</span>;
      case 'coach':
        return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#0065FF]/10 text-[#0065FF] border border-[#0065FF]/20 flex items-center gap-1 w-fit"><Shield size={12}/> Coach - Indivs</span>;
      case 'buvette':
        return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#F72585]/10 text-[#F72585] border border-[#F72585]/20 flex items-center gap-1 w-fit"><Coffee size={12}/> Buvette</span>;
      case 'geo':
        return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#9333EA]/10 text-[#9333EA] border border-[#9333EA]/20 flex items-center gap-1 w-fit"><MapPin size={12}/> GEO Tournois</span>;
      case 'secretaire':
        return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#0065FF]/10 text-[#0065FF] border border-[#0065FF]/20 flex items-center gap-1 w-fit"><FileText size={12}/> Secrétaire</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400 border border-slate-200 dark:border-white/10 flex items-center gap-1 w-fit"><User size={12}/> Membre</span>;
      }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 leading-tight pt-2">
            Gestion <span className="text-[#0EE2E2]">Utilisateurs</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Gérez les accès, les rôles et les comptes du club.</p>
        </div>
        <button onClick={() => openModal()} className="bg-[#0EE2E2] hover:bg-[#0bd1d1] text-[#081031] px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all shadow-md">
          <Plus size={16} /> Nouvel Utilisateur
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 size={48} className="animate-spin text-[#0EE2E2]" /></div>
      ) : (
        <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Utilisateur</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Rôle & Droits</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest hidden md:table-cell">Date d'inscription</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {users.map(user => (
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
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500 hidden md:table-cell">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(user)} className="p-2 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white rounded-lg hover:bg-[#0065FF] hover:text-white transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(user._id)} className="p-2 bg-slate-100 dark:bg-white/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500 font-bold text-sm">
                      Aucun utilisateur trouvé. Créez-en un nouveau !
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Le z-[999] force la modale à passer AU-DESSUS de la navbar qui est en z-[100] */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#081031] rounded-[2rem] w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
            <div className="bg-slate-50 dark:bg-white/5 p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center rounded-t-[2rem] shrink-0">
              <h2 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white flex items-center gap-2">
                <Shield className="text-[#0EE2E2]" size={20} />
                {editingId ? "Modifier l'accès" : "Nouvel Utilisateur"}
              </h2>
              <button onClick={closeModal} className="p-2 bg-white dark:bg-[#081031] rounded-full text-slate-500 hover:text-red-500 shadow-sm"><X size={16} /></button>
            </div>
            
            <div className="overflow-y-auto hide-scrollbar p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Nom complet *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0EE2E2] outline-none" placeholder="Ex: Jean Admin" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Adresse Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0EE2E2] outline-none" placeholder="jean@uscreteil.com" />
                </div>
                
                {/* === MENU DÉROULANT CUSTOM === */}
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Niveau d'accès (Rôle) *</label>
                  <div className="relative">
                    <button 
                      type="button" 
                      onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)} 
                      className={`w-full bg-slate-50 dark:bg-[#0f172a] border ${isRoleDropdownOpen ? 'border-[#0EE2E2] ring-2 ring-[#0EE2E2]/20' : 'border-slate-200 dark:border-white/10'} rounded-xl px-4 py-3.5 text-sm font-bold flex justify-between items-center transition-all outline-none`}
                    >
                      <span className="flex items-center gap-2 text-[#081031] dark:text-white">
                        <span className="text-[#0EE2E2]">
                          {roleOptions.find(opt => opt.value === formData.role)?.icon}
                        </span>
                        {roleOptions.find(opt => opt.value === formData.role)?.label}
                      </span>
                      <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* La liste déroulante qui s'affiche au clic */}
                    {isRoleDropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="max-h-60 overflow-y-auto hide-scrollbar py-1">
                          {roleOptions.map((opt) => (
                            <div 
                              key={opt.value} 
                              onClick={() => {
                                setFormData({ ...formData, role: opt.value });
                                setIsRoleDropdownOpen(false);
                              }} 
                              className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors flex items-center gap-3 ${
                                formData.role === opt.value 
                                  ? 'bg-[#0EE2E2]/10 text-[#0EE2E2] border-l-2 border-[#0EE2E2]' 
                                  : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 border-l-2 border-transparent'
                              }`}
                            >
                              <span className={formData.role === opt.value ? 'text-[#0EE2E2]' : 'text-slate-400'}>
                                {opt.icon}
                              </span>
                              {opt.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    {editingId ? "Nouveau mot de passe (Laisser vide pour ne pas changer)" : "Mot de passe initial *"}
                  </label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required={!editingId} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0EE2E2] outline-none" placeholder="••••••••" />
                </div>
                
                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-white/10 flex justify-end gap-3">
                  <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">Annuler</button>
                  <button type="submit" disabled={isSaving} className="bg-[#0EE2E2] text-[#081031] px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-[#0bd1d1] transition-colors shadow-lg shadow-[#0EE2E2]/20 disabled:opacity-50">
                    {isSaving && <Loader2 size={16} className="animate-spin" />} {editingId ? 'Mettre à jour' : 'Créer le compte'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}