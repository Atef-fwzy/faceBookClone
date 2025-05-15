const {user} =require("../model/users")
const {comment} =require("../model/comments")


const token_admin_owner_comm = async(req,res,next)=>{
const id = req.params.id;
const token = req.headers.authorization.split(" ")[1] ||req.headers.Authorization.split(" ")[1] ;

if(!id)
return  res.status(401).json({status:"filed",code:401,message:"id is required ?"})

const currentUser = await user.find({token})
const currentcomment = await comment.findById(id)

if(currentUser[0].isAdmin || currentUser[0]._id.toString() === currentcomment.construction.toString())
   return next();
 return  res.status(401).json({status:"filed",code:401,message:"not Allowed , only user himself or admins can delete or update  the comment"})
}

module.exports = token_admin_owner_comm