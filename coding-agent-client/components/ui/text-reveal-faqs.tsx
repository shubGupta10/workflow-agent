'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import { motion } from "framer-motion";


export default function FAQs() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'What is RepoFlow?',
            answer:
                'RepoFlow is a task-based AI agent that helps you understand repositories, review pull requests, plan changes, and safely execute them using an approval-first workflow.',
        },
        {
            id: 'item-2',
            question: 'Does RepoFlow change my code automatically?',
            answer:
                'No. RepoFlow never touches your code without explicit approval. You always review the plan before any execution happens.',
        },
        {
            id: 'item-3',
            question: 'How is this different from an IDE copilot?',
            answer:
                'RepoFlow works at the repository and task level. It plans, explains, and executes workflows asynchronously instead of suggesting code while you type.',
        },
        {
            id: 'item-4',
            question: 'Where does the code run?',
            answer:
                'All execution happens inside an isolated sandbox environment. Nothing runs on your local machine.',
        },
        {
            id: 'item-5',
            question: 'What if I leave a task halfway?',
            answer:
                'Every task keeps a full timeline. You can come back anytime and continue from where you left off.',
        },
    ];



    return (
        <section className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-5 md:gap-12">
                    <div className="md:col-span-2">
                        <h2 className="text-foreground text-4xl font-semibold">FAQs</h2>
                        <p className="text-muted-foreground mt-4 text-balance text-lg">
                            Everything you need to know about RepoFlow
                        </p>
                        <p className="text-muted-foreground mt-6 hidden md:block">
                            Can't find what you're looking for? Reach out to our{' '}
                            <Link
                                href="#"
                                className="text-primary font-medium hover:underline"
                            >
                                RepoFlow support team
                            </Link>{' '}
                            for assistance.
                        </p>
                    </div>

                    <div className="md:col-span-3">
                        <Accordion
                            type="single"
                            collapsible>
                            {faqItems.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="border-b border-gray-200 dark:border-gray-600">
                                    <AccordionTrigger className="cursor-pointer text-base font-medium hover:no-underline">{item.question}</AccordionTrigger>
                                    <AccordionContent>
                                        <BlurredStagger text={item.answer} />
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    <p className="text-muted-foreground mt-6 md:hidden">
                        Can't find what you're looking for? Contact our{' '}
                        <Link
                            href="#"
                            className="text-primary font-medium hover:underline">
                            RepoFlow support team
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}


export const BlurredStagger = ({
    text = "built by ruixen.com",
}: {
    text: string;
}) => {
    const headingText = text;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.015,
            },
        },
    };

    const letterAnimation = {
        hidden: {
            opacity: 0,
            filter: "blur(10px)",
        },
        show: {
            opacity: 1,
            filter: "blur(0px)",
        },
    };

    return (
        <>
            <div className="w-full">
                <motion.p
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="text-base leading-relaxed break-words whitespace-normal"
                >
                    {headingText.split("").map((char, index) => (
                        <motion.span
                            key={index}
                            variants={letterAnimation}
                            transition={{ duration: 0.3 }}
                            className="inline-block"
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </motion.p>
            </div>
        </>
    );
};
