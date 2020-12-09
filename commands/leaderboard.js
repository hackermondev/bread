const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  name: 'leaderboard',
  topic: 'says',
  description: 'Leaderboard for simon says',
  run: async (client, message)=>{
    var e = new Discord.MessageEmbed()

    e.setTitle(`Leaderboard for ${message.guild.name}`)
    e.setDescription(`You can view the leaderboard on our [website](https://bread.jdaniels.me/leaderboard?id=${message.guild.id}). There might be some bugs so look out for that.`)
    e.setColor(client.defaultColor)

    message.channel.send(e)
  }
}