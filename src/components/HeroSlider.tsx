// src/components/HeroSlider.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";

export default function HeroSlider() {
  const { heroSlides } = useSiteData();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-slide every 7 seconds
  useEffect(() => {
    if (paused || heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % heroSlides.length);
        setIsTransitioning(false);
      }, 400);
    }, 7000);
    return () => clearInterval(timer);
  }, [paused, heroSlides.length]);

  if (heroSlides.length === 0) return null;

  const safeCurrent = current >= heroSlides.length ? 0 : current;
  const slide = heroSlides[safeCurrent];

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 300);
  };

  const nextSlide = () => goToSlide((safeCurrent + 1) % heroSlides.length);
  const prevSlide = () =>
    goToSlide(
      (safeCurrent - 1 + heroSlides.length) % heroSlides.length
    );

  return (
    <section className="max-w-7xl mx-auto px-4 mt-6">
      <div
        className="relative bg-black rounded-3xl overflow-hidden border border-gray-100 dark:border-brand-border group"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* 16:9 Aspect Ratio Container */}
        <div className="relative w-full aspect-video min-h-[400px] md:min-h-[500px]">
          {/* Background Image with Zoom Effect */}
          <div
            key={`img-${slide.id}`}
            className={`absolute inset-0 transition-all duration-[1500ms] ease-out ${
              isTransitioning
                ? "scale-110 opacity-0"
                : "scale-100 opacity-100"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.player}
              fill
              sizes="(max-width: 768px) 100vw, 1280px"
              className="object-cover"
              priority
            />
          </div>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent"></div>

          {/* Content Overlay */}
          <div className="relative h-full flex items-center">
            <div className="w-full px-6 md:px-12 lg:px-16 py-8">
              <div
                className={`max-w-2xl transition-all duration-700 ${
                  isTransitioning
                    ? "opacity-0 translate-y-4"
                    : "opacity-100 translate-y-0"
                }`}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-brand-green text-black text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 shadow-lg shadow-brand-green/30">
                  <Sparkles className="w-3 h-3" strokeWidth={2.5} />
                  {slide.badge}
                </div>

                {/* Title with bright gradient (dark bg) */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  {slide.title}{" "}
                  <span className="text-gradient-bright drop-shadow-none">
                    {slide.highlight}
                  </span>
                </h1>

                {/* Player Name */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-green text-black flex items-center justify-center text-xs font-bold shadow-lg shadow-brand-green/30">
                    {slide.player.charAt(0)}
                  </div>
                  <p className="text-sm md:text-base font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {slide.player}
                  </p>
                </div>

                {/* Quote */}
                <p className="text-xs md:text-sm italic text-gray-100 mb-4 border-l-2 border-brand-green pl-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  "{slide.quote}"
                </p>

                {/* Description */}
                <p className="text-gray-100 text-sm md:text-base mb-6 max-w-lg leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {slide.description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Link
                    href={slide.cta || "/shop"}
                    className="bg-brand-green text-black font-bold px-6 md:px-8 py-3 md:py-3.5 rounded-full flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-brand-green/40 text-sm md:text-base"
                  >
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/shop"
                    className="border-2 border-white/40 backdrop-blur-md bg-black/30 text-white font-bold px-6 md:px-8 py-3 md:py-3.5 rounded-full hover:bg-white/20 transition-colors text-sm md:text-base"
                  >
                    Explore More
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {heroSlides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/15 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center hover:bg-brand-green hover:border-brand-green transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white hover:text-black" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/15 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center hover:bg-brand-green hover:border-brand-green transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white hover:text-black" />
              </button>
            </>
          )}

          {/* Slide Indicators */}
          {heroSlides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              {heroSlides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => goToSlide(idx)}
                  className={`transition-all duration-500 rounded-full ${
                    safeCurrent === idx
                      ? "w-10 h-2 bg-brand-green shadow-lg shadow-brand-green/40"
                      : "w-2 h-2 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Slide Counter */}
          <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 z-20 hidden md:block">
            <p className="text-xs font-bold text-white">
              {String(safeCurrent + 1).padStart(2, "0")} /{" "}
              {String(heroSlides.length).padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}