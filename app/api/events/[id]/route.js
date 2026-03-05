import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';

// PUT : Modifier un événement existant
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const updated = await Event.findByIdAndUpdate(
      params.id, 
      { $set: body }, 
      { new: true }
    );
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE : Supprimer un événement
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    await Event.findByIdAndDelete(params.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}