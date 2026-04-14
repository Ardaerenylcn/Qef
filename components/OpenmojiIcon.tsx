interface Props {
  emoji: string;
  size?: number;
  className?: string;
}

export default function OpenmojiIcon({ emoji, size = 18, className }: Props) {
  return (
    <span
      className={className}
      style={{ fontSize: size, lineHeight: 1, display: "inline-block", flexShrink: 0 }}
      aria-hidden="true"
    >
      {emoji}
    </span>
  );
}
