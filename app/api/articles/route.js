import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb'; // Vérifie que ce chemin correspond à ton fichier de connexion DB
import Article from '@/models/Article';

export async function GET() {
  try {
    await connectMongo();
    const articles = await Article.find({}).sort({ createdAt: -1 }); // Trie par date (plus récent en premier)
    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await connectMongo();
    const body = await req.json();
    const article = await Article.create(body);
    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}