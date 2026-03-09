import mongoose from 'mongoose';

// Sous-schéma pour le palmarès
const PalmaresSchema = new mongoose.Schema({
  serie: String,
  sh: String,
  sd: String,
  dh: String,
  dd: String,
  dx: String
});

const TournamentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  type: { type: String, enum: ['tournoi', 'promobad'], required: true },
  dateStr: { type: String }, 
  location: { type: String },
  levels: { type: String },
  registrationLink: { type: String }, 
  status: { type: String, default: 'a_venir' },
  spotsLeft: { type: Number },
  color: { type: String, default: '#0065FF' },
  description: { type: String },
  
  // Images et Liens d'édition
  heroImage: { type: String },
  mainVisual: { type: String },
  tournamentLogo: { type: String },
  gymImage: { type: String },
  canvaLink: { type: String }, // <-- LE CHAMP MANQUANT EST ICI !
  
  // Contenu détaillé
  disciplines: { type: String },
  buvetteDescription: { type: String },
  amenities: { type: String },
  googleMapsLink: { type: String },
  
  // Sponsor
  sponsor: {
    name: String,
    logoUrl: String,
    website: String
  },
  
  // Médias
  googlePhotosLink: { type: String },
  galleryImages: { type: [String], default: ['', '', '', ''] },
  
  // Résultats
  palmares: [PalmaresSchema]
  
}, { timestamps: true });

export default mongoose.models.Tournament || mongoose.model('Tournament', TournamentSchema);