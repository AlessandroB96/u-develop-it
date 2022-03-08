const mysql = require('mysql2');

//connect to database 
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Altin1526!/',
        database: 'election'
    },
);

module.exports = db;