'use client';
import React, { useState, useEffect } from 'react';
import { 
  Wallet, TrendingUp, TrendingDown, Plus, Trash2, Edit2, 
  Search, Loader2, X, Save, FileText, Filter, PiggyBank,
  ArrowRight, ArrowDownLeft, ArrowUpRight, BarChart3
} from 'lucide-react';

const categories = [
  "Inscriptions & Licences",
  "Subventions",
  "Sponsoring & Mécénat",
  "Buvette & Événements",
  "Achat Matériel (Volants, Filets...)",
  "Salaires & Frais Coachs",
  "Déplacements & Interclubs",
  "Frais Bancaires & Assurances",
  "Autre"
];

export default function AdminTresoreriePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'income', 'expense'

  // Modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const emptyForm = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    type: 'expense',
    category: 'Achat Matériel (Volants, Filets...)',
    notes: ''
  };
  const [formData, setFormData] = useState(emptyForm);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tresorerie');
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (error) {
      console.error("Erreur chargement trésorerie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // --- CALCULS FINANCIERS ---
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  // Calcul par catégorie pour les dépenses
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

  // --- HANDLERS MODALE ---
  const openModal = (transaction = null) => {
    if (transaction) {
      setEditingId(transaction._id);
      setFormData(transaction);
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.date) return;

    setIsSaving(true);
    try {
      const payload = { ...formData, amount: parseFloat(formData.amount) };
      const url = editingId ? `/api/tresorerie/${editingId}` : '/api/tresorerie';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchTransactions();
        closeModal();
      }
    } catch (err) {
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette transaction ?")) return;
    try {
      await fetch(`/api/tresorerie/${id}`, { method: 'DELETE' });
      fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  // --- FILTRAGE ---
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Montserrat'] pb-24 max-w-[1600px] mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 pt-2">
            Gestion <span className="text-emerald-500">Trésorerie</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">
            Suivi des finances et du budget du club
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-[#0f172a] p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm w-fit overflow-x-auto max-w-full hide-scrollbar">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shrink-0 ${activeTab === 'dashboard' ? 'bg-[#081031] dark:bg-white text-white dark:text-[#081031] shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
          >
            <BarChart3 size={14} /> Synthèse
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shrink-0 ${activeTab === 'transactions' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
          >
            <Wallet size={14} /> Transactions
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-32"><Loader2 className="animate-spin text-emerald-500" size={48} /></div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* ONGLET 1 : DASHBOARD & SYNTHÈSE                                           */}
          {/* ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              
              {/* KPI CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-6 lg:p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group text-white ${balance >= 0 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-red-700'}`}>
                  <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform"><PiggyBank size={100} /></div>
                  <p className="text-xs font-black uppercase tracking-widest mb-2 text-white/80">Solde Actuel</p>
                  <h3 className="text-5xl font-[900] tracking-tight">{balance.toFixed(2)} €</h3>
                </div>

                <div className="bg-white dark:bg-[#0f172a] p-6 lg:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><TrendingUp size={100} className="text-blue-500" /></div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2"><ArrowUpRight size={16} className="text-blue-500"/> Total Recettes</p>
                  <h3 className="text-4xl font-[900] text-[#081031] dark:text-white">{totalIncome.toFixed(2)} €</h3>
                </div>

                <div className="bg-white dark:bg-[#0f172a] p-6 lg:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><TrendingDown size={100} className="text-red-500" /></div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2"><ArrowDownLeft size={16} className="text-red-500"/> Total Dépenses</p>
                  <h3 className="text-4xl font-[900] text-[#081031] dark:text-white">{totalExpense.toFixed(2)} €</h3>
                </div>
              </div>

              {/* GRAPHIQUES ET RÉPARTITION */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Répartition des Dépenses */}
                <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8 shadow-sm">
                  <h3 className="text-xl font-[900] italic uppercase text-[#081031] dark:text-white mb-6">Répartition des <span className="text-red-500">Dépenses</span></h3>
                  
                  {Object.keys(expenseByCategory).length === 0 ? (
                    <p className="text-sm font-bold text-slate-500 text-center py-10 italic">Aucune dépense enregistrée.</p>
                  ) : (
                    <div className="space-y-5">
                      {Object.entries(expenseByCategory)
                        .sort(([,a], [,b]) => b - a)
                        .map(([category, amount]) => {
                          const percentage = ((amount / totalExpense) * 100).toFixed(1);
                          return (
                            <div key={category} className="space-y-2">
                              <div className="flex justify-between items-end">
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase truncate pr-4">{category}</span>
                                <span className="text-sm font-black text-[#081031] dark:text-white">{amount.toFixed(2)} €</span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2.5 overflow-hidden">
                                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                              </div>
                              <div className="text-[9px] font-black text-slate-400 text-right">{percentage}%</div>
                            </div>
                          );
                      })}
                    </div>
                  )}
                </div>

                {/* Dernières Opérations */}
                <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-[900] italic uppercase text-[#081031] dark:text-white">Dernières <span className="text-emerald-500">Opérations</span></h3>
                    <button onClick={() => setActiveTab('transactions')} className="text-[10px] font-black uppercase text-emerald-500 hover:underline">Voir tout</button>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    {transactions.length === 0 ? (
                      <p className="text-sm font-bold text-slate-500 text-center py-10 italic">Aucune transaction.</p>
                    ) : (
                      transactions.slice(0, 5).map(t => (
                        <div key={t._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${t.type === 'income' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'}`}>
                              {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-[#081031] dark:text-white leading-tight truncate max-w-[150px] sm:max-w-xs">{t.title}</p>
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{new Date(t.date).toLocaleDateString('fr-FR')}</p>
                            </div>
                          </div>
                          <div className={`font-black text-base ${t.type === 'income' ? 'text-blue-500' : 'text-red-500'}`}>
                            {t.type === 'income' ? '+' : '-'}{t.amount.toFixed(2)}€
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* ONGLET 2 : TOUTES LES TRANSACTIONS                                        */}
          {/* ========================================================================= */}
          {activeTab === 'transactions' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              
              {/* BARRE D'OUTILS */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#0f172a] p-4 lg:p-6 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 w-full sm:w-auto flex-1">
                  <div className="relative w-full max-w-sm">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Rechercher (titre, catégorie)..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-[#081031] dark:text-white" 
                    />
                  </div>
                  <div className="flex items-center gap-2 p-1 bg-slate-50 dark:bg-[#081031] rounded-xl border border-slate-200 dark:border-white/10">
                    <button onClick={() => setTypeFilter('all')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === 'all' ? 'bg-white dark:bg-[#0f172a] text-[#081031] dark:text-white shadow-sm' : 'text-slate-400'}`}>Tout</button>
                    <button onClick={() => setTypeFilter('income')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === 'income' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' : 'text-slate-400'}`}>Recettes</button>
                    <button onClick={() => setTypeFilter('expense')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === 'expense' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'text-slate-400'}`}>Dépenses</button>
                  </div>
                </div>
                <button 
                  onClick={() => openModal()} 
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
                >
                  <Plus size={16} /> Ajouter Ligne
                </button>
              </div>

              {/* TABLEAU */}
              <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-[#081031] border-b border-slate-200 dark:border-white/10">
                        <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Libellé & Catégorie</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest hidden md:table-cell">Notes</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Montant</th>
                        <th className="px-6 py-5 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {filteredTransactions.length === 0 ? (
                        <tr><td colSpan="5" className="px-6 py-16 text-center text-slate-400 font-bold text-sm italic">Aucune transaction trouvée.</td></tr>
                      ) : (
                        filteredTransactions.map((t) => (
                          <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4">
                              <span className="text-xs font-black text-slate-500 dark:text-slate-400 tracking-widest uppercase">
                                {new Date(t.date).toLocaleDateString('fr-FR')}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-[900] uppercase text-sm text-[#081031] dark:text-white leading-tight mb-1">
                                {t.title}
                              </div>
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-white/5 rounded-md text-[8px] font-black uppercase tracking-widest text-slate-500">
                                {t.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell">
                              <p className="text-xs font-medium text-slate-500 line-clamp-2 max-w-xs">{t.notes || '-'}</p>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className={`font-black text-base ${t.type === 'income' ? 'text-blue-500' : 'text-red-500'}`}>
                                {t.type === 'income' ? '+' : '-'}{t.amount.toFixed(2)}€
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openModal(t)} className="p-2 bg-slate-100 text-slate-400 hover:text-emerald-500 dark:bg-white/5 dark:hover:text-emerald-400 rounded-lg transition-colors">
                                  <Edit2 size={14} />
                                </button>
                                <button onClick={() => handleDelete(t._id)} className="p-2 bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:bg-white/5 dark:hover:bg-red-500/20 rounded-lg transition-colors">
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
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* MODALE : AJOUTER / MODIFIER UNE TRANSACTION                               */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#081031] rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] shadow-2xl border border-slate-200 dark:border-white/10 animate-in zoom-in-95 flex flex-col overflow-hidden">
            
            <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-[#0f172a] shrink-0">
              <h2 className="text-xl lg:text-2xl font-[900] italic uppercase text-[#081031] dark:text-white flex items-center gap-3">
                <Wallet className="text-emerald-500" size={24} /> {editingId ? 'Modifier Transaction' : 'Saisir une Opération'}
              </h2>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="overflow-y-auto hide-scrollbar p-6 lg:p-8 space-y-8 flex-1">
              
              {/* TYPE (INCOME / EXPENSE) */}
              <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/10">
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, type: 'income'})}
                  className={`flex-1 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all ${formData.type === 'income' ? 'bg-white dark:bg-[#081031] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-white/5' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                >
                  <TrendingUp size={16} /> Recette (Entrée)
                </button>
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, type: 'expense'})}
                  className={`flex-1 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all ${formData.type === 'expense' ? 'bg-white dark:bg-[#081031] text-red-600 dark:text-red-400 shadow-sm border border-slate-200 dark:border-white/5' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                >
                  <TrendingDown size={16} /> Dépense (Sortie)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Libellé / Titre *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-[#081031] dark:text-white" 
                    placeholder="Ex: Facture LARDESPORTS" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Montant (€) *</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.01" 
                      required 
                      value={formData.amount} 
                      onChange={e => setFormData({...formData, amount: e.target.value})} 
                      className={`w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-10 py-3.5 text-lg font-black outline-none focus:ring-2 transition-all ${formData.type === 'income' ? 'text-blue-600 focus:ring-blue-500' : 'text-red-600 focus:ring-red-500'}`} 
                      placeholder="0.00" 
                    />
                    <span className={`absolute right-4 top-1/2 -translate-y-1/2 font-black ${formData.type === 'income' ? 'text-blue-600' : 'text-red-600'}`}>€</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Catégorie *</label>
                  <select 
                    required 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 appearance-none text-[#081031] dark:text-white cursor-pointer"
                  >
                    <option value="" disabled>Sélectionner...</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Date d'opération *</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.date} 
                    onChange={e => setFormData({...formData, date: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-[#081031] dark:text-white" 
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-1.5"><FileText size={12}/> Notes & Références (Optionnel)</label>
                  <textarea 
                    rows="3" 
                    value={formData.notes} 
                    onChange={e => setFormData({...formData, notes: e.target.value})} 
                    className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none text-[#081031] dark:text-white placeholder:text-slate-400" 
                    placeholder="Numéro de facture, détails du chèque..."
                  ></textarea>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-white/10 flex justify-end gap-3 mt-auto">
                <button type="button" onClick={closeModal} className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">Annuler</button>
                <button type="submit" disabled={isSaving} className="bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                  {editingId ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}