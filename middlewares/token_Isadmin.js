

const jwt = require("jsonwebtoken");
const {user} =require("../model/users")

const TokenIsAdmin = async(req,res,next)=>{
        let  token = ""
        try{

        token = req.headers.authorization.split(" ")[1] ||req.headers.Authorization.split(" ")[1] ;
        }catch(err){
            return  res.status(401).json({status:"filed",code:401,message:"bearer Token ?"})
        }
    if(!token)
        return  res.status(401).json({status:"filed",code:401,message:"Unauthorized - token is required! first"})
        try{
            await jwt.verify(token,process.env.SECRET_KEY);    
              const currentUser = await user.find({token:token})  
    
              if(!currentUser[0].isAdmin)
                   throw("this is sample user")
               else
               return next();
        }catch(err){
            return  res.status(401).json({status:"filed",code:401,message:"Unauthorized - token is required!"})
        }


}
module.exports = TokenIsAdmin;