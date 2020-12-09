const express = require('express')
const Discord = require('discord.js')
const port = process.env.PORT || 3000
const Database = require('./database')

var client = new Discord.Client()
var database = null

const cors = require('cors')

app = express()

app.use(cors({
  origin: (o, callback)=>{

    callback(null, true)
  }
}))

app.get('/', (req, res)=>{
  res.status(200)
  res.end('bread')
})

app.get('/leaderboard', async (req, res)=>{
  if(database == null){
    return res.status(503).json({
      ok: false,
      message: 'The server is down right now'
    })
  }

  var id = req.query.id
  
  if(!id){
    return res.status(403).json({
      ok: false,
      message: 'Please enter a valid id'
    })
  }

  var s = await database.collection('guild-info').find({
    id: id
  }).toArray()


  s = s[0]
  if(!s){
    return res.status(404).json({
      ok: false,
      message: 'Guild not found'
    })
  }

  if(s.leaderboard){
    s.leaderboard.forEach((a, index)=>{
      var author = client.users.cache.get(a.author)

      if(!author){
        s.leaderboard.splice(index, 1)
        return
      }

      s.leaderboard[index].user = {
        username: author.username,
        image: author.displayAvatarURL()
      }
    })
  }

  res.json({
    ok: true,
    leaderboard: s.leaderboard || []
  })
})


app.listen(port, async ()=>{
  console.log(`Server started on ${port}`)

  client.login(process.env.TOKEN)
  database = await Database.loadDatabase()
})