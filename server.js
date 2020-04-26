// Dependancies Express, logger and DB
const express = require("express");
const exphbs = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");

// GET PUT Requests and scraping
const axios = require("axios");
const cheerio = require("cheerio");

// Require models for Handlebars
var db = require("./models")

// Initialize Express and PORT
var app = express();
var PORT = process.env.PORT || 8080;

// Morgan logger
app.use(logger("dev"));

// Serve static route to public
app.use(express.static("public"));

// Parse body JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to Mongo DB
let dbName = "mongodb://localhost/mongoScrape";
mongoose.connect(process.env.MONGODB_URI || dbName, { useNewUrlParser: true });
console.log(`\nConnected to: ${dbName}`)

//ROUTES
// GET homepage
app.get("/", function(req, res) {
  res.redirect("/home");
})

// Hold scrape results
let results = [];

// GET scrape with Axios
app.get("/scrape", function(req, res) {
   //check exist articles
   let exist;
   let existTitle = []

   db.Article.find({})
     .then(function(dbArticle) {
         dbArticle.forEach(function(element) {
             existTitle.push(element.title)
         })
     })

  // First, we grab the body of the html with axios
  axios.get("https://www.w3.org/blog/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    
    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).find("a").text();
      result.link = $(this).find("a").attr("href");
      result.paragraph = $(this).find("p").text();      
      
      // Check if Title exists
      exist = existTitle.includes(result.title)
console.log(`\nEXIST: ${exist}`)
      if (!exist && result.title && result.link && result.paragraph) {
        results.push(result) 
console.log(`\nRESULTS: ${result}`)
      
      }
    });
    let dbArticle = results;
    // Refresh page to display articles
    console.log("Scrape Complete")
    res.render("articles", { dbArticle } );
  });
});

// GET all Articles
app.get("/home", function(req, res) {
      res.render("articles", { results });
});


// GET favorite articles
app.get("/favorites", function(req, res) {
  let articles = db.Article.find({})
    .then(function(dbArticle) {
      // res.json(dbArticle);
      res.render("favorites", { dbArticle });
    })
    .catch(function(err) {
      res.json(err);
    });
});

// POST individual article
app.post("/save", function(req, res) {
  console.log(req.body)
  db.Article.create(req.body)
    .then(function(dbArticle) {
      res.json(dbArticle)
    })
    .catch(function(error) {
      res.json(error)
    });
});

// DELETE individual Article
app.delete("/delete/:id", function(req, res) {
  db.Article.deleteOne({
      _id: req.params.id
  }).then(function(removed) {
      res.json(removed)
  }).catch(function(err) {
      res.json(err)
  })
})

// GET specific Note by Article ID
app.get("/note/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      // res.json(note);
      console.log("\n\n dbArticle: ", dbArticle)
      res.render("notes", {
        data: dbArticle
      })
    })
    .catch(function(err) {
      res.json(err);
    });
});

// POST Note by Article ID
app.post("/note/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ 
        _id: req.params.id 
      }, 
      {
        $push: {
          note: dbNote._id 
        }
      }, 
      {
        new: true 
      });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// DELETE Note by ID
app.delete("/note/:id", function(req, res) {
  db.Note.deleteOne({
    _id: req.params.id
  }).then(function(deleted) {
    res.json(deleted)
  }).catch(function(error) {
    res.json(error)
  })
})

// Start server
app.listen(PORT, function() {
  console.log("\n  Server live, access: http://localhost:" + PORT)
})