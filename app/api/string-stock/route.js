import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import StringStock from '@/models/StringStock';

export async function GET() {
  try {
    await dbConnect();
    const stock = await StringStock.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: stock });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newItem = await StringStock.create(body);
    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}