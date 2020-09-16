module.exports = {
  name: 'ping',
  topic: 'info',
  description: 'How long does it take for the bot to send a message?',
  run: (client, message)=>{
    var ms = 0

    var i = setInterval(()=>{
      ms++
    }, 01)
    message.channel.send(`Pong! **Calculating time**`).then((m)=>{
      clearInterval(i)
      m.edit(`Pong! \`${ms}ms\` `)
    })
  }
}