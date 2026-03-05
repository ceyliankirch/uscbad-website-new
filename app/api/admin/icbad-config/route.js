import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import IcbadConfig from '@/models/IcbadConfig';

// GET : Récupérer la configuration
export async function GET() {
  try {
    await dbConnect();
    let config = await IcbadConfig.findOne();
    
    // Si la config n'existe pas encore en BDD, on la crée avec les valeurs par défaut
    if (!config) {
      config = await IcbadConfig.create({});
    }
    
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT : Mettre à jour la configuration
export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    let config = await IcbadConfig.findOne();
    
    if (!config) {
      config = await IcbadConfig.create(body);
    } else {
      // returnDocument: 'after' remplace { new: true } (Mongoose récent)
      config = await IcbadConfig.findOneAndUpdate({}, { $set: body }, { returnDocument: 'after' });
    }
    
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}