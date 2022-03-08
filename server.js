const inputCheck = require('./utils/inputCheck');

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


//GET all candidates

app.get('/api/candidates', (req, res) => {
  const sql = `SELECT candidates.*, parties.name
               AS party_name
               FROM candidates
               LEFT JOIN parties
               ON candidates.party_id = parties.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
    }
    res.json({
        message: 'success',
        data: rows
    });
});
});


//CREATE QUERY FOR READ OPERATION 
//GET a single candidate 
app.get('/api/candidate/:id', (req, res) => {

    const sql = `SELECT candidates.*, parties.name
                 AS party_name
                 FROM candidates
                 LEFT JOIN parties
                 ON candidates.party_id = parties.id
                 WHERE candidates.id = ?`;   //join allows for where clause, but it must come at the end of statement

    const params = [req.params.id];

    db.query(sql,params, (err, row) => {
        if (err) {
        res.status(400).json({error: err.message});
        return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// CREATE QUERY FOR DELETE OPERATION 
// Delete a candidate 
app.delete('/api/candidate/:id', (req,res) => {

    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {  //question mark represents a 'prepared statement'. The question mark is a placeholder so when you make a sql statement it can take different values. The '1' is just a hardcoded value for now. If you want to add additional paramenters, make an array
        if (err) {
        res.statusMessage(400).json({ error: res.message});
        } else if (!result.affectedRows) {
        res.json({
            message: 'Candidate Not Found'
        });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
}); 

//create a candidate 

app.post('/api/candidate', ({body}, res) => {

    const errors = inputCheck(body, 'first_name','last_name','industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
                    VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
    if (err) {
        res.status(400).json({ error: err.message });
        return;
    }
    res.json({
        message: 'success',
        data: body
    });
});
});

app.get('/api/parties', (req,res) => {
    const sql = `SELECT * FROM parties`;

    db.query(sql, (err,rows) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

app.get('/api/party/:id', (req,res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err,row) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

app.delete('/api/party/:id', (req,res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err,result) => {
        if (err) {
            res.status(400).json({ error: res.message });
            //checks if anything was deleted 
        } else if (!result.affectedRows) {
            res,json({
                message: 'Party not found'
            });
        } else {
            res.json({
               message: 'deleted',
               changes: result.affectedRows,
               id: req.params.id 
            });
        }
    });
});

//update a candidates party 

app.put('/api/candidate/:id', (req,res) => {


    //this error check will force any PUT request to /api/candidates/:id to include party_id property 
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
        res.status(400).json({ error: errors});
        return;
    }

    const sql = `UPDATE candidates SET party_id = ?
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];

    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message});
            //check if a record was found 
        } else if (!result.affectedRows) {
            res.json({ 
                message: 'Candidate Not Found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

// CREATE QUERY FOR CREATE OPERATION 
// Create a candidate 

// const sql = `INSERT INTO candidates (id,first_name,last_name,industry_connected)
//                 VALUES (?,?,?,?)`;

// const params = [1,'Ronald','Firbank',1];

// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// Default response for any other request (Not Found) (RANDOM API ENDPOINT THAT DOESN'T EXIST)
app.use((req, res) => {
    res.status(404).end();
});
