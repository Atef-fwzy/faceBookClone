const bcrypt = require("bcryptjs");
const generate_token = require("../utils/generate_token")
const jwt = require("jsonwebtoken")
const  {validationRegisteruser,user} = require("../model/users");
/*
* @desc Register new user  / sign up
* @/api/auth/register
*@method  post 
* @access public 
*
*
*/

register =async (req,res)=>{
    const data = req.body;
    const {error} = validationRegisteruser(data)
    if(error)
        return res.status(400).send({message:error.details[0].message})
       const findUser = await user.findOne({email:req.body.email})
       if(findUser)
        return  res.status(400).send({message:"This email is already registered. Please use a different email or log in to your account"})
      
       const salt =await bcrypt.genSalt(10)
      const cipherPassword = await  bcrypt.hash(req.body.password,salt)
      const newUser = new user({
             username : data.username,
             email : data.email,
             password : cipherPassword,
      });
      await newUser.save();
      return  res.status(201).send({message:"you registered succefuuly . please log in ! "})
}

const loginUser = async (req,res)=>{
    const {email,password} = req.body;
        if(!email || !password)
          return  res.status(401).json({status:"filed",message:"Email and password are required"})

        const findUser = await user.findOne({"email":email});

        if(!findUser)
             return res.status(400).json({status:"filed",message:"User not registered"})

        const plainpass = await bcrypt.compare(password,findUser.password)

        if(!plainpass)
                return res.status(400).json({status:"filed",message:"Invalid email or passwordddd."})
              const token =await  generate_token({username:findUser.username,email:findUser.email,isAdmin:findUser.isAdmin})
                  findUser.token = token;
                  const updateUser = new user(
                    findUser
                  )
                  await updateUser.save();
            return res.status(201).json({status:"successful",data:{message:"Login successful!.",findUser}})

         
}

module.exports = {register,loginUser};
