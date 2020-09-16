module.exports = {
  name: 'eval',
  topic: null,
  example: null,
  run: (client, message) => {
    if (message.author.id != '714544278478520331') {
      return
    }

    var code = message.content.replace(message.content.split(' ')[0], '').replace(' ', '')

    if (code == '') {
      return message.channel.send(`i can't eval nothing`)
      return
    }

    try {
      var r = eval(code)

      if (r == undefined) {
        r = `(Nothing was returned)`
      }

      if (typeof r == 'string') {
        if (r.search(client.token) != -1) {
          return message.channel.send('message contains token.')
        }
      }else if(typeof r == 'object'){
        r = JSON.stringify(r)

        if (r.search(client.token) != -1) {
          return message.channel.send('message contains token.')
        }
      }


      message.channel.send(r)
    }
    catch (err) {
      message.channel.send(`An error occured. ${err}`)
    }
  }
}