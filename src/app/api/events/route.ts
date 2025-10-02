import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { getDatabase } from '../../lib/mongodb';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const eventData = await request.json();
    
    console.log('📅 Creating event:', eventData.title);
    
    const db = await getDatabase();
    const result = await db.collection('events').insertOne(eventData);
    
    console.log('✅ Event created:', result.insertedId);
    
    return NextResponse.json(
      { message: 'Event created successfully', eventId: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error creating event:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDatabase();
    const events = await db.collection('events')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ events });
  } catch (error: any) {
    console.error('❌ Error fetching events:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
