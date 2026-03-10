import { ethers } from "ethers"
import { ENV } from "../config/env"

export const providers={

 base:new ethers.JsonRpcProvider(ENV.baseRpc),

 monad:new ethers.JsonRpcProvider(ENV.monadRpc)

}