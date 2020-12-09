const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  name: 'memes',
  topic: 'fun',
  description: 'Get a random meme from reddit',
  run: async (client, message)=>{

    message.channel.startTyping()
    var b = await fetch(`https://meme-api.herokuapp.com/gimme/1`).catch((err)=>{
      return message.channel.send(client.errors.customError(`Looks like the API is down right now, please try again later or contact us on the [support server](https://discord.gg/EzecfUX).`))
    })

    var r = await b.json().catch((err)=>{
      return message.channel.send(client.errors.customError(`Looks like the API is down right now, please try again later or contact us on the [support server](https://discord.gg/EzecfUX).`))
    })

    if(r.memes == undefined){
      console.log(r)
      message.channel.stopTyping()
      return message.channel.send(client.errors.customError(`Looks like the API is down right now, please try again later or contact us on the [support server](https://discord.gg/EzecfUX).`))
    }
    
    var info = r.memes[0]

    if(info.nsfw && message.channel.nsfw == false){
      message.channel.stopTyping()
      return message.channel.send(client.errors.customError(`Oops, something bad happened. Please use the command again.`))
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