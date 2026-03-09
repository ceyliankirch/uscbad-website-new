import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';

// PUT : Mettre à jour un projet (Statut, Tâches, etc.)
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    
    // Dans Next.js 15+, il faut extraire l'id de params de manière asynchrone
    const resolvedParams = await params;
    const body = await req.json();
    
    const updated = await Project.findByIdAndUpdate(
      resolvedParams.id, 
      { $set: body }, 
      { returnDocument: 'after' }
    );
    
    if (!updated) {
      return NextResponse.json({ success: false, error: "Projet introuvable." }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE : Supprimer un projet
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    
    const resolvedParams = await params;
    
    const deletedProject = await Project.findByIdAndDelete(resolvedParams.id);
    
    if (!deletedProject) {
      return NextResponse.json({ success: false, error: "Projet introuvable." }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}