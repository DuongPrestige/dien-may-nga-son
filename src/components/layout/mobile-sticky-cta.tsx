import {
  FileText,
  MessageCircle,
  MessagesSquare,
  Phone,
  type LucideIcon,
} from "lucide-react";

import { ANALYTICS_EVENTS } from "@/src/features/analytics/lib/analytics-events";
import { getStoreContactLinks } from "@/src/features/settings/services/settings.service";

type CtaItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  isPrimary: boolean;
  analyticsEvent?: string;
};

export async function MobileStickyCTA() {
  const contactLinks = await getStoreContactLinks();
  const items: CtaItem[] = [
    {
      href: contactLinks.phoneHref,
      label: "Gọi ngay",
      icon: Phone,
      isPrimary: true,
    },
    {
      href: contactLinks.zaloHref,
      label: "Zalo",
      icon: MessageCircle,
      isPrimary: false,
    },
    {
      href: contactLinks.facebookHref,
      label: "Messenger",
      icon: MessagesSquare,
      isPrimary: false,
    },
    {
      href: "/contact#bao-gia",
      label: "Báo giá",
      icon: FileText,
      isPrimary: false,
      analyticsEvent: ANALYTICS_EVENTS.quoteClick,
    },
  ];

  return (
    <nav
      aria-label="Liên hệ nhanh"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E5E7EB] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(17,24,39,0.08)] md:hidden"
    >
      <div className="grid h-16 grid-cols-4">
        {items.map(({ href, label, icon: Icon, isPrimary, analyticsEvent }) => (
          <a
            key={label}
            href={href}
            data-analytics-event={analyticsEvent}
            className={`flex flex-col items-center justify-center gap-1 px-1 text-center text-xs font-bold transition-colors ${
              isPrimary
                ? "bg-[#C2410C] text-white hover:bg-[#9A3412]"
                : "border-l border-[#E5E7EB] text-[#111827] hover:bg-[#F8FAFC]"
            }`}
          >
            <Icon
              aria-hidden="true"
              className={`h-5 w-5 ${isPrimary ? "" : "text-[#0369A1]"}`}
            />
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
