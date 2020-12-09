const Discord = require('discord.js')
const fs = require('fs')

module.exports = {
  name: 'blacklist',
  topic: null,
  description: 'Blacklist someone from bot',
  run: async (client, message) => {
    if(message.author.id != '714544278478520331'){
      return
    }

    var user = message.content.split(' ')[1]

    if(!user){
      return message.channel.send(client.errors.UserNotFound())
    }

    user = user.replace('<@', '').replace('>', '').replace('!', '')

    var u = client.users.cache.get(user)

    if(!u){
      return message.channel.send(`user not found in my database`)
    }

    var e = new Discord.MessageEmbed()
    e.setTitle(`Notice Of Blacklist`)
    e.setDescription(`You've been blacklisted from using the bot. If you think this is a mistake please report this to Hackermon#1297, make sure you have proof. You are most likely __not__ going to get removed.`)
    e.setColor(client.defaultColor)
    e.setFooter(`Made by the Null Development Team`)

    u.send(e)

    message.channel.send(`done...`)

    var blacklisted = JSON.parse(fs.readFileSync(`/home/runner/bread/db/blacklist.json`).toString())

    blacklisted.push(u.id)

    fs.writeFileSync(`/home/runner/bread/db/blacklist.json`, JSON.stringify(blacklisted))

    client.reload()
  }
}