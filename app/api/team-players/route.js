import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TeamPlayer from '@/models/TeamPlayer';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const team = searchParams.get('team') || 'N1';
    
    // On trie par l'ordre défini manuellement
    const players = await TeamPlayer.find({ team }).sort({ order: 1 });
    return NextResponse.json({ success: true, data: players });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const player = await TeamPlayer.create(body);
    return NextResponse.json({ success: true, data: player });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}