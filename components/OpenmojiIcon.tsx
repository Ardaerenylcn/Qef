interface Props {
  emoji: string;
  size?: number;
  className?: string;
}

function emojiToUnicode(emoji: string): string {
  return [...emoji]
    .map((c) => c.codePointAt(0)!.toString(16).toUpperCase())
    .filter((c) => c !== "FE0F") // variation selector kaldır
    .join("-");
}

export default function OpenmojiIcon({ emoji, size = 18, className }: Props) {
  const unicode = emojiToUnicode(emoji);
  return (
    <img
      src={`/api/openmoji/${unicode}`}
      width={size}
      height={size}
      alt={emoji}
      className={className}
      style={{ display: "inline-block", flexShrink: 0, width: size, height: size, minWidth: size, minHeight: size }}
    />
  );
}
