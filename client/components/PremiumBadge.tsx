import { Crown } from "lucide-react";

export default function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D9B568] bg-[#302316] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#F8DEA0] shadow-sm">
      <Crown size={12} aria-hidden="true" /> Premium
    </span>
  );
}
