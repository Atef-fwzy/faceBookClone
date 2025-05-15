const mongoose = require("mongoose")
const joi = require("joi")


const commentSchema = new mongoose.Schema({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post",
        required:true
    },
    construction:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
     content:{
          type:String ,
          required:true,
        min:5
    },
    userName:{
        type:String,
        required:true,
    },
    imageProfile:{
     type:Object,
        default:{
            url:"https://cdn.pixabay.com/photo/2020/10/11/19/51/cat-5646889_640.jpg",
        }
    },
     userIsVerified:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

const comment = mongoose.model("comment",commentSchema)

//  validation  functions 
 //! validation to create new comment 

 const validationCreateComment =(obj)=>{
            //! obj => req.body
    const sechema  =   joi.object({
               postId:joi.string().required(),
               content:joi.string().trim().required(),
      })
      return sechema.validate(obj)
 }
  const validationUpdateComment =(obj)=>{
            //! obj => req.body
    const sechema  =   joi.object({
               content:joi.string().trim().min(5),
      })
      return sechema.validate(obj)
 }

module.exports = {
    comment,
    validationCreateComment,
    validationUpdateComment
}