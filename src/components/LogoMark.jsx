export default function LogoMark({ className = "w-8 h-8", title = "MyShop logo" }) {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#0D6EFD" />
        </linearGradient>
      </defs>
      <rect x="3" y="5" width="42" height="38" rx="10" fill="white" />
      <rect x="3" y="5" width="42" height="38" rx="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2" />
      {/* Bag body */}
      <rect x="10" y="14" width="28" height="22" rx="6" fill="url(#logoGradient)" />
      <rect x="10" y="14" width="28" height="22" rx="6" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />

      {/* Bag handle */}
      <path
        d="M16 17.5c0-4.5 4.5-8 8-8s8 3.5 8 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M26 20l-4 6h4l-2 6l6-8h-4l2-4z"
        fill="white"
        opacity="0.95"
      />
    </svg>
  );
}


