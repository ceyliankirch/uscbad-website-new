import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  category: { type: String, required: true }, // 'Le Salé', 'Le Sucré', 'Rafraichissements'
  name: { type: String, required: true },
  price: { type: Number, required: true },
  // On passe en "Mixed" pour accepter l'ancien format texte et le nouveau format liste
  variants: { type: mongoose.Schema.Types.Mixed, default: [] } 
});

const BuvetteMenuSchema = new mongoose.Schema({
  title: { type: String, required: true },
  edition: { type: String }, // Ex: "2024", "Édition Noël"
  color: { type: String, default: '#F72585' }, // <-- NOUVEAU : Couleur personnalisable du titre
  items: [MenuItemSchema]
}, { timestamps: true });

// Déclaration séparée pour satisfaire l'analyse statique de Turbopack
const BuvetteMenu = mongoose.models.BuvetteMenu || mongoose.model('BuvetteMenu', BuvetteMenuSchema);

export default BuvetteMenu;