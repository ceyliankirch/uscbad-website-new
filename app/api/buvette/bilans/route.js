import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BuvetteBilan from '@/models/BuvetteBilan';

export async function GET() {
  try {
    await dbConnect();
    const bilans = await BuvetteBilan.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: bilans });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newBilan = await BuvetteBilan.create(body);
    return NextResponse.json({ success: true, data: newBilan });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}