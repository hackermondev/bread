const Discord = require('discord.js')
const Statcord = require("statcord.js")

const fs = require('fs')
const database = require('./database')
require('./keepalive')

const client = new Discord.Client({
  disableMentions: 'everyone'
})

const { GiveawaysManager } = require("discord-giveaways");

const statcord = new Statcord.Client({
  client,
  key: process.env.STATCORD,
  postCpuStatistics: true,
  postMemStatistics: true,
  postNetworkStatistics: true,
})

client.defaultColor = `#00FFFF`
client.displayColor = `#00FFFF`

client.reactions = {}
client.ss = {}
client.rps = {}

var pt = ['You can use the \`bd!\` prefix is you think \`bread!\` is too long.', 'Bread was inspired by a youtube video', 'Bread is hosted on repl.it']

client.triggers = ['person below wins', 'simon say person below wins', 'simon says don\'t talk in chat', 'talk in chat', 'what is 2 + 2?']


client.errors = {
  userNotFound: () => {
    var e = new Discord.MessageEmbed()

    e.setTitle(`User Not Found`)
    e.setColor(`#FF0000`)

    var m = ['Huh? I can\'t find the user you are looking for. ', 'Invalid user bro, next time put a real user there', 'You need to ping a __real__ person pls']

    e.setDescription(m[Math.floor(Math.random() * m.length)])

    e.setAuthor('Bread', client.user.displayAvatarURL())
    return e
  },
  incorrectPermissions: (permissions) => {
    var e = new Discord.MessageEmbed()

    e.setTitle(`REEEEE! I don't have the correct permissions`)
    e.setColor(`#FF0000`)


    e.setDescription(`You gave me the wrong permissions. I need ${permissions.join(',')} permission(s).`)

    e.setAuthor('Bread', client.user.displayAvatarURL())
    return e
  },
  customError: (error) => {
    var e = new Discord.MessageEmbed()

    e.setTitle(`Error REEEEEEEEE`)
    e.setColor(`#FF0000`)


    e.setDescription(error)

    e.setAuthor('Bread', client.user.displayAvatarURL())
    return e
  },
  invalidRole: (role) => {
    var e = new Discord.MessageEmbed()

    e.setTitle(`You don't have the correct roles.`)
    e.setColor(`#FF0000`)


    e.setDescription(`Bruh, you need <@&${role}> or admin to run this command. Did you really think it would work?`)

    e.setAuthor('Bread', client.user.displayAvatarURL())
    return e
  },
  invalidPermissions: (permission) => {
    var e = new Discord.MessageEmbed()

    e.setTitle(`You don't have the correct permissions.`)
    e.setColor(`#FF0000`)


    e.setDescription(`Bruh, you need \`${permission}\` permission to run this command. Did you really think it would work?`)

    e.setAuthor('Bread', client.user.displayAvatarURL())
    return e
  }
}

client.changeLeaderboard = async (server, author, info)=>{
  var a = client.cache.guilds[server.id]

  var l = a.leaderboard

  if(l == undefined){
    client.cache.guilds[server.id].leaderboard = []
    l = []
  }

  var p = null

  l.forEach((leader, index)=>{
    if(leader.author == author){
      p = index
    }
  })

  if(p == null){
    a.leaderboard.push({ 
      author: author,
      gamesPlayed: 0,
      gamesWon: 0,
      gamesControlled: 0
    })
    p = a.leaderboard.length - 1
  }

  Object.keys(info).forEach((key)=>{
    if(info[key] == '+1'){
      info[key] = parseInt(client.cache.guilds[server.id].leaderboard[p][key]) + 1
    }

    client.cache.guilds[server.id].leaderboard[p][key] = info[key]
  })


  await client.db.collection('guild-info').updateOne({ id: server.id }, { $set: { leaderboard: a.leaderboard } })
}

client.reset = async (message) => {
  var playingRole = message.guild.roles.cache.find((r => r.name == 'Player'))

  if (playingRole) {
    var playing = message.guild.roles.cache.get(playingRole.id).members.map(m => m.user.id)

    playing.forEach(async (p) => {
      await message.guild.member(p).roles.remove(playingRole)
    })
  }


  var controllerRole = message.guild.roles.cache.find((r => r.name == 'Controller'))

  if (controllerRole) {
    var p = message.guild.roles.cache.get(controllerRole.id).members.map(m => m.user.id)

    p.forEach(async (p) => {
      await message.guild.member(p).roles.remove(controllerRole)
    })
  }
}

client.startAutoGames = async (message) => {
  await client.reset(message)

  if (!message.guild.member(client.user.id).hasPermission('MANAGE_ROLES') || !message.guild.member(client.user.id).hasPermission('MANAGE_CHANNELS')) {
    return message.channel.send(client.errors.incorrectPermissions(['MANAGE_ROLES', 'MANAGE_CHANNELS']))
  }

  if(!client.cache.guilds[message.guild.id].autogames){
    return
  }

  var m =  await message.channel.send(`Loading some stuff....`)

  var roles = {}

  roles.player = message.guild.roles.cache.find((r => r.name == 'Player'))
  roles.controller = message.guild.roles.cache.find((r => r.name == 'Controller'))

  if (roles.player == undefined) {
    m.edit(`Player role not found. Creating role...`).catch((err) => {

    })
    roles.player = await message.guild.roles.create({
      data: {
        name: 'Player',
        color: client.defaultColor,
        permissions: []
      },
      reason: 'Says'
    })
  }


  if (roles.controller == undefined) {
    m.edit(`Controller role not found. Creating role...`).catch((err) => {

    })
    roles.controller = await message.guild.roles.create({
      data: {
        name: 'Controller',
        color: client.defaultColor,
        permissions: []
      },
      reason: 'Says'
    })
  }

  m.edit(`Starting game....`).catch((err) => {

  })

  var reactions = ['🥔', '👍', '🔼', '🍞', '😎']

  var reaction = reactions[Math.floor(Math.random() * reactions.length)]

  var minutes = 1


  m.delete()
  var e = new Discord.MessageEmbed()
  e.setTitle(`Auto Games`)
  e.setDescription(`A new simon says game is starting! React to this embed to join the game. The minimum is \`${client.cache.guilds[message.guild.id].autogamesInfo.min} people\`. Game starts in **${minutes} minute(s)**!`)
  e.setFooter(`React to the ${reaction} emoji to join.`)
  e.setColor(client.displayColor)

  var m = await message.channel.send(e)

  client.reactions[m.id] = {
    reaction: reaction,
    u: []
  }

  m.react(reaction)
  var playing = []
  var started = false


  var t = setInterval(async () => {
    if(!client.cache.guilds[message.guild.id].autogames){
      clearInterval(t)
      return
    }

    minutes -= 1

    if (minutes == 0) {

      playing = client.reactions[m.id].u
      started = true

      if (playing.length < client.cache.guilds[message.guild.id].autogamesInfo.min) {
        var e = new Discord.MessageEmbed()
        e.setTitle(`Auto Games`)
        e.setDescription(`Not enough people joined automatic game.`)
        e.setColor(client.displayColor)

        m.edit(e).catch((err) => {

        })


        clearInterval(t)

        if(!client.cache.guilds[message.guild.id].autogames){
          return
        }
        
        var m2 = await message.channel.send(`Starting another game in 20 seconds.`)

        setTimeout(async () => {
          await m2.delete().catch((err) => {

          })
          await m.delete().catch((err) => {

          })
          client.startAutoGames(message)
        }, 20000)
        return
      }

      var e = new Discord.MessageEmbed()
      e.setTitle(`Auto Games`)
      e.setDescription(`${playing.length} people entered the game! Processing information...`)
      e.setColor(client.displayColor)

      m.edit(e).catch((err) => {

      })

      var c = playing[Math.floor(Math.random() * playing.length)]

      await message.guild.member(c).roles.add(roles.controller)
      await client.changeLeaderboard(message.guild, c, { gamesControlled: '+1' })

      playing.forEach(async (p) => {
        var member = message.guild.member(p)

        if (!member) {
          return
        }

        await client.changeLeaderboard(message.guild, c, { gamesPlayed: '+1' })

        if(member.id == c){
          return
        }

        member.roles.add(roles.player)
      })



      var e = new Discord.MessageEmbed()
      e.setTitle(`Auto Games`)
      e.setDescription(`${playing.length} people entered the game! Starting game. <@${c}> is simon.`)
      e.setColor(client.displayColor)

      m.edit(e).catch((err) => {

      })

      var d = `<@${c}>: `

      playing.forEach((p) => {
        d += `<@${p}> <:7190_linkpepehype:743880005620203542> `
      })
      message.channel.send(d)

      client.ss[message.guild.id] = {
        roles: roles,
        simon: c,
        auto: true
      }

      await message.channel.setRateLimitPerUser(1, `Slowmode because of simon says`)
      clearInterval(t)
      return
    }

    var e = new Discord.MessageEmbed()
    e.setTitle(`Auto Games`)
    e.setDescription(`A new simon says game is starting! React to this embed to join the game. The minimum is \`${client.cache.guilds[message.guild.id].autogamesInfo.min} people\`. Game starts in **${minutes} minute(s)**!`)
    e.setColor(client.displayColor)

    m.edit(e).catch((err) => {

    })
  }, 1 * 60000)
}

statcord.on('post', (e) => {
  if (e) {
    console.error(e)
  }
})

client.cache = {
  guilds: {}
}

client.reload = async () => {
  var b = JSON.parse(fs.readFileSync(`${__dirname}/db/blacklist.json`).toString())

  blacklisted = b
  statcord.post()

  var servers = await client.db.collection('guild-info').find({}).toArray()

  servers.forEach((s) => {
    client.cache.guilds[s.id] = s

  })
}

const manager = new GiveawaysManager(client, {
  storage: "./db/giveaways.json",
  updateCountdownEvery: 2000,
  default: {
    botsCanWin: false,
    exemptPermissions: [],
    embedColor: "#FF0000",
    reaction: "🥔"
  }
});

client.giveawaysManager = manager;

client.commands = new Discord.Collection()
var commands = []
var blacklisted = []

var commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'))



client.on('ready', async () => {
  statcord.autopost()

  client.db = await database.loadDatabase()
  console.log(`I'm ready! ${client.user.tag}! ${client.guilds.cache.size} guilds and ${client.users.cache.size} users cached!`)

  console.log(client.user.id)

  // client.user.setActivity(` ${client.guilds.cache.size} servers!`, { type: 'WATCHING' })
  setInterval(() => {
    var number = Math.floor(Math.random() * 5) + 1

    if (number == 1) {
      client.user.setActivity(` the bread`, { type: 'WATCHING' })
    } else if (number == 2) {
      client.user.setActivity(` Hackermon`, { type: 'LISTENING' })
    } else if (number == 3) {
      client.user.setActivity(` bread!help`, { type: 'LISTENING' })
    } else if (number == 4) {
      client.user.setActivity(` ${client.guilds.cache.size} servers!`, { type: 'WATCHING' })
    } else if (number == '5') {
      client.user.setActivity(` ${client.giveawaysManager.giveaways.length} giveaways!`, { type: 'WATCHING' })
    }
  }, 5000)

  console.log('\n')
  console.log(`Loading commands...`)

  commandFiles.forEach((file) => {
    var command = require(`./commands/${file.split('.')[0]}`)

    console.log(`Loaded command ${file}`)
    client.commands.set(command.name, command)
    commands.push({
      name: commands.name,
      topic: command.topic,
      example: command.example
    })
  })

  Array.from(client.guilds.cache).forEach((g) => {
    if(g[1].owner == null){
      console.log(`${g[1].name}`)
      return
    }
    
    console.log(`${g[1].name} - ${g[1].owner.id}`)
  })

  var b = JSON.parse(fs.readFileSync(`${__dirname}/db/blacklist.json`).toString())

  blacklisted = b

  console.log(`${blacklisted.length} people are blacklisted.`)

  var servers = await client.db.collection('guild-info').find({}).toArray()

  servers.forEach(async (s) => {
    client.cache.guilds[s.id] = s

    if(s.autogames){
      var messages = await client.channels.cache.get(s.autogamesInfo.channel).messages.fetch({ limit: 1})

      var lm = messages.first()

      if(lm){
        if(lm.author.id == client.user.id){
          await lm.delete()
        }
      }

      client.startAutoGames({ guild: client.guilds.cache.get(s.id), channel: client.channels.cache.get(s.autogamesInfo.channel) })
    }
  })

  Array.from(client.guilds.cache).forEach((g) => {
    if (!g[1].owner) {
      return
    }
    
    if(client.cache.guilds[g[1].id] == undefined){
      console.log(`Calling guild-create for ${g[1].name}`)

      client.emit('guildCreate', g[1])
      
    }

    console.log(`${g[1].name} - ${g[1].owner.id}`)
  })
})

client.on('guildCreate', async (guild)=>{
  var d = {
    id: guild.id,
    owner: guild.ownerID,
    shard: guild.shardID,
    autogames: false,
    leaderboard: []
  }

  var e = await client.db.collection('guild-info').find({ id: guild.id })

  if (e[0] != undefined) {
    await client.db.collection('guild-info').deleteOne({ id: guild.id })
  }

  await client.db.collection('guild-info').insertOne(d)
  client.cache.guilds[guild.id] = d
})

client.on('guildDelete', async (guild)=>{
  await client.db.collection('guild-info').deleteOne({ id: guild.id })
})

client.on('messageReactionAdd', (r, u) => {
  if (u.bot) {
    return
  }

  if (client.reactions[r.message.id] == undefined) {
    return
  }

  if (client.reactions[r.message.id].reaction == r.emoji.name) {
    client.reactions[r.message.id].u.push(u.id)
  }
})

client.on('messageReactionRemove', (r, u) => {
  if (u.bot) {
    return
  }

  if (client.reactions[r.message.id] == undefined) {
    return
  }

  if (client.reactions[r.message.id].reaction == r.emoji.name) {
    client.reactions[r.message.id].u.forEach((id, n) => {
      if (id == u.id) {
        client.reactions[r.message.id].u.splice(n, 1)
      }
    })
  }
})

client.on('warn', (e) => {
  console.error(r)
})

client.on('error', (e) => {
  console.error(e)
})

client.on('shardError', (e) => {
  console.error(e)
})

client.on('shardDisconnect', (id) => {
  console.log(`Shard ${id} has disconnected`)
})

client.on('shardReady', (id) => {
  console.log(`Shard ${id} is ready.`)
})

client.on('rateLimit', (data) => {
  console.log(`I got ratelimited! ${data.path} ${data.method} ${data.limit} ${data.timeout} ${data.timeDifference} ${data.route}`)
})

client.on('guildCreate', (guild) => {
  var channel = Array.from(guild.channels.cache)[1]

  if(!channel || channel.type != 'text'){
    return
  }

  var e = new Discord.MessageEmbed()
  e.setTitle(`Bread!`)
  e.setURL(`https://discord.com/oauth2/authorize?client_id=749674433123188908&scope=bot&permissions=470117456`)
  e.setDescription(`Hello, I'm your bot for gaming. My name is Bread and I was created by the Null Development Team! I have a lot of gaming commands. You can use me to play Simon Says, Rock Paper Scissors and more. Invite me now by click the embed link! You can vote for me on top.gg to unlock some perks.`)

  e.setColor(client.defaultColor)
  e.setThumbnail(client.user.displayAvatarURL())
  e.setFooter(`You can also vote for me on top.gg!`)

  channel.send(e)
})

client.on('message', (message) => {
  if (message.channel.type != 'dm') {
    return
  }

  if (client.rps[message.author.id] == '') {
    client.rps[message.author.id] = message.content.toLowerCase()
    message.channel.send(`Ok, cool bro.`)
  }
})

client.on('message', (message) => {
  if (message.author.bot || message.channel.type == 'dm') {
    return
  }

  if(!client.cache.guilds[message.guild.id]){
    return
  }

  if (!message.guild.member(client.user.id).hasPermission('SEND_MESSAGES')) {
    return
  }

  var allowed = true

  blacklisted.forEach((id) => {
    if (message.author.id == id) {
      allowed = false
    }
  })

  if (allowed == false) {
    return
  }


  var prefix = 'bread!'

  if (message.content.search(client.user.id) != -1) {
    var e = new Discord.MessageEmbed()
    e.setTitle(`Bread!`)
    e.setDescription(`Hello, I'm Bread your favorite bot for games on Discord. I have simon says, RPS, etc. Join my support server if you need help with me.`)
    e.setFooter(`Made by Null Development`)
    e.setColor(client.defaultColor)
    e.setURL(`https://discord.gg/EzecfUX`)

    e.setThumbnail(client.user.displayAvatarURL())
    message.channel.send(e)
  }

  if (message.content.startsWith(prefix) || message.content.startsWith(`bd!`)) {
    var command = message.content.split(' ')[0].replace(prefix, '')

    if(command.startsWith('bd!')){
      command = command.replace(`bd!`, '')
    }

    if (command == 'help') {
      // client.channels.cache.get(`756254786231206039`).send(`Command: ${command.toLowerCase()}`)

      var c = client.commands.array()

      var d = {}

      c.forEach((i) => {
        if (d[i.topic] == undefined) {
          d[i.topic] = ``
        }

        if (i.topic == null) {
          /* Private Commands */
          return
        }

        d[i.topic] += `${prefix}${i.name} - ${i.description}\n`
      })

      var topic = message.content.split(' ')[1]

      if (topic != undefined) {
        if (d[topic] == undefined) {
          return
        }

        var e = new Discord.MessageEmbed()
        e.setTitle(`Bread - ${topic}`)

        e.setDescription(d[topic])
        e.setFooter(`Made by the Null Development Team`)

        e.setColor(client.defaultColor)

        e.setThumbnail(client.user.displayAvatarURL())

        message.channel.send(e)
        return
      }

      var e = new Discord.MessageEmbed()

      e.setTitle(`Bread - Help Commands`)
      Object.keys(d).forEach((k) => {
        if (k == 'null' || k == 'says') {
          return
        }

        e.addField(`${k.toUpperCase()}`, `${prefix}help ${k.toLowerCase()}`, true)
      })

      e.setFooter(`Made by the Null Development Team`)

      e.setColor(client.defaultColor)

      e.setThumbnail(client.user.displayAvatarURL())

      message.channel.send(e)
    }

    if (command == 'reload') {

      if (message.author.id != '714544278478520331') {
        return message.react('🔒')
      }

      var args = message.content.split(' ')[1]

      if (args) {
        try {

          delete require.cache[require.resolve(`./commands/${args}.js`)]
          var command = require(`./commands/${args}.js`)
        }
        catch (err) {
          console.error(err)
          return message.channel.send(`Could not load command. Doesn't exist`)
        }

        console.log(`Loading command ${command}`)

        client.commands.set(command.name, command)

        commands.forEach((c, i) => {
          if (c.name == args) {
            command.splice(i, 1)
          }
        })

        commands.push({
          name: commands.name,
          topic: command.topic,
          example: command.example
        })

        message.channel.send(`Loaded command \`${args}\`.`)
        return
      }

      client.reload()
      // client.channels.cache.get(`756254786231206039`).send(`Command: ${command.toLowerCase()}`)
      var commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'))

      client.commands = new Discord.Collection()
      commands = []

      console.log(`Reloading commands...`)

      commandFiles.forEach((file) => {
        delete require.cache[require.resolve(`./commands/${file.split('.')[0]}.js`)]
        var command = require(`./commands/${file.split('.')[0]}`)

        console.log(`Loaded command ${file}`)
        client.commands.set(command.name, command)
        commands.push({
          name: commands.name,
          topic: command.topic,
          example: command.example
        })
      })

      message.channel.send(`${commands.length} commands have been reloaded.`)
    }

    var c = client.commands.get(command.toLowerCase())

    if (!c) {
      return
    }

    statcord.postCommand(command.toLowerCase(), message.author.id)

    // client.channels.cache.get(`756254786231206039`).send(`Command: ${command.toLowerCase()}`)

    try {
      c.run(client, message)
    }
    catch (err) {
      var id = Math.floor(Math.random() * 9999999) + 1
      console.log(`[${id}] ${err}`)

      message.channel.send(`Something bad happened while running that command. Please contact a developer with this id: \`${id}\` `)
    }

    var n = Math.floor(Math.random() * 10) + 1


    if(n == 5){
      p = pt[Math.floor(Math.random() * pt.length)]

      message.channel.send(`*PROTIP ${p}*`)
    }
  }
})

client.login(process.env.TOKEN)