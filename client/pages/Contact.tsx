import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { SiteFooter } from "@/components/SiteChrome";
import SiteBackdrop from "@/components/SiteBackdrop";
import ContactForm from "@/components/ContactForm";
import FitText from "@/components/FitText";

const INFO = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91-9845908686",
    href: "tel:+919845908686",
    accent: "#C25E3A",
  },
  {
    icon: Mail,
    label: "Email",
    value: "idealfoods@rediffmail.com",
    href: "mailto:idealfoods@rediffmail.com",
    accent: "#B97E14",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Ideal Food Products. 671, Khanapur Road, Udyambag, Belgaum- 590 008",
    href: "https://maps.google.com/?q=671+Khanapur+Road+Udyambag+Belgaum+590008",
    accent: "#2F6B4F",
  },
  {
    icon: Clock,
    label: "Working hours",
    value: "Monday – Saturday · 9:30 am – 5:45 pm",
    href: undefined,
    accent: "#1D74B7",
  },
];

export default function Contact() {
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
              <FitText className="ghost-text" maxScale={1.5} style={{ color: "rgba(244,132,95,0.35)" }}>
                SAY HELLO
              </FitText>
            </div>
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6" style={{ zIndex: 30 }}>
          <p className="script-accent" style={{ fontSize: "clamp(30px, 4vw, 44px)" }}>Get in touch</p>
          <h1 className="animate-fade-up display-font mt-2" style={{ fontSize: "clamp(32px, 6vw, 64px)", textTransform: "uppercase" }}>
            Contact Us
          </h1>
          <p className="body-ink animate-fade-up mx-auto mt-4 max-w-xl" style={{ fontSize: 15, lineHeight: 1.85 }}>
            Questions about our syrups and pickles, an order, or where to find us? Write to us — we read every message.
          </p>
        </div>
      </div>

      {/* Form + info — open two-column section on the beige backdrop */}
      <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6" style={{ zIndex: 1 }}>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <ContactForm variant="contact" />

            <div className="flex flex-col gap-5">
              {INFO.map((i) => {
                const Icon = i.icon;
                const inner = (
                  <div
                    className="flex items-start gap-4 rounded-3xl bg-white/90 p-5"
                    style={{
                      border: `1.5px solid ${i.accent}44`,
                      boxShadow: "0 12px 30px rgba(64,42,30,0.08)",
                      height: "100%",
                    }}
                  >
                    <span
                      className="flex items-center justify-center rounded-full"
                      style={{ width: 42, height: 42, backgroundColor: `${i.accent}1A`, border: `1.5px solid ${i.accent}66`, flexShrink: 0 }}
                    >
                      <Icon size={17} style={{ color: i.accent }} />
                    </span>
                    <div>
                      <p style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: i.accent }}>
                        {i.label}
                      </p>
                      <p className="mt-1" style={{ fontSize: 14, lineHeight: 1.65, color: "#2E1F14" }}>
                        {i.value}
                      </p>
                    </div>
                  </div>
                );
                return i.href ? (
                  <a key={i.label} href={i.href} target={i.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                    {inner}
                  </a>
                ) : (
                  <div key={i.label}>{inner}</div>
                );
              })}
            </div>
          </div>
      </section>

      <SiteFooter />
    </div>
  );
}
