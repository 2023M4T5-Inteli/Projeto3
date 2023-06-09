const express = require('express');
const cors = require('cors');
const app = express();
const path = require("path");

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader("Acess-Control-Allow-Origin", "*");
    next();
});

const usersRoutes = require('./routes/user.js');
const funcRoutes = require('./routes/funcionarios.js');
const histRoutes = require('./routes/historico.js');
const dispoRoutes = require('./routes/dispositivos.js');

app.use('/user', usersRoutes);
app.use('/func', funcRoutes);
app.use('/hist', histRoutes);
app.use('/dispo', dispoRoutes);

app.listen(3000, () => console.log('Listening at port 3000'));