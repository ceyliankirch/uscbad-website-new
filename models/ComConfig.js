import mongoose from 'mongoose';

const ComConfigSchema = new mongoose.Schema({
  instagramText: { type: String, default: "Résultats en direct, coulisses, stories et photos exclusives." },
  facebookText: { type: String, default: "Toutes les annonces officielles, événements et albums photos complets." },
  emailText: { type: String, default: "Pour toute demande d'interview, sponsoring ou utilisation de nos visuels." },
  emailAddress: { type: String, default: "com@uscbad.fr" },
  whatsappLink: { type: String, default: "#" }
}, { timestamps: true });

export default mongoose.models.ComConfig || mongoose.model('ComConfig', ComConfigSchema);