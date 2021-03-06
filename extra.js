// var forceKillImages = false;

// function repeatImages(callback, numOfTimes, query){
//   if (forceKillImages){
//     numOfTimes = 0
//     forceKillImages = false
//   }
//   util.getImage(query, callback)
//   if (numOfTimes > 1){
//     setTimeout(() => {
//       repeatImages(callback, numOfTimes - 1, query)
//     }, 1350);
//   }
// }
//
// else if (command == "killimages"){
//   forceKillImages = true
//   message.channel.send("stopping images...")
//   setTimeout(() => {
//     forceKillImages = false
//   }, 3000);
// }
//
// if (command === "image" || command === "images" || command === "img"){
//   if (!isNaN(args[0])){
//     let numOfTimes = args[0]
//     if (numOfTimes > 300){
//       message.channel.send("You cannot request more than 300 images at a time.")
//       return
//     }
//     args.splice(0,1)
//     repeatImages((url) => {
//       message.channel.send(url)
//     }, numOfTimes, util.argsToString(args))
//   }else{
//     util.getImage(util.argsToString(args), url => {
//       message.channel.send(url)
//     })
//   }
// }

// else if (command === "advice"){
//   const url = "https://api.adviceslip.com/advice";
//   https.get(url, function(response){
//     response.on("data", function(data){
//       try{
//         message.channel.send(JSON.parse(data).slip.advice);
//       }catch (error) {
//         throw(error);
//       }
//     });
//   });
// }

// else if (command === "storage"){
//   User.collection.stats(function(err, results) {
//     const p = Number.parseFloat(((results.storageSize/1000)/512000) * 100).toPrecision(3);
//     message.channel.send( p + "% used of total storage")
//   });
// }
