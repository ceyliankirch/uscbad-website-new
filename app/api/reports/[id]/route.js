import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Report from '@/models/Report';

export async function DELETE(req, { params }) {
  try {
    // 1. Connexion à la base de données
    await dbConnect();
    
    // 2. Extraction de l'ID (Format compatible Next.js 14 et 15)
    const { id } = await params;
    
    if (!id || id === 'undefined') {
      return NextResponse.json({ success: false, error: "ID invalide ou manquant." }, { status: 400 });
    }

    // 3. Suppression dans MongoDB
    const deletedReport = await Report.findByIdAndDelete(id);
    
    if (!deletedReport) {
      return NextResponse.json({ success: false, error: "Document introuvable dans la base de données." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Compte-rendu supprimé avec succès." });

  } catch (error) {
    console.error("Erreur API DELETE Report:", error);
    // 🔴 CRUCIAL : On renvoie error.message pour afficher la VRAIE erreur à l'écran
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}