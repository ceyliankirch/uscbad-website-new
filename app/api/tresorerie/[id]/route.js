import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const body = await req.json();
    
    const updated = await Transaction.findByIdAndUpdate(
      resolvedParams.id, 
      { $set: body }, 
      { returnDocument: 'after' }
    );
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    await Transaction.findByIdAndDelete(resolvedParams.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}