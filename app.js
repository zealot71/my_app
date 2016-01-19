// import modules
var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// connect database
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once("open", function() {
  console.log("DB connected!");
});
db.on("error", function(err) {
  console.log("DB Error: ", err);
});


// model setting
var postSchema = mongoose.Schema({
  title: {type:String, required:true},
  body: {type:String, required:true},
  createdAt: {type:Date, default:Date.now},
  updatedAt: Date
});

var Post = mongoose.model('post', postSchema);

// view setting
app.set("view engine", 'ejs');

// set middlewares
app.use(express.static(path.join(__dirname + '/public')));

// set route
app.get('/posts', function(req, res) {
  Post.find({}, function(err,posts) {
    if(err) return res.json({success: false, message: err});
    res.json({success:true, data:posts});
  });
}); // index


app.post('/posts', function(req, res) {
  Post.create(req.body.post, function(err, post) {
    if(err) return res.json({success:false, message:err});
    res.json({success:true, data:post});
  });
}); // create

// start server
app.listen(3000, function() {
  console.log('Server On...');
});
