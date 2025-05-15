const router = require("express").Router();
const {register,loginUser}= require("../controllers/authController")

//  /api/auth/register
router.post("/register",register)
//  /api/auth/login
router.post("/login",loginUser)


module.exports = router;