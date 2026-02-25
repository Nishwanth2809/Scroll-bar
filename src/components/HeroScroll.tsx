"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Stat = { value: string; label: string };
type Tile = { id: number; row: number; col: number; sx: number; sy: number; rot: number; delay: number };

const TILE_COLS = 4;
const TILE_ROWS = 3;

export default function HeroScroll() {
  const sceneRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const statsWrapRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const revealImageRef = useRef<HTMLDivElement | null>(null);
  const mosaicRef = useRef<HTMLDivElement | null>(null);

  const stats: Stat[] = useMemo(
    () => [
      { value: "58%", label: "Increase in pickup point adoption" },
      { value: "23%", label: "Reduction in support call volume" },
      { value: "27%", label: "Improvement in on-time pickups" },
      { value: "40%", label: "Faster dispatch-to-arrival cycle" },
    ],
    []
  );

  const tiles = useMemo<Tile[]>(() => {
    const list: Tile[] = [];
    for (let row = 0; row < TILE_ROWS; row += 1) {
      for (let col = 0; col < TILE_COLS; col += 1) {
        const id = row * TILE_COLS + col;
        const centerCol = (TILE_COLS - 1) / 2;
        const centerRow = (TILE_ROWS - 1) / 2;
        const dx = centerCol - col;
        const dy = centerRow - row;
        const signX = dx >= 0 ? 1 : -1;
        list.push({
          id,
          row,
          col,
          sx: dx * 100,
          sy: dy * 100,
          rot: signX * (10 + row * 2),
          delay: id * 0.02,
        });
      }
    }
    return list;
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const scene = sceneRef.current;
    const headline = headlineRef.current;
    const statsWrap = statsWrapRef.current;
    const glow = glowRef.current;
    const revealImage = revealImageRef.current;
    const mosaic = mosaicRef.current;

    if (!scene || !headline || !statsWrap || !glow || !revealImage || !mosaic) return;

    const headlineChars = headline.querySelectorAll("[data-char]");
    const statItems = statsWrap.querySelectorAll("[data-stat]");
    const tileItems = mosaic.querySelectorAll("[data-tile]");

    gsap.set(headlineChars, { y: 18, opacity: 0, filter: "blur(6px)" });
    gsap.set(statItems, { y: 14, opacity: 0, filter: "blur(6px)" });
    gsap.set(revealImage, { clipPath: "inset(0 100% 0 0 round 24px)", opacity: 0.4 });
    gsap.set(tileItems, {
      xPercent: (_, target) => Number((target as HTMLElement).dataset.sx),
      yPercent: (_, target) => Number((target as HTMLElement).dataset.sy),
      rotate: (_, target) => Number((target as HTMLElement).dataset.rot),
      scale: 0.88,
      opacity: 0.7,
    });

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: scene,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        anticipatePin: 1,
      },
    });

    scrollTl.to(
      headlineChars,
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.22,
        stagger: 0.018,
        ease: "none",
      },
      0.02
    );

    scrollTl.to(
      statItems,
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.22,
        stagger: 0.08,
        ease: "none",
      },
      0.2
    );

    scrollTl.to(
      tileItems,
      {
        xPercent: 0,
        yPercent: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        ease: "none",
        stagger: (_, target) => Number((target as HTMLElement).dataset.delay),
      },
      0.16
    );

    scrollTl.to(
      revealImage,
      {
        clipPath: "inset(0 0% 0 0 round 24px)",
        opacity: 1,
        ease: "none",
      },
      0.06
    );

    scrollTl.to(
      tileItems,
      {
        opacity: 0.22,
        ease: "none",
      },
      0.52
    );

    scrollTl.to(
      glow,
      {
        x: 56,
        y: -44,
        opacity: 0.56,
        ease: "none",
      },
      0
    );

    scrollTl.to(
      headline,
      {
        y: -24,
        opacity: 0.9,
        ease: "none",
      },
      0
    );

    scrollTl.to(
      statsWrap,
      {
        y: -10,
        opacity: 0.95,
        ease: "none",
      },
      0
    );

    return () => {
      scrollTl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [stats]);

  const title = "WELCOME ITZ FIZZ";

  return (
    <section ref={sceneRef} className="relative h-[220vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[#05070B]" />
        <div
          ref={glowRef}
          className="absolute -inset-40 opacity-80 blur-3xl"
          style={{
            background:
              "radial-gradient(600px 420px at 28% 34%, rgba(20,184,166,.34), transparent 60%), radial-gradient(620px 420px at 74% 30%, rgba(251,191,36,.18), transparent 60%), radial-gradient(700px 520px at 52% 74%, rgba(14,165,233,.22), transparent 62%)",
          }}
        />

        <div className="relative mx-auto grid h-full max-w-6xl grid-cols-1 items-center gap-10 px-6 pt-14 md:grid-cols-2 md:pt-0">
          <div className="relative z-10">
            <div
              ref={headlineRef}
              className="text-[12px] tracking-[0.45em] text-white/90 md:text-[14px]"
              aria-label={title}
            >
              {title.split("").map((ch, index) => (
                <span key={`${ch}-${index}`} data-char className="inline-block">
                  {ch === " " ? "\u00A0\u00A0" : ch}
                </span>
              ))}
            </div>

            <div ref={statsWrapRef} className="mt-10 grid gap-4 md:mt-12">
              {stats.map((stat, index) => (
                <div key={index} data-stat className="flex items-baseline gap-3">
                  <div className="text-3xl font-semibold tracking-tight md:text-4xl">{stat.value}</div>
                  <div className="max-w-[30ch] text-sm leading-5 text-white/70 md:text-[15px]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 h-[420px] w-full md:h-[520px]">
            <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur">
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220]">
                <div
                  ref={revealImageRef}
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(80% 70% at 70% 20%, rgba(20,184,166,0.45), transparent), linear-gradient(120deg, #0b1320 0%, #123148 48%, #1f7a8c 100%)",
                  }}
                >
                  <div className="absolute bottom-5 left-5 rounded-xl border border-white/20 bg-black/25 px-3 py-2 text-xs tracking-[0.24em] text-white/90">
                    ITZ FIZZ DRIVE
                  </div>
                </div>

                <div ref={mosaicRef} className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-1.5 p-1.5">
                  {tiles.map((tile) => (
                    <div
                      key={tile.id}
                      data-tile
                      data-sx={tile.sx}
                      data-sy={tile.sy}
                      data-rot={tile.rot}
                      data-delay={tile.delay}
                      className="rounded-md border border-white/10 shadow-[0_8px_28px_rgba(0,0,0,.3)]"
                      style={{
                        backgroundImage:
                          "radial-gradient(80% 70% at 70% 20%, rgba(20,184,166,0.45), transparent), linear-gradient(120deg, #0b1320 0%, #123148 48%, #1f7a8c 100%)",
                        backgroundSize: `${TILE_COLS * 100}% ${TILE_ROWS * 100}%`,
                        backgroundPosition: `${(tile.col / (TILE_COLS - 1)) * 100}% ${(tile.row / (TILE_ROWS - 1)) * 100}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#05070B] to-transparent" />
      </div>
    </section>
  );
}
