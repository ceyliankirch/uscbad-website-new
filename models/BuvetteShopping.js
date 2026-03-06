import mongoose from 'mongoose';

// Nous utilisons un seul document qui stocke toute la liste sous forme de dictionnaire
// Cela permet de cocher/décocher extrêmement rapidement dans le Dashboard.
const BuvetteShoppingSchema = new mongoose.Schema({
  list: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export default mongoose.models.BuvetteShopping || mongoose.model('BuvetteShopping', BuvetteShoppingSchema);