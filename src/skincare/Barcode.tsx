type Props = {
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
};

/** Decorative barcode — clickable for scan interaction. */
export default function Barcode({ className = "", onClick, interactive }: Props) {
  const bars = [
    2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 1, 1, 2, 1, 3, 2, 1, 1, 2,
    3, 1, 1, 2, 1, 1, 3, 2, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1,
  ];

  return (
    <button
      type="button"
      className={`sil-barcode ${interactive ? "is-interactive" : ""} ${className}`}
      onClick={onClick}
      disabled={!interactive}
      aria-label={interactive ? "Scan product" : undefined}
      tabIndex={interactive ? 0 : -1}
    >
      <span className="sil-barcode-bars" aria-hidden>
        {bars.map((w, i) => (
          <span key={i} style={{ width: w }} />
        ))}
      </span>
      <span className="sil-barcode-digits">4 8 0 2 1 9 3 7 5 6 0 1</span>
    </button>
  );
}
