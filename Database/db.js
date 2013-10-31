//db interface
//var //LOG = require('../Lib/Logging/nlogger').logger(module);
var sequelize = require('./sequelize_db');
var http                    = require('http');
var routes = require('../routes/index.js');
var mail = require('../node-email-templates/examples/nodemailer/index.js');
var login = require('../login.js');

function checkUnitSearch (params) {
	if (params.Code == 1)
                console.log('Database access failed!! ' + params.Messsage);
		//TODO FIXME NEED TO THIS FOR EVERY DB ACCESS 
        if (params.entry == null) {
		//TODO error string would go here
		console.log('unit not found ' + params.unitQuery);
                params.Response.redirect('/');
                return;
        } else if (params.entry.Unit != params.unitQuery) {
                params.Response.redirect('/');
                return;
        } else {
		console.log('here we are, we should be going');
		routes.external(params.Request, params.Response, params.entry);
                return;
        }
}
function updateUnitSeqNumber (params) {
	//FIXME check code here I guess?
	if (params['Code'] == 1)
		console.log('Shit adding to pending failed');
	console.log('here is table id before calling ' + params.TableId);
	var updatedSeq = parseInt(params.pendingSeqNum, 10) + 1;
	sequelize.lookupOrAddDbEntry(params.TableId, { SeqNumber: updatedSeq}, { Unit: params.pendingUnit}, 
					function (params) {
						console.log('fuck code ' + params.Code);
						params.HTTP.Response.render(params.renderPage);}, params);
}

function renderPending (params) {
	if (params.Code == 1)
		console.log('shit pending failed');

	console.log('before pending ' + params.entries);
	routes.pickup(params.Request, params.Response, params.entries);
}

exports.saveSignature = function (table, Unit, Seq, sig) {
	sequelize.addDbEntry(table, { unit: Unit, seqnumber : Seq, signature: sig}, function () { console.log('DONE!');}, null);
}	

exports.getPending = function (table, req, res) {
	if (login.isLoggedIn(req) == 1) {
                res.redirect('/login');
                return;
 
        }
	console.log('get pending for ' + table);
	sequelize.getDbEntries(table, renderPending, { Request: req, Response: res});
}

exports.searchForUnit = function (unit, table, callback, params) {
	console.log('searching for unit#' + unit);
	if (unit.length == 0) {
		console.log('error: unit search empty');
		params.Response.redirect('/');
	}
	params['unitQuery'] = unit;
	sequelize.getDbEntry(table,{ where: { Unit: unit}}, {}, checkUnitSearch, params);
}

exports.addToPending = function (table, callback_args) {
	sequelize.addDbEntry(table, {Unit: callback_args.pendingUnit, SeqNumber: callback_args.pendingSeqNum}, updateUnitSeqNumber, callback_args)
}
 
exports.addUnitEntry = function (unit, table, callback) {
	sequelize.addDbEntry(table, unit, callback, null);
}
exports.addLoginEntry = function (login_entry, callback) {
	sequelize.addDbEntry('login', login_entry, callback, null);
}
/* End database */


