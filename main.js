const Discord = require('discord.js');
const mongoose = require("mongoose");
require('custom-env').env('staging');
https = require('https');
const imageSearch = require('image-search-google');
const cheerio = require('cheerio');
const request = require('request');
const axios = require('axios');

mongoose.connect("mongodb+srv://admin:" + process.env.ATLASPASSWORD + "@cluster0.xpbd4.mongodb.net/" + process.env.ATLASUSER, {useNewUrlParser: true, useUnifiedTopology: true});

const client = new Discord.Client();
client.login(process.env.LOGIN);
client.once('ready', () => {
// client.user.setUsername("Mystery engineer 2020");
// client.user.setAvatar("https://wikiclipart.com/wp-content/uploads/2017/03/Paper-and-pencil-pencil-and-paper-clipart-free-images-3.png");
console.log("Skule Bot is Running")
});

const googleClient = new imageSearch('0fb2de5617f419fb9', 'AIzaSyBUQaXp5bZ8qdvGJ7X1hcxkYNLgtY7cT1s');

var color = "";
const prefix = "-";

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

const User = mongoose.model("User", userSchema);
const Data = mongoose.model("Data", dataSchema);

client.on ('message', async message => {
  if (!message.content.startsWith(prefix) ) return

  color = getRandomColor();
  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  var user = await User.findOne({'id': message.author.id}).exec();

  if (message.guild && message.guild.id === "787346072049418329"){//for that person
    user = await User.findOne({'id': "474380232468463646"}).exec();
  }

  if (user == null){
    const newUser = new User({
      id: message.author.id,
      selectedListName: null,
      lists: []
    });
    user = newUser;
  }

  var data = await Data.findOne({}).exec();
  if (data == null){
    data = new Data({
      numberOfCommands: 0,
      date: "Wed Oct 07 2020"
    });
  }
  data.numberOfCommands += 1;
  data.save();

  if (command === "image" || command === "images" || command === "img"){
    getImage(argsToString(args), url => {
      message.channel.send(url)
    })
  }

  else if (command == "rhodes"){
    rhodes((url) => {
      message.channel.send(url)
    }, args[0])
  }

  else if (command == "imgstatus"){
    const embed = new Discord.MessageEmbed()
    .setColor(color)
    var string = "Header Index: " + headerIndex + "\n" + "Until rotation: " + numSearchSinceRotation + "/30\n" + "Headers: " + JSON.stringify(headersList[headerIndex]);
    embed.setFooter(string);
    message.channel.send(embed)
  }

  else if (command == "forcerotation"){
    numSearchSinceRotation = 0
    if (headerIndex < headersList.length - 1){
      headerIndex += 1
    }else{
      headerIndex = 0
    }
    message.channel.send("Headers successfully rotated")
  }

  else if (command === "reportacademicoffense" || command === "reportacademicoffence"){
    if (args.length < 1) {
      message.channel.send("Invalid command. To report an academic offence use the following command: *" + prefix + "reportAcademicOffense Phil Swift, he stole my pencil*");
      return;
    }
    const newArgs = argsToString(args).split(",")
    const name = newArgs[0];
    const reason = newArgs[1];

    message.channel.send("Reporting in 3").then(m =>{
      setTimeout(() => {  m.edit("Reporting in 2"); }, 1000);
      setTimeout(() => {  m.edit("Reporting in 1"); }, 2000);
      setTimeout(() => {
        m.edit("Report Sent!");
        message.channel.send(" ```To: dean.engineering@utoronto.ca\nTitle: Academic Offense Report\nBody: An engineering student by the name " + name + " committed an academic offense.\nReason:" + reason + "\nTime stamp: " + Date.now() + "\nGmail Return Code: 200 (success)```");
      }, 3000);
    });
  }

  else if (command === "commands" || command === "command"){
    var embed = new Discord.MessageEmbed()
    .setAuthor(data.numberOfCommands + " Commands run since " + data.date)
    .setColor(color)
    message.channel.send(embed);
  }

  else if (command === "mock"){
    const channel = message.channel;
    channel.messages.fetch({ limit: 2 }).then(messages => {
    const letters = messages.last().content.toLowerCase().split("");
      var str = "";
      for (i = 0; i < letters.length; i++){
        const r = Math.floor(Math.random() * 2);
        if (r === 0){
          str += letters[i];
        }else{
          str += letters[i].toUpperCase();
        }
      }
      message.channel.send(str);
    })
    .catch(console.error);
  }

  else if (command === "69ball"){
    if (args.length < 1) {
      message.channel.send("You gotta ask a question dumbass");
      return;
    }
    const responses = ["Fuck yes!", "Of course", "mhmmm", "Yes ma'am", "YESSS!", "yea", "As I see it, yes", "Yup", "Yes, deffinitley", "Fuck no!", "Hello no!", "Of course not!", "no.", "Simply no", "Busy!", "Leave me alone", "Sorry, my uhh, server is slow", "I don't feel like responding tbh"]
    message.channel.send(responses[Math.floor(Math.random() * responses.length)]);
  }

  else if (command === "advice"){
    const url = "https://api.adviceslip.com/advice";
    https.get(url, function(response){
      response.on("data", function(data){
        try{
          message.channel.send(JSON.parse(data).slip.advice);
        }catch (error) {
          throw(error);
        }
      });
    });
  }

  else if (command === "affirm" || command === "affirmation"){
    const url = "https://www.affirmations.dev/";
    https.get(url, function(response){
      response.on("data", function(data){
        try {
          message.channel.send(JSON.parse(data).affirmation)
        } catch (error) {
          throw(error);
        }
      })
    })
  }

  else if (command === "flipcoin" || command === "flip" || command === "coin"){
    if (Math.floor(Math.random() * 6000) === 0){
      message.channel.send("I am not kidding, it landed on it's edge. Thats a 1 in 6000 chance!");
      return;
    }
    if (Math.floor(Math.random() * 2) === 0){
      message.channel.send("Heads");
      return;
    }
    message.channel.send("Tails");
  }

  else if (command === "rolldice" || command === "roll" || command === "dice"){
    message.channel.send("You rolled a " + (Math.floor(Math.random() * 6) + 1));
  }

  else if (command === "rand" || command === "random" || command === "randint"){
    let nums = getNumbers(argsToString(args))
    if (nums.length < 2) {
      message.channel.send(Math.floor(Math.random() * 10) + 1)
      return
    }
    min = Math.ceil(nums[0]);
    max = Math.floor(nums[1]);
    message.channel.send(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  else if (command === "timer" || command === "time" || command === "remind" || command === "reminder"){
    if (args.length < 1) {
      message.channel.send("Invalid command. To set a timer use the following command: *" + prefix + "timer 5 min*");
      return;
    }
    const input = processText(args[0])
    let time = parseInt(input[0][0]);
    let units;
    if (input[0].length === 1){
      units = args[1];
    }
    else if (input[0].length === 2){
      units = input[0][1];
    }
    const validMinUnits = ["m", "mn", "min", "mins", "minute", "minutes"];
    const validHourUnits = ["h", "hr", "hour", "hours"];
    const validSecUnits = ["s", "sc", "sec", "secs", "second", "seconds"];
    const reason = argsToString(args).replace(time, "").replace(units, "");
    if (isNaN(time) || time < 0 || (!validMinUnits.includes(units) && !validHourUnits.includes(units) && !validSecUnits.includes(units))) {
      message.channel.send("Invalid command. To set a timer use the following command: *" + prefix + "timer 5 min*");
      return;
    }
    if (validHourUnits.includes(units)){
      time = time * 3600000;
      message.channel.send("Timer set! I will DM you in " + parseInt(input[0][0]) + " hour(s)");
    }
    else if (validMinUnits.includes(units)){
      time = time * 60000;
      message.channel.send("Timer set! I will DM you in " + parseInt(input[0][0]) + " minute(s)");
    }else if (validSecUnits.includes(units)){
      time = time * 1000;
      message.channel.send("Timer set! I will DM you in " + parseInt(input[0][0]) + " seconds");
    }
    setTimeout(() => {
      var alert;
      if (reason.length > 2){
        alert = "<@" + message.author.id + "> Timer done!\nComment:" + reason
      }else{
        alert = "<@" + message.author.id + "> Timer done!"
      }
      message.channel.send(alert);
      message.author.send(alert);
    }, time);
  }

  else if (command === "stock" || command === "stocks"){
    if (args.length < 1) {
      message.channel.send("Invalid command. To see info about a security use the following command: *" + prefix + "stock TSLA*");
      return;
    }
    const url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + args[0] + "&apikey=" + process.env.ALPHAVANTAGEAPIKEY;
    https.get(url, function(response){
      response.on("data", function(data){
        try {
          const quote = JSON.parse(data)["Global Quote"];
          if (quote == null || Object.keys(quote).length == 0){
            message.channel.send("Invalid Ticker");
            return;
          }
          const quoteEmbed = new Discord.MessageEmbed()
          .setColor(color)
          .setTitle(quote["01. symbol"] + " (USD)")
          var string = "";
          for (const [key, value] of Object.entries(quote)) {
            string += key + " " + value + "\n";
          }
          quoteEmbed.setFooter(string);
          message.channel.send(quoteEmbed);
        } catch (error) {
          if (erorr){print(error)}
        }
      });
    });
  }

  else if (command === "rate" || command === "rates"){
    if (args.length < 1) {
      message.channel.send("Invalid command. To see an exchange rate use the following command: *" + prefix + "stock USD CAD*");
      return;
    }
    const url = "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=" + args[0] + "&to_currency=" + args[1] + "&apikey=" + process.env.ALPHAVANTAGEAPIKEY;
    https.get(url, function(response){
      response.on("data", function(data){
        try {
          const quote = Object.entries(JSON.parse(data)["Realtime Currency Exchange Rate"]);
          if (quote == null || quote.length == 0){
            message.channel.send("Invalid Currencies");
            return;
          }
          const quoteEmbed = new Discord.MessageEmbed()
          .setColor(color)
          .setAuthor(quote[4][1])
          message.channel.send(quoteEmbed);
        } catch (error) {
          message.channel.send("Invalid currencies")
        }
      });
    });
  }

  else if (command === "newlist" || command === "newlists" || command === "nl") {
    if (args.length < 1) {
      message.channel.send("Invalid command. To make a new list use the following command: *" + prefix + "newList work*");
      return;
    }
    const listName = argsToString(args);
    if (getList(user.lists, listName) != null) {
      message.channel.send("This list already exists");
      return;
    }
    const newList = {
      name: listName,
      items: []
    }
    user.lists.push(newList);
    user.selectedListName = listName;
    await user.save();
    message.channel.send("List Created: " + listName)
    message.channel.send("Open list: " +  listName);
  }

  else if (command === "deletelist" || command === "deletelists" || command === "dl") {
    if (args.length < 1) {
      message.channel.send("Invalid command. To delete a list use the following command: *" + prefix + "deleteList work*");
      return;
    }
    const listName = argsToString(args)
    const list = getList(user.lists, listName)
    if (list == null) {
      message.channel.send("This list does not exists");
      return;
    }
    if (user.selectedListName == list.name) {
      user.selectedListName = null;
    }
    const index = user.lists.indexOf(list);
    user.lists.splice(index, 1);
    await user.save();
    message.channel.send("List deleted: " + listName)
  }

  else if (command === "showlists" || command === "showlist" || command === "sl" || command === "lists") {
    if (user.lists.length === 0) {
      message.channel.send("You have no lists. To make a new list use the following command: *" + prefix + "newList work*");
      return;
    }
    const listsEmbed = new Discord.MessageEmbed()
  	.setColor(color)
    var string = "";
    for (i = 0; i < user.lists.length; i++) {
      var item = (i + 1) + ") " + user.lists[i].name + "\n";
      string += item;
    }
    listsEmbed.setFooter(string);
    message.channel.send(listsEmbed);
  }

  else if (command === "editlistname" || command === "editlistsname" || command === "editlistnames" || command === "editlistsnames"){
    if (user.lists.length === 0) {
      message.channel.send("You have no lists. To make a new list use the following command: *" + prefix + "newList work*");
      return;
    }
    if (args.length < 1) {
      message.channel.send("Invalid command. To edit a list name use the following command: *" + prefix + "editListName school*");
      return;
    }
    if (user.selectedListName == null) {
      message.channel.send("You have no list open. To open a list use the following command: *" + prefix + "open work*");
      return;
    }
    const oldListName = user.selectedListName;
    const newListName = argsToString(args);
    const list = getList(user.lists, user.selectedListName);
    list.name = newListName;
    user.selectedListName = newListName;
    await user.save();
    message.channel.send(oldListName + "edited to: " + newListName);
  }

  else if (command === "open" || command === "openlist" || command === "o") {
    if (args.length == 0){
      if (user.selectedListName == null) {
        message.channel.send("You have no list open. To open a list use the following command: *" + prefix + "open work* or make a new list using the following command: *" + prefix + "newList school*");
      } else {
        message.channel.send("Open list: " + user.selectedListName);
      }
      return;
    }
    const listName = argsToString(args);
    var list = null
    if (!isNaN(listName)){
      listIndex = parseInt(listName)
      if (listIndex < 1 || listIndex > user.lists.length){
        message.channel.send("You cannot open list number " + listIndex + " because there is only " + user.lists.length + " lists");
        return
      }
      list = user.lists[listIndex - 1]
    }else{
      list = getList(user.lists, listName)
    }
    if (list == null) {
      message.channel.send("This list does not exist");
      return;
    }
    user.selectedListName = list.name;
    await user.save();
    message.channel.send("Open list: " + user.selectedListName);
  }

  else if (command === "add" || command === "additem" || command === "additems" || command === "a") {
    if (args.length < 1) {
      message.channel.send("Invalid command. To add a new item use the following command: *" + prefix + "add file report*");
      return;
    }
    if (user.selectedListName == null) {
      message.channel.send("You have no list open. To open a list use the following command: *" + prefix + "open work*");
      return;
    }
    const list = getList(user.lists, user.selectedListName);
    var items = argsToString(args).split("/");
    for (i = 0; i < items.length; i++){
      items[i] = items[i].trim();
      const newItem = {
        name: items[i],
        checked: false
      }
      list.items.push(newItem);
    }
    message.channel.send(items.length + " item(s) added to list: " + user.selectedListName)
    await user.save();
  }

  else if (command === "delete" || command === "deleteitem" || command === "deleteitems" || command === "d") {
    if (args.length < 1) {
      message.channel.send("Invalid command. To delete an item use the following command: *" + prefix + "delete 3*");
      return;
    }
    if (user.selectedListName == null) {
      message.channel.send("You have no list open. To open a list use the following command: *" + prefix + "open work*");
      return;
    }
    const list = getList(user.lists, user.selectedListName);
    var itemNumber = argsToString(args).split(",");
    var itemsToDelete = [];
    for (i = 0; i < itemNumber.length; i++){
      const itemIndex = parseInt(itemNumber[i]);
      if (isNaN(itemIndex)){
        message.channel.send("Invalid command. To delete an item use the following command: *" + prefix + "delete 3*");
      }
      else if (itemIndex < 0 || itemIndex > list.items.length) {
        message.channel.send("You cannot delete item number " + itemIndex + " because there is only " + list.items.length + " items");
      }else{
        itemsToDelete.push(list.items[itemIndex - 1].name)
      }
    }
    for (i = 0; i < itemsToDelete.length; i ++){
      const index = findWithAttr(list.items, 'name', itemsToDelete[i]);
      if (index > -1) {
        list.items.splice(index, 1);
      }
    }
    message.channel.send(itemsToDelete.length + " item(s) deleted in list: " + list.name)
    await user.save();
  }

  else if (command === "edit" || command === "edititem" || command === "edititems" || command === "e"){
    if (args.length < 2) {
      message.channel.send("Invalid command. To edit an item use the following command: *" + prefix + "edit 3, buy paper*");
      return;
    }
    if (user.selectedListName == null) {
      message.channel.send("You have no list open. To open a list use the following command: *" + prefix + "open work*");
      return;
    }
    const newArgs = argsToString(args).split(",");
    if (!(newArgs.length === 2)){
      message.channel.send("Invalid command. To edit an item use the following command: *" + prefix + "edit 3, buy paper*");
      return;
    }
    const itemIndex = parseInt(newArgs[0]);
    const newItem = newArgs[1];
    const list = getList(user.lists, user.selectedListName);
    if (isNaN(itemIndex) || itemIndex < 0 || itemIndex > list.items.length) {
      message.channel.send("You cannot edit item number " + itemIndex + " because there is only " + list.items.length + " items");
      return;
    }
    list.items[itemIndex - 1].name = newItem.trim();
    await user.save();
    message.channel.send("item " + itemIndex + " edited to: " + list.items[itemIndex - 1].name)
  }

  else if (command === "check" || command === "checkitem" || command === "checkitems"){
    if (args.length < 1) {
      message.channel.send("Invalid command. To check off an item use the following command: *" + prefix + "check 3*");
      return;
    }
    if (user.selectedListName == null) {
      message.channel.send("You have no list open. To open a list use the following command: *" + prefix + "open work*");
      return;
    }
    const list = getList(user.lists, user.selectedListName)
    const itemIndex = parseInt(args[0]);
    if (isNaN(itemIndex) || itemIndex < 0 || itemIndex > list.items.length) {
      message.channel.send("You cannot check off item number " + itemIndex + " because there is only " + list.items.length + " items");
      return;
    }
    list.items[itemIndex - 1].checked = !list.items[itemIndex - 1].checked;
    list.items[itemIndex - 1].crossed = false;
    if (list.items[itemIndex - 1].checked){
      message.channel.send("item checked: " + list.items[itemIndex - 1].name + " ✅")
    }else{
      message.channel.send("item unchecked: " + list.items[itemIndex - 1].name)
    }
    await user.save();
  }

  else if (command === "cross" || command === "crossitem" || command === "crossitems"){
    if (args.length < 1) {
      message.channel.send("Invalid command. To cross off an item use the following command: *" + prefix + "cross 3*");
      return;
    }
    if (user.selectedListName == null) {
      message.channel.send("You have no list open. To open a list use the following command: *" + prefix + "open work*");
      return;
    }
    const list = getList(user.lists, user.selectedListName)
    const itemIndex = parseInt(args[0]);
    if (isNaN(itemIndex) || itemIndex < 0 || itemIndex > list.items.length) {
      message.channel.send("You cannot cross off item number " + itemIndex + " because there is only " + list.items.length + " items");
      return;
    }
    list.items[itemIndex - 1].crossed = !list.items[itemIndex - 1].crossed;
    list.items[itemIndex - 1].checked = false;
    if (list.items[itemIndex - 1].crossed){
      message.channel.send("item crossed: " + list.items[itemIndex - 1].name + " ❌")
    }else{
      message.channel.send("item uncrossed: " + list.items[itemIndex - 1].name)
    }
    await user.save();
  }

  else if (command === "show" || command === "showitem" || command === "showitems" || command === "s") {
    var list = null
    if (!isNaN(args[0])){
      let index = parseInt(args[0]) - 1
      if (index >= 0 && index < user.lists.length){
        list = user.lists[index]
      }else{
        message.channel.send("You cannot show list number " + index + " because there is only " + user.lists.length + " lists");
        return
      }
    }else{
      if (user.selectedListName == null) {
        message.channel.send("You have no list open. To open a list use the following command: *" + prefix + "open work*");
        return;
      }
      list = getList(user.lists, user.selectedListName)
    }
    if (list.items.length === 0) {
      message.channel.send("This list is empty. To add a new item use the following command: *" + prefix + "add file report*");
      return;
    }
    const itemsImbed = new Discord.MessageEmbed()
  	.setColor(color)
    .setTitle(list.name)
    var string = ""
    for (i = 0; i < list.items.length; i++) {
      if (list.items[i].checked){
        var item = (i + 1) + ")✅" + list.items[i].name + "\n";
      }
      else if (list.items[i].crossed){
        var item = (i + 1) + ")❌" + list.items[i].name + "\n";
      }
      else{
        var item = (i + 1) + ") " + list.items[i].name + "\n";
      }
      string += item;
    }
    itemsImbed.setFooter(string)
    message.channel.send(itemsImbed);
  }

  else if (command === "showall" || command === "all" || command === "sa") {
    if (user.lists.length === 0) {
      message.channel.send("You have no lists. To make a new list use the following command: *" + prefix + "newList work*");
      return;
    }
    const itemsImbed = new Discord.MessageEmbed()
  	.setColor(color)
    user.lists.forEach((list, j) => {
      var string = ""
      list.items.forEach((item, i) => {
        if (item.checked){
          var item = (i + 1) + ")✅" + item.name + "\n";
        }
        else if (list.items[i].crossed){
          var item = (i + 1) + ")❌" + item.name + "\n";
        }
        else{
          var item = (i + 1) + ") " + item.name + "\n";
        }
        string += item;
      });
      itemsImbed.addField(list.name, string, true)
    });
    message.channel.send(itemsImbed);
  }

  else if (command === "randitem" || command === "randitems" || command === "ri"){
    if (user.selectedListName == null) {
      message.channel.send("You have no list open. To open a list use the following command: *" + prefix + "open work*");
      return;
    }
    const list = getList(user.lists, user.selectedListName)
    if (list.items.length === 0) {
      message.channel.send("This list is empty. To add a new item use the following command: *" + prefix + "add file report*");
      return;
    }
    const r = Math.floor(Math.random() * list.items.length);
    message.channel.send(list.items[r].name);
  }

  else if (command === "clear" || command === "clearlist" || command === "clearitem" || command === "clearitems") {
    const list = getList(user.lists, user.selectedListName)
    list.items = [];
    await user.save();
    message.channel.send("List cleared: " + list.name);
  }

  else if (command === "share"){
    message.channel.send("https://discordapp.com/oauth2/authorize?client_id=758800454905233429&scope=bot&permissions=511040");
  }

  else if (command === "feedback"){
    if (args.length < 1) {
      message.channel.send("Invalid command. To send feedback use the following command: *" + prefix + "feedback your bot sucks*");
      return;
    }
    const duckie = await User.findOne({'id': "322237285548556289"}).exec();
    const feedbackList = getList(duckie.lists, "feedback ");
    const feedback = {
      name: argsToString(args),
      checked: false
    }
    feedbackList.items.push(feedback);
    await duckie.save();
    message.channel.send("Your feedback was added to the my owners feedback list. Thanks for the feedback!");
  }

  else if (command === "tip"){
    const tipEmbed = new Discord.MessageEmbed()
    .setColor(color)
    .setTitle("Your support keeps me coding! Thank you! :)")
    .addFields({name: "BTC", value: "1Dz51YMYbSzzirCquVHN1pehdq1kfpmR2u"}, {name: "ETH", value: "0xd611b300DaA2472862AecE56B5A02e9D45159817"}, {name: "XRP", value: "rsYX6gyfACYvGW8pDNJmnGezXacrH5vmmv"}, {name: "LTC", value: "LgnqQwS5UxTWCm8ncgPGh4XU6cgnFjAmo5"})
    message.channel.send(tipEmbed)
  }

  else if (command === "ping"){
    message.channel.send("Pinging...").then(m =>{
      var ping = m.createdTimestamp - message.createdTimestamp;
      var embed = new Discord.MessageEmbed()
      .setAuthor(`Your ping is ${ping}ms`)
      .setColor(color)
      m.edit(embed)
    });
  }

  else if (command === "storage"){
    User.collection.stats(function(err, results) {
      const p = Number.parseFloat(((results.storageSize/1000)/512000) * 100).toPrecision(3);
      message.channel.send( p + "% used of total storage")
    });
  }

  else if (command === "help"){
    let pageNumber = 1;
    const maxPages = 3;
    const fields = [[{ name: '-newList [LIST NAME]', value: 'Makes a new list'},
    { name: '-deleteList [LIST NAME]', value: 'Deletes a list'},
    { name: '-showLists', value: 'Shows all lists'},
    { name: '-showAll', value: 'Shows all items in all lists'},
    { name: '-open [LIST NAME]', value: 'Opens a list'},
    { name: '-open', value: 'Shows open list'},
    { name: '-editListName [NEW NAME]', value: 'Edits name of open list'},
    { name: '-add [ITEM 1/ ITEM 2/ ...]', value: 'Adds item(s) to open list'},
    { name: '-delete [ITEM #, ITEM #, ...]', value: 'Deletes item(s) from open list'},
    { name: '-edit [ITEM NUMBER, NEW ITEM]', value: 'Edits an item'},
    { name: '-check [ITEM NUMBER]', value: 'Check off an item or uncheck a checked item'},
    { name: '-cross [ITEM NUMBER]', value: 'Crosses off an item or uncrosses a crossed item'},
    { name: '-show', value: 'Shows all items in open list'},
    { name: '-clear', value: 'Deletes all items in open list'},
    { name: '-randItem', value: 'Chooses a random item in open list'}],
    [{ name: '-timer [AMOUNT] ["s", "m", OR "h"] [OPTIONAL COMMENT]', value: 'Creates a timer that will ping you'},
    { name: '-image [QUERY]', value: 'Searches google images and sends an image'},
    { name: '-stock [TICKER SYMBOL]', value: 'Get info about a security'},
    { name: '-rate [FROM CURRENCY] [TO CURRENCY]', value: 'Gets exchange rate. Works for crypto too!'},
    { name: '-advice', value: 'Get some advice'},
    { name: '-affirm', value: 'Get a friendly affirmation'},
    { name: '-mock', value: 'Mocks the previous message'},
    { name: '-69ball [YOUR QUESTION]', value: '8 ball but better'},
    { name: '-flipCoin', value: 'Flips a coin'},
    { name: '-rollDice', value: 'Rolls a dice'},
    { name: '-random [MIN]-[MAX]', value: 'Returns a random number. Min and max inclusive'},
    { name: '-reportAcademicOffense [NAME OF OFFENDER], [REASON]', value: 'Reports academic offence to the dean'}],
    [{ name: '-share', value: 'Shows invite link'},
    { name: '-feedback [YOUR FEEDBACK]', value: 'Found a bug, have an idea suggestion or feedback?'},
    { name: '-tip', value: 'Support the dev :)'},
    { name: '-ping', value: 'Shows ping'},
    { name: '-storage', value: 'Shows percentage of storage used in db'},
    { name: '-commands', value: 'Shows total number of commands run'}]]

    const helpEmbed = new Discord.MessageEmbed()
    .setColor(color)
    .setTitle("Todo List Commands")
    .setFooter('© Skool Bot | By Majd Hailat', client.user.avatarURL());

    helpEmbed.fields = fields[pageNumber - 1]

    message.channel.send(helpEmbed).then(msg =>{
      msg.react('◀️').then( r => {
        msg.react('▶️');
        const backwardFilter = (reaction, user) => reaction.emoji.name === '◀️' && user.id === message.author.id;
        const forwardsFiler = (reaction, user) => reaction.emoji.name === '▶️' && user.id === message.author.id;

        const backwards = msg.createReactionCollector(backwardFilter, {time: 0});
        const forwards = msg.createReactionCollector(forwardsFiler, {time: 0});

        backwards.on('collect', r =>{
          if (pageNumber === 1) return;
          pageNumber --;
          setepEmbed()
        });

        forwards.on('collect', r =>{
          if (pageNumber === maxPages) return;
          pageNumber ++;
          setepEmbed()
        });

        function setepEmbed(){
          if (pageNumber === 1){
            helpEmbed.setTitle("Todo List Commands")
          }
          else if (pageNumber === 2){
            helpEmbed.setTitle("Utility Commands")
          }
          else if (pageNumber === 3){
            helpEmbed.setTitle("Other Commands")
          }else{
            helpEmbed.setTitle("")
          }

          helpEmbed.fields = fields[pageNumber - 1]
          msg.edit(helpEmbed);
        }

      });
    });
  }
  else {
    message.channel.send("Invalid command use " + prefix + "help for help");
  }
});

function getList(lists, name){
  var list = lists.filter(list => {
    return list.name.toLowerCase() === name.toLowerCase()
  })
  if (list.length >= 1){
    return list[0];
  }else{
    return null;
  }
}

function argsToString(array) {
  var string = "";
  for (i = 0; i < array.length; i++) {
    string += array[i] + " ";
  }
  return string;
}

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

function processText(inputText) {
    var output = [];
    var json = inputText.split(' ');
    json.forEach(function (item) {
        output.push(item.replace(/\'/g, '').split(/(\d+)/).filter(Boolean));
    });
    return output;
}

function getNumbers(inputText) {
  let chars = inputText.toLowerCase().split('');
  var numbers = []
  var currentNumber = ""
  for (var i = 0; i < chars.length; i++){
    let item = chars[i]
    if ((!isNaN(item) || (!currentNumber.includes(".") && item === ".") || (currentNumber.length === 0 && item === "-"))&& item != " "){
      currentNumber += item
    }
    else{
      if (currentNumber.length != 0){
        if (!isNaN(currentNumber)){
          numbers.push(parseInt(currentNumber))
        }
      }
      currentNumber = ""
    }
    if (item === "e"){
      numbers.push(Math.E);
    }
    else if (item === "p"){
      if (chars[i + 1] === "i"){
        numbers.push(Math.PI)
      }
    }
    if (i == chars.length - 1 && currentNumber.length != 0){
      if (!isNaN(currentNumber)){
        numbers.push(parseInt(currentNumber))
      }
    }
  }
  return numbers
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
async function getImage(query, callback){
  var urls = null
  var options = {
      url: "http://results.dogpile.com/serp?qc=images&q=" + query,
      method: "GET",
      headers: {
         "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:77.0) Gecko/20100101 Firefox/77.0",
         "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
         "Accept-Language": "en-US,en;q=0.5",
         "Referer": "https://www.google.com/",
         "DNT": "1",
         "Connection": "keep-alive",
         "Upgrade-Insecure-Requests": "1"
     }
  };
  request(options, function(error, response, responseBody) {
      if (error) {
          return;
      }
      $ = cheerio.load(responseBody);
      var links = $(".image a.link");
      urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
      if (!urls.length) {
          return;
      }
      callback(urls[Math.floor(Math.random() * urls.length) + 1])
  });
}

function rhodes(callback, numOfTimes){
  console.log(numOfTimes)
  let query = ""
  const r = Math.floor(Math.random() * 11)//0-4
  if (r == 0){
    query = "lana rhodes gif"
  }
  else if (r == 1){
    query = "naked lana rhodes gif"
  }
  else if (r == 2){
    query = "lana rhodes nude gif"
  }
  else if (r == 3){
    query = "hot lana rhodes gif"
  }
  else if (r == 4){
    query = "lana rhodes boobs gif"
  }
  else if (r == 5){
    query = "lana rhodes hot gif"
  }
  else if (r == 6){
    query = "lana rhodes porn gif"
  }
  else if (r == 7){
    query = "porn gif"
  }
  else if (r == 8){
    query = "sex gif"
  }
  else if (r == 9){
    query = "lana rhodes sex gif"
  }
  else if (r == 10){
    query = "boob reveal gif"
  }

  getImage(query, callback)
  if (numOfTimes > 1){
    setTimeout(() => {
      rhodes(callback, numOfTimes - 1)
    }, 1200);
  }else{
    count = 0
  }
}
