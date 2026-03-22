import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  count,
  size = "md",
  showCount = true,
  className,
}: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (rating >= i + 1) return "full";
    if (rating >= i + 0.5) return "half";
    return "empty";
  });

  const iconSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-sm",
  }[size];

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className={cn("flex items-center gap-0.5 text-amber-400", iconSize)}>
        {stars.map((type, i) =>
          type === "full" ? (
            <FaStar key={i} />
          ) : type === "half" ? (
            <FaStarHalfAlt key={i} />
          ) : (
            <FaRegStar key={i} />
          )
        )}
      </div>
      {showCount && count !== undefined && (
        <span className={cn("text-slate-500", textSize)}>({count})</span>
      )}
    </div>
  );
}
