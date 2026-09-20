import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteChrome";
import SiteBackdrop from "@/components/SiteBackdrop";
import ProductCarousel from "@/components/ProductCarousel";
import ProductGrid from "@/components/ProductGrid";
import FitText from "@/components/FitText";
import { SYRUP_LINE, PRODUCT_LINES, type ProductLine } from "@/data/products";

const STATS = [
  { value: "1972", label: "Founded in Belgaum", accent: "#C25E3A" },
  { value: "9+", label: "Signature products", accent: "#2F6B4F" },
  { value: "2", label: "Product lines", accent: "#C2477F" },
  { value: "1992", label: "NPC Award", accent: "#B97E14" },
];

/**
 * The exact brand copy for the "flavourful journey" section — identical on
 * both the syrup and pickle pages; only the video on the right changes.
 */
const STORY_PARAS = [
  "At <strong>Ideal Food Products</strong>, we take immense pride in our special range of syrups, crafted with love and attention to detail. Our syrups have found diverse applications, making them a versatile addition to various culinary creations. From delightful milkshakes to mouthwatering ice creams, from refreshing mocktails to innovative desserts, our syrups add a burst of flavour and richness to every dish.",
  "At <strong>Ideal Food Products</strong>, quality is at the heart of everything we do. We adhere to strict quality standards throughout our production process to ensure that every bottle of syrup that leaves our facility is of the highest quality. Our state-of-the-art production unit is equipped with modern technology and operated by a team of skilled professionals who share our passion for delivering excellence.",
];

/** The reel shown beside the story copy — syrup video on /, pickle video on /pickles. */
const LINE_VIDEO: Record<ProductLine["key"], { src: string; caption: string }> = {
  syrups: { src: "/videos/syrup-vid.mp4", caption: "Our syrups, in motion" },
  pickles: { src: "/videos/pickle-vid.mp4", caption: "Our pickles, in motion" },
};

export default function Landing({ line = SYRUP_LINE }: { line?: ProductLine }) {
  /* Active line's products appear first in the Specialites section */
  const orderedLines = [line, ...PRODUCT_LINES.filter((l) => l.key !== line.key)];
  const video = LINE_VIDEO[line.key];

  return (
    <div className="relative w-full overflow-hidden" style={{ fontFamily: "'Nunito Sans', sans-serif", color: "#2E1F14" }}>
      {/* The site opens straight into the animated product showcase (syrups on /, pickles on /pickles) */}
      <ProductCarousel line={line} />

      {/* ---------- Content sections on the ONE plain beige backdrop ---------- */}
      <div className="relative w-full" style={{ color: "#2E1F14" }}>
        <SiteBackdrop />

        <div className="relative flex flex-col gap-20 pb-24 pt-4" style={{ zIndex: 1 }}>
          {/* Heritage stats strip — neutral white chips */}
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 sm:grid-cols-4 sm:px-6">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-3xl bg-white/80 px-4 py-7 text-center"
                style={{ border: "1.5px solid rgba(64,42,30,0.12)", boxShadow: "0 10px 26px rgba(64,42,30,0.06)" }}
              >
                <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "clamp(30px, 4vw, 44px)", color: s.accent }}>
                  {s.value}
                </p>
                <p className="mt-1" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "#5C4636" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Our Story — copy left, neutral application tiles right */}
          <section id="story" className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div className="relative z-10">
              <p className="script-accent" style={{ fontSize: "clamp(30px, 4vw, 42px)" }}>Come join us</p>
              <h2 className="display-font" style={{ fontSize: "clamp(30px, 5vw, 52px)", textTransform: "uppercase" }}>
                In this flavourful journey!
              </h2>
              <p className="body-ink mt-6" style={{ fontSize: 15.5, lineHeight: 1.9 }} dangerouslySetInnerHTML={{ __html: STORY_PARAS[0] }} />
              <p
                className="body-ink mt-4"
                style={{ fontSize: 15.5, lineHeight: 1.9 }}
                dangerouslySetInnerHTML={{ __html: STORY_PARAS[1] }}
              />
              <Link to="/about" className="mt-8 inline-block" style={{ textDecoration: "none" }}>
                <span className="btn-outline-gold">
                  Know More About Us
                  <ArrowRight size={14} strokeWidth={2.5} />
                </span>
              </Link>
            </div>

            {/* The line's video reel — syrup video on /, pickle video on /pickles.
                Text stays identical; only the reel changes with the hero. */}
            <div className="relative z-10 flex w-full justify-center py-7 sm:py-10 lg:justify-end lg:py-0">
              <div
                className="relative w-full max-w-[360px] overflow-hidden"
                style={{ borderRadius: "50% 0 0 50%" }}
              >
              <video
                key={video.src}
                src={video.src}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="block w-full"
                style={{
                  objectFit: "cover",
                  aspectRatio: "9 / 16",
                  maskImage: "linear-gradient(to right, black 0%, black 88%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to right, black 0%, black 88%, transparent 100%)",
                }}
              />
              <div
                className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-5 pb-5 pt-16"
                style={{ background: "linear-gradient(to top, rgba(46,31,20,0.72), transparent)" }}
              >
                <p className="script-accent" style={{ fontSize: 22, color: "#FFF9ED" }}>
                  {video.caption}
                </p>
                <span
                  className="rounded-full"
                  style={{
                    border: "1px solid rgba(255,249,237,0.55)",
                    padding: "6px 14px",
                    fontSize: 10.5,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: "#FFF9ED",
                  }}
                >
                  Since 1972
                </span>
              </div>
              </div>
            </div>
          </section>

          {/* NPC Award — open section with the real badge and ceremony photos */}
          <section className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="script-accent" style={{ fontSize: 30 }}>Pride of 1991</p>
                <h2 className="display-font" style={{ fontSize: "clamp(26px, 4vw, 44px)", textTransform: "uppercase" }}>
                  National Productivity Council Award
                </h2>
                <p className="body-ink mt-4" style={{ fontSize: 15.5, lineHeight: 1.9 }}>
                  The National Productivity Council awarded Mr. Gururaj Lokur for Second Best Productivity Performance
                  in Fruit and Vegetable Processing Industries, presented by the then Vice President of India,
                  Shri Shankar Dayal Sharma, in the year 1991 — a milestone that still shapes our standards today.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-5 lg:justify-end">
                <figure
                  className="m-0 shrink-0"
                  style={{ background: "#FFFFFF", padding: 10, borderRadius: 18, boxShadow: "0 18px 40px rgba(64,42,30,0.16)", transform: "rotate(-2deg)" }}
                >
                  <img
                    src="/award/npc-badge.png"
                    alt="Winners of National Productivity Council and Excellence Award badge"
                    style={{ display: "block", width: 150, height: "auto", borderRadius: 10 }}
                    draggable={false}
                  />
                </figure>
                <div className="flex flex-col gap-5">
                  <figure
                    className="m-0"
                    style={{ background: "#FFFFFF", padding: 10, borderRadius: 18, boxShadow: "0 18px 40px rgba(64,42,30,0.16)", transform: "rotate(1.5deg)" }}
                  >
                    <img
                      src="/award/npc-award-1.png"
                      alt="Shri G.G. Lokur receiving the NPC shield on stage"
                      style={{ display: "block", width: 250, height: "auto", borderRadius: 10 }}
                      draggable={false}
                    />
                  </figure>
                  <figure
                    className="m-0"
                    style={{ background: "#FFFFFF", padding: 10, borderRadius: 18, boxShadow: "0 18px 40px rgba(64,42,30,0.16)", transform: "rotate(-1deg)" }}
                  >
                    <img
                      src="/award/npc-award-2.png"
                      alt="The National Productivity Council trophy being presented"
                      style={{ display: "block", width: 250, height: "auto", borderRadius: 10 }}
                      draggable={false}
                    />
                  </figure>
                </div>
              </div>
            </div>
          </section>

          {/* Our Specialities — Symphony of Flavours */}
          <section id="specialities" className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <p className="script-accent" style={{ fontSize: "clamp(28px, 3.5vw, 38px)" }}>Our Specialites</p>
              <h2 className="display-font" style={{ fontSize: "clamp(28px, 4.5vw, 48px)", textTransform: "uppercase" }}>
                A Symphony of Flavours
              </h2>
              <p className="body-ink mx-auto mt-4" style={{ fontSize: 15, lineHeight: 1.85, maxWidth: 640 }}>
                Chefs and home cooks alike trust Ideal Food Products for their culinary endeavours.
                Some of our signature items include:
              </p>
            </div>

            <div className="mt-14 flex flex-col gap-20">
              {orderedLines.map((ln) => (
                <div key={ln.key}>
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="script-accent" style={{ fontSize: 26 }}>{ln.tagline}</p>
                      <h3 className="display-font" style={{ fontSize: "clamp(24px, 3vw, 34px)", textTransform: "uppercase" }}>
                        Ideal {ln.label}
                      </h3>
                    </div>
                    <Link
                      to={ln.heroPath}
                      style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C25E3A", textDecoration: "none" }}
                      className="site-nav-link"
                    >
                      View the {ln.label.toLowerCase()} shelf →
                    </Link>
                  </div>
              <ProductGrid lineKey={ln.key} />
            </div>
          ))}
            </div>
          </section>

          {/* Customer Satisfaction — open section on the beige backdrop */}
          <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div>
              <p className="script-accent" style={{ fontSize: 30 }}>From our kitchen to yours</p>
              <h2 className="display-font" style={{ fontSize: "clamp(26px, 4vw, 44px)", textTransform: "uppercase" }}>
                Customer Satisfaction
              </h2>
              <p className="body-ink mt-4 max-w-3xl" style={{ fontSize: 15.5, lineHeight: 1.9 }}>
                Customer satisfaction is our ultimate goal, and we continuously strive to exceed expectations. We take
                pride in the positive feedback we receive from our loyal customers, which motivates us to innovate and
                create new and exciting flavours to tantalize taste buds.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["Quality first", "Honest ingredients", "Loved since 1972"].map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-2 rounded-full bg-white/85"
                    style={{
                      border: "1.5px solid rgba(64,42,30,0.18)",
                      padding: "8px 16px",
                      fontSize: 11.5,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "#5C4636",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Enquiry CTA — left-aligned closing band (no form on the home page) */}
          <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <p className="script-accent" style={{ fontSize: "clamp(32px, 4.5vw, 46px)" }}>
              Come join us in this flavourful journey!
            </p>
            <div className="mt-2">
              <FitText
                align="left"
                maxScale={1}
                className="display-font"
                style={{ fontSize: "clamp(28px, 4.5vw, 52px)", textTransform: "uppercase" }}
              >
                Stock Ideal at your store — or bring it to your table
              </FitText>
            </div>
            <p className="body-ink mt-4 max-w-xl" style={{ fontSize: 15, lineHeight: 1.85 }}>
              Bulk orders, distributorships and retail enquiries are welcome. Tell us what you need and our team
              will get back to you.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/enquiry" style={{ textDecoration: "none" }}>
                <span className="btn-solid-gold">
                  Make an Enquiry
                  <ArrowRight size={14} strokeWidth={2.5} />
                </span>
              </Link>
              <Link to="/contact" style={{ textDecoration: "none" }}>
                <span className="btn-outline-gold">Contact Us</span>
              </Link>
            </div>
          </section>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
