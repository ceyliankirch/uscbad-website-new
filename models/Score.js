// models/Score.js
import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  division: String,
  date: String,
  // Équipe Domicile
  homeTeam: String,
  homeScore: String,
  homeLogo: String, // Stockera le Base64 ou l'URL
  homeColor: String, // Stockera le code Hexa (ex: #0EE2E2)
  // Équipe Extérieur
  awayTeam: String,
  awayScore: String,
  awayLogo: String,
  awayColor: String,
}, { timestamps: true });

export default mongoose.models.Score || mongoose.model('Score', scoreSchema);