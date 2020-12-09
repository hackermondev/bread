const Discord = require('discord.js')

module.exports = {
  name: 'stats',
  topic: 'info',
  description: 'View stats for the bot',
  run: async (client, message)=>{
    var e = new Discord.MessageEmbed()
    e.setTitle(`Stats`)
    e.addField(`Servers`, client.guilds.cache.size, true)
    e.addField(`Members`, client.users.cache.size, true)
    e.addField(`Giveaways`, client.giveawaysManager.giveaways.filter((g) => !g.ended).length, true)
    e.setColor(client.defaultColor)

    message.channel.send(e)
  }
}