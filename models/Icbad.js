import mongoose from 'mongoose';

const IcbadConfigSchema = new mongoose.Schema({
  team1Url: { type: String, default: 'https://icbad.ffbad.org/equipe/58349' },
  clubUrl: { type: String, default: 'https://icbad.ffbad.org/instance/USC94' },
  team1Id: { type: String, default: '94-USC-1' },
  team2Id: { type: String, default: '94-USC-2' },
  team3Id: { type: String, default: '94-USC-3' },
}, { timestamps: true });

export default mongoose.models.IcbadConfig || mongoose.model('IcbadConfig', IcbadConfigSchema);