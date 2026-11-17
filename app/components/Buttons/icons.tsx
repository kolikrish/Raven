
type IconProps = { className?: string; "data-arrow"?: boolean };

export const ArrowUpRight = ({ className = "", "data-arrow": dataArrow }: IconProps) => (
  <svg
    className={className}
    data-arrow={dataArrow}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M7 17 17 7M8.5 7H17v8.5" />
  </svg>
);

export const ArrowRight = ({ className = "" }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

export const Check = ({ className = "" }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

// LinkedIn's "in" on its own, filled, without the rounded square around it. strokeWidth is
// accepted (and ignored) so it can stand in a list beside lucide's line icons.
export const LinkedinIn = ({ className = "" }: { className?: string; strokeWidth?: number }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <circle cx="4.6" cy="4.6" r="2.6" />
    <rect x="2.4" y="8.6" width="4.4" height="13" rx="0.3" />
    <path d="M9.4 8.6h4.2v1.9c.8-1.4 2.5-2.4 4.5-2.4 3.6 0 5.1 2.2 5.1 6.1v7.4h-4.4v-6.6c0-1.8-.6-3-2.3-3-1.7 0-2.7 1.2-2.7 3.1v6.5H9.4z" />
  </svg>
);
