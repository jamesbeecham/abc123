var Models = require('../Database/index.js');
/*****************************************************************/
/******************************************************************/
var VM = Models.VirtualMachine;
var Disk = Models.VirtualDisk;
var VMUsage = Models.VirtualMachineUsage;
var NodeUsage = Models.HostNodeUsage;
var Nodes = Models.HostNode;
/*******************************************************************/
/*******************************************************************/
var softVmStats = new Array();
var softNodeStats = new Array();

createOrUpdateParams = function (database_object, data_source, params) {
	for (var prop in data_source) {
	 	var obj = data_source[prop];
		if ((obj instanceof Object) && !(obj instanceof Array)) {
			createOrUpdateParams(database_object, obj, params);
		} else {
			if (database_object.hasOwnProperty(prop) ||
				database_object.rawAttributes.hasOwnProperty(prop))
				params[prop] = obj;
			console.log('look here for prop ' + prop);
		}
	}
}

exports.getSpicePort = function (name) {
	VM.find(name).error( function (err) {
		//LOG.error(err);
		return {message : err};
	}).success( function (vm) {
		//LOG.debug(vm.spicePort);
		return vm.spicePort;
	});
}

exports.findAll = function (table, callback, callback_args, searchKey) {
	var entries = new Array();
	Models[table].findAll({ where: searchKey})
		.error( function (err) {
			//LOG.error(err);
			if (callback != null) {
				callback_args['Code']=1;
				callback_args['Message'] = err.message;
				callback(callback_args);
			}
		})
		.success(function (result) {

		if (result != null) {
			for (var ii = 0; ii < result.length; ii++) {
				entries[ii] = result[ii].selectedValues;
				//Remove the time stamps
				delete entries[ii].createdAt;
				delete entries[ii].updatedAt;
			}
		}

		callback_args['entries'] = entries;
		callback(callback_args);
		});
}

exports.removeDbEntry = function (table, searchKey, searchOptions, callback, callback_args) {
	Models[table].find(searchKey, searchOptions)
		.error ( function (err) {
			//LOG.error(err);
			if (callback != null) {
				callback_args['Code']=1;
				callback_args['Message'] = err.message;
				callback(callback_args);
			}
		})
		.success (function (entry) {
			entry.destroy().error( function (err) {
				if (callback != null) {
					callback_args['Code']=1;
					callback_args['Message'] = err.message;
					callback(callback_args);
				}
			})
			.success(function () {
				if (callback != null)
					callback(callback_args);
			});
		});
}

exports.getDbEntry = function (table, searchKey, searchOptions, callback, callback_args) {
	console.log(searchKey.toString()+'\n');
	Models[table].find(searchKey, searchOptions)
		.error( function (err) {
			//LOG.error(err);
			console.log(err);
			if (callback != null) {
				callback_args['Code']=1;
				callback_args['Message'] = err.message;
				callback(callback_args);
			}
		})
		.success( function (entry) {
			console.log('success\n'+ JSON.stringify(entry));
			callback_args['entry'] = entry;
			callback_args['Code'] = 0;
			//LOG.debug('Success looking up calling callback?');
			if (callback != null ) {
				//LOG.debug('yes calling');
				callback(callback_args);
			}
			return;
		});
}

exports.findAndCountAll = function (table, searchKey, searchOptions, callback, callback_args) {
	Models[table].findAndCountAll(searchKey, searchOptions)
		.error( function (err) {
			//LOG.error(err);
			if (callback != null) {
				callback_args['Code']=1;
				callback_args['Message'] = err.message;
				callback(callback_args);
			}
		})
		.success( function (result) {
			callback_args['count'] = result.count;
			callback_args['rows'] = (result.count == 0) ? [] : result.rows;
			
			callback(callback_args);
			return;
		});
}

exports.addDbEntry = function (table, data, callback, callback_args) {
	var params = {};
	createOrUpdateParams(Models[table], data, params);
	Models[table].create(params)
		.error(function (err) {
			//LOG.error(err);
			if (callback != null) {
				callback_args['Code']=1;
				callback_args['Message'] = err.message;
				callback(callback_args);
			}
	
		})
		.success(function (entry) {
			if (callback != null)
				callback(callback_args);
			return;
		});
}

exports.getDbEntries = function (table, callback, callback_args) {
	var entries = new Array();
	Models[table].all({raw: true}).success(function (result) {
		for (var ii = 0; ii < result.length; ii++) {
			entries[ii] = result[ii].selectedValues;
			console.log(entries[ii]);
		}
		callback_args['entries'] = entries;
		callback(callback_args);
	}).error(function (err) {
		console.log(err);
		//LOG.error(err);
		if (callback != null) {
			callback_args['Code']=1;
			callback_args['Message'] = err.message;
			callback(callback_args);
		}
	});
}

exports.lookupOrAddDbEntry = function (table, data, primaryKey, callback, callback_args) {
	var params = {};
	console.log(primaryKey);
	createOrUpdateParams(Models[table], data, params);
	Models[table].findOrCreate(primaryKey, params)
		.error(function (err) {
			console.log(err);
			if (callback != null) {
				callback_args['Code']=1;
				callback_args['Message'] = err.message;
				callback(callback_args);
			}
	
		})
		.success(function(v, created) {
			console.log('this is dumb \n' + created + ' ' + JSON.stringify(v));
			//Check if the entry was found. If so created is false. 
			//we then need to update the fields
			if (created == false) {
				console.log('not creatd!!!!!');
				createOrUpdateParams(v, data, v);
				console.log(JSON.stringify(v));
				//All fields should be updated at this point.
				v.save().error(function(err) {
					//LOG.error(err.message);
					if (callback != null) {
						callback_args['Code']=1;
						callback_args['Message'] = err.message;
						callback(callback_args);
					}
				})
				.success(function () {
					if (callback != null)
						callback(callback_args);
				});
			}
		});
}
