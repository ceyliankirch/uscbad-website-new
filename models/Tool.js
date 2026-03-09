import mongoose from 'mongoose';

const ToolSchema = new mongoose.Schema({
  name: { type: String, required: true }, // ex: Canva, OVH, Google Workspace
  identifier: { type: String, required: true }, // ex: contact@uscreteil.com
  password: { type: String, required: true }, 
  url: { type: String }, // Lien vers la page de connexion
  logo: { type: String } // Logo encodé en Base64
}, { timestamps: true });

export default mongoose.models.Tool || mongoose.model('Tool', ToolSchema);