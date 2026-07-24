import {router} from "express";
import { createEmployees, deleteEmployees, getEmployees, UpdateEmployees } from "../controllers/employeeController.js";

const employeesRouter = Router();

employeesRouter.get("/", getEmployees)
employeesRouter.post("/", createEmployees)
employeesRouter.put("/:id", UpdateEmployees)
employeesRouter.delete("/:id", deleteEmployees)