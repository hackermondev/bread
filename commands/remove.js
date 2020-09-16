const Discord = require('discord.js')

module.exports = {
  name: 'remove',
  topic: 'says',
  description: 'Remove someone from the game',
  run: async (client, message)=>{
    if(!message.guild.member(client.user.id).hasPermission('MANAGE_ROLES')){
      return message.channel.send(`i need manage roles perms for this to work. give me manage roles perms then try again.`)
    }

    if(!client.ss[message.guild.id]){
      return message.channel.send(`no game is running`)
    }

    var args = message.content.split(' ')

    if(args[1] == undefined){
      return message.channel.send('please mention someone')
    }

    var id = args[1].replace('<@', '').replace('>','').replace('!','')

    var u = message.guild.member(id)

    if(!u){
      return message.channel.send('please enter a valid user')
    }

    if(u.roles.cache.has(client.ss[message.guild.id].roles.controller.id)){
      return message.channel.send(`i can't kick the simon`)
    }

    u.roles.remove(client.ss[message.guild.id].roles.player.id).catch((err)=>{
      message.channel.send(`i couldn't remove their role`)
    })
    .then(()=>{
      message.channel.send(`that person now has been removed!`)
    })
  }
}