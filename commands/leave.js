const Discord = require('discord.js')

module.exports = {
  name: 'leave',
  topic: 'says',
  description: 'Leave the simon says game',
  run: async (client, message)=>{
    if(!message.guild.member(client.user.id).hasPermission('MANAGE_ROLES')){
      return message.channel.send(client.errors.incorrectPermissions(['MANAGE_ROLES']))
    }

    if(!client.ss[message.guild.id]){
      return message.channel.send(client.errors.customError(`Huh? How am I supposed to kick you out of a game when there are no games running?`))
    }

    var u = message.member

    if(u.roles.cache.has(client.ss[message.guild.id].roles.controller.id)){
      return message.channel.send(client.errors.customError(`You are the Simon, you can't leave the game. If you want this feature, tell us on our [support server](https://discord.gg/EzecfUX).`))
      return
    }
    
    u.roles.remove(client.ss[message.guild.id].roles.player.id).catch((err)=>{
      message.channel.send(client.errors.customError(`Someone did permissions wrong and I couldn't remove your role`))
    })
    
    .then(()=>{
      return message.channel.send(`<@${message.author.id}> left the game.`)
    })
  }
}