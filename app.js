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

app.get('/', (req, res) => {
  //get requests to the root ("/") will route here
  res.send('SERVER IS UP AND RUNNING'); //Server response by sending a text message " SERVER IS UP AND RUNNING "
});

const port = process.env.PORT || 5000; //Save the port number where your server will be listening

db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log('Error:' + err));

app.listen(port, () => {
  //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Server is up and running on port ${port}`);
});
