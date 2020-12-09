module.exports = {
  name: 'rps',
  topic: 'games',
  description: 'Challenge someone to a ROCK PAPER SCISSOR game!',
  run: (client, message) => {

    if(client.rps[message.author.id]){
      return message.channel.send(client.errors.customError('You can\'t be in two RPS games.'))
    }

    var user = message.content.split(' ')[1]
    if (!user) {
      return message.channel.send(client.errors.customError('Please mention someone to challenge.'))
    }

    user = user.replace('<@', '').replace('>', '').replace('!', '')

    var u = message.guild.member(user)

    if (!u) {
      return message.channel.send(client.errors.userNotFound())
    }
    
    if(client.rps[u.id]){
      return message.channel.send(client.errors.customError(`${u.displayName} is already in a rps game`))
    }

    if(client.users.cache.get(u.id).bot){
      return message.channel.send(client.error.userNotFound())
    }

    if(u.id == message.author.id){
      return message.channel.send(client.error.userNotFound())
    }

    message.channel.send(`<@${u.id}>, ${message.author.tag} has challenged you to a RPS game! Say \`accept\` to accept and anything else to not.`)

    message.channel.awaitMessages(m => m.author.id == u.id, {
      max: 1,
      time: 120000,
      errors: ['time']
    }).catch((err) => {
      message.channel.send(`<@${u.id}>, You were too slow to respond. An RPS game has not started.`)
    })
      .then(async (c) => {
        if(c == undefined){
          return
        }
        
        var c = c.first()

        if(c.content.toLowerCase() == 'accept'){
          message.channel.send(`<@${message.author.id}>, <@${u.id}> has accepted the request. Please send your choice in the DM that was just sent to you!`)

          client.rps[message.author.id] = ''
          client.rps[c.author.id] = ''

          message.author.send(`Please choose a choice for the RPS game. Rock, Paper, or Scissors.`)

          c.author.send(`Please choose a choice for the RPS game. Rock, Paper, or Scissors.`)
          
          var w = setTimeout(()=>{
            if(client.rps[message.author.id] == '' && client.rps[c.author.id] == ''){
              message.channel.send(`No one responded in my DM in time.`)
            }

            if(client.rps[message.author.id] == ''){
              message.channel.send(`<@${message.author.id}> didn't respond to me in time.`)
            }

            if(client.rps[c.author.id] == ''){
              message.channel.send(`<@${c.author.id}> didn't respond to me in time.`)
            }

            clearInterval(i)
            client.rps[message.author.id] = undefined
            client.rps[c.author.id] = undefined
          }, 3 * 60000)

          var i = setInterval(()=>{
            if(client.rps[message.author.id] != '' && client.rps[c.author.id] != ''){
              clearInterval(i)
              clearTimeout(w)

              var result = ``

              client.rps[message.author.id] = client.rps[message.author.id].replace('`', '')

              client.rps[c.author.id] = client.rps[c.author.id].replace('`', '')

              if(client.rps[message.author.id] == client.rps[c.author.id]){
                result = `It's a TIE!`
              }

              message.channel.send(`<@${message.author.id}> chose \`${client.rps[message.author.id]}\` and <@${c.author.id}> chose \`${client.rps[c.author.id]}\`. ${result}`)
              return
            }
          })
        }else{
          message.channel.send(`<@${message.author.id}>, <@${u.id}> declined your request to play. What a baby...`)
        }
      })
  }
}