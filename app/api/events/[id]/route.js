import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';

// PUT : Modifier un événement existant
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    // 1. On "await" les params avant d'extraire l'id (Correction Next.js)
    const { id } = await params; 
    const body = await req.json();
    
    const updated = await Event.findByIdAndUpdate(
      id, 
      { $set: body }, 
      // 2. On utilise returnDocument: 'after' (Correction Mongoose)
      { returnDocument: 'after' } 
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
    // 1. On "await" les params avant d'extraire l'id
    const { id } = await params;
    
    await Event.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}