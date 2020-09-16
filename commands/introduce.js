const Discord = require('discord.js')

module.exports = {
  name: 'introduce',
  topic: null,
  example: null,
  run: (client, message) => {
    if (message.author.id != '714544278478520331') {
      return
    }

    message.delete()
    var e = new Discord.MessageEmbed()
    e.setTitle(`Bread!`)
    e.setURL(`https://discord.com/oauth2/authorize?client_id=749674433123188908&scope=bot&permissions=470117456`)
    e.setDescription(`Hello, I'm your bot for gaming. My name is Bread and I was created by the Null Development Team! I have a lot of gaming commands. You can use me to play Simon Says, Rock Paper Scissors and more. Invite me now by click the embed link! You can vote for me on top.gg to unlock some perks.`)

    e.setColor(client.defaultColor)
    e.setThumbnail(client.user.displayAvatarURL())
    e.setFooter(`You can also vote for me on top.gg!`)

    message.channel.send(e)
  }
}