var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once("open", function() {
  console.log("DB connected!");
});
db.on("error", function(err) {
  console.log("DB Error: ", err);
});

// MongoDB Schema, Model
var dataSchema = mongoose.Schema( {
  name:String
  ,count:Number
})

var Data = mongoose.model('data', dataSchema); // 모델을 담는 변수는 첫글자가 대문자
Data.findOne({name:"myData"}, function(err,data) {
  if(err)
    return console.log("Data Error: ", err);

  if(!data) {
    Data.create({
      name:"myData"
      ,count:0
    }, function(err, data) {
      if(err)
        return console.log("Data Error: ", err);

      console.log("Counter initialized: ", data);
    });

  }
});


app.set("view engine", 'ejs');
app.use(express.static(path.join(__dirname + '/public')));


app.get('/', function(req,res) {
  Data.findOne({
    name:"myData"
  }, function(err, data) {
    if(err)
      return console.log("Data Error: ", err);

    data.count++;
    data.save(function (err) {
      if(err)
        return console.log("Data Error: ", err);

      res.render('my_first_ejs', data);
    });
  });
});


app.get('/reset', function(req,res) {
  setCounter(res, 0);
});

app.get('/set/count', function(req, res) {
  if(req.query.count)
    setCounter(res, req.query.count);
  else
    getCounter(res);

});

app.get('/set/:num', function(req,res) {
  if(req.params.num)
    setCounter(res, req.params.num);
  else {
    getCounter(res);
  }
});

// Count 값 저장하기
function setCounter(res, num) {
  console.log("setCounter");
  Data.findOne({
    name:"myData"
  }, function (err, data) {
    if(err)
      return console.log("Data Error: ", err);
    data.count = num;
    data.save(function (err) {
      if(err)
        return console.log("Data Error: ", err);

      res.render('my_first_ejs', data);
    });
  });
}

// Count 값 가져오기
function getCounter(res) {
  console.log("getCounter");
  Data.findOne({
    name:"myData", function (err, data) {
      if(err)
        return console.log("Data Error: ", err);

      res.render('my_first_ejs', data);
    }
  });
}

app.listen(3000, function() {
  console.log('Server On...');
});
