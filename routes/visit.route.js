import { Router } from "express";
import { VisitController } from "../controlers/visit.controller.js";

const router = Router()

router.get('/get-visit-info', VisitController.getVisit)

export default router;