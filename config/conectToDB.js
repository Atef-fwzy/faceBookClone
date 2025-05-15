const mongose = require("mongoose");

module.exports = async()=>{
    try{
      await mongose.connect(process.env.MONGO_URL)
       console.log("conection succeseful  to MongoDB !✅ ")
    }catch(err){
             console.log("conection failed to MongoDB ! ⛔")
    }
}