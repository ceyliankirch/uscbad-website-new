import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
  division: String,
  date: String,
  homeTeam: String,
  homeScore: String,
  homeLogo: String,
  homeColor: String,
  homeTextColor: String, // <--- INDISPENSABLE
  awayTeam: String,
  awayScore: String,
  awayLogo: String,
  awayColor: String,
  awayTextColor: String, // <--- INDISPENSABLE
}, { timestamps: true });

export default mongoose.models.Score || mongoose.model('Score', ScoreSchema);