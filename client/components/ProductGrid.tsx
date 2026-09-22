import { Link } from "react-router-dom";
import { PRODUCT_LINES, type Product } from "@/data/products";

/**
 * Blend a hex colour toward white to get a soft pastel tint.
 * amount 0 = original colour, 1 = pure white.
 */
function pastel(hex: string, amount = 0.62): string {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

/**
 * One product card: the bottle floats over a pastel ARCH panel that never
 * stops moving — the arch breathes, a shimmer sweeps across it and tiny
 * sparkles pulse around it.
 */
function ProductCard({
  p,
  suffix,
  detailBase,
  idx,
}: {
  p: Product;
  suffix: string;
  detailBase: string;
  idx: number;
}) {
  return (
    <Link
      to={`${detailBase}/${p.slug}`}
      className="group flex flex-col items-center text-center"
      style={{ textDecoration: "none" }}
      aria-label={`IDEAL ${p.name} ${suffix} — view details`}
    >
      {/* Arch panel + bottle */}
      <div
        className="relative flex w-full items-center justify-center"
        style={{ aspectRatio: "1 / 1.12" }}
      >
        {/* Pastel arch (stadium) panel — breathes forever */}
        <span
          aria-hidden
          className="arch-breathe absolute left-1/2 top-1/2"
          style={{
            width: "70%",
            height: "84%",
            borderRadius: 999,
            overflow: "hidden",
            background: `linear-gradient(180deg, ${pastel(p.bg, 0.42)} 0%, ${pastel(p.bg, 0.68)} 100%)`,
            boxShadow: "0 24px 48px rgba(64,42,30,0.14)",
          }}
        >
          {/* gloss sweep travelling across the arch */}
          <span
            aria-hidden
            className="arch-shimmer absolute"
            style={{
              top: "-20%",
              bottom: "-20%",
              left: "30%",
              width: "34%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
            }}
          />
        </span>

        {/* Sparkles pulsing around the arch */}
        <span
          aria-hidden
          className="sparkle absolute rounded-full"
          style={{ left: "9%", top: "17%", width: 9, height: 9, backgroundColor: p.bg, animationDelay: "-0.8s" }}
        />
        <span
          aria-hidden
          className="sparkle absolute rounded-full"
          style={{ right: "11%", top: "45%", width: 7, height: 7, backgroundColor: p.panel, animationDelay: "-1.9s" }}
        />
        <span
          aria-hidden
          className="sparkle absolute rounded-full"
          style={{ left: "15%", bottom: "11%", width: 8, height: 8, backgroundColor: p.bg, animationDelay: "-2.6s" }}
        />

        {/* Bottle — bobs forever, each card on its own rhythm */}
        <img
          src={p.cardImage ?? p.image}
          alt={`IDEAL ${p.name} ${suffix}`}
          className="animate-float relative z-10"
          style={{
            height: "92%",
            width: "auto",
            maxWidth: "76%",
            objectFit: "contain",
            filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.28))",
            animationDuration: `${3.8 + (idx % 5) * 0.4}s`,
            animationDelay: `${-idx * 0.9}s`,
          }}
          draggable={false}
        />
      </div>

      {/* Name — never wraps, so every product name sits on ONE line and
          every pill button across the row starts at the same height.
          Long names (NON-FRUIT ORANGE) shrink fluidly instead of breaking. */}
      <p
        className="mt-4 flex items-center justify-center"
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 700,
          fontSize: p.name.length > 13 ? "clamp(11.5px, 3.4vw, 14px)" : 16.5,
          lineHeight: 1.3,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          color: "#2E1F14",
          height: 24,
        }}
      >
        {p.name}
      </p>

      {/* Pill button in the flavour colour — also single-line so the
          button row stays perfectly straight across all cards */}
      <span
        className="mt-2.5 inline-flex items-center gap-1.5 rounded-full"
        style={{
          backgroundColor: p.bg,
          color: "#FFFFFF",
          padding: `${p.name} ${suffix}`.length > 18 ? "9px 11px" : "9px 18px",
          fontSize: `${p.name} ${suffix}`.length > 18 ? 10 : 12,
          letterSpacing: `${p.name} ${suffix}`.length > 18 ? "0.03em" : "0.06em",
          whiteSpace: "nowrap",
          fontWeight: 700,
          boxShadow: "0 10px 22px rgba(64,42,30,0.16)",
          transition: "transform 200ms cubic-bezier(0.4,0,0.2,1), filter 200ms",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px) scale(1.04)";
          e.currentTarget.style.filter = "brightness(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.filter = "brightness(1)";
        }}
      >
        {p.name}{p.omitSuffix ? "" : ` ${suffix}`}
      </span>
    </Link>
  );
}

/** Row of animated arch cards for one line (used on Home + Gallery). */
export default function ProductGrid({ lineKey }: { lineKey: "syrups" | "pickles" }) {
  const line = PRODUCT_LINES.find((l) => l.key === lineKey);
  if (!line) return null;

  return (
    <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-10 lg:grid-cols-4">
      {line.items.map((p: Product, i: number) => (
        <ProductCard key={p.slug} p={p} suffix={line.suffix} detailBase={line.detailBase} idx={i} />
      ))}
    </div>
  );
}
