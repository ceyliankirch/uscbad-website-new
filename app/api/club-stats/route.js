import { NextResponse } from 'next/server';

export async function GET() {
  // On renvoie directement le chiffre réel de la fiche MyFFBaD
  return NextResponse.json({ 
    success: true, 
    licencies: "307" 
  });
}