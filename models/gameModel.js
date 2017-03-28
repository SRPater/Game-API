var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var gameModel = new Schema({
    title: {type: String},
    year: {type: String},
    genre: {type: String}
});

module.exports = mongoose.model('Game', gameModel);
