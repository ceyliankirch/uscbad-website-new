import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';

// GET : Récupérer les événements (utilisé par la page publique et l'admin)
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Si on filtre par catégorie (optionnel)
    let query = {};
    if (category && category !== 'Tous') query.category = category;

    // Récupère et trie par date (du plus ancien au plus lointain)
    const events = await Event.find(query).sort({ isoDate: 1 });
    
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// POST : Ajouter un nouvel événement (utilisé par l'admin)
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newEvent = await Event.create(body);
    
    return NextResponse.json({ success: true, data: newEvent });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}