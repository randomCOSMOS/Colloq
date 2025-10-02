import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDatabase } from '../../lib/mongodb';

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { eventId } = await request.json();

  const db = await getDatabase();

  // Check if already registered
  const existing = await db.collection('upcoming_event').findOne({
    eventId,
    userEmail: session.user.email,
  });

  if (existing) {
    return NextResponse.json({ message: 'Already registered' }, { status: 409 });
  }

  await db.collection('upcoming_event').insertOne({
    eventId,
    userEmail: session.user.email,
    registeredAt: new Date(),
  });

  return NextResponse.json({ message: 'Registered successfully' }, { status: 201 });
}
