import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { STUDIO_LOCATIONS } from '../data/locations';
import {
  Coffee,
  MapPin,
  Clock,
  Phone,
  Calendar,
  Check,
  Shield,
  CreditCard,
  Building,
  Sparkles,
  X,
} from 'lucide-react';
import { StudioLocation } from '../types';

export const SettingsPage: React.FC = () => {
  const { currency, setCurrency, showToast } = useProject();

  const [bookingLocation, setBookingLocation] = useState<StudioLocation | null>(null);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingDate, setBookingDate] = useState('2026-10-18');
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [isBooked, setIsBooked] = useState(false);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingEmail) return;
    setIsBooked(true);
    showToast(`Consultation booked at ${bookingLocation?.name}!`, 'success');
    setTimeout(() => {
      setIsBooked(false);
      setBookingLocation(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1E1E] py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="pb-4 border-b border-[#EAE6DF]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#7A756D]">
            <span>HOMIE.AI STUDIO</span>
            <span>·</span>
            <span>PREFERENCES & ATELIERS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E1E1E] mt-1">
            Studio Settings & Experience Lounges
          </h1>
          <p className="text-xs text-[#57534E] mt-0.5">
            Configure financial currencies, authorized retail partners, and schedule in-person material consultations at our flagship design lounges.
          </p>
        </div>

        {/* SECTION 1: GLOBAL PREFERENCES */}
        <div className="bg-white border border-[#DFD9CE] p-6 space-y-6">
          <h2 className="font-serif font-bold text-lg text-[#1E1E1E] pb-3 border-b border-[#EAE6DF]">
            Application & Currency Preferences
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase text-[#7A756D] mb-1.5">
                Display Currency
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`p-3 text-left border text-xs font-mono transition-colors ${
                    currency === 'INR'
                      ? 'border-[#1E1E1E] bg-[#FAF8F5] font-bold text-[#1E1E1E]'
                      : 'border-[#DFD9CE] text-[#57534E] hover:border-[#1E1E1E]'
                  }`}
                >
                  <p className="font-bold text-sm">₹ INR</p>
                  <p className="text-[10px] text-[#7A756D] mt-0.5">Indian Rupee (Standard)</p>
                </button>

                <button
                  onClick={() => setCurrency('USD')}
                  className={`p-3 text-left border text-xs font-mono transition-colors ${
                    currency === 'USD'
                      ? 'border-[#1E1E1E] bg-[#FAF8F5] font-bold text-[#1E1E1E]'
                      : 'border-[#DFD9CE] text-[#57534E] hover:border-[#1E1E1E]'
                  }`}
                >
                  <p className="font-bold text-sm">$ USD</p>
                  <p className="text-[10px] text-[#7A756D] mt-0.5">US Dollar (1:83 Rate)</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#7A756D] mb-1.5">
                Authorized Retailer Network
              </label>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Homie.AI only presents products with verified dealer agreements: <strong>Muuto, Article, HAY, West Elm, IKEA Design, Design Within Reach,</strong> and <strong>Urban Ladder</strong>.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-mono text-[#8B9B88]">
                <Shield className="w-4 h-4" />
                <span>Zero markup guarantee on direct trade retail links</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: PHYSICAL STUDIO ATELIERS & COFFEE LOUNGES */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#7A756D]">
              <Coffee className="w-4 h-4 text-[#BA7053]" />
              <span>DELTA CAFÉS INSPIRED SHOWROOM NETWORK</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#1E1E1E] mt-1">
              Flagship Design Ateliers & Tasting Lounges
            </h2>
            <p className="text-xs text-[#57534E] mt-0.5 max-w-2xl">
              Immerse yourself in our sensorial spaces. Experience authentic Delta Cafés roasted espresso while exploring full-scale living mockups and touching physical upholstery, travertine, and oak swatches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STUDIO_LOCATIONS.map((loc) => (
              <div
                key={loc.id}
                className="bg-white border border-[#DFD9CE] overflow-hidden flex flex-col justify-between group hover:border-[#1E1E1E] transition-all"
              >
                <div>
                  <div className="aspect-[16/9] bg-[#EAE6DF] overflow-hidden relative">
                    <img
                      src={loc.image}
                      alt={loc.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-black/80 text-white backdrop-blur-sm">
                        {loc.city}, {loc.country}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-serif font-bold text-base text-[#1E1E1E] leading-snug">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-[#57534E] leading-relaxed">
                      {loc.experienceNotes}
                    </p>

                    <div className="pt-2 border-t border-[#EAE6DF] space-y-1.5 text-xs text-[#7A756D]">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#1E1E1E] shrink-0 mt-0.5" />
                        <span>{loc.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#1E1E1E] shrink-0" />
                        <span>{loc.hours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#1E1E1E] shrink-0" />
                        <span>{loc.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-[#EAE6DF] bg-[#FAF8F5]">
                  <button
                    onClick={() => setBookingLocation(loc)}
                    className="w-full py-2 text-xs font-mono uppercase tracking-wider bg-[#1E1E1E] text-white hover:bg-[#333333] transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Book Material Consultation</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOOKING CONSULTATION MODAL */}
        {bookingLocation && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setBookingLocation(null)}
          >
            <div
              className="bg-[#FAF8F5] border border-[#DFD9CE] max-w-lg w-full p-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between pb-3 border-b border-[#EAE6DF]">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#BA7053]">Sensory Spatial Consultation</span>
                  <h3 className="font-serif font-bold text-lg text-[#1E1E1E] mt-0.5">
                    {bookingLocation.city} Atelier Session
                  </h3>
                </div>
                <button
                  onClick={() => setBookingLocation(null)}
                  className="text-[#7A756D] hover:text-[#1E1E1E] p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isBooked ? (
                <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-[#8B9B88]/20 text-[#8B9B88] flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#1E1E1E]">Consultation Confirmed</h4>
                  <p className="text-xs text-[#57534E] max-w-xs mx-auto">
                    We look forward to welcoming you at {bookingLocation.address}. Your single-origin tasting and material tray will be prepared.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConfirmBooking} className="my-4 space-y-4 text-xs">
                  <div>
                    <label className="block font-mono uppercase text-[#7A756D] text-[10px] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full px-3 py-2 bg-white border border-[#DFD9CE] focus:border-[#1E1E1E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-[#7A756D] text-[10px] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      placeholder="elena@design.com"
                      className="w-full px-3 py-2 bg-white border border-[#DFD9CE] focus:border-[#1E1E1E] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono uppercase text-[#7A756D] text-[10px] mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#DFD9CE] font-mono text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono uppercase text-[#7A756D] text-[10px] mb-1">
                        Time Slot
                      </label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#DFD9CE] font-mono text-xs focus:outline-none"
                      >
                        <option>10:00 AM</option>
                        <option>11:30 AM</option>
                        <option>02:00 PM</option>
                        <option>04:30 PM</option>
                        <option>06:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-[#F2EDE4] border border-[#DFD9CE] text-[11px] text-[#57534E]">
                    Includes private 1-on-1 consultation with a licensed interior architect, digital spatial mockup projection, and artisanal Delta single-origin roast service.
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 text-xs font-mono uppercase tracking-wider bg-[#1E1E1E] text-white hover:bg-[#333333] transition-colors"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
