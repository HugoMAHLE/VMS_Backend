import { Router } from "express";
import { VisitController } from "../controlers/visit.controller.js";

const router = Router()

router.post('/send-code', VisitController.sendCode)

router.get('/get-visit-info', VisitController.getVisit)
router.get('/recep-visits', VisitController.getRecepVisit)
router.get('/rec-guests', VisitController.getVisitGuests)

export default router;