import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Tournament from '../../../../models/Tournament';

// PUT : Modifier un tournoi existant
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    // 1️⃣ CORRECTION NEXT.JS : Il faut 'await' les params !
    const { id } = await params; 
    
    const body = await request.json();
    
    // 2️⃣ CORRECTION MONGOOSE : On remplace 'new: true' par 'returnDocument: "after"'
    const updated = await Tournament.findByIdAndUpdate(id, body, { 
      returnDocument: 'after', 
      runValidators: true 
    });
    
    if (!updated) {
      return NextResponse.json({ success: false, error: "Tournoi introuvable" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE : Supprimer un tournoi
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    // 1️⃣ CORRECTION NEXT.JS : Il faut 'await' les params !
    const { id } = await params;
    
    const deleted = await Tournament.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Tournoi introuvable" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}