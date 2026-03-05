import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Attention, en prod, il faudra hasher ce mot de passe avec bcrypt !
  role: { type: String, enum: ['user', 'coach', 'admin'], default: 'user' },
  image: { type: String, default: null }, // Champ ajouté pour stocker la photo de profil (Base64 ou URL)
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);