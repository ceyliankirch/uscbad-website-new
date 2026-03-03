import mongoose from 'mongoose';

// Sous-schéma pour organiser le palmarès proprement
const PalmaresSchema = new mongoose.Schema({
  serie: { type: String, default: '' },
  sh: { type: String, default: '' }, // Simple Homme
  sd: { type: String, default: '' }, // Simple Dame
  dh: { type: String, default: '' }, // Double Homme
  dd: { type: String, default: '' }, // Double Dame
  dx: { type: String, default: '' }  // Double Mixte
});

const TournamentSchema = new mongoose.Schema({
  // --- GÉNÉRAL ---
  title: { type: String, required: [true, 'Le titre est obligatoire'], trim: true },
  subtitle: { type: String, trim: true },
  type: { type: String, enum: ['tournoi', 'promobad'], required: true },
  dateStr: { type: String, required: true },
  location: { type: String, required: true },
  levels: { type: String, required: true },
  registrationLink: { type: String, default: '' },
  status: { type: String, enum: ['a_venir', 'ouvert', 'complet', 'termine'], default: 'a_venir' },
  spotsLeft: { type: Number, default: null },
  color: { type: String, default: '#0065FF' },
  tournamentLogo: { type: String, default: '' },
  mainVisual: { type: String, default: '' },

  title: { type: String, required: [true, 'Le titre est obligatoire'], trim: true },
  subtitle: { type: String, trim: true },
  type: { type: String, enum: ['tournoi', 'promobad'], required: true },
  dateStr: { type: String, required: true },
  location: { type: String, required: true },
  googleMapsLink: { type: String, default: '' },
  heroImage: { type: String, default: '' },

  // --- CONTENU PERSONNALISÉ ---
  description: { type: String, default: '' }, // "Le mot du club"
  gymImage: { type: String, default: '' }, // Photo du gymnase  
  // 👇 NOUVEAUX CHAMPS POUR L'ONGLET INFOS 👇
  disciplines: { type: String, default: 'Simples, Doubles, Mixtes' },
  buvetteDescription: { type: String, default: "Les joueurs et supporters pourront profiter de notre espace buvette tout au long de l'événement. Croque-monsieurs, crêpes, boissons et snacks pour recharger les batteries !" },
  amenities: { type: String, default: 'Parking gratuit sur place, Vestiaires & Douches, Tribunes' },
  
  // --- SPONSOR ---
  sponsor: {
    name: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    website: { type: String, default: '' }
  },

  // --- MÉDIAS & RÉSULTATS ---
  googlePhotosLink: { type: String, default: '' }, // Lien vers l'album complet
  galleryImages: [{ type: String }], // Tableau contenant les URLs des 4 images Best-Of
  palmares: [PalmaresSchema] // Tableau contenant les résultats par série
}, {
  timestamps: true,
});

export default mongoose.models.Tournament || mongoose.model('Tournament', TournamentSchema);