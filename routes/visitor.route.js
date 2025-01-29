import { Router } from "express";
import { VisitorController } from "../controlers/visitor.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router()

router.post('/create', VisitorController.createVisitor)
router.post('/addcompany', VisitorController.addCompany)
router.post('/createvisit', VisitorController.createVisit)
router.post('/update-status', VisitorController.updateStatus)

router.get('/all', VisitorController.getVisitors)
router.get('/get-visitors', VisitorController.getVisitorsWithVisitID)
router.get('/getcompanies', VisitorController.getCompanies)
router.get('/company-by-id', VisitorController.getCompanyByID)

export default router;
