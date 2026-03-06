import mongoose from 'mongoose';

const StringStockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String },
  gauge: { type: String },
  totalCapacity: { type: Number, default: 20 },
  remaining: { type: Number, default: 20 },
  price: { type: Number, default: 0 },
  cost: { type: Number, default: 0 }
}, { timestamps: true });

// Déclaration séparée pour satisfaire l'analyse statique de Turbopack
const StringStock = mongoose.models.StringStock || mongoose.model('StringStock', StringStockSchema);

export default StringStock;