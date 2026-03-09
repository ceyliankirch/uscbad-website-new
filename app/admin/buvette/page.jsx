'use client';
import React, { useState, useEffect } from 'react';
import { 
  Coffee, ShoppingCart, FileText, BarChart3, Plus, 
  Trash2, Printer, CheckCircle2, Circle, DollarSign, 
  TrendingUp, Pizza, Calendar, Save, X, Edit, Eye, Loader2,
  TrendingDown, Cake, Copy, Filter, Info, CreditCard, ChevronDown, Utensils
} from 'lucide-react';

export default function BuvetteDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // --- ÉTATS ---
  const [bilans, setBilans] = useState([]);
  const [dbEvents, setDbEvents] = useState([]); 
  const [selectedBilanFilter, setSelectedBilanFilter] = useState('all'); 
  
  const [isBilanModalOpen, setIsBilanModalOpen] = useState(false);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false); 
  const [viewingBilan, setViewingBilan] = useState(null); 
  const [bilanForm, setBilanForm] = useState({ name: '', date: '', revenue: '', cost: '' });

  const [menus, setMenus] = useState([]);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isMenuEventDropdownOpen, setIsMenuEventDropdownOpen] = useState(false); 
  const [currentMenu, setCurrentMenu] = useState(null);
  const [viewingMenu, setViewingMenu] = useState(null); 

  // États pour la création de produit et ses variantes
  const [menuItemForm, setMenuItemForm] = useState({ category: 'Le Salé', name: '', price: '', variants: [] });
  const [variantForm, setVariantForm] = useState({ name: '', price: '' });

  const [shoppingList, setShoppingList] = useState({
    'Boissons': [], 'Frais': [], 'Sec & Boulangerie': [], 'Matériel': []
  });
  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState('Boissons');
  const [newItemPrice, setNewItemPrice] = useState('');

  // --- CHARGEMENT GLOBAL DEPUIS LA BDD ---
  const fetchBuvetteData = async () => {
    setIsLoadingData(true);
    try {
      const [bilansRes, menusRes, shoppingRes, eventsRes] = await Promise.all([
        fetch('/api/buvette/bilans'),
        fetch('/api/buvette/menus'),
        fetch('/api/buvette/shopping'),
        fetch('/api/tournaments') 
      ]);
      
      const bData = await bilansRes.json();
      const mData = await menusRes.json();
      const sData = await shoppingRes.json();
      const eData = await eventsRes.json();

      if (bData.success) setBilans(bData.data);
      if (mData.success) setMenus(mData.data);
      if (eData.success) setDbEvents(eData.data);
      
      if (sData.success && sData.data?.list && Object.keys(sData.data.list).length > 0) {
        setShoppingList(sData.data.list);
      } else {
        setShoppingList({
          'Boissons': [ { id: '1', name: 'Packs d\'eau cristaline (x10)', checked: true, price: 15 } ],
          'Frais': [], 'Sec & Boulangerie': [], 'Matériel': []
        });
      }
    } catch (error) {
      console.error("Erreur de chargement", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchBuvetteData();
  }, []);

  // --- CALCULS STATISTIQUES (FILTRÉS) ---
  const uniqueBilanNames = Array.from(new Set(bilans.map(b => b.name)));

  const filteredBilans = selectedBilanFilter === 'all' 
    ? bilans 
    : bilans.filter(b => b.name === selectedBilanFilter);

  const totalRevenue = filteredBilans.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalCost = filteredBilans.reduce((acc, curr) => acc + curr.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const avgProfit = filteredBilans.length > 0 ? (totalProfit / filteredBilans.length).toFixed(0) : 0;
  const globalMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;

  const totalCoursesItems = Object.values(shoppingList).flat().length;
  const checkedCoursesItems = Object.values(shoppingList).flat().filter(i => i.checked).length;
  const coursesProgress = totalCoursesItems > 0 ? Math.round((checkedCoursesItems / totalCoursesItems) * 100) : 0;
  const estimatedBudget = Object.values(shoppingList).flat().reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);

  // --- HANDLERS FINANCES ---
  const submitBilan = async (e) => {
    e.preventDefault();
    const payload = {
      name: bilanForm.name,
      date: bilanForm.date,
      revenue: parseFloat(bilanForm.revenue),
      cost: parseFloat(bilanForm.cost)
    };
    try {
      const res = await fetch('/api/buvette/bilans', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchBuvetteData();
        setIsBilanModalOpen(false);
        setBilanForm({ name: '', date: '', revenue: '', cost: '' });
      }
    } catch (err) { alert("Erreur lors de la sauvegarde."); }
  };

  const deleteBilan = async (id) => {
    if(window.confirm("Supprimer ce bilan financier ?")) {
      await fetch(`/api/buvette/bilans/${id}`, { method: 'DELETE' });
      fetchBuvetteData();
      if (selectedBilanFilter !== 'all') setSelectedBilanFilter('all');
    }
  };

  // --- HANDLERS COURSES ---
  const saveShoppingListToDB = async (newList) => {
    await fetch('/api/buvette/shopping', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ list: newList })
    });
  };

  const toggleCourseItem = (category, id) => {
    const newList = {
      ...shoppingList,
      [category]: shoppingList[category].map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    };
    setShoppingList(newList); 
    saveShoppingListToDB(newList);
  };

  const addCourseItem = (e) => {
    e.preventDefault();
    if (!newItemName) return;
    const newItem = { id: Date.now().toString(), name: newItemName, checked: false, price: parseFloat(newItemPrice) || 0 };
    const newList = {
      ...shoppingList,
      [newItemCat]: [...(shoppingList[newItemCat] || []), newItem]
    };
    setShoppingList(newList);
    saveShoppingListToDB(newList);
    setNewItemName('');
    setNewItemPrice('');
  };

  const deleteCourseItem = (category, id) => {
    const newList = {
      ...shoppingList,
      [category]: shoppingList[category].filter(item => item.id !== id)
    };
    setShoppingList(newList);
    saveShoppingListToDB(newList);
  };

  // --- HANDLERS MENUS ---
  const openMenuBuilder = (menu = null) => {
    if (menu) {
      setCurrentMenu(JSON.parse(JSON.stringify(menu)));
    } else {
      setCurrentMenu({ title: '', edition: new Date().getFullYear().toString(), color: '#F72585', items: [] });
    }
    setMenuItemForm({ category: 'Le Salé', name: '', price: '', variants: [] });
    setVariantForm({ name: '', price: '' });
    setIsMenuModalOpen(true);
  };

  const duplicateMenu = (menu) => {
    const newMenu = JSON.parse(JSON.stringify(menu));
    delete newMenu._id;
    newMenu.title = `${newMenu.title}`;
    newMenu.edition = (new Date().getFullYear() + 1).toString(); 
    setCurrentMenu(newMenu);
    setIsMenuModalOpen(true);
  };

  // Gestion des variantes
  const handleAddVariant = () => {
    if (!variantForm.name) return;
    setMenuItemForm(prev => ({
      ...prev,
      variants: [...prev.variants, { 
        name: variantForm.name, 
        price: variantForm.price !== '' ? parseFloat(variantForm.price) : null 
      }]
    }));
    setVariantForm({ name: '', price: '' });
  };

  const handleRemoveVariant = (idx) => {
    setMenuItemForm(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx)
    }));
  };

  // Gestion de l'ajout d'un produit complet
  const handleAddMenuItem = () => {
    const price = parseFloat(menuItemForm.price);
    if (!menuItemForm.name || isNaN(price)) return alert("Nom et prix de base obligatoires.");
    
    setCurrentMenu({
      ...currentMenu,
      items: [...currentMenu.items, { 
        category: menuItemForm.category, 
        name: menuItemForm.name, 
        price: price, 
        variants: menuItemForm.variants 
      }]
    });
    
    setMenuItemForm({ category: menuItemForm.category, name: '', price: '', variants: [] });
  };

  const saveMenu = async () => {
    const method = currentMenu._id ? 'PUT' : 'POST';
    const url = currentMenu._id ? `/api/buvette/menus/${currentMenu._id}` : '/api/buvette/menus';
    try {
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(currentMenu)
      });
      if (res.ok) {
        fetchBuvetteData();
        setIsMenuModalOpen(false);
      }
    } catch (err) { alert("Erreur d'enregistrement."); }
  };

  const deleteMenu = async (id) => {
    if(window.confirm("Supprimer ce menu définitivement ?")) {
      await fetch(`/api/buvette/menus/${id}`, { method: 'DELETE' });
      fetchBuvetteData();
    }
  };

  const printMenu = () => window.print();

  // --- RENDU DU GRAPHIQUE EN COURBE (LINE CHART SVG) ---
  const renderLineChart = (data) => {
    if (!data || data.length === 0) return <p className="text-slate-400 text-sm font-bold w-full text-center py-10">Aucune donnée.</p>;
    
    const sortedData = [...data].sort((a,b) => new Date(a.date) - new Date(b.date));
    const profits = sortedData.map(d => d.revenue - d.cost);
    
    const maxProfit = Math.max(...profits, 100);
    const minProfit = Math.min(...profits, 0); 
    const range = maxProfit - minProfit || 1; 
    
    const w = 800;
    const h = 250;
    const paddingX = 40;
    const paddingY = 40;

    const points = profits.map((p, i) => {
      const x = profits.length > 1 ? paddingX + (i / (profits.length - 1)) * (w - paddingX * 2) : w / 2;
      const y = h - paddingY - ((p - minProfit) / range) * (h - paddingY * 2);
      return `${x},${y}`;
    }).join(' L ');

    return (
      <div className="relative w-full h-full min-h-[250px] overflow-hidden">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          
          {minProfit < 0 && (
             <line 
               x1={paddingX} y1={h - paddingY - ((0 - minProfit) / range) * (h - paddingY * 2)} 
               x2={w - paddingX} y2={h - paddingY - ((0 - minProfit) / range) * (h - paddingY * 2)} 
               stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" 
             />
          )}

          <line x1={paddingX} y1={h - paddingY} x2={w - paddingX} y2={h - paddingY} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          <line x1={paddingX} y1={paddingY} x2={w - paddingX} y2={paddingY} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          
          <path 
            d={`M ${points}`} 
            fill="none" 
            stroke="#0065FF" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="drop-shadow-[0_5px_10px_rgba(0,101,255,0.4)]" 
          />
          
          {profits.map((p, i) => {
            const x = profits.length > 1 ? paddingX + (i / (profits.length - 1)) * (w - paddingX * 2) : w / 2;
            const y = h - paddingY - ((p - minProfit) / range) * (h - paddingY * 2);
            const isNegative = p < 0;
            return (
              <g key={i} className="group">
                <circle cx={x} cy={y} r="6" fill="#081031" stroke={isNegative ? "#f43f5e" : "#0EE2E2"} strokeWidth="3" className="transition-all cursor-pointer group-hover:r-8" />
                
                <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <rect x={x - 40} y={y - 35} w="80" h="24" rx="6" fill={isNegative ? "#f43f5e" : "#0065FF"} />
                  <text x={x} y={y - 18} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">
                    {p.toFixed(0)}€
                  </text>
                </g>
                
                <text x={x} y={h - 10} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                  {selectedBilanFilter === 'all' 
                    ? new Date(sortedData[i].date).getFullYear() 
                    : `${new Date(sortedData[i].date).getFullYear()}`
                  }
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen font-['Montserrat'] animate-in fade-in duration-500 pb-24">
      
      {/* HEADER CACHÉ À L'IMPRESSION */}
      <div className="print:hidden mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white pt-2">
              Gestion <span className="text-[#F72585]">Buvette</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">
              Finances, Menus et Listes de courses
            </p>
          </div>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-2 p-1.5 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm w-max">
          <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-[#081031] dark:bg-white text-white dark:text-[#081031] shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>
            <BarChart3 size={14} /> Statistiques & Bilans
          </button>
          <button onClick={() => setActiveTab('menus')} className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 ${activeTab === 'menus' ? 'bg-[#F72585] text-white shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>
            <Pizza size={14} /> Menus & Tarifs
          </button>
          <button onClick={() => setActiveTab('courses')} className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 ${activeTab === 'courses' ? 'bg-[#0065FF] text-white shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>
            <ShoppingCart size={14} /> Liste de Courses
          </button>
        </div>
      </div>

      {isLoadingData ? (
        <div className="flex justify-center py-32"><Loader2 className="animate-spin text-[#F72585]" size={48} /></div>
      ) : (
        <>
          {/* ========================================================= */}
          {/* ONGLET 1 : TABLEAU DE BORD (FINANCES)                     */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 print:hidden">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm gap-4">
                <div className="flex items-center gap-3">
                  <Filter size={18} className="text-[#0065FF]" />
                  <span className="font-bold text-sm uppercase tracking-widest text-[#081031] dark:text-white">Filtrer par événement</span>
                </div>
                <div className="relative w-full sm:w-auto">
                  <select 
                    value={selectedBilanFilter} 
                    onChange={(e) => setSelectedBilanFilter(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pr-10 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0065FF] appearance-none cursor-pointer text-[#081031] dark:text-white"
                  >
                    <option value="all">📊 VUE GLOBALE (Tous les événements)</option>
                    {uniqueBilanNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2rem] border border-slate-100 dark:border-white/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><TrendingUp size={80} className="text-[#0065FF]" /></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Chiffre d'Affaires</p>
                  <h3 className="text-4xl font-[900] text-[#0065FF]">{totalRevenue.toFixed(2)}€</h3>
                </div>
                <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2rem] border border-slate-100 dark:border-white/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><TrendingDown size={80} className="text-red-500" /></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Dépenses</p>
                  <h3 className="text-4xl font-[900] text-red-500">-{totalCost.toFixed(2)}€</h3>
                </div>
                <div className={`p-6 rounded-[2rem] shadow-xl relative overflow-hidden group text-white ${totalProfit >= 0 ? 'bg-gradient-to-br from-[#10B981] to-[#059669]' : 'bg-gradient-to-br from-red-500 to-red-700'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform"><DollarSign size={80} /></div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-white/80">Bénéfice Net</p>
                  <h3 className="text-4xl font-[900]">{totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}€</h3>
                </div>
                <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2rem] border border-slate-100 dark:border-white/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><BarChart3 size={80} className="text-[#F72585]"/></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Marge Nette</p>
                  <h3 className="text-4xl font-[900] text-[#F72585]">{globalMargin}%</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-1 bg-white dark:bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-sm flex flex-col">
                  <h3 className="text-xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2">
                    {selectedBilanFilter === 'all' ? 'Évolution Globale' : 'Historique par édition'}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8">Bénéfice net (Recettes - Dépenses)</p>
                  
                  <div className="flex-1 flex items-end mt-auto relative">
                    {renderLineChart(filteredBilans)}
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-[900] italic uppercase text-[#081031] dark:text-white">Détail des <span className="text-[#0EE2E2]">Tournois</span></h3>
                    <button onClick={() => setIsBilanModalOpen(true)} className="bg-[#081031] dark:bg-white text-white dark:text-[#081031] px-4 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:scale-105 transition-transform shadow-lg">
                      <Plus size={14} /> Ajouter
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-100 dark:border-white/5">
                          <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Événement</th>
                          <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date / Édition</th>
                          <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Recettes</th>
                          <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Dépenses</th>
                          <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-[#0065FF]">Bénéfice</th>
                          <th className="pb-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                        {filteredBilans.length === 0 && <tr><td colSpan="6" className="py-8 text-center text-slate-400 font-bold text-sm">Aucun bilan à afficher.</td></tr>}
                        {filteredBilans.map(t => (
                          <tr key={t._id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setViewingBilan(t)}>
                            <td className="py-4 font-bold text-sm text-[#081031] dark:text-white group-hover:text-[#0065FF] transition-colors">{t.name}</td>
                            <td className="py-4 text-xs font-medium text-slate-500">{new Date(t.date).toLocaleDateString('fr-FR')}</td>
                            <td className="py-4 text-sm font-bold text-green-600">+{t.revenue}€</td>
                            <td className="py-4 text-sm font-bold text-red-500">-{t.cost}€</td>
                            <td className="py-4 text-sm font-black text-[#0065FF]">{(t.revenue - t.cost).toFixed(2)}€</td>
                            <td className="py-4 text-right flex justify-end gap-2">
                              <button onClick={(e) => { e.stopPropagation(); setViewingBilan(t); }} className="p-2 text-slate-300 hover:text-[#0065FF] transition-colors"><Eye size={16}/></button>
                              <button onClick={(e) => { e.stopPropagation(); deleteBilan(t._id); }} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ONGLET 2 : GÉNÉRATEUR DE MENUS DA SITE                    */}
          {/* ========================================================= */}
          {activeTab === 'menus' && !viewingMenu && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 print:hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-[#081031] to-[#0f172a] p-8 rounded-[2.5rem] shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F72585]/20 blur-[80px] rounded-full pointer-events-none"></div>
                <div className="relative z-10 text-white mb-6 sm:mb-0">
                  <h3 className="text-2xl lg:text-3xl font-[900] uppercase italic mb-2 tracking-tighter">
                    Générateur de <span className="text-[#F72585]">Menus</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Connecté à votre base de tournois.</p>
                </div>
                <button onClick={() => openMenuBuilder()} className="relative z-10 bg-[#F72585] text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(247,37,133,0.4)]">
                  <Plus size={18} /> Créer un Menu
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {menus.length === 0 && <div className="col-span-full py-10 text-center text-slate-500 font-bold uppercase tracking-widest">Aucun menu sauvegardé.</div>}
                {menus.map(menu => {
                  return (
                    <div key={menu._id} className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden" style={{ '--hover-border': menu.color || '#F72585' }} onMouseEnter={e => e.currentTarget.style.borderColor = menu.color || '#F72585'} onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
                      <button onClick={() => deleteMenu(menu._id)} className="absolute top-4 right-4 p-2 bg-[#081031]/50 backdrop-blur-md rounded-xl text-white/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20"><Trash2 size={14}/></button>
                      <button onClick={() => duplicateMenu(menu)} className="absolute top-4 right-14 p-2 bg-[#081031]/50 backdrop-blur-md rounded-xl text-white/50 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-20" title="Dupliquer pour l'édition suivante"><Copy size={14}/></button>
                      
                      <div className="h-32 bg-[#081031] p-6 relative flex flex-col justify-end overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 blur-[40px] rounded-full pointer-events-none opacity-30" style={{ backgroundColor: menu.color || '#F72585' }}></div>
                        <h4 className="text-2xl font-[900] uppercase italic text-white truncate relative z-10 w-10/12 leading-none">{menu.title}</h4>
                        {menu.edition && <span className="font-black text-[10px] uppercase tracking-widest mt-1" style={{ color: menu.color || '#F72585' }}>Édition {menu.edition}</span>}
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                          <Pizza size={14} style={{ color: menu.color || '#F72585' }} /> {menu.items.length} articles référencés
                        </p>
                        
                        <div className="mt-auto grid grid-cols-2 gap-3">
                          <button onClick={() => setViewingMenu(menu)} className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors" style={{ backgroundColor: `${menu.color || '#F72585'}15`, color: menu.color || '#F72585' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = menu.color || '#F72585'; e.currentTarget.style.color = 'white'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = `${menu.color || '#F72585'}15`; e.currentTarget.style.color = menu.color || '#F72585'; }}>
                            <Printer size={14} /> Imprimer
                          </button>
                          <button onClick={() => openMenuBuilder(menu)} className="flex items-center justify-center gap-2 py-3.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-[#081031] dark:hover:text-white transition-colors">
                            <Edit size={14} /> Éditer
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VUE "AFFICHER/IMPRIMER LE MENU" (NOUVEAU DESIGN CIBLE)    */}
          {/* ========================================================= */}
          {viewingMenu && (
            <div className="fixed inset-0 z-[200] overflow-y-auto bg-[#040817]/95 backdrop-blur-md print:bg-white print:static print:block animate-in zoom-in-95 duration-300 font-['Montserrat']">
              
              <div className="print:hidden sticky top-0 z-50 flex justify-between items-center p-6 bg-[#081031]/80 backdrop-blur-lg border-b border-white/10 shadow-2xl">
                <div className="flex items-center gap-4 text-white">
                  <button onClick={() => setViewingMenu(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
                  <div>
                    <h3 className="font-[900] uppercase italic text-lg leading-none">Aperçu Avant Impression</h3>
                    <p className="text-[10px] font-bold text-[#0EE2E2] uppercase tracking-widest">Format A4 - Design Original Épuré</p>
                  </div>
                </div>
                <button onClick={printMenu} className="bg-[#0065FF] hover:bg-[#0EE2E2] hover:text-[#081031] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(0,101,255,0.4)] transition-all">
                  <Printer size={18} /> Lancer l'impression
                </button>
              </div>

              {/* ZONE D'IMPRESSION (Feuille A4 - Reconstruite selon la maquette image_f521b2.png) */}
              <div className="bg-white text-[#081031] my-10 mx-auto relative overflow-hidden print:shadow-none print:my-0 flex flex-col font-['Montserrat']" 
                   style={{ width: '210mm', minHeight: '297mm', WebkitPrintColorAdjust: 'exact', colorAdjust: 'exact', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}>
                
                {/* Background subtle gradients */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0065FF]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#F72585]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

                {/* Header */}
                <div className="text-center pt-16 pb-8 px-16 relative z-10 w-full flex flex-col items-center">
                  <div className="bg-[#081031] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 shadow-md mb-6">
                    <Utensils size={14} /> US CRÉTEIL BADMINTON
                  </div>
                  <h1 className="text-[64px] font-[900] uppercase italic tracking-tighter leading-none mb-1">
                    <span className="text-[#081031]">LA</span> <span className="text-[#0065FF]">BUVETTE</span>
                  </h1>
                  <h2 className="text-2xl font-[900] uppercase tracking-[0.1em]" style={{ color: viewingMenu.color || '#F72585' }}>
                    {viewingMenu.title} {viewingMenu.edition}
                  </h2>
                  <div className="w-full h-[3px] bg-[#081031] mt-10 rounded-full opacity-90"></div>
                </div>

                <div className="flex-1 flex flex-col px-[16mm] pb-[16mm] relative z-10">
                  <div className="grid grid-cols-2 gap-x-16 gap-y-12">
                    
                    {['Le Salé', 'Le Sucré', 'Rafraichissements'].map(cat => {
                      const catItems = viewingMenu.items.filter(i => i.category === cat);
                      if (catItems.length === 0) return null;

                      let catColor = "#0065FF";
                      let CatIcon = Pizza;
                      if (cat === 'Le Salé') { catColor = "#0065FF"; CatIcon = Pizza; }
                      if (cat === 'Le Sucré') { catColor = "#F72585"; CatIcon = Cake; }
                      if (cat === 'Rafraichissements') { catColor = "#0EE2E2"; CatIcon = Coffee; }

                      return (
                        <div key={cat} className={`${cat === 'Rafraichissements' ? 'col-span-2' : 'col-span-1'} flex flex-col`}>
                          <div className="flex items-center gap-3 mb-6">
                            <CatIcon size={26} style={{ color: catColor }} />
                            <h3 className="text-2xl font-[900] uppercase italic tracking-tight text-[#081031]">{cat}</h3>
                          </div>
                          
                          <div className={`pl-4 border-l-4 ${cat === 'Rafraichissements' ? 'grid grid-cols-2 gap-x-12 gap-y-6' : 'space-y-6'}`} style={{ borderColor: `${catColor}40` }}>
                            {catItems.map((item, idx) => (
                              <div key={idx} className="flex flex-col w-full">
                                <div className="flex justify-between items-end w-full relative">
                                  <span className="text-[15px] font-[900] uppercase text-[#081031] leading-none bg-white pr-2 relative z-10">{item.name}</span>
                                  <div className="absolute left-0 right-0 bottom-[4px] border-b-[2px] border-dotted border-slate-300 z-0"></div>
                                  <span className="text-[16px] font-[900] shrink-0 leading-none bg-white pl-2 relative z-10" style={{ color: catColor }}>{item.price.toFixed(2).replace('.', ',')}€</span>
                                </div>
                                
                                {/* Variantes (Liste) */}
                                {Array.isArray(item.variants) && item.variants.length > 0 && (
                                  <div className="mt-2.5 space-y-1.5">
                                    {item.variants.map((v, vIdx) => (
                                      <div key={vIdx} className="flex justify-between items-end w-full text-[10px] font-black uppercase tracking-wider leading-none relative" style={{ color: catColor }}>
                                        <span className="bg-white pr-2 relative z-10"><span className="opacity-50 mr-1">+</span>{v.name}</span>
                                        <div className="absolute left-0 right-0 bottom-[2px] border-b-[2px] border-dotted border-slate-200 z-0 opacity-50"></div>
                                        {v.price != null && !isNaN(v.price) && <span className="bg-white pl-2 relative z-10">+{Number(v.price).toFixed(2).replace('.', ',')}€</span>}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Variantes (Texte rétrocompatibilité) */}
                                {typeof item.variants === 'string' && item.variants && (
                                  <div className="mt-2.5 space-y-1.5">
                                    {item.variants.split('\n').map((v, vIdx) => (
                                      <div key={vIdx} className="flex items-end w-full text-[10px] font-black uppercase tracking-wider leading-none" style={{ color: catColor }}>
                                        <span className="bg-white pr-2 relative z-10"><span className="opacity-50 mr-1">+</span>{v}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto px-16 pb-12 flex justify-between items-end relative z-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">L'abus d'alcool est dangereux pour la santé.</p>
                  <div className="bg-[#081031] text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                    <DollarSign size={14} className="text-[#0EE2E2]" /> CB Acceptée
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ONGLET 3 : LISTE DE COURSES                               */}
          {/* ========================================================= */}
          {activeTab === 'courses' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 print:hidden">
              
              <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
                 <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                   <svg className="w-full h-full transform -rotate-90">
                     <circle cx="64" cy="64" r="56" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="12" fill="none" />
                     <circle cx="64" cy="64" r="56" className="stroke-[#0EE2E2] transition-all duration-1000 ease-out" strokeWidth="12" fill="none" strokeDasharray="351" strokeDashoffset={351 - (351 * coursesProgress) / 100} strokeLinecap="round" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-2xl font-[900] text-[#081031] dark:text-white">{coursesProgress}%</span>
                   </div>
                 </div>
                 <div className="flex-1 text-center md:text-left">
                   <h2 className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2">Progression des achats</h2>
                   <p className="text-sm font-bold text-slate-500 mb-4">{checkedCoursesItems} articles achetés sur {totalCoursesItems}</p>
                   <div className="inline-flex items-center gap-2 bg-[#0065FF]/10 text-[#0065FF] px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest">
                     Budget Estimé : ~{estimatedBudget}€
                   </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Object.entries(shoppingList).map(([category, items]) => (
                  <div key={category} className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-100 dark:border-white/10 p-6 shadow-sm">
                    <h3 className="text-lg font-black uppercase tracking-widest text-[#081031] dark:text-white mb-6 flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                      {category}
                      <span className="bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 px-3 py-1 rounded-lg text-[10px]">{items.length}</span>
                    </h3>
                    
                    <ul className="space-y-3 mb-6">
                      {items.map(item => (
                        <li key={item.id} className="flex items-center justify-between group">
                          <button 
                            onClick={() => toggleCourseItem(category, item.id)}
                            className={`flex items-center gap-3 flex-1 text-left ${item.checked ? 'text-slate-400 line-through' : 'text-[#081031] dark:text-white font-bold'}`}
                          >
                            {item.checked ? <CheckCircle2 className="text-green-500 shrink-0" size={20} /> : <Circle className="text-slate-300 shrink-0" size={20} />}
                            <span className="text-sm">{item.name}</span>
                            {item.price > 0 && <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md ml-auto">~{item.price}€</span>}
                          </button>
                          <button onClick={() => deleteCourseItem(category, item.id)} className="opacity-0 group-hover:opacity-100 text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all ml-2">
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                      {items.length === 0 && <li className="text-xs font-bold text-slate-400 italic">Aucun article</li>}
                    </ul>
                  </div>
                ))}
              </div>

              <form onSubmit={addCourseItem} className="bg-[#081031] p-6 lg:p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-4 shadow-xl">
                <h4 className="text-white font-black uppercase text-sm italic md:mr-4 shrink-0">Ajouter :</h4>
                <input type="text" placeholder="Ex: Gobelets café..." required value={newItemName} onChange={e => setNewItemName(e.target.value)} className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/40 p-4 rounded-2xl font-bold text-sm outline-none focus:border-[#0EE2E2] w-full" />
                <div className="flex w-full md:w-auto gap-4">
                  <select value={newItemCat} onChange={e => setNewItemCat(e.target.value)} className="bg-white/10 border border-white/20 text-white p-4 rounded-2xl font-bold text-sm outline-none cursor-pointer">
                    {Object.keys(shoppingList).map(c => <option key={c} value={c} className="text-black">{c}</option>)}
                  </select>
                  <input type="number" placeholder="Prix €" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} className="w-24 bg-white/10 border border-white/20 text-white placeholder:text-white/40 p-4 rounded-2xl font-bold text-sm outline-none focus:border-[#0EE2E2]" />
                  <button type="submit" className="bg-[#0EE2E2] text-[#081031] p-4 rounded-2xl hover:bg-white transition-colors shrink-0">
                    <Plus size={20} />
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* ========================================================= */}
          {/* MODALES D'ADMINISTRATION                                  */}
          {/* ========================================================= */}

          {/* MODALE DÉTAIL BILAN FINANCIER */}
          {viewingBilan && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-[#081031] w-full max-w-lg rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95">
                <div className="p-8 text-center bg-[#081031] text-white relative border-b border-white/10">
                  <button onClick={() => setViewingBilan(null)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
                  <div className="w-16 h-16 bg-[#0065FF]/20 text-[#0EE2E2] rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 size={32} />
                  </div>
                  <h3 className="text-3xl font-[900] uppercase italic tracking-tighter leading-tight mb-2">{viewingBilan.name}</h3>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <Calendar size={12} className="inline mr-1" /> {new Date(viewingBilan.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
                
                <div className="p-8 space-y-6 bg-slate-50 dark:bg-[#0f172a]">
                  <div className="flex justify-between items-center bg-white dark:bg-[#081031] p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><TrendingUp size={16} className="text-blue-500" /> Recettes Brutes</span>
                    <span className="text-xl font-black text-blue-500">+{viewingBilan.revenue.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between items-center bg-white dark:bg-[#081031] p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><TrendingDown size={16} className="text-red-500" /> Dépenses & Achats</span>
                    <span className="text-xl font-black text-red-500">-{viewingBilan.cost.toFixed(2)}€</span>
                  </div>
                  <div className={`flex justify-between items-center p-6 rounded-[2rem] shadow-md border ${viewingBilan.revenue - viewingBilan.cost >= 0 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 border-emerald-400 text-white' : 'bg-gradient-to-r from-red-600 to-red-500 border-red-500 text-white'}`}>
                    <span className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><DollarSign size={20} /> Bénéfice Net</span>
                    <span className="text-3xl font-[900] italic">{(viewingBilan.revenue - viewingBilan.cost).toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODALE AJOUT BILAN FINANCIER AVEC COMBOBOX */}
          {isBilanModalOpen && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-[#081031] w-full max-w-md rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95">
                <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-[#0f172a]">
                  <h3 className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white flex items-center gap-3">
                    <DollarSign className="text-[#0065FF]" size={24} />
                    Nouveau <span className="text-[#0065FF]">Bilan</span>
                  </h3>
                  <button onClick={() => setIsBilanModalOpen(false)} className="p-2 text-slate-400 hover:text-red-500 bg-white dark:bg-white/5 rounded-full transition-colors"><X size={20} /></button>
                </div>
                
                <form onSubmit={submitBilan} className="p-6 lg:p-8 space-y-6">
                  
                  {/* COMBOBOX POUR SÉLECTIONNER UN TOURNOI EXISTANT */}
                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Nom de l'événement *</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required 
                        value={bilanForm.name} 
                        onChange={e => { setBilanForm({...bilanForm, name: e.target.value}); setIsEventDropdownOpen(true); }}
                        onFocus={() => setIsEventDropdownOpen(true)}
                        onBlur={() => setTimeout(() => setIsEventDropdownOpen(false), 200)}
                        className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#0065FF] transition-all text-[#081031] dark:text-white" 
                        placeholder="Saisissez ou choisissez un tournoi" 
                      />
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      
                      {isEventDropdownOpen && dbEvents.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-2 max-h-48 overflow-y-auto bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 hide-scrollbar py-2">
                          {dbEvents.filter(e => e.title.toLowerCase().includes(bilanForm.name.toLowerCase())).map(evt => (
                            <div 
                              key={evt._id} 
                              onClick={() => { setBilanForm({...bilanForm, name: evt.title}); setIsEventDropdownOpen(false); }}
                              className="px-4 py-3 text-sm font-bold cursor-pointer hover:bg-[#0065FF]/10 hover:text-[#0065FF] transition-colors text-[#081031] dark:text-white truncate"
                            >
                              {evt.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Date de l'édition *</label>
                    <input type="date" required value={bilanForm.date} onChange={e => setBilanForm({...bilanForm, date: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#0065FF] transition-all text-[#081031] dark:text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-green-600 ml-2">Recettes (€)</label>
                      <input type="number" step="0.01" required value={bilanForm.revenue} onChange={e => setBilanForm({...bilanForm, revenue: e.target.value})} className="w-full bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 p-4 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-green-500 text-green-700 dark:text-green-400 transition-all" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-red-500 ml-2">Dépenses (€)</label>
                      <input type="number" step="0.01" required value={bilanForm.cost} onChange={e => setBilanForm({...bilanForm, cost: e.target.value})} className="w-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-red-500 text-red-600 dark:text-red-400 transition-all" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="pt-6 flex gap-3">
                    <button type="button" onClick={() => setIsBilanModalOpen(false)} className="flex-1 py-4 bg-slate-100 dark:bg-white/5 rounded-2xl font-black uppercase text-xs text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">Annuler</button>
                    <button type="submit" className="flex-1 py-4 bg-[#0065FF] text-white rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0065FF]/30 hover:scale-105 transition-transform"><Save size={16}/> Enregistrer</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* MODALE ÉDITEUR DE MENU DA AVEC COMBOBOX ET CONSTRUCTEUR DE VARIANTES */}
          {isMenuModalOpen && currentMenu && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-[#0f172a] w-full max-w-5xl max-h-[95vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95">
                
                <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-[#081031]">
                  <h3 className="text-2xl font-[900] italic uppercase text-white flex items-center gap-3">
                    <Pizza className="text-[#F72585]" size={28} />
                    <span>Éditeur de <span className="text-[#F72585]">Menu</span></span>
                  </h3>
                  <button onClick={() => setIsMenuModalOpen(false)} className="p-2 text-white/50 hover:text-white bg-white/5 rounded-full"><X size={20} /></button>
                </div>
                
                <div className="p-6 lg:p-8 overflow-y-auto flex-1 space-y-10 bg-slate-50 dark:bg-[#040817]">
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-4xl mx-auto">
                    
                    {/* COMBOBOX POUR SÉLECTIONNER UN TOURNOI EXISTANT POUR LE MENU */}
                    <div className="md:col-span-6 space-y-2 relative">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Lier à un événement *</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          required 
                          value={currentMenu.title} 
                          onChange={e => { setCurrentMenu({...currentMenu, title: e.target.value}); setIsMenuEventDropdownOpen(true); }}
                          onFocus={() => setIsMenuEventDropdownOpen(true)}
                          onBlur={() => setTimeout(() => setIsMenuEventDropdownOpen(false), 200)}
                          className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-black text-lg uppercase italic outline-none focus:border-[#F72585] text-[#081031] dark:text-white transition-all shadow-sm" 
                          placeholder="Rechercher un tournoi..." 
                        />
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                        
                        {isMenuEventDropdownOpen && dbEvents.length > 0 && (
                          <div className="absolute top-full left-0 w-full mt-2 max-h-48 overflow-y-auto bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 hide-scrollbar py-2">
                            {dbEvents.filter(e => e.title.toLowerCase().includes(currentMenu.title.toLowerCase())).map(evt => (
                              <div 
                                key={evt._id} 
                                onClick={() => { setCurrentMenu({...currentMenu, title: evt.title}); setIsMenuEventDropdownOpen(false); }}
                                className="px-4 py-3 text-sm font-bold cursor-pointer hover:bg-[#F72585]/10 hover:text-[#F72585] transition-colors text-[#081031] dark:text-white uppercase italic truncate"
                              >
                                {evt.title}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-3 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Année / Édition</label>
                      <input type="text" value={currentMenu.edition || ''} onChange={e => setCurrentMenu({...currentMenu, edition: e.target.value})} className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-black text-lg uppercase italic outline-none focus:border-[#F72585] text-[#F72585] transition-all shadow-sm" placeholder="Ex: 2026" />
                    </div>

                    <div className="md:col-span-3 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Couleur du Titre</label>
                      <div className="flex gap-2">
                        <input type="color" value={currentMenu.color || '#F72585'} onChange={e => setCurrentMenu({...currentMenu, color: e.target.value})} className="h-[56px] w-14 rounded-2xl border-0 bg-transparent p-0 cursor-pointer" />
                        <input type="text" value={currentMenu.color || '#F72585'} onChange={e => setCurrentMenu({...currentMenu, color: e.target.value})} className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm uppercase outline-none focus:border-[#F72585] text-[#081031] dark:text-white transition-all shadow-sm" />
                      </div>
                    </div>

                  </div>

                  <div className="bg-white dark:bg-[#0f172a] p-6 lg:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#0065FF]/10 rounded-full blur-[40px] pointer-events-none"></div>
                    <h4 className="font-black uppercase text-sm mb-6 flex items-center gap-2 text-[#081031] dark:text-white relative z-10"><Plus size={18} className="text-[#0065FF]"/> Ajouter un produit au menu</h4>
                    
                    <div className="flex flex-col gap-4 relative z-10">
                      
                      <div className="flex flex-col lg:flex-row gap-4">
                        <select 
                          value={menuItemForm.category} 
                          onChange={e => setMenuItemForm({...menuItemForm, category: e.target.value})} 
                          className="bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-xl font-bold text-sm outline-none text-[#081031] dark:text-white cursor-pointer lg:w-1/4"
                        >
                          <option value="Le Salé">Le Salé</option>
                          <option value="Le Sucré">Le Sucré</option>
                          <option value="Rafraichissements">Rafraichissements</option>
                        </select>
                        <input 
                          type="text" 
                          placeholder="Nom du produit (ex: PANINI)" 
                          value={menuItemForm.name} 
                          onChange={e => setMenuItemForm({...menuItemForm, name: e.target.value})} 
                          className="flex-1 bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-xl font-bold text-sm outline-none text-[#081031] dark:text-white focus:ring-2 focus:ring-[#0065FF]" 
                        />
                        <input 
                          type="number" 
                          placeholder="Prix €" 
                          step="0.5" 
                          value={menuItemForm.price} 
                          onChange={e => setMenuItemForm({...menuItemForm, price: e.target.value})} 
                          className="lg:w-32 bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-xl font-bold text-sm outline-none text-[#081031] dark:text-white focus:ring-2 focus:ring-[#0065FF]" 
                        />
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-[#040817] p-4 lg:p-5 rounded-[1.5rem] border border-slate-200 dark:border-white/10">
                        <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">Variantes / Ingrédients (Optionnel)</h5>
                        
                        {menuItemForm.variants.length > 0 && (
                          <ul className="mb-4 space-y-2">
                            {menuItemForm.variants.map((v, idx) => (
                              <li key={idx} className="flex justify-between items-center bg-white dark:bg-[#0f172a] px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 text-xs font-bold text-[#081031] dark:text-white">
                                <span>{v.name}</span>
                                <div className="flex items-center gap-4">
                                  {v.price != null && !isNaN(v.price) && <span className="text-[#0065FF] dark:text-[#0EE2E2]">+{Number(v.price).toFixed(2)}€</span>}
                                  <button type="button" onClick={() => handleRemoveVariant(idx)} className="text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-500/10 p-1.5 rounded-lg transition-colors"><Trash2 size={14}/></button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                          <input 
                            type="text" 
                            placeholder="Nom (ex: 3 fromages, Supplément Chantilly)" 
                            value={variantForm.name} 
                            onChange={e => setVariantForm({...variantForm, name: e.target.value})} 
                            className="flex-1 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-3.5 rounded-xl font-bold text-xs outline-none text-[#081031] dark:text-white focus:ring-2 focus:ring-[#0065FF]" 
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddVariant())} 
                          />
                          <input 
                            type="number" 
                            placeholder="+ Prix € (Optionnel)" 
                            step="0.5" 
                            value={variantForm.price} 
                            onChange={e => setVariantForm({...variantForm, price: e.target.value})} 
                            className="w-full sm:w-48 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-3.5 rounded-xl font-bold text-xs outline-none text-[#081031] dark:text-white focus:ring-2 focus:ring-[#0065FF]" 
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddVariant())} 
                          />
                          <button 
                            type="button" 
                            onClick={handleAddVariant} 
                            disabled={!variantForm.name} 
                            className="bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white px-6 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-300 dark:hover:bg-white/20 transition-colors disabled:opacity-50 shrink-0"
                          >
                            Ajouter
                          </button>
                        </div>
                      </div>

                      <button 
                        type="button" 
                        onClick={handleAddMenuItem} 
                        className="w-full bg-[#0065FF] text-white px-8 py-4 rounded-xl font-black uppercase text-xs hover:bg-[#081031] dark:hover:bg-[#0EE2E2] dark:hover:text-[#081031] transition-colors shadow-lg flex items-center justify-center gap-2 mt-2"
                      >
                        <Plus size={16}/> Valider ce produit
                      </button>

                    </div>
                  </div>

                  <div>
                    <h4 className="font-black uppercase tracking-[0.2em] text-xs text-slate-500 mb-6 text-center">Aperçu des Catégories</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {['Le Salé', 'Le Sucré', 'Rafraichissements'].map(cat => {
                        const catItems = currentMenu.items.filter(i => i.category === cat);
                        
                        let catColor = "text-[#081031]";
                        let catBorder = "border-slate-200";
                        if (cat === 'Le Salé') { catColor = "text-teal-500"; catBorder = "border-teal-500/30"; }
                        if (cat === 'Le Sucré') { catColor = "text-fuchsia-500"; catBorder = "border-fuchsia-500/30"; }
                        if (cat === 'Rafraichissements') { catColor = "text-amber-500"; catBorder = "border-amber-500/30"; }

                        return (
                          <div key={cat} className={`bg-white dark:bg-[#081031] border-2 ${catBorder} rounded-[2rem] p-6 shadow-sm`}>
                            <h5 className={`flex items-center gap-2 font-black italic uppercase ${catColor} text-xl mb-4 border-b-2 border-slate-100 dark:border-white/5 pb-3`}>
                              {cat}
                            </h5>
                            <ul className="space-y-4">
                              {catItems.map((item, idx) => (
                                <li key={idx} className="flex flex-col group">
                                  <div className="flex justify-between items-end text-sm font-bold text-[#081031] dark:text-slate-300 w-full">
                                    <span className="truncate pr-2">{item.name}</span>
                                    <div className="flex-1 border-b border-dotted border-slate-300 dark:border-slate-600 mb-1 mx-2 opacity-50"></div>
                                    <div className="flex items-center gap-3 shrink-0">
                                      <span className={`font-black ${catColor} text-base`}>{item.price.toFixed(2)}€</span>
                                      <button onClick={() => {
                                        const newItems = [...currentMenu.items];
                                        newItems.splice(currentMenu.items.indexOf(item), 1);
                                        setCurrentMenu({...currentMenu, items: newItems});
                                      }} className="text-red-500 bg-red-50 dark:bg-red-500/10 p-1.5 rounded-md hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={14}/></button>
                                    </div>
                                  </div>
                                  
                                  {Array.isArray(item.variants) && item.variants.length > 0 && (
                                    <ul className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1.5 pl-2 border-l-2 border-slate-200 dark:border-white/10 space-y-1">
                                      {item.variants.map((v, vIdx) => (
                                        <li key={vIdx} className="flex justify-between items-center">
                                          <span>- {v.name}</span>
                                          {v.price != null && !isNaN(v.price) && <span className="font-bold text-[#0065FF] dark:text-[#0EE2E2]">+{Number(v.price).toFixed(2)}€</span>}
                                        </li>
                                      ))}
                                    </ul>
                                  )}

                                  {typeof item.variants === 'string' && item.variants && (
                                    <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1 pl-2 border-l-2 border-slate-200 dark:border-white/10 whitespace-pre-wrap">
                                      {item.variants}
                                    </div>
                                  )}
                                </li>
                              ))}
                              {catItems.length === 0 && <li className="text-xs font-bold text-slate-400 italic">Vide</li>}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="p-6 lg:p-8 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] flex justify-end gap-4 shrink-0">
                   <button onClick={() => setIsMenuModalOpen(false)} className="px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Annuler</button>
                   <button onClick={saveMenu} disabled={!currentMenu.title} className="bg-[#F72585] text-white px-10 py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(247,37,133,0.4)] hover:scale-105 transition-transform disabled:opacity-50"><Save size={18}/> Enregistrer le Menu</button>
                </div>
              </div>
            </div>
          )}

        </>
      )}

    </div>
  );
}