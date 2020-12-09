const Discord = require('discord.js')

module.exports = {
  name: 'invite',
  topic: 'info',
  description: 'Invite the bot',
  run: (client, message) => {
    var e = new Discord.MessageEmbed()
    e.setTitle(`Invite`)
    e.setDescription(`You can invite me by [clicking here](https://discord.com/oauth2/authorize?client_id=749674433123188908&scope=bot&permissions=470117456) and join my support server by [clicking here](https://discord.gg/EzecfUX)`)
    e.setColor(client.displayColor)

    message.channel.send(e)
  }
}