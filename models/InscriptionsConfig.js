import mongoose from 'mongoose';

const InscriptionsConfigSchema = new mongoose.Schema({
  saison: { type: String, default: 'Saison 2024 - 2025' },
  inscriptionLink: { type: String, default: 'https://myffbad.fr' },
  banner: {
    visible: { type: Boolean, default: false },
    title: { type: String, default: 'Inscriptions ouvertes !' },
    subtitle: { type: String, default: 'Les inscriptions pour la nouvelle saison sont désormais ouvertes. Rejoignez-nous !' },
  },
  tarifs: [{
    title: { type: String },
    desc: { type: String },
    price: { type: String },
    badgeColor: { type: String, default: '#0065FF' },
    textDark: { type: Boolean, default: false }
  }],
  notes: [{ type: String }]
}, { timestamps: true });

export default mongoose.models.InscriptionsConfig || mongoose.model('InscriptionsConfig', InscriptionsConfigSchema);
