const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');

const app = express();


// Database connection
mongoose.connect('mongodb://localhost:27017/UserData')
  .then(() => console.log('DB connected successfully'))
  .catch((err) =>console.error('Error in DB connection', err));
  

app.use(express.urlencoded({ extended: false }));  // Express built-in body parser for URL-encoded data
app.use(express.json());  // Add this to handle JSON requests
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
  })
);


app.set('view engine', 'ejs');

// Routes
const authroutes = require('./routes/auth');
const adminroutes=require('./routes/admin');

app.use('/', authroutes);
app.use('/',adminroutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(4000, () => {
  console.log('Server started on http://localhost:4000');
});
