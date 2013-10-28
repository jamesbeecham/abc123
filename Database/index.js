var ModelsDirectory = '../Models';

var Models = require(ModelsDirectory);
var Sequelize = require('sequelize');
var DBConfig = require('./DatabaseCreds.js');

// Initialize database connection
var database = new Sequelize(DBConfig.Name, DBConfig.User, DBConfig.Password, {
    dialect: DBConfig.Dialect,
	port: 5432,
	omitNull: true,
	logging: false,
	define : {
		freezeTableName : true
	}
});

// Load the models
for (var model in Models) {
	console.log(ModelsDirectory+'/'+model+'.js');
    module.exports[model] = database.import(__dirname + '/' + ModelsDirectory + '/' + model + '.js');
}

database.sync().success(function () {
	console.log('Success creating table');
	}).error( function (err) {
		console.log('failed : ' + err);
	});

// Export the database connection
exports.database = database;
