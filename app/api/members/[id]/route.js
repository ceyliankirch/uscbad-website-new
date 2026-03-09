import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Member from '@/models/Member';

// PUT : Mettre à jour un licencié (ex: changer sa catégorie)
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    
    // Obligatoire dans Next.js 15+ : extraire les paramètres de manière asynchrone
    const resolvedParams = await params;
    const body = await req.json();
    
    const updated = await Member.findByIdAndUpdate(
      resolvedParams.id, 
      { $set: body }, 
      { returnDocument: 'after', runValidators: true }
    );
    
    if (!updated) {
      return NextResponse.json({ success: false, error: "Licencié introuvable." }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE : Supprimer un licencié de la base
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    
    // Obligatoire dans Next.js 15+
    const resolvedParams = await params;
    
    const deletedMember = await Member.findByIdAndDelete(resolvedParams.id);
    
    if (!deletedMember) {
      return NextResponse.json({ success: false, error: "Licencié introuvable ou déjà supprimé." }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Licencié supprimé avec succès." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}