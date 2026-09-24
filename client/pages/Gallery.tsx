import { CATALOGUE } from "@/data/catalogue";
import { CatalogueSection } from "@/components/CatalogueSection";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteChrome";
import SiteBackdrop from "@/components/SiteBackdrop";
import FitText from "@/components/FitText";
import { PRODUCT_LINES } from "@/data/products";

const GALLERY_ITEMS = PRODUCT_LINES.flatMap((line) => line.items.map((product) => ({ ...product, line })));

/** Blend a hex colour toward white for the soft pastel tile hover. */
function pastel(hex: string, amount = 0.6): string {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

/** Reference layout: seven square columns, with four larger 2×2 tiles.
 * Positions follow the reference numbers; slot 15 is the collection enquiry. */
const MOSAIC_SPANS: { col: number; row: number; cs: number; rs: number }[] = [
  { col: 2, row: 2, cs: 2, rs: 2 },
  { col: 2, row: 1, cs: 1, rs: 1 },
  { col: 1, row: 2, cs: 1, rs: 1 },
  { col: 3, row: 1, cs: 1, rs: 1 },
  { col: 3, row: 4, cs: 2, rs: 2 },
  { col: 4, row: 3, cs: 1, rs: 1 },
  { col: 1, row: 3, cs: 1, rs: 1 },
  { col: 2, row: 4, cs: 1, rs: 1 },
  { col: 4, row: 2, cs: 1, rs: 1 },
  { col: 5, row: 1, cs: 2, rs: 2 },
  { col: 5, row: 5, cs: 1, rs: 1 },
  { col: 7, row: 3, cs: 1, rs: 1 },
  { col: 4, row: 6, cs: 1, rs: 1 },
  { col: 7, row: 2, cs: 1, rs: 1 },
];

export default function Gallery() {
  return (
    <div className="relative w-full overflow-hidden" style={{ fontFamily: "'Nunito Sans', sans-serif", color: "#2E1F14" }}>
      <SiteBackdrop />

      {/* Hero strip — plain beige backdrop; extra top clearance keeps the fixed navbar off the hero */}
      <div className="page-hero relative w-full" style={{ paddingBottom: 20, zIndex: 1 }}>
        <div
          className="pointer-events-none absolute inset-x-0 select-none"
          style={{ zIndex: 2, top: "calc(84px + 5vh)", padding: "0 2vw" }}
        >
          <div className="flex items-center justify-center">
            <div className="ghost-in w-full">
              <FitText className="ghost-text" maxScale={1.5} style={{ color: "rgba(194,71,127,0.35)" }}>
                IDEAL FOODS
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
          <p className="script-accent" style={{ fontSize: "clamp(30px, 4vw, 44px)" }}>A closer look at our collection</p>
          <h1 className="animate-fade-up display-font mt-2" style={{ fontSize: "clamp(32px, 6vw, 64px)", textTransform: "uppercase" }}>
            Our Products
          </h1>
          <p className="body-ink animate-fade-up mx-auto mt-4 max-w-xl" style={{ fontSize: 15, lineHeight: 1.85 }}>
            {CATALOGUE["Our Syrups"][0]}
          </p>
        </div>
      </div>

      <section className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 pb-16 pt-6 sm:px-10 lg:grid-cols-[0.8fr_1.2fr]" style={{ zIndex: 1 }}>
        <div className="lg:pt-8">
          <p className="script-accent" style={{ fontSize: 28 }}>Every bottle, every jar</p>
          <h2 className="display-font mt-1" style={{ fontSize: "clamp(30px, 4vw, 48px)", textTransform: "uppercase" }}>Every flavour has a story</h2>
          <p className="body-ink mt-5 max-w-sm" style={{ fontSize: 15, lineHeight: 1.85 }}>Explore the Ideal shelf in monochrome, then hover to uncover the pastel flavours behind every bottle and jar.</p>
        </div>

        {/* Desktop collage follows the supplied staggered square layout. */}
        <div
          className="hidden w-full self-start gap-2 lg:grid"
          style={{
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gridTemplateRows: "repeat(6, minmax(0, 1fr))",
            aspectRatio: "7 / 6",
            justifyContent: "center",
          }}
        >
          {GALLERY_ITEMS.map((product, idx) => {
            const span = MOSAIC_SPANS[idx];
            return (
              <Link
                key={`${product.line.key}-${product.slug}`}
                to={`${product.line.detailBase}/${product.slug}`}
                className="gallery-tile group relative overflow-hidden rounded-sm border border-[#2E1F14]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E1F14]"
                style={{
                  backgroundColor: "rgba(255,255,255,0.66)",
                  gridColumn: `${span.col} / span ${span.cs}`,
                  gridRow: `${span.row} / span ${span.rs}`,
                  ["--flavour-colour" as string]: pastel(product.bg),
                }}
                aria-label={`View ${product.name} ${product.line.suffix}`}
              >
                <img src={product.cardImage ?? product.image} alt={`Ideal ${product.name}${product.omitSuffix ? "" : ` ${product.line.suffix}`}`} className="absolute inset-0 h-full w-full object-contain p-1.5 transition duration-500 ease-out group-hover:scale-110" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1 pb-1 pt-4 text-[9px] font-extrabold uppercase leading-tight text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">{product.name}</span>
              </Link>
            );
          })}
          <Link
            to="/enquiry"
            className="flex flex-col items-center justify-center gap-2 rounded-sm border border-[#2E1F14]/20 bg-[#E9B62F]/20 p-3 text-center transition-colors hover:bg-[#E9B62F]/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E1F14]"
            style={{ gridColumn: "5 / span 2", gridRow: "3 / span 2" }}
          >
            <span className="display-font text-lg uppercase leading-tight">Find your<br />Ideal flavour</span>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">Enquire now <ArrowUpRight size={14} /></span>
          </Link>
        </div>

        {/* Mobile / tablet: comfortable 2-per-column grid, same pastel hover tiles */}
        <div className="grid w-full grid-cols-2 gap-3 lg:hidden">
          {GALLERY_ITEMS.map((product) => (
            <Link
              key={`${product.line.key}-${product.slug}`}
              to={`${product.line.detailBase}/${product.slug}`}
              className="gallery-tile group relative overflow-hidden rounded-2xl"
              style={{
                backgroundColor: "rgba(255,255,255,0.66)",
                aspectRatio: "1 / 1",
                ["--flavour-colour" as string]: pastel(product.bg),
              }}
              aria-label={`View ${product.name} ${product.line.suffix}`}
            >
              <img src={product.cardImage ?? product.image} alt={`Ideal ${product.name} ${product.line.suffix}`} className="absolute inset-0 h-full w-full object-contain p-3 transition duration-500 ease-out group-hover:scale-110" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-3 pb-3 pt-8 text-xs font-extrabold uppercase tracking-[0.12em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">{product.name}</span>
            </Link>
          ))}
        </div>
      </section>
      <div className="relative space-y-12 pb-20"><CatalogueSection heading="Non-Fruit Commercial Syrup Blends" /><CatalogueSection heading="Moments of Indulgence" /></div>
      <SiteFooter />
    </div>
  );
}
