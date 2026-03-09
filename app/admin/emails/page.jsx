'use client';
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { 
  Send, Mail, Users, CheckCircle, AlertCircle, Loader2, Sparkles,
  Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Undo, Redo,
  History, ExternalLink, Edit3, ArrowLeft, Eye, X, Calendar
} from 'lucide-react';

// --- COMPOSANT BARRE D'OUTILS TIPTAP ---
const MenuBar = ({ editor }) => {
  if (!editor) return null;
  const btnClass = (active) => `p-2 rounded-lg transition-colors ${active ? 'bg-[#0065FF] text-white dark:bg-[#0EE2E2] dark:text-[#081031]' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10'}`;

  return (
    <div className="flex flex-wrap gap-1 p-3 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 shrink-0 rounded-t-[2rem]">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}><Bold size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}><Italic size={18} /></button>
      <div className="w-[1px] h-6 bg-slate-300 dark:bg-white/20 mx-1 self-center" />
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))}><Heading1 size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}><Heading2 size={18} /></button>
      <div className="w-[1px] h-6 bg-slate-300 dark:bg-white/20 mx-1 self-center" />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}><List size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}><ListOrdered size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))}><Quote size={18} /></button>
      <input type="color" onInput={e => editor.chain().focus().setColor(e.target.value).run()} className="w-8 h-8 p-1 cursor-pointer bg-transparent border-0 ml-2 self-center" title="Couleur du texte" />
      <div className="flex-1" />
      <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)}><Undo size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)}><Redo size={18} /></button>
    </div>
  );
};

export default function AdminEmailsPage() {
  const [view, setView] = useState('list'); 
  
  const [members, setMembers] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  
  const [selectedEmail, setSelectedEmail] = useState(null); 
  
  const [mailForm, setMailForm] = useState({
    subject: '',
    audience: 'Tous',
    testEmail: '',
    content: ''
  });

  const uniqueCategories = ['Tous', ...Array.from(new Set(members.map(m => m.category).filter(Boolean)))];

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[350px] w-full h-full cursor-text pb-10',
      },
    },
    onUpdate: ({ editor }) => {
      setMailForm(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // Chargement des membres ET de l'historique réel depuis la BDD
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [membersRes, emailsRes] = await Promise.all([
          fetch('/api/members'),
          fetch('/api/emails')
        ]);
        
        const membersData = await membersRes.json();
        const emailsData = await emailsRes.json();
        
        if (membersData.success) {
          setMembers(membersData.data);
        }
        
        if (emailsData.success) {
          setSentEmails(emailsData.data);
        }

      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const getRecipients = () => {
    if (mailForm.audience === 'Tous') return members.filter(m => m.email);
    return members.filter(m => m.category === mailForm.audience && m.email);
  };
  
  const recipients = getRecipients();

  const handleSendEmail = async (isTest = false) => {
    if (!mailForm.subject || !mailForm.content) {
      setEmailStatus({ type: 'error', msg: "Le sujet et le contenu sont obligatoires." });
      return;
    }

    let targetEmails = [];
    if (isTest) {
      if (!mailForm.testEmail) return setEmailStatus({ type: 'error', msg: "Veuillez saisir une adresse email de test." });
      targetEmails = [mailForm.testEmail];
    } else {
      targetEmails = recipients.map(m => m.email);
      if (targetEmails.length === 0) return setEmailStatus({ type: 'error', msg: "Aucun destinataire." });
      if (!window.confirm(`Envoyer cet email à ${targetEmails.length} membre(s) ?`)) return;
    }

    setIsSendingEmail(true);
    setEmailStatus(null);

    try {
      // --- CONFIGURATION EMAILJS ---
      const SERVICE_ID = 'service_k965f98'; // 🔴 À REMPLACER PAR VOTRE SERVICE ID
      const TEMPLATE_ID = 'template_d9no0hh'; // 🔴 À REMPLACER PAR VOTRE TEMPLATE ID
      const PUBLIC_KEY = 'QCj4y1pQixCxB7usX'; // 🔴 À REMPLACER PAR VOTRE CLÉ PUBLIQUE (Public Key)

      if (SERVICE_ID === 'VOTRE_SERVICE_ID') {
        setEmailStatus({ type: 'error', msg: "Veuillez remplacer les identifiants EmailJS dans le code source (ligne 116)." });
        setIsSendingEmail(false);
        return;
      }

      const emailjsPayload = {
        service_id: SERVICE_ID, 
        template_id: TEMPLATE_ID, 
        user_id: PUBLIC_KEY, 
        template_params: {
          subject: mailForm.subject,
          html_content: mailForm.content,
          to_email: targetEmails.join(',') 
        }
      };

      // --- ENVOI RÉEL VIA L'API REST D'EMAILJS ---
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailjsPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Détail erreur EmailJS:", errorText);
        if (errorText.toLowerCase().includes("recipient address is empty") || errorText.toLowerCase().includes("epty")) {
          throw new Error("Configuration EmailJS requise : Allez dans votre template EmailJS, et inscrivez {{to_email}} dans le champ 'To Email'.");
        }
        throw new Error(errorText || "Erreur de connexion à EmailJS");
      }

      // Sauvegarde dans la BDD uniquement si ce n'est pas un test
      if (!isTest) {
        const payload = {
          subject: mailForm.subject,
          audience: mailForm.audience,
          content: mailForm.content,
          date: new Date().toISOString()
        };

        const saveRes = await fetch('/api/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        const savedData = await saveRes.json();

        if (savedData.success) {
          setSentEmails([savedData.data, ...sentEmails]);
        }
        
        // Reset formulaire et vue
        setMailForm(prev => ({ ...prev, subject: '' }));
        editor?.commands.setContent('');
        setView('list'); 
      }

      setEmailStatus({ type: 'success', msg: isTest ? "Email de test envoyé avec succès !" : `Campagne envoyée à ${targetEmails.length} personnes !` });

    } catch (err) {
      console.error("Erreur d'envoi:", err);
      const displayMessage = err.message.includes("Configuration EmailJS") 
        ? err.message 
        : `L'envoi a échoué. Consultez la console pour plus de détails.`;
      
      setEmailStatus({ type: 'error', msg: displayMessage });
    } finally {
      setIsSendingEmail(false);
      setTimeout(() => setEmailStatus(null), 10000); 
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Montserrat'] pb-24 max-w-[1600px] mx-auto">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-10 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2 pt-2">
            Campagnes <span className="text-[#0065FF]">Newsletters</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">
            Studio d'envoi ciblé pour la base licenciés
          </p>
        </div>

        {/* BOUTONS D'ACTION HAUT DROITE */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {view === 'list' && (
            <button 
              onClick={() => setView('compose')}
              className="bg-[#0065FF] hover:bg-[#0052cc] text-white px-6 py-3.5 rounded-xl font-black uppercase text-[10px] sm:text-xs tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-[#0065FF]/20 transition-all"
            >
              <Edit3 size={16} /> Rédiger un email
            </button>
          )}
          <a 
            href="https://app.brevo.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 px-6 py-3.5 rounded-xl font-black uppercase text-[10px] sm:text-xs tracking-widest flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-white/10"
          >
            Dashboard Brevo <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-32"><Loader2 className="animate-spin text-[#0065FF]" size={48} /></div>
      ) : view === 'list' ? (
        
        /* =========================================================
           VUE 1 : HISTORIQUE DES EMAILS (DEPUIS LA BDD)
           ========================================================= */
        <div className="space-y-6 animate-in slide-in-from-left-4">
          
          <div className="flex items-center gap-3 mb-6">
            <History className="text-[#0065FF]" size={24} />
            <h2 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white">Derniers envois du club</h2>
          </div>

          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#081031] border-b border-slate-200 dark:border-white/10">
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Sujet du mail</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Audience ciblée</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {sentEmails.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-bold italic">Aucun email envoyé récemment.</td></tr>
                ) : (
                  sentEmails.map(email => (
                    <tr key={email._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => setSelectedEmail(email)}>
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Calendar size={14} className="text-[#0065FF]" />
                          {new Date(email.date || email.createdAt).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <h4 className="font-bold text-[#081031] dark:text-white group-hover:text-[#0065FF] transition-colors">{email.subject}</h4>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300">
                          <Users size={12} /> {email.audience}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 bg-slate-100 text-slate-400 hover:text-[#0065FF] dark:bg-white/5 dark:hover:bg-[#0065FF]/20 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      ) : (

        /* =========================================================
           VUE 2 : RÉDACTION DE L'EMAIL (COMPOSER)
           ========================================================= */
        <div className="animate-in slide-in-from-right-4 space-y-6">
          <button 
            onClick={() => setView('list')}
            className="flex items-center gap-2 text-slate-500 hover:text-[#081031] dark:hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors mb-4"
          >
            <ArrowLeft size={16} /> Retour à l'historique
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLONNE GAUCHE : L'ÉDITEUR */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm p-6 lg:p-8">
                <h2 className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white mb-6 flex items-center gap-3">
                  <Sparkles className="text-[#0065FF]" size={24} /> Rédiger l'email
                </h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0065FF] ml-2">Sujet de l'email *</label>
                    <input 
                      type="text" 
                      value={mailForm.subject} 
                      onChange={e => setMailForm({...mailForm, subject: e.target.value})}
                      placeholder="Ex: Convocation Assemblée Générale 2026..." 
                      className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-[#0065FF] transition-colors dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0065FF] ml-2">Contenu du message *</label>
                    <div className="border border-slate-200 dark:border-white/10 rounded-[2rem] overflow-hidden bg-white dark:bg-[#081031] shadow-inner flex flex-col focus-within:border-[#0065FF] transition-colors">
                      <MenuBar editor={editor} />
                      <div 
                        className="p-6 md:p-8 flex-1 prose dark:prose-invert prose-slate max-w-none focus:outline-none min-h-[400px]"
                        onClick={() => editor?.commands.focus()}
                      >
                        <EditorContent editor={editor} className="h-full outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLONNE DROITE : AUDIENCE & ENVOI */}
            <div className="lg:col-span-1 space-y-6">
              
              <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm p-6 lg:p-8 sticky top-24">
                <h3 className="text-lg font-[900] italic uppercase text-[#081031] dark:text-white mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
                  <Users className="text-[#0EE2E2]" size={20} /> Ciblage & Envoi
                </h3>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sélectionner l'audience</label>
                    <select 
                      value={mailForm.audience} 
                      onChange={e => setMailForm({...mailForm, audience: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#0065FF] cursor-pointer appearance-none dark:text-white"
                    >
                      {uniqueCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    
                    <div className="bg-[#0065FF]/10 border border-[#0065FF]/20 rounded-xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#0065FF] text-white flex items-center justify-center font-black shrink-0">
                        {recipients.length}
                      </div>
                      <p className="text-xs font-bold text-[#0065FF]">Membres avec adresse email recevront cette communication.</p>
                    </div>
                  </div>

                  {emailStatus && (
                    <div className={`p-4 rounded-xl text-xs font-bold flex items-start gap-2 animate-in zoom-in ${emailStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {emailStatus.type === 'success' ? <CheckCircle size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
                      <div className="leading-tight">{emailStatus.msg}</div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-100 dark:border-white/5 space-y-4">
                    <button 
                      onClick={() => handleSendEmail(false)}
                      disabled={isSendingEmail || recipients.length === 0 || !mailForm.subject}
                      className="w-full bg-[#0065FF] hover:bg-[#0052cc] text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#0065FF]/20 disabled:opacity-50"
                    >
                      {isSendingEmail ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} 
                      Envoyer la campagne
                    </button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-white/10"></div></div>
                      <div className="relative flex justify-center"><span className="bg-white dark:bg-[#0f172a] px-3 text-[10px] uppercase font-bold text-slate-400 tracking-widest">OU</span></div>
                    </div>

                    <div className="space-y-2">
                      <input 
                        type="email" 
                        placeholder="Email de test" 
                        value={mailForm.testEmail}
                        onChange={e => setMailForm({...mailForm, testEmail: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#0065FF] dark:text-white"
                      />
                      <button 
                        onClick={() => handleSendEmail(true)}
                        disabled={isSendingEmail || !mailForm.testEmail}
                        className="w-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        <Mail size={14} /> Envoyer un test
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
         MODALE VISUALISATION D'UN EMAIL ENVOYÉ
         ========================================================= */}
      {selectedEmail && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#081031] w-full max-w-3xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95">
            
            <div className="p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-[#0f172a] shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5 mb-1">
                  <Calendar size={12} className="text-[#0065FF]"/> 
                  {new Date(selectedEmail.date || selectedEmail.createdAt).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                </span>
                <h3 className="text-xl font-[900] italic text-[#081031] dark:text-white leading-tight">
                  {selectedEmail.subject}
                </h3>
              </div>
              <button onClick={() => setSelectedEmail(null)} className="p-2 text-slate-400 hover:text-red-500 bg-white dark:bg-white/5 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-[#0065FF]/10 border-b border-slate-200 dark:border-white/10 text-xs font-bold text-[#0065FF] flex items-center gap-2 shrink-0">
              <Users size={16} /> Audience ayant reçu ce mail : <span className="uppercase font-black">{selectedEmail.audience}</span>
            </div>

            <div className="p-8 overflow-y-auto flex-1 bg-white dark:bg-[#040817]">
              {/* Affichage du contenu brut sécurisé dans une classe prose */}
              <div 
                className="prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-black prose-headings:italic"
                dangerouslySetInnerHTML={{ __html: selectedEmail.content }}
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}