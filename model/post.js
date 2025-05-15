const mongoose = require("mongoose");
const joi = require("joi")


const postschema =new  mongoose.Schema({

 description :{
        type:String,
        require:[true,"description is required. Please enter a valid Email"],
        trim:true,
        minlength:2,
       },
user:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"user",
       require:true
    },
    construction:{
              type : mongoose.Schema.Types.ObjectId
    },
category:{
       type:String,
       require:[true,"category is required. Please enter a valid Email"],
    },
image:{
       type:Object,
       default:{
       url:"",
       piblicId:null
       }
    },
likes:[
       {
       type:mongoose.Schema.Types.ObjectId  ,
       ref:"user",
       }
],
comments:[
       {
       type:mongoose.Schema.Types.ObjectId  ,
       ref:"comment",
       }
],
},{
       timestamps:true
}
)


//  post Model 
const post = mongoose.model("post",postschema)

//  validet creat post

const  validateCreatePost = (obj)=>{
       const schema = joi.object({
              description: joi.string().trim().min(20).required(),
              category:joi.string().trim().required()

       })
        return schema.validate(obj);
}

//  validet creat post



module.exports ={
      post,
      validateCreatePost,
      }