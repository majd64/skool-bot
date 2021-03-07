const cheerio = require('cheerio');
const request = require('request');

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

module.exports = {getList, argsToString, findWithAttr, processText, getNumbers, getRandomColor, getImage};
