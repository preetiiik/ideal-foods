import { CATALOGUE } from "@/data/catalogue";
import { CatalogueCopy, CatalogueSection } from "@/components/CatalogueSection";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award } from "lucide-react";
import { SiteFooter } from "@/components/SiteChrome";
import SiteBackdrop from "@/components/SiteBackdrop";
import FitText from "@/components/FitText";

const TIMELINE = [
  {
    year: "1958",
    title: "The beginning",
    text: "Mr. G.G. Lokur graduates from Karnataka University — the first step of a lifelong journey in food.",
    accent: "#C25E3A",
  },
  {
    year: "1961",
    title: "Food technology",
    text: "He completes a Food Technology course from UDCT, Mumbai, building the science behind the craft.",
    accent: "#B97E14",
  },
  {
    year: "1972",
    title: "Ideal is born",
    text: "After years with leading food companies, Mr. Lokur establishes his own unit in Belgaum — Ideal Food Products.",
    accent: "#2F6B4F",
  },
  {
    year: "1992",
    title: "National honour",
    text: "The National Productivity Council Award is received at the hands of the then Vice President, Dr. Shankar Dayal Sharma.",
    accent: "#C2477F",
  },
  {
    year: "Today",
    title: "Next generation",
    text: "Mr. Samir Lokur carries the legacy forward, expanding production and widening our market share.",
    accent: "#1D74B7",
  },
];

/** Open two-column section on the beige backdrop — no coloured card, medallion left/right. */
function BandCard({
  children,
  hidden = false,
  reverse = false,
  singleColumn = false,
}: {
  bg?: string;
  wash?: string;
  children: React.ReactNode;
  hidden?: boolean;
  reverse?: boolean;
  singleColumn?: boolean;
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6" hidden={hidden}>
      <div className={`grid items-center gap-2 py-2 sm:gap-8 sm:py-6 ${singleColumn ? "" : reverse ? "lg:grid-cols-[1fr_auto]" : "lg:grid-cols-[auto_1fr]"}`}>
        {children}
      </div>
    </section>
  );
}

export default function About() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false,
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ fontFamily: "'Nunito Sans', sans-serif", color: "#2E1F14" }}>
      <SiteBackdrop />

      {/* Hero strip — plain beige backdrop, matching the Contact hero.
          Extra top padding keeps the script line clear BELOW the ghost word. */}
      <div className="page-hero relative w-full" style={{ paddingBottom: 30, zIndex: 1 }}>
        <div
          className="pointer-events-none absolute inset-x-0 select-none"
          style={{ zIndex: 2, top: "calc(84px + 5vh)", padding: "0 2vw" }}
        >
          <div className="flex items-center justify-center">
            <div className="ghost-in w-full">
              <FitText className="ghost-text" maxScale={1.5} style={{ color: "rgba(185,126,20,0.35)" }}>
                SINCE 1972
              </FitText>
            </div>
          </div>
        </div>
        <span
          aria-hidden
          className="hero-scrim pointer-events-none absolute"
          style={{
            zIndex: 20,
            top: "calc(84px + 5vh)",
            height: "calc(38vh + 120px)",
            left: 0,
            right: 0,
            background:
              "radial-gradient(120% 90% at 50% 42%, rgba(243,231,211,0.92) 30%, rgba(243,231,211,0.72) 55%, rgba(243,231,211,0) 100%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 text-center sm:px-6" style={{ zIndex: 30 }}>
          <p className="script-accent" style={{ fontSize: "clamp(30px, 4vw, 44px)" }}>We are Fifty and more</p>
          <h1 className="animate-fade-up display-font mt-2" style={{ fontSize: "clamp(32px, 6vw, 64px)", textTransform: "uppercase" }}>
            History of Ideal Foods
          </h1>
          <p className="body-ink animate-fade-up mx-auto mt-4 max-w-2xl" style={{ fontSize: 15, lineHeight: 1.9 }}>{CATALOGUE["We are Fifty and more"][0]}</p>
        </div>
      </div>

      <div className="relative flex flex-col gap-6 py-8 sm:gap-8 sm:py-10" style={{ zIndex: 1 }}>
        {/* Timeline — colourful cards */}
        <section className="hidden mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {TIMELINE.map((t) => (
              <div
                key={t.year}
                className="rounded-3xl bg-white/80 p-6"
                style={{ border: `1.5px solid ${t.accent}44`, boxShadow: "0 12px 30px rgba(64,42,30,0.08)" }}
              >
                <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 26, color: t.accent }}>{t.year}</p>
                <p className="mt-2" style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#2E1F14" }}>{t.title}</p>
                <p className="mt-2" style={{ fontSize: 13, lineHeight: 1.7, color: "#5C4636" }}>{t.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Meet our founder — pista rounded card */}
        <BandCard
          reverse
          bg="#D8EFC9"
          wash="radial-gradient(520px 340px at 12% 22%, rgba(107,191,122,0.40), transparent 70%), radial-gradient(500px 340px at 88% 82%, rgba(205,161,107,0.35), transparent 70%)"
        >
            <div
              className="mx-auto overflow-hidden rounded-[42%] bg-white/85 lg:order-2"
              style={{
                width: isMobile ? "min(94%, 380px)" : 340,
                aspectRatio: "1 / 1",
                border: "2px solid #2F6B4F",
                boxShadow: "0 18px 40px rgba(47,107,79,0.18)",
              }}
            >
              <img
                src="/founder.webp"
                alt="Mr. G.G. Lokur, founder of Ideal Food Products"
                className="h-full w-full object-cover"
                style={{ objectPosition: "center top" }}
              />
            </div>
            <div className="lg:order-1">
              <p className="script-accent" style={{ fontSize: 32 }}>Meet our Founder</p>
              <h2 className="display-font" style={{ fontSize: "clamp(28px, 4.5vw, 48px)", textTransform: "uppercase" }}>
                Mr. G.G. Lokur
              </h2>
              <p className="mt-4 max-w-3xl" style={{ fontSize: 15.5, lineHeight: 1.9, color: "#31473A" }}>{CATALOGUE["We are Fifty and more"][1]}</p>
              <p className="mt-4 max-w-3xl" style={{ fontSize: 15.5, lineHeight: 1.9, color: "#31473A" }}>
                Ideal Food Products was honoured with the National Productivity Council Award in 1992. The prestigious award
                was received by the Managing Partner, Shri. G.G. Lokur, at the hands of the then Honorable Vice President,
                Dr. Shankar Dayal Sharma.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["Karnataka University, 1958", "UDCT Mumbai, 1961", "Food Technologist"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-white/85"
                    style={{
                      border: "1.5px solid rgba(47,107,79,0.45)",
                      padding: "8px 16px",
                      fontSize: 11.5,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: "#2F6B4F",
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
        </BandCard>

        {/* NPC Award — saffron rounded card */}
        <BandCard
          hidden
          bg="#F7DFA6"
          wash="radial-gradient(520px 340px at 86% 22%, rgba(233,161,59,0.40), transparent 70%), radial-gradient(480px 320px at 12% 85%, rgba(244,132,95,0.30), transparent 70%)"
        >
          <div>
            <p className="script-accent" style={{ fontSize: 30 }}>National recognition</p>
            <h2 className="display-font" style={{ fontSize: "clamp(26px, 4vw, 44px)", textTransform: "uppercase" }}>
              National Productivity Council Award
            </h2>
            <p className="mt-4 max-w-3xl" style={{ fontSize: 15.5, lineHeight: 1.9, color: "#4A3421" }}>
              Ideal Food Products was honoured with the National Productivity Council Award in 1992. The prestigious award
              was received by the Managing Partner, Shri. G.G. Lokur, at the hands of the then Honorable Vice President,
              Dr. Shankar Dayal Sharma.
            </p>
          </div>
          <div
            className="mx-auto flex items-center justify-center rounded-full bg-white/85"
            style={{
              width: 148,
              height: 148,
              border: "2px solid #B97E14",
              boxShadow: "0 18px 40px rgba(185,126,20,0.20)",
            }}
          >
            <Award size={64} strokeWidth={1.4} style={{ color: "#B97E14" }} />
          </div>
        </BandCard>

        {/* Early challenges & triumphs — rose rounded card */}
        <BandCard
          singleColumn
          bg="#F9D9E7"
          wash="radial-gradient(520px 340px at 14% 20%, rgba(232,130,180,0.38), transparent 70%), radial-gradient(500px 340px at 86% 85%, rgba(244,132,95,0.30), transparent 70%)"
        >
            <div
              className="hidden"
              style={{
                width: 148,
                height: 148,
                border: "2px solid #C2477F",
                boxShadow: "0 18px 40px rgba(194,71,127,0.16)",
              }}
            >
            </div>
            <div>
              <p className="script-accent" style={{ fontSize: 30 }}>Early challenges &amp; triumphs</p>
              <h2 className="display-font" style={{ fontSize: "clamp(26px, 4vw, 44px)", textTransform: "uppercase" }}>
                Early Challenges and Triumphs
              </h2>
              <p className="mt-4 max-w-3xl" style={{ fontSize: 15.5, lineHeight: 1.9, color: "#5A3050" }}>{CATALOGUE["We are Fifty and more"][2]}</p>
              <p className="mt-4 max-w-3xl" style={{ fontSize: 15.5, lineHeight: 1.9, color: "#5A3050" }}>{CATALOGUE["We are Fifty and more"][4]}</p>
            </div>
        </BandCard>

        {/* Next generation — sky rounded card */}
        <BandCard
          singleColumn
          bg="#D9EEF9"
          wash="radial-gradient(520px 340px at 82% 20%, rgba(29,116,183,0.28), transparent 70%), radial-gradient(500px 340px at 14% 85%, rgba(107,191,122,0.30), transparent 70%)"
        >
          <div>
              <p className="script-accent" style={{ fontSize: 30 }}>Next generation</p>
              <h2 className="display-font" style={{ fontSize: "clamp(26px, 4vw, 44px)", textTransform: "uppercase" }}>
                Next Generation
              </h2>
              <p className="mt-4 max-w-3xl" style={{ fontSize: 15.5, lineHeight: 1.9, color: "#2E4A5C" }}>{CATALOGUE["We are Fifty and more"][3]}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/gallery" style={{ textDecoration: "none" }}>
                  <span className="btn-outline-gold">
                    See our products
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </span>
                </Link>
                <Link to="/contact" style={{ textDecoration: "none" }}>
                  <span className="btn-solid-gold">Contact Us</span>
                </Link>
              </div>
            </div>
            <div
              className="hidden"
              style={{
                width: 148,
                height: 148,
                border: "2px solid #1D74B7",
                boxShadow: "0 18px 40px rgba(29,116,183,0.16)",
              }}
            >
            </div>
        </BandCard>
      </div>

      <div className="relative space-y-12 pb-20"><CatalogueSection heading="Honouring Nature" /><section className="mx-auto max-w-7xl px-4 sm:px-6"><h2 className="display-font mb-6 text-3xl">An Ideal Experience</h2><CatalogueCopy heading="An Ideal Experience" start={2} /></section></div>
      <SiteFooter />
    </div>
  );
}
