const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  name: 'lyrics',
  topic: 'fun',
  description: 'Get lyrics for a song',
  run: async (client, message)=>{
    var content = message.content.replace(message.content.split(' ')[0], '').replace(' ','')

    if(content == ''){
      return message.channel.send('the correct way to use this command is bread!lyrics <song>')
    }

    message.channel.startTyping()
    var b = await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(content)}`)

    var r = await b.json()

    if(r.lyrics == undefined){
      console.log(r)
      message.channel.stopTyping()
      return message.channel.send(`oops something happened. report this to us`)
    }

    if(r.lyrics.length > 2000){
      message.channel.stopTyping()
      return message.channel.send('the song is too long to be posted here.')
    }
    message.channel.stopTyping()
    return message.channel.send(r.lyrics)
  }
}