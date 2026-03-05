import mongoose from 'mongoose';

const GalleryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String },
  img: { type: String, required: true },
  order: { type: Number, default: 0 },
  isBanger: { type: Boolean, default: false } // Ajout du statut Banger
}, { timestamps: true });

export default mongoose.models.GalleryItem || mongoose.model('GalleryItem', GalleryItemSchema);