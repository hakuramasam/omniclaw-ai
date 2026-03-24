export const config = {
  port: Number(process.env.PORT || 3001),
  openRouterApiKey: process.env.OPENROUTER_API_KEY || "",
  openRouterModel:
    process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct",
  thirdwebClientId: process.env.THIRDWEB_CLIENT_ID || "",
  thirdwebSecretKey: process.env.THIRDWEB_SECRET_KEY || "",
  thirdwebProjectId: process.env.THIRDWEB_PROJECT_ID || "",
  x402ChainId: Number(process.env.X402_USDC_CHAIN_ID || 8453),
  x402TokenAddress:
    process.env.X402_USDC_TOKEN_ADDRESS ||
    "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  x402Amount: process.env.X402_USDC_AMOUNT || "0.1",
  x402Recipient:
    process.env.X402_USDC_RECIPIENT ||
    "0xE4D622B2787D71fCb4Eb948710505f6be45A2808",
  a2aPublicBaseUrl: process.env.A2A_PUBLIC_BASE_URL || "http://localhost:3001",
  databaseUrl:
    process.env.DATABASE_URL || "postgres://kai:kai@localhost:5432/kai_agent",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379"
}
