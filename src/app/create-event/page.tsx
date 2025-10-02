'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';

export default function CreateEvent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [eventFormat, setEventFormat] = useState<'in-person' | 'virtual' | 'hybrid'>('in-person');
  
  const [venue, setVenue] = useState('');
  const [address, setAddress] = useState('');
  const [mapLink, setMapLink] = useState('');
  
  const [platform, setPlatform] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [note, setNote] = useState('');
  
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [socialLink, setSocialLink] = useState('');
  
  const [ticketType, setTicketType] = useState<'free' | 'paid'>('free');
  const [price, setPrice] = useState('');
  const [regDeadline, setRegDeadline] = useState('');
  
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      setOrganizerEmail(session.user.email);
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const showError = (message: string) => {
    setError(message);
    setShowErrorModal(true);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setError('');
  };

  const validateForm = () => {
    if (!title.trim()) return 'Title is required';
    if (!description.trim()) return 'Description is required';
    if (!type) return 'Event type is required';
    if (tags.length === 0) return 'At least one tag is required';
    if (!startDate || !startTime) return 'Start date and time are required';
    if (!endTime) return 'End time is required';

    const now = new Date();
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const finalEndDate = endDate || startDate;
    const endDateTime = new Date(`${finalEndDate}T${endTime}`);

    if (startDateTime < now) return 'Event start date/time cannot be in the past';

    if (endDateTime <= startDateTime) return 'End time must be after start time';

    if (regDeadline) {
      const deadlineDate = new Date(regDeadline);
      if (deadlineDate < now) return 'Registration deadline cannot be in the past';
      if (deadlineDate >= startDateTime) return 'Registration deadline must be before event start date';
    }

    if (eventFormat === 'in-person' || eventFormat === 'hybrid') {
      if (!venue.trim()) return 'Venue is required for in-person/hybrid events';
      if (!address.trim()) return 'Address is required for in-person/hybrid events';
    }

    if (eventFormat === 'virtual' || eventFormat === 'hybrid') {
      if (!platform) return 'Platform is required for virtual/hybrid events';
      // meetingLink and note are optional now
    }

    if (!organizerEmail.trim()) return 'Organizer email is required';

    if (ticketType === 'paid' && (!price || parseFloat(price) <= 0)) {
      return 'Valid price is required for paid events';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      showError(validationError);
      return;
    }
  
    setLoading(true);

    try {
      const finalEndDate = endDate || startDate;

      const eventData = {
        title,
        description,
        type,
        tags,
        eventFormat,
        ...(eventFormat === 'in-person' || eventFormat === 'hybrid' ? { venue, address, mapLink } : {}),
        ...(eventFormat === 'virtual' || eventFormat === 'hybrid' ? { platform, meetingLink, notes: note } : {}), // Include notes here
        startDateTime: new Date(`${startDate}T${startTime}`),
        endDateTime: new Date(`${finalEndDate}T${endTime}`),
        organizer: {
          email: organizerEmail,
          social: socialLink || undefined,
        },
        ticket: {
          type: ticketType,
          ...(ticketType === 'paid' ? { price: parseFloat(price), currency: 'INR' } : {}),
        },
        registrationDeadline: regDeadline ? new Date(regDeadline) : undefined,
        createdBy: session.user?.email,
        createdAt: new Date(),
      };

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create event');
      }

      router.push('/events');
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-20 px-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Create New Event
            </span>
          </h1>
          <p className="text-gray-300 text-lg">Share your event with the community</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">1</span>
                Basic Information
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                  placeholder="E.g., Startup Founder Meetup 2025"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all resize-none"
                  placeholder="Describe your event..."
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                    required
                  >
                    <option value="" className="bg-gray-900">Select type</option>
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                      placeholder="Add tag..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm flex items-center gap-2 font-medium">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-gray-200 font-bold text-lg">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            {/* Event Format */}
            <div className="space-y-6 border-t border-white/10 pt-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">2</span>
                Event Format
              </h2>
              
              <div className="flex gap-4">
                {['in-person', 'virtual', 'hybrid'].map((format) => (
                  <label key={format} className="flex-1">
                    <input
                      type="radio"
                      value={format}
                      checked={eventFormat === format}
                      onChange={(e) => setEventFormat(e.target.value as any)}
                      className="hidden peer"
                    />
                    <div className="px-6 py-4 rounded-xl bg-white/5 border-2 border-white/10 peer-checked:border-purple-500 peer-checked:bg-purple-500/20 cursor-pointer transition-all text-center">
                      <span className="text-white font-medium capitalize">{format.replace('-', ' ')}</span>
                    </div>
                  </label>
                ))}
              </div>
              
              {/* In-Person Fields */}
              {(eventFormat === 'in-person' || eventFormat === 'hybrid') && (
                <div className="space-y-4 bg-purple-500/10 border border-purple-500/20 p-6 rounded-2xl">
                  <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                    🏢 Location Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Venue *</label>
                      <input
                        type="text"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                        placeholder="Innovation Hub"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Address *</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                        placeholder="Full address"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Google Maps Link (Optional)</label>
                    <input
                      type="url"
                      value={mapLink}
                      onChange={(e) => setMapLink(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                      placeholder="https://maps.google.com/..."
                    />
                  </div>
                </div>
              )}
              
              {/* Virtual Fields */}
              {(eventFormat === 'virtual' || eventFormat === 'hybrid') && (
                <div className="space-y-4 bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
                    <h3 className="font-semibold text-white text-lg flex items-center gap-2">💻 Online Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Platform *</label>
                        <select
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                        >
                            <option value="" className="bg-gray-900">Select platform</option>
                            <option value="Google Meet" className="bg-gray-900">Google Meet</option>
                            <option value="Zoom" className="bg-gray-900">Zoom</option>
                            <option value="Microsoft Teams" className="bg-gray-900">Microsoft Teams</option>
                            <option value="Discord" className="bg-gray-900">Discord</option>
                            <option value="YouTube Live" className="bg-gray-900">YouTube Live</option>
                            <option value="Other" className="bg-gray-900">Other</option>
                        </select>
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Meeting Link (optional)</label>
                        <input
                            type="url"
                            value={meetingLink}
                            onChange={(e) => setMeetingLink(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                            placeholder="https://meetings.example.com/..."
                        />
                        </div>

                        <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Notes (Optional)</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                            placeholder="Additional information about the meeting (e.g., passcodes, agenda)"
                        />
                        </div>
                    </div>
                </div>
              )}
            </div>
            
            {/* Date and Time */}
            <div className="space-y-6 border-t border-white/10 pt-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">3</span>
                Date & Time
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Time *</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date (Optional)</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Time *</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Organizer & Tickets */}
            <div className="space-y-6 border-t border-white/10 pt-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">4</span>
                Details & Pricing
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Organizer Email *</label>
                  <input
                    type="email"
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                    placeholder="organizer@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Social Link (Optional)</label>
                  <input
                    type="url"
                    value={socialLink}
                    onChange={(e) => setSocialLink(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                {['free', 'paid'].map((type) => (
                  <label key={type} className="flex-1">
                    <input
                      type="radio"
                      value={type}
                      checked={ticketType === type}
                      onChange={(e) => setTicketType(e.target.value as any)}
                      className="hidden peer"
                    />
                    <div className="px-6 py-4 rounded-xl bg-white/5 border-2 border-white/10 peer-checked:border-green-500 peer-checked:bg-green-500/20 cursor-pointer transition-all text-center">
                      <span className="text-white font-medium capitalize">{type} Event</span>
                    </div>
                  </label>
                ))}
              </div>
              
              {ticketType === 'paid' && (
                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="1"
                    step="1"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                    placeholder="500"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Registration Deadline (Optional)</label>
                <input
                  type="date"
                  value={regDeadline}
                  onChange={(e) => setRegDeadline(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                />
                <p className="text-sm text-gray-400 mt-2">Must be before event start date</p>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="border-t border-white/10 pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg transition-all duration-300 hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Event...
                  </>
                ) : (
                  <>
                    Create Event
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-900 to-purple-900 border border-white/20 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-slideUp">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Validation Error</h3>
                <p className="text-gray-300">{error}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeErrorModal}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
