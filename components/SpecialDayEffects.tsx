"use client";

import { useEffect, useState } from "react";
import type { EffectType } from "@/lib/specialDays";

interface Particle {
  id: number;
  left: number;       // % from left
  size: number;       // px
  delay: number;      // s
  duration: number;   // s
  opacity: number;
  symbol: string;
  color?: string;
}

const SNOW_SYMBOLS = ["❄", "❅", "❆", "·", "•", "✦"];
const HEART_SYMBOLS = ["❤", "♥", "💕", "♡", "❤", "💗"];
const STAR_SYMBOLS = ["★", "✦", "✧", "✩", "⭐", "✨", "·"];
const CONFETTI_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7",
  "#ec4899", "#14b8a6", "#f43f5e", "#facc15",
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildParticles(type: EffectType, count: number): Particle[] {
  if (!type) return [];
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const r = (n: number) => seededRandom(i * 13 + n);
    if (type === "snow") {
      particles.push({
        id: i,
        left: r(1) * 100,
        size: 10 + r(2) * 16,
        delay: r(3) * -20,
        duration: 8 + r(4) * 14,
        opacity: 0.5 + r(5) * 0.5,
        symbol: SNOW_SYMBOLS[Math.floor(r(6) * SNOW_SYMBOLS.length)],
      });
    } else if (type === "hearts") {
      particles.push({
        id: i,
        left: r(1) * 100,
        size: 12 + r(2) * 18,
        delay: r(3) * -18,
        duration: 7 + r(4) * 10,
        opacity: 0.4 + r(5) * 0.5,
        symbol: HEART_SYMBOLS[Math.floor(r(6) * HEART_SYMBOLS.length)],
        color: `hsl(${340 + r(7) * 30}, 80%, ${55 + r(8) * 20}%)`,
      });
    } else if (type === "stars") {
      particles.push({
        id: i,
        left: r(1) * 100,
        size: 8 + r(2) * 14,
        delay: r(3) * -12,
        duration: 3 + r(4) * 5,
        opacity: 0.3 + r(5) * 0.7,
        symbol: STAR_SYMBOLS[Math.floor(r(6) * STAR_SYMBOLS.length)],
        color: `hsl(${40 + r(7) * 20}, 90%, ${60 + r(8) * 20}%)`,
      });
    } else if (type === "confetti") {
      particles.push({
        id: i,
        left: r(1) * 100,
        size: 6 + r(2) * 8,
        delay: r(3) * -12,
        duration: 4 + r(4) * 6,
        opacity: 0.7 + r(5) * 0.3,
        symbol: "●",
        color: CONFETTI_COLORS[Math.floor(r(6) * CONFETTI_COLORS.length)],
      });
    }
  }
  return particles;
}

const KEYFRAMES: Record<NonNullable<EffectType>, string> = {
  snow: `
    @keyframes sd-snow {
      0%   { transform: translateY(-20px) rotate(0deg);   opacity: 0; }
      5%   { opacity: 1; }
      90%  { opacity: 0.6; }
      100% { transform: translateY(105vh) rotate(540deg); opacity: 0; }
    }
  `,
  hearts: `
    @keyframes sd-hearts {
      0%   { transform: translateY(105vh) scale(0.6); opacity: 0; }
      10%  { opacity: 1; }
      80%  { opacity: 0.6; }
      100% { transform: translateY(-20px) scale(1.1);  opacity: 0; }
    }
  `,
  stars: `
    @keyframes sd-stars {
      0%,100% { opacity: 0.1; transform: scale(0.8); }
      50%      { opacity: 1;   transform: scale(1.3); }
    }
  `,
  confetti: `
    @keyframes sd-confetti {
      0%   { transform: translateY(-10px) rotate(0deg)   scale(1);   opacity: 0; }
      5%   { opacity: 1; }
      80%  { opacity: 0.8; }
      100% { transform: translateY(105vh) rotate(720deg) scale(0.5); opacity: 0; }
    }
  `,
};

const ANIM_NAME: Record<NonNullable<EffectType>, string> = {
  snow: "sd-snow",
  hearts: "sd-hearts",
  stars: "sd-stars",
  confetti: "sd-confetti",
};

const PARTICLE_COUNT: Record<NonNullable<EffectType>, number> = {
  snow: 22,
  hearts: 14,
  stars: 20,
  confetti: 28,
};

interface Props {
  effectType: EffectType;
}

export default function SpecialDayEffects({ effectType }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!effectType) return;
    setParticles(buildParticles(effectType, PARTICLE_COUNT[effectType]));
  }, [effectType]);

  if (!effectType || particles.length === 0) return null;

  const isFixed = effectType === "snow" || effectType === "hearts" || effectType === "confetti";
  const isStars = effectType === "stars";

  return (
    <div
      className="inset-0 pointer-events-none overflow-hidden"
      style={{ position: isFixed ? "fixed" : "absolute", zIndex: 9 }}
      aria-hidden="true"
    >
      <style>{KEYFRAMES[effectType]}</style>
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: isStars ? `${seededRandom(p.id * 7 + 99) * 90}%` : undefined,
            bottom: effectType === "hearts" ? "-20px" : undefined,
            fontSize: `${p.size}px`,
            color: p.color ?? "#fff",
            opacity: p.opacity,
            animation: `${ANIM_NAME[effectType]} ${p.duration}s ${p.delay}s ${isStars ? "ease-in-out infinite" : "linear infinite"}`,
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}
