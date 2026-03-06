import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BuvetteShopping from '@/models/BuvetteShopping';

export async function GET() {
  try {
    await dbConnect();
    let shopping = await BuvetteShopping.findOne();
    if (!shopping) {
      shopping = await BuvetteShopping.create({ list: {} });
    }
    return NextResponse.json({ success: true, data: shopping });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const shopping = await BuvetteShopping.findOneAndUpdate(
      {},
      { $set: { list: body.list } },
      { upsert: true, returnDocument: 'after' }
    );
    return NextResponse.json({ success: true, data: shopping });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}