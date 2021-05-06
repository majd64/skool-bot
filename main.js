const Discord = require('discord.js');
const mongoose = require("mongoose");
require('custom-env').env('staging');
const util = require("./util");
let models = require("./models");
const https = require('https');
const math = require("mathjs");

mongoose.connect("mongodb+srv://admin:" + process.env.ATLASPASSWORD + "@cluster0.xpbd4.mongodb.net/" + process.env.ATLASUSER, {useNewUrlParser: true, useUnifiedTopology: true});

const client = new Discord.Client();
client.login(process.env.LOGIN);
client.once('ready', () => {
// client.user.setUsername("Mystery engineer 2020");
// client.user.setAvatar("https://i.imgur.com/tQ7foyc.png");
console.log("Skule Bot is Running")
});

const prefix = "-";

client.on ('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.id === "758800454905233429") return

  const color = util.getRandomColor();
  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  var user = await models.User.findOne({'id': message.author.id}).exec();
  if (user == null){
    const newUser = new models.User({
      id: message.author.id,
      selectedListName: null,
      lists: []
    });
    user = newUser;
  }

  function pingDana(){
    client.channels.cache.get("713243060611317790").send("send nudes")

  }

  var data = await models.Data.findOne({}).exec();
  data.numberOfCommands += 1;
  data.save();

  //---
  if (message.guild && message.guild.id === "787346072049418329"){//for that person
    user = await models.User.findOne({'id': "474380232468463646"}).exec();
  }
  //---

  if (command === "image" || command === "images" || command === "img"){
    util.getImage(util.argsToString(args), url => {
      message.channel.send(url)
    })
  }

  else if (command === "dana"){
    setInterval( pingDana , 10000 )
  }

  else if (command === "reportacademicoffense" || command === "reportacademicoffence"){
    if (args.length < 1) {
      message.channel.send("Invalid command. To report an academic offence use the following command: *" + prefix + "reportAcademicOffense Phil Swift, he stole my pencil*");
      return;
    }
    const newArgs = util.argsToString(args).split(",")
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

  else if (command === "math" || command === "maths" || command === "eval" || command === "evaluate" || command === "compute"){
    try{
      const res = math.evaluate(util.argsToString(args));
      message.channel.send(res);
    }catch(error){
      message.channel.send(error.message);
    }
  }

  else if (command === "69ball"){
    if (args.length < 1) {
      message.channel.send("You gotta ask a question dumbass");
      return;
    }
    const responses = ["Fuck yes!", "Of course", "mhmmm", "Yes ma'am", "YESSS!", "yea", "As I see it, yes", "Yup", "Yes, deffinitley", "Fuck no!", "Hello no!", "Of course not!", "no.", "Simply no", "Busy!", "Leave me alone", "Sorry, my uhh, server is slow", "I don't feel like responding tbh"]
    message.channel.send(responses[Math.floor(Math.random() * responses.length)]);
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
    let nums = util.getNumbers(util.argsToString(args))
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
    const input = util.processText(args[0])
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
    const reason = util.argsToString(args).replace(time, "").replace(units, "");
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
    const listName = util.argsToString(args);
    if (util.getList(user.lists, listName) != null) {
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
    var list = null;
    if (!isNaN(args[0])){
      let index = parseInt(args[0]) - 1
      if (index >= 0 && index < user.lists.length){
        list = user.lists[index]
      }else{
        message.channel.send("You cannot delete number " + (index + 1) + " because there is only " + user.lists.length + " lists");
        return
      }
    }else{
      list = util.getList(user.lists, util.argsToString(args))
      if (list == null) {
        message.channel.send("This list does not exists");
        return;
      }
    }
    if (user.selectedListName == list.name) {
      user.selectedListName = null;
    }
    const index = user.lists.indexOf(list);
    user.lists.splice(index, 1);
    await user.save();
    message.channel.send("List deleted: " + list.name)
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

  else if (command === "el" || command === "editlist" || command === "editlists" || command === "editlistname" || command === "editlistsname" || command === "editlistnames" || command === "editlistsnames"){
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
    const newListName = util.argsToString(args);
    const list = util.getList(user.lists, user.selectedListName);
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
    const listName = util.argsToString(args);
    var list = null
    if (!isNaN(listName)){
      listIndex = parseInt(listName)
      if (listIndex < 1 || listIndex > user.lists.length){
        message.channel.send("You cannot open list number " + (listIndex + 1) + " because there is only " + user.lists.length + " lists");
        return
      }
      list = user.lists[listIndex - 1]
    }else{
      list = util.getList(user.lists, listName)
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
    const list = util.getList(user.lists, user.selectedListName);
    var items = util.argsToString(args).split("/");
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
    const list = util.getList(user.lists, user.selectedListName);
    var itemNumber = util.argsToString(args).split(",");
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
      const index = util.findWithAttr(list.items, 'name', itemsToDelete[i]);
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
    const newArgs = util.argsToString(args).split(",");
    if (!(newArgs.length === 2)){
      message.channel.send("Invalid command. To edit an item use the following command: *" + prefix + "edit 3, buy paper*");
      return;
    }
    const itemIndex = parseInt(newArgs[0]);
    const newItem = newArgs[1];
    const list = util.getList(user.lists, user.selectedListName);
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
    const list = util.getList(user.lists, user.selectedListName)
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
    const list = util.getList(user.lists, user.selectedListName)
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
        message.channel.send("You cannot show list number " + (index + 1) + " because there is only " + user.lists.length + " lists");
        return
      }
    }else{
      if (user.selectedListName == null) {
        message.channel.send("You have no list open. To open a list use the following command: *" + prefix + "open work*");
        return;
      }
      list = util.getList(user.lists, user.selectedListName)
    }
    if (list.items.length === 0) {
      message.channel.send("This list is empty. To add a new item use the following command: *" + prefix + "add file report*");
      return;
    }
    const listNumber = user.lists.indexOf(list) + 1;
    const itemsImbed = new Discord.MessageEmbed()
  	.setColor(color)
    .setTitle(`[${listNumber}] ${list.name}`)
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
    var itemsImbed = new Discord.MessageEmbed()
  	.setColor(color)
    user.lists.forEach((list, j) => {
      var string = ""
      if (list.items.length == 0){
        string = "--"
      }
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
      itemsImbed.addField(`[${j + 1}] ${list.name}`, string + "\n", true);
      if(itemsImbed.fields.length === 25){
        message.channel.send(itemsImbed);
        itemsImbed = new Discord.MessageEmbed()
        .setColor(color);
      }
    });
    message.channel.send(itemsImbed);
  }

  else if (command === "randitem" || command === "randitems" || command === "ri"){
    if (user.selectedListName == null) {
      message.channel.send("You have no list open. To open a list use the following command: *" + prefix + "open work*");
      return;
    }
    const list = util.getList(user.lists, user.selectedListName)
    if (list.items.length === 0) {
      message.channel.send("This list is empty. To add a new item use the following command: *" + prefix + "add file report*");
      return;
    }
    const r = Math.floor(Math.random() * list.items.length);
    message.channel.send(list.items[r].name);
  }

  else if (command === "clear" || command === "clearlist" || command === "clearitem" || command === "clearitems") {
    const list = util.getList(user.lists, user.selectedListName)
    list.items = [];
    await user.save();
    message.channel.send("List cleared: " + list.name);
  }

  else if (command === "share" || command == "invite"){
    message.channel.send("https://discordapp.com/oauth2/authorize?client_id=758800454905233429&scope=bot&permissions=511040");
  }

  else if (command === "swaplist" || command === 'swaplists' || command === "sl" || command === "switchlist" || command === "switchlists" || command === "switch" || command === "swap"){
    const listNums = util.getNumbers(util.argsToString(args))
    if (listNums.length >= 2){
      if (listNums[0] < 1 || listNums[0] > user.lists.length || listNums[1] < 1 || listNums[1] > user.lists.length){
        message.channel.send("You cannot swap list numbers " + listNums[0] + " and " + listNums[1] + " because there is only " + user.lists.length + " lists");
      }else{
        try{
          const list1 = JSON.parse(JSON.stringify(user.lists[listNums[0] - 1]));
          const list2 = JSON.parse(JSON.stringify(user.lists[listNums[1] - 1]));

          user.lists[listNums[0] - 1] = list2;
          user.lists[listNums[1] - 1] = list1;
          await user.save();
          message.channel.send ("Swapped lists")
        }catch(err){
          message.channel.send("Invalid command. To swap lists use the following command: *" + prefix + "swapLists 3 5*");
        }
      }
    }else{
      message.channel.send("Invalid command. To swap lists use the following command: *" + prefix + "swapLists 3 5*");
    }
  }

  else if (command === "feedback"){
    if (args.length < 1) {
      message.channel.send("Invalid command. To send feedback use the following command: *" + prefix + "feedback your bot sucks*");
      return;
    }
    const duckie = await User.findOne({'id': "322237285548556289"}).exec();
    const feedbackList = util.getList(duckie.lists, "feedback ");
    const feedback = {
      name: util.argsToString(args),
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
    .addFields({name: "BTC", value: "1Dz51YMYbSzzirCquVHN1pehdq1kfpmR2u"}, {name: "ETH", value: "0xd611b300DaA2472862AecE56B5A02e9D45159817"}, {name: "LTC", value: "LgnqQwS5UxTWCm8ncgPGh4XU6cgnFjAmo5"})
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

  else if (command === "help"){
    let pageNumber = 1;
    const maxPages = 5;
    const fields = [[{ name: '-newList [LIST NAME]', value: 'Makes a new list', inline: false},
    { name: '-deleteList [LIST NAME or LIST #]', value: 'Deletes a list', inline: false},
    { name: '-showLists', value: 'Shows all lists', inline: false},
    { name: '-open [LIST NAME or LIST #]', value: 'Opens a list', inline: false},
    { name: '-open', value: 'Shows open list', inline: false},
    { name: '-add [ITEM 1/ ITEM 2/ ...]', value: 'Adds item(s) to open list', inline: false},
    { name: '-delete [ITEM #, ITEM #, ...]', value: 'Deletes item(s) from open list', inline: false},
    { name: '-show', value: 'Shows all items in open list', inline: false}],
    [{ name: '-showAll', value: 'shows all lists & all items', inline: false},
    { name: '-editList [NEW NAME]', value: 'Edits name of open list', inline: false},
    { name: '-edit [ITEM NUMBER, NEW ITEM]', value: 'Edits an item', inline: false},
    { name: '-check [ITEM NUMBER]', value: 'Check or unchecks an item', inline: false},
    { name: '-cross [ITEM NUMBER]', value: 'Crosses or uncrosses an item', inline: false},
    { name: '-clear', value: 'Deletes all items in open list', inline: false},
    { name: '-swap [LIST #] [LIST #]', value: 'Swaps the position of 2 lists', inline: false},
    { name: '-randItem', value: 'Chooses a random item in open list', inline: false}],
    [{ name: '-timer [AMOUNT] ["s", "m", OR "h"] [OPTIONAL COMMENT]', value: 'Creates a timer that will ping you', inline: false},
    { name: '-image [QUERY]', value: 'Searches google images and sends an image', inline: false},
    { name: '-eval [MATH EXPRESSION]', value: 'Evaluates a math expression', inline: false},
    { name: '-stock [TICKER SYMBOL]', value: 'Get info about a security', inline: false},
    { name: '-rate [FROM CURRENCY] [TO CURRENCY]', value: 'Gets exchange rate. Works for crypto too!', inline: false},
    { name: '-mock', value: 'Mocks the previous message', inline: false},
    { name: '-69ball [YOUR QUESTION]', value: '8 ball but better', inline: false}],
    [{ name: '-affirm', value: 'Get a friendly affirmation', inline: false},
    { name: '-flipCoin', value: 'Flips a coin', inline: false},
    { name: '-rollDice', value: 'Rolls a dice', inline: false},
    { name: '-random [MIN]-[MAX]', value: 'Returns a random number. Min and max inclusive', inline: false},
    { name: '-reportAcademicOffense [NAME OF OFFENDER], [REASON]', value: 'Reports academic offence to the dean', inline: false}],
    [{ name: '-share', value: 'Shows invite link', inline: false},
    { name: '-feedback [YOUR FEEDBACK]', value: 'Found a bug, have an idea suggestion or feedback?', inline: false},
    { name: '-tip', value: 'Support the dev :)', inline: false},
    { name: '-ping', value: 'Shows ping', inline: false},
    { name: '-commands', value: 'Shows total number of commands run', inline: false}]]

    const helpEmbed = new Discord.MessageEmbed()
    .setColor(color)
    .setTitle("Todo List Commands 1/5")
    .setFooter('Skool Bot is not case sensetive\n© Skool Bot | By Majd Hailat', client.user.avatarURL());

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
          if (pageNumber === 1 || pageNumber === 2){
            helpEmbed.setTitle(`Todo List Commands ${pageNumber}/${maxPages}`)
          }
          else if (pageNumber === 3 || pageNumber == 4){
            helpEmbed.setTitle(`Utility Commands ${pageNumber}/${maxPages}`)
          }
          else if (pageNumber === 5){
            helpEmbed.setTitle(`Other Commands ${pageNumber}/${maxPages}`)
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
