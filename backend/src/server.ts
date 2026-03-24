import dotenv from "dotenv"
import { app, initServices } from "./app"
import { config } from "./config"

dotenv.config()

async function start() {
  await initServices()

  app.listen(config.port, () => {
    console.log("OmniClaw backend running on port " + config.port)
  })
}

start().catch((error) => {
  console.error("Failed to start server", error)
  process.exit(1)
})
