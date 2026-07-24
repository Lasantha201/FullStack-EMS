import {router} from "express";
import { changePassword, login, session } from "../controllers/authControlle.js";




const authRouter = Router();

authRouter.post("/login", login)
authRouter.get("/session", session)
authRouter.post("/change-password", changePassword)

export default authRouter;