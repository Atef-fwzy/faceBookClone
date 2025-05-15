const router = require("express").Router();
const {createNewPost,getAllposts,getSinglePost,getPostsCount,deleteSinglePost,updatePost,toggleLikes} = require("../controllers/posts_controller")
const verify_token = require("../middlewares/verify_token")
const upload =require("../middlewares/uploadPhotos");

//? /api/posts
router.route("/")
.post(verify_token,upload.single("image"),createNewPost)//  post => /api/posts
.get(getAllposts)  //!  localhost:8080/api/posts?limit=2&page=1&category=style  ||  localhost:8080/api/posts?limit=2&page=1 || localhost:8080/api/posts
router.get("/count",getPostsCount);//  get => /api/posts/count
router.route("/:id")//  ... => /api/posts/id
       .get(getSinglePost)
       .delete(verify_token,deleteSinglePost)
       .put(verify_token,upload.single("image"),updatePost)
router.route("/likes/:id")
         .put(verify_token,toggleLikes);


module.exports = router