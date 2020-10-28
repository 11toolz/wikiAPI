const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const express = require("express");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// Connecting to the Mongo database
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
// Database Schema
const wikiSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = new mongoose.model("Article", wikiSchema);

// Routes for all articles
app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err)
      }
    });
  })

  .post(function(req, res) {

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (!err) {
        res.send("New article successfully added")
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Deleted all articles successfully")
      } else {
        res.send(err)
      }
    });
  });

// Routes for all articles
app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, article) {
      if (!err) {
        res.send(article)
      } else {
        res.send("No articles matching that title was found.");
      }
    });
  })

  .put(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated")
        } else {
          res.send(err)
        }
      });
  })
  .patch(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("Successfuly updated the article")
        } else {
          res.send(err)
        }
      });
  })



app.listen(3000, function() {
  console.log("Server started at port 3000");
})
