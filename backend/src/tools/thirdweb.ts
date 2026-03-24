import { config } from "../config"

const THIRDWEB_BASE_URL = "https://api.thirdweb.com"

export type ThirdwebToolStatus = {
  clientIdPresent: boolean
  secretKeyPresent: boolean
  baseUrl: string
}

export type ThirdwebRequest = {
  path: string
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  query?: Record<string, string | number | boolean | Array<string | number | boolean>>
  body?: unknown
  headers?: Record<string, string>
}

export function getThirdwebStatus(): ThirdwebToolStatus {
  return {
    clientIdPresent: Boolean(config.thirdwebClientId),
    secretKeyPresent: Boolean(config.thirdwebSecretKey),
    baseUrl: THIRDWEB_BASE_URL
  }
}

function ensurePrefix(path: string, prefixes: string[]) {
  const normalized = path.startsWith("/") ? path : `/${path}`
  const ok = prefixes.some((prefix) => normalized.startsWith(prefix))
  if (!ok) {
    throw new Error(
      `Path must start with one of: ${prefixes.join(", ")}. Received: ${path}`
    )
  }
  return normalized
}

export async function thirdwebRequest({
  path,
  method = "GET",
  query,
  body,
  headers
}: ThirdwebRequest) {
  if (!config.thirdwebSecretKey) {
    throw new Error("THIRDWEB_SECRET_KEY is not set")
  }

  const url = new URL(path, THIRDWEB_BASE_URL)
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          url.searchParams.append(key, String(item))
        })
        return
      }
      url.searchParams.set(key, String(value))
    })
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-secret-key": config.thirdwebSecretKey,
      ...(config.thirdwebClientId ? { "x-client-id": config.thirdwebClientId } : {}),
      ...(config.thirdwebProjectId
        ? { "x-project-id": config.thirdwebProjectId }
        : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  })

  const contentType = response.headers.get("content-type") || ""
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    throw new Error(
      `thirdweb API error ${response.status}: ${JSON.stringify(data)}`
    )
  }

  return data
}

export async function thirdwebStreamRequest({
  path,
  method = "POST",
  query,
  body,
  headers
}: ThirdwebRequest) {
  if (!config.thirdwebSecretKey) {
    throw new Error("THIRDWEB_SECRET_KEY is not set")
  }

  const url = new URL(path, THIRDWEB_BASE_URL)
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          url.searchParams.append(key, String(item))
        })
        return
      }
      url.searchParams.set(key, String(value))
    })
  }

  return fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-secret-key": config.thirdwebSecretKey,
      ...(config.thirdwebClientId ? { "x-client-id": config.thirdwebClientId } : {}),
      ...(config.thirdwebProjectId
        ? { "x-project-id": config.thirdwebProjectId }
        : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  })
}

export async function thirdwebWalletsRequest(input: ThirdwebRequest) {
  const path = ensurePrefix(input.path, ["/v1/wallets"])
  return thirdwebRequest({ ...input, path })
}

export async function thirdwebGatewayRequest(input: ThirdwebRequest) {
  const path = ensurePrefix(input.path, ["/v1/contracts"])
  return thirdwebRequest({ ...input, path })
}

export async function thirdwebTokensRequest(input: ThirdwebRequest) {
  const path = ensurePrefix(input.path, ["/v1/tokens"])
  return thirdwebRequest({ ...input, path })
}

export async function thirdwebBridgeRequest(input: ThirdwebRequest) {
  const path = ensurePrefix(input.path, ["/v1/bridge"])
  return thirdwebRequest({ ...input, path })
}

export async function thirdwebAiRequest(input: ThirdwebRequest) {
  const path = ensurePrefix(input.path, ["/ai"])
  return thirdwebRequest({ ...input, path })
}

export async function initiateAuth(payload: unknown) {
  return thirdwebRequest({ path: "/v1/auth/initiate", method: "POST", body: payload })
}

export async function completeAuth(payload: unknown) {
  return thirdwebRequest({ path: "/v1/auth/complete", method: "POST", body: payload })
}
