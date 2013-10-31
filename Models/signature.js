var database = require('../Database/index.js').database;

var modelName = 'signature';

module.exports = function(database, dataTypes) {
    return database.define(modelName,
    { // Attributes
		Unit:		'VARCHAR(255)',
		SeqNumber:	dataTypes.INTEGER,
		Signature:	'VARCHAR(30000)'
    });
};
