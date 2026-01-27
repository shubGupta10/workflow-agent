"use client";

import { Pricing } from "@/components/blocks/pricing";

const pricingPlans = [
    {
        name: "FREE",
        price: "0",
        yearlyPrice: "0",
        period: "per month",
        features: [
            "5 tasks per day",
            "Basic code reviews",
            "Issue detection",
            "Community support",
            "Public repositories",
        ],
        description: "Perfect for individual developers and small projects",
        buttonText: "Get Started Free",
        href: "/chat",
        isPopular: false,
    },
    {
        name: "PRO",
        price: "5",
        yearlyPrice: "4",
        period: "per month",
        features: [
            "25 tasks per day",
            "Advanced code reviews",
            "Priority issue detection",
            "Email support",
            "Private repositories",
            "Custom integrations",
            "Advanced analytics",
        ],
        description: "Ideal for professional developers and growing teams",
        buttonText: "Upgrade to Pro",
        href: "/dashboard",
        isPopular: true,
    },
    {
        name: "TEAM",
        price: "12",
        yearlyPrice: "10",
        period: "per month",
        features: [
            "Unlimited tasks",
            "Everything in Pro",
            "Team collaboration",
            "Dedicated support",
            "Custom workflows",
            "SSO Authentication",
            "Advanced security",
            "SLA agreement",
        ],
        description: "For teams that need more power and collaboration",
        buttonText: "Contact Sales",
        href: "/dashboard",
        isPopular: false,
    },
];

export function PricingSection() {
    return (
        <section id="pricing" className="w-full bg-background py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Pricing
                    plans={pricingPlans}
                    title="Simple, Transparent Pricing"
                    description="Choose the plan that works for you. All plans include AI-powered code reviews, issue detection, and implementation planning."
                />
            </div>
        </section>
    );
}
