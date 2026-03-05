import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BoardMember from '@/models/BoardMember';

export async function GET() {
  try {
    await dbConnect();
    const members = await BoardMember.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newMember = await BoardMember.create(body);
    return NextResponse.json({ success: true, data: newMember });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}