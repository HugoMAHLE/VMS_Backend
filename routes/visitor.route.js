import { Router } from "express";
import { VisitorController } from "../controlers/visitor.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router()

router.post('/create', VisitorController.createVisitor)
router.post('/addcompany', VisitorController.addCompany)
router.post('/createvisit', VisitorController.createVisit)

router.get('/all', VisitorController.getVisitors)
router.get('/getcompanies', VisitorController.getCompanies)

export default router;
