'use client';
import React, { useState } from 'react';
import { 
  Plus, Pencil, Trash2, Clock, MapPin, 
  User, X, Save 
} from 'lucide-react';

export default function AdminPlanning() {
  const [activeTab, setActiveTab] = useState('entraînement'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  // Liste de Lundi à Samedi uniquement
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];



const [sessions, setSessions] = useState([
  // --- ENTRAÎNEMENTS ---
  { _id: 'e1', day: 'Lundi', type: 'Jeunes', title: "Bad Pouss'", time: '17h - 18h30', gym: 'M.T.E.', coach: 'Julie', category: 'entraînement' },
  { _id: 'e1b', day: 'Lundi', type: 'Jeunes', title: "Espoirs", time: '18h30 - 20h', gym: 'M.T.E.', coach: 'Thomas', category: 'entraînement' },
  { _id: 'e1c', day: 'Lundi', type: 'Adultes', title: "Compétiteurs", time: '20h - 22h', gym: 'Jeu de Paume', coach: 'Thomas', category: 'entraînement' },
  { _id: 'e2', day: 'Mardi', type: 'Adultes', title: 'Interclubs', time: '20h - 22h', gym: 'Pasteur', coach: '-', category: 'entraînement' },
  { _id: 'e3', day: 'Mercredi', type: 'Jeunes', title: 'Espoirs', time: '14h - 16h', gym: 'Casalis', coach: 'Julie', category: 'entraînement' },
  { _id: 'e3b', day: 'Mercredi', type: 'Jeunes', title: 'Elite Jeunes', time: '16h - 18h', gym: 'Casalis', coach: 'Thomas', category: 'entraînement' },
  { _id: 'e4', day: 'Jeudi', type: 'Jeunes', title: 'Jeunes 1', time: '17h30 - 19h', gym: 'Pasteur', coach: 'Ben', category: 'entraînement' },
  { _id: 'e4b', day: 'Jeudi', type: 'Jeunes', title: 'Jeunes 2', time: '19h - 20h30', gym: 'Pasteur', coach: 'Ben', category: 'entraînement' },
  { _id: 'e4c', day: 'Jeudi', type: 'Adultes', title: 'Elite', time: '20h30 - 22h30', gym: 'Pasteur', coach: 'Thomas', category: 'entraînement' },
  { _id: 'e5', day: 'Vendredi', type: 'Adultes', title: 'Loisirs', time: '18h - 20h', gym: 'M.T.E.', coach: 'Ben', category: 'entraînement' },
  { _id: 'e5b', day: 'Vendredi', type: 'Adultes', title: 'Elite', time: '20h - 22h30', gym: 'Jeu de Paume', coach: 'Thomas', category: 'entraînement' },
  { _id: 'e6', day: 'Samedi', type: 'Jeunes', title: 'Ecole de Bad', time: '10h - 12h', gym: 'M.T.E.', coach: 'Julie', category: 'entraînement' },

  // --- JEU LIBRE ---
  { _id: 'j1', day: 'Lundi', type: 'Public', title: 'Jeu Libre / IC', time: '20h30 - 22h30', gym: 'Jeu de Paume', category: 'jeu-libre' },
  { _id: 'j2', day: 'Mardi', type: 'Public', title: 'Jeu Libre', time: '20h - 22h30', gym: 'Pasteur', category: 'jeu-libre' },
  { _id: 'j3', day: 'Mercredi', type: 'Public', title: 'Jeu Libre', time: '20h - 22h', gym: 'Casalis', category: 'jeu-libre' },
  { _id: 'j4', day: 'Jeudi', type: 'Public', title: 'Jeu Libre', time: '20h - 22h30', gym: 'Pasteur', category: 'jeu-libre' },
  { _id: 'j5', day: 'Vendredi', type: 'Public', title: 'Jeu Libre', time: '18h - 20h', gym: 'M.T.E.', category: 'jeu-libre' },
  { _id: 'j6', day: 'Samedi', type: 'Public', title: 'Jeu Libre Matin', time: '12h - 14h', gym: 'Casalis', category: 'jeu-libre' }, // Nouveau créneau
  { _id: 'j7', day: 'Samedi', type: 'Public', title: 'Jeu Libre Soir', time: '18h - 20h', gym: 'Casalis', category: 'jeu-libre' }, // Nouveau créneau
]);

  const openModal = (session = null) => {
    setEditingSession(session);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen font-['Montserrat'] space-y-10">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-[900] italic uppercase text-[#081031] dark:text-white leading-none mb-4">
            Gestion du <span className="text-[#0065FF]">Planning</span>
          </h2>
          <div className="inline-flex p-1.5 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            <button 
              onClick={() => setActiveTab('entraînement')}
              className={`px-6 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'entraînement' ? 'bg-[#0065FF] text-white shadow-lg' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
            >
              Entraînements
            </button>
            <button 
              onClick={() => setActiveTab('jeu-libre')}
              className={`px-6 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'jeu-libre' ? 'bg-[#0065FF] text-white shadow-lg' : 'text-slate-500 hover:text-[#081031] dark:hover:text-white'}`}
            >
              Jeu Libre
            </button>
          </div>
        </div>

        <button 
          onClick={() => openModal()}
          className="bg-[#081031] dark:bg-[#0EE2E2] text-white dark:text-[#081031] px-8 py-4 rounded-2xl font-[900] uppercase text-xs tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl"
        >
          <Plus size={18} /> Ajouter
        </button>
      </div>

      {/* GRILLE - Forcée sur 6 colonnes sur grand écran */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-6 items-start">
        {days.map((day) => (
          <div key={day} className="flex flex-col gap-4">
            {/* Titre du Jour */}
            <div className="flex items-center gap-2 mb-2 border-b border-slate-100 dark:border-white/5 pb-2">
              <div className="h-4 w-1 bg-[#0EE2E2] rounded-full" />
              <h3 className="text-lg font-[900] italic uppercase text-[#081031] dark:text-white">{day}</h3>
            </div>
            
            {/* Liste des créneaux pour ce jour */}
            <div className="flex flex-col gap-3 min-h-[100px]">
                {sessions
                    .filter(s => s.day === day && s.category === activeTab)
                    .sort((a, b) => a.time.localeCompare(b.time)) // Optionnel : trier par heure
                    .map((session) => (
                    <AdminSessionCard 
                        key={session._id} 
                        session={session} 
                        onEdit={() => openModal(session)}
                    />
                    ))
                }
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <PlanningFormModal 
          session={editingSession} 
          category={activeTab}
          daysList={days}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}

/* --- CARTE COMPOSANT --- */
const AdminSessionCard = ({ session, onEdit }) => {
  const isJeunes = session.type === 'Jeunes';
  return (
    <div className={`group relative p-5 rounded-[2rem] border transition-all hover:shadow-xl ${
      isJeunes 
        ? 'bg-[#081031] border-[#0EE2E2]/30 text-white' 
        : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-white/10 text-[#081031] dark:text-white shadow-sm'
    }`}>
      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={onEdit} className="p-2 bg-[#0065FF] text-white rounded-full shadow-lg hover:scale-110 transition-transform">
          <Pencil size={12} />
        </button>
        <button className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
          <Trash2 size={12} />
        </button>
      </div>

      <div className="mb-2">
        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
          isJeunes ? 'bg-[#0EE2E2] text-[#081031]' : 'bg-slate-100 dark:bg-white/10 text-slate-500'
        }`}>
          {session.title}
        </span>
      </div>
      
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-[#0065FF] dark:text-[#0EE2E2]" />
          <span className="font-[900] italic text-sm leading-none">{session.time}</span>
        </div>
        <div className="flex items-center gap-2 opacity-50">
          <MapPin size={11} />
          <span className="font-bold text-[9px] uppercase truncate">{session.gym}</span>
        </div>
      </div>
    </div>
  );
};

/* --- MODAL FORMULAIRE --- */
function PlanningFormModal({ session, category, daysList, onClose }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#081031]/95 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-[#081031] w-full max-w-xl rounded-[3rem] shadow-2xl p-8 lg:p-12 border border-white/10 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-[900] italic uppercase text-[#081031] dark:text-white">
              {session ? 'Modifier' : 'Nouveau'} <span className="text-[#0065FF]">{category}</span>
            </h3>
            <button onClick={onClose} className="p-2 text-slate-400 hover:rotate-90 transition-all"><X size={24} /></button>
        </div>
        
        <form className="grid grid-cols-2 gap-5" onSubmit={(e) => e.preventDefault()}>
          <div className="col-span-1 space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest ml-2 opacity-50">Jour</label>
            <select defaultValue={session?.day} className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none appearance-none">
              {daysList.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="col-span-1 space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest ml-2 opacity-50">Public</label>
            <select defaultValue={session?.type} className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none appearance-none">
              <option>Adultes</option><option>Jeunes</option><option>Public / IC</option>
            </select>
          </div>
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest ml-2 opacity-50">Titre (ex: Espoirs)</label>
            <input defaultValue={session?.title} type="text" className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#0065FF]" />
          </div>
          <div className="col-span-1 space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest ml-2 opacity-50">Horaires</label>
            <input defaultValue={session?.time} type="text" placeholder="18h - 20h" className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#0065FF]" />
          </div>
          <div className="col-span-1 space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest ml-2 opacity-50">Gymnase</label>
            <input defaultValue={session?.gym} type="text" className="w-full bg-slate-50 dark:bg-[#040817] border border-slate-200 dark:border-white/10 p-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#0065FF]" />
          </div>
          
          <button className="col-span-2 bg-[#0065FF] text-white p-5 rounded-[2rem] font-[900] uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-[#081031] transition-all mt-4">
            <Save size={18} /> Sauvegarder
          </button>
        </form>
      </div>
    </div>
  );
}