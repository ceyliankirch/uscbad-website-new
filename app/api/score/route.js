// app/api/score/route.js
import { NextResponse } from 'next/server';
import connectMongo from '../../../lib/mongodb';
import Score from '../../../models/Score';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Autorise jusqu'à 10Mo pour les logos
    },
  },
};

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectMongo();
    const score = await Score.findOne().sort({ updatedAt: -1 }); // On prend le plus récent
    return NextResponse.json({ success: true, data: score || {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectMongo();
    const body = await req.json();
    
    // On extrait tout pour être sûr de ne rien oublier
    const { 
      division, date, 
      homeTeam, homeScore, homeLogo, homeColor, 
      awayTeam, awayScore, awayLogo, awayColor 
    } = body;

    const updateData = {
      division, date,
      homeTeam, homeScore, homeLogo, homeColor,
      awayTeam, awayScore, awayLogo, awayColor
    };

    // Met à jour le premier document trouvé ou le crée
    const score = await Score.findOneAndUpdate({}, updateData, { 
      new: true, 
      upsert: true,
      setDefaultsOnInsert: true 
    });
    
    return NextResponse.json({ success: true, data: score });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}