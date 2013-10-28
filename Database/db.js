//db interface
//var LOG = require('../Lib/Logging/nlogger').logger(module);
var sequelize = require('./sequelize_db');
var http                    = require('http');

/* From here to the next comment is our database */
var VMStats = new Array();
var NodeStats = new Array();
var RegisteredNodes = new Array();
var VMCount = new Array();
var pending = {};
var vmUsages = {};
var vmNames = {};
var nodeID = 0;

exports.doesVmExist = function (name) {
	if (vmNames.hasOwnProperty(name))
		return vmNames[name];
	else
		return -1;
}

exports.isNodeActive = function (nodeID) {
	if (nodeID >= VMCount.length)
		return -1;
	else if (VMCount[nodeID] == null)
		return -1;
	else if (VMCount[nodeID].active == 0)
		return -1;
	else
		return 0;

}

/* DONE */
exports.nodeStatsUpdate = function (update) {
	if (typeof update.NodeID == 'undefined')
		return;
	NodeStats[update.NodeID] = update;
	sequelize.addDbEntry('HostNodeUsage', update, null, null);
}

exports.removeUser = function (callback, callback_args, username) {
	sequelize.removeDbEntry('Users', { where : {Username : username}}, null, callback, callback_args);
}

exports.removeVmEntry = function (name) {
	if (vmNames.hasOwnProperty(name))
		delete vmNames[name];

	sequelize.removeDbEntry('VirtualMachine', { where : { Name : name}}, {}, null, null);
}

/* DONE */
exports.pullNodeStats = function () {
	var arr = new Array();
	
	for (var ii = 0; ii < NodeStats.length; ii++) {
		if (NodeStats[ii] != null)
			arr.push(NodeStats[ii]);
	}
	return arr;
}
/* DONE */
exports.selectNode = function (callback, callback_args) {
	/* For now going to select nodes based upon number of vms running on 
     * the node  */
	LOG.debug('Selecting node');
	var vmcount = 9999;
	
	if (VMCount.length == 0) {
		LOG.error('No nodes attached to create a VM!!!');
		callback_args['id'] = -1;
		callback(callback_args);
		return;
	}
	
	var selected_node = 0;
	for (var ii = 0; ii < VMCount.length; ii++) {
		var current_node = VMCount[ii];
		if (current_node == null)
			continue;
		if( current_node.active && current_node.count <= vmcount ) {
			vmcount = current_node.count;
			if (DEBUG) LOG.debug('Picking node ' + ii);
			selected_node = ii;
		}
	}

	callback_args['id'] = selected_node;
	exports.lookupNodeAddr(selected_node, callback, callback_args);
	return;
}

/* DONE */
exports.pullVmUsages = function () {
	var usage = new Array();
	for (var ii in vmUsages)
		usage.push(vmUsages[ii]);

	return usage;
}

/* DONE */
exports.vmUsageUpdate = function (updateArr) {
	for (var ii = 0; ii < updateArr.length; ii++) {
		vmUsages[updateArr[ii].Name] = updateArr[ii];
		sequelize.addDbEntry('VirtualMachineUsage', updateArr[ii]);
	}
}

/* DONE */
exports.vmStatsUpdate = function (updateArr) {
	//INFO: the node attaches its ID to the last element of a status update arr
	var id = updateArr.pop();
	VMCount[id] = { count : updateArr.length, active : 1};
	
	for (var ii = 0; ii < updateArr.length; ii++) {
		var name = updateArr[ii].Name;
		//:TODO is there a better way for this? Need names to make stat pulling easier
		vmNames[name] = id;
		sequelize.lookupOrAddDbEntry('VirtualMachine', updateArr[ii], { Name: name}, null, null);
	}
}

/* DONE */
exports.pullVmStats = function (callback, callback_args) {
	callback_args['usages'] = vmUsages;
	sequelize.getDbEntries('VirtualMachine', callback, callback_args);
	return;
}	

/* DONE */
exports.nodeConnected = function (socketId, ipAddr, callback) {
	var params = { SocketID : socketId, Address : ipAddr, Active : 1 };
	sequelize.findAndCountAll('HostNode', {}, {}, exports.addNode, params);
}

/* DONE */
exports.addNode = function (params) {
         if (!params.hasOwnProperty('SocketID')) {
             LOG.error('missing SocketID property for node assignment');
             //:FIXME implement auto reconnect
             return;
         }
         if (!params.hasOwnProperty('Address')) {
             LOG.error('missing Address property for node assignment');
             //:FIXME implement auto reconnect
             return;
         }
         if (!params.hasOwnProperty('count')) {
             LOG.error('missing count property for node assignment');
             //:FIXME implement auto reconnect
             return;
         }
         if (!params.hasOwnProperty('rows')) {
             LOG.error('missing rows property for node assignment');
             //:FIXME implement auto reconnect
             return;
         }
         var count = params['count'];
         var socketId = params['SocketID'];
         var ipAddr = params['Address'];
         var rows = params['rows'];
         var assigned_node = count;

         for (var ii = 0; ii < rows.length; ii++) {
             var node = rows[ii];
             if (node.Address == ipAddr) {
                 node.SocketID = socketId;
                 node.Active = 1;
                 if (DEBUG) LOG.debug('Node ' + node.NodeID + ' has reconnected');
                 node.save().error(function (err) {
                     LOG.error(err);
                     //:FIXME wtf to do here??
                 }).success(function (host_node) {
					exports.sendNodeAssignment({ Address: host_node.Address, NodeID : host_node.NodeID});
                 });
				break;
			 }
		}
		
		if (ii != rows.length) return;

		var host_node = new hostNode();

		host_node.Address = ipAddr;
		host_node.SocketID = socketId;
		host_node.Active = 1;
		host_node.NodeID = assigned_node;
			
		sequelize.addDbEntry('HostNode', host_node, exports.sendNodeAssignment,
			{ Address : host_node.Address, NodeID : host_node.NodeID});
}

exports.addLoginEntry = function (login_entry, callback) {
	sequelize.addDbEntry('login', login_entry, callback, null);
}
/* DONE */
exports.sendNodeAssignment = function (params) {
         if (!params.hasOwnProperty('Address')) {
             LOG.error('missing ip Address param to send node assignement');
             //FIXME auto reonnect?
             return;
         }
         if (!params.hasOwnProperty('NodeID')) {
             LOG.error('missing nodeID param to send node assignement');
             //FIXME auto reconnect?
             return;
         }
         var address = params['Address'];
         var nodeID = params['NodeID'];
         var route = new URL('http', address, 8083, CommProtocol.NodeAssignment, 'NodeID='+nodeID);
         LOG.debug('node route ' + route.FullPath());
		
       http.get(route.FullPath(), function (res) {
             if (DEBUG) LOG.debug('here is status code ' + res.statusCode);
             res.on('data', function (chunk) {
                 if (DEBUG) LOG.debug('Got resp sending back to web ' + res.statusCode);
             });
         }).on('error', function (e) {
             LOG.error(e.message);
         });
         return;


}
/* DONE */
exports.deactivateNode = function (params) {
	if (!params.hasOwnProperty('entry')) {
		LOG.error('missing parameter entry in deactivate node');
		return;
	}

	var node = params['entry'];

	VMCount[node.NodeID].active = 0;
	node.Active = 0;
	node.save();
	return;
}

exports.updateUserParams = function (callback, callback_args, db_params) {
	try {
		sequelize.lookupOrAddDbEntry('Users', db_params, { Username : db_params.Username}, callback, callback_args);
	}
	catch (err) {
		LOG.error(err);
	}
}

exports.addUser = function (callback, callback_args, db_params) {
	
	sequelize.addDbEntry('Users', db_params, callback, callback_args);
}

exports.lookupAllUsers = function (searchKey, callback, callback_args) {
	if (Object.keys(searchKey).length == 0)
		sequelize.getDbEntries('Users', callback, callback_args);
	else
		sequelize.findAll('Users', callback, callback_args, searchKey);
}

/* DONE */
exports.nodeDisconnected = function (socketId) {
	var params = {};
	LOG.debug('node left ' + socketId);
	sequelize.getDbEntry('HostNode', { where: { SocketID : socketId}},
							{}, exports.deactivateNode, params);
}
/* DONE */
exports.sendSpiceUrl = function (params) {
	LOG.debug('Sending spiceUrl');
	if (!params.hasOwnProperty('entry')) {
		LOG.error('missing node from send spice URL');
		return;
	}
	if (!params.hasOwnProperty('port')) {
		LOG.error('missing port number from send spice URL');
		return;
	}
	if (!params.hasOwnProperty('Resp')) {
		LOG.error('missing response obj from send spice URL');
		return;
	}

	var node = params['entry'];
	var port = params['port'];
	var resp = params['Resp'];
	LOG.info('look ' + params.toString());

	var ipAddr = node.Address;
	
	resp.send('spice://' + ipAddr + ':' + port);
}

/* DONE */	
exports.lookupNodeId = function (name, callback, callback_args) {
	LOG.debug('Looking up node id ' + name);
	sequelize.getDbEntry('VirtualMachine', {where : { Name : name}}, {}, callback, callback_args);
}
/* DONE */
exports.lookupSpiceAddr = function (params) {
	LOG.debug('Looking up spicePort');
	if (!params.hasOwnProperty('entry')) {
		LOG.error('missing vm from lookup spice port');
		return;
	}
	
	var vm = params['entry'];
	var spicePort = vm.spicePort;
	LOG.debug('Look 2 ' + JSON.stringify(vm));
	var id = vm.NodeID;

	params['port'] = spicePort;

	sequelize.getDbEntry('HostNode', { where: { NodeID : id}}, {},
		exports.sendSpiceUrl, params);
}

exports.lookupNodeAddr = function (selected_node, callback, callback_args) {
	LOG.debug('Looking up node addr');
	sequelize.getDbEntry('HostNode', {where : { NodeID : selected_node}}, {},
						callback, callback_args);
}

exports.LookupNodeId = function (vmName) {
	var return_id = -1;
	LOG.debug('Looking up node id ' + vmName);

	VMStats.forEach(function(stats) {
		for(var vmStatus in stats) {
			if (stats[vmStatus].Name == vmName) {
				return_id = stats[vmStatus].NodeID;
			}
		}
	});

	return return_id;
}

exports.getSpicePort = function (name) {
	var port = null;
	
	VMStats.forEach(function(stats) {
		for(var vmStatus in stats) {
			LOG.debug('ll ' + JSON.stringify(stats));
			if ( stats[vmStatus].Name == name ) {
				port = stats[vmStatus].spicePort;
				break;
			}
		}
	});	
	
	return (port == null) ? 'Error: VM not found' : port;
}
/* End database */


