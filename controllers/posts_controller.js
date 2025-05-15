const { post,validateCreatePost, validateUpdatePost} = require("../model/post")
const path=require("path")
const {user} = require("../model/users")

const fs =require("fs");
const  {cloudinaryUploadImages, cloudinaryDeletetImages} = require("../utils/cloudinary");
const { comment } = require("../model/comments")




const createNewPost = async(req,res)=>{
    const {error} = validateCreatePost(req.body)
    const catchToken = req.headers.Authorization || req.headers.authorization
   const token = catchToken.split(" ")[1]
    const courrentUser = await user.find({"token":token})
    if(courrentUser.length ==0 )
        return  res.status(404).json({satate:"filed",message:"user not found"})

    let result = "";
        if(error)
             return   res.status(400).json({message:error})

    if(req.file){
             const iamgePath = path.join(__dirname,`../images/${req.file.filename}`)
          result = await cloudinaryUploadImages(iamgePath)
              fs.unlinkSync(iamgePath)
    }
    const newPsot = new post({
             description:req.body.description ,
             category:req.body.category,
             image:{
                 url:result.url || "",
                 piblicId:result.public_id || null
             },
             user: courrentUser[0]._id,
             construction:courrentUser[0]._id
             
             
    })
        await newPsot.save();

        res.status(200).json({satate:"successfully",post:newPsot})
}

const getAllposts =async(req,res)=>{
    const query = req.query;
    let limit = query.limit || 20;
    let page = query.page || 1;
    let posts; 
     let  skip = (page - 1) * limit ; 
     if(query.category)
        posts = await post.find({"category":query.category}).populate("user").populate("comments").sort({updatedAt:-1}).limit(limit).skip(skip);
     else
       posts = await post.find().populate("user").limit(limit).skip(skip);
    res.status(200).json({satate:"successfully",post:posts})

}

const getSinglePost = async(req,res)=>{
    const id = req.params.id;
    let singlePost;
        
 try{
          singlePost  = await post.findById(id).populate("user").populate("likes").populate("comment")
           if(!singlePost)
               return  res.status(404).json({status:"filed",code:401,message:"post Not found , pless try with valid Id."})
        }catch(err){
            return  res.status(404).json({status:"filed",code:401,message:"post Not found , pless try with valid Id ."})
        }
      return  res.status(200).json({status:"successfull",code:200,"post":singlePost})

}
const getPostsCount = async(req,res)=>{
     
     const count =await post.find();

      return  res.status(200).json({status:"successfull",code:200,"count":count.length})
     
}


const deleteSinglePost = async(req,res)=>{
    const id = req.params.id;
    let singlePost;
       const token = req.headers.Authorization || req.headers.authorization
    const courrentUser = await user.find({"token":token.split(" ")[1]})
    
    try{
        singlePost  = await post.findById(id)
        if(!singlePost)
            return  res.status(404).json({status:"filed",code:401,message:"post Not found , pless try with valid Id."})
    }catch(err){
        return  res.status(404).json({status:"filed",code:401,message:"post Not found , pless try with valid Id ."})
    }

      if(courrentUser[0]._id=== singlePost.user.user_id|| courrentUser[0].isAdmin){
          const resault = await post.findByIdAndDelete(id)
          const imagepublicId = resault.image.piblicId;
           await cloudinaryDeletetImages(imagepublicId)
           await comment.deleteMany({postId:id})  // to delete all post,s comments 
          return  res.status(200).json({status:"successfull",messsage:"Post deleted successfully",code:200,"post":resault})
      }
   return  res.status(401).json({status:"filed ",code:401,message:"You do not have permission to delete this post."})
}

const updatePost = async(req,res)=>{


    const id = req.params.id;
    const token = req.headers.Authorization || req.headers.authorization
    const courrentUser = await user.find({"token":token.split(" ")[1]})
    let singlePost ;
    try{
          singlePost  = await post.findById(id)
          if(!singlePost)
              return  res.status(404).json({status:"filed",code:401,message:"post Not found , pless try with valid Id."})
      }catch(err){
          return  res.status(404).json({status:"filed",code:401,message:"post Not found , pless try with valid Id ."})
      }


if(courrentUser[0]._id.valueOf() === singlePost.user.valueOf()){
            var data ="";
              if(req.file){
                      if(singlePost.image.piblicId !== null)
                            await cloudinaryDeletetImages(singlePost.image.piblicId )
            const iamgePath = path.join(__dirname,`../images/${req.file.filename}`)
          data = await cloudinaryUploadImages(iamgePath)
          fs.unlinkSync(iamgePath)
               }        
          const resault = await post.findByIdAndUpdate(id,{$set:{
              title :req.body.title,
             description:req.body.description,
             category:req.body.category,
             image:{
                url:data.url ||singlePost.image.url ,
                piblicId:data.public_id ||singlePost.image.piblicId
             }
          }})
    
          return  res.status(200).json({status:"successfull",messsage:"Post Updated successfully",code:200,"post":resault})
      }
   return  res.status(401).json({status:"filed ",code:401,message:"You do not have permission to Update  this post."})

}
const toggleLikes = async(req,res)=>{
     const id = req.params.id ;
     const token = req.headers.Authorization || req.headers.authorization
    const courrentUser = await user.find({"token":token.split(" ")[1]})
    const courrentPost = await post.findById(id)
      if(!courrentPost)
           return  res.status(404).json({status:"filed",code:401,message:"post Not found , pless try with valid Id."})
    const isPostAlreadyLiked = courrentPost.likes.find((user)=> user.toString() === courrentUser[0]._id.toString())
    if(isPostAlreadyLiked){
        const data  = await  post.findByIdAndUpdate(id,{
            $pull:{likes:courrentUser[0]._id.toString()}   //! like = [] , pull to delete element from arr
        },{new:true}) // {new:true} to retern likes after update 
                return  res.status(200).json({status:"successfully , remove like to this post ",code:401,Likes:data})
    }else{
        const data =   await  post.findByIdAndUpdate(id,{
            $push:{likes:courrentUser[0]._id}   //! like = [] , push to add element to arr
        },{new:true})
                return  res.status(200).json({status:"successfully , add like to this post ",code:401,Likes:data})

    }
}
module.exports = {
    createNewPost,
    getAllposts,
    getSinglePost,
    getPostsCount,
    deleteSinglePost,
    updatePost,
    toggleLikes
}