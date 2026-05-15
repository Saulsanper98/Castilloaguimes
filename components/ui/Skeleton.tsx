import { cn } from "@/lib/utils"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, ...rest }: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden bg-white/5 rounded-md before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
        className
      )}
      {...rest}
    />
  )
}
