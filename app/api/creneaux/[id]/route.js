import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Creneau from '@/models/Creneaux'; // <--- ASSURE-TOI QUE CE CHEMIN EST EXACT

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    
    // Pour Next.js 15, il faut await params
    const { id } = await params;
    
    const body = await req.json();

    // Debug pour voir ce qui arrive au serveur
    console.log("ID reçu:", id);
    console.log("Body reçu:", body);

    const updatedSession = await Creneau.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedSession) {
      return NextResponse.json({ success: false, error: "Créneau non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedSession });
  } catch (error) {
    console.error("ERREUR SERVEUR PUT:", error);
    // On renvoie TOUJOURS du JSON, même en cas d'erreur
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedSession = await Creneau.findByIdAndDelete(id);

    if (!deletedSession) {
      return NextResponse.json({ success: false, error: "Créneau introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}