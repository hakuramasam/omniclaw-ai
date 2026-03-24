import { config } from "../config"

export type ChatMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

export async function chatWithOpenRouter(messages: ChatMessage[]) {
  if (!config.openRouterApiKey) {
    throw new Error("OPENROUTER_API_KEY is not set")
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.openRouterApiKey}`
    },
    body: JSON.stringify({
      model: config.openRouterModel,
      messages
    })
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`OpenRouter error: ${response.status} ${text}`)
  }

  return response.json()
}
