const { stack } = require("../routes/authRoute");

const errorHandler = (err,req,res,next)=>{
    const staatusCode  = res.staatusCode === 200 ? 500 : res.staatusCode;
    res.status(staatusCode).json({
        message : err.message,
        stack : process.env.NODE_ENV === "production" ? null : err.stack
    })

}

const notFund = (req,res,next)=>{

    return res.status(404).json({message:"Route  Not found "})
}

module.exports = {errorHandler,notFund};