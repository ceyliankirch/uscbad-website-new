import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Article from '@/models/Article';

export async function PUT(req, { params }) {
  try {
    await connectMongo();
    const body = await req.json();
    const article = await Article.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!article) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectMongo();
    const deletedArticle = await Article.deleteOne({ _id: params.id });
    if (!deletedArticle) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}