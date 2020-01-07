var express = require("express"),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer");
locus = require('locus');
path = require('path');
var app = express();


// App Config
var options = {'useCreateIndex': true,
'useFindAndModify': false,
'useNewUrlParser': true,
'useUnifiedTopology': true
}
mongoose.connect("mongodb://localhost:27017/restful_blog_app", options);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, '/views'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Mongoose Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
})

// Mongoose Model Config
var Blog = mongoose.model("Blog",blogSchema);

app.get("/", function(req, res){
    console.log("At index");
res.redirect("/blogs");
})

// INDEX Route
app.get("/blogs", function(req, res){
    console.log("returning all blogs");
    
    Blog.find({},function(err,blogs){
        if (!err) {
            res.render("index", {blogs});
        } else {
            console.log(err);
            
        }
    })
})

// NEW Route
app.get("/blogs/new", function(req, res){
    
res.render("new");
})


// Create Route
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if (!err) {
            res.redirect("/blogs");

        } else {
            res.render("new")
        }
    })
})

// Show Route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if (!err) {
            res.render("show",{blog});  
            
        } else {
            res.redirect("/blogs")  
        }
    })
})

// Edit Route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id,function(err, blog){
    res.render("edit",{blog});
        
    })
})

// Update Route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, response){
        if (!err) {
            console.log(response);
            console.log("I.e, Blog-Post UPDATED");
            res.redirect(`/blogs/${req.params.id}`)
            
        } else {
            console.log(err);
            res.redirect("/blogs")
        }
    })
})

// Destroy Route
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err, doc){
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
})

app.listen(3000,function(){
    console.log("Server Running");
})