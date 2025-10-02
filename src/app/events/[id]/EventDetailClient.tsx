'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function EventDetailClient({ event }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFormatIcon = (format) => {
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

  async function handleRegister() {
    if (!session) {
      // Redirect to login page if not authenticated
      router.push('/signup');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/register-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 px-6">
      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/events" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold mb-6 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
        </Link>

        {/* Event Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                <div className="flex items-center gap-3 text-sm font-semibold flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">{event.type}</span>
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

          <div className="p-4 sm:p-6 space-y-4 text-gray-200">
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs font-semibold">{tag}</span>
              ))}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">About This Event</h2>
              <p className="leading-relaxed">{event.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Date & Time</h2>
              <div className="flex items-center gap-3">
                <div className="bg-white/10 rounded-lg p-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div>{formatDate(event.startDateTime)}</div>
                    <div className="mt-1">{formatTime(event.startDateTime)} - {formatTime(event.endDateTime)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Location / Platform</h2>
              <div className="bg-white/10 rounded-lg p-4 space-y-2">
                {(event.eventFormat === 'in-person' || event.eventFormat === 'hybrid') && (
                  <>
                    <div className="font-semibold">{event.venue}</div>
                    <div className="text-sm">{event.address}</div>
                    {event.mapLink && (
                      <a href={event.mapLink} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline text-sm">View on Google Maps</a>
                    )}
                  </>
                )}
                {(event.eventFormat === 'virtual' || event.eventFormat === 'hybrid') && (
                  <>
                    <div className="font-semibold">{event.platform}</div>
                    {event.meetingLink && (
                      <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline text-sm">Join Meeting</a>
                    )}
                  </>
                )}
                {event.notes && (
                  <div className="mt-3 p-3 bg-white/20 rounded-lg border border-white/20 text-white text-sm">
                    <h3 className="font-semibold mb-1">Meeting Notes</h3>
                    <p className="whitespace-pre-wrap">{event.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Organizer</h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center font-semibold text-white text-lg">{event.organizer.email[0].toUpperCase()}</div>
                <div>
                  <a href={`mailto:${event.organizer.email}`} className="block hover:underline">{event.organizer.email}</a>
                  {event.organizer.social && (
                    <a href={event.organizer.social} target="_blank" rel="noopener noreferrer" className="block hover:underline text-purple-400 text-sm">{event.organizer.social}</a>
                  )}
                </div>
              </div>
            </div>

            {event.registrationDeadline && (
              <div>
                <p className="text-yellow-400 font-semibold mb-2">Registration Deadline: {formatDate(event.registrationDeadline)}</p>
              </div>
            )}

            <div className="flex gap-4 mt-4">
              <button onClick={handleRegister} disabled={loading} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Registering...' : 'Register'}
              </button>
              <button className="px-6 py-3 rounded-xl border-2 border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400 transition-transform hover:scale-105">Share</button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
