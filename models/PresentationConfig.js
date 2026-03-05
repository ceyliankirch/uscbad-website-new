import mongoose from 'mongoose';

const PresentationConfigSchema = new mongoose.Schema({
  hero: {
    coverImage: { type: String },
    badgeText: { type: String, default: 'Depuis 1982' },
    title1: { type: String, default: "L'ÂME DU" },
    title2: { type: String, default: 'CLUB' },
    description: { type: String, default: "Plus qu'un simple club de sport..." }
  },
  stats: [{
    value: Number,
    suffix: String,
    label: String,
    color: String,
    icon: String
  }],
  history: {
    title1: String,
    title2: String,
    subtitle: String,
    p1: String,
    p2: String,
    quote: String,
    img1: String,
    img1Num: String,
    img1Text: String,
    img2: String,
    img2Num: String,
    img2Text: String
  },
  profiles: [{
    title: String,
    subtitle: String,
    desc: String,
    img: String,
    color: String
  }],
  gyms: [{
    title: String,
    badge: String,
    address: String,
    tags: [String],
    mapLink: String,
    img: String
  }],
  bureau: [{
    name: String,
    role: String,
    email: String,
    phone: String,
    img: String,
    color: String
  }],
  coaches: [{
    name: String,
    role: String,
    email: String,
    phone: String,
    img: String,
    color: String
  }]
}, { timestamps: true });

export default mongoose.models.PresentationConfig || mongoose.model('PresentationConfig', PresentationConfigSchema);