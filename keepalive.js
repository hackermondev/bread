const express = require('express')
const port = process.env.PORT || 3000

app = express()

app.get('/', (req, res)=>{
  res.status(200)
  res.end('bread')
})

app.listen(port, ()=>{
  console.log(`Server started on ${port}`)
})