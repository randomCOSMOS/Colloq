import { getDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';
import EventDetailClient from './EventDetailClient';

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const db = await getDatabase();

  const event = await db.collection('events').findOne({ _id: new ObjectId(params.id) });

  if (!event) {
    notFound();
  }

  // Convert Mongo ObjectId to string for passing as prop
  return <EventDetailClient event={{ ...event, _id: event._id.toString() }} />;
}
