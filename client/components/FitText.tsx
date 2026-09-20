import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Renders a single line of text scaled to ALWAYS fit its container width —
 * long words shrink, short words never exceed maxScale. Eliminates the
 * giant ghost words clipping past the viewport edges.
 */
export default function FitText({
  children,
  maxScale = 1,
  className,
  style,
  align = "center",
}: {
  children: ReactNode;
  /** Upper bound for the scale factor (1 = never grow beyond natural size) */
  maxScale?: number;
  className?: string;
  style?: CSSProperties;
  /** "left" anchors the scaled line to the left edge — required when the
      natural width overflows the container, since browsers left-align
      overflowing inline-blocks (a center transform origin would push the
      shrunk line off to the right). */
  align?: "center" | "left";
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const [fit, setFit] = useState(1);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const measure = () => {
      /* Natural (unscaled) width of the word */
      const prev = inner.style.transform;
      inner.style.transform = "none";
      const natural = inner.scrollWidth;
      inner.style.transform = prev;
      if (natural > 0) {
        const available = wrap.clientWidth;
        setFit(Math.min(maxScale, available / natural));
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    /* Re-measure once web fonts finish loading */
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [children, maxScale]);

  return (
    <span ref={wrapRef} className={className} style={{ display: "block", width: "100%", textAlign: align, ...style }}>
      <span
        ref={innerRef}
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          transform: `scale(${fit})`,
          transformOrigin: align === "left" ? "left top" : "center top",
          willChange: "transform",
        }}
      >
        {children}
      </span>
    </span>
  );
}
