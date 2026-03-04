// models/TeamMember.js
import mongoose from 'mongoose';

const TeamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Le rôle est obligatoire'],
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['performance', 'developpement', 'officiel', 'geo', 'buvette'], 
    // performance/developpement = Page Entraîneurs
    // officiel/geo/buvette = Page Bénévoles
  },
  image: {
    type: String,
    default: '', // URL de l'image (Cloudinary, AWS S3, ou URL externe)
  },
  color: {
    type: String,
    default: '#0065FF', // Code couleur HEX pour la bordure de la carte
  },
  tags: {
    type: [String],
    default: [], // Ex: ["Équipes 1 à 3", "Haut Niveau"]
  },
  order: {
    type: Number,
    default: 0, // Pour trier l'ordre d'affichage
  },
  trainerRoles: { type: [String], default: [] }
}, {
  timestamps: true,
});

export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);