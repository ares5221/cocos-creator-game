var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'nodejs',
    port: 3306
});
conn.connect();
conn.query('SELECT * FROM account', function(err, rows, fields) {
    if (err) throw err;
    console.log('The solution is: ', rows[0].account);
});
conn.end();