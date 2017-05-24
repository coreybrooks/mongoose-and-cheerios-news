//require mongoose
var mongoose = require("mongoose");
//create schema class
var Schema = mongoose.Schema;

//create article schema
var ArticleSchema = new Schema({
    //title is a required string
    title: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    //link is a required string
    link: {
        type: String,
        required: true
    },
    //image is a required string
    image: {
        type: String,
        required: true
    },
    //saves one note's ObjectId, refers to the Note Model
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }] 
});

// create the Article model with the  ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

//export the model
module.exports = Article;