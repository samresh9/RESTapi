const express = require("express");
const ejs = require("ejs");
//const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const app = express();
//in new version no need to install body parser use the code below
app.use(express.urlencoded({ extended: true}));
mongoose.set('strictQuery', true);
async function connectDB(){
try{
   await mongoose.connect('mongodb://127.0.0.1:27017/articleDB');
   console.log("Database Connected Successfully");
}catch(error){
  console.log("Not connected" , error);
}
}
app.set('view engine', 'ejs');
app.use(express.static("public"));
//schema
const articleSchema = new Schema({
    title : String,
    content : String
});
//model
const Article = mongoose.model("Article" , articleSchema);

//using chained route handler express to handle same route for different methods
////////////////////////////Requesting targeting all articles/////////////////////////////////////////////
app.route("/articles")
.get((req,res)=>{
   Article.find({} , (error,foundArticle)=>{
    if(!error){
        res.send(foundArticle);
    }else{
      console.error(error);
    };
   })
})
.post((req,res)=>{
    console.log(req.body.title);
    console.log(req.body.content);
    Article.create({title :req.body.title, content:req.body.content } ,(err)=>{
      if(!err){
        res.send("Added successfully");
      }else{
        res.send(err);
      }
    })
})
.delete((req,res)=>{
  Article.deleteMany({},(err)=>{
    if (!err){
      res.send("deleted Successfully");
  }else{
    res.send(err);
  }    
  })
});
////////////////////////////Requesting targeting specific articles//////////////////////////////////////////////////////////
app.route("/articles/:articleTitle")
.get((req,res)=>{
  Article.findOne({title : req.params.articleTitle} , (err,foundItem)=>{
    if(foundItem){
      res.send(foundItem);
    }else{
      res.send("Item not found");       
    }
  })
})
.put((req,res)=>{
  Article.updateOne({title:req.params.articleTitle} , { $set: {
        title: req.body.title,
        content: req.body.content
        }},{overwrite:true}, (err)=>{
    if(!err){
       res.status(200).send({ message: "Replaced " });
    }else{
      res.status(400).send({ message: "ERROR" });
    }
  });
})
.patch((req,res)=>{
     Article.updateOne({title:req.params.articleTitle} , { $set: req.body}, (err)=>{
    if(!err){
       res.status(200).send({ message: "Updated" });
    }else{
      res.status(400).send({ message: "ERROR" });
    }
  });
})
.delete((req,res)=>{
 Article.deleteOne({title:req.params.articleTitle}, (err)=>{
   if(!err){
       res.send("Deleted");
    }else{
      res.status(400).send({ message: "ERROR" });
    }
 })
});


connectDB().then(()=>{
app.listen(8000, function () {
  console.log("Server started on port 3000");
});
})
