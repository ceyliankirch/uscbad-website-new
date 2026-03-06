import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    // CAS 1 : MISE À JOUR DU MOT DE PASSE
    if (body.currentPassword && body.newPassword) {
      const user = await User.findById(id);
      if (!user) {
        return NextResponse.json({ success: false, error: 'Utilisateur introuvable.' }, { status: 404 });
      }

      // Vérification du mot de passe actuel (En production : utilisez bcrypt.compare)
      if (user.password !== body.currentPassword) {
        return NextResponse.json({ success: false, error: 'Le mot de passe actuel est incorrect.' }, { status: 400 });
      }

      // Mise à jour (En production : utilisez bcrypt.hash(body.newPassword, 10))
      user.password = body.newPassword;
      await user.save();

      return NextResponse.json({ success: true, message: 'Mot de passe mis à jour avec succès.' });
    }

    // CAS 2 : MISE À JOUR DU PROFIL (Nom, Email, Photo de profil)
    const updateData = {
      name: body.name,
      email: body.email,
    };

    // On n'écrase l'image que si elle est envoyée dans la requête
    if (body.image !== undefined) {
      updateData.image = body.image;
    }
    
    // On met à jour les rôles
    if (body.roles) {
      updateData.roles = body.roles;
    } else if (body.role) {
      // Fallback au cas où
      updateData.roles = [body.role];
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    ).select('-password'); // On exclut le mot de passe de la réponse

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'Utilisateur introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Erreur API PUT User :", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return NextResponse.json({ success: false, error: 'Utilisateur introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}