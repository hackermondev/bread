module.exports = {
  name: 'ping',
  topic: 'info',
  description: 'How long does it take for the bot to send a message?',
  run: (client, message)=>{
    var ms = 0

    var emojis = ['<:RainbowDumb:743879953594187929>', '<:shooter:743879956706099252>', '<:5870_open_eye_crying_laughing:743879956307902556>']

    var e = emojis[Math.floor(Math.random() * emojis.length)]

    var i = setInterval(()=>{
      ms++
    }, 01)
    message.channel.send(`Pong! **Calculating time**`).then((m)=>{
      clearInterval(i)
      m.edit(`Pong! \`${ms}ms\` ${e}`)
    })
  }
}