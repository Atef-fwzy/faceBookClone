const jwt = require("jsonwebtoken");

const generate_token = async(payload)=>{
const token = await  jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"50d"})
return token;
}

module.exports = generate_token;