const mysql = require('mysql2');

//const connection = mysql.createConnection({
 //   host: 'localhost',
 //   user: 'root',
 //   database: 'clubes'
// });
const connection = mysql.createPool({
    host: 'actividadescomplementarias-tecomatlan.com',
    user: 'activid3_root',
    database: 'activid3_clubes',
    password:"Dmrw&CB.}e3V"
});

module.exports = connection;