type BlooSize = "sm" | "md" | "lg" | "xl";

const SIZES: Record<BlooSize, number> = { sm: 40, md: 72, lg: 120, xl: 180 };

/**
 * Bloo — la mascotte de l'application, une goutte de sang affectueuse.
 * Illustration unique et statique, déclinée uniquement en taille.
 */
export default function Bloo({
  size = "md",
  className = "",
  title = "Bloo, la goutte de sang",
}: {
  size?: BlooSize;
  className?: string;
  title?: string;
}) {
  const px = SIZES[size];
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 200 200"
      role="img"
      aria-label={title}
      className={className}
    >
      <defs>
        <radialGradient id="bloodyBody" cx="38%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#ff8fa6" />
          <stop offset="52%" stopColor="#ee4f74" />
          <stop offset="100%" stopColor="#b41f49" />
        </radialGradient>
      </defs>

      {/* ombre portée douce */}
      <ellipse cx="100" cy="182" rx="46" ry="9" fill="#b41f49" opacity="0.16" />

      {/* corps en goutte : pointe en haut, ventre rond en bas */}
      <path
        d="M100 16c20 34 58 62 58 100a58 58 0 1 1-116 0c0-38 38-66 58-100z"
        fill="url(#bloodyBody)"
      />

      {/* reflet */}
      <ellipse cx="74" cy="92" rx="15" ry="22" fill="#fff" opacity="0.34" transform="rotate(-18 74 92)" />

      {/* bras accueillants */}
      <path d="M44 128c-13 4-21 13-23 24" stroke="#d92f5c" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M156 128c13 4 21 13 23 24" stroke="#d92f5c" strokeWidth="9" strokeLinecap="round" fill="none" />

      {/* joues */}
      <ellipse cx="68" cy="140" rx="12" ry="8" fill="#ff9db1" opacity="0.85" />
      <ellipse cx="132" cy="140" rx="12" ry="8" fill="#ff9db1" opacity="0.85" />

      {/* yeux souriants */}
      <path d="M76 124c4-6 12-6 16 0" stroke="#4a1226" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M108 124c4-6 12-6 16 0" stroke="#4a1226" strokeWidth="7" strokeLinecap="round" fill="none" />

      {/* sourire */}
      <path d="M86 148c5 7 23 7 28 0" stroke="#4a1226" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  );
}
