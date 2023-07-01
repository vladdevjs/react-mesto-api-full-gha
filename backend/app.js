const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const authRoutes = require('./routes/auths');
const auth = require('./middlewares/auth');
const handleError = require('./middlewares/handleError');
const crashTest = require('./middlewares/crashTest');
const documentNotFound = require('./middlewares/documentNotFound');
const { port, mongoURI } = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
});

app.use(requestLogger);
app.get('/crash-test', crashTest);
app.use('/', authRoutes);
app.use('/', auth, userRoutes);
app.use('/', auth, cardRoutes);

app.use('*', documentNotFound);

app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(port, () => {
  console.log(`Прослушиваю порт ${port}`);
});
