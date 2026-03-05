import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TeamPlayer from '@/models/TeamPlayer';

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    
    const updated = await TeamPlayer.findByIdAndUpdate(
      id,
      { $set: body },
      { returnDocument: 'after' }
    );
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    await TeamPlayer.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}