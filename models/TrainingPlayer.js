import mongoose from 'mongoose';

const TrainingPlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  group: { type: String, required: true }
}, { timestamps: true });

// Déclaration séparée pour satisfaire l'analyse statique de Turbopack
const TrainingPlayer = mongoose.models.TrainingPlayer || mongoose.model('TrainingPlayer', TrainingPlayerSchema);

export default TrainingPlayer;