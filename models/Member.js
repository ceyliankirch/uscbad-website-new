import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  sexe: { type: String, enum: ['H', 'F'], required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  licence: { type: String, required: true, unique: true },
  email: { type: String },
  telephone: { type: String },
  category: { type: String, default: 'Non assigné' }, // Catégorie pour les filtres (Loisirs, Jeunes, etc.)
}, { timestamps: true });

// Évite l'erreur de recompilation en développement
export default mongoose.models.Member || mongoose.model('Member', MemberSchema);