import { Router } from "express"
import { addTask } from "../../core/taskQueue"

const router = Router()

router.post("/", async (req,res)=>{

 const {goal}=req.body

 const result=await addTask(goal)

 res.json(result)

})

export default router