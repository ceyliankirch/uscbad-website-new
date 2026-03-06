import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  
  // C'EST CE CHAMP QUI PERMET DE SAUVEGARDER PLUSIEURS CASES COCHÉES
  roles: { type: [String], default: ['user'] }, 
  
  role: { type: String, default: 'user' }, // On le garde au cas où pour les anciens comptes
  image: { type: String, default: null }, 
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);