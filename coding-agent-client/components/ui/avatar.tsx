import * as React from "react"
import { cn } from "@/lib/utils/index"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string
    alt?: string
    fallback?: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, src, alt, fallback, ...props }, ref) => {
        const [imgError, setImgError] = React.useState(false)

        const getInitials = (name?: string) => {
            if (!name) return "U"
            const parts = name.trim().split(" ")
            if (parts.length >= 2) {
                return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            }
            return name.substring(0, 2).toUpperCase()
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
                    className
                )}
                {...props}
            >
                {src && !imgError ? (
                    <img
                        src={src}
                        alt={alt || "Avatar"}
                        className="aspect-square h-full w-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium text-sm">
                        {getInitials(fallback)}
                    </div>
                )}
            </div>
        )
    }
)

Avatar.displayName = "Avatar"

export { Avatar }
