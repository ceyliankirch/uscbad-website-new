'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Users, Image as ImageIcon, Loader2, Check } from 'lucide-react';

export default function AdminEquipePage() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    category: 'performance',
    image: '',
    color: '#0065FF',
    tags: '',
    order: 0,
    trainerRoles: [] // <-- NOUVEAU : Tableau pour stocker les rôles d'entraîneur
  });

  // Options pour les entraîneurs
  const trainerOptions = ['Compétiteurs', 'Loisirs', 'Jeunes', 'Féminin', 'Indivs'];

  // Charger les membres depuis l'API
  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/team');
      const data = await res.json();
      if (data.success) {
        setMembers(data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des membres :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Gestion du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gestion des cases à cocher pour les entraîneurs
  const handleTrainerRoleToggle = (roleOption) => {
    setFormData(prev => {
      const currentRoles = prev.trainerRoles || [];
      if (currentRoles.includes(roleOption)) {
        return { ...prev, trainerRoles: currentRoles.filter(r => r !== roleOption) };
      } else {
        return { ...prev, trainerRoles: [...currentRoles, roleOption] };
      }
    });
  };

  const openModal = (member = null) => {
    if (member) {
      setEditingId(member._id);
      setFormData({
        name: member.name,
        role: member.role,
        category: member.category,
        image: member.image || '',
        color: member.color || '#0065FF',
        tags: member.tags ? member.tags.join(', ') : '',
        order: member.order || 0,
        trainerRoles: member.trainerRoles || [] // On récupère les rôles existants
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', role: '', category: 'performance', image: '', color: '#0065FF', tags: '', order: 0, trainerRoles: []
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  // Sauvegarder (Créer ou Modifier)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Formater les données avant l'envoi
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''), 
      order: parseInt(formData.order, 10) || 0,
      trainerRoles: formData.trainerRoles // On envoie les rôles cochés
    };

    try {
      const url = editingId ? `/api/team/${editingId}` : '/api/team';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (data.success) {
        fetchMembers(); // Recharger la liste
        closeModal();
      } else {
        alert("Erreur: " + data.error);
      }
    } catch (error) {
      console.error("Erreur de sauvegarde :", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Es-tu sûr de vouloir supprimer ce membre ?")) return;

    try {
      const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        setMembers(members.filter(m => m._id !== id));
      } else {
        // Ajout d'une alerte en cas d'échec pour comprendre pourquoi
        alert("Impossible de supprimer : " + data.error);
      }
    } catch (error) {
      console.error("Erreur réseau lors de la suppression :", error);
    }
  };

  // Affichage du composant
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 leading-tight pt-2">
            Staff & <span className="text-[#9333EA]">Bénévoles</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Gérez l'équipe technique et le bureau du club.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[#9333EA] hover:bg-[#7e22ce] text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={16} /> Ajouter un membre
        </button>
      </div>

      {/* LISTE DES MEMBRES */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 size={48} className="animate-spin mb-4 text-[#9333EA]" />
          <p className="font-bold uppercase tracking-widest text-sm">Chargement de l'équipe...</p>
        </div>
      ) : members.length === 0 ? (
        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-10 text-center">
          <Users size={48} className="mx-auto text-slate-400 mb-4" />
          <h3 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white mb-2">Aucun membre</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">Commencez par ajouter votre premier entraîneur ou bénévole.</p>
          <button onClick={() => openModal()} className="text-[#9333EA] font-bold hover:underline">Ajouter maintenant</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {members.map(member => (
            <div key={member._id} className="bg-white dark:bg-[#0f172a] rounded-[1.5rem] border border-slate-200 dark:border-white/5 p-6 shadow-sm flex items-start gap-4 group transition-colors hover:border-slate-300 dark:hover:border-white/20">
              
              {/* Avatar ou Initiales */}
              <div 
                className="w-16 h-16 rounded-full shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 overflow-hidden border-2 mt-1"
                style={{ borderColor: member.color || '#0065FF' }}
              >
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-[900] text-xl italic text-slate-400">
                    {member.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">
                  {member.category}
                </span>
                <h3 className="text-base font-[900] uppercase italic text-[#081031] dark:text-white truncate">
                  {member.name}
                </h3>
                <p className="text-sm font-bold text-slate-500 truncate mb-2" style={{ color: member.color || '#0065FF' }}>
                  {member.role}
                </p>
                
                {/* Affichage des groupes entraînés s'ils existent */}
                {member.trainerRoles && member.trainerRoles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {member.trainerRoles.map(tr => (
                      <span key={tr} className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                        {tr}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => openModal(member)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-[#9333EA] hover:text-white flex items-center justify-center text-slate-500 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(member._id)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-red-500 hover:text-white flex items-center justify-center text-slate-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL AJOUT / MODIFICATION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#081031] rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-white/10 shadow-2xl">
            
            <div className="sticky top-0 bg-white dark:bg-[#081031] p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center z-10">
              <h2 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white pt-2">
                {editingId ? "Modifier le membre" : "Nouveau membre"}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors">
                <X size={24} className="text-slate-500 dark:text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Nom complet *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-[#081031] dark:text-white focus:outline-none focus:border-[#9333EA] transition-colors"
                  />
                </div>
                {/* Rôle */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Rôle / Poste *</label>
                  <select 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange} 
                    required
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-[#081031] dark:text-white focus:outline-none focus:border-[#9333EA] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Sélectionner un rôle</option>
                    <option value="Entraîneur">Entraîneur</option>
                    <option value="GEO">GEO</option>
                    <option value="Arbitre">Arbitre</option>
                    <option value="Juge Arbitre">Juge Arbitre</option>
                  </select>
                </div>
              </div>

              {/* --- NOUVELLE SECTION : GROUPES ENTRAÎNÉS --- */}
              <div className="col-span-1 md:col-span-2 space-y-3 bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-200 dark:border-white/10">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Users size={14} /> Groupes entraînés (Si c'est un entraîneur)
                </label>
                <div className="flex flex-wrap gap-3">
                  {trainerOptions.map(group => {
                    const isChecked = formData.trainerRoles.includes(group);
                    return (
                      <div 
                        key={group} 
                        onClick={() => handleTrainerRoleToggle(group)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer border-2 transition-all select-none
                          ${isChecked 
                            ? 'border-[#9333EA] bg-[#9333EA]/10 text-[#9333EA]' 
                            : 'border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300 dark:hover:border-white/20'
                          }`}
                      >
                        <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${isChecked ? 'bg-[#9333EA] border-[#9333EA]' : 'border-slate-300 dark:border-white/20'}`}>
                          {isChecked && <Check size={12} className="text-white" />}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">{group}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Catégorie */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Catégorie</label>
                  <select name="category" value={formData.category} onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-[#081031] dark:text-white focus:outline-none focus:border-[#9333EA] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="performance">Pôle Performance</option>
                    <option value="developpement">Pôle Développement</option>
                    <option value="officiel">Officiels (Arbitres...)</option>
                    <option value="geo">GEO</option>
                    <option value="buvette">Buvette & Accueil</option>
                  </select>
                </div>
                {/* Couleur */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Couleur thématique</label>
                  <div className="flex gap-3">
                    <input type="color" name="color" value={formData.color} onChange={handleChange}
                      className="h-12 w-12 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                    />
                    <input type="text" name="color" value={formData.color} onChange={handleChange}
                      className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-[#081031] dark:text-white focus:outline-none focus:border-[#9333EA]"
                    />
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-2"><ImageIcon size={14}/> URL de la photo</label>
                <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://..."
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-[#081031] dark:text-white focus:outline-none focus:border-[#9333EA] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Tags divers (Séparés par des virgules)</label>
                  <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="Ex: Diplôme d'état, Bureau"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-[#081031] dark:text-white focus:outline-none focus:border-[#9333EA] transition-colors"
                  />
                </div>

                {/* Ordre */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Ordre d'affichage</label>
                  <input type="number" name="order" value={formData.order} onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-[#081031] dark:text-white focus:outline-none focus:border-[#9333EA] transition-colors"
                  />
                </div>
              </div>

              {/* Boutons */}
              <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex justify-end gap-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={isSaving} className="bg-[#9333EA] hover:bg-[#7e22ce] text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all disabled:opacity-50 flex items-center gap-2">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                  {editingId ? 'Mettre à jour' : 'Créer le membre'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}