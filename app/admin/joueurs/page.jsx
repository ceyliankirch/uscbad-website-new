'use client';
import React, { useState, useEffect } from 'react';
import { 
  Search, Loader2, Filter, Upload, Mail, Phone, ChevronLeft, 
  ChevronRight, User, Hash, Edit2, Trash2, X, Save, Plus, 
  Pencil, Trophy, Image as ImageIcon, UploadCloud, Users, Star, CheckSquare 
} from 'lucide-react';

const filterOptions = ["Tout voir", "Adultes - Loisirs", "Adultes - Compétiteurs", "Jeunes", "Pôle Féminin", "Indivs", "Non assigné"];
const ITEMS_PER_PAGE = 25;

// Helper pour formater les numéros de téléphone (ex: (+33) 668099682 -> +33 6 68 09 96 82)
const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, ''); // Ne garde que les chiffres
  
  if (cleaned.startsWith('33') && cleaned.length === 11) {
    return `+33 ${cleaned[2]} ${cleaned.substring(3, 5)} ${cleaned.substring(5, 7)} ${cleaned.substring(7, 9)} ${cleaned.substring(9, 11)}`;
  } else if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `+33 ${cleaned[1]} ${cleaned.substring(2, 4)} ${cleaned.substring(4, 6)} ${cleaned.substring(6, 8)} ${cleaned.substring(8, 10)}`;
  }
  return phone; // Retourne tel quel si format non reconnu
};

export default function AdminJoueursPage() {
  const [activeTab, setActiveTab] = useState('licencies'); // 'licencies' ou 'effectifs'

  // =========================================================================
  // ÉTATS : SECTION BASE LICENCIÉS (CSV Poona)
  // =========================================================================
  const [members, setMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tout voir');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingMember, setEditingMember] = useState(null);
  const [isSavingMember, setIsSavingMember] = useState(false);

  // États pour l'action en masse (Bulk Selection)
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [bulkCategory, setBulkCategory] = useState('');
  const [isBulkSaving, setIsBulkSaving] = useState(false);

  // =========================================================================
  // ÉTATS : SECTION EFFECTIF JOUEURS (Équipe 1 & Pôle Perf)
  // =========================================================================
  const [elitePlayers, setElitePlayers] = useState([]);
  const [isLoadingElite, setIsLoadingElite] = useState(true);
  const [isEliteModalOpen, setIsEliteModalOpen] = useState(false);
  const [editingEliteId, setEditingEliteId] = useState(null);
  const [isSavingElite, setIsSavingElite] = useState(false);
  const [isUploadingElite, setIsUploadingElite] = useState(false);

  const [eliteFormData, setEliteFormData] = useState({
    name: '', team: 'equipe-1', category: '', rank: '', titles: '', image: '', accentColor: '#0065FF', badge: '', order: 0
  });

  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    fetchMembers();
    fetchElitePlayers();
  }, []);

  // --- LOGIQUE : BASE LICENCIÉS ---
  const fetchMembers = async () => {
    setIsLoadingMembers(true);
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (data.success) setMembers(data.data);
    } catch (error) { console.error("Erreur chargement membres:", error); } 
    finally { setIsLoadingMembers(false); }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const text = event.target.result;
      const rows = text.split('\n');
      const newMembers = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].trim();
        if (!row) continue;
        const cols = row.split(';').map(col => col.replace(/(^"|"$)/g, '').trim());

        if (cols.length >= 4) {
          newMembers.push({
            sexe: cols[0],
            nom: cols[1],
            prenom: cols[2],
            licence: cols[3],
            email: cols[4] || '',
            telephone: cols[5] || '',
          });
        }
      }

      if (newMembers.length === 0) {
        alert("Aucun licencié trouvé dans le fichier CSV ou format incorrect.");
        setIsImporting(false);
        e.target.value = null;
        return;
      }

      try {
        const res = await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMembers)
        });
        const data = await res.json();
        
        if (data.success) {
          alert(data.message);
          fetchMembers();
        } else { alert("Erreur lors de l'import : " + data.error); }
      } catch (err) { alert("Impossible de joindre le serveur pour l'import."); } 
      finally { setIsImporting(false); e.target.value = null; }
    };
    // Changement de l'encodage ici pour supporter correctement les accents des CSV Poona/Excel
    reader.readAsText(file, 'ISO-8859-1');
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    setIsSavingMember(true);
    try {
      const res = await fetch(`/api/members/${editingMember._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: editingMember.category })
      });
      if (res.ok) {
        setEditingMember(null);
        fetchMembers();
      }
    } catch (err) { alert("Erreur de sauvegarde"); } 
    finally { setIsSavingMember(false); }
  };

  const deleteMember = async (id) => {
    if (!window.confirm("Supprimer ce joueur de la base de données ?")) return;
    try {
      await fetch(`/api/members/${id}`, { method: 'DELETE' });
      fetchMembers();
      // On retire aussi de la sélection si supprimé
      setSelectedMembers(prev => prev.filter(mId => mId !== id));
    } catch (error) { console.error(error); }
  };

  // --- LOGIQUE ACTIONS EN MASSE (BULK) ---
  const toggleSelection = (id) => {
    setSelectedMembers(prev => prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]);
  };

  const handleSelectAllCurrentPage = (e, currentIds) => {
    if (e.target.checked) {
      const newSelected = new Set([...selectedMembers, ...currentIds]);
      setSelectedMembers(Array.from(newSelected));
    } else {
      setSelectedMembers(selectedMembers.filter(id => !currentIds.includes(id)));
    }
  };

  const handleBulkAssign = async () => {
    if (!bulkCategory || selectedMembers.length === 0) return;
    setIsBulkSaving(true);
    try {
      // Exécution de la mise à jour en parallèle pour tous les IDs sélectionnés
      await Promise.all(selectedMembers.map(id => 
        fetch(`/api/members/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: bulkCategory })
        })
      ));
      
      fetchMembers();
      setSelectedMembers([]);
      setBulkCategory('');
    } catch (error) {
      alert("Erreur lors de l'assignation en masse.");
    } finally {
      setIsBulkSaving(false);
    }
  };


  const filteredMembers = members.filter(m => {
    const searchString = `${m.nom} ${m.prenom} ${m.licence} ${m.email}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    const matchesGroup = activeFilter === 'Tout voir' || m.category === activeFilter;
    return matchesSearch && matchesGroup;
  });

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMembers = filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const currentMemberIds = currentMembers.map(m => m._id);
  const isAllCurrentSelected = currentMemberIds.length > 0 && currentMemberIds.every(id => selectedMembers.includes(id));

  useEffect(() => { setCurrentPage(1); }, [searchQuery, activeFilter]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Adultes - Loisirs': return '#10B981';
      case 'Adultes - Compétiteurs': return '#0065FF';
      case 'Jeunes': return '#F97316';
      case 'Pôle Féminin': return '#F72585';
      case 'Indivs': return '#9333EA';
      default: return '#64748b';
    }
  };

  // --- LOGIQUE : EFFECTIF JOUEURS (Élite) ---
  const fetchElitePlayers = async () => {
    setIsLoadingElite(true);
    try {
      const res = await fetch('/api/players');
      const data = await res.json();
      if (data.success) setElitePlayers(data.data);
    } catch (error) { console.error(error); } 
    finally { setIsLoadingElite(false); }
  };

  const handleEliteChange = (e) => {
    const { name, value } = e.target;
    setEliteFormData({ ...eliteFormData, [name]: name === 'order' ? Number(value) : value });
  };

  const handleEliteImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingElite(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setEliteFormData({ ...eliteFormData, image: reader.result });
      setIsUploadingElite(false);
    };
    reader.readAsDataURL(file);
  };

  const openEliteModal = (player = null) => {
    if (player) {
      setEditingEliteId(player._id);
      setEliteFormData({ ...player });
    } else {
      setEditingEliteId(null);
      setEliteFormData({ name: '', team: 'equipe-1', category: '', rank: '', titles: '', image: '', accentColor: '#0065FF', badge: '', order: 0 });
    }
    setIsEliteModalOpen(true);
  };

  const closeEliteModal = () => setIsEliteModalOpen(false);

  const handleEliteSubmit = async (e) => {
    e.preventDefault();
    setIsSavingElite(true);
    try {
      const url = editingEliteId ? `/api/players/${editingEliteId}` : '/api/players';
      const method = editingEliteId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eliteFormData),
      });
      const data = await res.json();
      if (data.success) { fetchElitePlayers(); closeEliteModal(); } 
      else { alert("Erreur: " + data.error); }
    } catch (error) { console.error(error); } 
    finally { setIsSavingElite(false); }
  };

  const handleEliteDelete = async (id) => {
    if (!window.confirm("Supprimer ce joueur de l'effectif ?")) return;
    try {
      const res = await fetch(`/api/players/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setElitePlayers(elitePlayers.filter(p => p._id !== id));
    } catch (error) { console.error(error); }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Montserrat'] pb-24 max-w-[1600px] mx-auto">
      
      {/* HEADER GLOBAL & ONGLETS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 pt-2">
            Gestion <span className="text-[#0065FF]">Joueurs</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">
            Licenciés FFBaD & Effectifs du Club
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-[#0f172a] p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm w-fit overflow-x-auto max-w-full hide-scrollbar">
          <button 
            onClick={() => setActiveTab('licencies')}
            className={`px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shrink-0 ${activeTab === 'licencies' ? 'bg-[#081031] dark:bg-white text-white dark:text-[#081031] shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
          >
            <Users size={14} /> Base Licenciés
          </button>
          <button 
            onClick={() => setActiveTab('effectifs')}
            className={`px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shrink-0 ${activeTab === 'effectifs' ? 'bg-[#F72585] text-white shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
          >
            <Star size={14} /> Effectifs & Pôles
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ONGLET 1 : BASE LICENCIÉS (CSV Poona)                                       */}
      {/* ========================================================================= */}
      {activeTab === 'licencies' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="text-xl font-[900] italic uppercase text-[#081031] dark:text-white">
              Licenciés <span className="text-[#0065FF]">Poona</span> ({members.length})
            </h2>
            <label className="cursor-pointer bg-[#0065FF] hover:bg-[#0052cc] text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-[#0065FF]/20">
              {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              Importer CSV Poona
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" disabled={isImporting} />
            </label>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar w-full gap-3 pb-4 px-1">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveFilter(opt)}
                className={`flex items-center gap-2 px-5 py-2.5 whitespace-nowrap rounded-full font-bold text-[10px] sm:text-xs uppercase transition-all shadow-sm border shrink-0 ${
                  activeFilter === opt 
                    ? 'bg-[#081031] text-white border-[#081031] dark:bg-[#0EE2E2] dark:text-[#081031] dark:border-[#0EE2E2]' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-[#0065FF] hover:text-[#0065FF] dark:bg-[#0f172a] dark:text-slate-400 dark:border-white/10 dark:hover:text-[#0EE2E2] dark:hover:border-[#0EE2E2]'
                }`}
              >
                {opt !== 'Tout voir' && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getCategoryColor(opt) }} />}
                {opt}
              </button>
            ))}
          </div>

          <div className="mb-6 bg-white dark:bg-[#0f172a] p-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="relative w-full">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher par nom, prénom, licence ou email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#081031] border-none rounded-xl pl-12 pr-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#0065FF] text-[#081031] dark:text-white transition-all"
              />
            </div>
          </div>

          {/* BARRE D'ACTION BULK (Sélection multiple) */}
          {selectedMembers.length > 0 && (
            <div className="bg-[#0065FF]/10 border border-[#0065FF]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckSquare size={20} className="text-[#0065FF]" />
                <span className="text-sm font-black uppercase tracking-widest text-[#0065FF]">{selectedMembers.length} Joueur(s) sélectionné(s)</span>
              </div>
              <div className="flex w-full sm:w-auto items-center gap-3">
                <select 
                  value={bulkCategory} 
                  onChange={e => setBulkCategory(e.target.value)} 
                  className="bg-white dark:bg-[#081031] border border-[#0065FF]/20 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0065FF] text-[#081031] dark:text-white appearance-none cursor-pointer"
                >
                  <option value="" disabled>Choisir une catégorie...</option>
                  {filterOptions.filter(opt => opt !== 'Tout voir').map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <button 
                  onClick={handleBulkAssign}
                  disabled={!bulkCategory || isBulkSaving}
                  className="bg-[#0065FF] hover:bg-[#0052cc] text-white px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
                >
                  {isBulkSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Assigner
                </button>
                <button 
                  onClick={() => setSelectedMembers([])}
                  className="p-2.5 text-slate-500 hover:bg-white dark:hover:bg-[#081031] rounded-xl transition-colors"
                  title="Annuler la sélection"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {isLoadingMembers ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0065FF]" size={48} /></div>
          ) : (
            <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#081031] border-b border-slate-200 dark:border-white/10">
                      <th className="px-6 py-5 w-12 text-center">
                        <input 
                          type="checkbox" 
                          checked={isAllCurrentSelected}
                          onChange={(e) => handleSelectAllCurrentPage(e, currentMemberIds)}
                          className="w-4 h-4 text-[#0065FF] rounded border-slate-300 focus:ring-[#0065FF] cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest w-12 text-center">S.</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Identité</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest"><span className="flex items-center gap-1.5"><Hash size={12}/> Licence</span></th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest hidden lg:table-cell">Contact</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Catégorie</th>
                      <th className="px-6 py-5 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {currentMembers.length === 0 ? (
                      <tr><td colSpan="7" className="px-6 py-16 text-center text-slate-400 font-bold text-sm italic">Aucun licencié trouvé.</td></tr>
                    ) : (
                      currentMembers.map((member) => (
                        <tr key={member._id} className={`hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group ${selectedMembers.includes(member._id) ? 'bg-[#0065FF]/5 dark:bg-[#0065FF]/10' : ''}`}>
                          <td className="px-6 py-4 text-center">
                            <input 
                              type="checkbox" 
                              checked={selectedMembers.includes(member._id)}
                              onChange={() => toggleSelection(member._id)}
                              className="w-4 h-4 text-[#0065FF] rounded border-slate-300 focus:ring-[#0065FF] cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs mx-auto ${member.sexe === 'F' ? 'bg-[#F72585]/10 text-[#F72585]' : 'bg-[#0065FF]/10 text-[#0065FF]'}`}>
                              {member.sexe}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-[900] uppercase text-sm text-[#081031] dark:text-white leading-tight">
                              {member.nom} <span className="text-[#0065FF] dark:text-[#0EE2E2]">{member.prenom}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs font-bold text-slate-500 tracking-widest bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md">
                              {member.licence}
                            </span>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <div className="space-y-1.5">
                              {member.email && (
                                <a href={`mailto:${member.email}`} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-[#0065FF] transition-colors"><Mail size={12}/> {member.email}</a>
                              )}
                              {member.telephone && (
                                <a href={`tel:${member.telephone}`} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-[#0065FF] transition-colors"><Phone size={12}/> {formatPhone(member.telephone)}</a>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span 
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border"
                              style={{ 
                                color: getCategoryColor(member.category), 
                                backgroundColor: `${getCategoryColor(member.category)}10`,
                                borderColor: `${getCategoryColor(member.category)}30`
                              }}
                            >
                              {member.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setEditingMember(member)} className="p-2 bg-slate-100 text-slate-400 hover:text-[#0065FF] hover:bg-[#0065FF]/10 dark:bg-white/5 dark:hover:bg-[#0065FF]/20 rounded-lg transition-colors">
                                <Edit2 size={14} />
                              </button>
                              <button onClick={() => deleteMember(member._id)} className="p-2 bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:bg-white/5 dark:hover:bg-red-500/20 rounded-lg transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="bg-slate-50 dark:bg-[#081031] border-t border-slate-200 dark:border-white/10 p-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl bg-white dark:bg-[#0f172a] text-slate-500 border border-slate-200 dark:border-white/10 disabled:opacity-50 hover:text-[#0065FF] transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl bg-white dark:bg-[#0f172a] text-slate-500 border border-slate-200 dark:border-white/10 disabled:opacity-50 hover:text-[#0065FF] transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ONGLET 2 : EFFECTIFS (Équipe 1 & Pôle)                                      */}
      {/* ========================================================================= */}
      {activeTab === 'effectifs' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-xl font-[900] italic uppercase text-[#081031] dark:text-white mb-1">
                Effectif <span className="text-[#F72585]">Joueurs</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Gérez l'Équipe 1 et le Pôle Performance Jeunes.</p>
            </div>
            <button onClick={() => openEliteModal()} className="bg-[#F72585] hover:bg-[#d91c70] text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all shadow-md">
              <Plus size={16} /> Ajouter un joueur
            </button>
          </div>

          {isLoadingElite ? (
            <div className="flex justify-center py-20"><Loader2 size={48} className="animate-spin text-[#F72585]" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {elitePlayers.map(player => (
                <div key={player._id} className="bg-white dark:bg-[#0f172a] rounded-[1.5rem] border border-slate-200 dark:border-white/5 p-5 shadow-sm relative group flex flex-col gap-3 transition-colors hover:border-[#F72585]">
                  
                  <div className="flex justify-between items-start">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${player.team === 'equipe-1' ? 'bg-[#0065FF]/10 text-[#0065FF]' : 'bg-[#FFD500]/20 text-[#D4AF37] dark:text-[#FFD500]'}`}>
                      {player.team === 'equipe-1' ? 'Équipe 1' : 'Pôle Perf'}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => openEliteModal(player)} className="text-slate-400 hover:text-[#0065FF]"><Pencil size={14} /></button>
                      <button onClick={() => handleEliteDelete(player._id)} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-2 overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800" style={{ borderColor: player.accentColor }}>
                      {player.image ? <img src={player.image} alt={player.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><User size={20} className="text-slate-400"/></div>}
                    </div>
                    <div>
                      <h3 className="text-lg font-[900] uppercase italic text-[#081031] dark:text-white leading-tight">{player.name}</h3>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">{player.category || 'Catégorie N/A'}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-lg text-center border border-slate-100 dark:border-white/5">
                      <div className="text-[8px] font-black uppercase text-slate-400">Classement</div>
                      <div className="font-bold text-xs" style={{ color: player.accentColor }}>{player.rank || '-'}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-lg text-center border border-slate-100 dark:border-white/5">
                      <div className="text-[8px] font-black uppercase text-slate-400 flex items-center justify-center gap-1"><Trophy size={8}/> Palmarès</div>
                      <div className="font-bold text-[9px] text-[#081031] dark:text-white truncate" title={player.titles}>{player.titles || '-'}</div>
                    </div>
                  </div>

                </div>
              ))}
              {elitePlayers.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-500 font-bold uppercase tracking-widest text-sm bg-white dark:bg-[#0f172a] rounded-[2rem] border border-dashed border-slate-200 dark:border-white/10">
                  Aucun effectif renseigné.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALES                                                                   */}
      {/* ========================================================================= */}

      {/* MODALE ÉDITION CATÉGORIE BASE LICENCIÉS (Unitaire) */}
      {editingMember && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#081031] rounded-[2.5rem] w-full max-w-md shadow-2xl border border-slate-200 dark:border-white/10 animate-in zoom-in-95 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-[#0f172a]">
              <h3 className="text-lg font-[900] italic uppercase flex items-center gap-2 text-[#081031] dark:text-white">
                <User size={18} className="text-[#0065FF]" /> Assigner Catégorie
              </h3>
              <button onClick={() => setEditingMember(null)} className="text-slate-400 hover:text-red-500"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSaveMember} className="p-6 space-y-6">
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl text-center">
                <p className="font-black uppercase text-sm text-[#081031] dark:text-white">{editingMember.prenom} {editingMember.nom}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{editingMember.licence}</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Catégorie d'entraînement</label>
                <select 
                  value={editingMember.category} 
                  onChange={e => setEditingMember({...editingMember, category: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0065FF] appearance-none cursor-pointer"
                >
                  {filterOptions.filter(opt => opt !== 'Tout voir').map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditingMember(null)} className="flex-1 py-3.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl font-bold text-xs uppercase text-slate-500 transition-colors">Annuler</button>
                <button type="submit" disabled={isSavingMember} className="flex-1 py-3.5 bg-[#0065FF] hover:bg-[#0052cc] text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all">
                  {isSavingMember ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE AJOUT/ÉDITION JOUEUR ÉLITE */}
      {isEliteModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#081031] rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-white/10 animate-in zoom-in-95">
            <div className="sticky top-0 bg-slate-50 dark:bg-[#0f172a] p-6 border-b border-slate-200 dark:border-white/10 flex justify-between z-10">
              <h2 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white flex items-center gap-2">
                <Star size={20} className="text-[#F72585]" /> {editingEliteId ? "Modifier" : "Nouveau joueur"}
              </h2>
              <button onClick={closeEliteModal}><X size={24} className="text-slate-500 hover:text-red-500" /></button>
            </div>
            
            <form onSubmit={handleEliteSubmit} className="p-6 lg:p-8 space-y-6">
              
              <div className="flex items-center gap-6 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10">
                <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-[#081031] overflow-hidden border-2 border-slate-300 dark:border-white/20 shrink-0 flex items-center justify-center relative">
                  {eliteFormData.image ? (
                    <img src={eliteFormData.image} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={24} className="text-slate-400" />
                  )}
                  {isUploadingElite && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 size={20} className="animate-spin text-white"/></div>}
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Photo de profil</label>
                  <label className="cursor-pointer bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:border-[#F72585] transition-colors inline-flex">
                    <UploadCloud size={16} className="text-[#F72585]" /> Parcourir...
                    <input type="file" accept="image/*" onChange={handleEliteImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Nom complet *</label>
                  <input type="text" name="name" value={eliteFormData.name} onChange={handleEliteChange} required className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#F72585] transition-colors" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Groupe / Équipe *</label>
                  <select name="team" value={eliteFormData.team} onChange={handleEliteChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-[#F72585] transition-colors">
                    <option value="equipe-1">Équipe 1 (Interclubs)</option>
                    <option value="performance-jeunes">Pôle Performance (Jeunes)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Ordre d'affichage (1 = Premier)</label>
                  <input type="number" name="order" value={eliteFormData.order} onChange={handleEliteChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#F72585] transition-colors" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Classement (ex: N2 / N3)</label>
                  <input type="text" name="rank" value={eliteFormData.rank} onChange={handleEliteChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#F72585] transition-colors" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Catégorie (ex: Cadet, Sénior)</label>
                  <input type="text" name="category" value={eliteFormData.category} onChange={handleEliteChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#F72585] transition-colors" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Meilleur Palmarès</label>
                  <input type="text" name="titles" value={eliteFormData.titles} onChange={handleEliteChange} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#F72585] transition-colors" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Couleur d'accent</label>
                  <div className="flex gap-2">
                    <input type="color" name="accentColor" value={eliteFormData.accentColor} onChange={handleEliteChange} className="h-12 w-12 rounded-xl border-0 bg-transparent p-0 cursor-pointer" />
                    <input type="text" name="accentColor" value={eliteFormData.accentColor} onChange={handleEliteChange} className="flex-1 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#F72585] transition-colors" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Badge spécial (Optionnel)</label>
                  <input type="text" name="badge" value={eliteFormData.badge} onChange={handleEliteChange} placeholder="Ex: Capitaine, Championne..." className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#F72585] transition-colors" />
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex justify-end gap-4">
                <button type="button" onClick={closeEliteModal} className="px-6 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">Annuler</button>
                <button type="submit" disabled={isSavingElite || isUploadingElite} className="bg-[#F72585] text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-[#d91c70] transition-colors shadow-lg disabled:opacity-50">
                  {(isSavingElite || isUploadingElite) ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                  {editingEliteId ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}