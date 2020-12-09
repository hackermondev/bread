const Discord = require('discord.js')

module.exports = {
  name: 'end',
  topic: 'says',
  description: 'End the simon says game',
  run: async (client, message)=>{
    if(!message.guild.member(client.user.id).hasPermission('MANAGE_ROLES')){
      return message.channel.send(client.errors.incorrectPermissions(['MANAGE_ROLES']))
    }

    if(!client.ss[message.guild.id]){
      return message.channel.send(client.errors.customError(`You don't have a game of Simon Says running right now.`))
    }


    if(!message.member.hasPermission('ADMINISTRATOR') && message.member.roles.cache.has(client.ss[message.guild.id].roles.controller.id)){
      return message.channel.send(client.errors.invalidRole(roles.controller.id))
    }
    
    var m = await message.channel.send(`Ending simon says...`)

    var playingRole = message.guild.roles.cache.find((r => r.name == 'Player'))

    if(playingRole){
      var playing = message.guild.roles.cache.get(playingRole.id).members.map(m=>m.user.id)

      playing.forEach(async (p)=>{
        m.edit(`Removing role from ${client.users.cache.get(p).username}...`)

        await message.guild.member(p).roles.remove(playingRole)
      })
    }
    

    var controllerRole = message.guild.roles.cache.find((r => r.name == 'Controller'))

    if(controllerRole){
      var p = message.guild.roles.cache.get(controllerRole.id).members.map(m=>m.user.id)

      p.forEach(async (p)=>{
        m.edit(`Removing role from ${client.users.cache.get(p).username}...`)

        await message.guild.member(p).roles.remove(controllerRole)
      })
    }

    message.channel.setRateLimitPerUser(0, `Game anded by ${message.author.tag}`)

    m.edit(`The simon says has ended! I've removed all the roles and unlocked the channels.`)

    client.ss[message.guild.id] = undefined
  }
}