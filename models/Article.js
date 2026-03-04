import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Le titre est obligatoire'], trim: true },
  category: { type: String, default: 'Club' }, // Ex: Club, Compétition, Événement
  excerpt: { type: String, required: true }, // Un petit résumé pour la carte
  content: { type: String, required: true }, // Le texte complet de l'article
  imageUrl: { type: String, default: '' }, // L'image de couverture
  author: { type: String, default: 'Le Bureau' },
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);