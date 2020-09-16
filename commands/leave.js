const Discord = require('discord.js')

module.exports = {
  name: 'leave',
  topic: 'says',
  description: 'Leave the simon says game',
  run: async (client, message)=>{
    if(!message.guild.member(client.user.id).hasPermission('MANAGE_ROLES')){
      return message.channel.send(`i need manage roles perms for this to work. give me manage roles perms then try again.`)
    }

    if(!client.ss[message.guild.id]){
      return message.channel.send(`no game is running`)
    }

    var u = message.member

    if(u.roles.cache.has(client.ss[message.guild.id].roles.controller.id)){
      return message.channel.send('you cannot leave, you are the simon')
      return
    }
    
    u.roles.remove(client.ss[message.guild.id].roles.player.id).catch((err)=>{
      message.channel.send(`i couldn't remove your roles`)
    })
    .then(()=>{
      return message.channel.send(`<@${message.author.id}> left the game.`)
    })
  }
}