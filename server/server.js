const express = require('express')
const path = require('path')
const publicPath = path.join(__dirname, '..', 'public')
const models = require('./models')
const session = require('express-session')
const expressGraphQL = require('express-graphql')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const MongoStore = require('connect-mongo')(session)
const schema = require('./schema/schema')
const passport = require('passport')
const passportConfig = require('./services/auth')
const port = 4000;

const app = express()

// Replace with your mongoLab URI
const MONGO_URI = 'mongodb://localhost:27017';
if (!MONGO_URI) {
  throw new Error('You must provide a MongoLab URI');
}

// db
mongoose.connect(
  MONGO_URI,
      {   
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
      },
  )
  .then(() => console.log('DB Connected'))

mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`)
})

// Configures express to use sessions.  This places an encrypted identifier
// on the users cookie.  When a user makes a request, this middleware examines
// the cookie and modifies the request object to indicate which user made the request
// The cookie itself only contains the id of a session; more data about the session
// is stored inside of MongoDB.
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'aaabbbccc',
  store: new MongoStore({
    url: MONGO_URI,
    autoReconnect: true
  })
}))

app.use(bodyParser.json());

// Passport is wired into express as a middleware. When a request comes in,
// Passport will examine the request's session (as set by the above config) and
// assign the current user to the 'req.user' object.  See also servces/auth.js
app.use(passport.initialize());
app.use(passport.session());

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}))

app.use(express.static(publicPath))

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'))
})

app.listen(port, () => {
  console.log('Server is up!');
})
