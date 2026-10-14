import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Menu, Play, X } from 'lucide-react';

const videos = [
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375241_medium-XWpRBigsmWZoMJnsB0YgUnmkk8Eyn4.mp4',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375251_medium-vCTXSd1anfS4KztbSH5UTCwSKeRTbB.mp4',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375232_medium-juRkKf01T2E3LSC5aa4VfDIo918cpe.mp4',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20%281%29-9CJ34vmEtm2OnZ4vh8CtfEmkBazfjH.mp4',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design-ey18UZCyYdGkKetFVtOyuuyLr5Ujw3.mp4',
];

const stories = [
  { title: 'Design with feeling.', text: 'Spaces shaped around the way you live, gather, and unwind.', video: videos[1] },
  { title: 'Details that matter.', text: 'A considered mix of texture, light, and objects with a point of view.', video: videos[2] },
  { title: 'Made for your everyday.', text: 'A room should look beautiful today and feel right for years to come.', video: videos[3] },
];

export const LandingPage: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = heroRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play().catch(() => undefined);
  }, [activeVideo]);

  return (
    <div className="bg-[#f2eee8] text-[#28231f]">
      <section className="relative min-h-[calc(100svh-1px)] overflow-hidden bg-[#241d19] text-white">
        <video ref={heroRef} key={videos[activeVideo]} autoPlay muted playsInline onEnded={() => setActiveVideo((current) => (current + 1) % videos.length)} className="absolute inset-0 h-full w-full object-cover opacity-75" aria-label={`Atmospheric interior design video ${activeVideo + 1} of ${videos.length}`} src={videos[activeVideo]} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/15" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="relative z-10 flex min-h-[calc(100svh-1px)] flex-col justify-between px-5 pb-8 pt-28 sm:px-10 lg:px-16">
          <div className="max-w-xl pt-12 sm:pt-20">
            <p className="mb-5 text-[11px] uppercase tracking-[0.32em] text-white/70">HOMIE / SPATIAL INTELLIGENCE</p>
            <h1 className="font-serif text-6xl font-light leading-[0.93] tracking-[-0.045em] sm:text-8xl lg:text-[7.5rem]">Rooms with<br />a point of view.</h1>
            <p className="mt-8 max-w-sm text-sm leading-6 text-white/75 sm:text-base">Personal spaces, thoughtfully imagined. Homie brings together your taste, your budget, and the things you love.</p>
            <Link to="/projects/new" className="mt-8 inline-flex items-center gap-4 rounded-full bg-white px-5 py-3 text-xs font-medium text-[#28231f] transition-transform hover:scale-105">Begin your room <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="flex items-end justify-between gap-6 border-t border-white/25 pt-5">
            <div className="flex gap-2">
              {videos.slice(0, 5).map((_, index) => <button key={index} onClick={() => setActiveVideo(index)} aria-label={`Show video ${index + 1}`} className={`h-1 transition-all ${activeVideo === index ? 'w-12 bg-white' : 'w-6 bg-white/40'}`} />)}
            </div>
            <a href="#manifesto" className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-white/70 sm:flex">Scroll to explore <ArrowDown className="h-3.5 w-3.5" /></a>
          </div>
        </div>
      </section>

      <section id="manifesto" className="px-5 py-24 sm:px-10 lg:px-16 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#8b8178] lg:col-span-3">The homie approach</p>
          <div className="lg:col-span-7 lg:col-start-5"><h2 className="font-serif text-4xl font-light leading-tight tracking-[-0.035em] sm:text-6xl">Good design is personal. It starts with listening.</h2><p className="mt-8 max-w-lg text-base leading-7 text-[#6d645d]">Tell us how you want a room to feel. Homie translates that feeling into a visual direction, a considered layout, and a shoppable plan that stays true to your budget.</p><Link to="/onboarding" className="mt-9 inline-flex items-center gap-3 border-b border-[#28231f] pb-2 text-sm">Find your style <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      <section className="border-y border-[#d8d0c7] bg-[#e7e0d7] px-5 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mb-12 flex items-end justify-between"><div><p className="text-[11px] uppercase tracking-[0.28em] text-[#8b8178]">A visual language</p><h2 className="mt-3 font-serif text-4xl font-light tracking-[-0.035em] sm:text-5xl">Made to feel like you.</h2></div><span className="hidden text-xs text-[#8b8178] sm:block">01 — 03</span></div>
        <div className="grid gap-5 md:grid-cols-3">{stories.map((story, index) => <article key={story.title} className="group"><div className="relative aspect-[4/5] overflow-hidden bg-[#cfc4b9]"><video muted loop playsInline autoPlay className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={story.video} /><span className="absolute left-4 top-4 text-xs text-white/80">0{index + 1}</span><button className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#28231f]" aria-label={`Play ${story.title}`}><Play className="h-3.5 w-3.5 fill-current" /></button></div><h3 className="mt-5 font-serif text-2xl font-light">{story.title}</h3><p className="mt-2 max-w-xs text-sm leading-6 text-[#6d645d]">{story.text}</p></article>)}</div>
      </section>

      <section className="relative overflow-hidden bg-[#28231f] px-5 py-24 text-white sm:px-10 lg:px-16 lg:py-36"><div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_60%_40%,rgba(198,153,116,.3),transparent_55%)]" /><div className="relative max-w-3xl"><p className="text-[11px] uppercase tracking-[0.28em] text-white/50">Your next chapter</p><h2 className="mt-6 font-serif text-5xl font-light leading-[.95] tracking-[-.045em] sm:text-7xl">Let&apos;s make<br />space for it.</h2><Link to="/projects/new" className="mt-10 inline-flex items-center gap-4 rounded-full bg-[#d7b59d] px-6 py-3.5 text-sm text-[#28231f] transition-colors hover:bg-white">Start with a photo <ArrowRight className="h-4 w-4" /></Link></div></section>
    </div>
  );
};

export default LandingPage;

export { Menu, X };
