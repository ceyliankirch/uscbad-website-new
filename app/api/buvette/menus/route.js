import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BuvetteMenu from '@/models/BuvetteMenu';

export async function GET() {
  try {
    await dbConnect();
    const menus = await BuvetteMenu.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: menus });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newMenu = await BuvetteMenu.create(body);
    return NextResponse.json({ success: true, data: newMenu });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}