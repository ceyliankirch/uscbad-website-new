import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

// Récupérer tous les utilisateurs
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find().select('-password'); // On ne renvoie pas les mots de passe
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// Créer un utilisateur
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    // En production, utiliser bcrypt pour hasher body.password ici
    const newUser = await User.create(body);
    return NextResponse.json({ success: true, data: newUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}