const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const userRouter = require('./routers/user');
const bookRouter = require('./routers/book');
const requestRouter = require('./routers/request');


require('./db/mongoose');

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userRouter);
app.use(bookRouter);
app.use(requestRouter);

app.listen(port, () => {
  console.log(`App is listening port number ${port}`);
});
