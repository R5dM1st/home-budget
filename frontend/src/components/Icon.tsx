import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "home"
  | "transactions"
  | "analytics"
  | "budget"
  | "accounts"
  | "recurring"
  | "goals"
  | "settings"
  | "plus"
  | "chevron-left"
  | "chevron-right"
  | "search"
  | "edit"
  | "trash"
  | "archive"
  | "sun"
  | "moon"
  | "monitor"
  | "sparkles"
  | "arrow-up"
  | "arrow-down"
  | "transfer"
  | "wallet"
  | "calendar"
  | "target"
  | "x";

type IconProps = SVGProps<SVGSVGElement> & { name: IconName };

const paths: Record<IconName, ReactNode> = {
  home: <><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/></>,
  transactions: <><path d="M7 7h11"/><path d="m15 4 3 3-3 3"/><path d="M17 17H6"/><path d="m9 14-3 3 3 3"/></>,
  analytics: <><path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-7"/><path d="M22 19H2"/></>,
  budget: <><rect x="3" y="6" width="18" height="14" rx="3"/><path d="M7 6V4h10v2"/><path d="M16 13h3"/></>,
  accounts: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 9h10"/><path d="M7 13h4"/></>,
  recurring: <><path d="M20 7h-6V1"/><path d="m20 7-4-4"/><path d="M4 17h6v6"/><path d="m4 17 4 4"/><path d="M5.5 9A7 7 0 0 1 18 5"/><path d="M18.5 15A7 7 0 0 1 6 19"/></>,
  goals: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.05.05-2.83 2.83-.05-.05a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1.1 1.64V21H9.83v-.07a1.8 1.8 0 0 0-1.1-1.64 1.8 1.8 0 0 0-2 .36l-.05.05-2.83-2.83.05-.05a1.8 1.8 0 0 0 .36-2A1.8 1.8 0 0 0 2.62 13.7H2.5V9.7h.12a1.8 1.8 0 0 0 1.64-1.1 1.8 1.8 0 0 0-.36-2l-.05-.05 2.83-2.83.05.05a1.8 1.8 0 0 0 2 .36A1.8 1.8 0 0 0 9.83 2.5h4.01v.12a1.8 1.8 0 0 0 1.1 1.64 1.8 1.8 0 0 0 2-.36l.05-.05 2.83 2.83-.05.05a1.8 1.8 0 0 0-.36 2 1.8 1.8 0 0 0 1.64 1.1h.12v4.01h-.12A1.8 1.8 0 0 0 19.4 15Z"/></>,
  plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  "chevron-left": <path d="m15 18-6-6 6-6"/>,
  "chevron-right": <path d="m9 18 6-6-6-6"/>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
  trash: <><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="m7 7 1 13h8l1-13"/></>,
  archive: <><path d="M3 6h18v4H3z"/><path d="M5 10v10h14V10"/><path d="M9 14h6"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
  moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>,
  monitor: <><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></>,
  sparkles: <><path d="m12 3 1.2 3.3L16.5 7.5l-3.3 1.2L12 12l-1.2-3.3-3.3-1.2 3.3-1.2Z"/><path d="m18 13 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8Z"/></>,
  "arrow-up": <><path d="m6 15 6-6 6 6"/></>,
  "arrow-down": <><path d="m6 9 6 6 6-6"/></>,
  transfer: <><path d="M5 7h14l-3-3"/><path d="m19 7-3 3"/><path d="M19 17H5l3 3"/><path d="m5 17 3-3"/></>,
  wallet: <><path d="M4 6h14a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"/><path d="M16 12h6v4h-6a2 2 0 0 1 0-4Z"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  target: <><circle cx="12" cy="12" r="8"/><path d="m14 10 5-5"/><path d="M17 5h2v2"/></>,
  x: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
};

export default function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
