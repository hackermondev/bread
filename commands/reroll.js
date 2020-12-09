const Discord = require('discord.js')


module.exports = {
  name: 'reroll',
  topic: 'giveaways',
  description: 'Reroll a giveaway',
  run: async (client, message) => {
    if (!message.member.hasPermission('KICK_MEMBERS')) {
      return message.channel.send(client.errors.invalidPermissions(`KICK_MEMBERS`))
    }

    var id = message.content.split(' ')[1]

    if(!id){
      return message.channel.send(client.errors.userNotFound())
    }

    client.giveawaysManager.reroll(id).catch((err) => {
      return message.channel.send(client.errors.customError(`I couldn't find the giveaway that you were talking about.`))
    })
  }
}