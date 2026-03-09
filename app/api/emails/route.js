import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import EmailCampaign from '@/models/EmailCampaign';

// GET : Récupérer l'historique des emails envoyés
export async function GET() {
  try {
    await dbConnect();
    // On trie du plus récent au plus ancien
    const campaigns = await EmailCampaign.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: campaigns });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST : Enregistrer une nouvelle campagne envoyée
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newCampaign = await EmailCampaign.create(body);
    return NextResponse.json({ success: true, data: newCampaign }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}