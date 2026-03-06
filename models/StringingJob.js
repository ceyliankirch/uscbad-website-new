import mongoose from 'mongoose';

const StringingJobSchema = new mongoose.Schema({
  player: { type: String, required: true },
  racquet: { type: String },
  stringId: { type: String, required: true }, // Fait référence à l'ID de la bobine utilisée
  tensionMains: { type: Number, default: 11 },
  tensionCrosses: { type: Number, default: 11 },
  knots: { type: Number, default: 4 },
  status: { type: String, enum: ['waiting', 'stringing', 'ready', 'delivered'], default: 'waiting' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  date: { type: String, required: true },
  notes: { type: String }
}, { timestamps: true });

const StringingJob = mongoose.models.StringingJob || mongoose.model('StringingJob', StringingJobSchema);

export default StringingJob;