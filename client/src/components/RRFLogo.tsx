import { Sprout } from "lucide-react";

interface RRFLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function RRFLogo({ className = "", showText = true, size = "md" }: RRFLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl"
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Sprout className={`${sizeClasses[size]} text-green-600`} />
        <div className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-400 rounded-full" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-green-700 dark:text-green-500 leading-tight ${textSizeClasses[size]}`}>
            RRF Learning
          </span>
          <span className="text-xs text-green-600 dark:text-green-400 leading-none">
            Sustainable Future
          </span>
        </div>
      )}
    </div>
  );
}