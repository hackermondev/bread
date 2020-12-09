module.exports = {
  name: 'restarting',
  topic: null,
  example: null,
  run: (client, message) => {
    if (message.author.id != '714544278478520331') {
      return
    }

    var reason = message.content.replace(message.content.split(' ')[0], '').replace(' ', '')

    if (reason == '') {
      return message.channel.send(client.errors.customError(`Please include a reason why the bot is restarting.`))
      return
    }

    Object.keys(client.cache.guilds).forEach((k)=>{
      a = client.cache.guilds[k]

      if(!a.autogames){
        if(client.ss[k]){
          client.ss[k] = undefined
          
          channel.send(`> **Bread** is restarting, ending game. \n\n>\` *${reason} - ${message.author.tag}*\` `)
        }
        return
      }

      var channel = client.channels.cache.get(a.autogamesInfo.channel)

      if(!channel){
        return
      }

      if(client.ss[k]){
        client.ss[k] = undefined
        client.reset({ guild: client.guilds.cache.get(k) })
      }

      channel.send(`> **Bread** is restarting, ending game. \n\n\` *${reason} - ${message.author.tag}*\` `)

      client.cache.guilds[k].autogames = false
    })

    message.delete()
  }
}