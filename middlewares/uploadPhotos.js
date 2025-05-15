
const multer = require("multer");

const diskStorage =multer.diskStorage({
        destination:(req,file,cb)=>{
               cb(null,"images")
        },
        filename:(req,file,cb)=>{
              const name =  "user_" + Date.now()
              cb(null,name+"_"+file.originalname)
        }
})
const filefilter = (req,file,cb)=>{
     const typeFile= file.mimetype.split("/")[0] ;
            if(typeFile === "image")
                 return cb(null,true)
            else
                 return cb("file must be an iamge",false)
                   
}
const upload = multer({ storage: diskStorage,fileFilter:filefilter})

module.exports = upload;

