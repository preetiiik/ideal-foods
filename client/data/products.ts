export interface Product {
  slug: string;
  /** Full label name, e.g. "Non-Fruit Orange" or "Mango" */
  name: string;
  /** Short uppercase word for the giant ghost text */
  short: string;
  bg: string;
  panel: string;
  image: string;
  /** Clean label-shot bottle used on grid cards (Specialities/Gallery); falls back to `image`. */
  cardImage?: string;
  tagline: string;
  description: string;
  pairs: string[];
  facts: { label: string; value: string }[];
}

export interface ProductLine {
  key: "syrups" | "pickles";
  label: string;
  tagline: string;
  /** Route of the line's hero carousel, e.g. "/syrups" */
  heroPath: string;
  /** Route prefix for detail pages, e.g. "/syrup" */
  detailBase: string;
  /** Word appended after the product name ("Syrup" / "Pickle") */
  suffix: string;
  /** Accent colour used on the landing cards */
  accent: string;
  items: Product[];
}

export const SYRUP_LINE: ProductLine = {
  key: "syrups",
  label: "Syrups",
  tagline: "Pour-time classics since 1972",
  /* The syrups showcase IS the home page */
  heroPath: "/",
  detailBase: "/syrup",
  suffix: "Syrup",
  accent: "#F4845F",
  items: [
    {
      slug: "orange",
      name: "Non-Fruit Orange",
      short: "ORANGE",
      bg: "#F4845F",
      panel: "#F79B7F",
      image: "/bottles/orange.png",
      cardImage: "/orange.png",
      tagline: "Sunshine in every pour",
      description:
        "Our classic since 1972 — bright, zesty orange syrup that turns ordinary glasses into celebrations. Mix with chilled water or milk for an instant burst of citrus.",
      pairs: ["Mocktails & coolers", "Cakes & desserts", "Shakes"],
      facts: [
        { label: "Since", value: "1972" },
        { label: "Net volume", value: "700 ml" },
        { label: "Type", value: "Non-fruit syrup" },
      ],
    },
    {
      slug: "pista",
      name: "Pista",
      short: "PISTA",
      bg: "#6BBF7A",
      panel: "#85CC92",
      image: "/bottles/pista.png",
      cardImage: "/pista.png",
      tagline: "Nutty. Green. Divine.",
      description:
        "Slow-roasted pistachios blended into a silky, nutty syrup. Pour over kulfi, stir into milk, or drizzle on falooda for that timeless mithai-shop flavour.",
      pairs: ["Kulfi & falooda", "Warm milk", "Ice cream"],
      facts: [
        { label: "Since", value: "1972" },
        { label: "Net volume", value: "700 ml" },
        { label: "Type", value: "Non-fruit syrup" },
      ],
    },
    {
      slug: "rose",
      name: "Rose",
      short: "ROSE",
      bg: "#E882B4",
      panel: "#ED9DC4",
      image: "/bottles/rose.png",
      cardImage: "/rose.png",
      tagline: "A garden in a glass",
      description:
        "Damask rose petals distilled into a fragrant, blushing syrup. The soul of falooda and sherbet summers — floral, soothing and unmistakably nostalgic.",
      pairs: ["Falooda & sherbet", "Lassi", "Sorbet"],
      facts: [
        { label: "Since", value: "1972" },
        { label: "Net volume", value: "700 ml" },
        { label: "Type", value: "Non-fruit syrup" },
      ],
    },
    {
      slug: "badam-kesar",
      name: "Badam Kesar",
      short: "KESAR",
      bg: "#E9A13B",
      panel: "#EFB45E",
      image: "/bottles/kesar.png",
      cardImage: "/kesar.png",
      tagline: "Almonds meet saffron gold",
      description:
        "Rich almonds steeped with strands of Kashmiri saffron. A golden, royal syrup that turns warm milk into a festive winter ritual.",
      pairs: ["Warm milk", "Thandai", "Kheer"],
      facts: [
        { label: "Since", value: "1972" },
        { label: "Net volume", value: "700 ml" },
        { label: "Type", value: "Non-fruit syrup" },
      ],
    },
    {
      slug: "badam-thandai",
      name: "Badam Thandai",
      short: "THANDAI",
      bg: "#CDA16B",
      panel: "#D9B283",
      image: "/bottles/thandai.png",
      cardImage: "/thandai.png",
      tagline: "The festival classic",
      description:
        "Almonds, pistachios, seeds and spice in one chilled tradition. Just mix with cold milk for Holi-ready thandai, any day of the year.",
      pairs: ["Chilled milk", "Shakes", "Smoothie bowls"],
      facts: [
        { label: "Since", value: "1972" },
        { label: "Net volume", value: "700 ml" },
        { label: "Type", value: "Non-fruit syrup" },
      ],
    },
    {
      slug: "khus",
      name: "Khus",
      short: "KHUS",
      bg: "#4FAE3D",
      panel: "#70C25E",
      image: "/bottles/khus.png",
      cardImage: "/khus.png",
      tagline: "The coolest summer classic",
      description:
        "Grassy khus (vetiver) distilled into a vivid green syrup — the sharpest cooler of Indian summers. A splash over ice with chilled water, and the heat simply gives up.",
      pairs: ["Sharbat & coolers", "Falooda", "Ice golas"],
      facts: [
        { label: "Since", value: "1972" },
        { label: "Net volume", value: "700 ml" },
        { label: "Type", value: "Non-fruit syrup" },
      ],
    },
    {
      slug: "almond",
      name: "Almond",
      short: "ALMOND",
      bg: "#EDCB92",
      panel: "#F3DAAA",
      image: "/bottles/almond.png",
      cardImage: "/almond.png",
      tagline: "Smooth, nutty, timeless",
      description:
        "Creamed almonds folded into a silky, mellow syrup that turns any glass of milk into a dessert. Gentle, comforting and loved across generations.",
      pairs: ["Warm & cold milk", "Kheer & puddings", "Milkshakes"],
      facts: [
        { label: "Since", value: "1972" },
        { label: "Net volume", value: "700 ml" },
        { label: "Type", value: "Non-fruit syrup" },
      ],
    },
  ],
};

export const PICKLE_LINE: ProductLine = {
  key: "pickles",
  label: "Pickles",
  tagline: "Jar-aged in oil, the old way",
  heroPath: "/pickles",
  detailBase: "/pickle",
  suffix: "Pickle",
  accent: "#E9B62F",
  items: [
    {
      slug: "mango",
      name: "Mango",
      short: "MANGO",
      bg: "#E9B62F",
      panel: "#F0C656",
      image: "/pickles/mango.png",
      cardImage: "/mango.png",
      tagline: "Tang cut with fire",
      description:
        "Raw mango pieces cured in mustard oil with a hand-pounded spice masala. Sharp, fiery and unapologetically homemade — the first taste off every summer thali.",
      pairs: ["Curd rice", "Parathas", "Dal-chawal"],
      facts: [
        { label: "Since", value: "1972" },
        { label: "Net weight", value: "400 g" },
        { label: "Type", value: "Pickle in oil" },
      ],
    },
    {
      slug: "mixed",
      name: "Mixed",
      short: "MIXED",
      bg: "#E07B39",
      panel: "#EA9558",
      image: "/pickles/mixed.png",
      cardImage: "/mixed.png",
      tagline: "A whole garden in one jar",
      description:
        "Mango, lime, chillies, carrot and cauliflower — every jar a crunchier, spicier mixed haul. The one pickle that never meets a leftover plate.",
      pairs: ["Rice plates", "Wraps & rolls", "Cheese boards"],
      facts: [
        { label: "Since", value: "1972" },
        { label: "Net weight", value: "400 g" },
        { label: "Type", value: "Pickle in oil" },
      ],
    },
    {
      slug: "chilly",
      name: "Chilly",
      short: "CHILLY",
      bg: "#7DBB57",
      panel: "#96CB72",
      image: "/pickles/chilly.png",
      cardImage: "/chilly.png",
      tagline: "Green heat, slow burn",
      description:
        "Whole green chillies pickled in oil with garlic and mustard. A slow-building heat that turns simple parathas into an event.",
      pairs: ["Parathas", "Fried rice", "Sandwiches"],
      facts: [
        { label: "Since", value: "1972" },
        { label: "Net weight", value: "400 g" },
        { label: "Type", value: "Pickle in oil" },
      ],
    },
    {
      slug: "lime",
      name: "Lime",
      short: "LIME",
      bg: "#C3CC4E",
      panel: "#D2DA72",
      image: "/pickles/lime.png",
      cardImage: "/lime.png",
      tagline: "Sun-ripened, pickle-country tang",
      description:
        "Sun-ripened limes, salt-cured and spiced the traditional way. That sharp, mouth-watering tang that makes khichdi taste like home.",
      pairs: ["Khichdi", "Curd rice", "Grilled meats"],
      facts: [
        { label: "Since", value: "1972" },
        { label: "Net weight", value: "400 g" },
        { label: "Type", value: "Pickle in oil" },
      ],
    },
  ],
};

export const PRODUCT_LINES: ProductLine[] = [SYRUP_LINE, PICKLE_LINE];

export const findLine = (key?: string): ProductLine | undefined =>
  PRODUCT_LINES.find((l) => l.key === key);

export const findProduct = (line: ProductLine, slug?: string): Product | undefined =>
  line.items.find((p) => p.slug === slug);

export const detailPath = (line: ProductLine, slug: string): string =>
  `${line.detailBase}/${slug}`;

export const GRAIN = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.08'/></svg>`,
);
