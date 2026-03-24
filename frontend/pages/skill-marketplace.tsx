import { useEffect, useState } from "react"
import { getSkills, installSkill } from "../lib/api"

export default function SkillMarketplace() {
  const [name, setName] = useState("superfluid")
  const [source, setSource] = useState("superfluid-org/skills")
  const [version, setVersion] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [status, setStatus] = useState<string | null>(null)

  const refresh = () => {
    getSkills()
      .then((data) => {
        setSkills(
          data.map(
            (skill) => `${skill.name} (${skill.version || "latest"})`
          )
        )
      })
      .catch(() => setSkills(["unavailable"]))
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleInstall = async () => {
    setStatus(null)
    try {
      await installSkill({ name, source, version: version || undefined })
      setStatus("recorded")
      refresh()
    } catch (error) {
      setStatus(`error: ${String(error)}`)
    }
  }

  return (
    <div className="card">
      <h1>Skill Marketplace</h1>
      <p className="mono">Register skills used by Kai Agent.</p>
      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label>
          Skill Name
          <input
            style={{ width: "100%", padding: 8, marginTop: 6 }}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          Source
          <input
            style={{ width: "100%", padding: 8, marginTop: 6 }}
            value={source}
            onChange={(event) => setSource(event.target.value)}
          />
        </label>
        <label>
          Version (optional)
          <input
            style={{ width: "100%", padding: 8, marginTop: 6 }}
            value={version}
            onChange={(event) => setVersion(event.target.value)}
          />
        </label>
        <button
          style={{ padding: "10px 16px", borderRadius: 8, cursor: "pointer" }}
          onClick={handleInstall}
        >
          Record Install
        </button>
        {status && <p className="mono">{status}</p>}
      </div>
      <div style={{ marginTop: 24 }}>
        <h2>Installed Skills</h2>
        <p className="mono">{skills.join(" | ") || "empty"}</p>
      </div>
    </div>
  )
}
