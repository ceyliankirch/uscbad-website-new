import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Team from '@/models/TeamMember'; // <-- Garde ton bon import ici !

export async function PUT(req, props) {
  try {
    await dbConnect();
    const params = await props.params;
    const id = params.id;
    const body = await req.json();

    console.log("Données reçues pour modification :", body); // Utile pour vérifier si trainerRoles arrive bien

    const updatedMember = await Team.findByIdAndUpdate(
      id,
      { $set: body }, // $set dit à MongoDB d'écraser les anciennes valeurs par les nouvelles
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return NextResponse.json({ success: false, error: "Membre non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedMember });
  } catch (error) {
    console.error("Erreur lors de la modification :", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ... (Ton code export async function DELETE ici) ...

export async function DELETE(req, props) {
  try {
    await dbConnect();
    
    // Extraction sécurisée de l'ID (Compatible Next 14 & 15)
    const params = await props.params;
    const id = params.id;

    console.log("🟢 DEMANDE DE SUPPRESSION REÇUE POUR L'ID :", id);

    const deletedMember = await Team.findByIdAndDelete(id);

    if (!deletedMember) {
      console.log("🔴 ÉCHEC : Aucun membre trouvé avec cet ID dans MongoDB.");
      return NextResponse.json({ success: false, error: "Membre introuvable" }, { status: 404 });
    }

    console.log("✅ SUCCÈS : Membre supprimé de la base.");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🔴 ERREUR SERVEUR DELETE :", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}