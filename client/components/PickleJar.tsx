import { useId, type CSSProperties } from "react";
import type { Product } from "@/data/products";

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
      </defs>
      <g clipPath={`url(#${id}-body)`}>{photo}</g>
      <g clipPath={`url(#${id}-lid)`}>{photo}</g>
    </svg>
  );
}
