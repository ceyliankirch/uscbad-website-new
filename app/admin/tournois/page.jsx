'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Trophy, Loader2, Link as LinkIcon, Heart, Calendar, Image as ImageIcon, Medal, LayoutTemplate } from 'lucide-react';

export default function AdminTournoisPage() {
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Gestion du Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalTab, setModalTab] = useState('general'); // 'general', 'content', 'media'

  // État du formulaire complet
  const defaultForm = {
    heroImage: '', title: '', subtitle: '', type: 'tournoi', dateStr: '', location: 'Gymnase Casalis',
    levels: '', registrationLink: '', status: 'a_venir', spotsLeft: '', color: '#0065FF',
    description: '', gymImage: '', 
    disciplines: 'Simples, Doubles, Mixtes',
    buvetteDescription: "Les joueurs et supporters pourront profiter de notre espace buvette tout au long de l'événement. Croque-monsieurs, crêpes, boissons et snacks pour recharger les batteries !",
    amenities: 'Parking gratuit sur place, Vestiaires & Douches, Tribunes',  
    googleMapsLink: '',  
    sponsor: { name: '', logoUrl: '', website: '' },
    googlePhotosLink: '', galleryImages: ['', '', '', ''], // 4 images par défaut
    palmares: []

  };
  const [formData, setFormData] = useState(defaultForm);

  const fetchTournaments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tournaments');
      const data = await res.json();
      if (data.success) setTournaments(data.data);
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchTournaments(); }, []);

  // --- GESTION DES CHANGEMENTS DU FORMULAIRE ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSponsorChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, sponsor: { ...prev.sponsor, [name]: value } }));
  };

  const handleGalleryChange = (index, value) => {
    const newGallery = [...formData.galleryImages];
    newGallery[index] = value;
    setFormData(prev => ({ ...prev, galleryImages: newGallery }));
  };

  const addPalmaresRow = () => {
    setFormData(prev => ({
      ...prev, palmares: [...prev.palmares, { serie: '', sh: '', sd: '', dh: '', dd: '', dx: '' }]
    }));
  };

  const updatePalmaresRow = (index, field, value) => {
    const newPalmares = [...formData.palmares];
    newPalmares[index][field] = value;
    setFormData(prev => ({ ...prev, palmares: newPalmares }));
  };

  const removePalmaresRow = (index) => {
    setFormData(prev => ({
      ...prev, palmares: prev.palmares.filter((_, i) => i !== index)
    }));
  };

  // --- OUVERTURE / FERMETURE MODAL ---
  const openModal = (tourney = null) => {
    setModalTab('general');
    if (tourney) {
      setEditingId(tourney._id);
      setFormData({
        ...defaultForm, ...tourney,
        sponsor: tourney.sponsor || defaultForm.sponsor,
        galleryImages: tourney.galleryImages?.length > 0 ? tourney.galleryImages : ['', '', '', ''],
        palmares: tourney.palmares || []
      });
    } else {
      setEditingId(null);
      setFormData(defaultForm);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingId(null); };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // Pour le grand visuel, on peut autoriser jusqu'à 2 Mo
    const limit = field === 'mainVisual' ? 2 * 1024 * 1024 : 1024 * 1024;
    if (file.size > limit) {
      alert(`L'image est trop lourde. Max ${field === 'mainVisual' ? '2 Mo' : '1 Mo'}.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, [field]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  

  // --- SAUVEGARDE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Nettoyage des données avant envoi
    const payload = {
      ...formData,
      spotsLeft: formData.spotsLeft ? parseInt(formData.spotsLeft) : null,
      galleryImages: formData.galleryImages.filter(img => img.trim() !== '') // On enlève les cases vides
    };

    try {
      const url = editingId ? `/api/tournaments/${editingId}` : '/api/tournaments';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { fetchTournaments(); closeModal(); } else { alert("Erreur: " + data.error); }
    } catch (error) { console.error(error); } finally { setIsSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet événement définitivement ?")) return;
    try {
      const res = await fetch(`/api/tournaments/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setTournaments(tournaments.filter(t => t._id !== id));
    } catch (error) { console.error(error); }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 leading-tight pt-2">
            Tournois & <span className="text-[#F72585]">Promobad</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Gérez vos événements de A à Z (Infos, Galerie, Palmarès).</p>
        </div>
        <button onClick={() => openModal()} className="bg-[#F72585] hover:bg-[#d0186b] text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all shadow-md">
          <Plus size={16} /> Nouvel Événement
        </button>
      </div>

      {/* LISTE */}
      {isLoading ? (
        <div className="flex justify-center py-20 text-[#F72585]"><Loader2 size={48} className="animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map(tourney => (
            <div key={tourney._id} className="bg-white dark:bg-[#0f172a] rounded-[1.5rem] border border-slate-200 dark:border-white/5 p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: tourney.color }}></div>
              <div className="flex justify-between items-start mt-2 mb-4">
                <div className="flex items-center gap-2">
                  {tourney.type === 'promobad' ? <Heart size={16} className="text-[#F72585]" /> : <Trophy size={16} className="text-[#0065FF]" />}
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{tourney.type}</span>
                </div>
              </div>
              <h3 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white leading-tight mb-1">{tourney.title}</h3>
              <p className="text-sm font-bold mb-4" style={{ color: tourney.color }}>{tourney.subtitle}</p>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-white/10">
                <button onClick={() => openModal(tourney)} className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-[#F72585] hover:text-white text-slate-500"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(tourney._id)} className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-red-500 hover:text-white text-slate-500"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUPER MODAL (Avec Onglets) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#081031] rounded-[2rem] w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
            
            {/* Header Modal */}
            <div className="bg-white dark:bg-[#081031] p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center z-10 shrink-0">
              <h2 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white pt-2">
                {editingId ? "Éditer le tournoi" : "Nouveau tournoi"}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full"><X size={24} className="text-slate-500" /></button>
            </div>

            {/* Navigation des Onglets */}
            <div className="flex border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 shrink-0 px-4">
              <button onClick={() => setModalTab('general')} className={`px-6 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-colors ${modalTab === 'general' ? 'border-[#F72585] text-[#F72585]' : 'border-transparent text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>
                <Calendar size={16}/> Infos Générales
              </button>
              <button onClick={() => setModalTab('content')} className={`px-6 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-colors ${modalTab === 'content' ? 'border-[#F72585] text-[#F72585]' : 'border-transparent text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>
                <LayoutTemplate size={16}/> Contenu & Sponsor
              </button>
              <button onClick={() => setModalTab('media')} className={`px-6 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-colors ${modalTab === 'media' ? 'border-[#F72585] text-[#F72585]' : 'border-transparent text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>
                <Medal size={16}/> Galerie & Palmarès
              </button>
            </div>

            {/* Contenu Scrollable du Formulaire */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* ONGLET 1 : GÉNÉRAL (Ancien formulaire) */}
              {modalTab === 'general' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* 👇 NOUVEAU : UPLOAD DE L'IMAGE DE FOND (HERO) 👇 */}
                  <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
                    <h3 className="font-[900] uppercase italic text-slate-800 dark:text-white flex items-center gap-2">
                      <ImageIcon size={18}/> Image de couverture (Fond Hero)
                    </h3>
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 shadow-sm">
                      {formData.heroImage ? (
                        <div className="relative w-32 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-white/10">
                          <img src={formData.heroImage} alt="Cover Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-32 h-16 rounded-lg bg-slate-200 dark:bg-black/50 flex items-center justify-center shrink-0 text-slate-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col gap-2">
                        <input 
                          type="file" accept="image/*" 
                          onChange={(e) => handleImageUpload(e, 'heroImage')} 
                          className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-[#F72585] file:text-white hover:file:bg-[#d0186b] cursor-pointer"
                        />
                        {formData.heroImage && (
                          <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({ ...prev, heroImage: '' }))} 
                            className="text-red-500 text-[10px] font-black uppercase tracking-widest text-left hover:underline"
                          >
                            Supprimer l'image
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* 👆 FIN HERO IMAGE 👆 */}

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Titre *</label>
                      <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Sous-titre / Édition</label>
                      <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Type d'événement</label>
                      <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white">
                        <option value="tournoi">Tournoi Officiel</option>
                        <option value="promobad">Promobad / Interne</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Statut Inscriptions</label>
                      <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white">
                        <option value="a_venir">À venir</option><option value="ouvert">Ouvertes</option><option value="complet">Complet</option><option value="termine">Terminé (Afficher Palmarès)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Dates *</label>
                      <input type="text" name="dateStr" value={formData.dateStr} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Lieu *</label>
                      <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white" />
                    </div>

                    {/* 👇 NOUVEAU CHAMP 👇 */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Lien Google Maps (Itinéraire)</label>
                      <input type="url" name="googleMapsLink" value={formData.googleMapsLink} onChange={handleChange} placeholder="https://maps.app.goo.gl/..." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white" />
                    </div>
                    {/* 👆 FIN DU NOUVEAU CHAMP 👆 */}


                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Niveaux / Séries *</label>
                      <input type="text" name="levels" value={formData.levels} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Couleur du thème</label>
                      <div className="flex gap-3">
                        <input type="color" name="color" value={formData.color} onChange={handleChange} className="h-12 w-12 rounded-xl cursor-pointer border-0 bg-transparent p-0" />
                        <input type="text" name="color" value={formData.color} onChange={handleChange} className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Couleur du thème</label>
                      <div className="flex gap-3">
                        <input type="color" name="color" value={formData.color} onChange={handleChange} className="h-12 w-12 rounded-xl cursor-pointer border-0 bg-transparent p-0" />
                        <input type="text" name="color" value={formData.color} onChange={handleChange} className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white" />
                      </div>
                    </div>

                    {/* 👇 NOUVEAU BOUTON UPLOAD DU LOGO 👇 */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Logo du Tournoi (Upload fichier)</label>
                      <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3">
                        {formData.tournamentLogo ? (
                          <div className="relative w-16 h-16 rounded-lg bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0">
                            <img src={formData.tournamentLogo} alt="Logo" className="max-w-full max-h-full object-contain p-1" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-black/50 flex items-center justify-center shrink-0 text-slate-400">
                            <ImageIcon size={24} />
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleImageUpload(e, 'tournamentLogo')} 
                          className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#F72585] file:text-white hover:file:bg-[#d0186b] cursor-pointer"
                        />
                      </div>
                    </div>
                    {/* 👆 FIN DU BOUTON UPLOAD 👆 */}

                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Lien BadNet</label>
                    <input type="url" name="registrationLink" value={formData.registrationLink} onChange={handleChange} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white" />
                  </div>

                  {/* 👇 NOUVEAU : UPLOAD DU VISUEL 1080x1350 DANS L'ONGLET 1 👇 */}
                  <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
                    <h3 className="font-[900] uppercase italic text-slate-800 dark:text-white flex items-center gap-2">
                      <ImageIcon size={18}/> Visuel Officiel (Affiche)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-white/20 shadow-sm">
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-500">Format recommandé : 1080 x 1350 px (Portrait 4:5)</p>
                        <input 
                          type="file" accept="image/*" 
                          onChange={(e) => handleImageUpload(e, 'mainVisual')} 
                          className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-[#F72585] file:text-white hover:file:bg-[#d0186b] cursor-pointer"
                        />
                        {formData.mainVisual && (
                          <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({ ...prev, mainVisual: '' }))}
                            className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:underline"
                          >
                            Supprimer l'image
                          </button>
                        )}
                      </div>
                      
                      {/* Aperçu du visuel */}
                      <div className="flex justify-center">
                        {formData.mainVisual ? (
                          <div className="relative w-32 aspect-[1080/1350] rounded-lg shadow-xl overflow-hidden border-2 border-white">
                            <img src={formData.mainVisual} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-32 aspect-[1080/1350] bg-slate-200 dark:bg-white/10 rounded-lg flex flex-col items-center justify-center text-slate-400 gap-2">
                            <ImageIcon size={24} />
                            <span className="text-[8px] font-black uppercase text-center px-2">Aucun visuel</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* 👆 FIN DU VISUEL 👆 */}

                </div>
              )}

              {/* ONGLET 2 : CONTENU & SPONSOR */}
              {modalTab === 'content' && (
                <div className="space-y-8 animate-in fade-in">
                  
                  {/* Textes Libres & Infos Pratiques */}
                  <div className="space-y-4">
                    <h3 className="font-[900] uppercase italic text-slate-800 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">Textes & Infos Pratiques</h3>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Le Mot du Club (Description générale)</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white resize-none"></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Tableaux joués (Séparés par des virgules)</label>
                        <input type="text" name="disciplines" value={formData.disciplines} onChange={handleChange} placeholder="Ex: Simples, Doubles, Mixtes" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Équipements (Séparés par des virgules)</label>
                        <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="Ex: Parking, Douches, Tribunes" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Texte de la Buvette</label>
                      <textarea name="buvetteDescription" value={formData.buvetteDescription} onChange={handleChange} rows="2" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white resize-none"></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">URL Image du Gymnase</label>
                      <input type="url" name="gymImage" value={formData.gymImage} onChange={handleChange} placeholder="https://images.unsplash..." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white" />
                    </div>
                  </div>

                  {/* Sponsor */}
                  <div className="space-y-4">
                    <h3 className="font-[900] uppercase italic text-slate-800 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">Sponsor de l'Événement</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Nom du Sponsor</label>
                        <input type="text" name="name" value={formData.sponsor.name} onChange={handleSponsorChange} placeholder="Ex: Lardesports" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Lien Site Web Sponsor</label>
                        <input type="url" name="website" value={formData.sponsor.website} onChange={handleSponsorChange} placeholder="https://..." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">URL Logo du Sponsor</label>
                        <input type="url" name="logoUrl" value={formData.sponsor.logoUrl} onChange={handleSponsorChange} placeholder="https://..." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white" />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ONGLET 3 : MÉDIAS & PALMARÈS */}
              {modalTab === 'media' && (
                <div className="space-y-8 animate-in fade-in">
                  
                  {/* Galerie Images */}
                  <div className="space-y-4">
                    <h3 className="font-[900] uppercase italic text-slate-800 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2 flex items-center gap-2"><ImageIcon size={18}/> Galerie Photos</h3>
                    <div className="space-y-2 mb-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Lien Album Google Photos Complet</label>
                      <input type="url" name="googlePhotosLink" value={formData.googlePhotosLink} onChange={handleChange} placeholder="https://photos.app.goo.gl/..." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white" />
                    </div>
                    
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 block">Les 4 images Best-Of (Affichées sur le site)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.galleryImages.map((imgUrl, idx) => (
                        <input key={`img-${idx}`} type="url" value={imgUrl} onChange={(e) => handleGalleryChange(idx, e.target.value)} placeholder={`URL Image ${idx + 1}`} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white" />
                      ))}
                    </div>
                  </div>

                  {/* Palmarès */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-2">
                      <h3 className="font-[900] uppercase italic text-slate-800 dark:text-white flex items-center gap-2"><Medal size={18}/> Palmarès (Vainqueurs)</h3>
                      <button type="button" onClick={addPalmaresRow} className="text-[#F72585] text-xs font-bold uppercase hover:underline flex items-center gap-1"><Plus size={14}/> Ajouter une série</button>
                    </div>
                    
                    {formData.palmares.length === 0 ? (
                      <p className="text-sm text-slate-500 italic">Aucun résultat pour l'instant. Ajoutez une série pour commencer.</p>
                    ) : (
                      <div className="space-y-6">
                        {formData.palmares.map((row, idx) => (
                          <div key={`palmares-${idx}`} className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 relative">
                            <button type="button" onClick={() => removePalmaresRow(idx)} className="absolute top-2 right-2 text-red-500 hover:bg-red-100 p-1 rounded-md"><Trash2 size={14}/></button>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              <div className="space-y-1 sm:col-span-2 md:col-span-3 mb-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#F72585] ml-2">Nom de la Série (Ex: Série 1, R4-R5...)</label>
                                <input type="text" value={row.serie} onChange={(e) => updatePalmaresRow(idx, 'serie', e.target.value)} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-bold focus:border-[#F72585] outline-none dark:text-white" />
                              </div>
                              <input type="text" placeholder="SH Vainqueur" value={row.sh} onChange={(e) => updatePalmaresRow(idx, 'sh', e.target.value)} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none dark:text-white" />
                              <input type="text" placeholder="SD Vainqueur" value={row.sd} onChange={(e) => updatePalmaresRow(idx, 'sd', e.target.value)} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none dark:text-white" />
                              <input type="text" placeholder="DH Vainqueur" value={row.dh} onChange={(e) => updatePalmaresRow(idx, 'dh', e.target.value)} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none dark:text-white" />
                              <input type="text" placeholder="DD Vainqueur" value={row.dd} onChange={(e) => updatePalmaresRow(idx, 'dd', e.target.value)} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none dark:text-white" />
                              <input type="text" placeholder="Mixte Vainqueur" value={row.dx} onChange={(e) => updatePalmaresRow(idx, 'dx', e.target.value)} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none dark:text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* Footer Modal / Bouton Enregistrer */}
            <div className="bg-slate-50 dark:bg-white/5 p-6 border-t border-slate-200 dark:border-white/10 flex justify-end gap-4 shrink-0">
              <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5">Annuler</button>
              <button onClick={handleSubmit} disabled={isSaving} className="bg-[#F72585] hover:bg-[#d0186b] text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2">
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                {editingId ? 'Enregistrer les modifications' : 'Créer l\'événement'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}