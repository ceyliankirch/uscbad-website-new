import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GalleryItem from '@/models/GalleryItem';

export async function GET() {
  try {
    await dbConnect();
    // On trie par ordre d'affichage ou par date de création
    const items = await GalleryItem.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newItem = await GalleryItem.create(body);
    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}