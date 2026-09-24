import { CATALOGUE } from "@/data/catalogue";

type CatalogueHeading = keyof typeof CATALOGUE;
export function CatalogueCopy({
  heading,
  start = 0,
  end,
}: {
  heading: CatalogueHeading;
  start?: number;
  end?: number;
}) {
  return (
    <div className="space-y-4">
      {CATALOGUE[heading].slice(start, end).map((text) => (
        <p
          key={text}
          className="body-ink"
          style={{ fontSize: 15.5, lineHeight: 1.9 }}
        >
          {text}
        </p>
      ))}
    </div>
  );
}
export function CatalogueSection({ heading }: { heading: CatalogueHeading }) {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
      <h2
        className="display-font mb-6"
        style={{
          fontSize: "clamp(26px, 4vw, 44px)",
          textTransform: "uppercase",
        }}
      >
        {heading}
      </h2>
      <div className="max-w-4xl">
        <CatalogueCopy heading={heading} />
      </div>
    </section>
  );
}
