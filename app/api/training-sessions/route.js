import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TrainingSession from '@/models/TrainingSession';

export async function GET() {
  try {
    await dbConnect();
    const sessions = await TrainingSession.find({}).sort({ date: 1 });
    return NextResponse.json({ success: true, data: sessions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newSession = await TrainingSession.create(body);
    return NextResponse.json({ success: true, data: newSession });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}