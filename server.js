//Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//requiring Note and Article models
var Note = require("./models/note.js");
var Article = require("./models/article.js");
//our scraping tools
var request = require("request");
var cheerio = require("cheerio");
//set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

//Initialize Express
var app = express();

//use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

//handlebars setup
var exphbs = require("express-handlebars"); 

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//make public a static dir
app.use(express.static("public"));

//database configuration with mongoose
mongoose.connect("mongodb://localhost/mongooseCheeriosNews");
var db = mongoose.connection;

//show any mongoose errors
db.on("error", function(error) {
    console.log("mongoose error: " + error);
});

//once logged into the db through mongoose, log a success message
db.once("open", function() {
    console.log("mongoose connection was successful");
});

//**************** routes ****************

//a GET request to scrape the rawstory website
app.get("/scrape", function(req, res) {
    request("http://www.rawstory.com/", function(error, response, html) {
        var $ = cheerio.load(html);
        
        $("div.recent-post-widget").each(function(i, element) {

            var result = {};
            //add the text and href of every link, and save them as properties of the result object
            result.title = $(this).find("div.recent-post-widget-title").text().trim();
            result.link = $(this).find("div.recent-post-widget-title").find("a").attr("href");
            result.image = $(this).find("a").find("img").attr("src");
                console.log(result);

            //using out article model, create a new entry
            var entry = new Article(result);

            //save entry into db
            entry.save(function(err, doc) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(doc);
                }
            });           
        });
    });
    res.redirect("/articles");
});

//redirect root route to display articles in database
app.get("/", function(req, res) {
    res.redirect("/articles");
});

//route to get the articles we scraped from MongoDB
//display most recent article first
app.get("/articles", function(req, res) {
    Article.find({}).sort({_id:-1}).exec(function(error, doc) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(doc);
            res.render("index", {article: doc});
        }
    });
});

//grab an article by it's ObjectId and populate notes
app.get("/:id", function(req, res) {
    Article.findOne({"_id": req.params.id}).populate("note")
    .exec(function(error, docNotes) {
        if (error) {
            console.log(error);
        }
        else {
            var notes = docNotes.note;
            console.log("docNotes: " + docNotes);
            console.log("notes: " + JSON.stringify(notes));
            console.log("mainId: " + docNotes._id);
            res.render("index2", {article: docNotes, note: notes, mainId: docNotes._id});
        }
    });
});

//create a new note
app.post("/articles/:id", function(req, res) {
    console.log(JSON.stringify(req.body.newComment));
    var result = [];
    result.body = req.body.newComment;
    var newNote = new Note(result);

    //save the new note in the db
    newNote.save(function(error, doc) {
        if (error) {
            console.log(error);
        }
        else {
            Article.findOneAndUpdate({"_id": req.params.id}, { $push: {"note" :doc._id}}, {new: true}, function(err, doc) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(doc);
                    res.redirect("/" + req.params.id);
                }
            });
        }
    });
});

//delete selected note
app.post("/delete/:id", function(req, res) {
    console.log("req.body: " + JSON.stringify(req.body));
    Note.remove({_id: req.params.id}, function(err) {
        if (err) {
            return handleError(err);
        }
        else {
            console.log("document removed");
            res.redirect("/" + req.body.id);
        }
    });
});

//listen on port 3000
app.listen(3000, function() {
    console.log("app is running on port 3000");
});