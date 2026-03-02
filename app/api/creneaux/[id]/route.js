import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Planning from '@/models/Planning';

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  const updated = await Planning.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(req, { params }) {
  await dbConnect();
  await Planning.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}