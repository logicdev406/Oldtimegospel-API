const express = require('express'); //Import the express dependency
const app = express(); //Instantiate an express app, the main work horse of this server
const port = process.env.PORT || 5000; //Save the port number where your server will be listening
const bodyParser = require('body-parser');
const cors = require('cors');

//Middlewares
app.use(bodyParser.json());
app.options('*', cors());

app.get('/', (req, res) => {
  //get requests to the root ("/") will route here
  res.sendFile('SERVER IS UP AND RUNNING'); //Server response by sending a text message " SERVER IS UP AND RUNNING "
});

app.listen(port, () => {
  //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Server is up and running on port ${port}`);
});
