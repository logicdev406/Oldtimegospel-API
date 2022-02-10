const express = require('express'); //Import the express dependency
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express(); //Instantiate an express app, the main work horse of this server

//routers import
const Posts = require('./routers/posts');

//Middlewares
app.use(bodyParser.json());
app.use(cors());

//routes
app.use('/posts', Posts);

app.get('/', (req, res) => {
  //get requests to the root ("/") will route here
  res.send('SERVER IS UP AND RUNNING'); //Server response by sending a text message " SERVER IS UP AND RUNNING "
});

const port = process.env.PORT || 5000; //Save the port number where your server will be listening

app.listen(port, () => {
  //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Server is up and running on port ${port}`);
});
