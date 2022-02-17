const express = require('express'); //Import the express dependency
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express(); //Instantiate an express app, the main work horse of this server

// Database
const db = require('./db/connection');

//routers import
const Post = require('./routers/post');

//Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

//routes
app.use('/post', Post);

// Logging the rejected field from multer error
// app.use((error, req, res, next) => {
//   console.log('This is the rejected field ->', error.field);
// });

app.get('/', (req, res) => {
  //get requests to the root ("/") will route here
  res.send('SERVER IS UP AND RUNNING'); //Server response by sending a text message " SERVER IS UP AND RUNNING "
});

const port = process.env.PORT || 5000; //Save the port number where your server will be listening

// Sync all models that are not
// already in the database
db.sync({ force: true });

// Database connect
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log('Error:' + err));

app.listen(port, () => {
  //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Server is up and running on port ${port}`);
});
