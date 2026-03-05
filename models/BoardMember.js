import mongoose from 'mongoose';

const BoardMemberSchema = new mongoose.Schema({
  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  role: { type: String, required: true },
  mail: { type: String },
  photo: { type: String } // Image encodée en Base64
}, { timestamps: true });

export default mongoose.models.BoardMember || mongoose.model('BoardMember', BoardMemberSchema);