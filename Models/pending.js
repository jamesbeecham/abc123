var database = require('../Database/index.js').database;

var modelName = 'pending';

module.exports = function(database, dataTypes) {
    return database.define(modelName,
    { // Attributes
		Unit:		dataTypes.STRING,
		SeqNumber:	dataTypes.INTEGER
    });
};
