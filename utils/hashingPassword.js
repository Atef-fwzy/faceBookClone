const bcrypt = require("bcryptjs");


const hashingPass = async (pass)=>{
    const salt = await  bcrypt.genSalt(10);
    const  passHash = await bcrypt.hash(pass,salt);
    return passHash;
}

module.exports = hashingPass;