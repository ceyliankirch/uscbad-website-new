import mongoose from 'mongoose';

const EmailCampaignSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  audience: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.EmailCampaign || mongoose.model('EmailCampaign', EmailCampaignSchema);