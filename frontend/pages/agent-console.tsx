import { useEffect, useState } from "react"
import { getInbox, getOutbox, sendMessage } from "../lib/api"

export default function AgentConsole() {
  const [recipient, setRecipient] = useState("kai")
  const [sender, setSender] = useState("kai")
  const [messageType, setMessageType] = useState("task")
  const [payload, setPayload] = useState("{\n  \"action\": \"ping\"\n}")
  const [inbox, setInbox] = useState<string[]>([])
  const [outbox, setOutbox] = useState<string[]>([])
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    Promise.all([getInbox(recipient), getOutbox(sender)])
      .then(([inboxItems, outboxItems]) => {
        if (!active) {
          return
        }
        setInbox(
          inboxItems.map(
            (item) =>
              `${item.sender} -> ${item.recipient} [${item.message_type}]`
          )
        )
        setOutbox(
          outboxItems.map(
            (item) =>
              `${item.sender} -> ${item.recipient} [${item.message_type}]`
          )
        )
      })
      .catch(() => {
        if (active) {
          setInbox(["unavailable"])
          setOutbox(["unavailable"])
        }
      })
    return () => {
      active = false
    }
  }, [recipient, sender])

  const handleSend = async () => {
    setStatus(null)
    try {
      const parsed = JSON.parse(payload)
      await sendMessage({ sender, recipient, messageType, payload: parsed })
      setStatus("sent")
    } catch (error) {
      setStatus(`error: ${String(error)}`)
    }
  }

  return (
    <div className="card">
      <h1>Agent Console</h1>
      <p className="mono">A2A public HTTP inbox/outbox</p>
      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label>
          Sender
          <input
            style={{ width: "100%", padding: 8, marginTop: 6 }}
            value={sender}
            onChange={(event) => setSender(event.target.value)}
          />
        </label>
        <label>
          Recipient
          <input
            style={{ width: "100%", padding: 8, marginTop: 6 }}
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
          />
        </label>
        <label>
          Message Type
          <input
            style={{ width: "100%", padding: 8, marginTop: 6 }}
            value={messageType}
            onChange={(event) => setMessageType(event.target.value)}
          />
        </label>
        <label>
          Payload (JSON)
          <textarea
            rows={6}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
            value={payload}
            onChange={(event) => setPayload(event.target.value)}
          />
        </label>
        <button
          style={{ padding: "10px 16px", borderRadius: 8, cursor: "pointer" }}
          onClick={handleSend}
        >
          Send Message
        </button>
        {status && <p className="mono">{status}</p>}
      </div>
      <div style={{ marginTop: 24 }}>
        <h2>Inbox</h2>
        <p className="mono">{inbox.join(" | ") || "empty"}</p>
        <h2>Outbox</h2>
        <p className="mono">{outbox.join(" | ") || "empty"}</p>
      </div>
    </div>
  )
}
