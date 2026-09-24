import { useId, type CSSProperties } from "react";
import type { Product } from "@/data/products";

// Follow each supplied piece's silhouette to hide its photographic backdrop.
const PIECE_OUTLINES: Record<string, string> = {
  mango: "M .09 .66 L .18 .51 L .36 .39 L .5 .28 L .63 .15 L .75 .04 L .83 .025 L .91 .11 L .95 .36 L .91 .48 L .87 .68 L .81 .79 L .74 .97 L .6 .97 L .38 .94 L .23 .82 Z",
  mixed: "M .085 .78 L .19 .7 L .32 .52 L .43 .42 L .59 .29 L .73 .14 L .85 .085 L .92 .14 L .96 .31 L .91 .42 L .83 .53 L .74 .65 L .6 .76 L .43 .87 L .25 .96 L .15 .9 Z",
  chilly: "M .02 .94 L .035 .82 L .14 .66 L .27 .62 L .36 .52 L .49 .47 L .64 .34 L .78 .23 L .87 .19 L .92 .11 L .92 .035 Q .95 .005 .965 .04 L .98 .12 L .955 .25 L .93 .4 L .87 .51 L .74 .66 L .55 .81 L .32 .9 L .13 .91 L .04 .97 Z",
  lime: "M .06 .745 L .19 .61 L .26 .48 L .33 .42 L .39 .45 L .5 .33 L .57 .26 L .62 .14 L .65 .035 L .71 .06 L .78 .13 L .85 .27 L .89 .41 L .94 .69 L .93 .89 L .82 .93 L .63 .91 L .5 .94 L .38 .9 L .28 .94 L .15 .86 Z",
};

/** SVG masks keep the original label and lid aligned at every card size. */
export default function PickleJar({ product, className, style }: {
  product: Product;
  className?: string;
  style?: CSSProperties;
}) {
  const id = useId().replace(/:/g, "");
  const tall = product.slug === "chilly" || product.slug === "lime";
  const seam = product.slug === "chilly" ? 262 : product.slug === "lime" ? 240 : product.slug === "mixed" ? 215 : 228;
  const src = product.cardImage ?? product.image;
  const photo = <image href={src} width="1088" height="1445" preserveAspectRatio="none" />;

  return (
    <svg viewBox="0 0 1088 1445" role="img"
      aria-label={`Ideal ${product.name}${product.omitSuffix ? "" : " Pickle"}`}
      className={`pickle-jar ${className ?? ""}`} style={style}>
      <defs>
        <clipPath id={`${id}-body`}>
          <path d={`M 205 ${seam} Q 544 ${seam - 30} 883 ${seam} L 875 310 Q 995 350 975 470 L 965 1160 Q 1020 1300 910 1380 Q 544 1500 175 1380 Q 75 1300 125 1160 L 140 470 Q 105 350 215 310 Z`} />
        </clipPath>
        <clipPath id={`${id}-lid`}>
          <path d={`M ${tall ? 158 : 190} ${tall ? 70 : 28} Q 544 ${tall ? 30 : -28} ${tall ? 930 : 898} ${tall ? 70 : 28} L ${tall ? 934 : 900} ${seam - 12} Q 544 ${seam + 26} ${tall ? 155 : 188} ${seam - 12} Z`} />
        </clipPath>
        <clipPath id={`${id}-piece`} clipPathUnits="objectBoundingBox">
          <path d={PIECE_OUTLINES[product.slug]} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-body)`}>{photo}</g>
      <ellipse className="pickle-mouth" cx="544" cy={seam + 6} rx="325" ry="27" fill="#482314" stroke="#d5b179" strokeWidth="12" />
        <g className="pickle-piece" style={{
          "--piece-x": "0px",
          "--piece-y": "-150px",
          "--piece-turn": "0deg",
          "--piece-delay": "190ms",
          transformOrigin: `544px ${seam}px`,
        } as CSSProperties}>
          <g transform={`translate(334, ${seam - 100})`}>
            {[
              { x: -65, y: 85, size: 250, angle: -22 },
              { x: 180, y: 65, size: 260, angle: 25 },
              { x: 45, y: -30, size: 330, angle: -5 },
            ].map(({ x, y, size, angle }, index) => (
              <g key={index} transform={`translate(${x}, ${y}) rotate(${angle}, ${size / 2}, ${size / 3})`}>
                <image href={`/${product.slug}-piece.png`} width={size} height={size * 2 / 3}
                  preserveAspectRatio="xMidYMid meet" clipPath={`url(#${id}-piece)`} />
              </g>
            ))}
          </g>
        </g>
      {/* Deterministic trajectories keep the scatter stable across renders. */}
      <g aria-hidden="true" pointerEvents="none">
        {Array.from({ length: 22 }, (_, index) => {
          const direction = index % 2 === 0 ? -1 : 1;
          const spread = direction * (95 + (index * 43) % 235);
          const colors = product.slug === "chilly"
            ? ["#925220", "#d39a36", "#493421", "#b76722"]
            : ["#a82d10", "#da681c", "#542918", "#d7a13c"];
          return (
            <g key={index} transform={`translate(${490 + (index * 31) % 115}, ${seam - 65})`}>
              <g className="pickle-masala" style={{
                "--scatter-x": `${spread}px`,
                "--scatter-mid": `${spread * 0.5}px`,
                "--scatter-rise": `${-90 - (index * 19) % 130}px`,
                "--scatter-fall": `${100 + (index * 23) % 160}px`,
                "--scatter-delay": `${420 + (index * 37) % 260}ms`,
                "--scatter-duration": `${900 + (index * 47) % 450}ms`,
                "--scatter-turn": `${direction * (100 + index * 17)}deg`,
              } as CSSProperties}>
                {index % 3 === 0
                  ? <path d="M-9 -5 L3 -9 L11 1 L2 8 L-7 5 Z" fill={colors[index % colors.length]} />
                  : <ellipse rx={4 + index % 5} ry={3 + index % 4} fill={colors[index % colors.length]} />}
                <circle cx="-2" cy="-2" r="1.5" fill="#ffe4a0" opacity=".65" />
              </g>
            </g>
          );
        })}
      </g>
      <g className="pickle-lid"><g clipPath={`url(#${id}-lid)`}>{photo}</g></g>
    </svg>
  );
}
