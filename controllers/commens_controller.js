const {comment,validationCreateComment,validationUpdateComment} = require("../model/comments")
const {user} = require("../model/users");
const {post} = require("../model/post")

const craeteNewComment = async(req,res)=>{
    const {error} =validationCreateComment(req.body);
         if(error)
               return   res.status(400).json({message:error})
       const token = req.headers.Authorization || req.headers.authorization
    const courrentUser = await user.find({"token":token.split(" ")[1]})


    const newComment = new comment({
         postId:req.body.postId,
         content:req.body.content,
         construction:courrentUser[0]._id,
         userName:courrentUser[0].username,
         userIsVerified:courrentUser[0].isAcountVerified,
         imageProfile:{url:courrentUser[0].avatar.url}
    })

    
    
    await newComment.save();

     const data  = await  post.findByIdAndUpdate(req.body.postId,{
                  $push:{comments:newComment._id } //! like = [] , pull to delete element from arr
              },{new:true})
  
          res.status(200).json({satate:"successfully",commment:newComment})
}

const deleteComment = async(req,res)=>{
  try{

    
    const id = req.params.id ;
    const data = await comment.findOneAndDelete({"_id":id})

 await  post.findByIdAndUpdate(data.postId,{
      $pull:{comments:data._id } //! like = [] , pull to delete element from arr
  },{new:true})


    return   res.status(200).json({status:"200",message:"comment has been deleted successfully",data})
  }catch{
    console.log("err ocoure at delete this comment")
  }
}
const getAllcomments  = async (req,res)=>{
    const comments = await comment.find().populate("construction").populate("postId")
  return   res.status(200).json({status:"200",comments})

}
const updateComment = async(req,res)=>{

   const {error} =  validationUpdateComment(req.body)
   if(error)
          return   res.status(401).json({status:"401",message:error})

    const id = req.params.id ;
    const data = await comment.findById(id)
       if(!data)
          return   res.status(404).json({status:"200",message:"Comment not found for the given ID. Please check the ID and try again."})
       const result = await comment.findByIdAndUpdate(id,{$set:{
          content:req.body.content
    }},{new:true})
   await  result.save();
         
  return   res.status(200).json({status:"200",message:"comment has been Updayed successfully",newComment:result})
       
}

const gettAllcommetPost = async(req,res)=>{
    const id = req.params.id
    if(!id)
        return   res.status(404).json({status:"404","message":"Error fetching comments"});

    const comments  =await comment.find({"postId":id}).populate("construction").populate("postId")
    if(comment.length == 0)
        return   res.status(404).json({status:"404","message":"No comments found for this post."});
          
  return   res.status(200).json({status:"200","commentsPost":comments});

}

module.exports = {
    craeteNewComment,
    updateComment,
    deleteComment,
    getAllcomments,
    gettAllcommetPost
}