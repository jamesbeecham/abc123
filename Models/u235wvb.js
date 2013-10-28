var database = require('../Database/index.js').database;

var modelName = 'u235wvb';

module.exports = function(database, dataTypes) {
    return database.define(modelName,
    { // Attributes
        	Name:  		dataTypes.ARRAY(dataTypes.STRING),
		Email:		dataTypes.ARRAY(dataTypes.STRING),
		PhoneNumber:	dataTypes.ARRAY(dataTypes.STRING),
		Unit:		dataTypes.STRING
    });
};
