require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config.js');
const winston = require('winston');

const app = express();

const morganOption = NODE_ENV === 'production';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: info.log })],
});

if (NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

const bookmarks = [
  {
    id,
    title,
    url,
    rating,
    desc,
  },
  {
    id: 1,
    title: 'test bookmark',
    url: 'https://www.test.com',
    rating: 3,
    desc: 'test desc',
  },
];

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ') !== apiToken) {
    return res.status(401).json({ error: 'Unathorized request' });
  }
  next();
});

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/bookmarks', (req, res) => {
  res
    .json(bookmarks);
});

app.get('/bookmarks/:id', (req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(c => c.id ==id);

    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }

    res.json(bookmark);
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
