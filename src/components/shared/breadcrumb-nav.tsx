import { ChevronRight } from "lucide-react";
import Link from "next/link";

export type BreadcrumbNavItem = {
  name: string;
  href: string;
};

type BreadcrumbNavProps = {
  items: BreadcrumbNavItem[];
  className?: string;
};

/** Visual breadcrumb; the last item is rendered as the current page. */
export function BreadcrumbNav({ items, className = "" }: BreadcrumbNavProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs font-medium text-[#6B7280] sm:text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href} className="flex min-w-0 items-center gap-1">
              {isLast ? (
                <span aria-current="page" className="truncate text-[#111827]">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="hover:text-[#075985]">
                    {item.name}
                  </Link>
                  <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
