import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect'; 
import TeamMember from '../../../models/TeamMember';

// GET : Récupérer tous les membres (avec option de filtre par catégorie)
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // Ex: ?category=performance

    let query = {};
    if (category) {
      query.category = category;
    }

    // On trie par ordre (order) puis par date de création
    const members = await TeamMember.find(query).sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json({ success: true, data: members }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// POST : Créer un nouveau membre
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const newMember = await TeamMember.create(body);
    
    return NextResponse.json({ success: true, data: newMember }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}