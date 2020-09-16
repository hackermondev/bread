const Discord = require('discord.js')

module.exports = {
  name: 'credits',
  topic: 'info',
  example: 'credits',
  run: (client, message) => {
    var e = new Discord.MessageEmbed()
    e.setColor(client.defaultColor)
    e.setTitle(`Credits`)
    e.addField(`Developers`, `${client.users.cache.get('714544278478520331').tag}, ${client.users.cache.get('709022047673516043').tag}, ${client.users.cache.get('250731307070521345').tag}`)
    e.addField(`Moderators`, `Boltzoid, Goose, C970, Hexverse`)

    e.setFooter(`I wouldn't exist without them`)
    message.channel.send(e)
  }
}
