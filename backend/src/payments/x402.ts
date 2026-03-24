import { config } from "../config"
import { db } from "../storage/db"
import { thirdwebBridgeRequest } from "../tools/thirdweb"

export type X402Payment = {
  id: string
  link: string
  amount: string
  chainId: number
  tokenAddress: string
}

export async function createX402Payment(): Promise<X402Payment> {
  const amountWei = toUsdcBaseUnits(config.x402Amount)
  const payload = {
    name: "Kai Agent write access",
    description: `Payment required for write operations (${config.x402Amount} USDC).`,
    token: {
      address: config.x402TokenAddress,
      chainId: config.x402ChainId,
      amount: amountWei
    },
    recipient: config.x402Recipient,
    purchaseData: {
      reason: "thirdweb_write_access",
      projectId: config.thirdwebProjectId || undefined
    }
  }

  const result = await thirdwebBridgeRequest({
    path: "/v1/bridge/payments",
    method: "POST",
    body: payload
  })

  const payment = {
    id: result?.result?.id || result?.id,
    link: result?.result?.link || result?.link,
    amount: config.x402Amount,
    chainId: config.x402ChainId,
    tokenAddress: config.x402TokenAddress
  }

  if (payment.id && payment.link) {
    await db.query(
      "insert into x402_payments (id, link, amount, chain_id, token_address) values ($1, $2, $3, $4, $5) on conflict (id) do nothing",
      [
        payment.id,
        payment.link,
        payment.amount,
        payment.chainId,
        payment.tokenAddress
      ]
    )
  }

  return payment
}

export async function verifyX402Payment(paymentId: string) {
  const result = await db.query(
    "select id, used_at from x402_payments where id = $1",
    [paymentId]
  )
  if (result.rows.length === 0) {
    return false
  }
  if (!result.rows[0].used_at) {
    await db.query(
      "update x402_payments set used_at = now() where id = $1",
      [paymentId]
    )
  }
  return true
}

function toUsdcBaseUnits(amount: string) {
  const [whole, fraction = ""] = amount.split(".")
  const padded = `${fraction}000000`.slice(0, 6)
  const numeric = `${whole}${padded}`.replace(/^0+/, "") || "0"
  return numeric
}
