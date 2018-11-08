var http = require('http');
var https = require('https');
var qs = require('querystring');
var fibers = require('fibers');

String.prototype.format = function(args) {
	var result = this;
	if (arguments.length > 0) {
		if (arguments.length == 1 && typeof (args) == "object") {
			for (var key in args) {
				if(args[key]!=undefined){
					var reg = new RegExp("({" + key + "})", "g");
					result = result.replace(reg, args[key]);
				}
			}
		}
		else {
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i] != undefined) {
					//var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
					var reg = new RegExp("({)" + i + "(})", "g");
					result = result.replace(reg, arguments[i]);
				}
			}
		}
	}
	return result;
};

exports.post = function (host,port,path,data,callback) {
	
	var content = qs.stringify(data);  
	var options = {  
		hostname: host,  
		port: port,  
		path: path + '?' + content,  
		method:'GET'
	};  
	  
	var req = http.request(options, function (res) {  
		console.log('STATUS: ' + res.statusCode);  
		console.log('HEADERS: ' + JSON.stringify(res.headers));  
		res.setEncoding('utf8');  
		res.on('data', function (chunk) {  
			//console.log('BODY: ' + chunk);
			callback(chunk);
		});  
	});
	  
	req.on('error', function (e) {  
		console.log('problem with request: ' + e.message);  
	});  
	  
	req.end(); 
};

exports.get2 = function (url,data,callback,safe) {
	var content = qs.stringify(data);
	var url = url + '?' + content;
	var proto = http;
	if(safe){
		proto = https;
	}
	var req = proto.get(url, function (res) {  
		//console.log('STATUS: ' + res.statusCode);  
		//console.log('HEADERS: ' + JSON.stringify(res.headers));  
		res.setEncoding('utf8');  
		res.on('data', function (chunk) {  
			//console.log('BODY: ' + chunk);
			var json = JSON.parse(chunk);
			callback(true,json);
		});  
	});
	  
	req.on('error', function (e) {  
		console.log('problem with request: ' + e.message);
		callback(false,e);
	});  
	  
	req.end(); 
};

exports.get = function (host,port,path,data,callback,safe) {
	var content = qs.stringify(data);  
	var options = {  
		hostname: host,  
		path: path + '?' + content,  
		method:'GET'
	};
	if(port){
		options.port = port;
	}
	var proto = http;
	if(safe){
		proto = https;
	}
	var req = proto.request(options, function (res) {  
		//console.log('STATUS: ' + res.statusCode);  
		//console.log('HEADERS: ' + JSON.stringify(res.headers));  
		res.setEncoding('utf8');  
		res.on('data', function (chunk) {  
			//console.log('BODY: ' + chunk);
			var json = JSON.parse(chunk);
			callback(true,json);
		});  
	});
	  
	req.on('error', function (e) {  
		console.log('problem with request: ' + e.message);
		callback(false,e);
	});  
	  
	req.end(); 
};

exports.getSync = function (url,data,safe,encoding) {
	var content = qs.stringify(data);
	var url = url + '?' + content;
	var proto = http;
	if(safe){
		proto = https;
	}

	if(!encoding){
		encoding = 'utf8';
	}
	var ret = {
		err:null,
		data:null,
	};

	var f = fibers.current;

	var req = proto.get(url, function (res) {  
		//console.log('STATUS: ' + res.statusCode);  
		//console.log('HEADERS: ' + JSON.stringify(res.headers));  
		res.setEncoding(encoding);
		var body = '';

		ret.type = res.headers["content-type"];
		res.on('data', function (chunk) {
			body += chunk;
			
		});

		res.on('end',function(){
			if(encoding != 'binary'){
				try {
						
					ret.data = JSON.parse(body);
					f.run();
				} catch(e) {
					console.log('JSON parse error: ' + e + ', url: ' + url);
				}
			}
			else{
				ret.data = body;
				f.run();
			}
		});
	});
	  
	req.on('error', function (e) {  
		console.log('problem with request: ' + e.message);
		ret.err = e;
		f.run();
	});
	  
	req.end();

	fibers.yield();
	return ret;
};

exports.send = function(res,errcode,errmsg,data){
	if(data == null){
		data = {};
	}
	data.errcode = errcode;
	data.errmsg = errmsg;
	var jsonstr = JSON.stringify(data);
	res.send(jsonstr);
};