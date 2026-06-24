// Bit, the Orbits mascot. Renders the real brand asset (default: waving Bit).
export function BitAvatar({
  size = 48,
  src = "/bit-waving.svg",
}: {
  size?: number;
  src?: string;
}) {
  return (
    <img
      src={src}
      alt="Bit"
      aria-label="Bit"
      width={size}
      height={size}
      className="shrink-0 select-none object-contain"
      style={{ width: size, height: size }}
    />
  );
}
