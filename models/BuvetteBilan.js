import mongoose from 'mongoose';

const BuvetteBilanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  revenue: { type: Number, required: true },
  cost: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.models.BuvetteBilan || mongoose.model('BuvetteBilan', BuvetteBilanSchema);