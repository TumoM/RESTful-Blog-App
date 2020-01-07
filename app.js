var express = require("express"),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
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
app.use(bodyParser.urlencoded({extended:true}))

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
    
res.redirect("/blogs");
})

// INDEX Route
app.get("/blogs", function(req, res){
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

app.listen(3000,function(){
    console.log("Server Running");
})