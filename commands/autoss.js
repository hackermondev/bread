const Discord = require('discord.js')

module.exports = {
  name: 'autoss',
  topic: 'games',
  description: 'Start a automatic simon says game that does everything',
  run: async (client, message) => {
    if (!message.guild.member(client.user.id).hasPermission('MANAGE_ROLES') || !message.guild.member(client.user.id).hasPermission('MANAGE_CHANNELS')) {
      return message.channel.send(client.errors.incorrectPermissions(['MANAGE_CHANNELS', 'MANAGE_ROLES']))
    }

    if (client.ss[message.guild.id]) {
      return message.channel.send(client.errors.customError(`You can't create more than one game.`))
      return
    }

    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      return message.channel.send(client.errors.invalidPermissions(`MANAGE_MESSAGES`))
    }

    // if (message.guild.id != '734877496440520774') {
    //   return message.channel.send(client.errors.customError(`This feature is currently in beta and only works for the official Null Development server right now.`))
    // }

    if(client.cache.guilds[message.guild.id].autogames){
      var e = new Discord.MessageEmbed()
      e.setDescription(`Disabling autogames...`)
      e.setColor(client.defaultColor)

      var m = await message.channel.send(e)

      client.cache.guilds[message.guild.id].autogames = false
      client.cache.guilds[message.guild.id].autogamesInfo = undefined

      await client.db.collection('guild-info').updateOne({ id: message.guild.id }, { $set: { autogames: client.cache.guilds[message.guild.id].autogames, autogamesInfo: client.cache.guilds[message.guild.id].autogamesInfo } })

      var e = new Discord.MessageEmbed()
      e.setDescription(`Autogames have been disabled. Once the current game ends, we won't start another game.`)
      e.setColor(client.defaultColor)

      m.edit(e)

      return
    }

    await message.channel.send(`AutoGames have been enabled. Starting a automatic game in 20 seconds.`)

    client.cache.guilds[message.guild.id].autogames = true

    client.cache.guilds[message.guild.id].autogamesInfo = {
      channel: message.channel.id,
      min: 3,
      max: 20
    }

    await client.db.collection('guild-info').updateOne({ id: message.guild.id }, { $set: { autogames: client.cache.guilds[message.guild.id].autogames, autogamesInfo: client.cache.guilds[message.guild.id].autogamesInfo } })

    setTimeout(async ()=>{
      await client.startAutoGames(message)
    }, 20000)
  }
}