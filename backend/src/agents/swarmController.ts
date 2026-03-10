import { plan } from "./plannerAgent"
import { execute } from "./executionAgent"

export async function runSwarm(goal:string){

 const planSteps=await plan(goal)

 const steps=planSteps.split("\n")

 const results=[]

 for(const step of steps){

  const result=await execute(step)

  results.push({step,result})

 }

 return results

}