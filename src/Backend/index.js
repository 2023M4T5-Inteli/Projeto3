const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader("Acess-Control-Allow-Origin", "*");
    next();
});

const usersRoutes = require('./routes/user.js');

app.use('/', usersRoutes);

app.listen(3302, () => console.log('Listening at port'));