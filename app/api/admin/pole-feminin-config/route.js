import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PoleFemininConfig from '@/models/PoleFemininConfig';

export async function GET() {
  try {
    await dbConnect();
    let config = await PoleFemininConfig.findOne();
    
    if (!config) {
      config = await PoleFemininConfig.create({}); // Crée la config avec les valeurs par défaut
    }
    
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const config = await PoleFemininConfig.findOneAndUpdate(
      {}, 
      { $set: body }, 
      { upsert: true, returnDocument: 'after' }
    );
    
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}