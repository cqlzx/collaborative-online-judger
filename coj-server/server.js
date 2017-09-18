const express = require('express');
const app = express();
const restRouter = require('./routes/rest');


app.use('/api/v1', restRouter);
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});