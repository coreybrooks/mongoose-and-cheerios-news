//Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//requiring Note and Article models
//var Note = require("./models/note.js");
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

//routes

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
    //send finished message
    res.send("scrape complete");
    console.log("scape complete");
});

//listen on port 3000
app.listen(3000, function() {
    console.log("app is running on port 3000");
});