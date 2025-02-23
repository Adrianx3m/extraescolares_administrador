const express       = require('express');
const logger        = require('morgan');
const bodyParser    = require('body-parser');
const cors          = require('cors');
const path          = require("path");

const http = require('http');

const app = express();

app.use(cors({origin:"*"}))
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("client/build"));

require('./routes')(app);

app.get("/", (req, res) => {
     res.sendFile(path.join(__dirname, "client/build", "index.html"));
   });
   app.get('*', (req,res) =>{
     res.sendFile(path.join(__dirname,'client/build','index.html'));
 });
//app.get('*', (req, res) => res.status(200).send({
 //    message: 'Route was not found.',
//}));
const port = parseInt(process.env.PORT, 10) || 80;
app.set('port', port);
const server = http.createServer(app);
server.listen(port);
module.exports = app;