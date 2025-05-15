const router = require("express").Router();
const Token_isAdmin = require("../middlewares/token_Isadmin")
const {deleteCategory,createCategory,getAllCategories} = require("../controllers/categoryController")
//  api/categories

router.route("/")
    .post(Token_isAdmin,createCategory)
    .get(getAllCategories)
router.route("/:id")
    .delete(Token_isAdmin,deleteCategory)

module.exports = router