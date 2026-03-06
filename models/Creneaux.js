import mongoose from 'mongoose';

const CreneauSchema = new mongoose.Schema({
  title: { type: String, required: false, default: '' }, // Optionnel pour le Jeu Libre
  type: { 
    type: String, 
    required: true, 
    enum: ['Adultes - Loisirs', 'Adultes - Compétiteurs', 'Jeunes', 'Jeu Libre', 'Pôle Féminin', 'Indivs'] 
  },  
  day: { 
    type: String, 
    required: true, 
    enum: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] 
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  gymnasium: { type: String, required: true },
  coach: { type: String, default: '' }, 
  isInterclub: { type: Boolean, default: false },
}, { timestamps: true });

// On exporte 'Creneau' (singulier)
export default mongoose.models.Creneau || mongoose.model('Creneau', CreneauSchema);