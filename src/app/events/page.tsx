'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
  _id: string;
  title: string;
  description: string;
  type: string;
  tags: string[];
  eventFormat: 'in-person' | 'virtual' | 'hybrid';
  venue?: string;
  address?: string;
  platform?: string;
  startDateTime: string;
  endDateTime: string;
  ticket: {
    type: 'free' | 'paid';
    price?: number;
    currency?: string;
  };
}

export default function BrowseEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedType, setSelectedType] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedTicketType, setSelectedTicketType] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedType, selectedFormat, selectedTicketType, selectedTags, dateRange, events]);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data.events);
      
      const tags = new Set<string>();
      data.events.forEach((event: Event) => {
        event.tags.forEach(tag => tags.add(tag));
      });
      setAllTags(Array.from(tags));
      
      setFilteredEvents(data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    if (selectedType) {
      filtered = filtered.filter(event => event.type === selectedType);
    }

    if (selectedFormat) {
      filtered = filtered.filter(event => event.eventFormat === selectedFormat);
    }

    if (selectedTicketType) {
      filtered = filtered.filter(event => event.ticket.type === selectedTicketType);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(event =>
        selectedTags.some(tag => event.tags.includes(tag))
      );
    }

    if (dateRange.start) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.startDateTime);
        const startDate = new Date(dateRange.start);
        return eventDate >= startDate;
      });
    }
    if (dateRange.end) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.startDateTime);
        const endDate = new Date(dateRange.end);
        return eventDate <= endDate;
      });
    }

    setFilteredEvents(filtered);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSelectedType('');
    setSelectedFormat('');
    setSelectedTicketType('');
    setSelectedTags([]);
    setDateRange({ start: '', end: '' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex gap-8">
        {/* Sidebar Filters */}
        <div 
          className="w-80 flex-shrink-0 max-h-[calc(100vh-6rem)] overflow-y-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-24"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#a78bfa transparent' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Date Range */}
          <div className="mb-6">
            <h3 className="font-semibold text-white mb-3">Date Range</h3>
            <div className="space-y-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none"
              />
            </div>
          </div>

          {/* Event Type */}
          <div className="mb-6">
            <h3 className="font-semibold text-white mb-3">Event Type</h3>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none"
            >
              <option value="" className="bg-gray-900">All Types</option>
              <option value="Meetup" className="bg-gray-900">Meetup</option>
              <option value="Workshop" className="bg-gray-900">Workshop</option>
              <option value="Conference" className="bg-gray-900">Conference</option>
              <option value="Networking" className="bg-gray-900">Networking</option>
              <option value="Panel Discussion" className="bg-gray-900">Panel Discussion</option>
              <option value="Pitch Event" className="bg-gray-900">Pitch Event</option>
              <option value="Hackathon" className="bg-gray-900">Hackathon</option>
              <option value="Other" className="bg-gray-900">Other</option>
            </select>
          </div>

          {/* Event Format */}
          <div className="mb-6">
            <h3 className="font-semibold text-white mb-3">Format</h3>
            <div className="space-y-2">
              {['in-person', 'virtual', 'hybrid', ''].map((format) => (
                <label key={format} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="format"
                    value={format}
                    checked={selectedFormat === format}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white capitalize transition-colors">
                    {format || 'All Formats'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Ticket Type */}
          <div className="mb-6">
            <h3 className="font-semibold text-white mb-3">Ticket Type</h3>
            <div className="space-y-2">
              {[{ value: 'free', label: 'Free' }, { value: 'paid', label: 'Paid' }, { value: '', label: 'All' }].map((ticket) => (
                <label key={ticket.value} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="ticket"
                    value={ticket.value}
                    checked={selectedTicketType === ticket.value}
                    onChange={(e) => setSelectedTicketType(e.target.value)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{ticket.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div>
              <h3 className="font-semibold text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Events Grid */}
        <div className="flex-1">
          <div className="mb-6">
            <p className="text-gray-300 text-lg">
              Showing <span className="font-bold text-white">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''}
            </p>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-3">No events found</h3>
              <p className="text-gray-300 mb-6">Try adjusting your filters to discover more events.</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredEvents.map(event => (
                <Link
                  key={event._id}
                  href={`/events/${event._id}`}
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-500 group-hover:bg-clip-text transition-all">
                    {event.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs font-bold">
                      {event.type}
                    </span>
                    {event.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                    {event.tags.length > 3 && (
                      <span className="px-3 py-1 bg-white/10 text-gray-400 rounded-full text-xs font-medium">
                        +{event.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-gray-300">
                    <span className="text-xl">{getFormatIcon(event.eventFormat)}</span>
                    <span className="text-sm font-medium capitalize">{event.eventFormat.replace('-', ' ')}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-gray-300">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">
                      {formatDate(event.startDateTime)} at {formatTime(event.startDateTime)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-gray-300">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">
                      {event.eventFormat === 'in-person' || event.eventFormat === 'hybrid'
                        ? event.venue
                        : event.platform}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      {event.ticket.type === 'free' ? (
                        <span className="text-xl font-bold text-green-400">FREE</span>
                      ) : (
                        <span className="text-xl font-bold text-white">
                          ₹{event.ticket.price}
                        </span>
                      )}
                    </div>
                    <span className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm group-hover:from-purple-700 group-hover:to-pink-700 transition-all flex items-center gap-2">
                      View Details
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
