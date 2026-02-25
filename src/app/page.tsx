import HeroScroll from "@/components/HeroScroll";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#05070B] text-white">
      <HeroScroll />

      <section className="mx-auto max-w-6xl px-6 py-28 text-white/70">
        <h2 className="text-2xl font-semibold text-white">Route Intelligence</h2>
        <p className="mt-3 max-w-2xl leading-7">
          Scroll section added to keep the page interactive after the hero. This also gives
          enough distance for the scroll-tied animation to play smoothly.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <article
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
            >
              <div className="h-3 w-24 rounded-full bg-white/20" />
              <div className="mt-4 h-2 w-40 rounded-full bg-white/10" />
              <div className="mt-2 h-2 w-28 rounded-full bg-white/10" />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
