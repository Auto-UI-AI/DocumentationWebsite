import { Paths } from "@/lib/pageroutes"

export const Documents: Paths[] = [
  {
    heading: "Getting Started",
    title: "What is AUTOUI?",
    href: "/introduction",
  },
  {
    title: "Getting Started with AutoUI",
    href: "/getting-started",
  },
  {
    title: "Quick Start",
    href: "/quickstart",
    items: [
      {
        title: "React",
        href: "/react",
      },
      {
        title: "Next.js",
        href: "/nextjs",
      },
      {
        title: "Integrate AUTOUI Chat",
        href: "/chat-integration",
      },
    ],
  },
  {
    title: "Complete Developer Guide",
    href: "/developer-guide",
  },
  {
    title: "Quick Installation & Configuration",
    href: "/installation",
  },
  {
    title: "Backend Proxy Installation & Configuration",
    href: "/backend-proxy",
  },
  {
    title: "Config Explanation",
    href: "/config",
  },
]

