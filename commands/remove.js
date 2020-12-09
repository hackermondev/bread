const Discord = require('discord.js')

module.exports = {
  name: 'remove',
  topic: 'says',
  description: 'Remove someone from the game',
  run: async (client, message)=>{
    if(!message.guild.member(client.user.id).hasPermission('MANAGE_ROLES')){
      return message.channel.send(client.errors.incorrectPermissions(`MANAGE_ROLES`))
    }

    if(!client.ss[message.guild.id]){
      return message.channel.send(client.errors.customError(`There are no games running.`))
    }

    var args = message.content.split(' ')

    if(args[1] == undefined){
      return message.channel.send(client.errors.customError('Who am I supposed to remove? Your mom?'))
    }

    var id = args[1].replace('<@', '').replace('>','').replace('!','')

    var u = message.guild.member(id)

    if(!u){
      return message.channel.send(client.errors.invalidUser())
    }

    if(u.roles.cache.has(client.ss[message.guild.id].roles.controller.id)){
      return message.channel.send(client.errors.customError(`I can't kick the simon from their own game.`))
    }

    u.roles.remove(client.ss[message.guild.id].roles.player.id).catch((err)=>{
      message.channel.send(client.errors.customError(`I couldn't remove their role. Someone did permissions wrong :eyes:`))
    })

    .then(async ()=>{
      message.channel.send(`That person now has been removed!`)

      var playing = message.guild.roles.cache.get(client.ss[message.guild.id].roles.player.id).members

      if(playing.size < 2){
        if(!playing.first()){
          return message.channel.send(client.errors.customError(`Something went wrong but I couldn't figure out what, please try again`))
        }
        
        message.channel.send(`<@${playing.first().id}> has won the game :tada:\n\n${playing.first()} here have a cookie :cookie:`)

        await client.changeLeaderboard(message.guild, playing.first().id, { gamesWon: '+1' })

        client.reset()
        
        if(client.ss[message.guild.id].auto){
          var m = await message.channel.send(`Starting another game in 20 seconds.`)

          setTimeout(async ()=>{
            client.startAutoGames(message)
            await m.delete()
          }, 20000)
        }


        client.ss[message.guild.id] = undefined
      }
    })
  }
}