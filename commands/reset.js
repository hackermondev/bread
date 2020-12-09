const Discord = require('discord.js')

module.exports = {
  name: 'reset',
  topic: 'says',
  description: 'Resets everything. Remove all the roles from people that have it.',
  run: async (client, message) => {
    if (!message.guild.member(client.user.id).hasPermission('MANAGE_ROLES')) {
      return message.channel.send(client.errors.incorrectPermissions([`MANAGE_ROLES`]))
    }

    if(!message.guild.member(client.user.id).hasPermission('MANAGE_CHANNELS')){
      return message.channel.send(client.errors.incorrectPermissions([`MANAGE_CHANNELS`]))
    }

    if(client.ss[message.guild.id]){
      return message.channel.send(client.errors.customError(`There is a game running right now. Please stop that game and then try again.`))
    }

    var m = await message.channel.send(`Checking some things...`
    )
    var playingRole = message.guild.roles.cache.find((r => r.name == 'Player'))

    if (playingRole) {
      var playing = message.guild.roles.cache.get(playingRole.id).members.map(m => m.user.id)

      playing.forEach(async (p) => {
        m.edit(`Removing role from ${client.users.cache.get(p).username}...`)

        await message.guild.member(p).roles.remove(playingRole)
      })
    }


    var controllerRole = message.guild.roles.cache.find((r => r.name == 'Controller'))

    if (controllerRole) {
      var p = message.guild.roles.cache.get(controllerRole.id).members.map(m => m.user.id)

      p.forEach(async (p) => {
        m.edit(`Removing role from ${client.users.cache.get(p).username}...`)

        await message.guild.member(p).roles.remove(controllerRole)
      })
    }


    m.edit(`I've removed all the roles. Everyone should be back to normal!`)

    message.channel.setRateLimitPerUser(0, `Reset command by ${message.author.tag}`)
  }
}