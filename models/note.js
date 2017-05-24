//require mongoose
var mongoose = require("mongoose");
//create a schema class
var Schema = mongoose.Schema;

//create the Note schema
var NoteSchema = new Schema({
    //just a string
    body: {
        type: String
    }
});

//create the Note model
var Note = mongoose.model("Note", NoteSchema);

//export the Note model
module.exports = Note;