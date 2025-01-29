import { Router } from "express";
import { UserController } from "../controlers/user.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router()

router.post('/Register', UserController.register)
router.post('/login', UserController.login)

router.get('/profile', verifyToken, UserController.getProfile)
router.get('/getemail', UserController.getEmail)
router.get('/getuid', UserController.getUID)
router.get('/get-host-name', UserController.getHostName)
router.get('/get-host-visits', UserController.getHostVisits)


// router.get('/admin-only', verifyUserType("admin"), (req, res) => {
//   res.send("Welcome Admin");
// });

export default router;
