import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team: { 
    type: String, 
    required: true,
    enum: ['equipe-1', 'performance-jeunes'] // Les deux grandes catégories
  },
  category: { type: String }, // Ex: "Cadet", "Sénior"
  rank: { type: String }, // Ex: "N2 / N3", "R4"
  titles: { type: String }, // Ex: "Champion régional"
  image: { type: String, default: '' },
  accentColor: { type: String, default: '#0065FF' },
  badge: { type: String, default: '' }, // Ex: "Capitaine", "Future Championne 🏆"
  order: { type: Number, default: 0 }
}, { 
  timestamps: true 
});

export default mongoose.models.Player || mongoose.model('Player', PlayerSchema);