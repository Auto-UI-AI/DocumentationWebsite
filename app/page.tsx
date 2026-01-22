"use client"
import { Link } from "lib/transition"

import { PageRoutes } from "@/lib/pageroutes"
import Mermaid from "@/components/markdown/mermaid"
import { buttonVariants } from "@/components/ui/button"

export default function Home() {
  return (
    <div>
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-2 py-12 text-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          src="/screens/home-showcase.mp4"
          poster="/images/banner.png"
          aria-hidden="true"
        >
          Your browser does not support the video tag.
        </video>

        <div className="bg-background/80 pointer-events-none absolute inset-0" />

        <div className="relative z-10 flex flex-col items-center">
          <h1 className="mb-4 text-4xl font-bold sm:text-7xl">
            AUTOUI Documentation
          </h1>
          <p className="text-foreground mb-8 max-w-[720px] sm:text-base">
            AUTOUI is a config-driven React library for AI-powered chat
            assistants. Install from npm, register your app, drop in{" "}
            <code>{"<ModalChat />"}</code>, and let the assistant call your
            functions or render your components safely.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href={`/docs${PageRoutes[0].href}`}
              className={buttonVariants({ className: "px-6", size: "lg" })}
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-4 py-12">
        <h2 className="mb-3 text-2xl font-semibold">Under the hood</h2>
        <p className="text-muted-foreground mb-8 max-w-[820px] text-sm">
          AUTOUI sends user messages to your proxy, receives a structured plan,
          validates it (optional), then executes steps by calling your registered
          functions and rendering your registered components.
        </p>

        <div className="bg-card rounded-xl border p-4">
          <Mermaid
            chart={`flowchart LR
              user[User] --> modalChat[ModalChat]
              modalChat --> proxy[Proxy]
              proxy --> openRouter[OpenRouter_LLM]
              openRouter --> plan[Plan_JSON]
              plan --> runtime[AutoUI_Runtime]
              runtime --> funcs[Functions]
              runtime --> comps[Components]
              funcs --> ui[YourApp_UI]
              comps --> ui
            `}
          />
        </div>
      </section>
    </div>
  )
}
