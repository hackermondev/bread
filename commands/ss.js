const Discord = require('discord.js')

module.exports = {
  name: 'ss',
  topic: 'games',
  description: 'Start a simon says game',
  run: async (client, message)=>{
    if(!message.guild.member(client.user.id).hasPermission('MANAGE_ROLES')){
      return message.channel.send(`i need manage roles perms for this to work. give me manage roles perms then try again.`)
    }

    if(!message.guild.member(client.user.id).hasPermission('MANAGE_CHANNELS')){
      return message.channel.send(`i need manage channels perms for this to work. give me manage roles perms then try again.`)
    }

    if(client.ss[message.guild.id]){
      return message.channel.send(`i don't support more than one game in a server, yet.....`)
      return
    }

    if(!message.member.hasPermission('MANAGE_MESSAGES')){
      return message.channel.send('you need manage messages role to do this')
    }
    
    var m = await message.channel.send(`Loading some stuff....`)

    var roles = {}

    roles.player = message.guild.roles.cache.find((r => r.name == 'Player'))
    roles.controller = message.guild.roles.cache.find((r => r.name == 'Controller'))

    if(roles.player == undefined){
      m.edit(`Player role not found. Creating role...`)
      roles.player = await message.guild.roles.create({
        data: {
          name: 'Player',
          color: client.defaultColor,
          permissions: []
        },
        reason: 'Says'
      })
    }


    if(roles.controller == undefined){
      m.edit(`Controller role not found. Creating role...`)
      roles.controller = await message.guild.roles.create({
        data: {
          name: 'Controller',
          color: client.defaultColor,
          permissions: []
        },
        reason: 'Says'
      })
    }

    m.edit(`Ok, now I need some information.`)

    await message.channel.send(`Who is going to be the Simon? Please ping them.`)

    message.channel.awaitMessages(m => m.author.id == message.author.id, {
      max: 1,
      time: 120000,
      errors: ['time']
    }).catch((err)=>{
      message.channel.send(`You were too slow to response. A game has not started.`)
    })
    .then(async (c)=>{
      var c = c.first()

      var user = c.content.split(' ')[0]

      if(!user){
        return message.channel.send(`ok so since you didn't give me a valid user i can't start the game (oof). please use the command again`)
      }

      user = user.replace('<@', '').replace('>', '').replace('!', '')

      var u = message.guild.member(user)

      if(!u){
        return message.channel.send(`ok so since you didn't give me a valid user i can't start the game (oof). please use the command again`)
      }

      u.roles.add(roles.controller).catch((err)=>{
        message.channel.send(`i couldn't give them the role.`)
      })

      u.roles.add(roles.player)

      message.channel.send(`<@${u.id}>, you've been chose for simon! let the game begin!`)


      var e = new Discord.MessageEmbed()
      e.setTitle(`Game Started`)
      e.setDescription(`A new simon says game has started! Give the people that want to play the <@&${roles.player.id}> role or use the \`playing\` command. Use the \`bread!help says\` command to see a list of available commands.`)
      e.setColor(client.defaultColor)
      e.setFooter(`Let's the game begin!`)

      message.channel.send(e)

      message.channel.send(`Please remember that you have to lock the channel for other people!`)

      client.ss[message.guild.id] = {
        roles: roles,
        simon: u.id
      }

      await message.channel.setRateLimitPerUser(2, `Slowmode because of simon says`)
    })
  }
}