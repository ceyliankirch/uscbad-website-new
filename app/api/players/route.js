import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // ⚠️ Ajuste le chemin si ton fichier s'appelle dbConnect.js
import Player from '@/models/Player';

// GET : Récupérer tous les joueurs (avec option de filtre par équipe)
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const team = searchParams.get('team'); // Ex: ?team=equipe-1

    let query = {};
    if (team) {
      query.team = team;
    }

    // On trie par ordre d'affichage (order) puis par date de création
    const players = await Player.find(query).sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json({ success: true, data: players }, { status: 200 });
  } catch (error) {
    console.error("Erreur GET players :", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// POST : Créer un nouveau joueur
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const newPlayer = await Player.create(body);
    
    return NextResponse.json({ success: true, data: newPlayer }, { status: 201 });
  } catch (error) {
    console.error("Erreur POST player :", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}