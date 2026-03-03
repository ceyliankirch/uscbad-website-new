'use client';
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { 
  Plus, Pencil, Trash2, X, Newspaper, Loader2, Image as ImageIcon, 
  Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, 
  Undo, Redo, Save, ArrowLeft, Search, Filter, TrendingUp, Users, Calendar
} from 'lucide-react';

// --- COMPOSANT BARRE D'OUTILS TIPTAP (Reste inchangé) ---
const MenuBar = ({ editor }) => {
  if (!editor) return null;
  const btnClass = (active) => `p-2 rounded-lg transition-colors ${active ? 'bg-[#0EE2E2] text-[#081031]' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10'}`;

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 shrink-0">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}><Bold size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}><Italic size={18} /></button>
      <div className="w-[1px] h-6 bg-slate-300 dark:bg-white/20 mx-1 self-center" />
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))}><Heading1 size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}><Heading2 size={18} /></button>
      <div className="w-[1px] h-6 bg-slate-300 dark:bg-white/20 mx-1 self-center" />
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}><List size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}><ListOrdered size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))}><Quote size={18} /></button>
      <input type="color" onInput={e => editor.chain().focus().setColor(e.target.value).run()} className="w-8 h-8 p-1 cursor-pointer bg-transparent border-0" />
      <div className="flex-1" />
      <button onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)}><Undo size={18} /></button>
      <button onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)}><Redo size={18} /></button>
    </div>
  );
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const defaultForm = { title: '', category: 'ÉVÉNEMENT', excerpt: '', content: '', imageUrl: '', author: 'Le Bureau' };
  const [formData, setFormData] = useState(defaultForm);

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color],
    content: '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      if (data.success) setArticles(data.data);
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchArticles(); }, []);

  const openEditor = (article = null) => {
    if (article) {
      setEditingId(article._id);
      setFormData(article);
      editor?.commands.setContent(article.content);
    } else {
      setEditingId(null);
      setFormData(defaultForm);
      editor?.commands.setContent('');
    }
    setIsEditorOpen(true);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const url = editingId ? `/api/articles/${editingId}` : '/api/articles';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.success) { fetchArticles(); setIsEditorOpen(false); }
    } catch (error) { console.error(error); } finally { setIsSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet article ?')) return;
    await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    fetchArticles();
  };

  const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // --- VUE LISTE PRINCIPALE ---
  if (!isEditorOpen) {
    return (
      <div className="animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-20 px-6">
        
        {/* HEADER STATS (Reste inchangé) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pt-10">
          <div>
            <h1 className="text-5xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 tracking-tighter leading-none">
              GAZETTE DU <span className="text-[#0EE2E2]">CLUB</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em]">Gérer les actualités et récits de matchs</p>
          </div>
          <button onClick={() => openEditor()} className="bg-[#081031] dark:bg-white text-white dark:text-[#081031] px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-xl hover:scale-105 transition-all active:scale-95">
            <Plus size={20} /> Nouvel Article
          </button>
        </div>

        {/* DASHBOARD CARDS (Reste inchangé) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 flex items-center gap-6 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#0065FF]/10 text-[#0065FF] flex items-center justify-center"><TrendingUp /></div>
            <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Articles</p><p className="text-2xl font-black">{articles.length}</p></div>
          </div>
          <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 flex items-center gap-6 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#0EE2E2]/10 text-[#0EE2E2] flex items-center justify-center"><Users /></div>
            <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Auteur principal</p><p className="text-2xl font-black">Le Bureau</p></div>
          </div>
          <div className="relative group bg-[#0EE2E2] p-6 rounded-[2rem] text-[#081031] flex items-center gap-6 shadow-lg overflow-hidden">
            <div className="z-10 w-14 h-14 rounded-2xl bg-white/30 flex items-center justify-center"><Newspaper /></div>
            <div className="z-10"><p className="text-xs font-black uppercase tracking-widest opacity-60">Dernier article le</p><p className="text-2xl font-black">{articles[0] ? new Date(articles[0].createdAt).toLocaleDateString('fr-FR') : '--'}</p></div>
            <Newspaper className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10 rotate-12" />
          </div>
        </div>

        {/* FILTRES & RECHERCHE (Reste inchangé) */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Rechercher par titre..." 
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#0EE2E2] font-bold"
            />
          </div>
        </div>

        {/* LISTE DES CARDS - LE JUSTE MILIEU (FORMAT COMPACT PRO) */}
        {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0EE2E2]" size={40} /></div>
        ) : (
        /* Grille de 4 colonnes sur desktop pour des cards bien proportionnées */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArticles.map(article => (
            <div key={article._id} className="group relative bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1.5 flex flex-col">
                
                {/* LISERET BLEU USC */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0065FF] z-20"></div>

                {/* IMAGE CARD - FORMAT 16/9 (PROPRE ET COMPACT) */}
                <div className="aspect-video relative overflow-hidden bg-slate-100 shrink-0 border-b border-slate-100 dark:border-white/5">
                {article.imageUrl ? (
                    <img src={article.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50"><ImageIcon size={28} /></div>
                )}
                
                {/* BADGE CATEGORY - DISCRET */}
                <div className="absolute top-4 right-4 bg-white/95 dark:bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-[8px] font-[900] uppercase tracking-[0.2em] shadow-sm z-10 border border-white/10 text-[#081031] dark:text-white">
                    {article.category}
                </div>
                </div>

                {/* CONTENT CARD - ESPACEMENT ÉQUILIBRÉ */}
                <div className="p-5 flex flex-col flex-1 bg-white dark:bg-[#0f172a]">
                <div className="mb-3">
                    {/* TITRE - TAILLE MOYENNE (text-lg) */}
                    <h3 className="text-lg font-[900] uppercase italic text-[#081031] dark:text-white leading-tight line-clamp-2 group-hover:text-[#0065FF] transition-colors">
                    {article.title}
                    </h3>
                    {/* RÉSUMÉ - TAILLE FINE (text-[12px]) */}
                    <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {article.excerpt}
                    </p>
                </div>
                
                {/* FOOTER - COMPACT */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 mt-auto">
                    <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Actu USC</span>
                    <span className="text-[11px] font-bold text-[#081031] dark:text-white">
                        {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    </div>
                    
                    <div className="flex gap-1.5">
                    <button onClick={() => openEditor(article)} className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl hover:bg-[#0EE2E2] hover:text-[#081031] transition-all shadow-sm active:scale-90">
                        <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(article._id)} className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90">
                        <Trash2 size={15} />
                    </button>
                    </div>
                </div>
                </div>
            </div>
            ))}
        </div>
        )}
      </div>
    );
  }

  // --- VUE ÉDITEUR PLEIN ÉCRAN (Reste inchangée mais rappelée pour code complet) ---
  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-[#081031] flex flex-col animate-in slide-in-from-right duration-500">
      <div className="h-20 border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-8 bg-white dark:bg-[#081031] shrink-0">
        <button onClick={() => setIsEditorOpen(false)} className="flex items-center gap-3 font-black uppercase text-xs tracking-widest text-slate-400 hover:text-[#081031] dark:hover:text-white transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Retour au Dashboard
        </button>
        <div className="flex gap-4">
          <button onClick={handleSubmit} disabled={isSaving} className="bg-[#0EE2E2] text-[#081031] px-10 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all">
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={18} />} Publier l'actualité
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto py-16 px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Colonne Gauche : Contenu */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0065FF] ml-2">Titre de l'article *</label>
              <input 
                type="text" placeholder="EX: RETOUR À DOMICILE..." 
                className="w-full bg-transparent text-5xl font-[900] uppercase italic outline-none border-b-4 border-transparent focus:border-[#0EE2E2] pb-4 transition-colors"
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0065FF] ml-2">Accroche / Résumé court *</label>
              <textarea 
                value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-[#0EE2E2] resize-none" 
                rows="3" placeholder="L'équipe 1 de retour à domicile..." 
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0065FF] ml-2">Corps de l'article (Éditeur complet) *</label>
              <div className="border border-slate-200 dark:border-white/10 rounded-[2rem] overflow-hidden bg-white dark:bg-black/20 shadow-inner flex flex-col min-h-[600px]">
                <MenuBar editor={editor} />
                <div className="p-10 flex-1 prose dark:prose-invert prose-slate max-w-none focus:outline-none min-h-[500px]">
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>
          </div>

          {/* Colonne Droite : Médias & Catégories */}
          <div className="space-y-8">
             <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 space-y-8 sticky top-10">
                <h4 className="font-black uppercase italic text-sm border-b border-slate-200 dark:border-white/10 pb-4">Configuration</h4>
                
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Image de couverture (Max 2Mo)</label>
                  <div className="aspect-[4/3] rounded-2xl bg-slate-200 dark:bg-white/5 overflow-hidden relative group border border-dashed border-slate-400 dark:border-white/20">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                        <ImageIcon size={32} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Choisir une image</span>
                      </div>
                    )}
                    <input type="file" onChange={e => {
                      const file = e.target.files[0];
                      if(file && file.size < 2*1024*1024) {
                        const reader = new FileReader();
                        reader.onloadend = () => setFormData({...formData, imageUrl: reader.result});
                        reader.readAsDataURL(file);
                      } else { alert("Image trop lourde !"); }
                    }} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Catégorie</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-4 text-xs font-bold focus:border-[#0EE2E2] outline-none">
                    <option value="ÉVÉNEMENT">ÉVÉNEMENT</option>
                    <option value="COMPÉTITION">COMPÉTITION</option>
                    <option value="CLUB">VIE DU CLUB</option>
                    <option value="JEUNES">JEUNES</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Auteur</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full bg-white dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-4 text-xs font-bold focus:border-[#0EE2E2] outline-none" />
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Composant icône User manquant dans les imports lucide
const User = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);