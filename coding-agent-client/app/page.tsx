import { HeroSection } from "@/components/blocks/hero-section";
import { FeatureSteps } from "@/components/ui/feature-section";
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";
import FAQs from "@/components/ui/text-reveal-faqs";
import { CTA } from "@/components/ui/call-to-action";
import { PricingSection } from "@/components/sections/PricingSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { Icons } from "@/components/ui/icons";

const workflowFeatures = [
  {
    step: 'Step 1',
    title: 'Paste a Repository',
    content: 'Start by pasting a GitHub repository URL. The system reads and understands the codebase without making any changes.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'
  },
  {
    step: 'Step 2',
    title: 'Choose What You Want to Do',
    content: 'Select an action like reviewing a pull request, fixing an issue, or planning a change, or describe your task in your own words.',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop'
  },
  {
    step: 'Step 3',
    title: 'Review the Plan and Execute',
    content: 'The system generates a clear step-by-step plan. You review it, approve it, and only then execution happens safely in a sandbox.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'
  },
];

export default function Home() {
  return (
    <>
      <HeroSection
        badge={{
          text: "New: Integrated Sandbox Environment",
          action: {
            text: "Learn more",
            href: "#features",
          },
        }}
        title="Build and Fix Code Faster with AI"
        description="Your intelligent coding companion. Paste a repository URL and let our agent review code, fix bugs, and implement new features automatically."
        actions={[
          {
            text: "Start Coding",
            href: "/chat",
            variant: "default",
          },
          {
            text: "GitHub",
            href: "https://github.com",
            variant: "outline",
            icon: <Icons.gitHub className="h-5 w-5" />,
          },
        ]}
      />
      <FeatureSteps
        features={workflowFeatures}
        title="How It Works"
        autoPlayInterval={4000}
      />
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">
            Why Choose Our Platform
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Everything you need for safe, transparent, and developer-friendly automation
          </p>
          <FeaturesSectionWithHoverEffects />
        </div>
      </section>
      <PricingSection />
      <TestimonialsSection />
      <FAQs />
      <CTA />
    </>
  );
}
