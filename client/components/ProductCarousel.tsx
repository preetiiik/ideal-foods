import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import FitText from "@/components/FitText";
import type { ProductLine } from "@/data/products";
import { GRAIN } from "@/data/products";

const ANIM_MS = 450;
const AUTOPLAY_MS = 3500;
/* After a manual arrow click, wait this long before auto-sliding again */
const AUTOPLAY_RESUME_MS = 8000;

export default function ProductCarousel({ line }: { line: ProductLine }) {
  const items = line.items;
  const ITEM_COUNT = items.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimatingRef = useRef(false);
  const lastManualRef = useRef(0);
  const [hovering, setHovering] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  const reducedMotion = useRef(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false,
  );
  /* Ghost text keeps the outgoing product around briefly so it can animate out */
  const [ghostPrev, setGhostPrev] = useState<string | null>(null);

  const active = items[activeIndex];

  /* Preload all product images on mount */
  useEffect(() => {
    items.forEach((p) => {
      const im = new Image();
      im.src = p.image;
    });
  }, [items]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mq.matches;
    const onVis = () => setDocHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const navigate = (dir: "next" | "prev", manual = true) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    if (manual) lastManualRef.current = Date.now();
    setActiveIndex((prev) =>
      dir === "next" ? (prev + 1) % ITEM_COUNT : (prev + ITEM_COUNT - 1) % ITEM_COUNT,
    );
    window.setTimeout(() => {
      isAnimatingRef.current = false;
    }, ANIM_MS);
  };

  /* Auto-slide: every AUTOPLAY_MS, unless hovering, tab hidden,
     reduced-motion is on, or the user recently took over manually. */
  useEffect(() => {
    if (hovering || docHidden || reducedMotion.current) return;
    const id = window.setInterval(() => {
      if (isAnimatingRef.current) return;
      if (Date.now() - lastManualRef.current < AUTOPLAY_RESUME_MS) return;
      navigate("next", false);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [hovering, docHidden, activeIndex]);

  /* When the product changes, remember the previous one for the exit animation */
  const [prevIndex, setPrevIndex] = useState(activeIndex);
  useEffect(() => {
    if (prevIndex !== activeIndex) {
      setGhostPrev(items[prevIndex].short);
      setPrevIndex(activeIndex);
      const t = window.setTimeout(() => setGhostPrev(null), ANIM_MS + 50);
      return () => window.clearTimeout(t);
    }
  }, [activeIndex, prevIndex, items]);

  /* Role mapping derived from activeIndex (center, left, right, backs) */
  const roleFor = (i: number) => {
    if (i === activeIndex) return "center";
    if (i === (activeIndex + ITEM_COUNT - 1) % ITEM_COUNT) return "left";
    if (i === (activeIndex + 1) % ITEM_COUNT) return "right";
    if (i === (activeIndex + 2) % ITEM_COUNT) return "back1";
    return "back2";
  };

  const itemStyle = (i: number): React.CSSProperties => {
    const role = roleFor(i);
    /* Boxes match the artwork's ~2:3 aspect so object-fit never crops,
       and scale is anchored to the bottom so bottles grow UP, never off-screen. */
    const base: React.CSSProperties = {
      position: "absolute",
      aspectRatio: "2 / 3",
      transform: "translateX(-50%)",
      transformOrigin: "center bottom",
      transition: `transform ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1), filter ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1), opacity ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1), left ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1), height ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1), bottom ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1)`,
      willChange: "transform, filter, opacity",
    };
    switch (role) {
      case "center":
        /* 88% × 1.05 ≈ 92.5vh — cap and label always fully in frame.
           On mobile the bottle sits just above the label/arrows zone. */
        return {
          ...base,
          left: "50%",
          bottom: isMobile ? "21%" : 0,
          height: isMobile ? "54%" : "88%",
          transform: `translateX(-50%) scale(1.05)`,
          filter: "blur(0px) drop-shadow(0 30px 45px rgba(0,0,0,0.25))",
          opacity: 1,
          zIndex: 20,
        };
      case "left":
        /* Full silhouette, softly blurred — reads as a whole bottle */
        return {
          ...base,
          left: isMobile ? "18%" : "22%",
          bottom: isMobile ? "25%" : "7%",
          height: isMobile ? "23%" : "36%",
          transform: "translateX(-50%)",
          filter: "blur(2px)",
          opacity: 0.9,
          zIndex: 10,
        };
      case "right":
        return {
          ...base,
          left: isMobile ? "82%" : "78%",
          bottom: isMobile ? "25%" : "7%",
          height: isMobile ? "23%" : "36%",
          transform: "translateX(-50%)",
          filter: "blur(2px)",
          opacity: 0.9,
          zIndex: 10,
        };
      case "back1":
        return {
          ...base,
          left: isMobile ? "36%" : "41%",
          bottom: isMobile ? "25%" : "7%",
          height: isMobile ? "20%" : "30%",
          transform: "translateX(-50%)",
          filter: "blur(4px)",
          opacity: 0.9,
          zIndex: 5,
        };
      default:
        return {
          ...base,
          left: isMobile ? "64%" : "59%",
          bottom: isMobile ? "25%" : "7%",
          height: isMobile ? "20%" : "30%",
          transform: "translateX(-50%)",
          filter: "blur(4px)",
          opacity: 0.9,
          zIndex: 5,
        };
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: active.bg,
        /* Paints above the fixed SiteBackdrop on the home page */
        zIndex: 1,
        transition: `background-color ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1)`,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        className="relative w-full"
        style={{ height: "100vh", overflow: "hidden" }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Top scrim so the nav stays readable over bright colours */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{ zIndex: 55, height: 110, background: "linear-gradient(to bottom, rgba(0,0,0,0.32), rgba(0,0,0,0))" }}
        />

        {/* Grain overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 50,
            backgroundImage: `url("data:image/svg+xml,${GRAIN}")`,
            backgroundSize: "200px 200px",
            backgroundRepeat: "repeat",
            opacity: 0.4,
          }}
        />

        {/* Giant animated ghost product name — always fits the viewport.
            The enter/exit animation lives on the wrapper so it never fights
            FitText's fit-to-width scale. */}
        <div
          className="pointer-events-none absolute inset-x-0 select-none"
          style={{
            zIndex: 2,
            /* Mobile: start below the fixed navbar logo + pill so the giant word never overlaps either */
            top: isMobile ? "calc(88px + 10vh)" : "13%",
            perspective: "900px",
            padding: "0 2vw",
          }}
        >
          {ghostPrev && (
            <div className="absolute inset-0 flex items-start justify-center">
              <div key={`out-${ghostPrev}`} className="ghost-out w-full">
                <FitText className="ghost-text" maxScale={1.5}>
                  {ghostPrev}
                </FitText>
              </div>
            </div>
          )}
          <div className="absolute inset-0 flex items-start justify-center">
            <div key={active.slug} className="ghost-in w-full">
              <FitText className="ghost-text" maxScale={1.5}>
                {active.short}
              </FitText>
            </div>
          </div>
        </div>

        {/* Nav is now app-level (App.tsx) */}
        {/* Carousel of products */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {items.map((p, i) => (
            <div key={p.slug} style={itemStyle(i)}>
              <img
                src={p.image}
                alt={`IDEAL ${p.name} ${line.suffix}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "bottom center",
                }}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Bottom-left text + nav buttons */}
        <div
          className="absolute bottom-10 left-4 sm:bottom-20 sm:left-6"
          style={{ zIndex: 60, maxWidth: 320 }}
        >
          <p
            className="mb-2 text-base sm:mb-3 sm:text-[22px]"
            style={{
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              color: "white",
              opacity: 0.95,
            }}
          >
            IDEAL {active.name} {line.suffix}
          </p>
          <p
            className="mb-4 hidden sm:mb-5 sm:block"
            style={{
              fontSize: "14px",
              color: "white",
              opacity: 0.85,
              lineHeight: 1.6,
            }}
          >
            {active.tagline} — crafted since 1972. The flavour is rich, the finish
            is honest. Bring home the classic. Order now.
          </p>
          <div className="flex gap-3">
            <button
              aria-label="Previous flavour"
              onClick={() => navigate("prev")}
              className="flex items-center justify-center rounded-full"
              style={{
                width: isMobile ? 48 : 64,
                height: isMobile ? 48 : 64,
                backgroundColor: "transparent",
                border: "2px solid white",
                color: "white",
                transition: "transform 150ms, background-color 150ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              aria-label="Next flavour"
              onClick={() => navigate("next")}
              className="flex items-center justify-center rounded-full"
              style={{
                width: isMobile ? 48 : 64,
                height: isMobile ? 48 : 64,
                backgroundColor: "transparent",
                border: "2px solid white",
                color: "white",
                transition: "transform 150ms, background-color 150ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* Tap zones — tap the right side for the next product, the left side for
            the previous one. Kept below the text/UI layer (z 60) so buttons stay
            clickable, and touch-panning vertical still works. */}
        <button
          aria-label="Previous product"
          onClick={() => navigate("prev")}
          className="absolute inset-y-0 left-0"
          style={{ zIndex: 15, width: "28%", background: "transparent", border: "none", cursor: "pointer", touchAction: "pan-y" }}
        />
        <button
          aria-label="Next product"
          onClick={() => navigate("next")}
          className="absolute inset-y-0 right-0"
          style={{ zIndex: 15, width: "28%", background: "transparent", border: "none", cursor: "pointer", touchAction: "pan-y" }}
        />

        {/* Bottom-right link — routes to the active product's detail page */}
        <div className="absolute bottom-6 right-4 sm:bottom-20 sm:right-6" style={{ zIndex: 60 }}>
          <Link
            to={`${line.detailBase}/${active.slug}`}
            className="flex items-center gap-2"
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: "clamp(20px, 4vw, 56px)",
              fontWeight: 400,
              color: "white",
              opacity: 0.95,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "opacity 200ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.95")}
          >
            Discover it
            <ArrowRight className="h-5 w-5 sm:h-8 sm:w-8" strokeWidth={2.25} />
          </Link>
        </div>

        {/* Switch product line — desktop: stacked above DISCOVER IT;
            mobile: top-right below the logo so it never crowds the bottle/label */}
        <div
          className="absolute right-4 sm:right-6"
          style={
            isMobile
              ? { zIndex: 60, top: "calc(88px + 0.5vh)" }
              : { zIndex: 60, bottom: "11rem" }
          }
        >
          <Link
            to={line.key === "syrups" ? "/pickles" : "/"}
            className="flex items-center gap-2 rounded-full"
            style={{
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "white",
              textDecoration: "none",
              border: "2px solid white",
              padding: "8px 16px",
              backgroundColor: "transparent",
              transition: "background-color 150ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {line.key === "syrups" ? "Shop pickles" : "Shop syrups"}
          </Link>
        </div>
      </div>
    </div>
  );
}
