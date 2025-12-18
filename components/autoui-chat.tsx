"use client"

import { ModalChat } from "@autoai-ui/autoui"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { createAutoUIConfig } from "@/lib/autoui-config"
import { useMemo } from "react"

// Dynamically import ModalChat with SSR disabled
const DynamicModalChat = dynamic(
  () => Promise.resolve(ModalChat),
  { ssr: false }
)

export function AutoUIChat() {
  const router = useRouter()
  
  // Create config with router instance
  const config = useMemo(() => createAutoUIConfig(router), [router])

  return (
    <DynamicModalChat 
      config={config}
    />
  )
}

