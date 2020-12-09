const Discord = require('discord.js')

module.exports = {
  name: 'afkcheck',
  topic: 'says',
  description: 'Do a afk check to check who is afk.',
  run: async (client, message) => {

    if(!client.ss[message.guild.id]){
      return message.channel.send(client.errors.customError(`How can I do a AFK check is there are no simon says game?`))
    }

    if (!message.member.hasPermission('administrator'.toUpperCase()) && !message.member.roles.cache.has(client.ss[message.guild.id].roles.controller.id)) {
      return message.channel.send(client.errors.invalidRole(client.ss[message.guild.id].roles.player.id))
    }

    var e = new Discord.MessageEmbed()
    e.setTitle(`AFK Check`)
    e.setDescription(`${message.author.tag} has started a AFK check. React to this message to prove that you are not AFK. You have \`10 seconds\` `)
    e.setColor(client.defaultColor)

    var m = await message.channel.send(e)

    await m.react(`😑`)
    

    client.reactions[m.id] = {
      reaction: `😑`,
      u: []
    }

    var id = m.id

    setTimeout(async ()=>{
      if(!id){
        return message.channel.send(`An error occured while doing afk check. No one was eliminated.`)
      }

      var ac = client.reactions[id].u

      message.channel.send(`Checking the reactions. `)

      var h = {}
      ac.forEach((u)=>{
        var m = message.guild.member(u)

        if(!m){
          return
        }
        
        h[u] = true
      })

      var r = []

      Array.from(client.ss[message.guild.id].roles.player.members).forEach(async (member)=>{
        member = member[0]

        member = message.guild.member(member)

        if(!h[member.id]){
          r.push(`<@${member.id}>`)
          await member.roles.remove(client.ss[message.guild.id].roles.player)
        }
      })

      if(r[0] == undefined){
        message.channel.send(`No one was removed, you can continue the game now.`)
      }else{
        message.channel.send(`${r.join(',')} is afk. There were removed from the game.`)
      }

      var playing = message.guild.roles.cache.get(client.ss[message.guild.id].roles.player.id).members.array()

      playing.forEach((p, index)=>{
        if(r.includes(`<@${p.id}>`)){
          playing.splice(index, 1)
        }
      })

      if(playing.length < 2){
        if(playing.length == 0){
          return message.channel.send(`Everyone was eliminated. RIP`)

          client.reset()
          if(client.ss[message.guild.id].auto){
            var m = await message.channel.send(`Starting another game in 20 seconds.`)

            setTimeout(async ()=>{
              client.startAutoGames(message)
              await m.delete()
            }, 20000)
          }

          client.ss[message.guild.id] = undefined
          return
        }

        message.channel.send(`> <@${playing[0].id}> has won the game :tada:\n\n > ${playing[0]} here have a cookie :cookie:`)
        
        await client.changeLeaderboard(message.guild, playing[0].id, { gamesWon: '+1' })
        
        client.reset(message)
        
        if(client.ss[message.guild.id].auto){
          var m = await message.channel.send(`Starting another game in 20 seconds.`)

          setTimeout(async ()=>{
            client.startAutoGames(message)
            await m.delete()
          }, 20000)
        }


        client.ss[message.guild.id] = undefined
      }
    }, 10000)
  }
}