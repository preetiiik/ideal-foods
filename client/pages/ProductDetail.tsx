import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import FitText from "@/components/FitText";
import { GRAIN, findProduct, type ProductLine } from "@/data/products";

export default function ProductDetail({ line }: { line: ProductLine }) {
  const { slug } = useParams<{ slug: string }>();
  const product = findProduct(line, slug);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false,
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Invalid or unknown slug → back to the line's hero */
  if (!product) {
    return (
      <div
        className="flex w-full items-center justify-center"
        style={{ height: "100vh", backgroundColor: "#173A2E", fontFamily: "Inter, sans-serif" }}
      >
        <Link
          to={line.heroPath}
          className="flex items-center gap-3 text-white underline-offset-4 hover:underline"
          style={{ fontFamily: "Anton, sans-serif", fontSize: 28, letterSpacing: "0.02em" }}
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={2.25} />
          BACK TO {line.label.toUpperCase()}
        </Link>
      </div>
    );
  }

  const others = line.items.filter((p) => p.slug !== product.slug);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: product.bg,
        transition: "background-color 650ms cubic-bezier(0.4,0,0.2,1)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div className="relative w-full" style={{ minHeight: "100vh", overflow: "hidden" }}>
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

        {/* Giant ghost product name — fitted, soft watermark */}
        <div
          className="pointer-events-none absolute inset-x-0 select-none"
          style={{ zIndex: 2, top: "8%", padding: "0 2vw" }}
        >
          <div className="flex items-center justify-center">
            <div className="ghost-in w-full">
              <FitText className="ghost-text" maxScale={1.5} style={{ color: "rgba(255,255,255,0.9)" }}>
                {product.short}
              </FitText>
            </div>
          </div>
        </div>

        <div
          className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-4 pb-24 pt-24 sm:gap-8 sm:px-6"
          style={{ zIndex: 30 }}
        >
          {/* Product image */}
          <div className={isMobile ? "w-52" : "w-72"} style={{ position: "relative", zIndex: 30 }}>
            <img
              src={product.image}
              alt={`IDEAL ${product.name} ${line.suffix}`}
              className="animate-float w-full"
              style={{
                objectFit: "contain",
                filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.28))",
              }}
              draggable={false}
            />
          </div>

          {/* Text panel */}
          <div
            className="w-full max-w-xl rounded-3xl p-6 sm:p-8"
            style={{ backgroundColor: product.panel, boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color: "rgba(0,0,0,0.55)",
              }}
            >
              IDEAL · SINCE 1972
            </p>
            <h1
              className="animate-fade-up mt-2"
              style={{
                fontFamily: "Anton, sans-serif",
                fontSize: "clamp(34px, 6vw, 58px)",
                lineHeight: 1.05,
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
                color: "white",
              }}
            >
              {product.name} {line.suffix}
            </h1>
            <p
              className="mt-1"
              style={{
                fontSize: 14,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "rgba(0,0,0,0.6)",
              }}
            >
              {product.tagline}
            </p>
            <p className="mt-4" style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(0,0,0,0.78)" }}>
              {product.description}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {product.facts.map((f) => (
                <div
                  key={f.label}
                  className="rounded-2xl px-3 py-3 text-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.45)" }}
                >
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(0,0,0,0.5)" }}>
                    {f.label}
                  </p>
                  <p style={{ fontFamily: "Anton, sans-serif", fontSize: 20, marginTop: 4, color: "rgba(0,0,0,0.85)" }}>
                    {f.value}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(0,0,0,0.5)" }}>
              Pairs beautifully with
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.pairs.map((p) => (
                <span
                  key={p}
                  className="rounded-full px-3 py-1"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.5)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(0,0,0,0.7)",
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Other products in this line */}
          <div className="mt-2 w-full max-w-3xl text-center">
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.75)" }}>
              More {line.label.toLowerCase()}
            </p>
            <div className="mt-4 flex flex-wrap items-end justify-center gap-4 sm:gap-6">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  to={`${line.detailBase}/${p.slug}`}
                  className="transition-transform duration-200 hover:-translate-y-1"
                  style={{ width: isMobile ? 96 : 136 }}
                  title={`IDEAL ${p.name} ${line.suffix}`}
                >
                  <img
                    src={p.image}
                    alt={`IDEAL ${p.name} ${line.suffix}`}
                    className="w-full"
                    style={{ objectFit: "contain", filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.25))" }}
                    draggable={false}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom-left back link — FIXED to the viewport so it stays visible
            while scrolling the whole detail page (sticky). A frosted pill
            keeps it readable over any content behind it. */}
        <div className="fixed bottom-6 left-4 sm:bottom-8 sm:left-6" style={{ zIndex: 60 }}>
          <Link
            to={line.heroPath}
            className="flex items-center gap-2 text-white"
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: "clamp(14px, 2.2vw, 22px)",
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              textDecoration: "none",
              opacity: 0.98,
              transition: "opacity 200ms, background-color 200ms",
              backgroundColor: "rgba(0,0,0,0.22)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              padding: "6px 12px",
              borderRadius: 999,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.32)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.98";
              e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.22)";
            }}
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.25} />
            All {line.label.toLowerCase()}
          </Link>
        </div>
      </div>
    </div>
  );
}
