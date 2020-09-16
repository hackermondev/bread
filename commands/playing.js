const Discord = require('discord.js')

module.exports = {
  name: 'playing',
  topic: 'says',
  description: 'See who is playing who give someone the player role',
  run: async (client, message)=>{
    if(!message.guild.member(client.user.id).hasPermission('MANAGE_ROLES')){
      return message.channel.send(`i need manage roles perms for this to work. give me manage roles perms then try again.`)
    }

    if(!client.ss[message.guild.id]){
      return message.channel.send(`no game is running`)
    }

    var args = message.content.split(' ')

    if(args[1] == undefined){
      var playing = message.guild.roles.cache.get(client.ss[message.guild.id].roles.player.id).members.map(m=>m.user.id)

      var r = ''

      playing.forEach((id)=>{
        r += `<@${id}>\t`
      })

      message.channel.send(r)
      return
    }

    var id = args[1].replace('<@', '').replace('>','').replace('!','')

    var u = message.guild.member(id)

    if(!u){
      return message.channel.send('please enter a valid user')
    }

    if(client.users.cache.get(u.id).bot){
      return message.channel.send('why would a bot be able to play? dumb dumb')
    }
    
    u.roles.add(client.ss[message.guild.id].roles.player.id).catch((err)=>{
      message.channel.send(`i couldn't give them the role`)
    })
    .then(()=>{
      message.channel.send(`that person now has the role!`)
    })
  }
}