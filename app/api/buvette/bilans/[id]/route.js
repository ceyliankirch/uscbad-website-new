import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BuvetteBilan from '@/models/BuvetteBilan';

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    await BuvetteBilan.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}