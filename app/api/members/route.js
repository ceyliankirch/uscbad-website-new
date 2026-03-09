import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Member from '@/models/Member';

export async function GET() {
  try {
    await dbConnect();
    // Tri alphabétique par nom puis prénom
    const members = await Member.find({}).sort({ nom: 1, prenom: 1 });
    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // Si c'est un tableau (Import CSV Bulk)
    if (Array.isArray(body)) {
      // On utilise bulkWrite pour "Upsert" (Mettre à jour si la licence existe, insérer sinon)
      // Cela évite les doublons lors des ré-importations successives
      const ops = body.map(member => ({
        updateOne: {
          filter: { licence: member.licence },
          update: { $set: member },
          upsert: true
        }
      }));
      
      if (ops.length > 0) {
        await Member.bulkWrite(ops);
      }
      return NextResponse.json({ success: true, message: `${ops.length} licenciés importés/mis à jour avec succès.` }, { status: 201 });
    }

    // Sinon, création classique d'un seul membre
    const newMember = await Member.create(body);
    return NextResponse.json({ success: true, data: newMember }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}