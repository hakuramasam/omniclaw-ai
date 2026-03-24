export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"

export async function getHealth() {
  const res = await fetch(`${API_BASE_URL}/api/health`)
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`)
  }
  return res.json() as Promise<{ status: string }>
}

export async function getAgents() {
  const res = await fetch(`${API_BASE_URL}/api/agents`)
  if (!res.ok) {
    throw new Error(`Agents fetch failed: ${res.status}`)
  }
  return res.json() as Promise<
    { id: string; name: string; status: string; created_at: string }[]
  >
}

export async function getSkills() {
  const res = await fetch(`${API_BASE_URL}/api/skills`)
  if (!res.ok) {
    throw new Error(`Skills fetch failed: ${res.status}`)
  }
  return res.json() as Promise<
    { id: string; name: string; source: string; version: string | null }[]
  >
}

export async function installSkill(input: {
  name: string
  source: string
  version?: string
}) {
  const res = await fetch(`${API_BASE_URL}/api/skills/install`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  })
  if (!res.ok) {
    throw new Error(`Skill install failed: ${res.status}`)
  }
  return res.json()
}

export async function getInbox(recipient: string) {
  const res = await fetch(
    `${API_BASE_URL}/api/a2a/inbox?recipient=${encodeURIComponent(recipient)}`
  )
  if (!res.ok) {
    throw new Error(`Inbox fetch failed: ${res.status}`)
  }
  return res.json() as Promise<
    {
      id: string
      sender: string
      recipient: string
      message_type: string
      payload: unknown
      created_at: string
    }[]
  >
}

export async function getOutbox(sender: string) {
  const res = await fetch(
    `${API_BASE_URL}/api/a2a/outbox?sender=${encodeURIComponent(sender)}`
  )
  if (!res.ok) {
    throw new Error(`Outbox fetch failed: ${res.status}`)
  }
  return res.json() as Promise<
    {
      id: string
      sender: string
      recipient: string
      message_type: string
      payload: unknown
      created_at: string
    }[]
  >
}

export async function sendMessage(input: {
  sender: string
  recipient: string
  messageType: string
  payload: unknown
}) {
  const res = await fetch(`${API_BASE_URL}/api/a2a/outbox`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  })
  if (!res.ok) {
    throw new Error(`Message send failed: ${res.status}`)
  }
  return res.json()
}

export async function getThirdwebStatus() {
  const res = await fetch(`${API_BASE_URL}/api/tools/thirdweb/status`)
  if (!res.ok) {
    throw new Error(`Thirdweb status failed: ${res.status}`)
  }
  return res.json() as Promise<{
    clientIdPresent: boolean
    secretKeyPresent: boolean
    baseUrl: string
  }>
}
