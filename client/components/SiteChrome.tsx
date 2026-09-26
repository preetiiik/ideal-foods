import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail, MapPin, ChevronDown, ChevronRight } from "lucide-react";
import { PRODUCT_LINES } from "@/data/products";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Our Products", to: "/gallery" },
  { label: "Contact Us", to: "/contact" },
  { label: "Enquiry", to: "/enquiry" },
];

/* The enquiry button is the header CTA, so it is not repeated as a text link. */
const HEADER_NAV_LINKS = NAV_LINKS.filter((link) => link.to !== "/enquiry");

/* Routes whose top-of-page is a dark cinematic hero — the nav stays hidden
   there until the hero is half scrolled away, then slides in. */
const DARK_HERO_RE = /^(\/|\/pickles)?$|\/(syrup|pickle)\/[^/]+/;

/** Rendered ONCE at app level (App.tsx) — always visible, above every page. */
export function SiteNav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    setProductsOpen(false);
    setMobileProductsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Reading the document rect forces a layout flush, which pulls the
    // compositor's scroll offset into the DOM — reliable even in embedded
    // webviews that scroll without ever dispatching "scroll" events.
    const getY = () => -document.documentElement.getBoundingClientRect().top;
    const read = () => {
      const y = getY();
      setScrolled(y > 60);
      // Scrolling past the hero brings the full header back — drop the burger menu.
      if (y > 60) setOpen(false);
    };
    read();
    let lastY = getY();
    const onScroll = () => {
      lastY = getY();
      read();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Fallback poll for webviews where the listener above never fires.
    const id = window.setInterval(() => {
      const y = getY();
      if (y !== lastY) {
        lastY = y;
        read();
      }
    }, 120);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        document.getElementById("site-menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", dismiss);
    return () => window.removeEventListener("keydown", dismiss);
  }, [open]);

  const heroTop = !scrolled && DARK_HERO_RE.test(location.pathname);
  /* Every hero uses logo + burger only — the full link bar returns on scroll. */
  const heroMinimal = !scrolled;
  const ink = heroTop ? "#FFFFFF" : "#2E1F14";
  const lineInk = heroTop ? "rgba(255,255,255,0.5)" : "rgba(46,31,20,0.35)";

  return (
    <header
      className="fixed inset-x-0 top-0"
      style={{
        zIndex: 90,
        backgroundColor: scrolled ? "rgba(255,247,234,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(64,42,30,0.10)" : "1px solid transparent",
        boxShadow: scrolled ? "0 6px 24px rgba(64,42,30,0.08)" : "none",
        transition:
          "background-color 300ms ease, backdrop-filter 300ms ease, box-shadow 300ms ease, border-color 300ms ease",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo sits on a white pill so it reads on both the dark heroes and the cream sections. */}
        <Link
          to="/"
          className="inline-flex items-center rounded-2xl px-1.5 py-1"
          style={{
            textDecoration: "none",
          }}
          aria-label="IDEAL Food Products — Home"
        >
          <img src="/ideal-logo.png" alt="IDEAL logo" className="brand-logo" draggable={false} />
        </Link>

        {/* Desktop links — hidden on the hero (burger replaces them). */}
        {!heroMinimal && (
        <nav
          className="hidden items-center gap-7 md:flex"
          style={{
            transition: "opacity 350ms ease",
          }}
        >
          {HEADER_NAV_LINKS.map((l) =>
            l.to === "/gallery" ? (
              /* Our Products — dropdown with Syrups / Pickles groups,
                 each opening a nested submenu of its products on hover */
              <div
                key={l.to}
                className="relative"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <Link
                  to="/gallery"
                  className="site-nav-link flex items-center gap-1.5"
                  aria-expanded={productsOpen}
                  onFocus={() => setProductsOpen(true)}
                  style={{
                    color: ink,
                    fontSize: 12.5,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    textDecoration: "none",
                    opacity:
                      location.pathname === "/gallery" || location.pathname.startsWith("/syrup") || location.pathname.startsWith("/pickle")
                        ? 1
                        : 0.66,
                    transition: "opacity 200ms, color 300ms ease",
                  }}
                >
                  {l.label}
                  <ChevronDown
                    size={13}
                    strokeWidth={2.5}
                    style={{ transform: productsOpen ? "rotate(180deg)" : "none", transition: "transform 200ms" }}
                  />
                </Link>

                {productsOpen && (
                  <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
                    <div
                      className="w-52 rounded-2xl border p-2"
                      style={{
                        backgroundColor: "#FFF7EA",
                        borderColor: "rgba(64,42,30,0.12)",
                        boxShadow: "0 18px 44px rgba(64,42,30,0.18)",
                      }}
                    >
                      {PRODUCT_LINES.map((line) => (
                        <div key={line.key} className="group/sub relative">
                          <Link
                            to={line.heroPath}
                            className="nav-panel-item flex items-center justify-between rounded-xl"
                            style={{
                              color: "#2E1F14",
                              fontSize: 12,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              textDecoration: "none",
                              padding: "10px 12px",
                            }}
                          >
                            {line.label}
                            <ChevronRight size={13} strokeWidth={2.5} />
                          </Link>

                          {/* Sub dropdown — the line's individual products */}
                          <div
                            className="invisible absolute left-full top-0 ml-1 w-52 rounded-2xl border p-2 opacity-0 transition-all duration-150 group-hover/sub:visible group-hover/sub:opacity-100"
                            style={{
                              backgroundColor: "#FFF7EA",
                              borderColor: "rgba(64,42,30,0.12)",
                              boxShadow: "0 18px 44px rgba(64,42,30,0.18)",
                            }}
                          >
                            {line.items.map((p) => (
                              <Link
                                key={p.slug}
                                to={`${line.detailBase}/${p.slug}`}
                                className="nav-panel-item block rounded-lg"
                                style={{
                                  color: "#5C4636",
                                  fontSize: 12.5,
                                  fontWeight: 600,
                                  textDecoration: "none",
                                  padding: "8px 12px",
                                }}
                              >
                                {p.name} {line.suffix}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={l.to}
                to={l.to}
                data-active={location.pathname === l.to}
                className="site-nav-link"
                style={{
                  color: ink,
                  fontSize: 12.5,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  textDecoration: "none",
                  opacity: location.pathname === l.to ? 1 : 0.66,
                  transition: "opacity 200ms, color 300ms ease",
                }}
              >
                {l.label}
              </Link>
            )
          )}
          <Link to="/enquiry">
            <span className="btn-solid-gold" style={{ padding: "10px 18px" }}>
              Enquire
            </span>
          </Link>
        </nav>
        )}

        {/* Burger — the single control on the hero; mobile toggle after scrolling. */}
        <button
          className={`flex items-center justify-center ${heroMinimal ? "" : "md:hidden"}`}
          type="button"
          aria-expanded={open}
          id="site-menu-toggle"
          aria-controls="site-burger-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            border: `1.5px solid ${lineInk}`,
            color: ink,
            background: heroTop ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.6)",
            transition: "color 300ms ease, border-color 300ms ease, background-color 300ms ease, opacity 350ms ease",
          }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Compact dropdown card anchored under the burger — not a full-width strip */}
      {open && (
          <div
            id="site-burger-menu"
            className="absolute right-3 top-full sm:right-5"
            style={{
              marginTop: 10,
              width: "min(320px, calc(100vw - 24px))",
              backgroundColor: "rgba(255,247,234,0.98)",
              border: "1px solid rgba(64,42,30,0.12)",
              borderRadius: 18,
              boxShadow: "0 20px 45px rgba(64,42,30,0.22)",
              overflow: "hidden auto",
              maxHeight: "calc(100vh - 130px)",
            }}
          >
          <div className="flex flex-col px-4 py-4">
            {HEADER_NAV_LINKS.map((l) =>
              l.to === "/gallery" ? (
                /* Our Products — expandable accordion with both lines + products */
                <div key={l.to} style={{ borderBottom: "1px solid rgba(64,42,30,0.08)" }}>
                  <button
                    type="button"
                    aria-expanded={mobileProductsOpen}
                    onClick={() => setMobileProductsOpen((v) => !v)}
                    className="flex w-full items-center justify-between"
                    style={{
                      color: "#2E1F14",
                      fontSize: 14,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      background: "none",
                      border: "none",
                      padding: "13px 0",
                      cursor: "pointer",
                      opacity: location.pathname === l.to ? 1 : 0.66,
                    }}
                  >
                    {l.label}
                    <ChevronDown
                      size={15}
                      strokeWidth={2.5}
                      style={{ transform: mobileProductsOpen ? "rotate(180deg)" : "none", transition: "transform 200ms" }}
                    />
                  </button>
                  {mobileProductsOpen && (
                    <div className="pb-3">
                      <Link
                        to="/gallery"
                        onClick={() => setOpen(false)}
                        style={{
                          display: "block",
                          padding: "10px 0 6px",
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          color: "#2F6B4F",
                          textDecoration: "none",
                        }}
                      >
                        View all products
                      </Link>
                      {PRODUCT_LINES.map((line) => (
                        <div key={line.key}>
                          <Link
                            to={line.heroPath}
                            onClick={() => setOpen(false)}
                            style={{
                              display: "block",
                          padding: "10px 0 4px",
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          color: "#C25E3A",
                              textDecoration: "none",
                            }}
                          >
                            {line.label}
                          </Link>
                          {line.items.map((p) => (
                            <Link
                              key={p.slug}
                              to={`${line.detailBase}/${p.slug}`}
                              onClick={() => setOpen(false)}
                              style={{
                                display: "block",
                                padding: "7px 0 7px 14px",
                                fontSize: 13,
                                color: "#5C4636",
                                textDecoration: "none",
                              }}
                            >
                              {p.name} {line.suffix}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={l.to}
                  to={l.to}
                  style={{
                    color: "#2E1F14",
                    fontSize: 14,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    textDecoration: "none",
                    padding: "13px 0",
                    borderBottom: "1px solid rgba(64,42,30,0.08)",
                    opacity: location.pathname === l.to ? 1 : 0.66,
                  }}
                >
                  {l.label}
                </Link>
              )
            )}
            <Link to="/enquiry" className="mt-4" style={{ textDecoration: "none" }}>
              <span className="btn-solid-gold w-full justify-center">Enquire</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* Brand icons drawn inline (lucide dropped brand glyphs) — stroke style matches the site's icons. */
function InstagramIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative w-full" style={{ backgroundColor: "#0c0b3a", color: "white" }}>
      {/* Colour washes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(620px 420px at 12% 8%, rgba(244,132,95,0.22), transparent 70%)," +
            "radial-gradient(560px 420px at 88% 30%, rgba(232,130,180,0.18), transparent 70%)," +
            "radial-gradient(640px 460px at 78% 92%, rgba(233,161,59,0.20), transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {/* Brand + quick links */}
        <div>
          <Link to="/" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior })} aria-label="IDEAL Food Products — Home" style={{ display: "inline-block", textDecoration: "none" }}>
            <img src="/ideal-logo.png" alt="IDEAL logo" className="brand-logo-footer" draggable={false} />
          </Link>
          <p className="mt-4" style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.72)", maxWidth: 260 }}>
            The oldest manufacturers of all syrups — crafting syrups and pickles in Belgaum since 1972.
          </p>
          <p className="script-accent mt-4" style={{ fontSize: 26, color: "#F5C86A" }}>
            Since 1972
          </p>
        </div>

        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", color: "#F5C86A" }}>
            Quick Links
          </p>
          <div className="mt-4 flex flex-col gap-2.5">
            {[...NAV_LINKS].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={{ fontSize: 13.5, color: "rgba(255,255,255,0.78)", textDecoration: "none", transition: "color 150ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F5C86A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.78)")}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", color: "#F5C86A" }}>
            Our Products
          </p>
          {/* Two columns — syrups on the left, pickles on the right */}
          <div className="mt-4 grid grid-cols-2 gap-x-6">
            {PRODUCT_LINES.map((line) => (
              <div key={line.key}>
                <Link
                  to={line.heroPath}
                  style={{ fontSize: 13.5, fontWeight: 700, color: "white", textDecoration: "none", letterSpacing: "0.04em" }}
                >
                  {line.label}
                </Link>
                <div className="mt-2 flex flex-col gap-1.5">
                  {line.items.map((p) => (
                    <Link
                      key={p.slug}
                      to={`${line.detailBase}/${p.slug}`}
                      style={{ fontSize: 12.5, color: "rgba(255,255,255,0.66)", textDecoration: "none", transition: "color 150ms" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#F5C86A")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.66)")}
                    >
                      {p.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", color: "#F5C86A" }}>
            Contact
          </p>
          <div className="mt-4 flex flex-col gap-3.5" style={{ fontSize: 13, color: "rgba(255,255,255,0.78)", lineHeight: 1.6 }}>
            <span className="flex items-start gap-2.5">
              <MapPin size={15} style={{ marginTop: 3, flexShrink: 0, color: "#F5C86A" }} />
              Ideal Food Products. 671, Khanapur Road, Udyambag, Belgaum- 590 008
            </span>
            <span className="flex items-center gap-2.5"><Phone size={15} /> 2442621 / 2442686</span>
            <a href="tel:+919845908686" className="flex items-center gap-2.5" style={{ color: "inherit", textDecoration: "none" }}>
              <Phone size={15} style={{ flexShrink: 0, color: "#F5C86A" }} />
              +91-9845908686
            </a>
            <a href="mailto:idealfoods@rediffmail.com" className="flex items-center gap-2.5" style={{ color: "inherit", textDecoration: "none" }}>
              <Mail size={15} style={{ flexShrink: 0, color: "#F5C86A" }} />
              idealfoods@rediffmail.com
            </a>
          </div>
          <p className="mt-5" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", color: "#F5C86A" }}>
            Follow us on
          </p>
          <div className="mt-3 flex gap-3">
            {[
              /* Official app colours — Instagram's signature gradient, FB blue, WA green */
              { label: "Instagram — @idealfoods.belgaum", href: "https://share.google/Y7JRsVY8MGVlnKlq6", bg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)", Icon: InstagramIcon },
              { label: "Facebook — Ideal Foods", href: "https://share.google/WIeGpYAs4yDnjixAj", bg: "#1877F2", Icon: FacebookIcon },
              { label: "WhatsApp — +91 98459 08686", href: "https://wa.me/919845908686", bg: "#25D366", Icon: WhatsAppIcon },
            ].map(({ label: sLabel, href, bg, Icon }) => (
              <a
                key={sLabel}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={sLabel}
                className="transition-transform duration-200 hover:-translate-y-1"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 999,
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
                }}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        <div
          className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-4 py-5 text-center sm:px-6"
          style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em" }}
        >
          <span>
            © {new Date().getFullYear()} Ideal Food Products, Belgaum. All Rights Reserved. Designed by{" "}
            <a
              href="https://spitel.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#F5C86A", textDecoration: "none", transition: "color 150ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FFE3A1")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#F5C86A")}
            >
              Spitel Pvt. Ltd.
            </a>
          </span>
          <span>Come join us in this flavourful journey!</span>
        </div>
      </div>
    </footer>
  );
}
