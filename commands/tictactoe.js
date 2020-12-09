const Discord = require('discord.js')

module.exports = {
  name: 'tictactoe',
  topic: null,
  description: 'Challenge someone to a Tick Tac Toe game!',
  run: (client, message) => {

    var user = message.content.split(' ')[1]
    if (!user) {
      return message.channel.send('ping someone to challenge')
    }

    user = user.replace('<@', '').replace('>', '').replace('!', '')

    var u = message.guild.member(user)

    if (!u) {
      return message.channel.send('invalid user')
    }
    

    if(client.users.cache.get(u.id).bot){
      return message.channel.send('you cannot challenge a bot')
    }

    // if(u.id == message.author.id){
    //   return message.channel.send('you cannot challenge yourself')
    // }

    message.channel.send(`<@${u.id}>, ${message.author.tag} has challenged you to a Tic Tac Toe game! Say \`accept\` to accept and anything else to not.`)

    message.channel.awaitMessages(m => m.author.id == u.id, {
      max: 1,
      time: 120000,
      errors: ['time']
    }).catch((err) => {
      message.channel.send(`<@${u.id}>, You were too slow to respond. A Tic Tac Toe game has not started.`)
    })
      .then(async (c) => {
        if(c == undefined){
          return
        }
        
        var c = c.first()

        if(c.content.toLowerCase() == 'accept'){
          var a = []

          for(i = 0; i < 16; i++){
            a.push('none')
          }

          var d = ``

          a.forEach((e, i)=>{

            if(i == 4 || i == 9 || i == 12){
              d += `| **${e}**\n`
            }else{
              d += `| **${e}** `
            }
            
          })

          var e = new Discord.MessageEmbed()
          e.setDescription(d)
          
          message.channel.send(e)
        }else{
          message.channel.send(`<@${message.author.id}>, <@${u.id}> declined your request to play. What a baby...`)
        }
      })
  }
}