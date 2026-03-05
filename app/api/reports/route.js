import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Report from '@/models/Report';

// GET : Récupérer la liste de tous les comptes-rendus
export async function GET() {
  try {
    await dbConnect();
    
    // On trie par date de création décroissante (le plus récent en premier)
    const reports = await Report.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: reports });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST : Créer un nouveau compte-endu (Upload Manuel ou Génération IA)
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // Validation des champs obligatoires
    if (!body.titre || !body.date || !body.type) {
      return NextResponse.json(
        { success: false, error: "Titre, date et type sont obligatoires." }, 
        { status: 400 }
      );
    }

    const newReport = await Report.create(body);
    return NextResponse.json({ success: true, data: newReport }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE : Supprimer un compte-rendu spécifique
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    
    // On attend les paramètres (Obligatoire en Next.js 15)
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ success: false, error: "ID manquant" }, { status: 400 });
    }

    const deletedReport = await Report.findByIdAndDelete(id);
    
    if (!deletedReport) {
      return NextResponse.json({ success: false, error: "Document introuvable en base de données." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur API DELETE Report:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}