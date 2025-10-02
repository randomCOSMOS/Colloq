import { getDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EventDetail({ params }: { params: { id: string } }) {
  let event;
  
  try {
    const db = await getDatabase();
    event = await db.collection('events').findOne({ _id: new ObjectId(params.id) });
    
    if (!event) {
      notFound();
    }
  } catch (error) {
    notFound();
  }

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'in-person':
        return '🏢';
      case 'virtual':
        return '💻';
      case 'hybrid':
        return '🔀';
      default:
        return '📅';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-6 px-6">
      <div className="max-w-4xl mx-auto relative z-10">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold mb-4 transition-colors group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
        </Link>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-1">{event.title}</h1>
                <div className="flex items-center gap-3 flex-wrap text-sm font-semibold">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                    {event.type}
                  </span>
                  <span className="flex items-center gap-2 capitalize">
                    <span className="text-xl">{getFormatIcon(event.eventFormat)}</span>
                    <span>{event.eventFormat.replace('-', ' ')}</span>
                  </span>
                </div>
              </div>
              <div className="text-right text-xl font-extrabold">
                {event.ticket.type === 'free' ? (
                  <span className="text-green-400">FREE</span>
                ) : (
                  <span>₹{event.ticket.price}</span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6 text-gray-300">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-purple-600/20 rounded-full text-sm font-semibold">
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-1">About This Event</h2>
              <p className="leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </section>

            {/* Date & Time */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-1">Date & Time</h2>
              <div>
                <span className="block font-semibold">{formatDate(event.startDateTime)}</span>
                <span>{formatTime(event.startDateTime)} - {formatTime(event.endDateTime)}</span>
              </div>
            </section>

            {/* Location / Platform */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-1">
                {event.eventFormat === 'virtual' ? 'Platform' : 'Location'}
              </h2>
              <div>
                {(event.eventFormat === 'in-person' || event.eventFormat === 'hybrid') && (
                  <div className={event.eventFormat === 'hybrid' ? 'mb-3 pb-3 border-b border-white/10' : 'mb-3'}>
                    <div className="font-semibold">{event.venue}</div>
                    <div className="text-sm mb-2">{event.address}</div>
                    {event.mapLink && (
                      <a href={event.mapLink} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                        View on Google Maps
                      </a>
                    )}
                  </div>
                )}
                {(event.eventFormat === 'virtual' || event.eventFormat === 'hybrid') && (
                  <div>
                    <div className="font-semibold mb-2">{event.platform}</div>
                    {event.meetingLink && (
                      <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                        Join Meeting
                      </a>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Organizer */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-1">Organizer</h2>
              <div>
                <a href={`mailto:${event.organizer.email}`} className="text-purple-400 hover:underline">
                  {event.organizer.email}
                </a>
                {event.organizer.social && (
                  <div>
                    <a href={event.organizer.social} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                      Social Profile
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* Registration Deadline */}
            {event.registrationDeadline && (
              <section className="mt-4">
                <p>
                  <span className="font-semibold text-yellow-400">Registration Deadline:</span>{' '}
                  {formatDate(event.registrationDeadline)}
                </p>
              </section>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-6">
              <button className="flex-1 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
                Register
              </button>
              <button className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:border-purple-400 hover:text-purple-400 transition-all">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
