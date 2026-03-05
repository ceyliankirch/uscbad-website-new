import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  date: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'texte'], required: true },
  fichier: { type: String }, // Utilisé pour stocker le PDF en Base64
  contenu: { type: String }  // Utilisé pour stocker le Markdown de l'IA
}, { timestamps: true });

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);