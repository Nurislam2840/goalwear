// src/components/OfferBanner.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Tag,
  Clock,
} from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const EMPTY_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export default function OfferBanner() {
  const { offers } = useSiteData();
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(EMPTY_TIME);
  const [isEnded, setIsEnded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const endDateRef = useRef<string>("");

  const activeOffers = useMemo(
    () => offers.filter((o) => o.isActive),
    [offers]
  );

  const safeCurrent =
    activeOffers.length > 0 ? current % activeOffers.length : 0;
  const currentOffer = activeOffers[safeCurrent] || null;
  const currentEndDate = currentOffer?.endDate || "";

  useEffect(() => {
    endDateRef.current = currentEndDate;
  }, [currentEndDate]);

  useEffect(() => {
    const tick = () => {
      const endDate = endDateRef.current;

      if (!endDate) {
        setTimeLeft((prev) =>
          prev.days === 0 &&
          prev.hours === 0 &&
          prev.minutes === 0 &&
          prev.seconds === 0
            ? prev
            : EMPTY_TIME
        );
        setIsEnded(false);
        return;
      }

      const distance = new Date(endDate).getTime() - Date.now();

      if (distance <= 0) {
        setIsEnded(true);
        setTimeLeft((prev) =>
          prev.days === 0 &&
          prev.hours === 0 &&
          prev.minutes === 0 &&
          prev.seconds === 0
            ? prev
            : EMPTY_TIME
        );
        return;
      }

      const next: TimeLeft = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };

      setIsEnded(false);

      setTimeLeft((prev) => {
        if (
          prev.days === next.days &&
          prev.hours === next.hours &&
          prev.minutes === next.minutes &&
          prev.seconds === next.seconds
        ) {
          return prev;
        }
        return next;
      });
    };

    const initialDelay = setTimeout(tick, 100);
    const interval = setInterval(tick, 1000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  // Auto slide — hover করলে pause হবে (HeroSlider এর মতো)
  useEffect(() => {
    if (activeOffers.length <= 1 || paused) return;
    const timer = setInterval(() => {
      goToOffer((safeCurrent + 1) % activeOffers.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [activeOffers.length, paused, safeCurrent]);

  useEffect(() => {
    if (activeOffers.length > 0 && current >= activeOffers.length) {
      setCurrent(0);
    }
  }, [activeOffers.length, current]);

  if (activeOffers.length === 0 || !currentOffer) return null;

  const timeBoxes = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  // HeroSlider এর মতো smooth transition
  const goToOffer = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 400);
  };

  const nextOffer = () =>
    goToOffer((safeCurrent + 1) % activeOffers.length);
  const prevOffer = () =>
    goToOffer(
      (safeCurrent - 1 + activeOffers.length) % activeOffers.length
    );

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      {/* 16:9 Aspect Ratio Container */}
      <div
        className="relative w-full aspect-video min-h-[420px] md:min-h-[480px] rounded-3xl overflow-hidden group border border-gray-100 dark:border-brand-border"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Background Image — HeroSlider এর মতো smooth scale + fade */}
        <div
          key={`img-${currentOffer.id}`}
          className={`absolute inset-0 transition-all duration-[1500ms] ease-out ${
            isTransitioning ? "scale-110 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <Image
            src={currentOffer.image}
            alt={currentOffer.title}
            fill
            sizes="(max-width: 768px) 100vw, 1280px"
            className="object-cover"
            priority={false}
          />
        </div>

        {/* Overlays — হালকা, ছবি ক্লিয়ার দেখাবে (HeroSlider এর মতো) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>

        {/* Green Glow Decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

        {/* Content Overlay */}
        <div className="relative h-full flex items-center">
          <div className="w-full px-6 md:px-12 lg:px-16 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left: Offer Text */}
              <div
                className={`max-w-xl transition-all duration-700 ${
                  isTransitioning
                    ? "opacity-0 translate-y-8"
                    : "opacity-100 translate-y-0 animate-fade-up"
                }`}
              >
                {/* Badge — Floating + glow */}
                <div className="inline-flex items-center gap-2 bg-red-500 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 shadow-lg shadow-red-500/40 animate-float">
                  <Flame className="w-3 h-3" strokeWidth={2.5} />
                  {currentOffer.badge}
                </div>

                {/* UP TO */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm md:text-lg font-black text-brand-green tracking-[0.2em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    Up to
                  </span>
                </div>

                {/* Discount — বড়, drop-shadow সহ */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-6xl md:text-8xl font-extrabold text-white leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] tracking-tighter">
                    {currentOffer.discountText}
                  </span>
                  <span className="text-4xl md:text-6xl font-extrabold text-brand-green leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                    % OFF
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-3xl font-bold text-white mb-3 leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  {currentOffer.title} <br />
                  <span className="text-gradient-bright">
                    {currentOffer.highlight}
                  </span>
                </h2>

                {/* Description */}
                <p className="text-gray-100 text-xs md:text-base mb-6 max-w-md leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {currentOffer.description}
                </p>

                {/* CTA Buttons — HeroSlider এর মতো দুটি বাটন */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Link
                    href={currentOffer.cta || "/shop"}
                    className="inline-flex items-center gap-2 bg-brand-green text-black font-bold px-7 py-3.5 rounded-full hover:scale-105 transition-transform shadow-lg shadow-brand-green/40 text-sm md:text-base animate-pulse-glow"
                  >
                    <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                    Shop Sale Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 border-2 border-white/40 backdrop-blur-md bg-black/30 text-white font-bold px-7 py-3.5 rounded-full hover:bg-white/20 transition-colors text-sm md:text-base"
                  >
                    View All Offers
                  </Link>
                </div>
              </div>

              {/* Right: Countdown Timer — প্রফেশনাল গ্লাস কার্ড */}
              <div
                className={`md:justify-self-end transition-all duration-700 delay-150 ${
                  isTransitioning
                    ? "opacity-0 translate-y-8"
                    : "opacity-100 translate-y-0"
                }`}
              >
                <div className="bg-black/45 backdrop-blur-xl border border-white/15 rounded-2xl p-4 md:p-6 shadow-2xl shadow-black/40">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] md:text-xs font-bold text-brand-green uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse"></span>
                      {isEnded ? "Offer Ended" : "Offer Ends In"}
                    </p>
                    <Clock className="w-3.5 h-3.5 text-brand-green/70" />
                  </div>

                  {/* Time Boxes */}
                  <div className="grid grid-cols-4 gap-2 md:gap-3">
                    {timeBoxes.map((box) => (
                      <div key={box.label} className="text-center">
                        <div className="bg-brand-green text-black rounded-xl p-2 md:p-3 mb-2 min-w-[50px] md:min-w-[64px] shadow-lg shadow-brand-green/40">
                          <p className="text-xl md:text-3xl font-extrabold leading-none tabular-nums">
                            {String(box.value).padStart(2, "0")}
                          </p>
                        </div>
                        <p className="text-[9px] md:text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                          {box.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Code */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-[10px] md:text-xs text-gray-300 text-center mb-2 flex items-center justify-center gap-1.5">
                      <Tag className="w-3 h-3" />
                      Use Code
                    </p>
                    <div className="bg-white/10 border-2 border-dashed border-brand-green/60 rounded-lg py-2 text-center hover:bg-white/15 transition-colors cursor-pointer group/coupon">
                      <p className="text-sm md:text-base font-extrabold text-brand-green tracking-[0.15em] group-hover/coupon:scale-105 transition-transform">
                        {currentOffer.couponCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corner Badge — HeroSlider এর মতো */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-brand-green text-black text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-brand-green/40 flex items-center gap-1.5 animate-float z-20">
          <Sparkles className="w-3 h-3" strokeWidth={2.5} />
          Limited Time
        </div>

        {/* Navigation Arrows — HeroSlider এর মতো */}
        {activeOffers.length > 1 && (
          <>
            <button
              onClick={prevOffer}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/15 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center hover:bg-brand-green hover:border-brand-green transition-all opacity-0 group-hover:opacity-100 md:opacity-100 z-20"
              aria-label="Previous offer"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white hover:text-black" />
            </button>
            <button
              onClick={nextOffer}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/15 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center hover:bg-brand-green hover:border-brand-green transition-all opacity-0 group-hover:opacity-100 md:opacity-100 z-20"
              aria-label="Next offer"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white hover:text-black" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {activeOffers.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {activeOffers.map((o, idx) => (
              <button
                key={o.id}
                onClick={() => goToOffer(idx)}
                className={`transition-all duration-500 rounded-full ${
                  safeCurrent === idx
                    ? "w-10 h-2 bg-brand-green shadow-lg shadow-brand-green/40"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to offer ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Slide Counter — HeroSlider এর মতো */}
        {activeOffers.length > 1 && (
          <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 z-20 hidden md:block">
            <p className="text-xs font-bold text-white tabular-nums">
              {String(safeCurrent + 1).padStart(2, "0")} /{" "}
              {String(activeOffers.length).padStart(2, "0")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}