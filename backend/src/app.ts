import express from "express"
import { protocolRouter } from "./protocol/router"
import { ensureSchema } from "./storage/db"
import { connectRedis } from "./storage/redis"

export const app = express()

app.use(express.json())
app.use("/api", protocolRouter)

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: "internal_error" })
})

export async function initServices() {
  await ensureSchema()
  await connectRedis()
}
