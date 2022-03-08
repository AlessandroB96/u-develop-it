const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes'); //dont need to specify index.js in directory since nodejs will look for an index file by default

const PORT = process.env.PORT || 3001;
const app = express();

//express middleware 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Use apiRoutes
app.use('/api', apiRoutes);


// Default response for any other request (Not Found) (RANDOM API ENDPOINT THAT DOESN'T EXIST)
app.use((req, res) => {
    res.status(404).end();
});

//Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');

    app.listen(PORT, () => {
        console.log(`server now running on http://localhost:${PORT}`);
    });
});