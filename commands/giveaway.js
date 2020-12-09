const Discord = require('discord.js')


module.exports = {
  name: 'giveaway',
  topic: 'giveaways',
  description: 'Start a giveaway',
  run: async (client, message) => {
    if (!message.member.hasPermission('KICK_MEMBERS')) {
      return message.channel.send(client.errors.invalidPermissions(`KICK_MEMBERS`))
    }

    var info = {
      channel: null,
      what: null,
      winners: 1,
      time: null
    }

    var e = new Discord.MessageEmbed()
    e.setDescription(`What channel do you want to start the giveaway?`)
    e.setColor(client.defaultColor)

    await message.channel.send(e)
    message.channel.awaitMessages(m => m.author.id === message.author.id, {
      max: 1,
      time: 10000,
      errors: ['time']
    }).then(async (c) => {
      var m = c.first()
      var channel = m.content.split(' ')[0].replace('#', '').replace('<', '').replace('>', '')
      var c = message.guild.channels.cache.get(channel)

      if (!c) {
        message.channel.send(client.errors.customError(`Channel not found. Is it a public channel?`))
        return
      }
      
      info.channel = channel

      var e = new Discord.MessageEmbed()
      e.setDescription(`What are you giving away?`)
      e.setColor(client.defaultColor)

      await message.channel.send(e)
      message.channel.awaitMessages(m => m.author.id === message.author.id, {
        max: 1,
        time: 10000,
        errors: ['time']
      }).then(async (c) => {
        var m = c.first()
        info.what = m.content

        var e = new Discord.MessageEmbed()
        e.setDescription(`How many winners?`)
        e.setColor(client.defaultColor)

        await message.channel.send(e)
        message.channel.awaitMessages(m => m.author.id === message.author.id, {
          max: 1,
          time: 10000,
          errors: ['time']
        }).then(async (c) => {
          var m = c.first()
          var int = parseInt(m.content.split(' ')[0])

          if (isNaN(int)) {
            message.channel.send(client.errors.customError(`You entered a invalid number. Am I supposed to guess the number?`))
            return
          }

          info.winners = int

          var e = new Discord.MessageEmbed()
          e.setDescription(`When does it end? (example 1s, 2m, 2h, 9h, 10d)`)
          e.setColor(client.defaultColor)

          await message.channel.send(e)
          message.channel.awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            time: 10000,
            errors: ['time']
          }).then(async (c) => {
            var m = c.first()
            var t = m.content.split(' ')[0]

            if (t.endsWith(`s`)) {
              t = parseInt(t.replace('s', '')) * 1000
            } else if (t.endsWith(`m`)) {
              t = parseInt(t.replace('s', '')) * 60000
            } else if (t.endsWith('h')) {
              t = parseInt(t.replace('s', '')) * 3.6e+6
            } else if (t.endsWith('d')) {
              t = parseInt(t.replace('s', '')) * 8.64e+7
            }

            if (isNaN(t) || typeof t != 'number') {
              message.channel.send(client.errors.customError(`I don't understand what you mean. What does \`${m.content}\` even mean?`))
              return
            }

            endsAt = new Date().getTime() + t

            client.giveawaysManager.start(client.channels.cache.get(info.channel), {
              time: t,
              prize: info.what,
              winnerCount: info.winners,
              hostedBy: `<@${message.author.id}>`,
              messages: {
                giveaway: "🎉🎉 **GIVEAWAY** 🎉🎉",
                giveawayEnded: "🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
                timeRemaining: "Time remaining: **{duration}**!",
                inviteToParticipate: "React with 🎉 to join!",
                winMessage: "Congratulations, {winners}! You won **{prize}**!",
                embedFooter: "Giveaways",
                noWinner: "Giveaway cancelled, no valid participations.",
                hostedBy: "Hosted by: {user}",
                winners: "winner(s)",
                endedAt: "Ended at",
                units: {
                  seconds: "seconds",
                  minutes: "minutes",
                  hours: "hours",
                  days: "days",
                  pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
                }
              }
            }).then((gData) => {
              // console.log(gData)
            })
          })

        })
          .catch((err) => {
            message.channel.send(client.errors.customError(`You didn't answer my question in time. Are in idle or something?`))
          })
      })
        .catch((err) => {
          message.channel.send(client.errors.customError(`You didn't answer my question in time. Are in idle or something?`))
        })

    })
      .catch((err) => {
        message.channel.send(client.errors.customError(`You didn't answer my question in time. Are in idle or something?`))
      })
  }
}