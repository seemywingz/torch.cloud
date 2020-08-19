var express = require('express');
var app = express();
var port = 80

// app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.static('srv'))
app.listen(port);
