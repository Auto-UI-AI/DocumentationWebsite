"use client"
import { Link } from "lib/transition"

import { PageRoutes } from "@/lib/pageroutes"
import { buttonVariants } from "@/components/ui/button"
// import { ModalChat } from "@autoai-ui/autoui"
import { AutoUIConfig } from "@autoai-ui/autoui"
import dynamic from "next/dynamic";

const ModalChat = dynamic(
  () => import("@autoai-ui/autoui").then(m => m.ModalChat),
  { ssr: false }   // <- very important
);
export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
const aiModel = process.env.NEXT_PUBLIC_AIMODEL_NAME || 'openai/gpt-5-chat';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const autouiConfig: AutoUIConfig = {
  /* =========================
   *   METADATA
   * ========================= */
  metadata: {
    appName: 'AutoUI Demo',
    appVersion: '0.1.0',
    author: 'AutoUI Dev Team',
    createdAt: new Date().toISOString(),
    description: 'Config derived from DemoStorybook: registers demo e-commerce components and mock functions.',
    tags: ['demo', 'ecommerce', 'react', 'autoui'],
  },

  /* =========================
   *   LLM
   * ========================= */
  llm: {
    provider: 'openrouter',
    baseUrl: baseUrl,
    apiKey,
    model: aiModel,
    temperature: 0.2,
    appDescriptionPrompt: 'A demo e-commerce app with product listing, cart, checkout and wishlists.',
    maxTokens: 2048,
    requestHeaders: {
      'HTTP-Referer': 'https://autoui.dev',
      'X-Title': 'AutoUI Demo',
    },
  },

  /* =========================
   *   RUNTIME
   * ========================= */
  runtime: {
    validateLLMOutput: true,
    storeChatToLocalStorage: true,
    localStorageKey: 'autoui_demo_chat',
    enableDebugLogs: true,
    maxSteps: 20,
    errorHandling: { showToUser: true, retryOnFail: false },
  },
  functions: {
    fetchProducts: {
      prompt: 'Fetch a list of products filtered optionally by color, category, or query text.',
      params: {
        color: 'string (optional) — color filter',
        category: 'string (optional) — product category',
        q: 'string (optional) — search query',
      },
      callFunc: ()=>null,
      returns: 'Product[] — array of products with id, name, description, price, image, color, category',
    },
  },
  components: {
    CartSummary: {
      prompt: 'Shows cart items with quantities and total; triggers checkout when requested.',
      defaults: {
        items: [
          { id: '1', name: 'Beige Coat', price: 89.99, quantity: 2 },
          { id: '2', name: 'Denim Jacket', price: 69.99, quantity: 1 },
        ],
      },
      callComponent: () => <div>Cart Summary Component</div>,
      category: 'checkout',
    },
  }
};

  return (
    <section className="flex min-h-[86.5vh] flex-col items-center justify-center px-2 py-8 text-center">
      <h1 className="mb-4 text-4xl font-bold sm:text-7xl">Documents</h1>
      <p className="text-foreground mb-8 max-w-[600px] sm:text-base">
        A simple open-source product documentation platform. That&apos;s simple
        to use and easy to customize.
      </p>

      <div className="flex items-center gap-5">
        <Link
          href={`/docs${PageRoutes[0].href}`}
          className={buttonVariants({ className: "px-6", size: "lg" })}
        >
          Get Started
        </Link>
      </div>
      <div>
         <ModalChat config={autouiConfig}/>
      </div>
     
    </section>
  )
}
