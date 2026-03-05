import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Compétition', 'Vie du Club', 'Stages'] 
  },
  isoDate: { type: String, required: true }, // Format YYYY-MM-DD pour permettre un tri chronologique facile
  dateDisplay: { type: String }, // Texte libre (ex: "06 & 07 Juin 2026")
  time: { type: String },
  location: { type: String },
  description: { type: String },
  image: { type: String }, // Si tu veux ajouter une image plus tard
  color: { type: String, default: '#0065FF' }, // Couleur du badge associé
}, { timestamps: true });

// On vérifie si le modèle existe déjà pour éviter les erreurs de recompilation en local avec Next.js
export default mongoose.models.Event || mongoose.model('Event', EventSchema);