"use client";

import { usePathname } from "next/navigation";
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from "react-icons/fa";
import Link from "next/link";

export function Footer() {
  const pathname = usePathname();

  if (pathname === "/chat") {
    return null;
  }

  const repoFlowSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "How it Works", href: "#how-it-works" },
        { name: "Pricing", href: "#pricing" },
        { name: "Roadmap", href: "#roadmap" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#docs" },
        { name: "API Reference", href: "#api" },
        { name: "Guides", href: "#guides" },
        { name: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#about" },
        { name: "Blog", href: "#blog" },
        { name: "Contact", href: "#contact" },
        { name: "Careers", href: "#careers" },
      ],
    },
  ];

  const repoFlowSocialLinks = [
    { icon: <FaGithub className="w-5 h-5" />, href: "#", label: "GitHub" },
    { icon: <FaTwitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <FaLinkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
    { icon: <FaDiscord className="w-5 h-5" />, href: "#", label: "Discord" },
  ];

  const repoFlowLegalLinks = [
    { name: "Terms of Service", href: "#terms" },
    { name: "Privacy Policy", href: "#privacy" },
  ];

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">RF</span>
                </div>
                <h2 className="text-xl font-semibold">RepoFlow</h2>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              AI-powered task-based agent for understanding repositories, reviewing pull requests, planning changes, and executing them safely.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              {repoFlowSocialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className="hover:text-primary transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            {repoFlowSections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="font-semibold mb-3 text-sm">{section.title}</h3>
                <ul className="space-y-2.5">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} RepoFlow. All rights reserved.
          </p>
          <div className="flex gap-6">
            {repoFlowLegalLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
