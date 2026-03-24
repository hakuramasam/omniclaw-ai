import Link from "next/link"

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/agent-console", label: "Agent Console" },
  { href: "/skill-marketplace", label: "Skill Marketplace" },
  { href: "/ai-chat", label: "AI Chat" }
]

export default function Nav() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 24px",
        borderBottom: "1px solid rgba(28, 26, 22, 0.08)",
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 10
      }}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          background: "linear-gradient(135deg, #2f6b4f, #d28b36)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 600
        }}>
          OC
        </div>
        <strong>OmniClaw v5</strong>
      </div>
      <div style={{ display: "flex", gap: 18, fontSize: 14, color: "#3f3a30" }}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
