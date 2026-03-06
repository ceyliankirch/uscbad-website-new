import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  id: { type: String }, // ID généré par le front
  name: { type: String },
  duration: { type: String },
  description: { type: String },
  variants: { type: String }
});

const TrainingSessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  group: { type: String, required: true },
  theme: { type: String },
  playersCount: { type: String },
  warmups: [ExerciseSchema],
  routines: [ExerciseSchema],
  matches: [ExerciseSchema],
  freeplayMinutes: { type: Number, default: 0 },
  notes: { type: String }
}, { timestamps: true });

// Déclaration séparée pour satisfaire l'analyse statique de Turbopack
const TrainingSession = mongoose.models.TrainingSession || mongoose.model('TrainingSession', TrainingSessionSchema);

export default TrainingSession;