const Discord = require('discord.js')
const fs = require('fs')

module.exports = {
  name: 'giveaways',
  topic: 'giveaways',
  description: 'List all the giveaways',
  run: async (client, message) => {
    var giveaways = JSON.parse(fs.readFileSync(`/home/runner/bread/db/giveaways.json`).toString())

    var g = []

    giveaways.forEach((a)=>{
      if(a.guildID == message.guild.id && a.ended == false){
        g.push(a)
      }
    })
    var d = ``

    g.forEach((gi)=>{
      d += `[${gi.prize}](https://discord.com/channels/${message.guild.id}/${gi.channelID}/${gi.messageID})\n`
    })

    if(d == ''){
      d = `No active giveaways :(`
    }
    
    var e = new Discord.MessageEmbed()
    e.setTitle(`Active Giveaways`)
    e.setDescription(d)
    e.setColor(client.displayColor)

    message.channel.send(e)
  }
}