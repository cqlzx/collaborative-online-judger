const express = require('express');
const indexRouter = express.Router();
const path = require('path');

indexRouter.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '../../public')});
});

module.exports = indexRouter;