const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  name: 'lyrics',
  topic: 'fun',
  description: 'Get lyrics for a song',
  run: async (client, message)=>{
    var content = message.content.replace(message.content.split(' ')[0], '').replace(' ','')

    if(content == ''){
      return message.channel.send(client.errors.customError(`How am I supposed to find the lyrics of a song that doesn't exists?`))
    }

    message.channel.startTyping()
    var b = await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(content)}`).catch((err)=>{
      return message.channel.send(client.errors.customError(`Looks like the API is down right now, please try again later or contact us on the [support server](https://discord.gg/EzecfUX).`))
    })

    var r = await b.json().catch((err)=>{
      return message.channel.send(client.errors.customError(`Looks like the API is down right now, please try again later or contact us on the [support server](https://discord.gg/EzecfUX).`))
    })

    if(r.lyrics == undefined){
      console.log(r)
      message.channel.stopTyping()
      return message.channel.send(client.errors.customError(`Looks like the API is down right now, please try again later or contact us on the [support server](https://discord.gg/EzecfUX).`))
    }

    if(r.lyrics.length > 2000){
      r.lyrics = `${r.lyrics.slice(0, 1997)}...`
    }

    message.channel.stopTyping()
    return message.channel.send(r.lyrics)
  }
}