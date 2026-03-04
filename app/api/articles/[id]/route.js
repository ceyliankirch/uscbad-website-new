import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Article from '@/models/Article';

export async function PUT(req, { params }) {
  try {
    await connectMongo();
    const resolvedParams = await params; // 👈 LA CORRECTION EST LÀ (Next.js 15+)
    const body = await req.json();
    const article = await Article.findByIdAndUpdate(resolvedParams.id, body, { new: true, runValidators: true });
    if (!article) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectMongo();
    const resolvedParams = await params; // 👈 ET LÀ
    const deletedArticle = await Article.deleteOne({ _id: resolvedParams.id });
    if (!deletedArticle) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}