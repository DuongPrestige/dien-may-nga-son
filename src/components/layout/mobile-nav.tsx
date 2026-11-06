"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

import type { NavigationItem } from "@/src/components/layout/navigation";

type MobileNavProps = {
  items: readonly NavigationItem[];
};

export function MobileNav({ items }: MobileNavProps) {
  const pathname = usePathname();
  // The menu is open only for the path it was opened on, so navigating
  // anywhere closes it without an effect.
  const [openedOnPath, setOpenedOnPath] = useState<string | null>(null);
  const isOpen = openedOnPath === pathname;
  const panelId = useId();

  function close() {
    setOpenedOnPath(null);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenedOnPath(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpenedOnPath(isOpen ? null : pathname)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={isOpen ? "Đóng menu" : "Mở menu"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#E5E7EB] text-[#111827] transition-colors hover:bg-[#F8FAFC]"
      >
        {isOpen ? (
          <X aria-hidden="true" className="h-5 w-5" />
        ) : (
          <Menu aria-hidden="true" className="h-5 w-5" />
        )}
      </button>

      {isOpen ? (
        <nav
          id={panelId}
          aria-label="Điều hướng di động"
          className="absolute inset-x-0 top-full border-b border-[#E5E7EB] bg-white shadow-[0_12px_24px_rgba(17,24,39,0.08)]"
        >
          <ul className="mx-auto max-w-7xl px-4 py-2">
            {items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={close}
                    className={`flex min-h-12 items-center border-b border-[#F1F5F9] text-base font-semibold last:border-b-0 ${
                      isActive ? "text-[#0369A1]" : "text-[#111827]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
