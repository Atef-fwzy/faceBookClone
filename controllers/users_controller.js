
const {user} = require("../model/users");
const path =require("path")
const {post} = require("../model/post")
const hashingPass =require("../utils/hashingPassword")
const {comment}  = require("../model/comments")
const fs = require("fs")
const  {cloudinaryUploadImages,cloudinaryDeletetImages} = require("../utils/cloudinary")
const ValidateUpdateUser = require("../model/users")


const getAllUsers = async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1] || req.headers.Authorization.split(" ")[1];
    const finuserBuToken = await user.find({"token":token})
    if(finuserBuToken.length === 0)
        return  res.status(401).json({status:"filed",code:401,message:"Access denied: the token is invalid."})
    if(finuserBuToken[0].isAdmin){
        const ALlUsers = await  user.find({},{"__v":false}); 
        return  res.status(201).json({status:"succefuuly",code:201,data:{ALlUsers}})
    }
     return  res.status(401).json({status:"filed",code:401,message:"Access denied: You are not an admin."})
    
             
}

const GetSinglUser = async (req,res)=>{
    const id= req.params.id;
    const  userPost = await post.find({construction:id}).populate("user").populate("likes")
     let User;
       try{

          User  = await user.find({"_id":id},{"password":false,"__v":false})
           if(User.length === 0)
               return  res.status(404).json({status:"filed",code:401,message:"User Not found , pless try with valid Id."})
        }catch(err){
            return  res.status(404).json({status:"filed",code:401,message:"User Not found , pless try with valid Id ."})

        }

      res.status(200).json({status:200,"data":{User}, "posts":userPost})
}
const GetSinglUserByToken = async (req,res)=>{
 

    const token = req.headers.authorization.split(" ")[1] || req.headers.Authorization.split(" ")[1];
 
    const finuserBuToken = await user.find({"token":token})
    if(finuserBuToken.length === 0)
        return  res.status(401).json({status:"filed",code:401,message:"Access denied: the token is invalid."})
  const currentUser = await user.find({token:token},{"password":false,"__v":false})
     if(!currentUser)
        return  res.status(401).json({status:"filed",code:401,message:"Acount nor found ."})
      

    const  userPost = await post.find({construction:currentUser[0]._id})
   
     

      res.status(200).json({status:200,"data":{currentUser}, "posts":userPost})
}

const UpdateUser = async (req,res,next)=>{

    const {error} = ValidateUpdateUser.validationUpdateuser(req.body)
    if(error)
      return  res.status(404).json({status:"filed",code:401,message:error.details[0]})
      let hashingpass   
    try{
        if(req.body.password)
         hashingpass =await  hashingPass(req.body.password)
            await  user.findByIdAndUpdate(req.params.id,{
            $set :{
                   "username":req.body.username,
                   "bio":req.body.bio,
                   "password":hashingpass,
                   "location":req.body.location
            }
         })
         const Updated = await user.findById(req.params.id);
                res.status(200).json({ message: "User information updated successfully", user: Updated });
              
      }catch(err){
              res.status(500).json({ message: "An error occurred while updating user information"});
      }

}
const count = async(req,res)=>{
 const count =  await user.find();
   return res.status(200).json({status:200,count:count.length});
}


const proFilePhotoUpload = async (req,res)=>{
    const token = req.headers.authorization || req.headers.Authorization
    if(!req.file)
        return  res.status(401).json({ message: "No file provided" });
        
    const imagePath = path.join(__dirname,`../images/${req.file.filename}`)
    const courentUser = await user.find({"token":token.split(" ")[1]})
      const result =  await cloudinaryUploadImages(imagePath)
         if(courentUser[0].avatar.publicId != null)
              await cloudinaryDeletetImages(courentUser[0].avatar.publicId )
        
              await  user.findByIdAndUpdate(courentUser[0]._id,{
            $set :{
                  avatar :{
                    url:result.url,
                    publicId :result.public_id
                  } 
            }
         })

     res.status(200).json({ message: "Your profile photo uploaded successfully ." , avatar:{
        url:result.url,
        publicId :result.public_id
     }});
     fs.unlinkSync(imagePath)
}

const deleteUserProfile = async (req,res)=>{
   const id = req.params.id;
   const CurentUserbyId =await  user.findById(id)
    if(CurentUserbyId.avatar.publicId !== null){

      cloudinaryDeletetImages(CurentUserbyId.avatar.publicId)
    }
          let commentsFound = 0 ;
          const podtsFounded =await post.find({construction:id})
          podtsFounded.map(async(ele,ind)=>{
           const deleted  = await comment.deleteMany({postId:ele._id}) 
            commentsFound += deleted.deletedCount
               if(ele.image.piblicId !== null)
                 await  cloudinaryDeletetImages(ele.image.piblicId)
          })
          const psotsDeleted  = await post.deleteMany({construction:id})  
          await user.findByIdAndDelete(id)
     res.status(200).json({ message: "Your profile has been  deleted  successfully ." ,data:{pstsDeleted :psotsDeleted.deletedCount,commentsDeleted:commentsFound.deletedCount}})

}

const userSearch = async(req,res)=>{
    const queryName  = req.query.name;
       const resault = await user.find({
    username: { $regex: queryName, $options: 'i' }
  });
    res.json({users:resault})
}


module.exports = {getAllUsers,GetSinglUser,UpdateUser,count,proFilePhotoUpload,deleteUserProfile,GetSinglUserByToken,userSearch};






