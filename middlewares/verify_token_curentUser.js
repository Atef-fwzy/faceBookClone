const jwt = require("jsonwebtoken");
const {user} =require("../model/users")
// verify token and you are cournt user
const verify_token_curentUser = async(req,res,next)=>{
          let  token = ""
          try{

            token = req.headers.authorization.split(" ")[1];
          }catch(err){
              return  res.status(401).json({status:"filed",code:401,message:"bearer Token ?"})
          }
        const CurentUser =await  user.find({"token":token})

        if(token  === ""  || CurentUser[0]._id != req.params.id)
          return  res.status(401).json({status:"filed",code:401,message:"not Allowed , only user himself"})
          try{
               await jwt.verify(token,process.env.SECRET_KEY);    
               next();     
         }catch(err){
               return  res.status(401).json({status:"filed",code:401,message:"Unauthorized - token is required!"})
            }
}



module.exports = verify_token_curentUser;