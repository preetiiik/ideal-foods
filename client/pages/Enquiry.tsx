import { ClipboardList, Phone, Mail, MapPin, MessagesSquare, Truck, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/SiteChrome";
import SiteBackdrop from "@/components/SiteBackdrop";
import ContactForm from "@/components/ContactForm";
import FitText from "@/components/FitText";

const STEPS = [
  { icon: ClipboardList, title: "Tell us your need", text: "Quantities, flavours, city — the more detail, the faster we respond.", accent: "#C25E3A" },
  { icon: MessagesSquare, title: "We call you back", text: "Our team reaches out within 1–2 working days to discuss pricing.", accent: "#C2477F" },
  { icon: Truck, title: "Delivery arranged", text: "We ship across the region with reliable transport partners.", accent: "#B97E14" },
  { icon: ShieldCheck, title: "Quality sealed in", text: "Every jar and bottle leaves Belgaum only after our quality checks.", accent: "#2F6B4F" },
];

export default function Enquiry() {
  return (
    <div className="relative w-full overflow-hidden" style={{ fontFamily: "'Nunito Sans', sans-serif", color: "#2E1F14" }}>
      <SiteBackdrop />

      {/* Hero strip — content pushed below the ghost word */}
      <div className="page-hero relative w-full" style={{ paddingBottom: 70 }}>
        <div
          className="pointer-events-none absolute inset-x-0 select-none"
          style={{ zIndex: 2, top: "calc(84px + 5vh)", padding: "0 2vw" }}
        >
          <div className="flex items-center justify-center">
            <div className="ghost-in w-full">
              <FitText className="ghost-text" maxScale={1.5} style={{ color: "rgba(107,191,122,0.38)" }}>
                ENQUIRE
              </FitText>
            </div>
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6" style={{ zIndex: 30 }}>
          <p className="script-accent" style={{ fontSize: "clamp(30px, 4vw, 44px)" }}>Bulk &amp; retail orders</p>
          <h1 className="animate-fade-up display-font mt-2" style={{ fontSize: "clamp(32px, 6vw, 64px)", textTransform: "uppercase" }}>
            Enquiry
          </h1>
          <p className="body-ink animate-fade-up mx-auto mt-4 max-w-xl" style={{ fontSize: 15, lineHeight: 1.85 }}>
            Stockists, distributors, bakeries, cafes and hotels — bring home the oldest name in syrups. Tell us what
            you need and we'll make it happen.
          </p>
        </div>
      </div>      {/* Form + steps — open two-column section on the beige backdrop */}
      <section className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6" style={{ zIndex: 1 }}>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <ContactForm variant="enquiry" />

            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", color: "#C25E3A" }}>
                What happens next
              </p>
              <div className="mt-5 flex flex-col gap-4">
                {STEPS.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.title}
                      className="flex items-start gap-4 rounded-3xl bg-white/90 p-5"
                      style={{ border: `1.5px solid ${s.accent}44`, boxShadow: "0 12px 30px rgba(64,42,30,0.08)" }}
                    >
                      <span
                        className="flex items-center justify-center rounded-full"
                        style={{ width: 42, height: 42, backgroundColor: `${s.accent}1A`, border: `1.5px solid ${s.accent}66`, flexShrink: 0 }}
                      >
                        <Icon size={17} style={{ color: s.accent }} />
                      </span>
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#2E1F14" }}>
                          <span style={{ color: s.accent, fontFamily: "'Fraunces', serif", fontWeight: 700, marginRight: 8 }}>{idx + 1}.</span>
                          {s.title}
                        </p>
                        <p className="mt-1" style={{ fontSize: 13, lineHeight: 1.7, color: "#5C4636" }}>
                          {s.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Prefer to talk? */}
              <div
                className="mt-6 rounded-3xl p-5"
                style={{ backgroundColor: "rgba(255,255,255,0.92)", border: "1.5px solid rgba(47,107,79,0.35)" }}
              >
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#2F6B4F" }}>
                  Prefer to talk?
                </p>
                <div className="mt-3 flex flex-col gap-2" style={{ fontSize: 13.5, color: "#2E1F14" }}>
                  <a href="tel:+919845908686" className="flex items-center gap-2.5" style={{ color: "inherit", textDecoration: "none" }}>
                    <Phone size={14} style={{ color: "#2F6B4F" }} /> +91-9845908686
                  </a>
                  <a href="mailto:idealfoods@rediffmail.com" className="flex items-center gap-2.5" style={{ color: "inherit", textDecoration: "none" }}>
                    <Mail size={14} style={{ color: "#2F6B4F" }} /> idealfoods@rediffmail.com
                  </a>
                  <span className="flex items-start gap-2.5">
                    <MapPin size={14} style={{ marginTop: 3, color: "#2F6B4F", flexShrink: 0 }} /> 671, Khanapur Road, Udyambag, Belgaum- 590 008
                  </span>
                </div>
              </div>
            </div>
          </div>
      </section>

      <SiteFooter />
    </div>
  );
}
