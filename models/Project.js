import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  id: { type: String },
  desc: { type: String },
  done: { type: Boolean, default: false }
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['Idée', 'Préparation', 'Prêt', 'Terminé'], default: 'Idée' },
  targetDate: { type: String },
  manager: { type: String },
  budget: { type: Number, default: 0 },
  tasks: [TaskSchema]
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);