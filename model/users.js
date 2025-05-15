const mongoose = require("mongoose")
const joi = require("joi");
const userSchema = new mongoose.Schema({
      username : {
        type:String,
        require:true,
        trim:true, // delte spaces from the text " atef " => "atef",
        minlength:2,
        maxlength:15,

      },
       email : {
        type:String,
        require:[true,"Email is required. Please enter a valid Email"],
          unique:[true,"This email is already registered. Please use a different email or log in to your account"],
        trim:true, // delte spaces from the text " atef " => "atef",
        minlength:5,
        maxlength:200,
        
      },
       password : {
        type:String,
        require:true,
        trim:true, // delte spaces from the text " atef " => "atef",
        minlength:8,
      },
      avatar:{
        type:Object,
        default:{
            url:"https://cdn.pixabay.com/photo/2020/10/11/19/51/cat-5646889_640.jpg",
            publicId:null
        }
      },
      bio:{
        type:String,
        default:"Chasing dreams and making them real ❤️"
      }, location:{
        type:String,
        default:"Egypt"
      },
       isAdmin:{
        type:Boolean,
        default:false
      }
      ,
       isAcountVerified:{
        type:Boolean,
        default:false
      },
      token:{
           type:String
      }
},{timestamps:true})

// user model 

const user = mongoose.model("user", userSchema)

//  validate Register User 
const validationRegisteruser = (obj)=>{
      const sechma = joi.object({
         username: joi.string().trim().min(2).max(20).required(),
          email: joi.string().trim().min(3).required().email(),
          password: joi.string().trim().min(3).required(),
      })
      return sechma.validate(obj)
}

//  validate Update User 
const validationUpdateuser = (obj)=>{
      const sechma = joi.object({
         username: joi.string().trim().min(2).max(100),
          bio : joi.string().min(5),
          location : joi.string().min(2),
          password: joi.string().trim().min(8),

      })
      return sechma.validate(obj)
}


module.exports = {
    validationRegisteruser,
    user,
    validationUpdateuser
};