import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function CTA() {
    return (
        <div className="w-full py-20 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col text-center border border-border rounded-lg p-8 lg:p-16 gap-8 items-center">
                    <div>
                        <Badge>Get started</Badge>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
                            Ready to transform your workflow?
                        </h3>
                        <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl">
                            Stop context-switching between tools and struggling with complex codebases.
                            RepoFlow helps you understand, plan, and execute changes safely with AI-powered
                            assistance and an approval-first approach.
                        </p>
                    </div>
                    <div className="flex flex-row gap-4">
                        <Button className="gap-4" variant="outline">
                            Schedule a demo <PhoneCall className="w-4 h-4" />
                        </Button>
                        <Button className="gap-4">
                            Get started free <MoveRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { CTA };
