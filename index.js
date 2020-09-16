const Discord = require('discord.js')
const fs = require('fs')
require('./keepalive')

const client = new Discord.Client({
  fetchAllMembers: true,
  disableMentions: 'everyone',
  fetchAllMembers: true
})

client.defaultColor = `#00FFFF`

client.ss = {}
client.rps = {}

client.commands = new Discord.Collection()
var commands = []

var commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'))



client.on('ready', () => {
  console.log(`I'm ready! ${client.user.tag}! ${client.guilds.cache.size} guilds and ${client.users.cache.size} users cached!`)
  
  console.log(client.user.id)
  client.user.setActivity(` ${client.guilds.cache.size} servers!`, {type: 'WATCHING'})
  setInterval(()=>{
    var number = Math.random(Math.floor() * 4) + 1

    if(number == 1){
      client.user.setActivity(` the bread`, {type: 'WATCHING'})
    }else if(number == 2){
      client.user.setActivity(` Hackermon`, {type: 'LISTENING'})
    }else if(number == 3){
      client.user.setActivity(` bread!help`, {type: 'LISTENING'})
    }else if(number == 4){
      client.user.setActivity(` ${client.guilds.cache.size} servers!`, {type: 'WATCHING'})
    }
  }, 1 * 60000)

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

  Array.from(client.guilds.cache).forEach((g)=>{
    console.log(`${g[1].name} - ${g[1].owner.id}`)
  })
})

client.on('warn', (e)=>{
  console.error(r)
})

client.on('error', (e)=>{
  console.error(e)
})

client.on('shardError', (e)=>{
  console.error(e)
})

client.on('shardDisconnect', (id)=>{
  console.log(`Shard ${id} has disconnected`)
})

client.on('shardReady', (id)=>{
  console.log(`Shard ${id} is ready.`)
})

client.on('rateLimit', (data)=>{
  console.log(`I got ratelimited! ${data.path} ${data.method} ${data.limit} ${data.timeout} ${data.timeDifference} ${data.route}`)
})

client.on('guildCreate', (guild)=>{
  var channel = Array.from(guild.channels.cache)[1]

  var e = new Discord.MessageEmbed()
    e.setTitle(`Bread!`)
    e.setURL(`https://discord.com/oauth2/authorize?client_id=749674433123188908&scope=bot&permissions=470117456`)
    e.setDescription(`Hello, I'm your bot for gaming. My name is Bread and I was created by the Null Development Team! I have a lot of gaming commands. You can use me to play Simon Says, Rock Paper Scissors and more. Invite me now by click the embed link! You can vote for me on top.gg to unlock some perks.`)

    e.setColor(client.defaultColor)
    e.setThumbnail(client.user.displayAvatarURL())
    e.setFooter(`You can also vote for me on top.gg!`)

  channel.send(e)
})

client.on('message', (message)=>{
  if(message.channel.type != 'dm'){
    return
  }
  
  if(client.rps[message.author.id] == ''){
    client.rps[message.author.id] = message.content.toLowerCase()
    message.channel.send(`Ok, cool bro.`)
  }
})

client.on('message', (message) => {
  if (message.author.bot || message.channel.type == 'dm') {
    return
  }

  if(!message.guild.member(client.user.id).hasPermission('SEND_MESSAGES')){
    return
  }

  var prefix = 'bread!'

  if (message.content.search(client.user.id) != -1) {
    var e = new Discord.MessageEmbed()
    e.setTitle(`Bread!`)
    e.setDescription(`Hello, I'm bread your favorite bot for games on Discord. I have simon says, RPS, etc. Join my support server if you need help with me.`)
    e.setFooter(`Made by Null Development`)
    e.setColor(client.defaultColor)
    e.setURL(`https://discord.gg/EzecfUX`)

    e.setThumbnail(client.user.displayAvatarURL())
    message.channel.send(e)
  }

  if (message.content.startsWith(prefix)) {
    var command = message.content.split(' ')[0].replace(prefix, '')

    if(command == 'help'){
      var c = client.commands.array()

      var d = {}

      c.forEach((i)=>{
        if(d[i.topic] == undefined){
          d[i.topic] = ``
        }

        if(i.topic == null){
          /* Private Commands */
          return
        }

        d[i.topic] += `${prefix}${i.name} - ${i.description}\n`
      })

      var topic = message.content.split(' ')[1]

      if(topic != undefined){
        if(d[topic] == undefined){
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
      Object.keys(d).forEach((k)=>{
        if(k == 'null'){
          return
        }
        e.addField(`${k.toUpperCase()}`, `${prefix}help ${k.toLowerCase()}`, true)
      })

      e.setFooter(`Made by the Null Development Team`)

      e.setColor(client.defaultColor)

      e.setThumbnail(client.user.displayAvatarURL())

      message.channel.send(e)
    }

    var c = client.commands.get(command.toLowerCase())

    if(!c){
      return
    }

    c.run(client, message)
  }
})

client.login(process.env.TOKEN)