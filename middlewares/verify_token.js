const jwt = require("jsonwebtoken");
  // is  valide  token  
const verify_token = async(req,res,next)=>{
         let  token = ""
          try{

            token = req.headers.authorization.split(" ")[1] || req.headers.Authorization.split(" ")[1] ;
          }catch(err){
              return  res.status(401).json({status:"filed",code:401,message:"bearer Token ?"})
          }
        if(!token)
         return  res.status(401).json({status:"filed",code:401,message:"Unauthorized - token is required!"})
          try{
               await jwt.verify(token,process.env.SECRET_KEY);    
               next();     
         }catch(err){
               return  res.status(401).json({status:"filed",code:401,message:"Unauthorized - token is required!"})
            }
}

module.exports = verify_token;

