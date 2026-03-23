const { Router } = require("express");
const { VisitorController } = require("../controlers/visitor.controller.js");
const { verifyToken } = require("../middlewares/jwt.middleware.js");

const router = Router()

router.post('/create', VisitorController.createVisitor)
router.post('/addcompany', VisitorController.addCompany)
router.post('/createvisit', VisitorController.createVisit)

router.get('/all', VisitorController.getVisitors)
router.get('/get-visitor-by-email', VisitorController.getVisitorByEmail)
router.get('/get-visitors', VisitorController.getVisitorsWithVisitID)
router.get('/get-countries', VisitorController.getCountries)
router.get('/getcompanies', VisitorController.getCompanies)
router.get('/company-by-id', VisitorController.getCompanyByID)
router.get('/get-country', VisitorController.getCitizenshipByVisitorID)
router.get('/get-status', VisitorController.getVisitorStatus)
router.get('/get-migration', VisitorController.getVisitorMigration)

router.put('/update-migration', VisitorController.updateVisitorMigration)
router.put('/update-status', VisitorController.updateVisitorStatus)
router.put('/update-print', VisitorController.updateLabelPrintStatus)

module.exports = router;