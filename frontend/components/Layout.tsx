import { ReactNode } from "react"
import Nav from "./Nav"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Nav />
      <main className="main">{children}</main>
    </div>
  )
}
