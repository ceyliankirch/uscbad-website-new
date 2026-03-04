import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // ⚠️ Ajuste le chemin si besoin
import Player from '@/models/Player';

// PUT : Modifier un joueur existant
export async function PUT(req, props) {
  try {
    await dbConnect();
    
    // Extraction compatible Next.js 14 & 15
    const params = await props.params;
    const id = params.id;
    const body = await req.json();

    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedPlayer) {
      return NextResponse.json({ success: false, error: "Joueur introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedPlayer });
  } catch (error) {
    console.error("Erreur PUT player :", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE : Supprimer un joueur
export async function DELETE(req, props) {
  try {
    await dbConnect();
    
    const params = await props.params;
    const id = params.id;

    const deletedPlayer = await Player.findByIdAndDelete(id);

    if (!deletedPlayer) {
      return NextResponse.json({ success: false, error: "Joueur introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE player :", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}