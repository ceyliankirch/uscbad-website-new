import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

const BuvetteMenuSchema = new mongoose.Schema({
  title: { type: String, required: true },
  items: [MenuItemSchema]
}, { timestamps: true });

// Déclaration séparée pour satisfaire l'analyse statique de Turbopack
const BuvetteMenu = mongoose.models.BuvetteMenu || mongoose.model('BuvetteMenu', BuvetteMenuSchema);

export default BuvetteMenu;