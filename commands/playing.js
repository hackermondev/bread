const Discord = require('discord.js')

module.exports = {
  name: 'playing',
  topic: 'says',
  description: 'See who is playing who give someone the player role',
  run: async (client, message)=>{
    if(!message.guild.member(client.user.id).hasPermission('MANAGE_ROLES')){
      return message.channel.send(client.errors.incorrectPermissions([`MANAGE_ROLES`]))
    }

    if(!client.ss[message.guild.id]){
      return message.channel.send(client.errors.customError(`How am I supposed to get the players in a game if there is no game running?`))
    }

    var args = message.content.split(' ')

    if(args[1] == undefined){
      var playing = message.guild.roles.cache.get(client.ss[message.guild.id].roles.player.id).members.map(m=>m.user.id)

      var r = ''

      playing.forEach((id)=>{
        r += `<@${id}>\t`
      })

      if(r == ''){
        r == 'No players found'
      }
      
      message.channel.send(r)
      return
    }

    var id = args[1].replace('<@', '').replace('>','').replace('!','')

    var u = message.guild.member(id)

    if(!u){
      return message.channel.send(client.errors.userNotFound())
    }

    if(client.users.cache.get(u.id).bot){
      return message.channel.send(client.errors.customError(`I can't add a bot to the game.`))
    }
    
    u.roles.add(client.ss[message.guild.id].roles.player.id).catch((err)=>{
      message.channel.send(client.errors.customError(`i couldn't give them the role`))
    })

    .then(()=>{
      message.channel.send(`<@${u.id}> has joined the game.`)
    })
  }
}