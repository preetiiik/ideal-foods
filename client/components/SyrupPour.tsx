import { useId } from "react";
import type { Product } from "@/data/products";

export default function SyrupPour({ product }: { product: Product }) {
  const id = useId().replace(/:/g, "");
  const photo = <image href={product.cardImage ?? product.image} x="50" y="10" width="200" height="300" />;

  return (
    <svg className="syrup-pour relative z-10 h-full w-full overflow-visible" viewBox="0 0 300 336"
      role="img" aria-label={`Ideal ${product.name} Syrup`}>
      <defs>
        <clipPath id={`${id}-bottle`}>
          <path d="M132 38 L168 38 L169 56 Q171 84 185 131 Q192 145 192 155 L192 289 Q192 308 150 308 Q108 308 108 289 L108 155 Q108 145 115 131 Q129 84 131 56 Z" />
        </clipPath>
        <clipPath id={`${id}-cap`}><rect x="131" y="10" width="38" height="29" rx="5" /></clipPath>
        <clipPath id={`${id}-glass`}><path d="M175 221 L247 221 L239 303 Q211 311 183 303 Z" /></clipPath>
        <linearGradient id={`${id}-shine`}>
          <stop stopColor="white" stopOpacity=".6" />
          <stop offset=".4" stopColor="white" stopOpacity=".08" />
          <stop offset="1" stopColor="white" stopOpacity=".45" />
        </linearGradient>
      </defs>
      <g className="syrup-glass" aria-hidden="true">
        <ellipse cx="211" cy="312" rx="42" ry="5" fill="#2e1f14" opacity=".12" />
        <path d="M174 219 L182 304 Q211 315 240 304 L248 219 Z" fill={`url(#${id}-shine)`} />
        <g clipPath={`url(#${id}-glass)`}>
          <g className="syrup-fill">
            <rect x="174" y="242" width="74" height="68" fill={product.bg} fillOpacity=".85" />
            <ellipse cx="211" cy="242" rx="37" ry="5" fill={product.panel} />
          </g>
        </g>
        <path d="M174 219 L182 304 Q211 315 240 304 L248 219" fill="none" stroke="#8caca8" strokeWidth="2" />
        <ellipse cx="211" cy="219" rx="37" ry="6" fill="none" stroke="#8caca8" strokeWidth="2" />
        <path d="M181 232 L187 291" stroke="white" strokeWidth="3" strokeLinecap="round" opacity=".8" />
      </g>
      <path className="syrup-stream" d="M211 141 Q215 165 211 190 L211 246" pathLength="1"
        fill="none" stroke={product.bg} strokeWidth="5" strokeLinecap="round" aria-hidden="true" />
      <g className="syrup-bottle">
        <g clipPath={`url(#${id}-bottle)`}>{photo}</g>
        <g className="syrup-cap"><g clipPath={`url(#${id}-cap)`}>{photo}</g></g>
      </g>
    </svg>
  );
}
