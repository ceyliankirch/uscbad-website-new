'use client';
import React, { useState, useEffect } from 'react';
import { 
  Coffee, ShoppingCart, FileText, BarChart3, Plus, 
  Trash2, Printer, CheckCircle2, Circle, DollarSign, 
  TrendingUp, Pizza, Calendar, Save, X, Edit, Eye, Loader2,
  Flame, Snowflake, Star, Utensils
} from 'lucide-react';

export default function BuvetteDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // --- ÉTATS ---
  const [tournaments, setTournaments] = useState([]);
  const [isBilanModalOpen, setIsBilanModalOpen] = useState(false);
  const [bilanForm, setBilanForm] = useState({ name: '', date: '', revenue: '', cost: '' });

  const [menus, setMenus] = useState([]);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [viewingMenu, setViewingMenu] = useState(null);

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
      const [bilansRes, menusRes, shoppingRes] = await Promise.all([
        fetch('/api/buvette/bilans'),
        fetch('/api/buvette/menus'),
        fetch('/api/buvette/shopping')
      ]);
      const bData = await bilansRes.json();
      const mData = await menusRes.json();
      const sData = await shoppingRes.json();

      if (bData.success) setTournaments(bData.data);
      if (mData.success) setMenus(mData.data);
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

  // --- CALCULS STATISTIQUES ---
  const totalRevenue = tournaments.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalCost = tournaments.reduce((acc, curr) => acc + curr.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const avgProfit = tournaments.length > 0 ? (totalProfit / tournaments.length).toFixed(0) : 0;
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
    if(window.confirm("Supprimer ce bilan ?")) {
      await fetch(`/api/buvette/bilans/${id}`, { method: 'DELETE' });
      fetchBuvetteData();
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
      setCurrentMenu({ title: 'Nouveau Menu', items: [] });
    }
    setIsMenuModalOpen(true);
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

  // Helpers pour le design du menu
  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Boissons': return <Coffee size={24} className="text-[#0EE2E2] drop-shadow-md" />;
      case 'Chaud': return <Flame size={24} className="text-[#F72585] drop-shadow-md" />;
      case 'Froid': return <Snowflake size={24} className="text-[#0065FF] drop-shadow-md" />;
      case 'Sucré': return <Star size={24} className="text-[#FFD500] drop-shadow-md" />;
      default: return <Utensils size={24} className="text-slate-400" />;
    }
  };

  if (isLoadingData) return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-[#F72585]" size={48} /></div>;

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
            <BarChart3 size={14} /> Tableau de Bord
          </button>
          <button onClick={() => setActiveTab('menus')} className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 ${activeTab === 'menus' ? 'bg-[#F72585] text-white shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>
            <Pizza size={14} /> Menus & Tarifs
          </button>
          <button onClick={() => setActiveTab('courses')} className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 ${activeTab === 'courses' ? 'bg-[#0065FF] text-white shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>
            <ShoppingCart size={14} /> Liste de Courses
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ONGLET 1 : TABLEAU DE BORD (FINANCES)                     */}
      {/* ========================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 print:hidden">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2rem] border border-slate-100 dark:border-white/10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><DollarSign size={80} /></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Chiffre d'Affaires Total</p>
              <h3 className="text-4xl font-[900] text-[#081031] dark:text-white">{totalRevenue.toFixed(2)}€</h3>
            </div>
            <div className="bg-gradient-to-br from-[#0065FF] to-[#0EE2E2] p-6 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform"><TrendingUp size={80} /></div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-white/80">Bénéfice Net Total</p>
              <h3 className="text-4xl font-[900]">{totalProfit.toFixed(2)}€</h3>
            </div>
            <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2rem] border border-slate-100 dark:border-white/10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><BarChart3 size={80} /></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Marge Moyenne</p>
              <h3 className="text-4xl font-[900] text-[#F72585]">{globalMargin}%</h3>
            </div>
            <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2rem] border border-slate-100 dark:border-white/10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Coffee size={80} /></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Bénéfice Moyen / Tournoi</p>
              <h3 className="text-4xl font-[900] text-[#081031] dark:text-white">{avgProfit}€</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white dark:bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-sm flex flex-col">
              <h3 className="text-xl font-[900] italic uppercase text-[#081031] dark:text-white mb-8">Évolution <span className="text-[#0065FF]">Bénéfices</span></h3>
              <div className="flex-1 flex items-end gap-3 h-48 mt-auto">
                {tournaments.length === 0 ? <p className="text-slate-400 text-sm font-bold w-full text-center">Aucune donnée.</p> : tournaments.slice().reverse().map((t, i) => {
                  const height = t.revenue > 0 ? ((t.revenue - t.cost) / Math.max(...tournaments.map(x => x.revenue - x.cost))) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full bg-[#0065FF]/20 rounded-t-xl relative flex items-end justify-center transition-all group-hover:bg-[#0065FF]/30" style={{ height: `${height}%`, minHeight: '10%' }}>
                         <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-[#081031] text-white px-2 py-1 rounded-md">{(t.revenue - t.cost).toFixed(2)}€</div>
                         <div className="w-full bg-[#0065FF] rounded-t-xl transition-all" style={{ height: '100%' }}></div>
                      </div>
                      <span className="text-[8px] font-black uppercase text-slate-400 truncate max-w-[50px]">{t.name.substring(0,6)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-[900] italic uppercase text-[#081031] dark:text-white">Historique des <span className="text-[#0EE2E2]">Tournois</span></h3>
                <button onClick={() => setIsBilanModalOpen(true)} className="bg-[#081031] dark:bg-white text-white dark:text-[#081031] px-4 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:scale-105 transition-transform shadow-lg">
                  <Plus size={14} /> Ajouter
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-100 dark:border-white/5">
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Événement</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Recettes</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Dépenses</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-[#0065FF]">Bénéfice</th>
                      <th className="pb-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                    {tournaments.length === 0 && <tr><td colSpan="6" className="py-8 text-center text-slate-400 font-bold text-sm">Aucun bilan enregistré.</td></tr>}
                    {tournaments.map(t => (
                      <tr key={t._id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 font-bold text-sm text-[#081031] dark:text-white">{t.name}</td>
                        <td className="py-4 text-xs font-medium text-slate-500">{new Date(t.date).toLocaleDateString('fr-FR')}</td>
                        <td className="py-4 text-sm font-bold text-green-600">+{t.revenue}€</td>
                        <td className="py-4 text-sm font-bold text-red-500">-{t.cost}€</td>
                        <td className="py-4 text-sm font-black text-[#0065FF]">{(t.revenue - t.cost).toFixed(2)}€</td>
                        <td className="py-4 text-right">
                          <button onClick={() => deleteBilan(t._id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
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
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Design Premium prêt pour l'impression.</p>
            </div>
            <button onClick={() => openMenuBuilder()} className="relative z-10 bg-[#F72585] text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(247,37,133,0.4)]">
              <Plus size={18} /> Créer un Menu
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {menus.length === 0 && <div className="col-span-full py-10 text-center text-slate-500 font-bold uppercase tracking-widest">Aucun menu sauvegardé.</div>}
            {menus.map(menu => (
              <div key={menu._id} className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-[#0065FF]/30 transition-all flex flex-col group relative overflow-hidden">
                <button onClick={() => deleteMenu(menu._id)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20"><Trash2 size={16}/></button>
                
                <div className="h-32 bg-[#081031] p-6 relative flex items-end">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#0EE2E2]/20 blur-[40px] rounded-full pointer-events-none"></div>
                  <h4 className="text-2xl font-[900] uppercase italic text-white truncate relative z-10 w-10/12">{menu.title}</h4>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    <Utensils size={14} className="text-[#0065FF]" /> {menu.items.length} articles référencés
                  </p>
                  
                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <button onClick={() => setViewingMenu(menu)} className="flex items-center justify-center gap-2 py-3.5 bg-[#0065FF]/10 text-[#0065FF] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0065FF] hover:text-white transition-colors">
                      <Printer size={14} /> Imprimer
                    </button>
                    <button onClick={() => openMenuBuilder(menu)} className="flex items-center justify-center gap-2 py-3.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-[#081031] dark:hover:text-white transition-colors">
                      <Edit size={14} /> Éditer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VUE "AFFICHER/IMPRIMER LE MENU" (DA PREMIUM)              */}
      {/* ========================================================= */}
      {viewingMenu && (
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-[#040817]/95 backdrop-blur-md print:bg-white print:static print:block animate-in zoom-in-95 duration-300">
          
          <div className="print:hidden sticky top-0 z-50 flex justify-between items-center p-6 bg-[#081031]/80 backdrop-blur-lg border-b border-white/10 shadow-2xl">
            <div className="flex items-center gap-4 text-white">
              <button onClick={() => setViewingMenu(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
              <div>
                <h3 className="font-[900] uppercase italic text-lg leading-none">Aperçu Avant Impression</h3>
                <p className="text-[10px] font-bold text-[#0EE2E2] uppercase tracking-widest">Format A4 - Prêt à être affiché</p>
              </div>
            </div>
            <button onClick={printMenu} className="bg-[#0065FF] hover:bg-[#0EE2E2] hover:text-[#081031] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(0,101,255,0.4)] transition-all">
              <Printer size={18} /> Lancer l'impression
            </button>
          </div>

          {/* ZONE D'IMPRESSION (Feuille A4) */}
          <div className="bg-white text-[#081031] my-10 mx-auto shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden font-['Montserrat'] print:shadow-none print:my-0" 
               style={{ width: '210mm', minHeight: '297mm', padding: '15mm', WebkitPrintColorAdjust: 'exact', colorAdjust: 'exact' }}>
            
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[#0065FF] opacity-10 rounded-full blur-[40px] pointer-events-none"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-[#F72585] opacity-10 rounded-full blur-[40px] pointer-events-none"></div>

            <div className="text-center mb-12 relative z-10 border-b-[6px] border-[#081031] pb-6 flex flex-col items-center">
              <div className="bg-[#081031] text-white px-6 py-2 rounded-full font-[900] uppercase tracking-widest text-xs mb-6 shadow-md inline-flex items-center gap-2">
                <Utensils size={14}/> US Créteil Badminton
              </div>
              <h1 className="text-6xl font-[900] uppercase italic tracking-tighter text-[#081031] leading-none mb-2">
                LA <span className="text-[#0065FF]">BUVETTE</span>
              </h1>
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-[#F72585]">{viewingMenu.title}</h2>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-10 relative z-10">
              {['Boissons', 'Chaud', 'Froid', 'Sucré'].map(cat => {
                const catItems = viewingMenu.items.filter(i => i.category === cat);
                if (catItems.length === 0) return null;
                return (
                  <div key={cat} className="space-y-5">
                    <div className="flex items-center gap-3 border-b-2 border-slate-200 pb-2">
                      {getCategoryIcon(cat)}
                      <h3 className="text-2xl font-[900] uppercase italic text-[#081031] tracking-tight">{cat}</h3>
                    </div>
                    <ul className="space-y-4">
                      {catItems.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-end gap-2 w-full">
                          <span className="text-base font-bold leading-tight max-w-[70%]">{item.name}</span>
                          <div className="flex-1 border-b-[3px] border-dotted border-slate-300 mb-1.5 opacity-50"></div>
                          <span className="text-lg font-[900] text-[#0065FF] shrink-0 bg-white pl-1">{item.price.toFixed(2)}€</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            
            <div className="absolute bottom-[15mm] left-[15mm] right-[15mm] pt-6 border-t-2 border-slate-200 flex justify-between items-center z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">L'abus d'alcool est dangereux pour la santé.</p>
              <div className="flex items-center gap-2 bg-[#081031] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider">
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

      {/* MODALE AJOUT BILAN FINANCIER (Rétablie et restylée) */}
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
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Nom de l'événement</label>
                <input type="text" required value={bilanForm.name} onChange={e => setBilanForm({...bilanForm, name: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#0065FF] transition-all text-[#081031] dark:text-white" placeholder="Ex: Tournoi de rentrée" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Date</label>
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
      
      {/* MODALE ÉDITEUR DE MENU DA */}
      {isMenuModalOpen && currentMenu && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#0f172a] w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95">
            
            <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-[#081031]">
              <h3 className="text-2xl font-[900] italic uppercase text-white flex items-center gap-3">
                <Pizza className="text-[#F72585]" size={28} />
                <span>Création de <span className="text-[#F72585]">Menu</span></span>
              </h3>
              <button onClick={() => setIsMenuModalOpen(false)} className="p-2 text-white/50 hover:text-white bg-white/5 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="p-6 lg:p-8 overflow-y-auto flex-1 space-y-10 bg-slate-50 dark:bg-[#040817]">
              
              <div className="space-y-2 max-w-lg mx-auto text-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Titre affiché sur le menu</label>
                <input type="text" value={currentMenu.title} onChange={e => setCurrentMenu({...currentMenu, title: e.target.value})} className="w-full bg-white dark:bg-[#0f172a] border-2 border-slate-200 dark:border-white/10 p-5 rounded-2xl font-black text-2xl uppercase italic text-center outline-none focus:border-[#F72585] text-[#081031] dark:text-white transition-all shadow-sm" placeholder="EX: TOURNOI DES JEUNES 2026" />
              </div>

              <div className="bg-white dark:bg-[#0f172a] p-6 lg:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0065FF]/10 rounded-full blur-[40px] pointer-events-none"></div>
                <h4 className="font-black uppercase text-sm mb-6 flex items-center gap-2 text-[#081031] dark:text-white relative z-10"><Plus size={18} className="text-[#0065FF]"/> Ajouter un produit</h4>
                
                <div className="flex flex-col lg:flex-row gap-4 relative z-10">
                  <select id="newMenuItemCat" className="bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-xl font-bold text-sm outline-none text-[#081031] dark:text-white cursor-pointer lg:w-1/4">
                    <option value="Boissons">Boissons</option>
                    <option value="Chaud">Chaud</option>
                    <option value="Froid">Froid</option>
                    <option value="Sucré">Sucré</option>
                  </select>
                  <input type="text" id="newMenuItemName" placeholder="Nom complet (ex: Coca-Cola 33cl)" className="flex-1 bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-xl font-bold text-sm outline-none text-[#081031] dark:text-white focus:ring-2 focus:ring-[#0065FF]" />
                  <input type="number" id="newMenuItemPrice" placeholder="Prix €" step="0.5" className="lg:w-32 bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-xl font-bold text-sm outline-none text-[#081031] dark:text-white focus:ring-2 focus:ring-[#0065FF]" />
                  <button type="button" onClick={() => {
                    const cat = document.getElementById('newMenuItemCat').value;
                    const name = document.getElementById('newMenuItemName').value;
                    const price = parseFloat(document.getElementById('newMenuItemPrice').value);
                    if(name && !isNaN(price)) {
                      setCurrentMenu({...currentMenu, items: [...currentMenu.items, {category: cat, name, price}]});
                      document.getElementById('newMenuItemName').value = '';
                      document.getElementById('newMenuItemPrice').value = '';
                    }
                  }} className="bg-[#0065FF] text-white px-8 py-4 rounded-xl font-black uppercase text-xs hover:bg-[#081031] dark:hover:bg-[#0EE2E2] dark:hover:text-[#081031] transition-colors shadow-lg">Ajouter</button>
                </div>
              </div>

              <div>
                <h4 className="font-black uppercase tracking-[0.2em] text-xs text-slate-500 mb-6 text-center">Aperçu des catégories</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  {['Boissons', 'Chaud', 'Froid', 'Sucré'].map(cat => {
                    const catItems = currentMenu.items.filter(i => i.category === cat);
                    if (catItems.length === 0) return null;
                    return (
                      <div key={cat} className="bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 shadow-sm">
                        <h5 className="flex items-center gap-2 font-black italic uppercase text-[#081031] dark:text-white text-xl mb-4 border-b-2 border-slate-100 dark:border-white/5 pb-3">
                          {getCategoryIcon(cat)} {cat}
                        </h5>
                        <ul className="space-y-4">
                          {catItems.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-end text-sm font-bold text-[#081031] dark:text-slate-300 group">
                              <span className="truncate pr-2">{item.name}</span>
                              <div className="flex-1 border-b border-dotted border-slate-300 dark:border-slate-600 mb-1 mx-2"></div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="font-black text-[#0065FF] dark:text-[#0EE2E2] text-base">{item.price.toFixed(2)}€</span>
                                <button onClick={() => {
                                  const newItems = [...currentMenu.items];
                                  newItems.splice(currentMenu.items.indexOf(item), 1);
                                  setCurrentMenu({...currentMenu, items: newItems});
                                }} className="text-red-500 bg-red-50 dark:bg-red-500/10 p-1.5 rounded-md hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={14}/></button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 lg:p-8 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] flex justify-end gap-4 shrink-0">
               <button onClick={() => setIsMenuModalOpen(false)} className="px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Annuler</button>
               <button onClick={saveMenu} className="bg-[#F72585] text-white px-10 py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(247,37,133,0.4)] hover:scale-105 transition-transform"><Save size={18}/> Enregistrer le Menu</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}