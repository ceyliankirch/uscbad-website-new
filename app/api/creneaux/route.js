import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Planning from '@/models/Creneau';

// RÉCUPÉRER TOUS LES CRÉNEAUX
export async function GET() {
  await dbConnect();
  try {
    // On récupère tout, le tri se fera côté client par tes fonctions de groupe
    const sessions = await Planning.find({});
    return NextResponse.json({ success: true, data: sessions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// CRÉER UN NOUVEAU CRÉNEAU
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();

    // Debug: regarde ton terminal après avoir cliqué sur "Sauvegarder"
    console.log("Données reçues pour création :", body);

    // Sécurité : on s'assure que isInterclub est traité comme un booléen
    const sessionData = {
      ...body,
      isInterclub: body.isInterclub === true || body.isInterclub === 'true'
    };

    const session = await Planning.create(sessionData);
    
    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch (error) {
    console.error("Erreur création créneau:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}