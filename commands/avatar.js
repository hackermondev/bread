const Discord = require('discord.js')

module.exports = {
  name: 'avatar',
  topic: 'info',
  description: 'View information about your avatar',
  run: (client, message) => {

    var user = message.content.split(' ')[1]

    if (!user) {
      user = message.author
      var e = new Discord.MessageEmbed()
      e.setURL(user.displayAvatarURL())
      e.setTitle(user.username)
      e.setImage(user.displayAvatarURL())
      e.setColor(client.defaultColor)
      e.setFooter(`Requested by ${message.author.tag}`)
      message.channel.send(e)
      return
    }

    user = user.replace('<@', '').replace('>', '').replace('!', '')

    user = client.users.cache.get(user)

    if (!user) {
      return message.channel.send(client.errors.UserNotFound())
    }

    var e = new Discord.MessageEmbed()
    e.setTitle(user.username)
    e.setURL(user.displayAvatarURL())
    e.setImage(user.displayAvatarURL())
    e.setColor(client.defaultColor)
    e.setFooter(`Requested by ${message.author.tag}`)
    message.channel.send(e)
  }
}