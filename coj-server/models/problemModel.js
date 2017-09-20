const mongoose = require('mongoose');
const ProblemSchema = mongoose.Schema({
    id: Number,
    name: String,
    description: String,
    difficulty: String
});

const ProblemModel = mongoose.model('Problem', ProblemSchema);
module.exports = ProblemModel;