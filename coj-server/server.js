const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
mongoose.connect('mongodb://root:123@ds139904.mlab.com:39904/dbcoj');

const restRouter = require('./routes/rest');
const indexRouter = require('./routes/index');

app.use(express.static(path.join(__dirname, '../public')));
app.use('/', indexRouter);
app.use('/api/v1', restRouter);
app.use(function(req, res, next) {
   res.sendFile('index.html', { root: path.join(__dirname, '../public')});
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});