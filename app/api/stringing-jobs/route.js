import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import StringingJob from '@/models/StringingJob';

// GET : Récupérer toutes les raquettes (pour le tableau de bord)
export async function GET() {
  try {
    await dbConnect();
    const jobs = await StringingJob.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST : Ajouter une nouvelle raquette
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newJob = await StringingJob.create(body);
    return NextResponse.json({ success: true, data: newJob }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}