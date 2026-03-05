import mongoose from 'mongoose';

const TeamPlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // ex: Simple Homme / Double
  rank: { type: String, required: true }, // ex: N1
  gender: { type: String, enum: ['male', 'female'], default: 'male' },
  played: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  anecdote: { type: String },
  image: { type: String }, // Stockage Base64
  team: { type: String, default: 'N1' }, // Pour filtrer par équipe (N1, Eq2, etc.)
  order: { type: Number, default: 0 }, // Pour gérer l'ordre d'affichage
}, { timestamps: true });

export default mongoose.models.TeamPlayer || mongoose.model('TeamPlayer', TeamPlayerSchema);