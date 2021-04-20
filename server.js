const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();

//app
const app = express();

//database connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected'));

//middlewares

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

//applying cors
if (process.env.NODE_ENV === 'production') {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

//routes
app.get('/api', (req, res, next) => {
  res.json({ message: '💣' });
});

//port
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
