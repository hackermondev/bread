const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  name: 'chatbot',
  topic: 'fun',
  description: 'Talk to a chatbot',
  run: async (client, message)=>{
    var content = message.content.replace(message.content.split(' ')[0], '').replace(' ','')

    if(content == ''){
      return message.channel.send('the correct one to use this command is bread!chatbot <message>')
    }

    message.channel.startTyping()
    var b = await fetch(`https://some-random-api.ml/chatbot?message=${encodeURIComponent(content)}`)

    var r = await b.json()

    if(r.response == undefined){
      console.log(r)
      message.channel.stopTyping()
      return message.channel.send(`oops something happened. report this to us`)
    }

    message.channel.stopTyping()
    return message.channel.send(r.response)
  }
}