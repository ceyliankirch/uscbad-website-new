'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Pencil, Trash2, Mail, User, 
  FileText, Download, Camera, Save, X, 
  Mic, Square, Sparkles, Loader2, Play, Eye, Bot, AlertCircle, 
  CheckCircle, RefreshCw, UploadCloud, FileAudio, BrainCircuit, CheckCircle2, Users
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from '@/components/ReportPDF';

// --- COMPOSANT LOADER PROGRESSIF (UX IA) ---
function ProgressiveLoader() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 0, title: "Envoi sécurisé", desc: "Upload de l'enregistrement...", delay: 0, icon: <UploadCloud size={20} /> },
    { id: 1, title: "Transcription (Whisper)", desc: "L'IA écoute la réunion...", delay: 1500, icon: <FileAudio size={20} /> },
    { id: 2, title: "Analyse & Llama 3", desc: "Extraction des décisions clés...", delay: 4000, icon: <BrainCircuit size={20} /> },
    { id: 3, title: "Génération", desc: "Formatage du compte-rendu...", delay: 7000, icon: <FileText size={20} /> }
  ];

  useEffect(() => {
    const timers = steps.map(step => setTimeout(() => setCurrentStep(step.id), step.delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10 w-full animate-in fade-in duration-500">
      <style>{`
        @keyframes custom-progress {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 100%; transform: translateX(100%); }
        }
        .animate-custom-progress { animation: custom-progress 2s infinite ease-in-out; }
      `}</style>

      <div className="bg-slate-50 dark:bg-[#040817] w-full max-w-md rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/10 relative overflow-hidden shadow-inner">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F72585]/20 rounded-full blur-3xl animate-pulse"></div>
        <h3 className="text-xl font-black text-[#081031] dark:text-white mb-6 text-center tracking-tight italic uppercase">Traitement IA...</h3>
        <div className="space-y-6 relative z-10">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isDone = currentStep > step.id;
            const isWaiting = currentStep < step.id;
            return (
              <div key={step.id} className={`flex items-center gap-4 transition-all duration-500 ${isWaiting ? 'opacity-30 translate-y-2' : isActive ? 'opacity-100 translate-y-0 scale-105' : 'opacity-60'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${isDone ? 'bg-green-100 text-green-500' : isActive ? 'bg-[#F72585] text-white shadow-lg shadow-[#F72585]/30' : 'bg-white dark:bg-white/5 text-slate-400'}`}>
                  {isDone ? <CheckCircle2 size={20} /> : isActive ? <Loader2 size={20} className="animate-spin" /> : step.icon}
                </div>
                <div>
                  <p className={`text-sm font-black uppercase tracking-widest ${isDone ? 'text-green-600' : isActive ? 'text-[#F72585]' : 'text-slate-500'}`}>{step.title}</p>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#F72585] rounded-full animate-custom-progress origin-left"></div>
        </div>
      </div>
    </div>
  );
}

export default function AdminBoard() {
  const [activeTab, setActiveTab] = useState('membres');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('membre'); 
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [members, setMembers] = useState([]);
  const [reports, setReports] = useState([]);

  const [memberForm, setMemberForm] = useState({ prenom: '', nom: '', role: '', mail: '', photo: null });
  const [reportForm, setReportForm] = useState({ titre: '', date: '', fichier: null });
  const [editingId, setEditingId] = useState(null);

  // --- ÉTATS ASSISTANT IA ---
  const [iaViewState, setIaViewState] = useState('recording'); // 'recording' | 'processing' | 'validation'
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [generatedCR, setGeneratedCR] = useState('');
  const [crTitle, setCrTitle] = useState('');
  const [aiError, setAiError] = useState('');
  
  // Nouveaux états pour le PDF
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [participants, setParticipants] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const [viewingReport, setViewingReport] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    const safeFetch = async (url) => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          if (res.status === 404) throw new Error(`404: Route introuvable (${url})`);
          throw new Error(`Erreur ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) throw new Error("Réponse non-JSON");
        return await res.json();
      } catch (err) { throw err; }
    };

    try {
      const [memRes, repRes] = await Promise.allSettled([
        safeFetch('/api/board-members'),
        safeFetch('/api/reports')
      ]);

      if (memRes.status === 'fulfilled' && memRes.value.success) setMembers(memRes.value.data);
      if (repRes.status === 'fulfilled' && repRes.value.success) setReports(repRes.value.data);
      else if (repRes.status === 'rejected') setMessage({ type: 'error', text: `Erreur Rapports: ${repRes.reason.message}` });

    } catch (error) {
      console.error("Erreur globale:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteReport = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce compte-rendu ?")) return;
    try {
      const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReports(reports.filter(r => r._id !== id));
          setMessage({ type: 'success', text: 'Compte-rendu supprimé.' });
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } else {
          alert("Erreur base de données : " + data.error);
        }
      } else {
        if (res.status === 404) {
          alert("Erreur 404 : La route de suppression est introuvable. Vérifiez l'existence de app/api/reports/[id]/route.js");
        } else {
          alert(`Erreur serveur (${res.status}) lors de la suppression.`);
        }
      }
    } catch (error) {
      console.error("Erreur réseau suppression:", error);
      alert("Erreur réseau : impossible de joindre le serveur.");
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm("Supprimer ce membre ?")) return;
    try {
      const res = await fetch(`/api/board-members/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMembers(members.filter(m => m._id !== id));
        fetchData();
      }
    } catch (e) { alert("Erreur suppression membre."); }
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
      if (res.ok) { fetchData(); closeModal(); }
    } catch (error) { alert("Erreur enregistrement."); } finally { setIsSaving(false); }
  };

  const handleReportUploadSubmit = async (e) => {
    e.preventDefault();
    if (!reportForm.fichier) return alert("Fichier manquant.");
    setIsSaving(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reportForm, type: 'pdf' })
      });
      if (res.ok) { fetchData(); closeModal(); }
    } catch (error) { alert("Erreur upload."); } finally { setIsSaving(false); }
  };

  // --- LOGIQUE DICTAPHONE & WAVEFORM ---
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const analyser = analyserRef.current;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, width, height);
      
      const numberOfBars = 32; 
      const barGap = 2;
      const barWidth = (width - ((numberOfBars - 1) * barGap)) / numberOfBars;
      const usefulLength = Math.floor(bufferLength / 3);

      let globalSum = 0;
      for (let i = 0; i < usefulLength; i++) { globalSum += dataArray[i]; }
      const globalAverage = globalSum / usefulLength;

      for (let i = 0; i < numberOfBars; i++) {
        const dataIndex = Math.floor(i * (usefulLength / numberOfBars)); 
        let val = dataArray[dataIndex];
        
        val = Math.min(255, (val * 0.8) + (globalAverage * 0.05));
        const barHeight = Math.max(2, (val / 255) * height);
        
        const x = i * (barWidth + barGap);
        const y = (height - barHeight) / 2; 

        ctx.fillStyle = '#F72585'; // Rose US Créteil
        
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 4);
        ctx.fill();
      }
    };
    draw();
  };

  const startRecording = async () => {
    try {
      setAiError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      
      analyser.fftSize = 128; 
      analyser.smoothingTimeConstant = 0.7; 

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setAudioBlob(null);
      timerIntervalRef.current = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
      drawWaveform();
    } catch (err) { setAiError("Accès au microphone refusé."); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) audioContextRef.current.close();
    clearInterval(timerIntervalRef.current);
    cancelAnimationFrame(animationFrameRef.current);
    setIsRecording(false);
  };

  // --- APPEL API IA (GROQ) ---
  const generateCRWithAI = async () => {
    if (!audioBlob) return;
    setIaViewState('processing');
    setAiError("");
    
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm'); 
      const res = await fetch('/api/generate-cr', { method: 'POST', body: formData });
      const data = await res.json();
      
      if (data.success) { 
        setGeneratedCR(data.summary); 
        // On pré-remplit le titre du PDF et de la base avec la date saisie
        setCrTitle(`Compte-Rendu du ${new Date(meetingDate).toLocaleDateString('fr-FR')}`);
        setIaViewState('validation');
      } else {
        setAiError(data.error || "Erreur inconnue lors de la génération.");
        setIaViewState('recording');
      }
    } catch (err) { 
      setAiError("Erreur réseau : Impossible de contacter le serveur IA.");
      setIaViewState('recording');
    }
  };

  const saveAiReport = async () => {
    if (!crTitle || !generatedCR) return alert("Donnez un titre.");
    setIsSaving(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titre: crTitle, date: new Date(meetingDate).toLocaleDateString('fr-FR'), type: 'texte', contenu: generatedCR })
      });
      if (res.ok) { fetchData(); closeModal(); }
    } catch (error) { alert("Erreur lors de la sauvegarde."); } finally { setIsSaving(false); }
  };

  // --- GESTION MODALES ---
  const openModal = (type, member = null) => {
    setModalType(type); setIsModalOpen(true);
    if (type === 'membre') {
      if (member) { setEditingId(member._id); setMemberForm({ prenom: member.prenom, nom: member.nom, role: member.role, mail: member.mail || '', photo: member.photo }); }
      else { setEditingId(null); setMemberForm({ prenom: '', nom: '', role: '', mail: '', photo: null }); }
    }
    if (type === 'cr_ai') {
      setIaViewState('recording');
      setAudioBlob(null);
      setGeneratedCR('');
      setCrTitle('');
      setAiError('');
      setRecordingTime(0);
      setMeetingDate(new Date().toISOString().split('T')[0]);
      setParticipants('');
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

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setMemberForm({ ...memberForm, photo: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReportForm({ ...reportForm, fichier: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen font-['Montserrat'] space-y-10 animate-in fade-in duration-500 pb-20">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h2 className="text-3xl lg:text-4xl font-[900] italic uppercase text-[#081031] dark:text-white leading-none mb-4 pt-2">Bureau <span className="text-[#0065FF]">&</span> <span className="text-[#0EE2E2]">Réunions</span></h2>
          <div className="inline-flex p-1.5 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            <button onClick={() => setActiveTab('membres')} className={`px-6 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'membres' ? 'bg-[#0065FF] text-white shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>Membres</button>
            <button onClick={() => setActiveTab('cr')} className={`px-6 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'cr' ? 'bg-[#0EE2E2] text-[#081031] shadow-md' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}>Comptes-rendus</button>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-500 hover:text-[#0065FF] transition-all"><RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} /></button>
          {activeTab === 'membres' ? (
            <button onClick={() => openModal('membre')} className="bg-[#0065FF] text-white px-8 py-4 rounded-2xl font-[900] uppercase text-xs tracking-widest flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-[#0065FF]/20"><Plus size={18} /> Ajouter un membre</button>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => openModal('cr_upload')} className="bg-slate-100 dark:bg-white/10 text-[#081031] dark:text-white px-6 py-4 rounded-2xl font-[900] uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-white/20 transition-all shadow-sm"><Download size={16} /> Uploader PDF</button>
              <button onClick={() => openModal('cr_ai')} className="bg-[#F72585] text-white px-6 py-4 rounded-2xl font-[900] uppercase text-[10px] tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-[#F72585]/30"><Bot size={16} /> Assistant IA</button>
            </div>
          )}
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm animate-in zoom-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <div className="flex-1">{message.text}</div>
          {message.type === 'error' && <button onClick={fetchData} className="px-3 py-1 bg-red-600 text-white rounded-lg text-[10px] uppercase">Réessayer</button>}
        </div>
      )}

      {isLoading && members.length === 0 ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0065FF]" size={48} /></div>
      ) : (
        <>
          {activeTab === 'membres' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.length === 0 ? (
                <div className="col-span-full text-center py-10 text-slate-400 font-bold uppercase tracking-widest italic">Aucun membre.</div>
              ) : (
                members.map((m) => (
                  <div key={m._id} className="group relative bg-white dark:bg-[#0f172a] rounded-[2.5rem] p-6 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-[#0065FF]/30 transition-all overflow-hidden text-center flex flex-col items-center">
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal('membre', m)} className="p-2 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-400 hover:text-[#0065FF] transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => deleteMember(m._id)} className="p-2 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                    <div className="w-24 h-24 bg-slate-100 dark:bg-[#040817] rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-[#0EE2E2]/20 shrink-0 overflow-hidden">
                      {m.photo ? <img src={m.photo} className="w-full h-full object-cover" /> : <User size={32} className="text-slate-300" />}
                    </div>
                    <h3 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white leading-none mb-1">{m.prenom} <span className="text-[#0065FF]">{m.nom}</span></h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0EE2E2] mb-4">{m.role}</p>
                    <div className="mt-auto w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 dark:bg-[#081031] rounded-2xl text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate border border-slate-100 dark:border-white/5">
                      <Mail size={12} className="text-[#0065FF] shrink-0" /> <span className="truncate">{m.mail || 'Non renseigné'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'cr' && (
            <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#081031] border-b border-slate-200 dark:border-white/10">
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Document</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date de réunion</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {reports.length === 0 ? (
                      <tr><td colSpan="3" className="px-8 py-10 text-center text-slate-400 font-bold italic uppercase tracking-widest">Aucun CR trouvé.</td></tr>
                    ) : (
                      reports.map((report) => (
                        <tr key={report._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              {report.type === 'texte' ? (
                                <div className="p-3 bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-500 rounded-xl"><Sparkles size={20} /></div>
                              ) : (
                                <div className="p-3 bg-[#0EE2E2]/10 text-[#0EE2E2] rounded-xl"><FileText size={20} /></div>
                              )}
                              <div><span className="font-bold text-sm text-[#081031] dark:text-white block">{report.titre}</span>{report.type === 'texte' && <span className="text-[9px] font-black uppercase text-fuchsia-500 tracking-widest">Généré par IA</span>}</div>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-sm font-bold text-slate-500">{report.date}</td>
                          <td className="px-8 py-5 text-right flex items-center justify-end gap-2">
                            <button onClick={() => openViewModal(report)} className="p-2 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg hover:text-[#0EE2E2] transition-colors" title="Visualiser"><Eye size={16} /></button>
                            {report.type === 'pdf' && (
                              <a href={report.fichier} download={`${report.titre}.pdf`} className="inline-block p-2 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg hover:text-[#0065FF] transition-colors" title="Télécharger"><Download size={16} /></a>
                            )}
                            <button onClick={() => deleteReport(report._id)} className="p-2 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg hover:text-red-500 hover:bg-red-50 transition-colors" title="Supprimer"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODALES */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#081031]/80 backdrop-blur-md animate-in fade-in" onClick={closeModal}></div>
          <div className={`relative bg-white dark:bg-[#0f172a] w-full rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-white/10 text-[#081031] dark:text-white ${modalType === 'cr_ai' ? 'max-w-4xl' : 'max-w-3xl'}`}>
             
             <div className="flex justify-between items-center p-8 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#081031] shrink-0">
                <h3 className="text-2xl font-[900] italic uppercase flex items-center gap-3">
                  {modalType === 'membre' && <><User className="text-[#0065FF]"/> Membre</>}
                  {modalType === 'cr_upload' && <><FileText className="text-[#0EE2E2]"/> Importer PDF</>}
                  {modalType === 'cr_ai' && <><Bot className="text-[#F72585]"/> Assistant IA</>}
                  {modalType === 'cr_view' && <><Sparkles className="text-fuchsia-500"/> Compte-Rendu IA</>}
                </h3>
                <button onClick={closeModal} className="p-2 bg-white dark:bg-white/10 rounded-full text-slate-400 hover:rotate-90 hover:text-red-500 transition-all shadow-sm"><X size={20} /></button>
             </div>

             <div className="p-8 overflow-y-auto hide-scrollbar flex-1">
               
               {/* 1. Modale Ajout Membre */}
               {modalType === 'membre' && (
                 <form onSubmit={handleMemberSubmit} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-2">Prénom *</label><input type="text" required value={memberForm.prenom} onChange={e => setMemberForm({...memberForm, prenom: e.target.value})} className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none" /></div>
                     <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-2">Nom *</label><input type="text" required value={memberForm.nom} onChange={e => setMemberForm({...memberForm, nom: e.target.value})} className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none" /></div>
                   </div>
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-2">Rôle *</label><input type="text" required value={memberForm.role} onChange={e => setMemberForm({...memberForm, role: e.target.value})} className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none" /></div>
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-2">Email</label><input type="email" value={memberForm.mail} onChange={e => setMemberForm({...memberForm, mail: e.target.value})} className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none" /></div>
                   <label className="border-2 border-dashed border-slate-200 dark:border-white/10 p-8 rounded-[2rem] text-center bg-slate-50 dark:bg-[#081031] cursor-pointer hover:border-[#0065FF] transition-colors block">
                     <Camera size={32} className="mx-auto text-slate-300 mb-2" /><p className="text-xs font-black uppercase text-slate-400">{memberForm.photo ? 'Photo chargée' : 'Ajouter une photo'}</p><input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                   </label>
                   <button type="submit" disabled={isSaving} className="w-full bg-[#0065FF] text-white p-5 rounded-[1.5rem] font-[900] uppercase text-xs flex items-center justify-center gap-3">{isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Enregistrer</button>
                 </form>
               )}

               {/* 2. Modale Upload PDF */}
               {modalType === 'cr_upload' && (
                 <form onSubmit={handleReportUploadSubmit} className="space-y-6">
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-2">Titre *</label><input type="text" required value={reportForm.titre} onChange={e => setReportForm({...reportForm, titre: e.target.value})} placeholder="AG Ordinaire 2026" className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none" /></div>
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 ml-2">Date réunion *</label><input type="date" required value={reportForm.date} onChange={e => setReportForm({...reportForm, date: e.target.value})} className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none" /></div>
                   <label className="border-2 border-dashed border-slate-200 dark:border-white/10 p-12 rounded-[2rem] text-center bg-slate-50 dark:bg-[#081031] cursor-pointer hover:border-[#0EE2E2] transition-colors block">
                     <FileText size={40} className="mx-auto text-slate-300 mb-3" /><p className="text-xs font-black uppercase text-slate-400">{reportForm.fichier ? 'PDF chargé' : 'Glisser le PDF ici'}</p><input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
                   </label>
                   <button type="submit" disabled={isSaving} className="w-full bg-[#0EE2E2] text-[#081031] p-5 rounded-[1.5rem] font-[900] uppercase text-xs flex items-center justify-center gap-3">{isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Uploader et Publier</button>
                 </form>
               )}

               {/* 3. MODALE ASSISTANT IA (Complètement repensée avec PDF) */}
               {modalType === 'cr_ai' && (
                 <div className="flex flex-col h-full w-full max-w-2xl mx-auto">
                   
                   {/* ÉTAPE 1 : ENREGISTREMENT */}
                   {iaViewState === 'recording' && (
                     <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-300 py-4">
                       <h4 className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white mb-2">Prêt à dicter ?</h4>
                       <p className="text-sm font-bold text-slate-500 mb-10">L'IA retranscrira et structurera votre réunion.</p>
                       
                       <div className="flex flex-col items-center justify-center gap-6 w-full h-16 mb-8">
                         <div className={`flex items-center gap-4 transition-all duration-300 ${isRecording ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                           <canvas ref={canvasRef} width={200} height={60} className="w-48 h-16" />
                           <span className="text-xl font-black text-[#F72585] tabular-nums w-16 text-left">{formatTime(recordingTime)}</span>
                         </div>
                       </div>

                       {aiError && (
                         <div className="mb-6 flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-500/10 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest animate-in shake"><AlertCircle size={16} /> {aiError}</div>
                       )}

                       <div className="flex flex-col items-center gap-6 w-full">
                         {!audioBlob && (
                           <button onClick={isRecording ? stopRecording : startRecording} className={`group relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 shadow-2xl ${isRecording ? "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 animate-pulse" : "bg-[#081031] dark:bg-white text-white dark:text-[#081031] hover:scale-105"}`}>
                             {isRecording ? <Square size={32} className="fill-current" /> : <Mic size={40} />}
                             {!isRecording && <div className="absolute inset-0 rounded-full border-2 border-[#081031] dark:border-white scale-[1.3] opacity-0 group-hover:animate-ping"></div>}
                           </button>
                         )}

                         {audioBlob && !isRecording && (
                           <div className="w-full space-y-6 flex flex-col items-center bg-slate-50 dark:bg-[#081031] p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 animate-in slide-in-from-bottom-4">
                             <audio src={URL.createObjectURL(audioBlob)} controls className="w-full max-w-sm" />
                             
                             {/* NOUVEAUX INPUTS (Pour le PDF et le Titre BDD) */}
                             <div className="w-full max-w-sm bg-white dark:bg-[#0f172a] p-5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4 text-left">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Date de la réunion</label>
                                  <input type="date" value={meetingDate} onChange={e => setMeetingDate(e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#F72585] transition-colors dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1.5"><Users size={12}/> Participants</label>
                                  <input type="text" value={participants} onChange={e => setParticipants(e.target.value)} placeholder="Ex: Julien, Malo, Romain..." className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#F72585] transition-colors dark:text-white" />
                                </div>
                             </div>

                             <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                               <button onClick={startRecording} className="px-6 py-4 rounded-xl font-black uppercase tracking-widest text-xs text-slate-500 hover:bg-white dark:hover:bg-white/5 transition-colors shadow-sm">Recommencer</button>
                               <button onClick={generateCRWithAI} className="bg-[#F72585] text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-[#F72585]/30"><Sparkles size={18} /> Générer le CR</button>
                             </div>
                           </div>
                         )}
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{isRecording ? "Enregistrement en cours..." : audioBlob ? "Enregistrement terminé" : "Appuyez pour parler"}</span>
                       </div>
                     </div>
                   )}

                   {/* ÉTAPE 2 : CHARGEMENT (PROGRESSIVE LOADER) */}
                   {iaViewState === 'processing' && <ProgressiveLoader />}

                   {/* ÉTAPE 3 : VALIDATION ET ÉDITION DU MARKDOWN */}
                   {iaViewState === 'validation' && generatedCR && (
                     <div className="flex flex-col h-full space-y-6 animate-in zoom-in-95 duration-500">
                       <div className="bg-fuchsia-50 dark:bg-fuchsia-500/10 p-4 rounded-2xl flex items-start gap-3 border border-fuchsia-100 dark:border-fuchsia-500/20 mb-2">
                         <CheckCircle className="text-fuchsia-500 shrink-0 mt-0.5" size={20} />
                         <div>
                           <p className="text-sm font-black text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-widest mb-1">Génération Réussie</p>
                           <p className="text-xs font-bold text-fuchsia-600/70 dark:text-fuchsia-400/70">Relisez et ajustez le texte généré par l'IA avant de le publier définitivement.</p>
                         </div>
                       </div>

                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Titre du Compte-rendu *</label>
                         <input type="text" value={crTitle} onChange={(e) => setCrTitle(e.target.value)} className="w-full bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-black text-sm outline-none focus:border-[#F72585] transition-colors" />
                       </div>
                       
                       <div className="space-y-2 flex-1 flex flex-col min-h-[300px]">
                         <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Contenu (Format Markdown)</label>
                         <textarea value={generatedCR} onChange={(e) => setGeneratedCR(e.target.value)} className="w-full flex-1 bg-slate-50 dark:bg-[#081031] border border-slate-200 dark:border-white/10 p-6 rounded-[2rem] font-medium text-sm leading-relaxed outline-none focus:border-[#F72585] transition-colors resize-none custom-scrollbar" />
                       </div>

                       <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0">
                         <button onClick={() => setIaViewState('recording')} className="px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Rejeter</button>
                         
                         {/* BOUTON D'EXPORT PDF */}
                         <PDFDownloadLink 
                            document={<ReportPDF title={crTitle} date={new Date(meetingDate).toLocaleDateString('fr-FR')} participants={participants} content={generatedCR} />}
                            fileName={`${crTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`}
                            className="bg-slate-800 dark:bg-white/10 text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-white/20 transition-all shadow-md"
                          >
                            {({ loading }) => (loading ? <Loader2 size={16} className="animate-spin" /> : <><Download size={16} /> Exporter PDF</>)}
                          </PDFDownloadLink>

                         <button onClick={saveAiReport} disabled={isSaving} className="bg-[#0065FF] hover:bg-[#0EE2E2] hover:text-[#081031] text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50">
                           {isSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18} />} Publier le CR
                         </button>
                       </div>
                     </div>
                   )}
                 </div>
               )}

               {/* 4. Modale Visualisation CR */}
               {modalType === 'cr_view' && viewingReport && (
                 <div className="flex flex-col h-full bg-slate-50 dark:bg-[#081031] p-6 lg:p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/10">
                   <h1 className="text-2xl lg:text-3xl font-[900] uppercase italic mb-2 text-[#081031] dark:text-white leading-tight">{viewingReport.titre}</h1>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 pb-6 border-b border-slate-200 dark:border-white/10">Document du {viewingReport.date}</p>
                   
                   {viewingReport.type === 'texte' ? (
                     <div className="prose dark:prose-invert max-w-none text-sm font-medium leading-loose whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                       {viewingReport.contenu}
                     </div>
                   ) : (
                     <iframe src={viewingReport.fichier} className="w-full min-h-[60vh] rounded-xl border border-slate-200 dark:border-white/10 shadow-inner" />
                   )}
                 </div>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}