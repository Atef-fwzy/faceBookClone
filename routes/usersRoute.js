const router = require("express").Router();
const {getAllUsers,GetSinglUser,UpdateUser,count,proFilePhotoUpload,deleteUserProfile,GetSinglUserByToken,userSearch}= require("../controllers/users_controller");
const verify_token = require("../middlewares/verify_token");
const upload = require("../middlewares/uploadPhotos")
const verify_token_curentUser = require("../middlewares/verify_token_curentUser");
const verify_token_curentUserOrAdmin = require("../middlewares/token_admin_himself");



//  /api/users/profile  => git
router.get("/profile",verify_token,getAllUsers)

router.get("/search",verify_token,userSearch)

router.route("/getuser/:id")
    .get(GetSinglUser) //  /api/users/getuser/:id => git 
    .put(verify_token_curentUser,UpdateUser) //  /api/users/getuser/:id => put
    .delete(verify_token_curentUserOrAdmin,deleteUserProfile) 
router.route("/getuser")
           .get(verify_token,GetSinglUserByToken)
    
router.get("/count",verify_token,count)  // api/users/count
router.post("/photo-uplaod",verify_token,upload.single("image"),proFilePhotoUpload)  // api/users/phot-uplaod

module.exports = router