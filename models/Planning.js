import mongoose from 'mongoose';

const PlanningSchema = new mongoose.Schema({
  day: { type: String, required: true }, // Lundi, Mardi...
  category: { type: String, enum: ['entraînement', 'jeu-libre'], required: true },
  type: { type: String, required: true }, // Jeunes, Adultes, Public
  title: { type: String, required: true }, // Bad Pouss', Équipes 1/2/3...
  time: { type: String, required: true }, // 17h00 - 18h30
  gym: { type: String, required: true },
  coach: { type: String, default: '' },
  order: { type: Number, default: 0 } // Pour trier les créneaux dans la journée
}, { timestamps: true });

export default mongoose.models.Planning || mongoose.model('Planning', PlanningSchema);