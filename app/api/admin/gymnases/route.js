import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Gymnase from '@/models/Gymnase';

export async function GET() {
  try {
    await connectMongo();
    // On récupère les gymnases et on les trie par ordre alphabétique
    const gymnases = await Gymnase.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, data: gymnases });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await connectMongo();
    const body = await req.json();
    const gymnase = await Gymnase.create(body);
    return NextResponse.json({ success: true, data: gymnase }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}