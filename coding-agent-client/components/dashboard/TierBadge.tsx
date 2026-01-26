import { SubscriptionTier } from "@/lib/types/subscription";
import { Badge } from "@/components/ui/badge";

interface TierBadgeProps {
    tier: SubscriptionTier;
    className?: string;
}

const tierConfig = {
    [SubscriptionTier.FREE]: {
        label: "Free Plan",
        variant: "secondary" as const,
    },
    [SubscriptionTier.PRO]: {
        label: "Pro Plan",
        variant: "default" as const,
    },
    [SubscriptionTier.TEAM]: {
        label: "Team Plan",
        variant: "default" as const,
    },
};

export function TierBadge({ tier, className }: TierBadgeProps) {
    const config = tierConfig[tier];

    return (
        <Badge variant={config.variant} className={className}>
            {config.label}
        </Badge>
    );
}
