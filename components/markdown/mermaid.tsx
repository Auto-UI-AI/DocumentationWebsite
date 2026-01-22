"use client"

import React, { useEffect, useId, useMemo, useRef } from "react"
import clsx from "clsx"

interface MermaidProps {
  chart: string
  className?: string
}

let mermaidInitialized = false

const Mermaid = ({ chart, className }: MermaidProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const reactId = useId()

  const renderId = useMemo(() => {
    // React IDs may include ":" which is fine for attributes, but we sanitize to keep Mermaid happy.
    const safe = reactId.replace(/[^a-zA-Z0-9_-]/g, "")
    return `dmermaid-${safe}`
  }, [reactId])

  const memoizedClassName = useMemo(
    // Avoid Mermaid's global `.mermaid` auto-scan behavior and render explicitly via mermaid.render(...)
    () => clsx("autoui-mermaid", className),
    [className]
  )

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!ref.current) return

      // Render a stable placeholder first (prevents hydration mismatches).
      ref.current.textContent = ""

      try {
        const { default: mermaid } = await import("mermaid")

        if (!mermaidInitialized) {
          mermaid.initialize({
            theme: "neutral",
            startOnLoad: false,
          })
          mermaidInitialized = true
        }

        const { svg, bindFunctions } = await mermaid.render(renderId, chart)

        if (cancelled || !ref.current) return

        ref.current.innerHTML = svg
        bindFunctions?.(ref.current)
      } catch (error) {
        if (!cancelled) {
          console.error("Mermaid diagram render error:", error)
        }
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [chart, renderId])

  return <div className={memoizedClassName} ref={ref} />
}

const MermaidMemo = React.memo(Mermaid)
export default MermaidMemo






