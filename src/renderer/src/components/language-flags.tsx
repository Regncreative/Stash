/** Compact SVG flags — emoji flags don't render reliably on Windows. */

function starPoints(cx: number, cy: number, rOuter: number, rInner: number): string {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const ang = (Math.PI / 2) * -1 + (i * Math.PI) / 5
    const r = i % 2 === 0 ? rOuter : rInner
    pts.push(`${cx + Math.cos(ang) * r},${cy + Math.sin(ang) * r}`)
  }
  return pts.join(' ')
}

export function FlagTr({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="14"
      viewBox="0 0 20 14"
      aria-hidden
    >
      <rect width="20" height="14" rx="2" fill="#E30A17" />
      <circle cx="7.5" cy="7" r="3.45" fill="#fff" />
      <circle cx="8.45" cy="7" r="2.7" fill="#E30A17" />
      <polygon fill="#fff" points={starPoints(13.1, 7, 1.55, 0.65)} />
    </svg>
  )
}

export function FlagEn({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="14"
      viewBox="0 0 20 14"
      aria-hidden
    >
      <defs>
        <clipPath id="flag-en-clip">
          <rect width="20" height="14" rx="2" />
        </clipPath>
      </defs>
      <g clipPath="url(#flag-en-clip)">
        <rect width="20" height="14" fill="#012169" />
        <path d="M0 0l20 14M20 0L0 14" stroke="#fff" strokeWidth="2.6" />
        <path d="M0 0l20 14M20 0L0 14" stroke="#C8102E" strokeWidth="1.3" />
        <path d="M10 0v14M0 7h20" stroke="#fff" strokeWidth="4.2" />
        <path d="M10 0v14M0 7h20" stroke="#C8102E" strokeWidth="2.3" />
      </g>
    </svg>
  )
}
