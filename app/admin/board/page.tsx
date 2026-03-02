'use client';
import React, { useState } from 'react';
import { 
  Plus, Pencil, Trash2, Mail, User, 
  FileText, Download, Camera, Save, X 
} from 'lucide-react';

export default function AdminBoard() {
  const [activeTab, setActiveTab] = useState('membres'); // 'membres' ou 'cr'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Données de test pour le Bureau
  const [members, setMembers] = useState([
    { _id: '1', nom: 'Lefebvre', prenom: 'Thomas', role: 'Président', mail: 'president@uscreteil-bad.com', photo: null },
    { _id: '2', nom: 'Dubois', prenom: 'Julie', role: 'Secrétaire', mail: 'secretariat@uscreteil-bad.com', photo: null },
  ]);

  // Données de test pour les CR
  const [reports, setReports] = useState([
    { _id: 'r1', titre: 'AG Ordinaire 2025', date: '15/01/2026', fichier: 'ag_2025.pdf' },
    { _id: 'r2', titre: 'Réunion Bureau n°4', date: '02/02/2026', fichier: 'cr_bureau_04.pdf' },
  ]);

  return (
    <div className="min-h-screen font-['Montserrat'] space-y-10">
      
      {/* HEADER & SWITCHER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-[900] italic uppercase text-[#081031] dark:text-white leading-none mb-4">
            Bureau <span className="text-[#0065FF]">&</span> <span className="text-[#0EE2E2]">Comptes-rendus</span>
          </h2>
          <div className="inline-flex p-1.5 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            <button 
              onClick={() => setActiveTab('membres')}
              className={`px-6 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'membres' ? 'bg-[#0065FF] text-white shadow-lg' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
            >
              Membres du Bureau
            </button>
            <button 
              onClick={() => setActiveTab('cr')}
              className={`px-6 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'cr' ? 'bg-[#0065FF] text-white shadow-lg' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
            >
              Comptes-rendus
            </button>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#081031] dark:bg-[#0EE2E2] text-white dark:text-[#081031] px-8 py-4 rounded-2xl font-[900] uppercase text-xs tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl"
        >
          <Plus size={18} /> {activeTab === 'membres' ? 'Ajouter un membre' : 'Uploader un CR'}
        </button>
      </div>

      {/* CONTENU : MEMBRES */}
      {activeTab === 'membres' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((member) => (
            <div key={member._id} className="group relative bg-white dark:bg-[#081031] rounded-[2.5rem] p-6 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all overflow-hidden text-center">
              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-slate-100 dark:bg-white/5 rounded-full text-[#0065FF] hover:scale-110 transition-transform"><Pencil size={14} /></button>
                <button className="p-2 bg-slate-100 dark:bg-white/5 rounded-full text-red-500 hover:scale-110 transition-transform"><Trash2 size={14} /></button>
              </div>

              {/* Photo Placeholder */}
              <div className="w-24 h-24 bg-slate-100 dark:bg-[#040817] rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-[#0EE2E2]/20">
                {member.photo ? <img src={member.photo} className="rounded-full object-cover" /> : <User size={40} className="text-slate-300" />}
              </div>

              <h3 className="text-xl font-[900] uppercase italic text-[#081031] dark:text-white">{member.prenom} <span className="text-[#0065FF]">{member.nom}</span></h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0EE2E2] mb-4">{member.role}</p>
              
              <div className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 dark:bg-[#040817] rounded-2xl text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <Mail size={12} className="text-[#0065FF]" />
                {member.mail}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONTENU : COMPTES-RENDUS */}
      {activeTab === 'cr' && (
        <div className="bg-white dark:bg-[#081031] rounded-[2.5rem] border border-slate-100 dark:border-white/10 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Document</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date de réunion</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {reports.map((report) => (
                <tr key={report._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl">
                        <FileText size={20} />
                      </div>
                      <span className="font-bold text-sm text-[#081031] dark:text-white">{report.titre}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">{report.date}</td>
                  <td className="px-8 py-5 text-right space-x-2">
                    <button className="p-2 text-slate-400 hover:text-[#0065FF] transition-colors"><Download size={18} /></button>
                    <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL (Placeholder pour ajout) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#081031]/90 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-[#081031] w-full max-w-xl rounded-[3rem] p-8 lg:p-12 border border-white/10 shadow-2xl">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white">
                  Ajouter un <span className="text-[#0EE2E2]">{activeTab === 'membres' ? 'Membre' : 'CR'}</span>
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:rotate-90 transition-all"><X size={28} /></button>
             </div>

             <form className="space-y-5">
               {activeTab === 'membres' ? (
                 <>
                   <div className="grid grid-cols-2 gap-4">
                     <input type="text" placeholder="Prénom" className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none" />
                     <input type="text" placeholder="Nom" className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none" />
                   </div>
                   <input type="text" placeholder="Rôle (ex: Président)" className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none" />
                   <input type="email" placeholder="Email contact" className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none" />
                   <div className="border-2 border-dashed border-slate-200 dark:border-white/10 p-8 rounded-2xl text-center">
                     <Camera size={32} className="mx-auto text-slate-300 mb-2" />
                     <p className="text-[10px] font-black uppercase text-slate-400">Photo du membre</p>
                   </div>
                 </>
               ) : (
                 <>
                   <input type="text" placeholder="Titre du document" className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none" />
                   <input type="date" className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none" />
                   <div className="border-2 border-dashed border-slate-200 dark:border-white/10 p-12 rounded-2xl text-center">
                     <FileText size={32} className="mx-auto text-slate-300 mb-2" />
                     <p className="text-[10px] font-black uppercase text-slate-400">Glisser le PDF ici</p>
                   </div>
                 </>
               )}
               <button className="w-full bg-[#0065FF] text-white p-5 rounded-[2rem] font-[900] uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-[#081031] transition-all">
                 <Save size={18} /> Enregistrer
               </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}