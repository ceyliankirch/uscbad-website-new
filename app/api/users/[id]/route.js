import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    
    // 1. OBLIGATOIRE sur Next.js 15+ : On "await" les params avant d'extraire l'id
    const { id } = await params; 
    
    const body = await req.json();
    
    // 2. CORRECTION AVERTISSEMENT MONGOOSE : returnDocument: 'after' au lieu de new: true
    const updated = await User.findByIdAndUpdate(
      id, 
      { $set: body }, 
      { returnDocument: 'after', runValidators: true }
    ).select('-password');
    
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Utilisateur introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    
    // OBLIGATOIRE sur Next.js 15+ ici aussi
    const { id } = await params; 
    
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return NextResponse.json({ success: false, error: 'Utilisateur introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}