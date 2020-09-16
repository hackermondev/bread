const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  name: 'memes',
  topic: 'fun',
  description: 'Get a random meme from reddit',
  run: async (client, message)=>{

    message.channel.startTyping()
    var b = await fetch(`https://meme-api.herokuapp.com/gimme/1`)

    var r = await b.json()

    if(r.memes == undefined){
      console.log(r)
      message.channel.stopTyping()
      return message.channel.send(`oops something happened. report this to us`)
    }
    
    var info = r.memes[0]

    if(info.nsfw && message.channel.nsfw == false){
      message.channel.stopTyping()
      return message.channel.send(`we accidently generated a nsfw image, sorry about that. please use the command again and lets hope we get a better image!`)
    }
    var e = new Discord.MessageEmbed()
    e.setTitle(info.title)
    e.setImage(info.url)
    e.setURL(info.postLink)
    e.setColor(client.defaultColor)

    message.channel.stopTyping()
    return message.channel.send(e)
  }
}