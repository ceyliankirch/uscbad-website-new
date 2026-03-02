import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Planning from '@/models/Planning';

// RÉCUPÉRER TOUS LES CRÉNEAUX
export async function GET() {
  await dbConnect();
  try {
    const sessions = await Planning.find({}).sort({ day: 1 });
    return NextResponse.json({ success: true, data: sessions });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// CRÉER UN NOUVEAU CRÉNEAU
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const session = await Planning.create(body);
    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}