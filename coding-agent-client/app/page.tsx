import { Hero } from "@/components/ui/acme-hero";
import { FeatureSteps } from "@/components/ui/feature-section";

const workflowFeatures = [
  {
    step: 'Step 1',
    title: 'Review PRs',
    content: 'AI-powered code reviews analyze your pull requests automatically.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'
  },
  {
    step: 'Step 2',
    title: 'Fix Issues',
    content: 'Get intelligent suggestions and automated fixes for common issues.',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop'
  },
  {
    step: 'Step 3',
    title: 'Plan Changes',
    content: 'Collaborate with AI to plan and implement new features efficiently.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'
  },
];

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureSteps
        features={workflowFeatures}
        title="How It Works"
        autoPlayInterval={4000}
      />
    </>
  );
}
