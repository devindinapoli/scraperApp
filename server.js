var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
console.log(MONGODB_URI)
// Routes

app.get("/scrape", function(req, res) {

  axios.get("https://liveforlivemusic.com/").then(function(response) {

  var $ = cheerio.load(response.data);

    $("li").each(function(i, element) {

        var result = {};

        result.link = $(this)
        .children("div")
        .children("div")
        .children("a")
        .attr("href");
        
        result.title = $(this)
        .children("div")
        .children("div")
        .children("h3")
        .children("a")
        .text();

        result.image = $(this)
        .children("div")
        .children("div")
        .children("a")
        .children("img")
        .attr("src");
       
        db.Article.create(result)
        .then(function(dbArticle) {

          console.log(dbArticle);
        })
        .catch(function(err) {

          return res.json(err);
        });
    });


    res.redirect("/");
  })
  .catch(function(err) {
    console.log(err);
  });
});

app.get("/", function (req, res) {
    res.send(index.html);
});


app.get("/articles", function(req, res) {

  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
 
  db.Article.findOne({ _id: req.params.id })
  .populate("note")
  .then(function(dbArticle) {
      res.json(dbArticle);
    })
  .catch(function(err) {
    res.json(err);
  });
});

app.post("/articles/:id", function(req, res) {

  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArtile);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});
