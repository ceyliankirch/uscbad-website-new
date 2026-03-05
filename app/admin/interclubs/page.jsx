'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  Loader2, 
  Link as LinkIcon, 
  Trophy, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Pencil, 
  Trash2, 
  Camera, 
  User, 
  Hash, 
  Info, 
  UserPlus, 
  X, 
  ExternalLink,
  Star,
  Users
} from 'lucide-react';

export default function AdminInterclubsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // États pour la configuration ICBAD
  const [configData, setConfigData] = useState({ 
    team1Url: '', 
    clubUrl: '', 
    team1Id: '', 
    team2Id: '', 
    team3Id: '' 
  });

  // États pour la gestion des joueurs
  const [players, setPlayers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [playerForm, setPlayerForm] = useState({
    name: '', 
    role: '', 
    rank: '', 
    gender: 'male', 
    played: 0, 
    wins: 0, 
    anecdote: '', 
    image: null, 
    order: 0, 
    team: 'N1'
  });

  const fileInputRef = useRef(null);

  // --- CHARGEMENT INITIAL ---
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      // Fonction utilitaire pour fetcher en vérifiant que la réponse est bien du JSON
      const safeFetch = async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("L'API n'a pas renvoyé de JSON. Vérifiez que la route existe.");
        }
        return res.json();
      };

      const configJson = await safeFetch('/api/admin/icbad-config');
      const playersJson = await safeFetch('/api/team-players?team=N1');
      
      if (configJson.success) setConfigData(configJson.data);
      if (playersJson.success) setPlayers(playersJson.data);
    } catch (error) {
      console.error("Erreur de chargement des données interclubs", error);
      setMessage({ 
        type: 'error', 
        text: `Erreur de connexion : ${error.message}. Assurez-vous d'avoir créé les routes API.` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- GESTION DE LA CONFIGURATION ---
  const handleConfigChange = (e) => {
    setConfigData({ ...configData, [e.target.name]: e.target.value });
  };

  const saveConfig = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/icbad-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData)
      });
      
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        setMessage({ type: 'success', text: 'Configuration ICBAD enregistrée.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        throw new Error("Réponse invalide du serveur.");
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde : ' + e.message });
    } finally {
      setIsSaving(false);
    }
  };

  // --- GESTION DES JOUEURS ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image trop lourde (Max 2Mo)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPlayerForm({ ...playerForm, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const openPlayerModal = (player = null) => {
    if (player) {
      setEditingId(player._id);
      setPlayerForm(player);
    } else {
      setEditingId(null);
      setPlayerForm({
        name: '', role: '', rank: '', gender: 'male', played: 0, wins: 0, anecdote: '', image: null, order: players.length, team: 'N1'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const submitPlayer = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/team-players/${editingId}` : '/api/team-players';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerForm)
      });

      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        closeModal();
        fetchInitialData();
      } else {
        throw new Error("Réponse invalide.");
      }
    } catch (e) {
      alert("Erreur lors de la gestion du joueur : " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deletePlayer = async (id) => {
    if (!window.confirm("Supprimer définitivement ce joueur de l'effectif ?")) return;
    try {
      const res = await fetch(`/api/team-players/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchInitialData();
      }
    } catch (e) {
      alert("Erreur suppression.");
    }
  };

  if (isLoading && !message.text) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="animate-spin text-[#0065FF]" size={48} />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Initialisation du centre de contrôle...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-24 font-['Montserrat']">
      
      {/* HEADER SECTION */}
      <div className="mb-10 border-b border-slate-200 dark:border-white/10 pb-8">
        <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 pt-2">
          Gestion <span className="text-[#0065FF] dark:text-[#0EE2E2]">Interclubs</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest">Contrôle des classements dynamiques et de l'effectif Élite</p>
      </div>

      {message.text && (
        <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm animate-in zoom-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
          {message.type === 'error' && (
            <button onClick={fetchInitialData} className="ml-auto underline text-xs uppercase tracking-widest">Réessayer</button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        
        {/* COLONNE GAUCHE : CONFIGURATION URLs & IDs */}
        <div className="xl:col-span-4 space-y-6">
          <form onSubmit={saveConfig} className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 p-6 lg:p-8 shadow-sm space-y-8">
            <div>
              <h2 className="text-base font-[900] uppercase italic text-[#081031] dark:text-white flex items-center gap-2 mb-2">
                <LinkIcon size={18} className="text-[#0065FF]" /> Liens ICBAD
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Synchronisation FFBaD</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">URL Équipe 1 (N1)</label>
                <input type="url" name="team1Url" value={configData.team1Url} onChange={handleConfigChange} required className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0065FF] transition-all" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">URL Globale du Club</label>
                <input type="url" name="clubUrl" value={configData.clubUrl} onChange={handleConfigChange} required className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0065FF] transition-all" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-4">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Identifiants de poule</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Equipe 1 (N1)</label>
                  <input type="text" name="team1Id" value={configData.team1Id} onChange={handleConfigChange} placeholder="Ex: 94-USC-1" className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0065FF] transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Equipe 2 (Rég)</label>
                  <input type="text" name="team2Id" value={configData.team2Id} onChange={handleConfigChange} placeholder="Ex: 94-USC-2" className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0065FF] transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Equipe 3 (Rég)</label>
                  <input type="text" name="team3Id" value={configData.team3Id} onChange={handleConfigChange} placeholder="Ex: 94-USC-3" className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0065FF] transition-all" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSaving} className="w-full bg-[#081031] dark:bg-white text-white dark:text-[#081031] py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-[#0065FF] dark:hover:bg-[#0EE2E2] transition-all shadow-lg">
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Enregistrer les Paramètres
            </button>
          </form>

          <div className="bg-[#0065FF]/10 p-6 rounded-[2rem] border border-[#0065FF]/20 text-center">
            <h3 className="text-xs font-black uppercase text-[#0065FF] mb-2 flex items-center justify-center gap-2">
              <Info size={14}/> Aide au scraping
            </h3>
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
              L'URL de l'équipe 1 sert pour les rencontres. L'URL Globale sert pour extraire tous les classements.
            </p>
          </div>
        </div>

        {/* COLONNE DROITE : GESTION DES JOUEURS N1 */}
        <div className="xl:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#0EE2E2]/10 text-[#0EE2E2] rounded-2xl flex items-center justify-center">
                <Trophy size={24} />
              </div>
              <div>
                <h2 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white leading-none mb-1">Effectif Nationale 1</h2>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{players.length} athlètes enregistrés</p>
              </div>
            </div>
            <button 
              onClick={() => openPlayerModal()}
              className="bg-[#0EE2E2] hover:bg-[#0bd1d1] text-[#081031] px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all shadow-md group"
            >
              <UserPlus size={18} className="group-hover:scale-110 transition-transform" /> 
              Nouveau Joueur
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map((player) => (
              <div key={player._id} className="bg-white dark:bg-[#0f172a] p-5 rounded-[2.5rem] border border-slate-200 dark:border-white/10 flex items-center gap-5 group hover:border-[#0065FF] hover:shadow-xl transition-all relative overflow-hidden">
                <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-slate-100 dark:border-white/5 bg-slate-100 dark:bg-[#081031] shrink-0 relative">
                  {player.image ? (
                    <img src={player.image} className="w-full h-full object-cover" alt={player.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={32} /></div>
                  )}
                  <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-tl-xl flex items-center justify-center ${player.gender === 'female' ? 'bg-[#F72585]' : 'bg-[#0EE2E2]'} text-white`}>
                    <Star size={10} fill="currentColor" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-base uppercase italic text-[#081031] dark:text-white truncate mb-1">{player.name}</h3>
                  <p className="text-[10px] font-black text-[#0065FF] dark:text-[#0EE2E2] uppercase tracking-wider mb-2">{player.role}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg text-slate-500 border border-slate-200 dark:border-white/5 uppercase">{player.rank}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{player.wins} V / {player.played} M</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 relative z-10">
                  <button onClick={() => openPlayerModal(player)} className="p-2.5 bg-slate-50 dark:bg-[#081031] text-slate-400 hover:text-[#0065FF] rounded-xl transition-colors shadow-sm"><Pencil size={16} /></button>
                  <button onClick={() => deletePlayer(player._id)} className="p-2.5 bg-slate-50 dark:bg-[#081031] text-slate-400 hover:text-red-500 rounded-xl transition-colors shadow-sm"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}

            {!isLoading && players.length === 0 && (
              <div className="col-span-full py-16 bg-white dark:bg-[#0f172a] rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center">
                <Users size={48} className="text-slate-200 mb-4" />
                <h4 className="font-black uppercase text-slate-400 italic">Aucun joueur pour le moment</h4>
                <p className="text-xs font-bold text-slate-500 mt-1 px-10">Ajoutez les membres de l'équipe pour le carrousel.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODALE JOUEUR DYNAMIQUE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#081031] rounded-[3rem] w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-white/10">
            
            <div className="p-6 lg:p-8 border-b border-slate-200 dark:border-white/10 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0065FF] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#0065FF]/20">
                  <Users size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white leading-none mb-1">
                    {editingId ? 'Modifier l\'athlète' : 'Nouvel athlète'}
                  </h2>
                  <p className="text-[10px] font-black uppercase text-[#0065FF] tracking-widest italic">Équipe Nationale 1</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"><X size={20}/></button>
            </div>

            <form onSubmit={submitPlayer} className="overflow-y-auto hide-scrollbar p-6 lg:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-8 bg-slate-50 dark:bg-[#0f172a] p-6 rounded-[2rem] border border-slate-100 dark:border-white/5">
                  <div className="relative group shrink-0">
                    <div className="w-32 h-32 rounded-[2rem] border-4 border-white dark:border-[#081031] overflow-hidden bg-slate-200 dark:bg-[#081031] flex items-center justify-center shadow-xl">
                      {playerForm.image ? (
                        <img src={playerForm.image} className="w-full h-full object-cover" alt="Aperçu" />
                      ) : (
                        <User size={48} className="text-slate-400" />
                      )}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()} 
                      className="absolute -bottom-3 -right-3 w-11 h-11 bg-[#0065FF] text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-4 border-white dark:border-[#0f172a]"
                    >
                      <Camera size={18} />
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h4 className="font-black uppercase text-sm text-[#081031] dark:text-white italic">Photo Officielle</h4>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed max-w-xs">
                      Portrait <span className="text-[#0065FF]">détouré (PNG sans fond)</span> recommandé. Max 2Mo.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Nom du joueur *</label>
                  <input type="text" value={playerForm.name} onChange={e => setPlayerForm({...playerForm, name: e.target.value})} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0065FF]/10 focus:border-[#0065FF] transition-all" placeholder="Prénom NOM" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Spécialité / Rôle *</label>
                  <input type="text" value={playerForm.role} onChange={e => setPlayerForm({...playerForm, role: e.target.value})} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0065FF]/10 focus:border-[#0065FF] transition-all" placeholder="ex: Simple Homme / Double" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Surnom *</label>
                  <input type="text" value={playerForm.rank} onChange={e => setPlayerForm({...playerForm, rank: e.target.value})} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0065FF]/10 focus:border-[#0065FF] transition-all" placeholder="ex: N1" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Genre</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button" 
                      onClick={() => setPlayerForm({...playerForm, gender: 'male'})}
                      className={`py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 ${playerForm.gender === 'male' ? 'bg-[#0EE2E2] border-[#0EE2E2] text-[#081031]' : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-400'}`}
                    >
                      Homme
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setPlayerForm({...playerForm, gender: 'female'})}
                      className={`py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 ${playerForm.gender === 'female' ? 'bg-[#F72585] border-[#F72585] text-white' : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-400'}`}
                    >
                      Femme
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1.5 ml-1"><Hash size={12}/> Matchs disputés</label>
                  <input type="number" value={playerForm.played} onChange={e => setPlayerForm({...playerForm, played: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0065FF]/10 focus:border-[#0065FF] transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1.5 ml-1"><CheckCircle size={12} className="text-green-500"/> Victoires</label>
                  <input type="number" value={playerForm.wins} onChange={e => setPlayerForm({...playerForm, wins: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0065FF]/10 focus:border-[#0065FF] transition-all" />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1.5 ml-1"><Info size={12} className="text-[#0065FF]"/> Anecdote ou Citation</label>
                  <textarea rows="3" value={playerForm.anecdote} onChange={e => setPlayerForm({...playerForm, anecdote: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-[#0065FF]/10 focus:border-[#0065FF] transition-all resize-none" placeholder="Citation ou fait marquant..."></textarea>
                </div>

                <div className="md:col-span-2 flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/10">
                   <div className="flex gap-4 w-full justify-end">
                      <button type="button" onClick={closeModal} className="px-8 py-4 text-xs font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">Annuler</button>
                      <button type="submit" disabled={isSaving} className="bg-[#0065FF] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-[#0065FF]/20">
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {editingId ? 'Mettre à jour' : 'Enregistrer'}
                      </button>
                   </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}