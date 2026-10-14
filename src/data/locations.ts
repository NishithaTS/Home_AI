import { StudioLocation } from '../types';

export const STUDIO_LOCATIONS: StudioLocation[] = [
  {
    id: 'loc-lisbon-chiado',
    city: 'Lisbon',
    country: 'Portugal',
    name: 'Chiado Design Atelier & Sensory Coffee Lounge',
    address: 'Rua Garrett 84, Chiado, 1200-204 Lisboa',
    hours: 'Mon – Sat: 08:30 – 19:30 | Sun: 09:30 – 17:00',
    phone: '+351 213 421 980',
    highlight: 'Curated Delta Cafés Single-Origin Bar & Tactile Material Library',
    experienceNotes:
      'Inspired by Delta Cafés timeless Portuguese coffee craftsmanship, our Lisbon flagship merges rich roast tastings with 400+ tactile fabric, travertine stone, and wood swatches.',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
    coordinates: { lat: 38.7112, lng: -9.1418 },
  },
  {
    id: 'loc-bangalore-indiranagar',
    city: 'Bengaluru',
    country: 'India',
    name: 'Indiranagar Living Lab & Roast Bar',
    address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
    hours: 'Daily: 09:00 – 21:00',
    phone: '+91 80 4125 7890',
    highlight: 'Virtual AI Spatial Simulator & Direct Retailer Showcase',
    experienceNotes:
      'Test your Homie.AI designs on full-scale digital projection walls while sampling estate-grown artisanal brews and consulting with our senior spatial architects.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    coordinates: { lat: 12.9784, lng: 77.6408 },
  },
  {
    id: 'loc-london-soho',
    city: 'London',
    country: 'United Kingdom',
    name: 'Soho Material Archive & Espresso Atelier',
    address: '42 Lexington Street, Soho, London W1F 0LW',
    hours: 'Mon – Sat: 08:00 – 19:00 | Sun: 10:00 – 17:00',
    phone: '+44 20 7439 1200',
    highlight: 'Textile Tactile Bar, Acoustic Booths & Scandinavian Design Lab',
    experienceNotes:
      'Explore certified sustainable timber finishes, Italian honed travertine samples, and designer lighting fixtures under calibrated 2700K to 4000K daylight luminaires.',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80',
    coordinates: { lat: 51.5132, lng: -0.1365 },
  },
  {
    id: 'loc-new-york-tribeca',
    city: 'New York',
    country: 'United States',
    name: 'Tribeca Architectural Loft & Tasting Room',
    address: '178 Franklin Street, Tribeca, New York, NY 10013',
    hours: 'Tue – Sun: 09:00 – 18:30',
    phone: '+1 212 966 3410',
    highlight: 'Full-Scale Living Room Mockup Pods & Bespoke Furniture Procurement',
    experienceNotes:
      'Book a 1-on-1 private design consultation with certified interior designers to finalize your shopping checklist and budget allocations.',
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=80',
    coordinates: { lat: 40.7191, lng: -74.0094 },
  },
];
