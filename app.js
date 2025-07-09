require('dotenv').config();

const express=require("express");
const path=require("path");
const mongoose=require("mongoose");
const userRoute=require("./routes/user.js");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication.js");
const blogRoute=require("./routes/blog.js");
const Blog=require("./models/blog.js");

const app=express();
const PORT=process.env.PORT || 8000;

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.json());
app.use(checkForAuthenticationCookie("token"));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));


mongoose
        .connect(process.env.MONGO_URL)
        .then(()=>console.log("MongoDb connected"));

app.get("/",async (req,res)=>{
    const allBlogs=await Blog.find({});
    return res.render("home",{
        user:req.user,
        blogs:allBlogs
    });
})

app.use("/user",userRoute);
app.use("/blog",blogRoute);

app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`);
})