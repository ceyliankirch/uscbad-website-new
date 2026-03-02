// app/api/score/route.js
import { NextResponse } from 'next/server';
import connectMongo from '../../../lib/mongodb';
import Score from '../../../models/Score';

// Configuration du segment (App Router)
export const dynamic = 'force-dynamic'; 

/**
 * RÉCUPÉRATION DU SCORE
 */
export async function GET() {
  try {
    await connectMongo();
    // On récupère le document le plus récent
    const score = await Score.findOne().sort({ updatedAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      data: score || {
        division: 'NATIONALE 1',
        date: 'À venir',
        homeTeam: 'US CRÉTEIL',
        homeScore: 0,
        awayTeam: 'ADVERSAIRE',
        awayScore: 0
      } 
    });
  } catch (error) {
    console.error("Erreur GET Score:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * MISE À JOUR DU SCORE
 */
export async function POST(req) {
  try {
    await connectMongo();
    
    // Dans l'App Router, le body se récupère ainsi
    const body = await req.json();
    
    // On prépare les données (vérifie que les noms correspondent à ton schéma Mongoose)
    const updateData = {
      division: body.division,
      date: body.date,
      homeTeam: body.homeTeam,
      homeScore: body.homeScore,
      homeLogo: body.homeLogo,
      homeColor: body.homeColor,
      homeTextColor: body.homeTextColor, // <--- AJOUT
      awayTeam: body.awayTeam,
      awayScore: body.awayScore,
      awayLogo: body.awayLogo,
      awayColor: body.awayColor,
      awayTextColor: body.awayTextColor  // <--- AJOUT
    };

    // findOneAndUpdate avec {} mettra à jour le tout premier document trouvé
    // upsert: true permet de le créer s'il n'existe pas encore
    const score = await Score.findOneAndUpdate({}, updateData, { 
      new: true, 
      upsert: true,
      setDefaultsOnInsert: true 
    });
    
    return NextResponse.json({ success: true, data: score });
  } catch (error) {
    console.error("Erreur POST Score:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}