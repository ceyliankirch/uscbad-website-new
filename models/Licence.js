import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  roles: { type: [String], default: ['user'] }, 
  role: { type: String, default: 'user' }, 
  image: { type: String, default: null }, 
  licence: { type: String, default: '' }, // <-- Le champ licence est ici !
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);