import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
  division: String,
  date: String,
  homeTeam: String,
  homeScore: String,
  homeLogo: String,
  homeColor: String,
  homeTextColor: String,
  awayTeam: String,
  awayScore: String,
  awayLogo: String,
  awayColor: String,
  awayTextColor: String,
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Score || mongoose.model('Score', ScoreSchema);