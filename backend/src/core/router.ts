export function chooseChain(goal:string){

 const g=goal.toLowerCase()

 if(g.includes("cheap")) return "monad"

 return "base"

}