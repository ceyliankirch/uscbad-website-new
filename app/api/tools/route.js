import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Tool from '@/models/Tool';

export async function GET() {
  try {
    await dbConnect();
    // Tri alphabétique par nom
    const tools = await Tool.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, data: tools });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newTool = await Tool.create(body);
    return NextResponse.json({ success: true, data: newTool }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}