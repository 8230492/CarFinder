const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const config = require('./config');
const router = require('./router');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const hostname = '127.0.0.1';
const port = 5000;

var app = express();
app.use(cookieParser());
app.use(router.initialize());

const corsOptions = { 
	origin: 'http://127.0.0.1:5000', 
	optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
const server = http.Server(app);

mongoose.connect(config.db)
.then(() => console.log('Conexão com a base de dados efetuada com sucesso'))
.catch((err) => console.error(err));

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});