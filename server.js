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

// Default response for any other request (Not Found) (RANDOM API ENDPOINT THAT DOESN'T EXIST)
app.use((req, res) => {
    res.status(404).end();
});