//connecting to mysql database 
const mysql = require('mysql2');

const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

//express middleware 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`server now running on http://localhost:${PORT}`);
});

// app.get('/', (req, res) => {
//     res.json({
//         message: 'Hello World'
//     });
// });

//connect to database 
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Altin1526!/',
        database: 'election'
    },
    console.log('connected to the election database')
);

// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// });


//CREATE QUERY FOR READ OPERATION 
//GET a single candidate 
db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
    if (err) {
    console.log(err);
    }
    console.log(row);
});

//CREATE QUERY FOR DELETE OPERATION 
//Delete a candidate 
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {  //question mark represents a 'prepared statement'. The question mark is a placeholder so when you make a sql statement it can take different values. The '1' is just a hardcoded value for now. If you want to add additional paramenters, make an array
//     if (err) {
//     console.log(err);
//     }
//     console.log(result);
// });

//CREATE QUERY FOR CREATE OPERATION 
//Create a candidate 

const sql = `INSERT INTO candidates (id,first_name,last_name,industry_connected)
                VALUES (?,?,?,?)`;

const params = [1,'Ronald','Firbank',1];

db.query(sql, params, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});

// Default response for any other request (Not Found) (RANDOM API ENDPOINT THAT DOESN'T EXIST)
app.use((req, res) => {
    res.status(404).end();
});
