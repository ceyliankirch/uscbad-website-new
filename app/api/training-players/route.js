import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TrainingPlayer from '@/models/TrainingPlayer';

export async function GET() {
  try {
    await dbConnect();
    const players = await TrainingPlayer.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, data: players });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newPlayer = await TrainingPlayer.create(body);
    return NextResponse.json({ success: true, data: newPlayer });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}