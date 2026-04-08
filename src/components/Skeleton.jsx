export default function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = 10,
  className = "",
}) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
      aria-hidden="true"
    />
  );
}
