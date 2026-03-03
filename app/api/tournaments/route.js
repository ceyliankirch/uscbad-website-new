import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Tournament from '../../../models/Tournament';

export async function GET(request) {
  try {
    await dbConnect();
    
    // On permet de chercher un tournoi précis grâce à son titre
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');

    let query = {};
    if (title) {
      query.title = title; // Cherche le titre exact
    }

    const tournaments = await Tournament.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: tournaments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newTournament = await Tournament.create(body);
    return NextResponse.json({ success: true, data: newTournament }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}