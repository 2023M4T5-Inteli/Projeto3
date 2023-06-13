const express = require('express'); // Importando o módulo Express
const cors = require('cors'); // Importando o módulo CORS para habilitar o compartilhamento de recursos entre origens
const app = express(); // Criando uma instância do aplicativo Express
const path = require("path"); // Importando o módulo path para trabalhar com caminhos de arquivo

app.use(express.json()); // Utilizando o middleware do Express para analisar o corpo das solicitações como JSON
app.use(cors()); // Utilizando o middleware do CORS para permitir solicitações de várias origens

app.use((req, res, next) => {
    res.setHeader("Acess-Control-Allow-Origin", "*"); // Configurando o cabeçalho "Access-Control-Allow-Origin" para permitir todas as origens
    next();
});

// Importando as rotas relacionadas as tabelas do banco de dados ( USER, FUNCIONARIOS, HISTORICO, DISPOSITIVOS )
const usersRoutes = require('./routes/user.js'); 
const funcRoutes = require('./routes/funcionarios.js');
const histRoutes = require('./routes/historico.js'); 
const dispoRoutes = require('./routes/dispositivos.js'); 

app.use('/user', usersRoutes); // Registrando as rotas dos usuários com o prefixo "/user" no link
app.use('/func', funcRoutes); // Registrando as rotas dos funcionários com o prefixo "/func" no link
app.use('/hist', histRoutes); // Registrando as rotas do histórico com o prefixo "/hist" no link
app.use('/dispo', dispoRoutes); // Registrando as rotas dos dispositivos com o prefixo "/dispo" no link

app.listen(3000, () => console.log('Listening at port 3000')); // Iniciando o servidor na porta 3000 
