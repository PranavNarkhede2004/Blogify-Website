const Blog=require("../models/blog.js");
const Comment=require("../models/comment.js");
const multer=require("multer"); 
const path=require("path");
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId=req.user._id.toString();
        const uploadPath = path.resolve(__dirname, `../public/images/uploads/${userId}`);
    
    //create Folder if it doesnt exist
    fs.mkdirSync(uploadPath,{recursive:true});
    cb(null,uploadPath);
  },
  filename: function (req, file, cb) {
    const fileName=`${Date.now()} - ${file.originalname}`;
    cb(null,fileName);
  }
})

const upload = multer({ storage: storage })

const {Router}=require("express");

const router=Router();

router.get("/add",(req,res)=>{
    return res.render("addBlog",{
        user:req.user
    });
})

router.get("/:id",async (req,res)=>{
  const blog=await Blog.findById(req.params.id).populate("createdBy");
  const comments=await Comment.find({BlogId:req.params.id}).populate("createdBy");
  return res.render("blog",{
    user:req.user,
    blog,
    comments
  }) 
})

router.post("/",upload.single('coverImageURL'),async (req,res)=>{
    const {title,body,}=req.body;
    const blog=await Blog.create({
      body,
      title,
      createdBy:req.user._id,
      coverImageURL:`/images/uploads/${req.user._id}/${req.file.filename}`,
    })
    return res.redirect(`/blog/${blog._id}`);
});

router.post("/comment/:blogId",async (req,res)=>{
  await Comment.create({
    content:req.body.content,
    BlogId:req.params.blogId,
    createdBy:req.user._id
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports=router;