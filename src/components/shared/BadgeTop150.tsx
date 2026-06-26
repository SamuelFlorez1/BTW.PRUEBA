import { Star } from "lucide-react";

export default function BadgeTop150({ top150 }: { top150: boolean | null | undefined }) {
  if (!top150) return null;
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-[#FFF7ED] px-1.5 py-0.5 text-[11px] font-medium text-[#F26522]">
      <Star className="h-3 w-3 fill-current" />
      Top150
    </span>
  );
}
