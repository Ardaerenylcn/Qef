"use client";

import { useEffect, useState } from "react";
import type { EffectType } from "@/lib/specialDays";

interface Particle {
  id: number;
  left: number;
  top?: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  symbol: string;
  color: string;
  rotate?: number;
  driftX?: number;
}

function sr(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function build(type: EffectType, count: number): Particle[] {
  if (!type) return [];
  const out: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const r = (n: number) => sr(i * 17 + n);

    if (type === "snow") {
      out.push({
        id: i, left: r(1) * 100, size: 10 + r(2) * 14,
        delay: r(3) * -22, duration: 9 + r(4) * 13, opacity: 0.5 + r(5) * 0.45,
        symbol: ["❄", "❅", "❆", "·", "✦"][Math.floor(r(6) * 5)],
        color: `rgba(255,255,255,${0.5 + r(7) * 0.5})`,
        rotate: r(8) * 360, driftX: (r(9) - 0.5) * 40,
      });
    } else if (type === "hearts") {
      // transparent pink hearts falling DOWN
      const alpha = 0.2 + r(5) * 0.35;
      const hue = 340 + r(7) * 25;
      out.push({
        id: i, left: r(1) * 100, size: 14 + r(2) * 20,
        delay: r(3) * -20, duration: 8 + r(4) * 12, opacity: alpha,
        symbol: ["♥", "❤", "♡", "♥"][Math.floor(r(6) * 4)],
        color: `hsla(${hue}, 80%, 65%, ${alpha})`,
        driftX: (r(9) - 0.5) * 60,
      });
    } else if (type === "stars") {
      out.push({
        id: i, left: r(1) * 100, top: r(2) * 90,
        size: 8 + r(3) * 14, delay: r(4) * -10, duration: 2.5 + r(5) * 4,
        opacity: 0.2 + r(6) * 0.75,
        symbol: ["★", "✦", "✧", "✩"][Math.floor(r(7) * 4)],
        color: `hsl(${38 + r(8) * 18}, 95%, ${60 + r(9) * 20}%)`,
      });
    } else if (type === "confetti") {
      const colors = ["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#a855f7","#ec4899","#facc15","#ffffff"];
      out.push({
        id: i, left: r(1) * 100, size: 5 + r(2) * 7,
        delay: r(3) * -14, duration: 4 + r(4) * 5, opacity: 0.7 + r(5) * 0.3,
        symbol: ["●", "■", "▲", "◆"][Math.floor(r(6) * 4)],
        color: colors[Math.floor(r(7) * colors.length)],
        rotate: r(8) * 360, driftX: (r(9) - 0.5) * 80,
      });
    } else if (type === "fireworks") {
      // sparks from 5 burst centers
      const centers = [
        { x: 15, y: 10 }, { x: 40, y: 8 }, { x: 65, y: 15 },
        { x: 85, y: 10 }, { x: 30, y: 20 },
      ];
      const center = centers[i % centers.length];
      const angle = (i / count) * Math.PI * 2;
      const dist = 40 + r(2) * 60;
      const fwColors = ["#ef4444","#ffffff","#fbbf24","#f97316","#fca5a5"];
      out.push({
        id: i, left: center.x, top: center.y,
        size: 3 + r(3) * 3,
        delay: -(Math.floor(i / centers.length) * 0.4) - r(4) * 0.2,
        duration: 1.2 + r(5) * 0.8, opacity: 1,
        symbol: "●",
        color: fwColors[Math.floor(r(6) * fwColors.length)],
        driftX: Math.cos(angle) * dist,
        rotate: Math.sin(angle) * dist,
      });
    } else if (type === "steam") {
      const isCoffee = i >= 12;
      out.push({
        id: i,
        left: isCoffee ? r(1) * 90 + 5 : 10 + (i % 4) * 22 + r(1) * 10,
        size: isCoffee ? 16 + r(2) * 8 : 20 + r(2) * 30,
        delay: r(3) * -12, duration: isCoffee ? 8 + r(4) * 6 : 4 + r(4) * 4,
        opacity: isCoffee ? 0.25 + r(5) * 0.2 : 0.15 + r(5) * 0.15,
        symbol: isCoffee ? "🫘" : "●",
        color: isCoffee ? "#92400e" : "rgba(255,255,255,0.4)",
        driftX: (r(9) - 0.5) * 20,
      });
    } else if (type === "sakura") {
      out.push({
        id: i, left: r(1) * 110 - 10, size: 12 + r(2) * 14,
        delay: r(3) * -18, duration: 7 + r(4) * 10, opacity: 0.6 + r(5) * 0.35,
        symbol: ["🌸", "🌸", "🌸", "🌷"][Math.floor(r(6) * 4)],
        color: "inherit",
        rotate: r(8) * 360, driftX: 80 + r(9) * 120,
      });
    } else if (type === "leaves") {
      const leafColors = ["#ea580c","#d97706","#b45309","#dc2626","#c2410c","#92400e"];
      out.push({
        id: i, left: r(1) * 110 - 10, size: 16 + r(2) * 16,
        delay: r(3) * -16, duration: 8 + r(4) * 10, opacity: 0.65 + r(5) * 0.3,
        symbol: ["🍂", "🍁", "🍂", "🍁", "🍃"][Math.floor(r(6) * 5)],
        color: leafColors[Math.floor(r(7) * leafColors.length)],
        rotate: r(8) * 360, driftX: (r(9) - 0.3) * 100,
      });
    }
  }
  return out;
}

// ─── CSS keyframes ───────────────────────────────────────────────────────────

const KF: Record<NonNullable<EffectType>, string> = {
  snow: `
    @keyframes sd-snow {
      0%   { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
      5%   { opacity: 1; }
      90%  { opacity: 0.6; }
      100% { transform: translateY(105vh) translateX(var(--dx)) rotate(540deg); opacity: 0; }
    }`,
  hearts: `
    @keyframes sd-hearts {
      0%   { transform: translateY(-20px) translateX(0) scale(1); opacity: 0; }
      8%   { opacity: var(--op); }
      90%  { opacity: var(--op); }
      100% { transform: translateY(105vh) translateX(var(--dx)) scale(0.6); opacity: 0; }
    }`,
  stars: `
    @keyframes sd-stars {
      0%,100% { opacity: 0.1; transform: scale(0.7); }
      50%      { opacity: 1;   transform: scale(1.4); }
    }`,
  confetti: `
    @keyframes sd-confetti {
      0%   { transform: translateY(-10px) translateX(0) rotate(0deg) scale(1); opacity: 0; }
      6%   { opacity: 1; }
      85%  { opacity: 0.8; }
      100% { transform: translateY(105vh) translateX(var(--dx)) rotate(var(--rot,720deg)) scale(0.4); opacity: 0; }
    }`,
  fireworks: `
    @keyframes sd-fw {
      0%   { transform: translate(0,0) scale(1.5); opacity: 1; }
      60%  { opacity: 1; }
      100% { transform: translate(var(--fx),var(--fy)) scale(0); opacity: 0; }
    }`,
  steam: `
    @keyframes sd-steam {
      0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
      15%  { opacity: var(--op); }
      85%  { opacity: var(--op); }
      100% { transform: translateY(-220px) translateX(var(--dx)) scale(2.5); opacity: 0; }
    }
    @keyframes sd-coffee {
      0%   { transform: translateY(-10px) translateX(0) rotate(0deg); opacity: 0; }
      8%   { opacity: var(--op); }
      90%  { opacity: var(--op); }
      100% { transform: translateY(105vh) translateX(var(--dx)) rotate(360deg); opacity: 0; }
    }`,
  sakura: `
    @keyframes sd-sakura {
      0%   { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
      8%   { opacity: 1; }
      90%  { opacity: 0.7; }
      100% { transform: translateY(105vh) translateX(var(--dx)) rotate(var(--rot,480deg)); opacity: 0; }
    }`,
  leaves: `
    @keyframes sd-leaves {
      0%   { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
      8%   { opacity: 1; }
      90%  { opacity: 0.7; }
      100% { transform: translateY(105vh) translateX(var(--dx)) rotate(var(--rot,300deg)); opacity: 0; }
    }`,
};

const ANIM: Record<NonNullable<EffectType>, string> = {
  snow: "sd-snow", hearts: "sd-hearts", stars: "sd-stars", confetti: "sd-confetti",
  fireworks: "sd-fw", steam: "sd-steam", sakura: "sd-sakura", leaves: "sd-leaves",
};

const COUNT: Record<NonNullable<EffectType>, number> = {
  snow: 22, hearts: 18, stars: 22, confetti: 30,
  fireworks: 40, steam: 18, sakura: 16, leaves: 14,
};

interface Props { effectType: EffectType; }

export default function SpecialDayEffects({ effectType }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!effectType) return;
    setParticles(build(effectType, COUNT[effectType]));
  }, [effectType]);

  if (!effectType || particles.length === 0) return null;

  const isStars = effectType === "stars";
  const isSteam = effectType === "steam";
  const isFireworks = effectType === "fireworks";

  return (
    <div
      className="inset-0 pointer-events-none overflow-hidden"
      style={{ position: "fixed", zIndex: 8 }}
      aria-hidden="true"
    >
      <style>{KF[effectType]}</style>

      {particles.map((p) => {
        const isCoffeeBean = isSteam && p.id >= 12;
        const animName = isCoffeeBean ? "sd-coffee" : ANIM[effectType];

        const style: React.CSSProperties = {
          position: "absolute",
          left: `${p.left}%`,
          fontSize: `${p.size}px`,
          lineHeight: 1,
          userSelect: "none",
          "--op": p.opacity,
          "--dx": `${p.driftX ?? 0}px`,
          "--rot": `${(p.rotate ?? 720)}deg`,
        } as React.CSSProperties;

        if (isStars) {
          style.top = `${p.top}%`;
          style.color = p.color;
          style.opacity = p.opacity;
          style.animation = `${animName} ${p.duration}s ${p.delay}s ease-in-out infinite`;
        } else if (isFireworks) {
          style.top = `${p.top}%`;
          style.color = p.color;
          (style as Record<string, unknown>)["--fx"] = `${p.driftX ?? 0}px`;
          (style as Record<string, unknown>)["--fy"] = `${p.rotate ?? 0}px`;
          style.animation = `${animName} ${p.duration}s ${p.delay}s ease-out infinite`;
        } else if (isSteam && !isCoffeeBean) {
          style.bottom = "0";
          style.color = p.color;
          style.borderRadius = "50%";
          style.background = p.color;
          style.width = `${p.size}px`;
          style.height = `${p.size * 1.4}px`;
          style.filter = "blur(8px)";
          style.fontSize = "0";
          style.animation = `${animName} ${p.duration}s ${p.delay}s ease-out infinite`;
        } else {
          style.top = "-20px";
          style.color = p.color;
          style.animation = `${animName} ${p.duration}s ${p.delay}s linear infinite`;
        }

        return (
          <span key={p.id} style={style}>
            {isSteam && !isCoffeeBean ? "" : p.symbol}
          </span>
        );
      })}
    </div>
  );
}
