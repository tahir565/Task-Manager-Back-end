var express = require('express');
require('./db/mongoose');
var userRouter = require('./routers/user');
var bookRouter = require('./routers/book');
var requestRouter = require('./routers/request');

const port = process.env.PORT || 3000;

var app = express();
app.use(express.json());
app.use(userRouter);
app.use(bookRouter);
app.use(requestRouter);

app.listen(port, () => {
  console.log("App is listening port number 3000")
});
