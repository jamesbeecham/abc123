//db interface
//var //LOG = require('../Lib/Logging/nlogger').logger(module);
var sequelize = require('./sequelize_db');
var http                    = require('http');

exports.searchForUnit = function (unit, , table, callback, params) {
	console.log('searching for unit#' + unit);
	if (unit.length == 0) {
		console.log('error: unit search empty');
		params.Response.redirect('/');
	}

	sequelize.getDbEntry(tables, { where : { Unit: unit}}, {}, checkUnitSearch, params);
}

exports.addLoginEntry = function (login_entry, callback) {
	sequelize.addDbEntry('login', login_entry, callback, null);
/* End database */


