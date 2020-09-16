const Discord = require('discord.js')

module.exports = {
  name: 'botinfo',
  topic: 'info',
  description: 'View information about the bot',
  run: (client, message)=>{
    
    var e = new Discord.MessageEmbed()
    e.setTitle(`Information`)
    e.setThumbnail(client.user.displayAvatarURL())
    e.addField(`Node Version`, process.version, true)
    e.addField(`Discord.JS Version`, require('../package.json').dependencies['discord.js'], true)
    e.addField(`Developers`, `${client.users.cache.get('714544278478520331').tag}, ${client.users.cache.get('709022047673516043').tag}`, true)
    e.setFooter(`Bread was made by the Null Development Team`)
    e.setColor(client.defaultColor)

    message.channel.send(e)
  }
}