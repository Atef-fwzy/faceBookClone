const mongoose = require("mongoose")
const joi = require("joi")


const categorySchema = new mongoose.Schema({
    user:{
          type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true},
    title:{
        type:String,
        required:true,
        trim:true
    }
},{timestamps:true})

const category = mongoose.model("categoie",categorySchema)

//  validation  functions 

 //! validation to create new comment 
 const validationCreateCategory =(obj)=>{
            //! obj => req.body
    const sechema  =   joi.object({
               title:joi.string().trim().required().min(3).label("title"),
      })
      return sechema.validate(obj)
 }


module.exports = {
    category,
   validationCreateCategory
}