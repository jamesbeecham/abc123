var database = require('../Database/index.js').database;

var modelName = 'units';

module.exports = function(database, dataTypes) {
    return database.define(modelName,
    { // Attributes
        	Username:  		dataTypes.STRING,
		Password:		dataTypes.STRING,
		Privilege:		dataTypes.INTEGER,
		VM:				dataTypes.ARRAY(dataTypes.STRING)
	});
};
