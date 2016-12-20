var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var componentSchema = new Schema({});

module.exports = mongoose.model('prereqdata', componentSchema);