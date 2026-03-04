'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Trophy, Image as ImageIcon, Loader2, Medal, User, UploadCloud } from 'lucide-react';

export default function AdminJoueursPage() {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Nouvel état pour l'upload

  const [formData, setFormData] = useState({
    name: '', team: 'equipe-1', category: '', rank: '', titles: '', image: '', accentColor: '#0065FF', badge: '', order: 0
  });

  const fetchPlayers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/players');
      const data = await res.json();
      if (data.success) setPlayers(data.data);
    } catch (error) { console.error(error); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchPlayers(); }, []);

  // Gestion des champs classiques avec conversion en nombre pour 'order'
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'order' ? Number(value) : value });
  };

  // NOUVEAU : Fonction pour gérer l'upload de l'image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    // On convertit l'image en Base64 pour la stocker facilement dans MongoDB
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const openModal = (player = null) => {
    if (player) {
      setEditingId(player._id);
      setFormData({ ...player });
    } else {
      setEditingId(null);
      setFormData({ name: '', team: 'equipe-1', category: '', rank: '', titles: '', image: '', accentColor: '#0065FF', badge: '', order: 0 });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingId ? `/api/players/${editingId}` : '/api/players';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) { fetchPlayers(); closeModal(); } 
      else { alert("Erreur: " + data.error); }
    } catch (error) { console.error(error); } 
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce joueur ?")) return;
    try {
      const res = await fetch(`/api/players/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setPlayers(players.filter(p => p._id !== id));
    } catch (error) { console.error(error); }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 leading-tight pt-2">
            Effectif <span className="text-[#F72585]">Joueurs</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Gérez l'Équipe 1 et le Pôle Performance Jeunes.</p>
        </div>
        <button onClick={() => openModal()} className="bg-[#F72585] hover:bg-[#d91c70] text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all shadow-md">
          <Plus size={16} /> Ajouter un joueur
        </button>
      </div>

      {/* LISTE DES JOUEURS (Inchangé) */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 size={48} className="animate-spin text-[#F72585]" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {players.map(player => (
            <div key={player._id} className="bg-white dark:bg-[#0f172a] rounded-[1.5rem] border border-slate-200 dark:border-white/5 p-5 shadow-sm relative group flex flex-col gap-3">
              
              <div className="flex justify-between items-start">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${player.team === 'equipe-1' ? 'bg-[#0065FF]/10 text-[#0065FF]' : 'bg-[#FFD500]/20 text-[#D4AF37] dark:text-[#FFD500]'}`}>
                  {player.team === 'equipe-1' ? 'Équipe 1' : 'Pôle Perf'}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => openModal(player)} className="text-slate-400 hover:text-[#0065FF]"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(player._id)} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 overflow-hidden shrink-0" style={{ borderColor: player.accentColor }}>
                  {player.image ? <img src={player.image} alt={player.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100 flex items-center justify-center"><User size={20} className="text-slate-400"/></div>}
                </div>
                <div>
                  <h3 className="text-lg font-[900] uppercase italic text-[#081031] dark:text-white leading-tight">{player.name}</h3>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{player.category || 'Catégorie N/A'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-lg text-center">
                  <div className="text-[8px] font-black uppercase text-slate-400">Classement</div>
                  <div className="font-bold text-xs" style={{ color: player.accentColor }}>{player.rank || '-'}</div>
                </div>
                <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-lg text-center">
                  <div className="text-[8px] font-black uppercase text-slate-400 flex items-center justify-center gap-1"><Trophy size={8}/> Palmarès</div>
                  <div className="font-bold text-[9px] text-[#081031] dark:text-white truncate">{player.titles || '-'}</div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#081031] rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-[#081031] p-6 border-b border-slate-200 dark:border-white/10 flex justify-between z-10">
              <h2 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white">{editingId ? "Modifier" : "Nouveau joueur"}</h2>
              <button onClick={closeModal}><X size={24} className="text-slate-500" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* NOUVEAU : Section Upload d'image avec aperçu */}
              <div className="flex items-center gap-6 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10">
                <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-[#081031] overflow-hidden border-2 border-slate-300 dark:border-white/20 shrink-0 flex items-center justify-center relative">
                  {formData.image ? (
                    <img src={formData.image} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={24} className="text-slate-400" />
                  )}
                  {isUploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 size={20} className="animate-spin text-white"/></div>}
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Photo de profil</label>
                  <label className="cursor-pointer bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:border-[#F72585] transition-colors inline-flex">
                    <UploadCloud size={16} className="text-[#F72585]" /> Parcourir...
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Nom complet *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Groupe / Équipe *</label>
                  <select name="team" value={formData.team} onChange={handleChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold appearance-none">
                    <option value="equipe-1">Équipe 1 (Interclubs)</option>
                    <option value="performance-jeunes">Pôle Performance (Jeunes)</option>
                  </select>
                </div>

                {/* NOUVEAU : Champ Ordre de priorité */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Ordre d'affichage (1 = Premier)</label>
                  <input type="number" name="order" value={formData.order} onChange={handleChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Classement (ex: N2 / N3)</label>
                  <input type="text" name="rank" value={formData.rank} onChange={handleChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Catégorie (ex: Cadet, Sénior)</label>
                  <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Meilleur Palmarès</label>
                  <input type="text" name="titles" value={formData.titles} onChange={handleChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Couleur d'accent</label>
                  <div className="flex gap-2">
                    <input type="color" name="accentColor" value={formData.accentColor} onChange={handleChange} className="h-12 w-12 rounded-xl border-0 bg-transparent p-0 cursor-pointer" />
                    <input type="text" name="accentColor" value={formData.accentColor} onChange={handleChange} className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Badge spécial (Optionnel)</label>
                  <input type="text" name="badge" value={formData.badge} onChange={handleChange} placeholder="Ex: Capitaine, Future Championne..." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold" />
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-200 flex justify-end gap-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-100">Annuler</button>
                <button type="submit" disabled={isSaving || isUploading} className="bg-[#F72585] text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2">
                  {(isSaving || isUploading) && <Loader2 size={16} className="animate-spin" />} {editingId ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}