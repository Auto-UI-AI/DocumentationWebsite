"use client"

import { AutoUIConfig } from "@autoai-ui/autoui"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { PageRoutes } from "@/lib/pageroutes"
import React from "react"

// Helper function to get all available pages
function getAllPages() {
  return PageRoutes.map(route => ({
    title: route.title,
    href: `/docs${route.href}`,
    path: route.href
  }))
}

// Helper function to search pages by keyword
function searchPages(query: string) {
  const pages = getAllPages()
  const lowerQuery = query.toLowerCase()
  return pages.filter(page => 
    page.title.toLowerCase().includes(lowerQuery) ||
    page.path.toLowerCase().includes(lowerQuery)
  )
}

// Helper function to find page by topic
function findPageByTopic(topic: string) {
  const topicMap: Record<string, string> = {
    'what is autoui': '/docs/introduction',
    'introduction': '/docs/introduction',
    'quickstart': '/docs/quickstart',
    'quick start': '/docs/quickstart',
    'getting started': '/docs/quickstart',
    'react quickstart': '/docs/quickstart/react',
    'nextjs quickstart': '/docs/quickstart/nextjs',
    'next.js quickstart': '/docs/quickstart/nextjs',
    'installation': '/docs/installation',
    'setup': '/docs/installation',
    'proxy': '/docs/backend-proxy',
    'backend proxy': '/docs/backend-proxy',
    'backend': '/docs/backend-proxy',
    'config': '/docs/config',
    'configuration': '/docs/config',
    'autouiconfig': '/docs/config',
    'config explanation': '/docs/config',
  }
  
  const lowerTopic = topic.toLowerCase()
  const matchedPath = topicMap[lowerTopic]
  
  if (matchedPath) {
    const page = getAllPages().find(p => p.href === matchedPath)
    return page ? [page] : []
  }
  
  return searchPages(topic)
}

// Create config factory that uses router
export function createAutoUIConfig(router: AppRouterInstance): AutoUIConfig {
  const sharedSecret = process.env.NEXT_PUBLIC_AUTOUI_SHARED_SECRET
  const aiModel = process.env.NEXT_PUBLIC_AIMODEL_NAME || 'openai/gpt-4o'
  const proxyUrl = process.env.NEXT_PUBLIC_PROXY_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  return {
    appId: 'autoui-documentation',
    
    metadata: {
      appName: 'AUTOUI Documentation',
      appVersion: '1.0.0',
      author: 'AUTOUI Team',
      createdAt: new Date().toISOString(),
      description: 'Interactive documentation for AUTOUI - a config-driven React library that integrates AI-powered chat assistants into applications. This documentation site helps users learn about ModalChat, AutoUIConfig, functions, components, styling, and more.',
      tags: ['documentation', 'autoui', 'react', 'ai', 'llm', 'modalchat'],
    },

    llm: {
      provider: 'openrouter',
      proxyUrl: proxyUrl,
      sharedSecret: sharedSecret,
      model: aiModel,
      temperature: 0.3,
      appDescriptionPrompt: 'AUTOUI Documentation Assistant - helps users navigate the documentation, find information about AUTOUI library features, understand how to use ModalChat, configure AutoUIConfig, register functions and components, and learn about styling and advanced features.',
      maxTokens: 2048,
      requestHeaders: {
        'HTTP-Referer': baseUrl || 'https://autoui.dev',
        'X-Title': 'AUTOUI Documentation',
      },
    },

    runtime: {
      validateLLMOutput: true,
      storeChatToLocalStorage: true,
      localStorageKey: 'autoui_docs_chat',
      enableDebugLogs: false,
      maxSteps: 25,
      errorHandling: { 
        showToUser: true, 
        retryOnFail: false 
      },
    },

    functions: {
      navigateToPage: {
        prompt: 'Navigate the user to a specific documentation page. Use this when the user asks to go to a page, view documentation about a topic, or wants to see specific information.',
        params: {
          path: 'string (required) - The documentation path (e.g., "/docs/introduction", "/docs/installation")',
        },
        callFunc: ({ path }: { path: string }) => {
          try {
            router.push(path)
            return { success: true, message: `Navigated to ${path}` }
          } catch (error) {
            return { success: false, error: String(error) }
          }
        },
        returns: 'Object with success boolean and message or error',
        canShareDataWithLLM: true,
      },

      findPage: {
        prompt: 'Find documentation pages by searching for keywords or topics. Use this when the user asks "where can I find X" or "show me documentation about Y".',
        params: {
          query: 'string (required) - Search query or topic name',
        },
        callFunc: ({ query }: { query: string }) => {
          const results = findPageByTopic(query)
          return {
            results,
            count: results.length,
            query,
          }
        },
        returns: 'Object with results array, count, and query',
        canShareDataWithLLM: true,
      },

      listAllPages: {
        prompt: 'Get a list of all available documentation pages. Use this when the user asks what pages are available, wants to see the documentation structure, or needs an overview of all topics.',
        params: {},
        callFunc: () => {
          return {
            pages: getAllPages(),
            count: getAllPages().length,
          }
        },
        returns: 'Object with pages array and count',
        canShareDataWithLLM: true,
      },

      searchDocumentation: {
        prompt: 'Search through documentation pages by keyword. Returns matching pages that contain the search term in their title or path.',
        params: {
          keyword: 'string (required) - Keyword to search for',
        },
        callFunc: ({ keyword }: { keyword: string }) => {
          const results = searchPages(keyword)
          return {
            matches: results,
            count: results.length,
            keyword,
          }
        },
        returns: 'Object with matches array, count, and keyword',
        canShareDataWithLLM: true,
      },

      getPageInfo: {
        prompt: 'Get information about a specific documentation page including its title and path. Use this to provide details about a page before navigating.',
        params: {
          path: 'string (required) - The documentation path',
        },
        callFunc: ({ path }: { path: string }) => {
          const page = getAllPages().find(p => p.href === path || p.path === path)
          return page || { error: 'Page not found' }
        },
        returns: 'Page object with title, href, and path, or error object',
        canShareDataWithLLM: true,
      },
    },

    components: {
      FeatureShowcase: {
        prompt: 'Display a beautiful feature showcase card highlighting AUTOUI features like ModalChat, Config-Driven UI, Functions, Components, etc. Use this to help users understand what AUTOUI offers.',
        props: {
          title: 'string (optional) - Title of the feature showcase',
          features: 'Array<{name: string, description: string}> (optional) - Array of features to display',
        },
        defaults: {
          title: 'AUTOUI Features',
          features: [
            { name: 'ModalChat', description: 'Ready-to-use chat interface component' },
            { name: 'Config-Driven', description: 'Declarative configuration system' },
            { name: 'Functions', description: 'Register custom functions for AI to call' },
            { name: 'Components', description: 'Generative UI with React components' },
          ],
        },
        callComponent: ({ title, features }: { title?: string; features?: Array<{ name: string; description: string }> }) => (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-xl font-bold">{title || 'AUTOUI Features'}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {(features || []).map((feature, idx) => (
                <div key={idx} className="rounded-md border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400">{feature.name}</h4>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        ),
        category: 'information',
      },

      QuickStartGuide: {
        prompt: 'Show a quick start guide component with steps to get started with AUTOUI. Use this when users ask how to get started or want a quick overview.',
        props: {
          steps: 'Array<{number: number, title: string, description: string}> (optional) - Array of steps to display',
        },
        defaults: {
          steps: [
            { number: 1, title: 'Install AUTOUI', description: 'npm install @autoai-ui/autoui' },
            { number: 2, title: 'Set up Proxy', description: 'Configure backend proxy server' },
            { number: 3, title: 'Create Config', description: 'Define your AutoUIConfig' },
            { number: 4, title: 'Add ModalChat', description: 'Render <ModalChat config={config} />' },
          ],
        },
        callComponent: ({ steps }: { steps?: Array<{ number: number; title: string; description: string }> }) => (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950">
            <h3 className="mb-4 text-xl font-bold text-blue-900 dark:text-blue-100">Quick Start Guide</h3>
            <div className="space-y-4">
              {(steps || []).map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">{step.title}</h4>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
        category: 'guide',
      },

      NavigationHelper: {
        prompt: 'Display a helpful navigation component showing relevant documentation pages. Use this when users ask about navigation or want to see related pages. Pages are clickable and will navigate when clicked.',
        props: {
          title: 'string (optional) - Title of the navigation helper',
          pages: 'Array<{title: string, href: string}> (optional) - Array of pages to display',
        },
        defaults: {
          title: 'Documentation Navigation',
          pages: [],
        },
        callComponent: ({ title, pages }: { title?: string; pages?: Array<{ title: string; href: string }> }) => (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-bold">{title || 'Documentation Navigation'}</h3>
            {pages && pages.length > 0 ? (
              <div className="space-y-2">
                {pages.map((page, idx) => (
                  <a
                    key={idx}
                    href={page.href}
                    className="block w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-left transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <span className="font-medium">{page.title}</span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{page.href}</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">No pages to display</p>
            )}
          </div>
        ),
        category: 'navigation',
      },

      LibraryOverview: {
        prompt: 'Show a comprehensive overview card explaining what AUTOUI is, its key concepts, and how it works. Use this to help users understand the library.',
        props: {
          title: 'string (optional) - Title of the overview',
        },
        defaults: {
          title: 'What is AUTOUI?',
        },
        callComponent: ({ title }: { title?: string }) => (
          <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-6 dark:border-purple-800 dark:from-purple-950 dark:to-blue-950">
            <h3 className="mb-4 text-2xl font-bold text-purple-900 dark:text-purple-100">{title || 'What is AUTOUI?'}</h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-purple-800 dark:text-purple-200">Config-Driven AI Assistant</h4>
                <p className="mt-1 text-purple-700 dark:text-purple-300">
                  AUTOUI is a React library that lets you add an AI-powered chat assistant to your app by simply providing a configuration object.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-800 dark:text-purple-200">Key Features</h4>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-purple-700 dark:text-purple-300">
                  <li>ModalChat component - ready-to-use chat interface</li>
                  <li>Functions - register JavaScript functions for AI to call</li>
                  <li>Components - enable generative UI with React components</li>
                  <li>Config-driven - declarative configuration, no hardcoded flows</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-800 dark:text-purple-200">How It Works</h4>
                <p className="mt-1 text-purple-700 dark:text-purple-300">
                  You define your app's capabilities in an AutoUIConfig. The AI reads this config and generates plans (structured JSON) that execute functions and render components based on user requests.
                </p>
              </div>
            </div>
          </div>
        ),
        category: 'information',
      },

      TopicCard: {
        prompt: 'Display a card with information about a specific documentation topic. Use this to highlight key concepts or sections. The link button will navigate to the specified page.',
        props: {
          topic: 'string (optional) - Topic title',
          description: 'string (optional) - Topic description',
          link: 'string (optional) - Link to navigate to',
        },
        defaults: {
          topic: 'AUTOUI',
          description: 'Learn about AUTOUI features',
          link: '/docs/introduction',
        },
        callComponent: ({ topic, description, link }: { topic?: string; description?: string; link?: string }) => (
          <div className="rounded-lg border border-green-200 bg-green-50 p-5 shadow-sm transition-shadow hover:shadow-md dark:border-green-800 dark:bg-green-950">
            <h4 className="mb-2 text-lg font-bold text-green-900 dark:text-green-100">{topic || 'Topic'}</h4>
            <p className="mb-4 text-sm text-green-800 dark:text-green-200">{description || 'Description'}</p>
            {link && (
              <a
                href={link}
                className="inline-block rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
              >
                Learn More →
              </a>
            )}
          </div>
        ),
        category: 'information',
      },

      CodeExample: {
        prompt: 'Display a code example in a nicely formatted code block. Use this to show code snippets, configuration examples, or usage patterns.',
        props: {
          language: 'string (optional) - Programming language for syntax highlighting',
          code: 'string (optional) - Code content to display',
          title: 'string (optional) - Title of the code example',
        },
        defaults: {
          language: 'tsx',
          code: '// Code example',
          title: 'Example',
        },
        callComponent: ({ language, code, title }: { language?: string; code?: string; title?: string }) => (
          <div className="rounded-lg border border-gray-200 bg-gray-900 p-4 dark:border-gray-700">
            {title && (
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">{title}</span>
                <span className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-400">{language || 'code'}</span>
              </div>
            )}
            <pre className="overflow-x-auto">
              <code className="text-sm text-gray-100">{code || '// No code provided'}</code>
            </pre>
          </div>
        ),
        category: 'code',
      },

      TipsCard: {
        prompt: 'Display helpful tips or best practices in an attractive card format. Use this to provide useful advice, tips, or recommendations to users.',
        props: {
          title: 'string (optional) - Title of the tips card',
          tips: 'string[] (optional) - Array of tip strings to display',
        },
        defaults: {
          title: 'Pro Tips',
          tips: ['Tip 1', 'Tip 2'],
        },
        callComponent: ({ title, tips }: { title?: string; tips?: string[] }) => (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-amber-900 dark:text-amber-100">
              <span>💡</span>
              {title || 'Pro Tips'}
            </h3>
            <ul className="space-y-2">
              {(tips || []).map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200">
                  <span className="mt-1 text-amber-600 dark:text-amber-400">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ),
        category: 'information',
      },
    },
  }
}

