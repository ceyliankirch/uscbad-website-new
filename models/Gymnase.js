import mongoose from 'mongoose';

const GymnaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  googleMapsUrl: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.models.Gymnase || mongoose.model('Gymnase', GymnaseSchema);