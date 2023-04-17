import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errorss

import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { registerUser, logIn } from './controllers/UserController.js';
import { intermediateRulesOfLove, playRulesOfLove } from './controllers/RulesOfLoveController.js';
import { playCopycat } from './controllers/CopycatController';

const app: Express = express();
app.set('view engine', 'ejs');
app.use(express.static('public', { extensions: ['html'] }));

const { PORT, COOKIE_SECRET } = process.env;
const SQLiteStore = connectSqlite3(session);
const store = new SQLiteStore({ db: 'session.sqlite' });
app.use(
  session({
    store,
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
    name: 'session',
    resave: false,
    saveUninitialized: false,
  })
);

const sessionMiddleware = session({
  store: new SQLiteStore({ db: 'sessions.sqlite' }),
  secret: COOKIE_SECRET,
  cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
  name: 'session',
  resave: false,
  saveUninitialized: false,
});

app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// endpoints
app.post('/api/users', registerUser);
app.post('/login', logIn);

// rules of love
app.post('/rulesoflove/play', intermediateRulesOfLove);
app.post('/rulesoflove/:gameId', playRulesOfLove);

// copycat
app.post('/copycat/play', playCopycat);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
