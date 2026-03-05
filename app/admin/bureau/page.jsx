'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Pencil, Trash2, Mail, User, 
  FileText, Download, Camera, Save, X, 
  Mic, Square, Sparkles, Loader2, Eye, Bot, AlertCircle, CheckCircle, RefreshCw, Bug
} from 'lucide-react';

export default function AdminBoard() {
  const [activeTab, setActiveTab] = useState('membres');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('membre'); 
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [debugRaw, setDebugRaw] = useState('');

  const [members, setMembers] = useState([]);
  const [reports, setReports] = useState([]);

  const [memberForm, setMemberForm] = useState({ prenom: '', nom: '', role: '', mail: '', photo: null });
  const [reportForm, setReportForm] = useState({ titre: '', date: '', fichier: null });
  const [editingId, setEditingId] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCR, setGeneratedCR] = useState('');
  const [crTitle, setCrTitle] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const [viewingReport, setViewingReport] = useState(null);

  // --- DIAGNOSTIC AVANCÉ ---
  const fetchData = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    setDebugRaw('');

    const diagnoseFetch = async (url) => {
      try {
        const res = await fetch(url);
        const contentType = res.headers.get("content-type");
        
        if (!res.ok) {
          // Si erreur, on essaye de lire le texte pour voir si c'est une page 404 Next.js
          const text = await res.text();
          const pageTitle = text.match(/<title>(.*?)<\/title>/)?.[1] || "Pas de titre HTML";
          throw new Error(`[${res.status}] ${url} : ${pageTitle}`);
        }

        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error(`L'API ${url} a renvoyé du HTML au lieu de JSON. Contenu : ${text.substring(0, 50)}...`);
        }

        return await res.json();
      } catch (err) {
        throw err;
      }
    };

    try {
      // Chargement indépendant pour identifier quel fichier pose problème
      try {
        const memData = await diagnoseFetch('/api/board-members');
        if (memData.success) setMembers(memData.data);
      } catch (e) {
        console.error("Erreur Membres:", e.message);
        setMessage({ type: 'error', text: `Membres: ${e.message}` });
      }

      try {
        const repData = await diagnoseFetch('/api/reports');
        if (repData.success) setReports(repData.data);
      } catch (e) {
        console.error("Erreur Rapports:", e.message);
        // On affiche cette erreur en priorité car c'est celle qui bloque l'utilisateur
        setMessage({ type: 'error', text: `Rapports: ${e.message}` });
      }

    } catch (globalError) {
      console.error("Erreur globale inattendue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("Photo trop lourde (Max 2Mo)");
      const reader = new FileReader();
      reader.onloadend = () => setMemberForm({ ...memberForm, photo: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) return alert("PDF trop lourd (Max 10Mo)");
      const reader = new FileReader();
      reader.onloadend = () => setReportForm({ ...reportForm, fichier: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingId ? `/api/board-members/${editingId}` : '/api/board-members';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberForm)
      });
      if (res.ok) {
        fetchData();
        closeModal();
      }
    } catch (error) {
      alert("Erreur enregistrement.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReportUploadSubmit = async (e) => {
    e.preventDefault();
    if (!reportForm.fichier) return alert("Veuillez sélectionner un fichier PDF.");
    setIsSaving(true);
    try {
      const payload = { ...reportForm, type: 'pdf' };
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchData();
        closeModal();
      }
    } catch (error) {
      alert("Erreur upload.");
    } finally {
      setIsSaving(false);
    }
  };

  const saveAiReport = async () => {
    if (!crTitle || !generatedCR) return alert("Donnez un titre.");
    setIsSaving(true);
    try {
      const payload = {
        titre: crTitle,
        date: new Date().toLocaleDateString('fr-FR'),
        type: 'texte',
        contenu: generatedCR
      };
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchData();
        closeModal();
      }
    } catch (error) {
      alert("Erreur IA.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm("Supprimer ce membre ?")) return;
    await fetch(`/api/board-members/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Supprimer ce CR ?")) return;
    await fetch(`/api/reports/${id}`, { method: 'DELETE' });
    fetchData();
  };

  // --- LOGIQUE DICTAPHONE ---
  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        audioChunksRef.current = [];
        stream.getTracks().forEach(track => track.stop());
      };
      audioChunksRef.current = [];
      setAudioBlob(null);
      setRecordingTime(0);
      setGeneratedCR('');
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      alert("Micro : " + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const generateCRWithAI = async () => {
    if (!audioBlob) return;
    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm'); 
      const res = await fetch('/api/generate-cr', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setGeneratedCR(data.summary);
        setCrTitle(`Compte-Rendu du ${new Date().toLocaleDateString('fr-FR')}`);
      } else {
        alert("Erreur IA : " + data.error);
      }
    } catch (err) {
      alert("Erreur réseau : " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const openModal = (type, member = null) => {
    setModalType(type);
    setIsModalOpen(true);
    if (type === 'membre') {
      if (member) {
        setEditingId(member._id);
        setMemberForm({ prenom: member.prenom, nom: member.nom, role: member.role, mail: member.mail || '', photo: member.photo });
      } else {
        setEditingId(null);
        setMemberForm({ prenom: '', nom: '', role: '', mail: '', photo: null });
      }
    }
  };

  const openViewModal = (report) => {
    setViewingReport(report);
    setModalType('cr_view');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isRecording) stopRecording();
    setIsModalOpen(false);
    setViewingReport(null);
  };

  return (
    <div className="min-h-screen font-['Montserrat'] space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h2 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white leading-none mb-4 pt-2">
            Bureau <span className="text-[#0065FF]">&</span> <span className="text-[#0EE2E2]">Réunions</span>
          </h2>
          <div className="inline-flex p-1.5 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            <button onClick={() => setActiveTab('membres')} className={`px-6 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'membres' ? 'bg-[#0065FF] text-white shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>Membres</button>
            <button onClick={() => setActiveTab('cr')} className={`px-6 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'cr' ? 'bg-[#0EE2E2] text-[#081031] shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>Comptes-rendus</button>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={fetchData} className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-500 hover:text-[#0065FF] transition-all" title="Actualiser">
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
          {activeTab === 'membres' ? (
            <button onClick={() => openModal('membre')} className="bg-[#0065FF] text-white px-8 py-4 rounded-2xl font-[900] uppercase text-xs tracking-widest flex items-center gap-2 hover:scale-105 transition-transform shadow-lg">
              <Plus size={18} /> Nouveau Membre
            </button>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => openModal('cr_upload')} className="bg-slate-100 dark:bg-white/10 text-[#081031] dark:text-white px-6 py-4 rounded-2xl font-[900] uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-all shadow-sm"><Download size={16} /> Uploader</button>
              <button onClick={() => openModal('cr_ai')} className="bg-[#F72585] text-white px-6 py-4 rounded-2xl font-[900] uppercase text-[10px] tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-[#F72585]/30"><Bot size={16} /> Assistant IA</button>
            </div>
          )}
        </div>
      </div>

      {/* ZONE D'ERREUR ET DIAGNOSTIC */}
      {message.text && (
        <div className={`p-6 rounded-[2rem] border-2 animate-in zoom-in ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          <div className="flex items-start gap-4">
            {message.type === 'success' ? <CheckCircle size={24} className="shrink-0" /> : <AlertCircle size={24} className="shrink-0" />}
            <div className="flex-1">
              <p className="font-black uppercase text-xs tracking-widest mb-1">{message.type === 'success' ? 'Succès' : 'Erreur de connexion'}</p>
              <p className="text-sm font-bold leading-relaxed">{message.text}</p>
              
              {message.type === 'error' && (
                <div className="mt-4 p-4 bg-white/50 rounded-xl border border-red-100 space-y-3">
                  <p className="text-[10px] font-black uppercase text-red-400 flex items-center gap-2"><Bug size={14}/> Guide de résolution :</p>
                  <ol className="text-xs font-medium list-decimal pl-4 space-y-1">
                    <li>Vérifiez que le fichier existe à cet endroit : <code className="bg-red-100 px-1 rounded font-bold">app/api/reports/route.js</code></li>
                    <li>Vérifiez qu'il n'est pas nommé <code className="bg-red-100 px-1 rounded font-bold italic">reports.js</code> par erreur.</li>
                    <li>Vérifiez que vous exportez bien <code className="bg-red-100 px-1 rounded font-bold">export async function GET()</code> en majuscules.</li>
                    <li>Relancez votre serveur avec <code className="bg-red-100 px-1 rounded font-bold">npm run dev</code>.</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isLoading && (members.length === 0 && reports.length === 0) ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0065FF]" size={48} /></div>
      ) : (
        <>
          {activeTab === 'membres' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.length === 0 ? (
                <div className="col-span-full text-center py-10 text-slate-400 font-bold uppercase tracking-widest italic">Aucun membre trouvé.</div>
              ) : (
                members.map((member) => (
                  <div key={member._id} className="group relative bg-white dark:bg-[#0f172a] rounded-[2.5rem] p-6 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-[#0065FF]/30 transition-all overflow-hidden text-center flex flex-col items-center">
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal('membre', member)} className="p-2 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-400 hover:text-[#0065FF] transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => deleteMember(member._id)} className="p-2 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                    <div className="w-24 h-24 bg-slate-100 dark:bg-[#040817] rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-[#0EE2E2]/20 shrink-0 overflow-hidden">
                      {member.photo ? <img src={member.photo} className="w-full h-full object-cover" /> : <User size={32} className="text-slate-300" />}
                    </div>
                    <h3 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white leading-none mb-1">{member.prenom} <span className="text-[#0065FF]">{member.nom}</span></h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0EE2E2] mb-4">{member.role}</p>
                    <div className="mt-auto w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 dark:bg-[#081031] rounded-2xl text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate border border-slate-100 dark:border-white/5">
                      <Mail size={12} className="text-[#0065FF] shrink-0" />
                      <span className="truncate">{member.mail || 'Non renseigné'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'cr' && (
            <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#081031] border-b border-slate-200 dark:border-white/10">
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Document</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date réunion</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {reports.length === 0 ? (
                    <tr><td colSpan="3" className="px-8 py-10 text-center text-slate-400 font-bold uppercase tracking-widest italic">Aucun CR trouvé.</td></tr>
                  ) : (
                    reports.map((report) => (
                      <tr key={report._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            {report.type === 'texte' ? (
                              <div className="p-3 bg-purple-50 dark:bg-purple-500/10 text-purple-500 rounded-xl"><Sparkles size={20} /></div>
                            ) : (
                              <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl"><FileText size={20} /></div>
                            )}
                            <div>
                              <span className="font-bold text-sm text-[#081031] dark:text-white block">{report.titre}</span>
                              {report.type === 'texte' && <span className="text-[9px] font-black uppercase text-purple-500 tracking-widest">Généré par IA</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-500">{report.date}</td>
                        <td className="px-8 py-5 text-right space-x-2">
                          {report.type === 'texte' ? (
                            <button onClick={() => openViewModal(report)} className="p-2 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg hover:text-[#0EE2E2] transition-colors"><Eye size={16} /></button>
                          ) : (
                            <a href={report.fichier} download={`${report.titre}.pdf`} className="inline-block p-2 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg hover:text-[#0065FF] transition-colors"><Download size={16} /></a>
                          )}
                          <button onClick={() => deleteReport(report._id)} className="p-2 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* MODALES */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#081031]/80 backdrop-blur-md animate-in fade-in" onClick={closeModal}></div>
          <div className="relative bg-white dark:bg-[#0f172a] w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-white/10">
             <div className="flex justify-between items-center p-8 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#081031] shrink-0">
                <h3 className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white flex items-center gap-3">
                  {modalType === 'membre' && <><User className="text-[#0065FF]"/> Membre</>}
                  {modalType === 'cr_upload' && <><FileText className="text-[#0EE2E2]"/> Importer PDF</>}
                  {modalType === 'cr_ai' && <><Bot className="text-[#F72585]"/> Llama 3</>}
                  {modalType === 'cr_view' && <><Sparkles className="text-purple-500"/> CR IA</>}
                </h3>
                <button onClick={closeModal} className="p-2 bg-white dark:bg-white/10 rounded-full text-slate-400 hover:rotate-90 transition-all"><X size={20} /></button>
             </div>
             <div className="p-8 overflow-y-auto hide-scrollbar flex-1 text-[#081031] dark:text-white">
               {modalType === 'membre' && (
                 <form onSubmit={handleMemberSubmit} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Prénom *</label><input type="text" required value={memberForm.prenom} onChange={e => setMemberForm({...memberForm, prenom: e.target.value})} className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none" /></div>
                     <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Nom *</label><input type="text" required value={memberForm.nom} onChange={e => setMemberForm({...memberForm, nom: e.target.value})} className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none" /></div>
                   </div>
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Rôle *</label><input type="text" required value={memberForm.role} onChange={e => setMemberForm({...memberForm, role: e.target.value})} className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none" /></div>
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Email</label><input type="email" value={memberForm.mail} onChange={e => setMemberForm({...memberForm, mail: e.target.value})} className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none" /></div>
                   <label className="border-2 border-dashed border-slate-200 dark:border-white/10 p-8 rounded-[2rem] text-center bg-slate-50 dark:bg-[#081031] cursor-pointer hover:border-[#0065FF] transition-colors block">
                     <Camera size={32} className="mx-auto text-slate-300 mb-2" />
                     <p className="text-xs font-black uppercase text-slate-400 tracking-widest">{memberForm.photo ? 'Photo chargée' : 'Photo'}</p>
                     <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                   </label>
                   <button type="submit" disabled={isSaving} className="w-full bg-[#0065FF] text-white p-5 rounded-[1.5rem] font-[900] uppercase text-xs flex items-center justify-center gap-3">{isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Enregistrer</button>
                 </form>
               )}
               {modalType === 'cr_upload' && (
                 <form onSubmit={handleReportUploadSubmit} className="space-y-6">
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Titre *</label><input type="text" required value={reportForm.titre} onChange={e => setReportForm({...reportForm, titre: e.target.value})} className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none" /></div>
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Date *</label><input type="date" required value={reportForm.date} onChange={e => setReportForm({...reportForm, date: e.target.value})} className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none" /></div>
                   <label className="border-2 border-dashed border-slate-200 dark:border-white/10 p-12 rounded-[2rem] text-center bg-slate-50 dark:bg-[#081031] cursor-pointer hover:border-[#0EE2E2] transition-colors block">
                     <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                     <p className="text-xs font-black uppercase text-slate-400 tracking-widest">{reportForm.fichier ? 'PDF chargé' : 'Glisser le PDF ici'}</p>
                     <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
                   </label>
                   <button type="submit" disabled={isSaving} className="w-full bg-[#0EE2E2] text-[#081031] p-5 rounded-[1.5rem] font-[900] uppercase text-xs flex items-center justify-center gap-3 italic">{isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Publier</button>
                 </form>
               )}
               {modalType === 'cr_ai' && (
                 <div className="space-y-8 flex flex-col h-full">
                   {!generatedCR && !isGenerating && (
                     <div className="flex flex-col items-center justify-center py-10 text-center">
                       <div className="text-6xl font-[900] font-mono text-[#081031] dark:text-white mb-10 tracking-tighter">{formatTime(recordingTime)}</div>
                       <button onClick={isRecording ? stopRecording : startRecording} className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all ${isRecording ? 'bg-[#F72585] scale-110' : 'bg-[#081031] dark:bg-white dark:text-[#081031]'}`}>{isRecording ? <Square size={32} fill="currentColor" /> : <Mic size={40} />}</button>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-8">{isRecording ? "Enregistrement..." : "Prêt pour la réunion"}</p>
                       {audioBlob && (
                         <div className="w-full mt-10 space-y-6 flex flex-col items-center bg-slate-50 dark:bg-[#081031] p-6 rounded-[2rem] border border-slate-200 dark:border-white/10">
                           <audio src={URL.createObjectURL(audioBlob)} controls className="w-full max-w-sm" />
                           <div className="flex gap-4">
                             <button onClick={startRecording} className="px-6 py-3 rounded-xl font-bold text-xs uppercase text-slate-500">Recommencer</button>
                             <button onClick={generateCRWithAI} className="bg-[#F72585] text-white px-8 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2"><Sparkles size={16} /> Générer le CR</button>
                           </div>
                         </div>
                       )}
                     </div>
                   )}
                   {isGenerating && (
                     <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                       <Bot size={64} className="text-purple-500 animate-bounce" />
                       <div><h3 className="text-xl font-black uppercase italic mb-2">IA au travail...</h3><p className="text-sm font-bold text-slate-500">Transcription Whisper + Llama 3 en cours.</p></div>
                     </div>
                   )}
                   {generatedCR && !isGenerating && (
                     <div className="flex flex-col h-full space-y-6 animate-in zoom-in-95">
                       <input type="text" value={crTitle} onChange={(e) => setCrTitle(e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-purple-500" />
                       <textarea value={generatedCR} onChange={(e) => setGeneratedCR(e.target.value)} className="w-full flex-1 min-h-[300px] bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-6 rounded-[2rem] font-medium text-sm leading-relaxed outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                       <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 shrink-0">
                         <button onClick={() => setGeneratedCR('')} className="px-6 py-3 rounded-xl font-bold text-xs uppercase text-slate-500">Rejeter</button>
                         <button onClick={saveAiReport} disabled={isSaving} className="bg-purple-500 text-white px-8 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 shadow-lg">{isSaving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16} />} Publier</button>
                       </div>
                     </div>
                   )}
                 </div>
               )}
               {modalType === 'cr_view' && viewingReport && (
                 <div className="prose dark:prose-invert max-w-none text-sm font-medium leading-loose whitespace-pre-wrap bg-slate-50 dark:bg-[#081031] p-8 rounded-[2rem] border border-slate-200 dark:border-white/10">
                   <h1 className="text-2xl font-black uppercase italic mb-8">{viewingReport.titre}</h1>
                   {viewingReport.contenu}
                 </div>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}