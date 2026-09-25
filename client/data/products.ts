import { CATALOGUE } from "./catalogue";

export interface Product {
  slug: string;
  /** Full label name, e.g. "Non-Fruit Orange" or "Mango" */
  name: string;
  /** Short uppercase word for the giant ghost text */
  short: string;
  /** Skip appending the line suffix (e.g. "Mango Chutney" should not read "Mango Chutney Pickle") */
  omitSuffix?: boolean;
  bg: string;
  panel: string;
  image: string;
  /** Clean label-shot bottle used on grid cards (Specialities/Gallery); falls back to `image`. */
  cardImage?: string;
  /** Optional decorative background colour for product cards. */
  cardBg?: string;
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
      name: "Orange",
      short: "ORANGE",
      bg: "#F4845F",
      panel: "#F79B7F",
      image: "/bottles/orange.png",
      cardImage: "/orange.png",
      tagline: "Sunshine in every pour",
      description: CATALOGUE["Orange Syrup"].join("\n\n"),
      pairs: ["Beverages", "Desserts", "Culinary creations"],
      facts: [{ label: "Collection", value: "Non-fruit blend" }],
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
      description: CATALOGUE["Pista Syrup"].join("\n\n"),
      pairs: ["Milkshakes", "Ice creams", "Fine confections"],
      facts: [{ label: "Collection", value: "Signature syrup" }],
    },
    {
      slug: "rose",
      name: "Rose",
      short: "ROSE",
      bg: "#E2344E",
      panel: "#EE6B80",
      image: "/bottles/rose.png",
      cardImage: "/rose.png",
      tagline: "A garden in a glass",
      description: CATALOGUE["Rose Syrup"].join("\n\n"),
      pairs: ["Beverages", "Desserts", "Culinary creations"],
      facts: [{ label: "Collection", value: "Non-fruit blend" }],
    },
    {
      slug: "badam-kesar",
      name: "Exotic Badam Kesar",
      short: "KESAR",
      bg: "#E9A13B",
      panel: "#EFB45E",
      image: "/bottles/kesar.png",
      cardImage: "/kesar.png",
      tagline: "Almonds meet saffron gold",
      description: CATALOGUE["Exotic Badam Kesar Syrup"].join("\n\n"),
      pairs: ["Beverages", "Desserts", "Culinary creations"],
      facts: [{ label: "Collection", value: "Signature syrup" }],
    },
    {
      slug: "badam-thandai",
      name: "Classic Thandai",
      short: "THANDAI",
      cardBg: "#E8BC42",
      bg: "#CDA16B",
      panel: "#D9B283",
      image: "/bottles/thandai.png",
      cardImage: "/thandai.png",
      tagline: "The festival classic",
      description: CATALOGUE["Classic Thandai Syrup"].join("\n\n"),
      pairs: ["Chilled milk", "Desserts", "Festive creations"],
      facts: [{ label: "Collection", value: "Signature syrup" }],
    },
    {
      slug: "elaichi",
      name: "Elaichi",
      short: "ELAICHI",
      bg: "#4FAE3D",
      panel: "#70C25E",
      image: "/bottles/elaichi.png",
      cardImage: "/elaichi.png",
      tagline: "The fragrant dessert classic",
      description: CATALOGUE["Elaichi Syrup"].join("\n\n"),
      pairs: ["Beverages", "Desserts", "Culinary creations"],
      facts: [{ label: "Collection", value: "Non-fruit blend" }],
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
      description: CATALOGUE["Almond Syrup"].join("\n\n"),
      pairs: ["Chilled drinks"],
      facts: [{ label: "Collection", value: "Signature syrup" }],
    },
    {
      slug: "pineapple",
      name: "Pineapple",
      short: "PINEAPPLE",
      bg: "#C79324",
      panel: "#E5BD64",
      image: "/bottles/pineapple.png",
      cardImage: "/pineapple.png",
      tagline: "Mellow tropical sweetness",
      description: CATALOGUE["Pineapple Syrup"].join("\n\n"),
      pairs: ["Beverages", "Desserts", "Culinary creations"],
      facts: [
        {
          label: "Collection",
          value: "Non-fruit blend",
        },
      ],
    },
    {
      slug: "khus",
      name: "Khus",
      short: "KHUS",
      bg: "#397D59",
      panel: "#6DA382",
      image: "/bottles/khus.png",
      cardImage: "/khus.png",
      tagline: "Cool, verdant, and deeply evocative",
      description: CATALOGUE["Khus Syrup"].join("\n\n"),
      pairs: ["Beverages", "Desserts", "Culinary creations"],
      facts: [
        {
          label: "Collection",
          value: "Non-fruit blend",
        },
      ],
    },
    {
      slug: "raspberry",
      name: "Raspberry",
      short: "RASPBERRY",
      bg: "#B63E67",
      panel: "#D67B97",
      image: "/bottles/raspberry.png",
      cardImage: "/raspberry.png",
      tagline: "Vibrant and alluring",
      description: CATALOGUE["Raspberry Syrup"].join("\n\n"),
      pairs: ["Beverages", "Desserts", "Culinary creations"],
      facts: [
        {
          label: "Collection",
          value: "Non-fruit blend",
        },
      ],
    },
  ],
};

export const PICKLE_LINE: ProductLine = {
  key: "pickles",
  label: "Pickles",
  tagline: "Jar-aged the old way",
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
      name: "Mango Chutney",
      short: "CHUTNEY",
      omitSuffix: true,
      bg: "#E07B39",
      panel: "#EA9558",
      image: "/pickles/mixed.png",
      cardImage: "/mixed.png",
      tagline: "Sweet, spiced, spoon-ready",
      description:
        "Slow-cooked mangoes with warming spices and a gentle sweetness — a chutney that lifts rice plates, wraps and cheese boards alike.",
      pairs: ["Rice plates", "Wraps & rolls", "Cheese boards"],
      facts: [
        { label: "Since", value: "1972" },
        { label: "Net weight", value: "400 g" },
        { label: "Type", value: "Chutney" },
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
        "Whole green chillies pickled with garlic and mustard. A slow-building heat that turns simple parathas into an event.",
      pairs: ["Parathas", "Fried rice", "Sandwiches"],
      facts: [
        { label: "Since", value: "1972" },
        { label: "Net weight", value: "400 g" },
        { label: "Type", value: "Pickle" },
      ],
    },
    {
      slug: "lime",
      name: "Sweet Lime",
      short: "SWEET LIME",
      bg: "#C3CC4E",
      panel: "#D2DA72",
      image: "/pickles/lime.png",
      cardImage: "/lime.png",
      tagline: "Sun-ripened, pickle-country tang",
      description:
        "Sun-ripened sweet limes, salt-cured and spiced the traditional way. That sharp, mouth-watering tang that makes khichdi taste like home.",
      pairs: ["Khichdi", "Curd rice", "Grilled meats"],
      facts: [
        { label: "Since", value: "1972" },
        { label: "Net weight", value: "400 g" },
        { label: "Type", value: "Pickle" },
      ],
    },
  ],
};

export const PRODUCT_LINES: ProductLine[] = [SYRUP_LINE, PICKLE_LINE];

export const findLine = (key?: string): ProductLine | undefined =>
  PRODUCT_LINES.find((l) => l.key === key);

export const findProduct = (
  line: ProductLine,
  slug?: string,
): Product | undefined => line.items.find((p) => p.slug === slug);

export const detailPath = (line: ProductLine, slug: string): string =>
  `${line.detailBase}/${slug}`;

export const GRAIN = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.08'/></svg>`,
);
