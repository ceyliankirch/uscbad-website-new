import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TeamMember from '@/models/TeamMember';

// PUT : Modifier un membre existant
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();

    const updatedMember = await TeamMember.findByIdAndUpdate(id, body, {
      new: true, // Renvoie le document mis à jour
      runValidators: true,
    });

    if (!updatedMember) {
      return NextResponse.json({ success: false, error: "Membre introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedMember }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE : Supprimer un membre
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const deletedMember = await TeamMember.findByIdAndDelete(id);

    if (!deletedMember) {
      return NextResponse.json({ success: false, error: "Membre introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}