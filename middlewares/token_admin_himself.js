const jwt = require("jsonwebtoken");
const {user} =require("../model/users")
// verify token and you are cournt user
const verify_token_curentUserOrAdmin = async(req,res,next)=>{

             const id = req.params.id;
          let  token = ""
          try{

            token = req.headers.authorization.split(" ")[1] || req.headers.Authorization.split(" ")[1];
          }catch(err){
              return  res.status(401).json({status:"filed",code:401,message:"bearer Token ?"})
          }

            try{
               await jwt.verify(token,process.env.SECRET_KEY);    
    
         }catch(err){
               return  res.status(401).json({status:"filed",code:401,message:"Unauthorized - token is required!"})
            }
          
        const CurentUserbyToken =await  user.find({token})
        const CurentUserbyId =await  user.findById(id)
                    
    
        if(CurentUserbyToken.length === 0 || !CurentUserbyId)
               return  res.status(401).json({status:"filed",code:401,message:"not Allowed , only user himself or admins can delete the acount or user"})
                  

        if(CurentUserbyToken[0].isAdmin || CurentUserbyId._id.valueOf() == CurentUserbyToken[0]._id.valueOf() )
          return next();
           else{
               return  res.status(401).json({status:"filed",code:401,message:"not Allowed , only user himself or admins can delete the acount form madellware"})
            }
        
}



module.exports = verify_token_curentUserOrAdmin;