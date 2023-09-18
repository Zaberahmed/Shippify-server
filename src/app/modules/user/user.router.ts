import express from "express";
import { getUserByToken, loginUser, registerByGoogle, registerRequest, registerUser, updateUserByToken } from "./user.controllet";
import { authentication, googleAuthentication } from "../../middlewares/authentication.middleware";
const router = express.Router();

router.post('/login', loginUser)
router.post('/register-google-user', googleAuthentication, registerByGoogle);
router.post('/registration-request', registerRequest)
router.post('/registration-confirm', registerUser)
router.get('/data', authentication, getUserByToken)
router.patch('/update', authentication, updateUserByToken);

export default router;