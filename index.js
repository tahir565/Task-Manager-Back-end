var express = require('express')
require('./db/mongoose')
var userRouter = require('./routers/user')

var app = express()
app.use(express.json())
app.use(userRouter)

app.listen(3000, () => {
  console.log("App is listening port number 3000")
})
