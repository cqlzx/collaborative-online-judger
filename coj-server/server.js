const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://root:123@ds139904.mlab.com:39904/dbcoj');

const restRouter = require('./routes/rest');


app.use('/api/v1', restRouter);
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});