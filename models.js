const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: String,
  selectedListName: String,
  lists: [{
    name: String,
    items: [{
      name: String,
      checked: Boolean,
      crossed: Boolean
    }]
  }]
});

const dataSchema = new mongoose.Schema({
  numberOfCommands: Number,
  date: String
});

const Data = mongoose.model("Data", dataSchema);
const User = mongoose.model("User", userSchema);

module.exports = {User, Data};
