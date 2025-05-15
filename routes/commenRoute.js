const router = require("express").Router();
const { craeteNewComment,updateComment,gettAllcommetPost, deleteComment,getAllcomments} =require("../controllers/commens_controller")
const verify_token = require("../middlewares/verify_token")
const token_admin_owner_comm = require("../middlewares/token_owner_admin_comme")
const TokenIsAdmin = require("../middlewares/token_Isadmin")

router.route("/")
    .post(verify_token,craeteNewComment) // get api/comments
    .get(TokenIsAdmin,getAllcomments) // get api/comments
router.route("/:id")
     .delete(verify_token,token_admin_owner_comm,deleteComment)// get api/comments/ id this comment
   .put(verify_token,token_admin_owner_comm,updateComment)// get api/comments/ id this comment
router.route("/postComment/:id")
               .get(gettAllcommetPost)
module.exports = router;
