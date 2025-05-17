require("dotenv").config();
const cors = require("cors")
const  ConectionToDB = require("./config/conectToDB")
const express = require("express")
const app = express();
const authRouter = require("./routes/authRoute")
const usersRouter = require("./routes/usersRoute")
const PostsRouter =require("./routes/postsRoute")
const CommentsRouter = require("./routes/commenRoute")
const categoryRouter = require("./routes/categoryRouter");
const  {errorHandler,notFund} = require("./middlewares/Error");
var hpp =require("hpp")
var xss = require("xss-clean")
var helmet = require("helmet")
var rateLimating = require("express-rate-limit")
//?  conection to DB
ConectionToDB();

//? middlewares 
app.use(express.json())  // then the app can understand the json file 
app.use(xss())
app.use(helmet())
app.use(hpp())
app.set('trust proxy', 1);
app.use(rateLimating({
     window : 10* 60 * 100 ,// 10 minutes
     max:200,
}))
// Routes
app.use(cors())
app.use("/api/auth",authRouter)
app.use("/api/users",usersRouter)
app.use("/api/posts",PostsRouter)
app.use("/api/comments",CommentsRouter)
app.use("/api/categories",categoryRouter)
app.use(errorHandler)
app.use("*",notFund)

//  Runing the server 
const PORT  = process.env.PORT || 8080
app.listen(PORT,()=>{
     console.log(`server is  runing in  port ${PORT} `)
})


