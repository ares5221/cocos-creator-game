"use strict";
var log4js = require('../lib/log4js');
// log4js.configure({
//   "appenders": [
//     { "type": "stderr", layout: { type: "messagePassThrough" } }
//   ]
// });
var logger = log4js.getLogger();
// log every 30ms
var tid = setInterval(function () {
  logger.debug();
  // console.log('');
}, 30);

// stop after 30s
setTimeout(function() {
  clearInterval(tid);
}, 30000);
