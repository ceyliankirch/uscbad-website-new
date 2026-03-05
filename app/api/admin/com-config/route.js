import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ComConfig from '@/models/ComConfig';

// GET : Récupérer la configuration
export async function GET() {
  try {
    await dbConnect();
    let config = await ComConfig.findOne();
    
    if (!config) {
      config = await ComConfig.create({});
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
    
    const config = await ComConfig.findOneAndUpdate(
      {}, 
      { $set: body }, 
      { upsert: true, returnDocument: 'after' }
    );
    
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}