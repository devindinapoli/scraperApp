//Dependencies
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

//Connecting to the MongoDB with either the heroku add-on, or the localhosts' DB
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
// Routes

//Starting the scrape..
app.get("/scrape", function(req, res) {
  //Using axios to get the requested site
  axios
    .get("https://liveforlivemusic.com/news")
    .then(function(response) {
      //Using cheerio to load all of the data from the site
      var $ = cheerio.load(response.data);

      //Grabbing each element on the site by it's 'li' tag
      $("li").each(function(i, element) {
        var result = {};
        //Grabbing the link...have some children!
        result.link = $(this)
          .children("div")
          .children("div")
          .children("a")
          .attr("href");

        //Grabbing the title...have some more children!
        result.title = $(this)
          .children("div")
          .children("div")
          .children("h3")
          .children("a")
          .text();

        //Grabbing the image URL...children?
        result.image = $(this)
          .children("div")
          .children("div")
          .children("a")
          .children("img")
          .attr("src");

        //Create the article and store it into the MongoDB
        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            return res.json(err);
          });
      });

      //Once succesfully scraped, redirect the user to the home page
      res.redirect("/");
    })
    .catch(function(err) {
      console.log(err);
    });
});

//Setting the default page to the index.html file
app.get("/", function(req, res) {
  res.send(index.html);
});

//Getting all of the articles scraped from the database and displaying it as JSON
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

//Updating an articles' note based on it's ID
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

//Listening on Port...
app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});
