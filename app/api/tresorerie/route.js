import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    await dbConnect();
    // Tri par date décroissante (les plus récentes d'abord)
    const transactions = await Transaction.find({}).sort({ date: -1, createdAt: -1 });
    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newTransaction = await Transaction.create(body);
    return NextResponse.json({ success: true, data: newTransaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}