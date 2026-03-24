import { useState } from "react"
import { API_BASE_URL } from "../lib/api"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export default function AiChat() {
  const [chainIds, setChainIds] = useState("8453")
  const [from, setFrom] = useState("")
  const [prompt, setPrompt] = useState("Send 0.01 ETH to vitalik.eth")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [status, setStatus] = useState<string | null>(null)
  const [paymentLink, setPaymentLink] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<string | null>(null)

  const handleSend = async () => {
    setStatus("streaming")
    setPaymentLink(null)
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: prompt }
    ]
    setMessages(nextMessages)

    try {
      const response = await fetch(`${API_BASE_URL}/api/tools/thirdweb/ai/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(paymentId ? { "x402-payment-id": paymentId } : {})
        },
        body: JSON.stringify({
          messages: nextMessages,
          context: {
            chain_ids: chainIds
              .split(",")
              .map((value) => value.trim())
              .filter(Boolean)
              .map((value) => Number(value))
              .filter((value) => !Number.isNaN(value)),
            ...(from ? { from } : {})
          },
          stream: true
        })
      })

      if (response.status === 402) {
        const data = await response.json()
        setStatus("payment_required")
        setPaymentLink(data?.payment?.link || null)
        setPaymentId(data?.payment?.id || null)
        return
      }

      if (!response.body) {
        const text = await response.text()
        setMessages((prev) => [...prev, { role: "assistant", content: text }])
        setStatus("done")
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistant = ""

      // The Thirdweb AI stream sends SSE; accumulate raw chunks.
      while (true) {
        const { value, done } = await reader.read()
        if (done) {
          break
        }
        assistant += decoder.decode(value, { stream: true })
        setMessages((prev) => {
          const copy = [...prev]
          const last = copy[copy.length - 1]
          if (last && last.role === "assistant") {
            copy[copy.length - 1] = { role: "assistant", content: assistant }
            return copy
          }
          return [...copy, { role: "assistant", content: assistant }]
        })
      }

      setStatus("done")
    } catch (error) {
      setStatus(`error: ${String(error)}`)
    }
  }

  return (
    <div className="card">
      <h1>AI Chat</h1>
      <p className="mono">Thirdweb AI streaming demo.</p>
      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label>
          Chain IDs (comma-separated)
          <input
            style={{ width: "100%", padding: 8, marginTop: 6 }}
            value={chainIds}
            onChange={(event) => setChainIds(event.target.value)}
          />
        </label>
        <label>
          From (optional)
          <input
            style={{ width: "100%", padding: 8, marginTop: 6 }}
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          />
        </label>
        <label>
          Prompt
          <textarea
            rows={4}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
        </label>
        <button
          style={{ padding: "10px 16px", borderRadius: 8, cursor: "pointer" }}
          onClick={handleSend}
        >
          Send (Stream)
        </button>
        {status && <p className="mono">{status}</p>}
        {paymentLink && (
          <p className="mono">
            Pay to continue: {paymentLink}
          </p>
        )}
        {paymentId && (
          <p className="mono">
            Payment ID set for next request.
          </p>
        )}
      </div>
      <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className="card">
            <strong>{message.role.toUpperCase()}</strong>
            <p className="mono" style={{ whiteSpace: "pre-wrap" }}>
              {message.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
