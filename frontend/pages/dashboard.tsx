import { useEffect, useState } from "react"
import { getAgents, getHealth, getThirdwebStatus } from "../lib/api"

export default function Dashboard() {
  const [status, setStatus] = useState("checking")
  const [agents, setAgents] = useState<string[]>([])
  const [thirdweb, setThirdweb] = useState("unknown")

  useEffect(() => {
    let active = true
    getHealth()
      .then((data) => {
        if (active) {
          setStatus(data.status)
        }
      })
      .catch(() => {
        if (active) {
          setStatus("offline")
        }
      })

    getAgents()
      .then((data) => {
        if (active) {
          setAgents(data.map((agent) => `${agent.name} (${agent.status})`))
        }
      })
      .catch(() => {
        if (active) {
          setAgents(["unavailable"])
        }
      })

    getThirdwebStatus()
      .then((data) => {
        if (active) {
          setThirdweb(
            data.secretKeyPresent
              ? `ready (${data.baseUrl})`
              : "missing secret"
          )
        }
      })
      .catch(() => {
        if (active) {
          setThirdweb("error")
        }
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="card">
      <h1>Dashboard</h1>
      <p>Backend health:</p>
      <p className="mono">{status}</p>
      <p>Agents:</p>
      <p className="mono">{agents.join(", ")}</p>
      <p>Thirdweb tools:</p>
      <p className="mono">{thirdweb}</p>
    </div>
  )
}
