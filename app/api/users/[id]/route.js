import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

// PUT : Mettre à jour un utilisateur
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    
    // Obligatoire dans Next.js 15+
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID de l'utilisateur manquant." }, { status: 400 });
    }

    const body = await req.json();

    // 1. Changement de mot de passe par l'utilisateur lui-même (depuis Mon Profil)
    if (body.currentPassword && body.newPassword) {
      const user = await User.findById(id);
      if (!user) return NextResponse.json({ success: false, error: "Utilisateur non trouvé" }, { status: 404 });
      
      if (user.password !== body.currentPassword) {
        return NextResponse.json({ success: false, error: "Mot de passe actuel incorrect" }, { status: 400 });
      }
      
      user.password = body.newPassword;
      await user.save();
      return NextResponse.json({ success: true, message: "Mot de passe mis à jour" });
    }

    // 2. Mise à jour des informations
    const updateData = {
      name: body.name,
      email: body.email,
    };

    // Si l'admin force un nouveau mot de passe
    if (body.password) {
      updateData.password = body.password;
    }

    // Sauvegarde de l'image (photo de profil)
    if (body.image !== undefined) {
      updateData.image = body.image;
    }

    // Sauvegarde des rôles
    if (body.roles) {
      updateData.roles = body.roles;
    } else if (body.role) {
      updateData.roles = [body.role];
    }

    // SAUVEGARDE DU NUMÉRO DE LICENCE
    if (body.licence !== undefined) {
      updateData.licence = body.licence;
    }

    // SAUVEGARDE DES CLASSEMENTS
    if (body.rankings) {
      updateData.rankings = body.rankings;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: 'after' }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "Utilisateur introuvable lors de la mise à jour." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Erreur PUT User:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE : Supprimer un utilisateur
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID de l'utilisateur manquant." }, { status: 400 });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
        return NextResponse.json({ success: false, error: "Utilisateur déjà supprimé ou introuvable." }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error("Erreur DELETE User:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}