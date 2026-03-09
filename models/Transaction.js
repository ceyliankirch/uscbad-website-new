import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true }, // income = Recette, expense = Dépense
  category: { type: String, required: true }, // Inscriptions, Subventions, Équipement, etc.
  notes: { type: String }
}, { timestamps: true });

// Déclaration séparée pour satisfaire l'analyse statique de Turbopack
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

export default Transaction;