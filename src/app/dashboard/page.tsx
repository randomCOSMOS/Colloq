import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getDatabase } from '../lib/mongodb';
import Link from 'next/link';

export default async function Dashboard() {
  const session = await getServerSession();
  if (!session) redirect('/login');

  // Fetch user's registered events from the "upcoming_event" collection.
  const db = await getDatabase();
  const registeredEvents = await db
    .collection('upcoming_event')
    .find({ userEmail: session.user.email })
    .sort({ startDateTime: 1 })
    .toArray();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white/10 backdrop-blur-xl border-r border-white/10 py-10 flex flex-col gap-6 fixed h-full">
        <Link href="/" className="mb-8 px-6">
          <span className="text-2xl bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-extrabold">Colloq</span>
        </Link>
        <nav className="flex-1 flex flex-col gap-3">
          <Link href="/dashboard" className="text-white/80 hover:bg-purple-500/10 py-2 pl-6 pr-2 rounded-lg transition-colors">Dashboard</Link>
          <Link href="/events" className="text-white/80 hover:bg-purple-500/10 py-2 pl-6 pr-2 rounded-lg transition-colors">Browse Events</Link>
          <Link href="/create-event" className="text-white/80 hover:bg-purple-500/10 py-2 pl-6 pr-2 rounded-lg transition-colors">Create Event</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-56 px-10 py-10">
        <h1 className="text-4xl font-extrabold text-white mb-10">Your Registered Events</h1>
        
        {registeredEvents.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mt-10 text-center text-gray-300">
            <p className="text-lg">No registered events found.</p>
            <Link href="/events" className="mt-4 inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:scale-105 transition-all">Browse Events</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {registeredEvents.map(event => (
              <div key={event._id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-2xl font-bold text-white">{event.title}</h2>
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs font-semibold">
                    {event.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 mb-2">
                  {event.eventFormat === 'in-person' && <>🏢 In-person</>}
                  {event.eventFormat === 'virtual' && <>💻 Virtual</>}
                  {event.eventFormat === 'hybrid' && <>🔀 Hybrid</>}
                  <span>•</span>
                  <span>{new Date(event.startDateTime).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags?.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-purple-600/20 text-purple-200 rounded-full text-xs">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-white font-medium mb-2">
                  {event.eventFormat !== 'virtual'
                    ? (event.venue ?? event.address)
                    : (event.platform)}
                </div>
                <Link 
                  href={`/events/${event.eventId || event._id}`}
                  className="mt-4 inline-block px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:scale-105 transition-all"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
