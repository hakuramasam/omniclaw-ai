import { runSwarm } from "../agents/swarmController"

export async function addTask(goal:string){

 const result=await runSwarm(goal)

 return{
  goal,
  result
 }

}