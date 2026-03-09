'use client';
import React, { useState, useEffect } from 'react';
import { 
  Scissors, Package, CheckCircle, Clock, AlertTriangle, 
  Plus, Edit, Trash2, Search, ArrowRight, Loader2, X,
  Save, User, Settings2, Banknote, ListTodo, History, ChevronDown, PiggyBank, TrendingUp, TrendingDown
} from 'lucide-react';

export default function CordageDashboard() {
  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban', 'stock', 'budget', 'history'
  const [isLoading, setIsLoading] = useState(true);

  // --- ÉTATS ---
  const [stock, setStock] = useState([]);
  const [jobs, setJobs] = useState([]);

  // Liste pour le custom select
  const yonexStrings = [
    "Yonex BG80", "Yonex BG80 Power", "Yonex BG65", "Yonex BG65 Titanium",
    "Yonex Exbolt 63", "Yonex Exbolt 65", "Yonex Exbolt 68", "Yonex Aerobite",
    "Yonex Aerobite Boost", "Yonex Nanogy 98", "Yonex Nanogy 99", "Yonex Skyarc",
    "Pose Cordage Seul"
  ];

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isStringDropdownOpen, setIsStringDropdownOpen] = useState(false);
  
  const emptyJob = { player: '', racquet: '', stringId: '', tensionMains: 11, tensionCrosses: 11, knots: 4, notes: '', paymentStatus: 'unpaid', status: 'waiting' };
  const [jobForm, setJobForm] = useState(emptyJob);
  const [editingJobId, setEditingJobId] = useState(null);

  const emptyStock = { name: '', color: '', gauge: '', totalCapacity: 20, remaining: 20, price: 15, cost: 100 };
  const [stockForm, setStockForm] = useState(emptyStock);
  const [editingStockId, setEditingStockId] = useState(null);

  // --- CHARGEMENT DES DONNÉES ---
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [stockRes, jobsRes] = await Promise.all([
        fetch('/api/string-stock'),
        fetch('/api/stringing-jobs')
      ]);
      const sData = await stockRes.json();
      const jData = await jobsRes.json();

      if (sData.success) setStock(sData.data);
      if (jData.success) setJobs(jData.data);
    } catch (error) {
      console.error("Erreur de chargement", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- CALCULS STATISTIQUES ---
  const jobsToProcess = jobs.filter(j => j.status === 'waiting' || j.status === 'stringing').length;
  const jobsReady = jobs.filter(j => j.status === 'ready').length;
  const lowStockAlerts = stock.filter(s => s.remaining <= 3 && s.totalCapacity !== 999).length;
  
  const revenueToCollect = jobs.filter(j => j.paymentStatus === 'unpaid' && j.status !== 'delivered').reduce((acc, job) => {
    const stringData = stock.find(s => s._id === job.stringId);
    return acc + (stringData ? stringData.price : 0);
  }, 0);

  const totalExpenses = stock.reduce((acc, s) => acc + (s.cost || 0), 0);
  const totalRevenuePaid = jobs.filter(j => j.paymentStatus === 'paid').reduce((acc, job) => {
    const stringData = stock.find(s => s._id === job.stringId);
    return acc + (stringData ? stringData.price : 0);
  }, 0);
  const profit = totalRevenuePaid - totalExpenses;

  // --- GESTION DES JOBS (FILE D'ATTENTE) ---
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    if (!jobForm.player || !jobForm.stringId) return alert("Le joueur et le cordage sont obligatoires.");
    
    try {
      const isEditing = !!editingJobId;
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/stringing-jobs/${editingJobId}` : '/api/stringing-jobs';

      const payload = { ...jobForm };
      if (!isEditing) payload.date = new Date().toISOString().split('T')[0];

      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });

      if (res.ok) {
        // Si c'est une nouvelle raquette, on décrémente la bobine de stock
        if (!isEditing) {
          const selectedString = stock.find(s => s._id === jobForm.stringId);
          if (selectedString && selectedString.totalCapacity !== 999 && selectedString.remaining > 0) {
            await fetch(`/api/string-stock/${selectedString._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ remaining: selectedString.remaining - 1 })
            });
          }
        }
        fetchDashboardData();
        closeJobModal();
      }
    } catch (err) {
      alert("Erreur de sauvegarde de la raquette.");
    }
  };

  const updateJobStatus = async (id, newStatus) => {
    try {
      await fetch(`/api/stringing-jobs/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus })
      });
      fetchDashboardData();
    } catch(err) { console.error(err); }
  };

  const togglePaymentStatus = async (id) => {
    const job = jobs.find(j => j._id === id);
    if(!job) return;
    try {
      await fetch(`/api/stringing-jobs/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentStatus: job.paymentStatus === 'paid' ? 'unpaid' : 'paid' })
      });
      fetchDashboardData();
    } catch(err) { console.error(err); }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Supprimer cette demande ?")) return;
    try {
      await fetch(`/api/stringing-jobs/${id}`, { method: 'DELETE' });
      fetchDashboardData();
    } catch(err) { console.error(err); }
  };

  const openJobModal = (job = null) => {
    if (job) {
      setEditingJobId(job._id);
      setJobForm(job);
    } else {
      setEditingJobId(null);
      setJobForm(emptyJob);
    }
    setIsJobModalOpen(true);
  };

  const closeJobModal = () => {
    setIsJobModalOpen(false);
    setEditingJobId(null);
  };

  // --- GESTION DU STOCK ---
  const handleStockSubmit = async (e) => {
    e.preventDefault();
    try {
      const isEditing = !!editingStockId;
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/string-stock/${editingStockId}` : '/api/string-stock';

      await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(stockForm)
      });
      fetchDashboardData();
      closeStockModal();
    } catch (err) {
      alert("Erreur de sauvegarde de la bobine.");
    }
  };

  const deleteStock = async (id) => {
    if (!window.confirm("Supprimer cette bobine ?")) return;
    try {
      await fetch(`/api/string-stock/${id}`, { method: 'DELETE' });
      fetchDashboardData();
    } catch(err) { console.error(err); }
  };

  const openStockModal = (item = null) => {
    setIsStringDropdownOpen(false);
    if (item) {
      setEditingStockId(item._id);
      setStockForm(item);
    } else {
      setEditingStockId(null);
      setStockForm(emptyStock);
    }
    setIsStockModalOpen(true);
  };

  const closeStockModal = () => {
    setIsStockModalOpen(false);
    setEditingStockId(null);
    setIsStringDropdownOpen(false);
  };

  const getStringName = (id) => {
    const s = stock.find(s => s._id === id);
    return s ? s.name : 'Inconnu';
  };

  const getStringPrice = (id) => {
    const s = stock.find(s => s._id === id);
    return s ? s.price : 0;
  };

  // --- COULEURS THÈME VERT (CORDEUR) ---
  const themeAccent = '#10B981'; // Emerald 500
  const themeBg = 'bg-[#10B981]';
  const themeText = 'text-[#10B981]';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Montserrat'] pb-24">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-slate-200 dark:border-white/10 pb-6 flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 pt-2">
            Atelier <span className={themeText}>Recordage</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">
            Gestion de la file d'attente et du stock de bobines
          </p>
        </div>
        
        {/* TABS NAVIGATION */}
        <div className="flex bg-slate-100 dark:bg-[#0f172a] p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm w-fit overflow-x-auto max-w-full hide-scrollbar">
          <button 
            onClick={() => setActiveTab('kanban')}
            className={`px-4 lg:px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shrink-0 ${activeTab === 'kanban' ? 'bg-white dark:bg-[#1A1D24] text-[#081031] dark:text-white shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
          >
            <ListTodo size={14} /> File d'attente
          </button>
          <button 
            onClick={() => setActiveTab('stock')}
            className={`px-4 lg:px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shrink-0 ${activeTab === 'stock' ? 'bg-white dark:bg-[#1A1D24] text-[#081031] dark:text-white shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
          >
            <Package size={14} /> Stock Bobines
          </button>
          <button 
            onClick={() => setActiveTab('budget')}
            className={`px-4 lg:px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shrink-0 ${activeTab === 'budget' ? 'bg-white dark:bg-[#1A1D24] text-[#081031] dark:text-white shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
          >
            <PiggyBank size={14} /> Budget
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 lg:px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shrink-0 ${activeTab === 'history' ? 'bg-white dark:bg-[#1A1D24] text-[#081031] dark:text-white shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
          >
            <History size={14} /> Archives
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-32"><Loader2 className={`animate-spin ${themeText}`} size={48} /></div>
      ) : (
        <div className="space-y-8">
          
          {/* STATS RAPIDES (Toujours visibles sauf dans l'onglet budget) */}
          {activeTab !== 'budget' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <StatCard icon={<Scissors />} title="À Corder" value={jobsToProcess} color="text-emerald-500" />
              <StatCard icon={<CheckCircle />} title="Prêtes (Retrait)" value={jobsReady} color="text-blue-500" />
              <StatCard icon={<AlertTriangle />} title="Alertes Stock" value={lowStockAlerts} color={lowStockAlerts > 0 ? "text-red-500" : "text-slate-400"} alert={lowStockAlerts > 0} />
              <StatCard icon={<Banknote />} title="À Encaisser" value={`${revenueToCollect}€`} color="text-orange-500" />
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 1 : FILE D'ATTENTE (KANBAN)                             */}
          {/* ========================================================= */}
          {activeTab === 'kanban' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="relative w-full max-w-sm hidden md:block">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Rechercher un joueur..." className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-[#10B981]" />
                </div>
                <button onClick={() => openJobModal()} className={`${themeBg} hover:bg-[#059669] text-white px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg shadow-[#10B981]/20 transition-all md:ml-auto w-full md:w-auto justify-center`}>
                  <Plus size={16} /> Ajouter une Raquette
                </button>
              </div>

              {/* COLONNES KANBAN */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
                
                <KanbanColumn title="En Attente" count={jobs.filter(j => j.status === 'waiting').length} color="border-orange-500" headerBg="bg-orange-500/10 text-orange-600 dark:text-orange-400">
                  {jobs.filter(j => j.status === 'waiting').map(job => (
                    <JobCard key={job._id} job={job} onEdit={() => openJobModal(job)} onNext={() => updateJobStatus(job._id, 'stringing')} onPayment={() => togglePaymentStatus(job._id)} getStringName={getStringName} getStringPrice={getStringPrice} onDelete={() => deleteJob(job._id)} />
                  ))}
                </KanbanColumn>

                <KanbanColumn title="Sur la machine" count={jobs.filter(j => j.status === 'stringing').length} color="border-[#10B981]" headerBg="bg-[#10B981]/10 text-[#10B981]">
                  {jobs.filter(j => j.status === 'stringing').map(job => (
                    <JobCard key={job._id} job={job} onEdit={() => openJobModal(job)} onPrev={() => updateJobStatus(job._id, 'waiting')} onNext={() => updateJobStatus(job._id, 'ready')} onPayment={() => togglePaymentStatus(job._id)} getStringName={getStringName} getStringPrice={getStringPrice} />
                  ))}
                </KanbanColumn>

                <KanbanColumn title="Prêt (Au gymnase)" count={jobs.filter(j => j.status === 'ready').length} color="border-blue-500" headerBg="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {jobs.filter(j => j.status === 'ready').map(job => (
                    <JobCard key={job._id} job={job} onEdit={() => openJobModal(job)} onPrev={() => updateJobStatus(job._id, 'stringing')} onNext={() => updateJobStatus(job._id, 'delivered')} onPayment={() => togglePaymentStatus(job._id)} getStringName={getStringName} getStringPrice={getStringPrice} />
                  ))}
                </KanbanColumn>

                <KanbanColumn title="Livré & Terminé" count={jobs.filter(j => j.status === 'delivered').length} color="border-slate-500" headerBg="bg-slate-500/10 text-slate-600 dark:text-slate-400">
                  {jobs.filter(j => j.status === 'delivered').slice(0, 5).map(job => (
                    <JobCard key={job._id} job={job} onPrev={() => updateJobStatus(job._id, 'ready')} onPayment={() => togglePaymentStatus(job._id)} getStringName={getStringName} getStringPrice={getStringPrice} isArchived />
                  ))}
                  {jobs.filter(j => j.status === 'delivered').length > 5 && (
                    <div className="text-center text-xs font-bold text-slate-400 italic pt-2">Voir les archives pour le reste.</div>
                  )}
                </KanbanColumn>

              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2 : STOCK DES BOBINES                                   */}
          {/* ========================================================= */}
          {activeTab === 'stock' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center bg-white dark:bg-[#0f172a] p-6 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm">
                <div>
                  <h2 className="text-2xl font-[900] uppercase italic text-[#081031] dark:text-white mb-1">Inventaire des <span className={themeText}>Bobines</span></h2>
                  <p className="text-xs font-bold text-slate-500">Anticipez vos commandes pour ne jamais être à court.</p>
                </div>
                <button onClick={() => openStockModal()} className={`${themeBg} hover:bg-[#059669] text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg shadow-[#10B981]/20 transition-all`}>
                  <Plus size={16} /> Nouvelle Bobine
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stock.filter(s => s.totalCapacity !== 999).map(item => {
                  const percentage = Math.round((item.remaining / item.totalCapacity) * 100);
                  const isLow = item.remaining <= 3;

                  return (
                    <div key={item._id} className={`bg-white dark:bg-[#0f172a] p-6 rounded-[2rem] border-2 shadow-sm relative overflow-hidden group ${isLow ? 'border-red-500/50 dark:border-red-500/30' : 'border-slate-200 dark:border-white/10 hover:border-[#10B981]'}`}>
                      
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openStockModal(item)} className="p-2 text-slate-400 hover:text-[#10B981] transition-colors"><Edit size={14}/></button>
                        <button onClick={() => deleteStock(item._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                      </div>

                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner ${isLow ? 'bg-red-100 text-red-500' : 'bg-slate-100 dark:bg-[#081031] text-[#10B981]'}`}>
                          <Package size={24} />
                        </div>
                        <div>
                          <h3 className="font-[900] uppercase italic text-xl text-[#081031] dark:text-white leading-none mb-1">{item.name}</h3>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.gauge} • {item.color}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className={isLow ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}>
                            {isLow ? '⚠️ Stock critique' : 'Capacité restante'}
                          </span>
                          <span className={isLow ? 'text-red-500 font-black' : 'text-[#081031] dark:text-white font-black'}>
                            {item.remaining} / {item.totalCapacity} raquettes
                          </span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${isLow ? 'bg-red-500' : 'bg-[#10B981]'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Acheté {item.cost}€</span>
                        <div className="text-right">
                          <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Tarif public</span>
                          <span className="text-xl font-[900] italic text-[#10B981]">{item.price}€</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {stock.filter(s => s.totalCapacity !== 999).length === 0 && (
                  <div className="col-span-full py-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Aucune bobine en stock.</div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3 : BUDGET (Finances)                                   */}
          {/* ========================================================= */}
          {activeTab === 'budget' && (
            <div className="space-y-8 animate-in fade-in">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2rem] border border-slate-100 dark:border-white/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><TrendingDown size={80} className="text-red-500" /></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Dépenses (Achats Bobines)</p>
                  <h3 className="text-4xl font-[900] text-red-500">-{totalExpenses}€</h3>
                </div>
                <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2rem] border border-slate-100 dark:border-white/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><TrendingUp size={80} className="text-blue-500" /></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Recettes (Poses Encaissées)</p>
                  <h3 className="text-4xl font-[900] text-blue-500">+{totalRevenuePaid}€</h3>
                </div>
                <div className={`p-6 rounded-[2rem] shadow-xl relative overflow-hidden group text-white ${profit >= 0 ? 'bg-gradient-to-br from-[#10B981] to-[#059669]' : 'bg-gradient-to-br from-red-500 to-red-700'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform"><PiggyBank size={80} /></div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-white/80">Bénéfice Net</p>
                  <h3 className="text-4xl font-[900]">{profit >= 0 ? '+' : ''}{profit}€</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/10 shadow-sm">
                  <h3 className="text-xl font-[900] italic uppercase text-[#081031] dark:text-white mb-6">Derniers <span className="text-blue-500">Encaissements</span></h3>
                  <div className="space-y-4">
                    {jobs.filter(j => j.paymentStatus === 'paid').length === 0 && (
                      <p className="text-sm font-bold text-slate-400 italic text-center py-6">Aucun encaissement validé.</p>
                    )}
                    {jobs.filter(j => j.paymentStatus === 'paid').slice().reverse().map(job => {
                      const price = getStringPrice(job.stringId);
                      return (
                        <div key={job._id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                          <div>
                            <p className="font-bold text-sm text-[#081031] dark:text-white">{job.player}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{getStringName(job.stringId)} • {new Date(job.date).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div className="font-black text-lg text-blue-500">+{price}€</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/10 shadow-sm">
                  <h3 className="text-xl font-[900] italic uppercase text-[#081031] dark:text-white mb-6">Historique <span className="text-red-500">Achats Matériel</span></h3>
                  <div className="space-y-4">
                    {stock.filter(s => s.cost > 0).length === 0 && (
                      <p className="text-sm font-bold text-slate-400 italic text-center py-6">Aucun achat enregistré.</p>
                    )}
                    {stock.filter(s => s.cost > 0).map(item => (
                      <div key={item._id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                        <div>
                          <p className="font-bold text-sm text-[#081031] dark:text-white">{item.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Bobine {item.totalCapacity} raquettes</p>
                        </div>
                        <div className="font-black text-lg text-red-500">-{item.cost}€</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4 : ARCHIVES (Historique)                               */}
          {/* ========================================================= */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                   <h3 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white">Historique des poses</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Joueur</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Setup (Cordage & Tension)</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Paiement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {jobs.filter(j => j.status === 'delivered').length === 0 && (
                        <tr><td colSpan="4" className="text-center py-8 text-slate-400 font-bold text-sm italic">Aucun historique disponible.</td></tr>
                      )}
                      {jobs.filter(j => j.status === 'delivered').map(job => (
                        <tr key={job._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-xs font-bold text-slate-500">{new Date(job.date).toLocaleDateString('fr-FR')}</td>
                          <td className="px-6 py-4">
                            <div className="font-[900] uppercase text-sm text-[#081031] dark:text-white">{job.player}</div>
                            <div className="text-[10px] font-bold text-slate-400">{job.racquet}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs font-bold text-[#10B981] mb-0.5">{getStringName(job.stringId)}</div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">M: {job.tensionMains}kg | T: {job.tensionCrosses}kg ({job.knots} nœuds)</div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => togglePaymentStatus(job._id)}
                              className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-colors ${job.paymentStatus === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 hover:bg-orange-200'}`}
                            >
                              {job.paymentStatus === 'paid' ? 'Réglé' : 'À Encaisser'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* MODALE : AJOUTER / MODIFIER UNE RAQUETTE                    */}
      {/* ========================================================= */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#081031]/80 backdrop-blur-md animate-in fade-in" onClick={closeJobModal}></div>
          <div className="relative bg-white dark:bg-[#0f172a] w-full max-w-2xl max-h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95">
            
            <div className={`p-6 lg:p-8 border-b border-slate-100 dark:border-white/10 flex justify-between items-center ${themeBg} text-white shrink-0`}>
              <h3 className="text-2xl font-[900] italic uppercase flex items-center gap-3">
                <Settings2 size={24} /> {editingJobId ? 'Modifier la raquette' : 'Nouvelle Raquette'}
              </h3>
              <button onClick={closeJobModal} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 lg:p-8 overflow-y-auto flex-1 space-y-8 bg-slate-50 dark:bg-[#081031]">
              
              <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
                <h4 className={`font-black uppercase text-sm mb-4 flex items-center gap-2 ${themeText}`}><User size={16}/> Infos Joueur</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Nom du Joueur *</label>
                    <input type="text" required value={jobForm.player} onChange={e => setJobForm({...jobForm, player: e.target.value})} className={`w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[${themeAccent}] transition-all text-[#081031] dark:text-white`} placeholder="Ex: Léo Dubois" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Modèle Raquette</label>
                    <input type="text" value={jobForm.racquet} onChange={e => setJobForm({...jobForm, racquet: e.target.value})} className={`w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[${themeAccent}] transition-all text-[#081031] dark:text-white`} placeholder="Ex: Astrox 99 Pro" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
                <h4 className={`font-black uppercase text-sm mb-4 flex items-center gap-2 ${themeText}`}><Scissors size={16}/> Spécifications Techniques</h4>
                
                <div className="space-y-2 mb-4">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Cordage à poser *</label>
                  <select required value={jobForm.stringId} onChange={e => setJobForm({...jobForm, stringId: e.target.value})} className={`w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[${themeAccent}] transition-all text-[#081031] dark:text-white appearance-none`}>
                    <option value="" disabled>Sélectionner un cordage en stock</option>
                    {stock.map(s => (
                      <option key={s._id} value={s._id} disabled={s.remaining <= 0 && s.totalCapacity !== 999}>
                        {s.name} ({s.price}€) {s.remaining <= 0 && s.totalCapacity !== 999 ? '- RUPTURE' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 text-center block">Tension Montants</label>
                    <div className="flex items-center bg-slate-50 dark:bg-[#081031] rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                      <button type="button" onClick={() => setJobForm({...jobForm, tensionMains: Math.max(8, jobForm.tensionMains - 0.5)})} className="w-10 h-10 flex items-center justify-center font-black text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">-</button>
                      <input type="number" step="0.5" value={jobForm.tensionMains} onChange={e => setJobForm({...jobForm, tensionMains: parseFloat(e.target.value)})} className="flex-1 w-full bg-transparent text-center font-black text-lg outline-none text-[#081031] dark:text-white" />
                      <button type="button" onClick={() => setJobForm({...jobForm, tensionMains: Math.min(18, jobForm.tensionMains + 0.5)})} className="w-10 h-10 flex items-center justify-center font-black text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">+</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 text-center block">Tension Travers</label>
                    <div className="flex items-center bg-slate-50 dark:bg-[#081031] rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                      <button type="button" onClick={() => setJobForm({...jobForm, tensionCrosses: Math.max(8, jobForm.tensionCrosses - 0.5)})} className="w-10 h-10 flex items-center justify-center font-black text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">-</button>
                      <input type="number" step="0.5" value={jobForm.tensionCrosses} onChange={e => setJobForm({...jobForm, tensionCrosses: parseFloat(e.target.value)})} className="flex-1 w-full bg-transparent text-center font-black text-lg outline-none text-[#081031] dark:text-white" />
                      <button type="button" onClick={() => setJobForm({...jobForm, tensionCrosses: Math.min(18, jobForm.tensionCrosses + 0.5)})} className="w-10 h-10 flex items-center justify-center font-black text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">+</button>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1 space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 text-center block">Type de Nœuds</label>
                    <div className="flex bg-slate-50 dark:bg-[#081031] rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden p-1 gap-1">
                      <button type="button" onClick={() => setJobForm({...jobForm, knots: 2})} className={`flex-1 py-2 rounded-lg font-black text-sm transition-all ${jobForm.knots === 2 ? 'bg-white dark:bg-[#0f172a] shadow-sm text-[#081031] dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>2 Nœuds</button>
                      <button type="button" onClick={() => setJobForm({...jobForm, knots: 4})} className={`flex-1 py-2 rounded-lg font-black text-sm transition-all ${jobForm.knots === 4 ? 'bg-white dark:bg-[#0f172a] shadow-sm text-[#081031] dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>4 Nœuds</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Notes Particulières (Pré-étirement, Logo...)</label>
                  <textarea rows="2" value={jobForm.notes} onChange={e => setJobForm({...jobForm, notes: e.target.value})} className={`w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[${themeAccent}] transition-all resize-none text-[#081031] dark:text-white`}></textarea>
                </div>
              </div>

            </div>

            <div className="p-6 lg:p-8 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#0f172a] flex justify-end gap-4 shrink-0">
               <button type="button" onClick={closeJobModal} className="px-6 py-3 rounded-xl font-bold text-xs uppercase text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Annuler</button>
               <button onClick={handleJobSubmit} className={`${themeBg} hover:bg-[#059669] text-white px-10 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-lg shadow-[#10B981]/30 transition-transform hover:scale-105`}>
                 <Save size={16}/> Enregistrer
               </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALE : AJOUTER / MODIFIER UNE BOBINE (STOCK)              */}
      {/* ========================================================= */}
      {isStockModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#081031]/80 backdrop-blur-md animate-in fade-in" onClick={closeStockModal}></div>
          <div className="relative bg-white dark:bg-[#0f172a] w-full max-w-md rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95">
            
            <div className={`p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center ${themeBg} text-white`}>
              <h3 className="text-xl font-[900] italic uppercase flex items-center gap-3">
                <Package size={20} /> {editingStockId ? 'Modifier Bobine' : 'Nouvelle Bobine'}
              </h3>
              <button onClick={closeStockModal} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleStockSubmit} className="p-6 lg:p-8 space-y-5 bg-slate-50 dark:bg-[#081031]">
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Nom du Cordage *</label>
                <div className="relative">
                  <button 
                    type="button" 
                    onClick={() => setIsStringDropdownOpen(!isStringDropdownOpen)} 
                    className={`w-full bg-white dark:bg-[#0f172a] border ${isStringDropdownOpen ? `border-[${themeAccent}] ring-2 ring-[${themeAccent}]/20` : 'border-slate-200 dark:border-white/10'} rounded-xl px-4 py-3.5 text-sm font-bold flex justify-between items-center transition-all outline-none text-left`}
                  >
                    <span className="text-[#081031] dark:text-white">
                      {stockForm.name || "Sélectionnez un cordage Yonex"}
                    </span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isStringDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isStringDropdownOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="max-h-60 overflow-y-auto hide-scrollbar py-1">
                        {yonexStrings.map((stringName) => (
                          <div 
                            key={stringName} 
                            onClick={() => {
                              setStockForm({ ...stockForm, name: stringName });
                              setIsStringDropdownOpen(false);
                            }} 
                            className={`px-5 py-3 text-sm font-bold cursor-pointer transition-colors ${
                              stockForm.name === stringName 
                                ? `bg-[${themeAccent}]/10 text-[${themeAccent}]` 
                                : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {stringName}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Couleur</label>
                  <input type="text" value={stockForm.color} onChange={e => setStockForm({...stockForm, color: e.target.value})} className={`w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[${themeAccent}] transition-all text-[#081031] dark:text-white`} placeholder="Ex: Jaune" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Jauge</label>
                  <input type="text" value={stockForm.gauge} onChange={e => setStockForm({...stockForm, gauge: e.target.value})} className={`w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[${themeAccent}] transition-all text-[#081031] dark:text-white`} placeholder="Ex: 0.68mm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Nb Raquettes (Capacité)</label>
                  <input type="number" required value={stockForm.totalCapacity} onChange={e => setStockForm({...stockForm, totalCapacity: parseInt(e.target.value)})} className={`w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[${themeAccent}] transition-all text-[#081031] dark:text-white`} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Nb Raquettes (Restant)</label>
                  <input type="number" required value={stockForm.remaining} onChange={e => setStockForm({...stockForm, remaining: parseInt(e.target.value)})} className={`w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[${themeAccent}] transition-all text-[#081031] dark:text-white`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-red-500 tracking-widest ml-1">Coût d'achat (Club)</label>
                  <div className="relative">
                    <input type="number" required value={stockForm.cost} onChange={e => setStockForm({...stockForm, cost: parseFloat(e.target.value)})} className={`w-full bg-white dark:bg-[#0f172a] border border-red-500/30 rounded-xl pl-4 pr-8 py-3 text-sm font-black outline-none focus:ring-2 focus:ring-red-500 transition-all text-red-500`} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-black text-red-500">€</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 text-[#10B981]">Tarif (Pose incluse)</label>
                  <div className="relative">
                    <input type="number" required value={stockForm.price} onChange={e => setStockForm({...stockForm, price: parseFloat(e.target.value)})} className={`w-full bg-white dark:bg-[#0f172a] border border-[#10B981]/30 rounded-xl pl-4 pr-8 py-3 text-sm font-black outline-none focus:ring-2 focus:ring-[#10B981] transition-all text-[#10B981]`} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-black text-[#10B981]">€</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 mt-4 flex gap-3 border-t border-slate-200 dark:border-white/10">
                <button type="button" onClick={closeStockModal} className="flex-1 py-3 bg-slate-200 dark:bg-white/10 rounded-xl font-bold text-xs uppercase text-slate-600 dark:text-slate-300">Annuler</button>
                <button type="submit" className={`flex-1 py-3 ${themeBg} hover:bg-[#059669] text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg`}>
                  <Save size={16}/> Enregistrer
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

/* --- SOUS-COMPOSANTS --- */

const StatCard = ({ title, value, icon, color, alert }) => (
  <div className={`bg-white dark:bg-[#0f172a] p-5 rounded-[1.5rem] border ${alert ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-slate-200 dark:border-white/10'} shadow-sm flex flex-col items-center sm:items-start sm:flex-row gap-4 relative overflow-hidden group transition-all hover:-translate-y-1`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${color.replace('text-', 'bg-').replace('500', '100')} dark:${color.replace('text-', 'bg-').replace('500', '900/30')} ${color}`}>
      {icon}
    </div>
    <div className="text-center sm:text-left flex-1 min-w-0">
      <div className={`text-2xl sm:text-3xl font-[900] italic leading-none mb-1 truncate ${color}`}>{value}</div>
      <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 truncate">{title}</div>
    </div>
  </div>
);

const KanbanColumn = ({ title, count, color, headerBg, children }) => (
  <div className="flex flex-col h-full">
    <div className={`flex justify-between items-center px-4 py-3 rounded-2xl mb-4 border ${color} ${headerBg} font-black uppercase tracking-widest text-xs shadow-sm`}>
      <span>{title}</span>
      <span className="bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-lg">{count}</span>
    </div>
    <div className="flex-1 space-y-4 min-h-[200px] bg-slate-50 dark:bg-[#081031] p-3 rounded-[1.5rem] border border-slate-100 dark:border-white/5">
      {children}
      {count === 0 && (
        <div className="h-full flex items-center justify-center text-slate-400 text-xs font-bold italic uppercase tracking-widest text-center opacity-50 py-10">
          Vide
        </div>
      )}
    </div>
  </div>
);

const JobCard = ({ job, onEdit, onNext, onPrev, onPayment, getStringName, getStringPrice, isArchived, onDelete }) => {
  const isPaid = job.paymentStatus === 'paid';
  const price = getStringPrice(job.stringId);

  return (
    <div className={`bg-white dark:bg-[#0f172a] rounded-2xl border ${isArchived ? 'border-slate-200 dark:border-white/5 opacity-75' : 'border-slate-200 dark:border-white/10 shadow-sm'} p-4 relative group flex flex-col`}>
      
      {/* Boutons actions absolus */}
      {!isArchived && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && <button onClick={onEdit} className="p-1.5 text-slate-400 hover:text-[#10B981] bg-slate-50 dark:bg-white/5 rounded-lg"><Edit size={14}/></button>}
          {onDelete && <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-white/5 rounded-lg"><Trash2 size={14}/></button>}
        </div>
      )}

      <div className="mb-3 pr-12">
        <h4 className="font-[900] uppercase italic text-sm text-[#081031] dark:text-white leading-tight truncate">{job.player}</h4>
        <p className="text-[10px] font-bold text-slate-500 truncate">{job.racquet}</p>
      </div>

      <div className="bg-slate-50 dark:bg-[#081031] rounded-xl p-3 mb-3 border border-slate-100 dark:border-white/5">
        <div className="text-xs font-bold text-[#10B981] mb-1.5 truncate">{getStringName(job.stringId)}</div>
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
          <span>M: {job.tensionMains} <span className="opacity-50">kg</span></span>
          <span>T: {job.tensionCrosses} <span className="opacity-50">kg</span></span>
        </div>
        <div className="text-[9px] font-bold text-slate-400 text-right mt-1">{job.knots} Nœuds</div>
      </div>

      {job.notes && (
        <div className="text-[10px] font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 p-2 rounded-lg mb-3 italic leading-tight">
          <AlertTriangle size={10} className="inline mr-1 -mt-0.5"/> {job.notes}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
        <button 
          onClick={onPayment}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors ${isPaid ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400 hover:bg-red-100'}`}
        >
          {isPaid ? <CheckCircle size={12}/> : <Banknote size={12}/>}
          {isPaid ? 'Réglé' : `${price}€ à régler`}
        </button>

        <div className="flex gap-1">
          {onPrev && (
            <button onClick={onPrev} className="p-1.5 bg-slate-100 dark:bg-white/10 rounded-lg text-slate-500 hover:text-[#081031] dark:hover:text-white transition-colors">
              <ArrowRight size={14} className="rotate-180" />
            </button>
          )}
          {onNext && (
            <button onClick={onNext} className="p-1.5 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors shadow-md">
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};