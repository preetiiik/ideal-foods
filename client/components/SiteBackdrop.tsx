/**
 * Static brand backdrop: one plain beige colour pinned behind the whole page
 * (it does not scroll) while the content sections flow above it.
 */
export default function SiteBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0" style={{ zIndex: 0 }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#F3E7D3",
          backgroundImage: "url('/ideal-bg.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundBlendMode: "soft-light",
        }}
      />
    </div>
  );
}
