var database = require('../Database/index.js').database;

var modelName = 'login';

module.exports = function(database, dataTypes) {
    return database.define(modelName,
    { // Attributes
        	Username:  		dataTypes.STRING,
		Password:		dataTypes.STRING,
		PasswordSalt:		dataTypes.STRING,
		Privilege:		dataTypes.INTEGER,
		Table:			dataTypes.STRING
	});
};
