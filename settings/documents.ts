import { Paths } from "@/lib/pageroutes"

export const Documents: Paths[] = [
  {
    heading: "Getting Started",
    title: "What is AUTOUI?",
    href: "/introduction",
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
    ],
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

